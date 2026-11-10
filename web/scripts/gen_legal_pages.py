#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate the MAKNAA statutory policy pages from their source .docx files.

Emits self-contained static HTML into `web/public/legal/`, styled to match the
MAKNAA landing page. Files under `web/public/` are copied verbatim into
`web/dist/` by the frontend build and then served directly by the Go backend
through the embedded filesystem, so these pages need no React route and no
backend handler. The landing footer links them from `LEGAL_PAGES` in
`web/src/features/home/components/maknaa/maknaa-footer.tsx`.

Standard library only (a .docx is a zip of XML), so no dependencies to install.

Usage
-----
Regenerate every page, reading sources from a directory and writing to the
repository default:

    python web/scripts/gen_legal_pages.py --src-dir F:\\policy-docs

Point at individual files and/or an explicit output directory:

    python web/scripts/gen_legal_pages.py \\
        --src F:\\Data-Policy_EN_20261105.docx \\
        --src F:\\Privacy-Policy_EN_20261105.docx \\
        --out web/public/legal

Source files must be named `<Slug>_*.docx` (for example
`Data-Policy_EN_20261105.docx`), where `<Slug>` is one of Data-Policy,
Privacy-Policy or Terms-of-Service; the slug becomes the output filename.

Track changes are resolved as "accept all revisions": inserted text is kept and
deleted text is dropped. The source documents carry revisions that replace the
operator name and company registration placeholders, so dropping this handling
silently loses those fields.

