# Logo Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Hugo static site with a vanilla JS logo generator dashboard, 51 brand case seed data, and SEO-optimized static pages.

**Architecture:** Hugo generates 4 page types — homepage case wall, generator dashboard (JS-enhanced), case detail pages, and keyword taxonomy pages — all from YAML seed data and content files. Pure CSS with design tokens manages all styling. Vanilla JS (~400 lines) handles the dashboard state machine (filter selection → preview update → generate flow). Zero JS framework dependencies.

**Tech Stack:** Hugo (SSG), vanilla HTML/CSS/JS, YAML data files, Google Fonts (Playfair Display, Inter, Noto Serif SC, JetBrains Mono)

---

## File Structure

```
/root/web-project/logo/
├── hugo.toml
├── scripts/
│   └── generate-cases.sh
├── data/cases/
│   └── brand-logos.yaml          (exists — 51 brands)
├── layouts/
│   ├── _default/baseof.html
│   ├── index.html                (home: case wall)
│   ├── _default/single.html      (case detail)
│   ├── _default/list.html        (keyword taxonomy)
│   └── partials/
│       ├── head.html
│       ├── header.html
│       ├── footer.html
│       ├── case-card.html
│       ├── filter-panel.html
│       ├── preview-area.html
│       └── json-ld-case.html
├── static/
│   ├── css/style.css
│   └── js/generator.js
├── content/
│   ├── _index.md
│   ├── generator/_index.md
│   └── cases/*.md                (generated from YAML)
└── public/                       (build output)
```

---

### Task 1: Hugo project scaffold

**Files:**
- Create: `hugo.toml`
- Create: `archetypes/case.md`
- Create: `content/_index.md`
- Create: `content/generator/_index.md`
- Create: `content/cases/_index.md`

- [ ] **Step 1: Create hugo.toml**

```toml
baseURL = "https://logogen.example.com/"
languageCode = "zh-CN"
title = "LogoForge — AI 商标生成器"
theme = ""
enableRobotsTXT = true
enableEmoji = false

[params]
  description = "AI 驱动的商标 Logo 自动生成工具。选择行业、风格、配色、字体、构图，一键生成专属品牌标识。"
  ogImage = "/images/og-default.jpg"

[outputs]
  home = ["HTML", "RSS", "Sitemap"]
  section = ["HTML", "RSS"]
  taxonomy = ["HTML", "RSS"]
  term = ["HTML", "RSS"]

[privacy]
  [privacy.googleAnalytics]
    disable = true
  [privacy.youtube]
    privacyEnhanced = true

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
```

- [ ] **Step 2: Create archetypes/case.md**

```yaml
---
date: "{{ .Date }}"
draft: false
brand: ""
industry: ""
style: ""
colorScheme: ""
fontStyle: ""
layoutType: ""
colors: []
prompt: ""
---
```

- [ ] **Step 3: Create content/_index.md**

```yaml
---
title: "LogoForge"
description: "探索顶尖品牌的 Logo 设计灵感，选择风格关键词，用 AI 生成你的专属商标。"
---
```

- [ ] **Step 4: Create content/generator/_index.md**

```yaml
---
title: "生成器"
description: "选择关键词，生成你的品牌 Logo"
layout: "generator"
---
```

- [ ] **Step 5: Create content/cases/_index.md**

```yaml
---
title: "全部案例"
description: "50+ 知名品牌 Logo 设计案例，拆解设计元素，提供 AI 生成提示词。"
---
```

- [ ] **Step 6: Verify scaffold — Hugo build**

```bash
cd /root/web-project/logo && hugo --minify --destination public
```
Expected: builds successfully, generates `public/index.html` with basic content.

- [ ] **Step 7: Commit**

```bash
cd /root/web-project/logo && git add hugo.toml archetypes/ content/ && git commit -m "feat(logo): scaffold Hugo project with config and content structure

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 2: Design tokens CSS foundation

**Files:**
- Create: `static/css/style.css`

- [ ] **Step 1: Write CSS with design tokens, reset, and typography**

```css
/* === Design Tokens === */
:root {
  /* Colors */
  --color-bg:        #FAF8F5;
  --color-surface:   #FFFFFF;
  --color-text:      #1E1E1E;
  --color-text-dim:  #6B6560;
  --color-accent:    #D4532A;
  --color-accent-hv: #B8451E;
  --color-secondary: #2D5F7C;
  --color-success:   #3A6B5C;
  --color-border:    #E8E3DD;
  --color-canvas:    #1E1E1E;
  --color-canvas-grid: #2A2A2A;

  /* Typography */
  --font-display:   'Playfair Display', 'Noto Serif SC', Georgia, serif;
  --font-body:      'Inter', 'Noto Sans SC', -apple-system, sans-serif;
  --font-mono:      'JetBrains Mono', 'Fira Code', monospace;

  /* Spacing — 8px grid */
  --space-0:  0;
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  24px;
  --space-6:  32px;
  --space-7:  48px;
  --space-8:  64px;
  --space-9:  96px;

  /* Radii */
  --radius-sm: 4px;
  --radius-md: 8px;

  /* Shadows */
  --shadow-card:  0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-hover: 0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.05);
  --shadow-modal: 0 20px 60px rgba(0,0,0,0.15);

  /* Transitions */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-fast: 150ms;
  --dur-normal: 300ms;
  --dur-slow: 600ms;
}

/* === CSS Reset === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
body {
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.6;
  min-height: 100vh;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; border: none; background: none; }
ul, ol { list-style: none; }

/* === Typography Scale === */
h1, .h1 { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.15; }
h2, .h2 { font-family: var(--font-display); font-size: clamp(1.5rem, 3.5vw, 2.25rem); line-height: 1.25; }
h3, .h3 { font-size: 1.25rem; line-height: 1.35; }
.text-body { color: var(--color-text-dim); }
.text-mono { font-family: var(--font-mono); font-size: 0.875rem; }
.text-caption { font-size: 0.75rem; color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.05em; }

/* === Container === */
.container { max-width: 1440px; margin: 0 auto; padding: 0 var(--space-5); }

/* === Buttons === */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-5); border-radius: var(--radius-md);
  font-weight: 600; font-size: 0.9375rem; transition: all var(--dur-fast) var(--ease-out);
}
.btn-primary { background: var(--color-accent); color: #fff; }
.btn-primary:hover { background: var(--color-accent-hv); transform: translateY(-1px); }
.btn-primary:disabled { background: var(--color-border); color: var(--color-text-dim); cursor: not-allowed; transform: none; }
.btn-ghost { color: var(--color-text-dim); border: 1px solid var(--color-border); }
.btn-ghost:hover { border-color: var(--color-text); color: var(--color-text); }

/* === Tags / Pills === */
.tag {
  display: inline-flex; align-items: center; padding: var(--space-1) var(--space-3);
  border-radius: 999px; font-size: 0.8125rem; font-weight: 500;
  background: var(--color-surface); border: 1px solid var(--color-border);
  color: var(--color-text-dim); transition: all var(--dur-fast) var(--ease-out);
}
.tag:hover { border-color: var(--color-accent); color: var(--color-accent); }
.tag.selected { background: var(--color-accent); border-color: var(--color-accent); color: #fff; }

/* === Accessibility === */
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }
```

- [ ] **Step 2: Verify CSS loads — add stylesheet link to a simple test**

Confirm file exists at `static/css/style.css`.

- [ ] **Step 3: Commit**

```bash
cd /root/web-project/logo && git add static/css/style.css && git commit -m "feat(logo): add design tokens CSS foundation with reset and components

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 3: HTML base shell — head, header, footer, baseof

**Files:**
- Create: `layouts/_default/baseof.html`
- Create: `layouts/partials/head.html`
- Create: `layouts/partials/header.html`
- Create: `layouts/partials/footer.html`

- [ ] **Step 1: Create layouts/partials/head.html**

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ if .IsHome }}{{ .Site.Title }} — AI 商标生成器{{ else }}{{ .Title }} | {{ .Site.Title }}{{ end }}</title>
  <meta name="description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}">
  <meta name="robots" content="index, follow">

  <!-- Open Graph -->
  <meta property="og:title" content="{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} | {{ .Site.Title }}{{ end }}">
  <meta property="og:description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}">
  <meta property="og:type" content="{{ if .IsHome }}website{{ else }}article{{ end }}">
  <meta property="og:url" content="{{ .Permalink }}">
  <meta property="og:site_name" content="{{ .Site.Title }}">
  {{ with .Params.ogImage }}<meta property="og:image" content="{{ . | absURL }}">{{ else }}<meta property="og:image" content="{{ .Site.Params.ogImage | absURL }}">{{ end }}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} | {{ .Site.Title }}{{ end }}">
  <meta name="twitter:description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}">

  <!-- Canonical -->
  <link rel="canonical" href="{{ .Permalink }}">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;600&family=Noto+Serif+SC:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">

  <!-- Stylesheet -->
  {{ $css := resources.Get "css/style.css" | minify | fingerprint }}
  <link rel="stylesheet" href="{{ $css.RelPermalink }}" integrity="{{ $css.Data.Integrity }}">

  {{ block "head_extra" . }}{{ end }}
</head>
```

Wait — static/ CSS won't be processed by Hugo's `resources.Get`. For static files, use a direct link. Let me adjust.

```html
  <!-- Stylesheet -->
  <link rel="stylesheet" href="/css/style.css?v={{ now.Unix }}">
