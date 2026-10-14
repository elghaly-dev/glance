#!/usr/bin/env python3
"""House-rule checks for glance.elghaly.dev HTML (stdlib only)."""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

FOOTER_URLS = [
    "https://chatting.elghaly.dev/",
]

FORBIDDEN_WORDS = re.compile(r"\b(live|profit|guarantee|audit|launched)\b", re.I)
FORBIDDEN = [
    (re.compile(r"qq\.com", re.I), "qq.com"),
    (re.compile(r"telegram", re.I), "Telegram"),
    (re.compile(r"t\.me/", re.I), "t.me link"),
    (re.compile(r"facebook\.com", re.I), "Facebook"),
]

SKIP = {".git", ".github", "node_modules", "lib", "scripts"}


def visible_html(raw: str) -> str:
    raw = re.sub(r"<!--.*?-->", "", raw, flags=re.S)
    raw = re.sub(r"<script[\s\S]*?</script>", "", raw, flags=re.I)
    raw = re.sub(r"<style[\s\S]*?</style>", "", raw, flags=re.I)
    raw = re.sub(r"<[^>]+>", " ", raw)
    return re.sub(r"\s+", " ", raw)


def main():
    errors = []
    pages = [
        p
        for p in sorted(ROOT.rglob("*.html"))
        if not any(part in SKIP for part in p.parts)
    ]
    index = ROOT / "index.html"
    if index.exists():
        text = index.read_text(encoding="utf-8")
        for url in FOOTER_URLS:
            if url.rstrip("/") not in text and url not in text:
                errors.append("index.html missing footer URL %s" % url)
        if "elghaly, LLC" not in text:
            errors.append("index.html missing elghaly, LLC")

    proof = ROOT / "proof" / "index.html"
    if proof.exists():
        if "elghaly, LLC" not in proof.read_text(encoding="utf-8"):
            errors.append("proof/index.html missing elghaly, LLC")
        if "Telegram" in proof.read_text(encoding="utf-8"):
            errors.append("proof/index.html still mentions Telegram")

    for path in pages:
        rel = path.relative_to(ROOT)
        vis = visible_html(path.read_text(encoding="utf-8"))
        for pat, label in FORBIDDEN:
            if pat.search(vis):
                errors.append("%s: forbidden %s" % (rel, label))
        for match in FORBIDDEN_WORDS.finditer(vis):
            errors.append("%s: forbidden word %r" % (rel, match.group(0)))

    for msg in errors:
        print("FAIL", msg)
    if errors:
        sys.exit(1)
    print("ok: %d HTML file(s)" % len(pages))


if __name__ == "__main__":
    main()