After regenerating, diff the output against the committed pages before
deploying, and confirm the deleted placeholders did not leak through.
"""

import argparse
import html
import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"

# Slug -> page title. Order also determines the cross-link navigation order.
TITLES = {
    "Data-Policy": "Data Policy",
    "Privacy-Policy": "Privacy Policy",
    "Terms-of-Service": "Terms of Service",
}

# Default output, resolved relative to this file so it works from any CWD.
DEFAULT_OUT_DIR = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "legal")
)

HEADING_STYLES = {"1", "2", "3", "4", "Heading1", "Heading2", "Heading3", "Heading4"}
BULLET_CHARS = ("\u2022", "\u25cf", "\u25aa", "\u2013", "\u2014", "-")


def run_props_bold(r):
    rpr = r.find(W + "rPr")
    if rpr is None:
        return False
    b = rpr.find(W + "b")
    if b is None:
        return False
    val = b.get(W + "val")
    return val not in ("0", "false", "none")


def run_size(r):
    rpr = r.find(W + "rPr")
    if rpr is None:
        return None
    sz = rpr.find(W + "sz")
    if sz is None:
        return None
    try:
        return int(sz.get(W + "val"))
    except (TypeError, ValueError):
        return None


def para_props(p):
    ppr = p.find(W + "pPr")
    style = None
    numbered = False
    ilvl = 0
    ind_left = None
    if ppr is not None:
        ps = ppr.find(W + "pStyle")
        if ps is not None:
            style = ps.get(W + "val")
        if ppr.find(W + "numPr") is not None:
            numbered = True
            il = ppr.find(W + "numPr/" + W + "ilvl")
            if il is not None:
                try:
                    ilvl = int(il.get(W + "val"))
                except (TypeError, ValueError):
                    ilvl = 0
        ind = ppr.find(W + "ind")
        if ind is not None:
            raw = ind.get(W + "left") or ind.get(W + "start")
            try:
                ind_left = int(raw) if raw else None
            except (TypeError, ValueError):
                ind_left = None
    return style, numbered, ilvl, ind_left


def run_text(r):
    """Concatenate the visible text of one w:r."""
    text = ""
    for child in r:
        if child.tag == W + "t":
            text += child.text or ""
        elif child.tag == W + "tab":
            text += "\t"
        elif child.tag == W + "br":
            text += "\n"
    return text


def para_info(p, rels):
    """Return dict with text, size, bold-runs, style, numbered, indent.

    Children are walked in document order so the emitted HTML keeps the source
    word order. Track-changes markup is resolved as "accept all revisions":
    `w:ins` content is kept and `w:del` content (which is stored in `w:delText`,
    never `w:t`) is dropped. Runs nested inside `w:hyperlink` are collected with
    their link target instead of being appended after the plain runs.
    """
    style, numbered, ilvl, ind_left = para_props(p)
    runs = []
    sizes = []

    def collect_run(r, link):
        sz = run_size(r)
        if sz:
            sizes.append(sz)
        text = run_text(r)
        if text or link:
            runs.append({"t": text, "b": run_props_bold(r), "link": link})

    for child in p:
        tag = child.tag
        if tag == W + "r":
            collect_run(child, None)
        elif tag == W + "ins":
            # Accepted insertion: render its runs as normal content.
            for r in child.findall(W + "r"):
                collect_run(r, None)
        elif tag == W + "del":
            # Accepted deletion: intentionally skipped. Its text lives in
            # w:delText, which run_text() never reads, so nothing leaks through.
            continue
        elif tag == W + "hyperlink":
            rid = child.get(R + "id")
            target = rels.get(rid) if rid else None
            for r in child.findall(W + "r"):
                collect_run(r, target)

    full = "".join(r["t"] for r in runs)
    size = max(sizes) if sizes else None
    return {
        "text": full,
        "runs": runs,
        "size": size,
        "style": style,
        "numbered": numbered,
        "ilvl": ilvl,
        "ind": ind_left,
    }


def load_rels(z):
    rels = {}
    try:
        data = z.read("word/_rels/document.xml.rels")
    except KeyError:
        return rels
    root = ET.fromstring(data)
    for rel in root:
        rid = rel.get("Id")
        target = rel.get("Target")
        mode = rel.get("TargetMode")
        if rid and target and mode == "External":
            rels[rid] = target
    return rels


def blocks_from_docx(path):
    z = zipfile.ZipFile(path)
    rels = load_rels(z)
    xml = z.read("word/document.xml")
    root = ET.fromstring(xml)
    body = root.find(W + "body")
    blocks = []
    for child in body:
        if child.tag == W + "p":
            info = para_info(child, rels)
            if info["text"].strip():
                blocks.append(("p", info))
        elif child.tag == W + "tbl":
            rows = []
            for tr in child.findall(W + "tr"):
                cells = []
                for tc in tr.findall(W + "tc"):
                    cell_text = []
                    for p in tc.findall(W + "p"):
                        info = para_info(p, rels)
                        if info["text"].strip():
                            cell_text.append(info)
                    cells.append(cell_text)
                if cells:
                    rows.append(cells)
            if rows:
                blocks.append(("tbl", rows))
    return blocks


def inline_html(runs):
    """Render runs to escaped HTML, preserving bold and links."""
    out = []
    for r in runs:
        text = r["t"]
        if not text:
            continue
        esc = html.escape(text)
        esc = esc.replace("\t", " &nbsp;")
        if r.get("link"):
            href = html.escape(r["link"], quote=True)
            out.append(
                '<a href="%s" target="_blank" rel="noopener noreferrer">%s</a>'
                % (href, esc)
            )
        elif r["b"]:
            out.append("<strong>%s</strong>" % esc)
        else:
            out.append(esc)
    return "".join(out).strip()


def is_bullet(info):
    if info["numbered"]:
        return True
    t = info["text"].lstrip()
    return t.startswith(BULLET_CHARS)


def strip_bullet(text):
    t = text.lstrip()
    for ch in BULLET_CHARS:
        if t.startswith(ch):
            return t[len(ch) :].lstrip()
    return t


def is_title_block(kind, payload):
    """True only for the document title (rendered as <h1>)."""
    return kind == "p" and (payload.get("size") or 0) >= 48


def is_heading_block(kind, payload):
    """True for a section heading, deliberately excluding the document title.

    The exclusion matters: the metadata rows sit between the title and the first
    section heading, and `body_html` locates the end of that metadata block by
    finding the first heading. Counting the title would put the boundary at
    index 0 and leave every metadata row unstyled.
    """
    if kind != "p" or is_title_block(kind, payload):
        return False
    size = payload.get("size") or 0
    return payload.get("style") in HEADING_STYLES or 24 <= size <= 32


def body_html(blocks):
    out = []
    in_list = False
    list_indent = 0

    # Blocks before the first heading are the document's metadata block.
    # Computed once instead of searching per paragraph, which both mis-located
    # repeated paragraphs and made the loop quadratic.
    first_heading_index = len(blocks)
    for i, (kind, payload) in enumerate(blocks):
        if is_heading_block(kind, payload):
            first_heading_index = i
            break

    def close_list():
        nonlocal in_list, list_indent
        if in_list:
            out.append("</ul>")
            in_list = False
            list_indent = 0

    for block_index, (kind, payload) in enumerate(blocks):
        if kind == "tbl":
            close_list()
            out.append('<div class="tbl-wrap"><table>')
            rows = payload
            for i, row in enumerate(rows):
                tag = "th" if i == 0 else "td"
                out.append("<tr>")
                for cell in row:
                    inner = "<br>".join(inline_html(p["runs"]) for p in cell)
                    out.append("<%s>%s</%s>" % (tag, inner, tag))
                out.append("</tr>")
            out.append("</table></div>")
            continue

        info = payload
        style = info["style"]
        size = info["size"] or 0
        text = info["text"]

        # Document title (largest font, first block)
        if size >= 48:
            close_list()
            out.append("<h1>%s</h1>" % inline_html(info["runs"]))
            continue

        # Explicit heading style, or the section-heading size (27 half-points)
        if style in HEADING_STYLES or (24 <= size <= 32):
            close_list()
            out.append("<h2>%s</h2>" % inline_html(info["runs"]))
            continue

        # Metadata block (size 20 half-points) before the first heading
        if size and size <= 22 and block_index < first_heading_index:
            close_list()
            label, _, value = text.partition("\t")
            if not value:
                m = re.match(r"^([A-Za-z][A-Za-z .\-/]*?)\s{2,}(.+)$", text)
                if m:
                    label, value = m.group(1), m.group(2)
                else:
                    m2 = re.match(r"^([A-Za-z][A-Za-z .\-/]*?)\s+(.+)$", text)
                    if m2:
                        label, value = m2.group(1), m2.group(2)
                    else:
                        label, value = text, ""
            out.append(
                '<p class="meta"><span class="meta-k">%s</span>'
                '<span class="meta-v">%s</span></p>'
                % (html.escape(label.strip()), html.escape(value.strip()))
            )
            continue

        if is_bullet(info):
            if not in_list:
                out.append("<ul>")
                in_list = True
                list_indent = info["ilvl"]
            elif info["ilvl"] > list_indent:
                out.append("</ul><ul class='sub'>")
                list_indent = info["ilvl"]
            bullet_runs = [dict(r) for r in info["runs"]]
            if bullet_runs:
                bullet_runs[0]["t"] = strip_bullet(bullet_runs[0]["t"])
            out.append("<li>%s</li>" % inline_html(bullet_runs))
            continue

        close_list()
        out.append("<p>%s</p>" % inline_html(info["runs"]))

    close_list()
    return "\n".join(out)


CSS = """
:root{
  --bg:#0a0a0f; --bg2:#12121a; --card:rgba(255,255,255,.03);
  --cyan:#00f0ff; --blue:#3b82f6; --purple:#8b5cf6;
  --t1:#f1f5f9; --t2:#94a3b8; --t3:#64748b;
  --border:rgba(255,255,255,.10);
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{
  margin:0; background:var(--bg); color:var(--t1);
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,
    "Helvetica Neue","Noto Sans","PingFang SC","Microsoft YaHei",Arial,sans-serif;
  font-size:16px; line-height:1.75;
}
a{color:var(--cyan); text-decoration:none}
a:hover{text-decoration:underline}
.hdr{
  position:sticky; top:0; z-index:10;
  background:rgba(10,10,15,.85); backdrop-filter:blur(20px);
  border-bottom:1px solid rgba(255,255,255,.05);
}
.hdr-in{
  max-width:60rem; margin:0 auto; padding:.875rem 1.5rem;
  display:flex; align-items:center; justify-content:space-between; gap:1rem;
}
.brand{display:flex; align-items:center; gap:.5rem; color:var(--t1); font-weight:600}
.brand img{width:32px; height:32px; border-radius:8px; object-fit:contain}
.back{
  color:var(--t2); font-size:.875rem; white-space:nowrap;
  border:1px solid var(--border); border-radius:9999px; padding:.375rem .875rem;
}
.back:hover{color:var(--cyan); border-color:rgba(0,240,255,.3); text-decoration:none}
main{max-width:60rem; margin:0 auto; padding:2.5rem 1.5rem 4rem}
h1{
  font-size:clamp(1.875rem,4vw,2.5rem); line-height:1.2; font-weight:700;
  margin:0 0 1.25rem; letter-spacing:-.02em;
  background:linear-gradient(90deg,var(--cyan),var(--blue),var(--purple));
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
h2{
  font-size:1.25rem; font-weight:600; margin:2.25rem 0 .75rem;
  padding-left:.75rem; border-left:3px solid var(--cyan); line-height:1.4;
}
p{margin:0 0 1rem; color:var(--t2)}
strong{color:var(--t1); font-weight:600}
p.meta{margin:0; padding:.3rem 0; color:var(--t2); font-size:.9375rem}
p.meta .meta-k{
  display:inline-block; min-width:13rem; color:var(--t3);
  font-size:.8125rem; text-transform:uppercase; letter-spacing:.05em;
}
p.meta .meta-v{color:var(--t1)}
.meta-sep{height:1px; background:var(--border); margin:1.25rem 0 1.75rem}
ul{margin:0 0 1rem; padding-left:1.375rem; color:var(--t2)}
ul.sub{margin:.5rem 0}
li{margin-bottom:.5rem}
li::marker{color:var(--cyan)}
.tbl-wrap{overflow-x:auto; margin:0 0 1.25rem; border:1px solid var(--border); border-radius:.75rem}
table{border-collapse:collapse; width:100%; font-size:.9375rem}
th,td{padding:.625rem .875rem; text-align:left; border-bottom:1px solid var(--border); color:var(--t2); vertical-align:top}
th{background:rgba(0,240,255,.06); color:var(--t1); font-weight:600; white-space:nowrap}
tr:last-child td{border-bottom:none}
.ftr{
  border-top:1px solid rgba(255,255,255,.05); background:var(--bg2);
  padding:1.5rem; text-align:center; color:var(--t3); font-size:.8125rem;
}
.ftr a{color:var(--t2)}
.nav-other{
  display:flex; flex-wrap:wrap; gap:.5rem; margin-top:2.5rem;
  padding-top:1.5rem; border-top:1px solid var(--border);
}
.nav-other a{
  font-size:.875rem; color:var(--t2); border:1px solid var(--border);
  border-radius:9999px; padding:.375rem .875rem;
}
.nav-other a:hover{color:var(--cyan); border-color:rgba(0,240,255,.3); text-decoration:none}
.nav-other a[aria-current="page"]{color:var(--bg); background:var(--cyan); border-color:var(--cyan); font-weight:600}
@media (max-width:640px){
  .hdr-in,main{padding-left:1rem; padding-right:1rem}
  p.meta .meta-k{display:block; min-width:0; margin-bottom:.125rem}
}
@media (prefers-reduced-motion:reduce){*{animation:none!important; transition:none!important}}
@media print{
  body{background:#fff; color:#000}
  .hdr,.ftr,.nav-other{display:none}
  p,li,td{color:#000}
  h1{color:#000; background:none; -webkit-background-clip:initial}
  h2{border-left-color:#000}
}
"""


TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="index,follow">
<title>{title} | MAKNAA</title>
<meta name="description" content="{title} of Maknaa Group Sdn. Bhd.">
<style>{css}</style>
</head>
<body>
<header class="hdr">
  <div class="hdr-in">
    <a class="brand" href="/">
      <img src="/maknaa/header-logo-32.png"
           srcset="/maknaa/header-logo-32.png 32w, /maknaa/header-logo-48.png 48w, /maknaa/header-logo-64.png 64w"
           sizes="32px" alt="MAKNAA" width="32" height="32">
      <span>MAKNAA</span>
    </a>
    <a class="back" href="/">&larr; Back to home</a>
  </div>
</header>
<main>
{body}
<nav class="nav-other" aria-label="Other policies">{nav}</nav>
</main>
<footer class="ftr">
  <p>&copy; 2026 MAKNAA GROUP SDN. BHD. All Rights Reserved.</p>
  <p>Powered by <a href="https://github.com/QuantumNous/new-api" target="_blank" rel="noopener noreferrer">MAKNAA</a>. All rights reserved. Designed and developed by the project contributors.</p>
</footer>
</body>
</html>
"""


def slug_from_path(path):
    """Derive a page slug from a source filename like Data-Policy_EN_20261105.docx."""
    base = os.path.basename(path)
    stem = base[: -len(".docx")] if base.lower().endswith(".docx") else base
    for slug in TITLES:
        if stem == slug or stem.startswith(slug + "_") or stem.startswith(slug + "."):
            return slug
    return None


def resolve_sources(src_files, src_dir):
    """Build an ordered {slug: path} map from explicit files and/or a directory."""
    found = {}

    for path in src_files or []:
        if not os.path.isfile(path):
            raise SystemExit("error: source file not found: %s" % path)
        slug = slug_from_path(path)
        if slug is None:
            raise SystemExit(
                "error: cannot derive a known slug from %r; expected one of %s"
                % (os.path.basename(path), ", ".join(TITLES))
            )
        found[slug] = path

    if src_dir:
        if not os.path.isdir(src_dir):
            raise SystemExit("error: source directory not found: %s" % src_dir)
        for name in sorted(os.listdir(src_dir)):
            if not name.lower().endswith(".docx") or name.startswith("~$"):
                continue
            slug = slug_from_path(name)
            if slug and slug not in found:
                found[slug] = os.path.join(src_dir, name)

    return {slug: found[slug] for slug in TITLES if slug in found}


def render_page(slug, src, slugs):
    blocks = blocks_from_docx(src)
    inner = body_html(blocks)
    # Insert a separator after the leading metadata run (before first h2).
    idx = inner.find("<h2>")
    if idx > 0:
        inner = inner[:idx] + '<div class="meta-sep"></div>\n' + inner[idx:]
    nav = "\n".join(
        '<a href="/legal/%s.html"%s>%s</a>'
        % (s, ' aria-current="page"' if s == slug else "", html.escape(TITLES[s]))
        for s in slugs
    )
    page = TEMPLATE.format(
        title=html.escape(TITLES[slug]), css=CSS, body=inner, nav=nav
    )
    return page, inner, len(blocks)


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Generate the MAKNAA statutory policy pages from .docx sources."
    )
    parser.add_argument(
        "--src",
        action="append",
        metavar="DOCX",
        help="explicit source .docx path (repeatable)",
    )
    parser.add_argument(
        "--src-dir",
        metavar="DIR",
        help="directory to scan for <Slug>_*.docx sources",
    )
    parser.add_argument(
        "--out",
        default=DEFAULT_OUT_DIR,
        help="output directory (default: web/public/legal)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="report what would be written without touching the filesystem",
    )
    args = parser.parse_args(argv)

    if not args.src and not args.src_dir:
        parser.error("provide --src and/or --src-dir")

    sources = resolve_sources(args.src, args.src_dir)
    if not sources:
        raise SystemExit("error: no recognised policy sources found")

    missing = [slug for slug in TITLES if slug not in sources]
    if missing:
        print(
            "warning: no source for %s; those pages are left untouched"
            % ", ".join(missing),
            file=sys.stderr,
        )

    slugs = [slug for slug in TITLES if slug in sources]
    if not args.dry_run:
        os.makedirs(args.out, exist_ok=True)

    for slug in slugs:
        src = sources[slug]
        page, inner, block_count = render_page(slug, src, slugs)
        out = os.path.join(args.out, slug + ".html")
        if not args.dry_run:
            with open(out, "w", encoding="utf-8", newline="\n") as f:
                f.write(page)
        print(
            "%-20s %s %s  (blocks=%d h2=%d li=%d tables=%d bytes=%d)"
            % (
                slug,
                "->" if not args.dry_run else "would write",
                out,
                block_count,
                inner.count("<h2>"),
                inner.count("<li>"),
                inner.count("<table>"),
                len(page.encode("utf-8")),
            )
        )

    return 0


if __name__ == "__main__":
    sys.exit(main())