```

Actually better: move CSS to `assets/css/style.css` so Hugo can fingerprint it, or just link directly from static. Let me use the assets approach for fingerprinting.

Hmm, let me keep it simple — CSS in `static/css/` linked directly. We can optimize later.

Let me rewrite the plan with this correction. Actually I'll just note: CSS goes in `static/css/style.css` and is linked directly. That's simpler and works.

- [ ] **Step 2: Create layouts/partials/header.html**

```html
<header class="site-header">
  <div class="container header-inner">
    <a href="{{ .Site.Home.RelPermalink }}" class="brand">
      <span class="brand-mark">L</span>
      <span class="brand-text">LogoForge</span>
    </a>
    <nav class="header-nav" aria-label="主导航">
      <a href="{{ .Site.Home.RelPermalink }}" class="nav-link {{ if .IsHome }}active{{ end }}">灵感墙</a>
      <a href="{{ relref . "generator/_index.md" }}" class="nav-link">生成器</a>
    </nav>
  </div>
</header>
```

- [ ] **[REDO]** Step 1 with correct CSS path:

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ if .IsHome }}{{ .Site.Title }} — AI 商标生成器{{ else }}{{ .Title }} | {{ .Site.Title }}{{ end }}</title>
  <meta name="description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{{ .Permalink }}">

  <meta property="og:title" content="{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} | {{ .Site.Title }}{{ end }}">
  <meta property="og:description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}">
  <meta property="og:type" content="{{ if .IsHome }}website{{ else }}article{{ end }}">
  <meta property="og:url" content="{{ .Permalink }}">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/css/style.css">

  {{ block "head_extra" . }}{{ end }}
</head>
```

- [ ] **Step 3: Create layouts/partials/footer.html**

```html
<footer class="site-footer">
  <div class="container footer-inner">
    <p class="text-body">&copy; {{ now.Format "2006" }} LogoForge. Built with Hugo.</p>
  </div>
</footer>
```

- [ ] **Step 4: Create layouts/_default/baseof.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
{{ partial "head.html" . }}
<body>
  {{ partial "header.html" . }}
  <main class="site-main">
    {{ block "main" . }}{{ end }}
  </main>
  {{ partial "footer.html" . }}
</body>
</html>
```

- [ ] **Step 5: Verify base shell — Hugo build and check HTML**

```bash
cd /root/web-project/logo && hugo --minify --destination public && grep -c "LogoForge" public/index.html
```

Expected: exits 0, `grep` finds matches.

- [ ] **Step 6: Commit**

```bash
cd /root/web-project/logo && git add layouts/ && git commit -m "feat(logo): add HTML base shell with head, header, footer partials

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 4: Homepage — case wall

**Files:**
- Create: `layouts/index.html`
- Create: `layouts/partials/case-card.html`

- [ ] **Step 1: Create layouts/partials/case-card.html**

```html
<article class="case-card" data-industry="{{ .industry }}" data-style="{{ .style }}">
  <div class="case-card-image">
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="case-card-placeholder">
      <rect width="400" height="300" fill="var(--color-canvas)" rx="4" />
      <text x="200" y="150" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-display)" font-size="48" font-weight="700" fill="{{ index .colors 0 }}">{{ slicestr .brand 0 2 }}</text>
    </svg>
  </div>
  <div class="case-card-body">
    <h3 class="case-card-brand">{{ .brand }}</h3>
    <div class="case-card-tags">
      <span class="tag">{{ .style }}</span>
      <span class="tag">{{ .industry }}</span>
    </div>
  </div>
  <a href="{{ printf "/cases/%s/" .slug }}" class="case-card-link" aria-label="查看 {{ .brand }} 案例详情">
    <span class="sr-only">查看详情</span>
  </a>
</article>
```

- [ ] **Step 2: Create layouts/index.html (homepage case wall)**

```html
{{ define "main" }}
<section class="hero-section">
  <div class="container">
    <h1 class="hero-title">发现品牌标识的<span class="text-accent">无限可能</span></h1>
    <p class="hero-subtitle text-body">50+ 顶尖品牌 Logo 设计拆解。选择风格关键词，用 AI 生成你的专属商标。</p>
    <a href="{{ relref . "generator/_index.md" }}" class="btn btn-primary btn-lg">开始创作</a>
  </div>
</section>

<section class="case-wall">
  <div class="container">
    <div class="case-wall-header">
      <h2>灵感案例</h2>
      <div class="case-filter-bar" role="tablist" aria-label="按风格筛选">
        <button class="tag selected" role="tab" aria-selected="true" data-filter="all">全部</button>
        {{ $styles := slice }}
        {{ range .Site.Data.cases }}
          {{ if not (in $styles .style) }}
            {{ $styles = $styles | append .style }}
          {{ end }}
        {{ end }}
        {{ range $styles }}
        <button class="tag" role="tab" aria-selected="false" data-filter="{{ . | urlize }}">{{ . }}</button>
        {{ end }}
      </div>
    </div>
    <div class="case-grid" id="caseGrid">
      {{ range .Site.Data.cases }}
        {{ partial "case-card.html" . }}
      {{ end }}
    </div>
  </div>
</section>
{{ end }}

{{ define "head_extra" }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "LogoForge — AI 商标生成器",
  "description": "{{ .Site.Params.description }}",
  "url": "{{ .Permalink }}",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {{ range $i, $c := .Site.Data.cases }}
      {{ if $i }},{{ end }}
      {
        "@type": "CreativeWork",
        "position": {{ add $i 1 }},
        "name": "{{ $c.brand }} Logo 设计",
        "url": "{{ printf "/cases/%s/" $c.slug | absURL }}"
      }
      {{ end }}
    ]
  }
}
</script>
{{ end }}
```

- [ ] **Step 3: Add homepage CSS to style.css**

Append to `static/css/style.css`:

```css
/* === Hero Section === */
.hero-section { padding: var(--space-9) 0 var(--space-7); text-align: center; }
.hero-title { margin-bottom: var(--space-4); }
.text-accent { color: var(--color-accent); font-style: italic; }
.hero-subtitle { max-width: 560px; margin: 0 auto var(--space-6); font-size: 1.125rem; }
.btn-lg { padding: var(--space-4) var(--space-6); font-size: 1.0625rem; }

/* === Case Wall === */
.case-wall { padding-bottom: var(--space-9); }
.case-wall-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-4); margin-bottom: var(--space-6); }
.case-filter-bar { display: flex; flex-wrap: wrap; gap: var(--space-2); }

.case-grid { columns: 3 320px; gap: var(--space-5); }
@media (max-width: 768px) { .case-grid { columns: 2 280px; } }
@media (max-width: 480px) { .case-grid { columns: 1; } }

/* === Case Card === */
.case-card {
  position: relative; break-inside: avoid; margin-bottom: var(--space-5);
  background: var(--color-surface); border-radius: var(--radius-sm);
  box-shadow: var(--shadow-card); overflow: hidden;
  transition: transform var(--dur-normal) var(--ease-out), box-shadow var(--dur-normal) var(--ease-out);
  animation: cardFadeIn var(--dur-slow) var(--ease-out) both;
}
.case-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
.case-card-image { width: 100%; aspect-ratio: 4/3; background: var(--color-canvas); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.case-card-image img, .case-card-image svg { width: 60%; height: auto; }
.case-card-image img { transition: transform var(--dur-normal) var(--ease-out); }
.case-card:hover .case-card-image img { transform: scale(1.05); }
.case-card-body { padding: var(--space-4); }
.case-card-brand { font-size: 1rem; margin-bottom: var(--space-2); }
.case-card-tags { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.case-card-link { position: absolute; inset: 0; }

@keyframes cardFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* === Site Header === */
.site-header { position: sticky; top: 0; z-index: 100; background: var(--color-bg); border-bottom: 1px solid var(--color-border); backdrop-filter: blur(12px); }
.header-inner { display: flex; align-items: center; justify-content: space-between; height: 64px; }
.brand { display: flex; align-items: center; gap: var(--space-3); font-family: var(--font-display); font-size: 1.375rem; font-weight: 700; }
.brand-mark {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: var(--radius-sm);
  background: var(--color-accent); color: #fff; font-size: 1.25rem;
}
.header-nav { display: flex; gap: var(--space-5); }
.nav-link { font-weight: 500; color: var(--color-text-dim); transition: color var(--dur-fast); }
.nav-link:hover, .nav-link.active { color: var(--color-text); }
.nav-link.active::after { content: ''; display: block; height: 2px; background: var(--color-accent); margin-top: 2px; }

/* === Site Footer === */
.site-footer { border-top: 1px solid var(--color-border); padding: var(--space-6) 0; text-align: center; }
```

- [ ] **Step 4: Verify — Hugo build and check page**

```bash
cd /root/web-project/logo && hugo --minify --destination public && ls public/index.html && grep -c "case-card" public/index.html
```

Expected: exits 0, `case-card` appears 51+ times.

- [ ] **Step 5: Commit**

```bash
cd /root/web-project/logo && git add layouts/index.html layouts/partials/case-card.html static/css/style.css && git commit -m "feat(logo): add homepage case wall with masonry grid and filter bar

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 5: Case content generation script + case detail page

**Files:**
- Create: `scripts/generate-cases.sh`
- Create: `layouts/_default/single.html` (case detail)
- Create: `layouts/partials/json-ld-case.html`

- [ ] **Step 1: Create scripts/generate-cases.sh**

```bash
#!/usr/bin/env bash
# Generate content/cases/*.md from data/cases/brand-logos.yaml
# Usage: bash scripts/generate-cases.sh

set -euo pipefail

YAML_FILE="data/cases/brand-logos.yaml"
OUTPUT_DIR="content/cases"

rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Use Python to parse YAML and generate .md files
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
```

- [ ] **Step 2: Run the generation script**

```bash
cd /root/web-project/logo && bash scripts/generate-cases.sh
```

Expected: "Generated 51 case content files"

- [ ] **Step 3: Create layouts/_default/single.html (case detail)**

```html
{{ define "main" }}
{{ $data := .Params }}
<article class="case-detail">
  <div class="container">
    <nav class="breadcrumb" aria-label="面包屑导航">
      <a href="{{ .Site.Home.RelPermalink }}">首页</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{{ .Params.brand }}</span>
    </nav>

    <div class="case-detail-layout">
      <div class="case-detail-preview">
        <div class="case-preview-canvas">
          <svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="500" fill="var(--color-canvas)" />
            <text x="300" y="250" text-anchor="middle" dominant-baseline="middle"
                  font-family="var(--font-display)" font-size="72" font-weight="700"
                  fill="{{ index .Params.colors 0 }}">{{ slicestr .Params.brand 0 2 }}</text>
          </svg>
        </div>
      </div>

      <div class="case-detail-info">
        <h1 class="case-detail-brand">{{ .Params.brand }}</h1>
        <p class="text-body">{{ .Content }}</p>

        <div class="case-detail-params">
          <div class="param-item">
            <span class="param-label">行业</span>
            <a href="/tags/industry/{{ .Params.industry | urlize }}/" class="tag">{{ .Params.industry }}</a>
          </div>
          <div class="param-item">
            <span class="param-label">风格</span>
            <a href="/tags/style/{{ .Params.style | urlize }}/" class="tag">{{ .Params.style }}</a>
          </div>
          <div class="param-item">
            <span class="param-label">配色</span>
            <span class="tag">{{ .Params.colorScheme }}</span>
            <span class="color-swatches">
              {{ range .Params.colors }}
              <span class="color-dot" style="background: {{ . }}" aria-label="颜色 {{ . }}"></span>
              {{ end }}
            </span>
          </div>
          <div class="param-item">
            <span class="param-label">字体</span>
            <span class="tag">{{ .Params.fontStyle }}</span>
          </div>
          <div class="param-item">
            <span class="param-label">构图</span>
            <span class="tag">{{ .Params.layoutType }}</span>
          </div>
        </div>

        <div class="case-detail-prompt">
          <h3>AI 生成提示词</h3>
          <div class="prompt-block">
            <button class="btn btn-ghost btn-sm copy-btn" data-copy="{{ .Params.prompt }}" aria-label="复制提示词">📋 复制</button>
            <pre><code>{{ .Params.prompt }}</code></pre>
          </div>
        </div>

        <a href="/generator/?brand={{ .Params.brand }}&industry={{ .Params.industry | urlize }}&style={{ .Params.style | urlize }}&color={{ .Params.colorScheme | urlize }}&font={{ .Params.fontStyle | urlize }}&layout={{ .Params.layoutType | urlize }}" class="btn btn-primary">套用参数去生成器</a>
      </div>
    </div>

    <section class="related-cases">
      <h2>相关案例</h2>
      <div class="case-grid">
        {{ $current := . }}
        {{ $related := where .Site.Data.cases "style" .Params.style | first 4 }}
        {{ range $related }}
          {{ if ne .slug $current.Params.slug }}
            {{ partial "case-card.html" . }}
          {{ end }}
        {{ end }}
      </div>
    </section>
  </div>
</article>
{{ end }}

{{ define "head_extra" }}
{{ partial "json-ld-case.html" . }}
<script>
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.copy-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      navigator.clipboard.writeText(this.dataset.copy).then(function() {
        var original = this.textContent;
        this.textContent = '✓ 已复制';
        setTimeout(function() { this.textContent = original; }.bind(this), 2000);
      }.bind(this));
    });
  });
});
</script>
{{ end }}
```

- [ ] **Step 4: Create layouts/partials/json-ld-case.html**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "{{ .Params.brand }} Logo 设计案例",
  "description": "{{ .Content | plainify | truncate 160 }}",
  "url": "{{ .Permalink }}",
  "image": "{{ printf "/images/cases/%s.png" .Params.slug | absURL }}",
  "about": {
    "@type": "Thing",
    "name": "{{ .Params.brand }}",
    "description": "行业: {{ .Params.industry }}, 风格: {{ .Params.style }}, 配色: {{ .Params.colorScheme }}"
  }
}
</script>
```

- [ ] **Step 5: Append case detail CSS to style.css**

```css
/* === Case Detail === */
.case-detail { padding: var(--space-5) 0 var(--space-9); }
.breadcrumb { margin-bottom: var(--space-5); display: flex; gap: var(--space-2); align-items: center; font-size: 0.875rem; color: var(--color-text-dim); }
.breadcrumb a { color: var(--color-secondary); }
.breadcrumb a:hover { text-decoration: underline; }

.case-detail-layout { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8); margin-bottom: var(--space-9); }
@media (max-width: 768px) { .case-detail-layout { grid-template-columns: 1fr; } }
.case-preview-canvas { background: var(--color-canvas); border-radius: var(--radius-sm); aspect-ratio: 6/5; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.case-preview-canvas svg { width: 80%; height: auto; }
.case-detail-brand { margin-bottom: var(--space-4); }
.case-detail-info .text-body { margin-bottom: var(--space-6); line-height: 1.7; }

.case-detail-params { display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-6); }
.param-item { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
.param-label { font-weight: 600; min-width: 48px; font-size: 0.875rem; color: var(--color-text-dim); }
.color-swatches { display: flex; gap: 4px; }
.color-dot { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--color-border); box-shadow: 0 0 0 1px var(--color-surface); }

.prompt-block { position: relative; background: var(--color-canvas); border-radius: var(--radius-sm); padding: var(--space-5); margin-top: var(--space-2); }
.prompt-block pre { margin: 0; overflow-x: auto; white-space: pre-wrap; }
.prompt-block code { font-family: var(--font-mono); font-size: 0.8125rem; color: #E8E3DD; line-height: 1.7; }
.copy-btn { position: absolute; top: var(--space-3); right: var(--space-3); }
.btn-sm { padding: var(--space-1) var(--space-3); font-size: 0.8125rem; }

.case-detail-info .btn-primary { margin-top: var(--space-4); }

.related-cases { margin-top: var(--space-9); padding-top: var(--space-7); border-top: 1px solid var(--color-border); }
.related-cases h2 { margin-bottom: var(--space-5); }
```

- [ ] **Step 6: Verify — Hugo build with case pages**

```bash
cd /root/web-project/logo && hugo --minify --destination public && ls public/cases/huawei/index.html && grep "华为" public/cases/huawei/index.html
```

Expected: exits 0, case detail page exists and contains brand name.

- [ ] **Step 7: Commit**

```bash
cd /root/web-project/logo && git add scripts/ content/cases/ layouts/_default/single.html layouts/partials/json-ld-case.html static/css/style.css && git commit -m "feat(logo): add case generation script and detail page template with structured data

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 6: Generator page — HTML structure

**Files:**
- Create: `layouts/generator/single.html`
- Create: `layouts/partials/filter-panel.html`
- Create: `layouts/partials/preview-area.html`

- [ ] **Step 1: Create layouts/generator/single.html (Hugo wrapper)**

```html
{{ define "main" }}
<div class="generator-page" id="generatorApp">
  <div class="generator-layout">
    <aside class="filter-panel" id="filterPanel">
      {{ partial "filter-panel.html" . }}
    </aside>

    <section class="preview-area" id="previewArea">
      {{ partial "preview-area.html" . }}
    </section>

    <aside class="history-panel" id="historyPanel">
      <h3 class="history-title">生成历史</h3>
      <div class="history-list" id="historyList">
        <p class="text-body history-empty">尚未生成任何 Logo</p>
      </div>
    </aside>
  </div>
</div>
{{ end }}

