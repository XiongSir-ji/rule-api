#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Assemble the localized MAKNAA statutory policy pages.

Body copy for each language lives in ``legal-i18n/<lang>/<Slug>.html`` as an
HTML fragment (everything inside ``<main>`` from the ``<h1>`` through the last
section). Chrome strings (switcher, back link, footer, note, metadata labels)
live in ``legal-i18n/ui.json``. Both are rendered through ``legal_shell.py``,
the same shell ``gen_legal_pages.py`` uses for the English pages, producing
``web/public/legal/<Slug>.<lang>.html``.

The English pages remain the canonical source generated from the .docx files;
when the source documents change, regenerate them with ``gen_legal_pages.py``
and then update the matching fragments here before re-running this script.
"""

import argparse
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from legal_shell import file_name, render_page  # noqa: E402

SLUGS = ("Data-Policy", "Privacy-Policy", "Terms-of-Service")
UI_PATH = os.path.join(HERE, "legal-i18n", "ui.json")
OUT_DIR = os.path.normpath(os.path.join(HERE, "..", "public", "legal"))


def load_ui():
    with open(UI_PATH, encoding="utf-8") as handle:
        return json.load(handle)


def render_language(lang, strings, out_dir):
    bodies_dir = os.path.join(HERE, "legal-i18n", lang)
    written = []
    for slug in SLUGS:
        fragment = os.path.join(bodies_dir, slug + ".html")
        if not os.path.isfile(fragment):
            raise SystemExit("error: missing fragment: %s" % fragment)
        with open(fragment, encoding="utf-8") as handle:
            body = handle.read().strip()
        page = render_page(
            slug=slug,
            lang=lang,
            title=strings["titles"][slug],
            description=strings["descriptionTemplate"].format(
                title=strings["titles"][slug]
            ),
            body=body,
            labels={
                "back": strings["back"],
                "langLabel": strings["langLabel"],
                "otherPolicies": strings["otherPolicies"],
                "rights": strings["rights"],
                "powered": strings["powered"],
                "note": strings["note"],
            },
            nav_titles=strings["titles"],
        )
        out = os.path.join(out_dir, file_name(slug, lang))
        with open(out, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(page)
        written.append(out)
    return written


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Assemble the localized MAKNAA statutory policy pages."
    )
    parser.add_argument(
        "--out",
        default=OUT_DIR,
        help="output directory (default: web/public/legal)",
    )
    parser.add_argument(
        "--lang",
        action="append",
        metavar="CODE",
        help="limit output to one or more languages (repeatable)",
    )
    args = parser.parse_args(argv)

    ui = load_ui()
    languages = args.lang or [code for code in ui if code != "en"]
    unknown = [code for code in languages if code not in ui]
    if unknown:
        raise SystemExit("error: unknown language(s): %s" % ", ".join(unknown))

    os.makedirs(args.out, exist_ok=True)
    for lang in languages:
        for path in render_language(lang, ui[lang], args.out):
            print("wrote %s" % path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
