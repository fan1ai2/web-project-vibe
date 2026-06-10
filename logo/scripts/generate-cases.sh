#!/usr/bin/env bash
# Generate content/cases/*.md from data/cases/brand-logos.yaml
set -euo pipefail

OUTPUT_DIR="content/cases"
mkdir -p "$OUTPUT_DIR"
# Remove only generated case files, preserve _index.md
for f in "$OUTPUT_DIR"/*.md; do
  [ -f "$f" ] && [ "$(basename "$f")" != "_index.md" ] && rm -f "$f"
done

python3 << 'PYEOF'
import yaml, os, datetime

with open("data/cases/brand-logos.yaml") as f:
    cases = yaml.safe_load(f)

os.makedirs("content/cases", exist_ok=True)
now = datetime.datetime.now().isoformat()

for i, c in enumerate(cases):
    slug = c["slug"]
    colors_str = str(c["colors"])
    md = f"""---
date: "{now}"
draft: false
slug: "{slug}"
brand: "{c['brand']}"
industries: ["{c['industry']}"]
styles: ["{c['style']}"]
colorschemes: ["{c['colorScheme']}"]
fontstyles: ["{c['fontStyle']}"]
layouttypes: ["{c['layoutType']}"]
industry: "{c['industry']}"
style: "{c['style']}"
colorScheme: "{c['colorScheme']}"
fontStyle: "{c['fontStyle']}"
layoutType: "{c['layoutType']}"
colors: {colors_str}
prompt: |
  {c['prompt'].strip()}
weight: {i}
---
{c['description']}
"""
    with open(f"content/cases/{slug}.md", "w") as f:
        f.write(md)

print(f"Generated {len(cases)} case content files")
PYEOF