{{ define "head_extra" }}
<script>window.__CASES__ = {{ .Site.Data.cases | jsonify }};</script>
<script src="/js/generator.js" defer></script>
{{ end }}
```

- [ ] **Step 2: Create layouts/partials/filter-panel.html**

```html
<div class="filter-panel-inner">
  <div class="filter-header">
    <h2 class="filter-title">设计参数</h2>
  </div>

  <!-- Industry -->
  <details class="filter-group" open>
    <summary class="filter-group-label">
      <span>行业 / 品类</span>
      <svg width="12" height="8" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
    </summary>
    <div class="filter-options grid-4" data-dimension="industry">
      <button class="filter-chip" data-value="科技/通信">💻 科技</button>
      <button class="filter-chip" data-value="科技/消费电子">📱 消费电子</button>
      <button class="filter-chip" data-value="运动/体育用品">⚽ 运动</button>
      <button class="filter-chip" data-value="食品饮料">🥤 食品</button>
      <button class="filter-chip" data-value="餐饮/咖啡">☕ 餐饮</button>
      <button class="filter-chip" data-value="茶饮">🍵 茶饮</button>
      <button class="filter-chip" data-value="汽车/出行">🚗 出行</button>
      <button class="filter-chip" data-value="汽车/新能源">⚡ 新能源</button>
      <button class="filter-chip" data-value="电商/零售">🛒 电商</button>
      <button class="filter-chip" data-value="互联网/科技">🌐 互联网</button>
      <button class="filter-chip" data-value="香氛/美妆">💄 美妆</button>
      <button class="filter-chip" data-value="白酒/奢侈品">🍶 白酒</button>
      <button class="filter-chip" data-value="饮料/消费品">🧃 饮料</button>
      <button class="filter-chip" data-value="乳业/食品">🥛 乳业</button>
      <button class="filter-chip" data-value="物流/快递">📦 物流</button>
      <button class="filter-chip" data-value="家电/制造">🏠 家电</button>
      <button class="filter-chip" data-value="服装/户外">🧥 服装</button>
      <button class="filter-chip" data-value="游戏/娱乐">🎮 游戏</button>
      <button class="filter-chip" data-value="电商/社交">💬 社交</button>
      <button class="filter-chip" data-value="视频/娱乐">📺 视频</button>
      <button class="filter-chip" data-value="茶饮/快餐">🍔 快餐</button>
      <button class="filter-chip" data-value="酒类/啤酒">🍺 啤酒</button>
      <button class="filter-chip" data-value="护肤/医疗">🏥 护肤</button>
      <button class="filter-chip" data-value="文具/教育">✏️ 文具</button>
      <button class="filter-chip" data-value="潮玩/娱乐">🧸 潮玩</button>
      <button class="filter-chip" data-value="本地生活/科技">📍 本地生活</button>
      <button class="filter-chip" data-value="服装/奢侈品">✨ 奢侈品</button>
    </div>
  </details>

  <!-- Style -->
  <details class="filter-group" open>
    <summary class="filter-group-label">
      <span>视觉风格</span>
      <svg width="12" height="8" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
    </summary>
    <div class="filter-options flow" data-dimension="style">
      <button class="filter-chip" data-value="极简几何">极简几何</button>
      <button class="filter-chip" data-value="极简现代">极简现代</button>
      <button class="filter-chip" data-value="动感流线">动感流线</button>
      <button class="filter-chip" data-value="自然写意">自然写意</button>
      <button class="filter-chip" data-value="现代轻奢">现代轻奢</button>
      <button class="filter-chip" data-value="新中式古典">新中式古典</button>
      <button class="filter-chip" data-value="未来极简">未来极简</button>
      <button class="filter-chip" data-value="工业极简">工业极简</button>
      <button class="filter-chip" data-value="东方极简">东方极简</button>
      <button class="filter-chip" data-value="科技稳健">科技稳健</button>
      <button class="filter-chip" data-value="潮酷极简">潮酷极简</button>
      <button class="filter-chip" data-value="玩趣波普">玩趣波普</button>
      <button class="filter-chip" data-value="动感几何">动感几何</button>
      <button class="filter-chip" data-value="活泼现代">活泼现代</button>
      <button class="filter-chip" data-value="东方雅致">东方雅致</button>
      <button class="filter-chip" data-value="亲和科技">亲和科技</button>
      <button class="filter-chip" data-value="温暖现代">温暖现代</button>
      <button class="filter-chip" data-value="经典奢华">经典奢华</button>
      <button class="filter-chip" data-value="经典怀旧">经典怀旧</button>
      <button class="filter-chip" data-value="圆润科技">圆润科技</button>
    </div>
  </details>

  <!-- Color Scheme -->
  <details class="filter-group" open>
    <summary class="filter-group-label">
      <span>配色方案</span>
      <svg width="12" height="8" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
    </summary>
    <div class="filter-options dots" data-dimension="colorScheme">
      <button class="color-chip" data-value="单色渐变红" style="--c1:#CF0A2C" aria-label="单色渐变红"></button>
      <button class="color-chip" data-value="单色橙" style="--c1:#FF6900" aria-label="橙色"></button>
      <button class="color-chip" data-value="蓝白双色" style="--c1:#003DA5;--c2:#FFFFFF" aria-label="蓝白双色"></button>
      <button class="color-chip" data-value="金黑红" style="--c1:#C9A963;--c2:#1A1A1A;--c3:#8B0000" aria-label="金黑红"></button>
      <button class="color-chip" data-value="极致黑白" style="--c1:#000000;--c2:#FFFFFF" aria-label="极致黑白"></button>
      <button class="color-chip" data-value="红黑撞色" style="--c1:#E60012;--c2:#1A1A1A" aria-label="红黑撞色"></button>
      <button class="color-chip" data-value="多色跳跃" style="--c1:#325AB4;--c2:#78E0DC;--c3:#FF5C8A;--c4:#FFB800" aria-label="多色跳跃"></button>
      <button class="color-chip" data-value="胭脂粉黛" style="--c1:#C4375E;--c2:#F2C4C9" aria-label="胭脂粉黛"></button>
      <button class="color-chip" data-value="大地暖灰" style="--c1:#8B8682;--c2:#D4C9B8" aria-label="大地暖灰"></button>
      <button class="color-chip" data-value="黑白金" style="--c1:#1A1A1A;--c2:#D4AF37" aria-label="黑白金"></button>
      <button class="color-chip" data-value="黄黑撞色" style="--c1:#FFD700;--c2:#000000" aria-label="黄黑撞色"></button>
      <button class="color-chip" data-value="自然色系" style="--c1:#2E8B57;--c2:#F5F5DC" aria-label="自然色系"></button>
      <button class="color-chip" data-value="科技蓝渐变" style="--c1:#0066CC;--c2:#00A8E8" aria-label="科技蓝渐变"></button>
      <button class="color-chip" data-value="单色强调红" style="--c1:#EE1C25" aria-label="红色"></button>
      <button class="color-chip" data-value="红白双色" style="--c1:#E2231A;--c2:#C0C0C0" aria-label="红银"></button>
      <button class="color-chip" data-value="蓝红双色" style="--c1:#0066FF;--c2:#DE1F3E" aria-label="蓝红"></button>
      <button class="color-chip" data-value="经典绿金" style="--c1:#006633;--c2:#D4AF37" aria-label="绿金"></button>
      <button class="color-chip" data-value="冰雪蓝白红" style="--c1:#0066CC;--c2:#FFFFFF;--c3:#E60012" aria-label="蓝白红"></button>
      <button class="color-chip" data-value="羊绒暖棕" style="--c1:#8B7355;--c2:#D2B48C" aria-label="暖棕"></button>
      <button class="color-chip" data-value="茶韵暖棕" style="--c1:#5D4037;--c2:#FFF8E1" aria-label="茶棕"></button>
    </div>
  </details>

  <!-- Font Style -->
  <details class="filter-group" open>
    <summary class="filter-group-label">
      <span>字体气质</span>
      <svg width="12" height="8" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
    </summary>
    <div class="filter-options grid-3" data-dimension="fontStyle">
      <button class="filter-chip font-sample sans-geo" data-value="无衬线几何"><span class="font-preview">Ag</span>无衬线几何</button>
      <button class="filter-chip font-sample sans-rounded" data-value="无衬线圆角"><span class="font-preview">Ag</span>无衬线圆角</button>
      <button class="filter-chip font-sample sans-modern" data-value="无衬线现代"><span class="font-preview">Ag</span>无衬线现代</button>
      <button class="filter-chip font-sample sans-bold" data-value="无衬线粗体"><span class="font-preview">Ag</span>无衬线粗体</button>
      <button class="filter-chip font-sample sans-minimal" data-value="无衬线极简"><span class="font-preview">Ag</span>无衬线极简</button>
      <button class="filter-chip font-sample serif-song" data-value="中文宋体"><span class="font-preview">字</span>宋体</button>
      <button class="filter-chip font-sample serif-kai" data-value="中文楷体"><span class="font-preview">字</span>楷体</button>
      <button class="filter-chip font-sample serif-ming" data-value="中文书法"><span class="font-preview">字</span>书法</button>
    </div>
  </details>

  <!-- Layout Type -->
  <details class="filter-group" open>
    <summary class="filter-group-label">
      <span>构图类型</span>
      <svg width="12" height="8" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
    </summary>
    <div class="filter-options grid-3" data-dimension="layoutType">
      <button class="filter-chip layout-sample" data-value="图标型">
        <span class="layout-icon">⬡</span>图标型
      </button>
      <button class="filter-chip layout-sample" data-value="文字型">
        <span class="layout-icon">Aa</span>文字型
      </button>
      <button class="filter-chip layout-sample" data-value="徽章型">
        <span class="layout-icon">◎</span>徽章型
      </button>
      <button class="filter-chip layout-sample" data-value="图标+文字组合型">
        <span class="layout-icon">⬡Aa</span>组合型
      </button>
    </div>
  </details>

  <!-- Brand Name Input -->
  <div class="filter-input-group">
    <label for="brandName" class="filter-input-label">品牌名称</label>
    <input type="text" id="brandName" class="filter-input" placeholder="输入你的品牌名" maxlength="20" autocomplete="off">
    <span class="char-count" id="charCount">0/20</span>
  </div>

  <!-- Extra Conditions -->
  <div class="filter-input-group">
    <label for="extraConditions" class="filter-input-label">附加条件</label>
    <textarea id="extraConditions" class="filter-input filter-textarea" placeholder="比如：不要渐变、logo 里面藏一只猫..." maxlength="200" rows="2"></textarea>
  </div>

  <!-- Generate Button -->
  <button class="btn btn-primary btn-generate" id="generateBtn" disabled>
    <span class="btn-icon">✦</span> 生成 Logo
  </button>
</div>
```

- [ ] **Step 3: Create layouts/partials/preview-area.html**

```html
<div class="preview-inner">
  <div class="preview-canvas" id="previewCanvas">
    <div class="preview-empty" id="previewEmpty">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="76" height="76" rx="4" stroke="var(--color-border)" stroke-width="2" stroke-dasharray="6 4" />
        <text x="40" y="44" text-anchor="middle" font-family="var(--font-body)" font-size="13" fill="var(--color-text-dim)">选择左侧</text>
        <text x="40" y="62" text-anchor="middle" font-family="var(--font-body)" font-size="13" fill="var(--color-text-dim)">关键词开始</text>
      </svg>
    </div>
    <div class="preview-template" id="previewTemplate" style="display:none">
      <svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg" id="previewSvg"></svg>
    </div>
    <div class="preview-loading" id="previewLoading" style="display:none">
      <div class="loading-canvas">
        <div class="loading-brush"></div>
        <p class="text-body">AI 正在绘制中...</p>
      </div>
    </div>
    <div class="preview-result" id="previewResult" style="display:none">
      <img src="" alt="生成的 Logo" id="resultImage" class="result-image reveal">
      <div class="result-actions">
        <button class="btn btn-ghost" id="downloadBtn">⬇ 下载</button>
        <button class="btn btn-ghost" id="shareBtn">🔗 分享</button>
        <button class="btn btn-ghost" id="regenerateBtn">🔄 重新生成</button>
      </div>
    </div>
  </div>
  <div class="preview-prompt-display" id="previewPrompt" style="display:none">
    <h4>生成 Prompt</h4>
    <pre><code id="promptCode"></code></pre>
    <button class="btn btn-ghost btn-sm copy-btn" data-copy="" aria-label="复制 prompt">📋 复制</button>
  </div>
