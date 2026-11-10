#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Shared HTML shell for the MAKNAA statutory policy pages.

Both the English generator (``gen_legal_pages.py``) and the localized page
builder (``build_legal_i18n.py``) render through this module so every language
gets the same markup, stylesheet and language switcher.

Localized pages live next to the English ones as ``<Slug>.<lang>.html``. Each
page carries ``data-slug``/``data-lang`` on ``<html>``; ``/legal/legal.js``
redirects to the visitor's preferred language on first paint and persists the
choice in the same ``i18nextLng`` localStorage key the console uses.
"""

import html

# (code, switcher label, HTML lang attribute)
LANGUAGES = [
    ("en", "EN", "en"),
    ("zhCN", "\u7b80\u4f53", "zh-CN"),
    ("zhTW", "\u7e41\u9ad4", "zh-TW"),
    ("fr", "FR", "fr"),
    ("ja", "\u65e5\u672c\u8a9e", "ja"),
    ("ru", "RU", "ru"),
    ("vi", "VI", "vi"),
]

PAGE_TEMPLATE = """<!doctype html>
<html lang="{html_lang}" data-slug="{slug}" data-lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="index,follow">
<title>{title} | MAKNAA</title>
<meta name="description" content="{description}">
<link rel="stylesheet" href="/legal/legal.css">
<script src="/legal/legal.js"></script>
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
    <div class="hdr-right">
      <nav class="langs" aria-label="{lang_label}">
{lang_switch}
      </nav>
      <a class="back" href="/">&larr; {back}</a>
    </div>
  </div>
</header>
<main>
{body}
<nav class="nav-other" aria-label="{other_label}">{nav}</nav>
</main>
<footer class="ftr">
  <p>{rights}</p>
  <p>{powered}</p>
</footer>
</body>
</html>
"""


def file_name(slug, lang):
    return slug + ("" if lang == "en" else "." + lang) + ".html"


def page_href(slug, lang):
    return "/legal/%s?lang=%s" % (file_name(slug, lang), lang)


def _lang_switch(slug, current_lang, lang_label):
    lines = []
    for code, label, _ in LANGUAGES:
        current = ' aria-current="true"' if code == current_lang else ""
        lines.append(
            '        <a href="%s" data-lang="%s"%s>%s</a>'
            % (page_href(slug, code), code, current, html.escape(label))
        )
    return "\n".join(lines)


def render_page(slug, lang, title, description, body, labels, nav_titles):
    """Render one policy page.

    ``labels`` supplies the chrome copy (back, langLabel, otherPolicies,
    rights, powered and an optional note inserted under the metadata block).
    ``nav_titles`` maps every policy slug to its localized title.
    """
    note = labels.get("note")
    if note:
        body = body.replace(
            '<div class="meta-sep"></div>',
            '<div class="meta-sep"></div>\n<p class="lang-note">%s</p>' % note,
            1,
        )

    nav = "\n".join(
        '<a href="%s"%s>%s</a>'
        % (
            page_href(other, lang),
            ' aria-current="page"' if other == slug else "",
            html.escape(nav_titles[other]),
        )
        for other in nav_titles
    )

    html_lang = dict((code, hl) for code, _, hl in LANGUAGES)[lang]
    return PAGE_TEMPLATE.format(
        html_lang=html_lang,
        slug=html.escape(slug),
        lang=lang,
        title=html.escape(title),
        description=html.escape(description, quote=True),
        lang_label=html.escape(labels["langLabel"], quote=True),
        lang_switch=_lang_switch(slug, lang, labels["langLabel"]),
        back=html.escape(labels["back"]),
        body=body,
        other_label=html.escape(labels["otherPolicies"], quote=True),
        nav=nav,
        rights=labels["rights"],
        powered=labels["powered"],
    )