</div>
```

- [ ] **Step 4: Append generator page CSS to style.css**

```css
/* === Generator Layout === */
.generator-page { min-height: calc(100vh - 64px - 73px); /* viewport - header - footer */ }
.generator-layout { display: grid; grid-template-columns: 280px 1fr 200px; height: calc(100vh - 64px); overflow: hidden; }
@media (max-width: 1024px) { .generator-layout { grid-template-columns: 56px 1fr; } .history-panel { display: none; } }
@media (max-width: 768px) { .generator-layout { grid-template-columns: 1fr; grid-template-rows: 1fr auto; } .filter-panel { position: fixed; bottom: 0; left: 0; right: 0; z-index: 200; height: auto; max-height: 60vh; overflow-y: auto; transform: translateY(100%); transition: transform var(--dur-normal) var(--ease-out); } .filter-panel.open { transform: translateY(0); } }

/* === Filter Panel === */
.filter-panel { border-right: 1px solid var(--color-border); overflow-y: auto; background: var(--color-bg); }
.filter-panel-inner { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.filter-title { font-family: var(--font-display); font-size: 1.125rem; margin-bottom: 0; }
.filter-group { border: none; }
.filter-group[open] .filter-group-label svg { transform: rotate(180deg); }
.filter-group-label {
  display: flex; justify-content: space-between; align-items: center;
  padding: var(--space-2) 0; cursor: pointer; font-size: 0.8125rem;
  font-weight: 600; color: var(--color-text-dim); text-transform: uppercase;
  letter-spacing: 0.03em; list-style: none;
}
.filter-group-label::-webkit-details-marker { display: none; }
.filter-group-label svg { transition: transform var(--dur-fast) var(--ease-out); color: var(--color-text-dim); }

.filter-options { padding: var(--space-2) 0 var(--space-3); }
.filter-options.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-1); }
.filter-options.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-1); }
.filter-options.flow { display: flex; flex-wrap: wrap; gap: var(--space-1); }
.filter-options.dots { display: flex; flex-wrap: wrap; gap: var(--space-2); }

.filter-chip {
  display: flex; align-items: center; justify-content: center; gap: 2px;
  padding: var(--space-1) var(--space-2); border-radius: var(--radius-sm);
  font-size: 0.71875rem; border: 1px solid var(--color-border); background: var(--color-surface);
  color: var(--color-text-dim); cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out); text-align: center; min-height: 32px;
}
.filter-chip:hover { border-color: var(--color-text-dim); color: var(--color-text); }
.filter-chip.selected { background: var(--color-accent); border-color: var(--color-accent); color: #fff; }

/* Color chips */
.color-chip {
  width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--color-border);
  cursor: pointer; transition: all var(--dur-fast) var(--ease-out);
  background: linear-gradient(135deg, var(--c1, #ccc) 0%, var(--c2, var(--c1, #ccc)) 50%, var(--c3, var(--c2, var(--c1, #ccc))) 100%);
  box-shadow: 0 0 0 1px var(--color-surface);
}
.color-chip:hover { transform: scale(1.2); border-color: var(--color-text); }
.color-chip.selected { transform: scale(1.2); border-color: var(--color-accent); box-shadow: 0 0 0 2px var(--color-accent), 0 0 0 4px var(--color-surface); }

/* Font samples */
.font-sample { flex-direction: column; padding: var(--space-2); }
.font-preview { font-size: 1.25rem; font-weight: 700; line-height: 1; }
.font-sample.sans-geo .font-preview { font-family: var(--font-body); letter-spacing: -0.02em; }
.font-sample.sans-rounded .font-preview { font-family: var(--font-body); font-weight: 600; }
.font-sample.sans-modern .font-preview { font-family: var(--font-body); }
.font-sample.sans-bold .font-preview { font-family: var(--font-body); font-weight: 800; }
.font-sample.sans-minimal .font-preview { font-family: var(--font-body); font-weight: 300; letter-spacing: 0.1em; }
.font-sample.serif-song .font-preview { font-family: 'Noto Serif SC', serif; }
.font-sample.serif-kai .font-preview { font-family: 'Noto Serif SC', serif; font-style: italic; }
.font-sample.serif-ming .font-preview { font-family: 'Noto Serif SC', serif; font-weight: 700; }

/* Layout samples */
.layout-sample { flex-direction: column; padding: var(--space-2); }
.layout-icon { font-size: 1.25rem; line-height: 1; }

/* Filter inputs */
.filter-input-group { display: flex; flex-direction: column; gap: var(--space-1); position: relative; }
.filter-input-label { font-size: 0.8125rem; font-weight: 600; color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.03em; }
.filter-input {
  width: 100%; padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); font-family: var(--font-body); font-size: 0.9375rem;
  background: var(--color-surface); color: var(--color-text); transition: border-color var(--dur-fast);
}
.filter-input:focus { outline: none; border-color: var(--color-accent); }
.filter-textarea { resize: vertical; min-height: 60px; }
.char-count { position: absolute; right: var(--space-2); bottom: var(--space-2); font-size: 0.6875rem; color: var(--color-text-dim); }
.btn-generate { width: 100%; padding: var(--space-4); margin-top: var(--space-2); font-size: 1rem; gap: var(--space-2); }
.btn-icon { font-size: 1.125rem; }

/* === Preview Area === */
.preview-area { display: flex; flex-direction: column; background: var(--color-bg); overflow: hidden; }
.preview-inner { flex: 1; display: flex; flex-direction: column; padding: var(--space-5); overflow-y: auto; }
.preview-canvas {
  flex: 1; display: flex; align-items: center; justify-content: center;
  background: var(--color-canvas); border-radius: var(--radius-sm);
  background-image: radial-gradient(circle, var(--color-canvas-grid) 1px, transparent 1px);
  background-size: 24px 24px; position: relative; min-height: 400px;
}
.preview-empty { text-align: center; opacity: 0.6; }
.preview-template, .preview-result { animation: fadeIn var(--dur-normal) var(--ease-out); }
.preview-template svg, .result-image { max-width: 70%; max-height: 70%; }
.result-image.reveal { animation: reveal var(--dur-slow) var(--ease-out); }
.result-actions { display: flex; gap: var(--space-2); margin-top: var(--space-5); justify-content: center; }

.preview-prompt-display { margin-top: var(--space-4); padding: var(--space-4); background: var(--color-surface); border-radius: var(--radius-sm); border: 1px solid var(--color-border); position: relative; }
.preview-prompt-display h4 { font-size: 0.8125rem; font-weight: 600; color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: var(--space-2); }
.preview-prompt-display pre { margin: 0; }
.preview-prompt-display code { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-dim); line-height: 1.6; }
.preview-prompt-display .copy-btn { position: absolute; top: var(--space-3); right: var(--space-3); }

/* === Loading Animation === */
.loading-canvas { text-align: center; }
.loading-brush {
  width: 48px; height: 4px; background: var(--color-accent); border-radius: 2px;
  margin: 0 auto var(--space-4); animation: brushStroke 1.5s ease-in-out infinite;
}
@keyframes brushStroke {
  0%   { width: 0; opacity: 0; }
  20%  { width: 0; opacity: 1; }
  60%  { width: 140px; opacity: 1; }
  80%  { width: 160px; opacity: 0.5; }
  100% { width: 180px; opacity: 0; }
}
@keyframes reveal { from { opacity: 0; filter: blur(8px); } to { opacity: 1; filter: blur(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* === History Panel === */
.history-panel { border-left: 1px solid var(--color-border); padding: var(--space-4); overflow-y: auto; background: var(--color-bg); }
.history-title { font-size: 0.8125rem; font-weight: 600; color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: var(--space-3); }
.history-empty { font-size: 0.8125rem; text-align: center; padding: var(--space-5) 0; }
```

- [ ] **Step 5: Verify — Hugo build generator page**

```bash
cd /root/web-project/logo && hugo --minify --destination public && ls public/generator/index.html
```

Expected: exits 0, generator page exists.

- [ ] **Step 6: Commit**

```bash
cd /root/web-project/logo && git add layouts/generator/ layouts/partials/filter-panel.html layouts/partials/preview-area.html static/css/style.css && git commit -m "feat(logo): add generator page with filter panel and preview area HTML

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 7: Generator JavaScript — state machine & interactions

**Files:**
- Create: `static/js/generator.js`

- [ ] **Step 1: Write generator.js — state management**

```javascript
(function() {
  'use strict';

  // --- State ---
  const state = {
    industry: null,
    style: null,
    colorScheme: [],    // multi-select, max 2
    fontStyle: null,
    layoutType: null,
    brandName: '',
    extraConditions: '',
    history: [],
    isGenerating: false
  };

  // --- DOM refs ---
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const brandInput = $('#brandName');
  const charCount = $('#charCount');
  const generateBtn = $('#generateBtn');
  const previewCanvas = $('#previewCanvas');
  const previewEmpty = $('#previewEmpty');
  const previewTemplate = $('#previewTemplate');
  const previewLoading = $('#previewLoading');
  const previewResult = $('#previewResult');
  const previewSvg = $('#previewSvg');
  const previewPrompt = $('#previewPrompt');
  const promptCode = $('#promptCode');
  const historyList = $('#historyList');
  const filterPanel = $('#filterPanel');

  // --- Initialize ---
  function init() {
    // Brand name input
    brandInput.addEventListener('input', function() {
      state.brandName = this.value.trim();
      charCount.textContent = this.value.length + '/20';
      updateGenerateButton();
      updatePreview();
    });

    // Extra conditions
    $('#extraConditions').addEventListener('input', function() {
      state.extraConditions = this.value.trim();
      updatePreview();
    });

    // Filter chip clicks
    $$('[data-dimension]').forEach(function(group) {
      group.addEventListener('click', function(e) {
        var chip = e.target.closest('[data-value]');
        if (!chip) return;
        var dim = group.dataset.dimension;
        var val = chip.dataset.value;

        if (dim === 'colorScheme') {
          handleColorSelect(chip, val);
        } else {
          handleSingleSelect(group, chip, dim, val);
        }
        updatePreview();
        updateGenerateButton();
      });
    });

    // Generate button
    generateBtn.addEventListener('click', generate);

    // Copy buttons
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.copy-btn');
      if (!btn) return;
      var text = btn.dataset.copy;
      navigator.clipboard.writeText(text).then(function() {
        var orig = btn.textContent;
        btn.textContent = '✓ 已复制';
        setTimeout(function() { btn.textContent = orig; }, 2000);
      });
    });

    // Download button
    $('#downloadBtn').addEventListener('click', downloadResult);

    // Share button
    $('#shareBtn').addEventListener('click', shareResult);

    // Regenerate
    $('#regenerateBtn').addEventListener('click', generate);

    // Load URL params if present
    loadUrlParams();

    updateGenerateButton();
  }

  // --- Selection handlers ---
  function handleSingleSelect(group, chip, dim, val) {
    // Deselect all in group
    group.querySelectorAll('.selected').forEach(function(c) { c.classList.remove('selected'); });
    // Toggle
    if (state[dim] === val) {
      state[dim] = null;
    } else {
      state[dim] = val;
      chip.classList.add('selected');
    }
  }

  function handleColorSelect(chip, val) {
    var idx = state.colorScheme.indexOf(val);
    if (idx > -1) {
      state.colorScheme.splice(idx, 1);
      chip.classList.remove('selected');
    } else {
      if (state.colorScheme.length >= 2) {
        // Remove oldest
        var oldest = state.colorScheme.shift();
        var oldChip = document.querySelector('[data-dimension="colorScheme"] [data-value="' + oldest + '"]');
        if (oldChip) oldChip.classList.remove('selected');
      }
      state.colorScheme.push(val);
      chip.classList.add('selected');
    }
  }

  // --- Button state ---
  function updateGenerateButton() {
    var canGenerate = state.brandName.length > 0 &&
      state.industry && state.style && state.layoutType && state.fontStyle;
    generateBtn.disabled = !canGenerate || state.isGenerating;
  }

  // --- Preview update ---
  function updatePreview() {
    var hasSelection = state.industry || state.style || state.colorScheme.length ||
      state.fontStyle || state.layoutType;

    if (!hasSelection && !state.brandName) {
      showPreviewState('empty');
      previewPrompt.style.display = 'none';
      return;
    }

    showPreviewState('template');
    renderPreviewSvg();

    // Show prompt preview
    var prompt = buildPrompt();
    if (prompt) {
      promptCode.textContent = prompt;
      previewPrompt.style.display = 'block';
      previewPrompt.querySelector('.copy-btn').dataset.copy = prompt;
    }
  }

  function renderPreviewSvg() {
    var colors = state.colorScheme.length ? getColorsForScheme(state.colorScheme[0]) : ['#D4532A'];
    var brand = state.brandName || 'Brand';
    var initial = brand.charAt(0).toUpperCase();
    var layout = state.layoutType || '图标型';

    var svg = '';
    if (layout === '图标型') {
      svg = '<circle cx="300" cy="180" r="80" fill="none" stroke="' + colors[0] + '" stroke-width="8"/><polygon points="300,120 340,200 260,200" fill="' + colors[0] + '" opacity="0.8"/>';
    } else if (layout === '文字型') {
      svg = '<text x="300" y="260" text-anchor="middle" font-family="' + getFontFamily(state.fontStyle) + '" font-size="' + (brand.length > 4 ? '56' : '72') + '" font-weight="700" fill="' + colors[0] + '" letter-spacing="0.02em">' + escapeXml(brand) + '</text>';
    } else if (layout === '徽章型') {
      svg = '<circle cx="300" cy="220" r="120" fill="none" stroke="' + colors[0] + '" stroke-width="3"/><circle cx="300" cy="220" r="108" fill="none" stroke="' + colors[0] + '" stroke-width="1" stroke-dasharray="4 3"/><text x="300" y="230" text-anchor="middle" font-family="' + getFontFamily(state.fontStyle) + '" font-size="48" font-weight="700" fill="' + colors[0] + '">' + escapeXml(initial) + '</text>';
    } else {
      svg = '<rect x="180" y="120" width="240" height="240" rx="16" fill="none" stroke="' + colors[0] + '" stroke-width="6"/><text x="300" y="200" text-anchor="middle" font-family="' + getFontFamily(state.fontStyle) + '" font-size="52" font-weight="700" fill="' + colors[0] + '">' + escapeXml(initial) + '</text><text x="300" y="320" text-anchor="middle" font-family="var(--font-body)" font-size="20" fill="' + (colors[1] || colors[0]) + '" letter-spacing="0.1em">' + escapeXml(brand) + '</text>';
    }

    previewSvg.innerHTML = svg;
  }

  function showPreviewState(st) {
    previewEmpty.style.display = st === 'empty' ? '' : 'none';
    previewTemplate.style.display = st === 'template' ? '' : 'none';
    previewLoading.style.display = st === 'loading' ? '' : 'none';
    previewResult.style.display = st === 'result' ? '' : 'none';
  }

  // --- Prompt builder ---
  function buildPrompt() {
    if (!state.industry && !state.style) return '';
    var parts = [];
    parts.push('A ' + (state.style || 'modern') + ' logo');
    if (state.industry) parts.push('for a ' + state.industry + ' brand');
    if (state.brandName) parts.push('called "' + state.brandName + '"');
    if (state.layoutType) parts.push('in a ' + state.layoutType + ' composition');
    if (state.fontStyle) parts.push('using ' + state.fontStyle + ' typography');
    if (state.extraConditions) parts.push(state.extraConditions);
    parts.push('vector logo design, centered composition, professional brand identity.');
    return parts.join(', ') + '.';
  }

  // --- Generate ---
  function generate() {
    if (state.isGenerating || generateBtn.disabled) return;

    state.isGenerating = true;
    updateGenerateButton();
    showPreviewState('loading');
    previewPrompt.style.display = 'none';

    var prompt = buildPrompt();

    // Simulate AI generation with a timed reveal
    // In production: replace with fetch() to AI API
    setTimeout(function() {
      // For now, render the template as the "result" since we have no AI API
      renderPreviewSvg();
      var svgData = previewSvg.innerHTML;

      // Create a data URL from the SVG
      var svgBlob = new Blob([
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="600" height="500">' + svgData + '</svg>'
      ], { type: 'image/svg+xml' });
      var url = URL.createObjectURL(svgBlob);

      var img = $('#resultImage');
      img.src = url;
      img.alt = '生成的 Logo - ' + state.brandName;
      img.classList.remove('reveal');
      void img.offsetWidth;
      img.classList.add('reveal');

      showPreviewState('result');

      // Show prompt
      promptCode.textContent = prompt;
      previewPrompt.style.display = 'block';
      previewPrompt.querySelector('.copy-btn').dataset.copy = prompt;

      // Add to history
      addHistory(prompt, url);

      state.isGenerating = false;
      updateGenerateButton();
    }, 2000);
  }

  // --- History ---
  function addHistory(prompt, imageUrl) {
    var item = {
      prompt: prompt,
      imageUrl: imageUrl,
      timestamp: Date.now(),
      params: Object.assign({}, state)
    };
    state.history.unshift(item);
    if (state.history.length > 20) state.history.pop();
    renderHistory();
  }

  function renderHistory() {
    if (!state.history.length) {
      historyList.innerHTML = '<p class="text-body history-empty">尚未生成任何 Logo</p>';
      return;
    }
    historyList.innerHTML = state.history.map(function(item, i) {
      return '<button class="history-item" data-index="' + i + '">' +
        '<img src="' + item.imageUrl + '" alt="历史记录 ' + (i + 1) + '" width="48" height="48" style="object-fit:contain;background:var(--color-canvas);border-radius:4px">' +
        '<span class="history-item-brand">' + escapeHtml(item.params.brandName || 'Logo') + '</span>' +
        '</button>';
    }).join('');

    historyList.querySelectorAll('.history-item').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var item = state.history[parseInt(this.dataset.index)];
        if (!item) return;
        restoreState(item.params);
      });
    });
  }

  function restoreState(params) {
    state.industry = params.industry;
    state.style = params.style;
    state.colorScheme = params.colorScheme || [];
    state.fontStyle = params.fontStyle;
    state.layoutType = params.layoutType;
    state.brandName = params.brandName;
    state.extraConditions = params.extraConditions;

    brandInput.value = state.brandName;
    $('#extraConditions').value = state.extraConditions;
    charCount.textContent = state.brandName.length + '/20';

    // Re-apply visual selections
    $$('[data-dimension] .selected').forEach(function(c) { c.classList.remove('selected'); });
    ['industry', 'style', 'fontStyle', 'layoutType'].forEach(function(dim) {
      if (state[dim]) {
        var chip = document.querySelector('[data-dimension="' + dim + '"] [data-value="' + state[dim] + '"]');
        if (chip) chip.classList.add('selected');
      }
    });
    state.colorScheme.forEach(function(cs) {
      var chip = document.querySelector('[data-dimension="colorScheme"] [data-value="' + cs + '"]');
      if (chip) chip.classList.add('selected');
    });

    updatePreview();
    updateGenerateButton();
  }

  // --- URL params ---
  function loadUrlParams() {
    var params = new URLSearchParams(window.location.search);
    var brand = params.get('brand');
    if (brand) {
      brandInput.value = brand;
      state.brandName = brand;
      charCount.textContent = brand.length + '/20';
    }
    // Set filter selections from URL params
    setFilterFromParam('industry', params.get('industry'));
    setFilterFromParam('style', params.get('style'));
    setFilterFromParam('fontStyle', params.get('font'));
    setFilterFromParam('layoutType', params.get('layout'));
    if (params.get('color')) {
      var chips = document.querySelectorAll('[data-dimension="colorScheme"] [data-value="' + params.get('color') + '"]');
      chips.forEach(function(c) { c.click(); });
    }
    updatePreview();
    updateGenerateButton();
  }

  function setFilterFromParam(dim, val) {
    if (!val) return;
    var chip = document.querySelector('[data-dimension="' + dim + '"] [data-value="' + val + '"]');
    if (chip) chip.click();
  }

  // --- Download ---
  function downloadResult() {
    var img = $('#resultImage');
    if (!img || !img.src) return;
    var a = document.createElement('a');
    a.href = img.src;
    a.download = (state.brandName || 'logo') + '-logo.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // --- Share ---
  function shareResult() {
    var url = window.location.origin + '/generator/?' + buildShareUrl();
    if (navigator.share) {
      navigator.share({ title: state.brandName + ' Logo', url: url }).catch(function() {});
    } else {
      navigator.clipboard.writeText(url).then(function() {
        var btn = $('#shareBtn');
        var orig = btn.textContent;
        btn.textContent = '✓ 链接已复制';
        setTimeout(function() { btn.textContent = orig; }, 2000);
      });
    }
  }

  function buildShareUrl() {
    var params = new URLSearchParams();
    if (state.brandName) params.set('brand', state.brandName);
    if (state.industry) params.set('industry', state.industry);
    if (state.style) params.set('style', state.style);
    if (state.colorScheme.length) params.set('color', state.colorScheme.join(','));
    if (state.fontStyle) params.set('font', state.fontStyle);
    if (state.layoutType) params.set('layout', state.layoutType);
    return params.toString();
  }

  // --- Helpers ---
  function getColorsForScheme(scheme) {
    var map = {
      '单色渐变红': ['#CF0A2C'], '单色橙': ['#FF6900'], '蓝白双色': ['#003DA5'],
      '金黑红': ['#C9A963', '#1A1A1A'], '极致黑白': ['#000000'], '红黑撞色': ['#E60012'],
      '多色跳跃': ['#325AB4', '#FF5C8A'], '胭脂粉黛': ['#C4375E'],
      '大地暖灰': ['#8B8682'], '黑白金': ['#1A1A1A', '#D4AF37'], '黄黑撞色': ['#FFD700'],
      '自然色系': ['#2E8B57'], '科技蓝渐变': ['#0066CC'], '单色强调红': ['#EE1C25'],
      '红白双色': ['#E2231A'], '蓝红双色': ['#0066FF'], '经典绿金': ['#006633'],
      '冰雪蓝白红': ['#0066CC'], '羊绒暖棕': ['#8B7355'], '茶韵暖棕': ['#5D4037'],
      '单色强调': ['#EE1C25'], '蓝粉萌系': ['#00A1D6'], '红白': ['#E60012'],
      '红白金': ['#CC0000', '#D4AF37'], '蓝天绿草': ['#0066CC'], '草原绿': ['#00A651'],
      '知乎蓝': ['#0066FF'], '科技蓝+中国红': ['#003D79'], '菜鸟橙': ['#FF6600'],
      '红黑工业': ['#E60012'], '黑+电光蓝': ['#000000', '#00D2FF'],
      '蓝金盾徽': ['#003D7A', '#D4AF37'], '科技蓝': ['#0066CC'], '美的蓝': ['#0066CC'],
      '海尔蓝': ['#0066CC'], '格力蓝': ['#003D7A'], '厨电金': ['#C9A963'],
      '商务蓝': ['#003D7A'], '医学蓝绿': ['#008080'], '星空蓝金': ['#1E3A8A'],
      '极地蓝灰': ['#00B4D8'], '彩虹四色': ['#FF6B35', '#00A8E8'], '荧光撞色': ['#FF1493', '#FFD700'],
      '深灰+暖灰': ['#2D2D2D'], '森系绿': ['#4CAF50'], '暖白': ['#FAF8F5']
    };
    return map[scheme] || ['#D4532A'];
  }

  function getFontFamily(fontStyle) {
    var map = {
      '无衬线几何': 'Inter, sans-serif', '无衬线圆角': 'Inter, sans-serif',
      '无衬线现代': 'Inter, sans-serif', '无衬线粗体': 'Inter, sans-serif',
      '无衬线极简': 'Inter, sans-serif', '无衬线动感': 'Inter, sans-serif',
      '中文宋体': "'Noto Serif SC', serif", '中文楷体': "'Noto Serif SC', serif",
      '中文书法': "'Noto Serif SC', serif"
    };
    return map[fontStyle] || 'Inter, sans-serif';
  }

  function escapeXml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // --- Mobile filter toggle ---
  function setupMobile() {
    if (window.innerWidth > 768) return;
    var toggleBtn = document.createElement('button');
    toggleBtn.className = 'filter-toggle-btn';
    toggleBtn.textContent = '筛选参数';
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.addEventListener('click', function() {
      var open = filterPanel.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', String(open));
      toggleBtn.textContent = open ? '关闭筛选' : '筛选参数';
    });
    document.querySelector('.preview-area').appendChild(toggleBtn);
  }

  // --- Start ---
  init();
  setupMobile();
})();
```

- [ ] **Step 2: Verify — Hugo build with JS**

```bash
cd /root/web-project/logo && hugo --minify --destination public && ls public/js/generator.js
```

Expected: exits 0, JS file copied to public.

- [ ] **Step 3: Commit**

```bash
cd /root/web-project/logo && git add static/js/generator.js && git commit -m "feat(logo): add generator JS state machine with filter interaction and preview

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 8: SEO taxonomy pages & sitemap

**Files:**
- Modify: `hugo.toml` (add taxonomies)
- Modify: `content/cases/_index.md` (case list page)
- Create: `layouts/_default/list.html` (taxonomy term page)

- [ ] **Step 1: Update hugo.toml — add taxonomies**

Append to `hugo.toml`:
```toml
[taxonomies]
  industry = "industries"
  style = "styles"
  colorScheme = "colorschemes"
  fontStyle = "fontstyles"
  layoutType = "layouttypes"
```

- [ ] **Step 2: Add taxonomy frontmatter to case generation script**

Update `scripts/generate-cases.sh` — replace the Python section:

The frontmatter in the generated .md files needs taxonomy terms. Update the md template in the Python script:

```python
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
```

- [ ] **Step 3: Re-generate case content files**

```bash
cd /root/web-project/logo && bash scripts/generate-cases.sh
```

- [ ] **Step 4: Create layouts/_default/list.html (taxonomy pages)**

```html
{{ define "main" }}
<section class="taxonomy-page">
  <div class="container">
    <nav class="breadcrumb">
      <a href="{{ .Site.Home.RelPermalink }}">首页</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{{ .Title }}</span>
    </nav>

    <div class="taxonomy-header">
      <h1>「{{ .Title }}」Logo 设计灵感</h1>
      <p class="text-body">{{ len .Pages }} 个案例</p>
    </div>

    <div class="case-grid">
      {{ range .Pages }}
      <article class="case-card">
        <div class="case-card-image">
          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="var(--color-canvas)" rx="4" />
            <text x="200" y="150" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-display)" font-size="48" font-weight="700" fill="{{ index .Params.colors 0 }}">{{ slicestr .Params.brand 0 2 }}</text>
          </svg>
        </div>
        <div class="case-card-body">
          <h3 class="case-card-brand">{{ .Params.brand }}</h3>
          <div class="case-card-tags">
            <span class="tag">{{ .Params.style }}</span>
            <span class="tag">{{ .Params.industry }}</span>
          </div>
        </div>
        <a href="{{ .RelPermalink }}" class="case-card-link">
          <span class="sr-only">查看详情</span>
        </a>
      </article>
      {{ end }}
    </div>
  </div>
</section>
{{ end }}

{{ define "head_extra" }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "「{{ .Title }}」Logo 设计灵感",
  "description": "浏览 {{ .Title }} 风格的品牌 Logo 设计案例，获取 AI 生成提示词。",
  "url": "{{ .Permalink }}",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {{ range $i, $p := .Pages }}
      {{ if $i }},{{ end }}
      {
        "@type": "CreativeWork",
        "position": {{ add $i 1 }},
        "name": "{{ $p.Params.brand }} Logo 设计",
        "url": "{{ $p.Permalink }}"
      }
      {{ end }}
    ]
  }
}
</script>
{{ end }}
```

- [ ] **Step 5: Build and verify taxonomy pages**

```bash
cd /root/web-project/logo && hugo --minify --destination public && ls public/industries/ && ls public/styles/ && grep -r "CollectionPage" public/ | head -3
```

Expected: taxonomy directories exist, structured data present.

- [ ] **Step 6: Commit**

```bash
cd /root/web-project/logo && git add hugo.toml scripts/generate-cases.sh content/cases/ layouts/_default/list.html && git commit -m "feat(logo): add SEO taxonomy pages and structured data for keyword landing

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 9: Responsive design & mobile polish

**Files:**
- Modify: `static/css/style.css`

- [ ] **Step 1: Append responsive CSS and remaining polish**

```css
/* === Responsive === */

/* Tablet: collapse filter panel to icon bar */
@media (max-width: 1024px) {
  .filter-panel-inner { padding: var(--space-3); }
  .filter-title { display: none; }
  .filter-group-label span { display: none; }
  .filter-group-label svg { display: none; }
  .filter-options.grid-4 { grid-template-columns: repeat(1, 1fr); }
  .filter-options.grid-3 { grid-template-columns: repeat(1, 1fr); }
  .filter-options.flow { flex-direction: column; }
  .filter-chip { font-size: 0; padding: var(--space-2); justify-content: center; min-width: 40px; min-height: 40px; }
  .font-sample .font-preview { font-size: 1rem; }
  .filter-input-group, .btn-generate { display: none; }
  .filter-group[open] .filter-input-group { display: flex; }
}

/* Mobile: stack layout, filter becomes bottom sheet */
@media (max-width: 768px) {
  .generator-layout { display: flex; flex-direction: column; height: auto; min-height: 100vh; }
  .preview-area { flex: 1; min-height: 60vh; }

  .filter-panel {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
    max-height: 70vh; overflow-y: auto;
    border-right: none; border-top: 1px solid var(--color-border);
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
    transform: translateY(100%);
    transition: transform var(--dur-normal) var(--ease-out);
  }
  .filter-panel.open { transform: translateY(0); }

  .filter-panel-inner { padding: var(--space-4); }
  .filter-title { display: block; }
  .filter-options.grid-4 { grid-template-columns: repeat(4, 1fr); gap: var(--space-1); }
  .filter-options.grid-3 { grid-template-columns: repeat(3, 1fr); gap: var(--space-1); }
  .filter-options.flow { flex-direction: row; }
  .filter-chip { font-size: 0.71875rem; padding: var(--space-1) var(--space-2); }
  .filter-group-label span { display: inline; }
  .filter-group-label svg { display: block; }
  .filter-input-group, .btn-generate { display: flex; }

  .filter-toggle-btn {
    position: fixed; bottom: var(--space-4); left: 50%; transform: translateX(-50%);
    z-index: 150; padding: var(--space-3) var(--space-5);
    background: var(--color-accent); color: #fff; border-radius: 999px;
    font-weight: 600; font-size: 0.875rem; box-shadow: var(--shadow-modal);
  }
  .filter-panel.open ~ .filter-toggle-btn { bottom: calc(70vh + var(--space-4)); }

  .hero-section { padding: var(--space-7) 0 var(--space-5); }
  .hero-title { font-size: clamp(1.75rem, 6vw, 2.5rem); }
  .hero-subtitle { font-size: 1rem; }
  .case-grid { columns: 1; }
  .case-wall-header { flex-direction: column; align-items: flex-start; }
  .case-detail-layout { grid-template-columns: 1fr; gap: var(--space-5); }
  .history-panel { display: none; }
  .site-header { height: 56px; }
  .header-inner { height: 56px; }
  .brand-text { display: none; }
}

/* Large screens: constrain max width */
@media (min-width: 1440px) {
  .container { padding: 0 var(--space-8); }
  .generator-layout { max-width: 1440px; margin: 0 auto; }
}

/* === Print === */
@media print {
  .site-header, .site-footer, .filter-panel, .history-panel, .result-actions, .btn { display: none !important; }
  .generator-layout { display: block; }
  .preview-canvas { border: none; background: #fff; }
}

/* === Scrollbar styling === */
.filter-panel::-webkit-scrollbar, .history-panel::-webkit-scrollbar { width: 4px; }
.filter-panel::-webkit-scrollbar-track, .history-panel::-webkit-scrollbar-track { background: transparent; }
.filter-panel::-webkit-scrollbar-thumb, .history-panel::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }

/* === Focus ring for filter toggle (mobile) === */
.filter-toggle-btn:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 3px; }

/* === History items === */
.history-item {
  display: flex; align-items: center; gap: var(--space-2); width: 100%;
  padding: var(--space-2); border-radius: var(--radius-sm); cursor: pointer;
  transition: background var(--dur-fast); text-align: left;
}
.history-item:hover { background: var(--color-surface); }
.history-item-brand { font-size: 0.8125rem; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* === Sitemap / Taxonomy === */
.taxonomy-page { padding: var(--space-5) 0 var(--space-9); }
.taxonomy-header { margin-bottom: var(--space-6); }
.taxonomy-header h1 { margin-bottom: var(--space-2); }
```

- [ ] **Step 2: Verify responsive — build and check media queries**

```bash
cd /root/web-project/logo && hugo --minify --destination public && grep -c "@media" public/css/style.css
```

Expected: exits 0, media queries present.

- [ ] **Step 3: Commit**

```bash
cd /root/web-project/logo && git add static/css/style.css && git commit -m "feat(logo): add responsive design CSS with mobile bottom sheet and tablet icon bar

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 10: Dynamic effects & final polish

**Files:**
- Modify: `static/js/generator.js` (scroll animations)
- Modify: `static/css/style.css` (final polish)

- [ ] **Step 1: Add scroll-triggered card animations to generator.js**

Append to `static/js/generator.js`:

```javascript
// --- Scroll-triggered animations for case wall ---
(function initScrollAnimations() {
  if (!window.IntersectionObserver) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, i) {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = (i % 10) * 60 + 'ms';
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.case-card').forEach(function(card) {
    card.style.animationPlayState = 'paused';
    observer.observe(card);
  });
})();
```

- [ ] **Step 2: Add case wall filter JS to homepage**

Append to end of `static/js/generator.js` (runs on all pages, only activates when elements exist):

```javascript
// --- Case wall style filter (homepage) ---
(function initCaseWallFilter() {
  var filterBar = document.querySelector('.case-filter-bar');
  if (!filterBar) return;

  filterBar.addEventListener('click', function(e) {
    var tag = e.target.closest('[data-filter]');
    if (!tag) return;

    // Update active state
    filterBar.querySelectorAll('.tag').forEach(function(t) {
      t.classList.remove('selected');
      t.setAttribute('aria-selected', 'false');
    });
    tag.classList.add('selected');
    tag.setAttribute('aria-selected', 'true');

    var filter = tag.dataset.filter;

    document.querySelectorAll('.case-card').forEach(function(card) {
      if (filter === 'all') {
        card.style.display = '';
        return;
      }
      var cardStyle = card.dataset.style;
      var normalizedStyle = cardStyle.replace(/\s+/g, '-').toLowerCase();
      if (normalizedStyle === filter || cardStyle === filter) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
})();
```

- [ ] **Step 3: Add finish CSS polish**

Append to `static/css/style.css`:

```css
/* === Polish: smooth focus transitions === */
input, textarea, button, select, a { transition: box-shadow var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out); }

/* === Selection styling === */
::selection { background: rgba(212, 83, 42, 0.15); color: var(--color-text); }

/* === Case card staggered delay (homepage) === */
.case-card:nth-child(1) { animation-delay: 0ms; }
.case-card:nth-child(2) { animation-delay: 80ms; }
.case-card:nth-child(3) { animation-delay: 160ms; }
.case-card:nth-child(4) { animation-delay: 240ms; }
.case-card:nth-child(5) { animation-delay: 320ms; }
.case-card:nth-child(6) { animation-delay: 400ms; }
.case-card:nth-child(7) { animation-delay: 480ms; }
.case-card:nth-child(8) { animation-delay: 560ms; }
.case-card:nth-child(9) { animation-delay: 640ms; }
.case-card:nth-child(10) { animation-delay: 720ms; }
.case-card:nth-child(n+11) { animation-delay: 800ms; }

/* === Transitions for filter chips === */
.filter-chip.selected { transition: background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out); }

/* === Card border subtle hover === */
.case-card::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  border: 1px solid transparent; transition: border-color var(--dur-normal) var(--ease-out);
  pointer-events: none;
}
.case-card:hover::after { border-color: var(--color-border); }

/* === Preview area dotted bg crossfade === */
.preview-template { transition: opacity var(--dur-normal) var(--ease-out); }
.preview-template.crossfading { opacity: 0; }
```

- [ ] **Step 4: Final Hugo build verification**

```bash
cd /root/web-project/logo && hugo --minify --destination public && echo "--- Pages ---" && find public -name "index.html" | sort && echo "--- Structured Data ---" && grep -r "application/ld+json" public/ | wc -l && echo "--- JS ---" && wc -c public/js/generator.js && echo "--- CSS ---" && wc -c public/css/style.css
```

Expected: exits 0, 50+ pages generated, structured data present, JS ~8-12KB, CSS ~10-15KB.

- [ ] **Step 5: Commit**

```bash
cd /root/web-project/logo && git add static/ && git commit -m "feat(logo): add scroll animations, case wall filter, and CSS finish polish

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Plan Summary

| Task | Component | Files Created | Files Modified |
|------|-----------|---------------|----------------|
| 1 | Hugo scaffold | 5 | 0 |
| 2 | Design tokens CSS | 1 | 0 |
| 3 | HTML base shell | 4 | 0 |
| 4 | Homepage case wall | 2 | 1 |
| 5 | Case generation + detail | 3 | 0 |
| 6 | Generator HTML | 3 | 1 |
| 7 | Generator JS | 1 | 0 |
| 8 | SEO taxonomy pages | 1 | 3 |
| 9 | Responsive CSS | 0 | 1 |
| 10 | Dynamic effects + polish | 0 | 2 |

**Total**: 20 files created, 8 files modified across 10 tasks.
