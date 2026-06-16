# AI Voice — 手绘线稿插画风重设计 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all visuals of the existing AI voice Hugo project with a hand-drawn illustration style — warm cream palette, outline buttons, SVG line-art illustrations, no purple/gradient/pricing.

**Architecture:** Modify existing CSS files (design tokens, homepage, tool) and layout partials. Add 9 new SVG illustration partials. JS modules get minor selector updates for the new progress UI. i18n, content, data, and JS logic remain unchanged.

**Tech Stack:** Hugo, vanilla CSS/JS, inline SVG

---

### Task 1: Design Tokens + Main CSS + Font

**Files:**
- Modify: `AI voice/assets/css/main.css` (full rewrite of tokens, buttons, shared styles)
- Modify: `AI voice/layouts/partials/head.html` (add Google Fonts link)

- [ ] **Step 1: Rewrite main.css with new design tokens and styles**

Write `/root/web-project/AI voice/assets/css/main.css`:

```css
/* === Design Tokens === */
:root {
  --color-primary: #2D2D2D;
  --color-accent: #E8734A;
  --color-accent-light: #FFF0E8;
  --color-bg: #FAF7F2;
  --color-surface: #FFFFFF;
  --color-surface-raised: #FBF9F6;
  --color-text: #1A1A1A;
  --color-text-body: #6B6561;
  --color-text-muted: #A09890;
  --color-border: #E8E3DC;
  --color-player-bg: #1E293B;
  --color-player-text: #E2E8F0;
  --color-illustration-line: #2D2D2D;
  --color-illustration-accent: #E8734A;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --shadow-card: none;
  --shadow-card-hover: none;
  --shadow-lg: none;
  --font-heading: "Rounded Mplus 1c", "Noto Sans SC", "Noto Sans", sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans SC", sans-serif;
  --max-width: 1200px;
}

/* === Reset === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  color: var(--color-text-body);
  background: var(--color-bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
a { color: var(--color-primary); text-decoration: none; }
a:hover { opacity: 0.7; }
img { max-width: 100%; display: block; }
ul { list-style: none; }

/* === Container === */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
}

/* === Buttons === */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-body);
  font-weight: 600;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid var(--color-primary);
  white-space: nowrap;
  background: transparent;
  color: var(--color-primary);
  padding: 10px 24px;
  font-size: 0.9375rem;
}
.btn:hover {
  background: var(--color-primary);
  color: #fff;
  transform: translateY(-1px);
}
.btn-sm { padding: 6px 14px; font-size: 0.8125rem; }
.btn-lg { padding: 14px 32px; font-size: 1.0625rem; }
.btn-outline {
  background: transparent;
  border-color: var(--color-border);
  color: var(--color-text-body);
}
.btn-outline:hover {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: #fff;
}

/* === Section === */
.section { padding: 80px 0; }
.section-header {
  text-align: center;
  margin-bottom: 48px;
}
.section-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 12px;
}
.section-desc {
  font-size: 1.0625rem;
  color: var(--color-text-body);
  max-width: 560px;
  margin: 0 auto;
}

/* === Header === */
.site-header {
  background: rgba(250,247,242,0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.logo { display: flex; align-items: center; gap: 10px; font-weight: 700; font-family: var(--font-heading); font-size: 1.25rem; color: var(--color-text); }
.logo:hover { opacity: 0.7; }
.logo-icon { flex-shrink: 0; }
.main-nav { display: flex; gap: 32px; }
.main-nav a { color: var(--color-text-body); font-weight: 500; font-size: 0.9375rem; }
.main-nav a:hover { color: var(--color-text); }
.header-actions { display: flex; align-items: center; gap: 14px; }
.lang-link { font-size: 0.8125rem; color: var(--color-text-muted); font-weight: 500; padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
.lang-link:hover { color: var(--color-text); border-color: var(--color-text); }

/* === Footer === */
.site-footer {
  background: var(--color-text);
  color: var(--color-text-muted);
  padding: 48px 0 32px;
}
.footer-inner { display: flex; flex-direction: column; gap: 24px; }
.footer-brand { display: flex; flex-direction: column; gap: 8px; }
.footer-logo { font-family: var(--font-heading); font-weight: 700; font-size: 1.125rem; color: #fff; }
.footer-tagline { font-size: 0.875rem; }
.footer-links { display: flex; gap: 24px; }
.footer-links a { color: var(--color-text-muted); font-size: 0.875rem; }
.footer-links a:hover { color: #fff; }
.footer-copy { font-size: 0.8125rem; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); }

/* === Utility === */
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* === Responsive === */
@media (max-width: 768px) {
  .container { padding: 0 16px; }
  .section { padding: 48px 0; }
  .section-title { font-size: 1.5rem; }
  .main-nav { display: none; }
  .header-inner { height: 56px; }
}
```

- [ ] **Step 2: Add Google Font to head.html**

In `/root/web-project/AI voice/layouts/partials/head.html`, add BEFORE the first `<link rel="stylesheet"` line:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rounded+Mplus+1c:wght@400;700&display=swap" rel="stylesheet">
```

- [ ] **Step 3: Commit**

```bash
cd "/root/web-project/AI voice" && git add assets/css/main.css layouts/partials/head.html && git commit -m "$(cat <<'EOF'
refactor: replace design tokens with warm cream palette and outline buttons

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: SVG Illustrations — Homepage

**Files:**
- Create: `AI voice/layouts/partials/illustration-hero.html`
- Create: `AI voice/layouts/partials/illustration-step-1.html`
- Create: `AI voice/layouts/partials/illustration-step-2.html`
- Create: `AI voice/layouts/partials/illustration-step-3.html`
- Create: `AI voice/layouts/partials/illustration-scenes/student.html`
- Create: `AI voice/layouts/partials/illustration-scenes/podcaster.html`
- Create: `AI voice/layouts/partials/illustration-scenes/journalist.html`
- Create: `AI voice/layouts/partials/illustration-scenes/enterprise.html`
- Create: `AI voice/layouts/partials/illustration-scenes/legal.html`

- [ ] **Step 1: Create illustration partials directory**

```bash
mkdir -p "/root/web-project/AI voice/layouts/partials/illustration-scenes"
```

- [ ] **Step 2: Write hero illustration**

Write `/root/web-project/AI voice/layouts/partials/illustration-hero.html`:

```html
<svg class="illustration illustration-hero" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Desk -->
  <line x1="60" y1="210" x2="340" y2="210" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="80" y1="210" x2="80" y2="240" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="320" y1="210" x2="320" y2="240" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>

  <!-- Person head -->
  <circle cx="200" cy="85" r="28" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <!-- Person body -->
  <path d="M170 140 C170 115,230 115,230 140" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round" fill="none"/>
  <line x1="200" y1="165" x2="200" y2="195" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <!-- Arms -->
  <path d="M170 150 L150 175 L140 168" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M230 150 L250 175 L260 168" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Sound waves (accent color) -->
  <path d="M145 115 Q134 108,134 98 Q134 88,145 81" stroke="#E8734A" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M135 125 Q118 110,118 98 Q118 86,135 71" stroke="#E8734A" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.7"/>
  <path d="M125 135 Q102 112,102 98 Q102 84,125 61" stroke="#E8734A" stroke-width="1" stroke-linecap="round" fill="none" opacity="0.4"/>

  <!-- Text lines -->
  <line x1="255" y1="75" x2="295" y2="75" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="255" y1="85" x2="305" y2="85" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="255" y1="95" x2="285" y2="95" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>

  <!-- Arrow from waves to text -->
  <path d="M152 98 L248 80" stroke="#E8734A" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="5 3"/>
</svg>
```

- [ ] **Step 3: Write step illustrations**

Write `/root/web-project/AI voice/layouts/partials/illustration-step-1.html`:

```html
<svg class="illustration illustration-step" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="24" y="35" width="32" height="26" rx="3" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <path d="M30 22 L40 12 L50 22" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="40" y1="12" x2="40" y2="35" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="25" y1="45" x2="55" y2="45" stroke="#E8734A" stroke-width="2" stroke-linecap="round"/>
</svg>
```

Write `/root/web-project/AI voice/layouts/partials/illustration-step-2.html`:

```html
<svg class="illustration illustration-step" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="40" cy="30" r="14" stroke="#2D2D2D" stroke-width="2" stroke-dasharray="4 3"/>
  <path d="M33 24 Q38 16,44 23 Q48 28,40 36 Q32 28,33 24Z" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M25 50 Q33 42,40 48 Q47 54,55 46" stroke="#E8734A" stroke-width="2" stroke-linecap="round"/>
</svg>
```

Write `/root/web-project/AI voice/layouts/partials/illustration-step-3.html`:

```html
<svg class="illustration illustration-step" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="18" y="22" width="44" height="38" rx="3" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="26" y1="32" x2="54" y2="32" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="26" y1="40" x2="54" y2="40" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="26" y1="48" x2="44" y2="48" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <path d="M61 56 L52 48" stroke="#E8734A" stroke-width="2" stroke-linecap="round"/>
  <path d="M57 56 L61 60 L66 54" stroke="#E8734A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 4: Write scene illustrations**

Write `/root/web-project/AI voice/layouts/partials/illustration-scenes/student.html`:

```html
<svg class="illustration illustration-scene" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="14" y="28" width="52" height="32" rx="2" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="22" y1="38" x2="58" y2="38" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="22" y1="46" x2="48" y2="46" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <circle cx="48" cy="64" r="8" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="48" y1="72" x2="48" y2="76" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <path d="M38 72 L48 72 L38 72Z" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
</svg>
```

Write `/root/web-project/AI voice/layouts/partials/illustration-scenes/podcaster.html`:

```html
<svg class="illustration illustration-scene" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="34" cy="28" r="14" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <path d="M16 50 Q20 34,34 34 Q48 34,52 50" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="34" y1="42" x2="34" y2="58" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <path d="M52 44 Q58 38,64 40" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <path d="M58 42 Q60 36,62 34" stroke="#E8734A" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M56 46 Q58 42,60 40" stroke="#E8734A" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

Write `/root/web-project/AI voice/layouts/partials/illustration-scenes/journalist.html`:

```html
<svg class="illustration illustration-scene" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="24" y="20" width="32" height="42" rx="2" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="30" y1="30" x2="50" y2="30" stroke="#2D2D2D" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="30" y1="37" x2="50" y2="37" stroke="#2D2D2D" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="30" y1="44" x2="46" y2="44" stroke="#2D2D2D" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M33 66 L36 62 L38 65 L42 58 L44 63 L47 60" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14 68 L30 62" stroke="#E8734A" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

Write `/root/web-project/AI voice/layouts/partials/illustration-scenes/enterprise.html`:

```html
<svg class="illustration illustration-scene" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="14" y="30" width="52" height="34" rx="2" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="14" y1="46" x2="66" y2="46" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <rect x="22" y="38" width="10" height="8" stroke="#2D2D2D" stroke-width="1.5" stroke-linecap="round"/>
  <rect x="48" y="38" width="10" height="8" stroke="#2D2D2D" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="30" cy="18" r="8" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <circle cx="50" cy="18" r="8" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
</svg>
```

Write `/root/web-project/AI voice/layouts/partials/illustration-scenes/legal.html`:

```html
<svg class="illustration illustration-scene" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="16" width="8" height="46" rx="1" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <rect x="28" y="16" width="32" height="46" rx="2" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="26" x2="56" y2="26" stroke="#2D2D2D" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="32" y1="34" x2="56" y2="34" stroke="#2D2D2D" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="32" y1="42" x2="50" y2="42" stroke="#2D2D2D" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M32 50 L42 54 L56 50" stroke="#E8734A" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 5: Commit**

```bash
cd "/root/web-project/AI voice" && git add layouts/partials/illustration-hero.html layouts/partials/illustration-step-*.html layouts/partials/illustration-scenes/ && git commit -m "$(cat <<'EOF'
feat: add hand-drawn SVG illustrations for homepage hero, steps, and scenes

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Homepage Layout + CSS

**Files:**
- Modify: `AI voice/layouts/_default/home.html` (full rewrite)
- Modify: `AI voice/assets/css/homepage.css` (full rewrite)

- [ ] **Step 1: Rewrite home.html**

Write `/root/web-project/AI voice/layouts/_default/home.html`:

```html
{{ define "main" }}

<!-- Hero -->
<section class="hero">
  <div class="container">
    {{ partial "illustration-hero.html" . }}
    <h1 class="hero-title">{{ i18n "hero_title" }}</h1>
    <p class="hero-desc">{{ i18n "hero_subtitle" }}</p>
    <a href="{{ "tool" | relLangURL }}" class="btn btn-lg">{{ i18n "hero_cta" }}</a>
  </div>
</section>

<!-- How It Works -->
<section class="section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">如何使用</h2>
    </div>
    <div class="steps-grid">
      <div class="step-card">
        {{ partial "illustration-step-1.html" . }}
        <h3 class="step-title">{{ i18n "step_upload_title" }}</h3>
        <p class="step-desc">{{ i18n "step_upload_desc" }}</p>
      </div>
      <div class="step-card">
        {{ partial "illustration-step-2.html" . }}
        <h3 class="step-title">{{ i18n "step_transcribe_title" }}</h3>
        <p class="step-desc">{{ i18n "step_transcribe_desc" }}</p>
      </div>
      <div class="step-card">
        {{ partial "illustration-step-3.html" . }}
        <h3 class="step-title">{{ i18n "step_export_title" }}</h3>
        <p class="step-desc">{{ i18n "step_export_desc" }}</p>
      </div>
    </div>
  </div>
</section>

<!-- Supported Formats -->
<section class="section formats-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">支持的格式</h2>
    </div>
    <p class="formats-text">
      {{ delimit .Site.Data.site.formats_audio ", " }} &nbsp;·&nbsp; {{ delimit .Site.Data.site.formats_video ", " }}
    </p>
  </div>
</section>

<!-- Use Cases -->
<section class="section scenes-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">应用场景</h2>
    </div>
    <div class="scenes-grid">
      <div class="scene-card">
        {{ partial "illustration-scenes/student.html" . }}
        <span class="scene-label">{{ i18n "usecase_students_title" }}</span>
      </div>
      <div class="scene-card">
        {{ partial "illustration-scenes/podcaster.html" . }}
        <span class="scene-label">{{ i18n "usecase_podcasters_title" }}</span>
      </div>
      <div class="scene-card">
        {{ partial "illustration-scenes/journalist.html" . }}
        <span class="scene-label">{{ i18n "usecase_journalists_title" }}</span>
      </div>
      <div class="scene-card">
        {{ partial "illustration-scenes/enterprise.html" . }}
        <span class="scene-label">{{ i18n "usecase_enterprise_title" }}</span>
      </div>
      <div class="scene-card">
        {{ partial "illustration-scenes/legal.html" . }}
        <span class="scene-label">{{ i18n "usecase_legal_title" }}</span>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section faq-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">常见问题</h2>
    </div>
    <div class="faq-list">
      {{ range .Site.Data.site.faq_items }}
      <details class="faq-item">
        <summary class="faq-question">{{ i18n (printf "faq_%s" .) }}</summary>
        <p class="faq-answer">{{ i18n (printf "faq_a%s" .) }}</p>
      </details>
      {{ end }}
    </div>
  </div>
</section>

{{ end }}
```

- [ ] **Step 2: Rewrite homepage.css**

Write `/root/web-project/AI voice/assets/css/homepage.css`:

```css
/* === Hero === */
.hero {
  padding: 80px 0 64px;
  text-align: center;
}
.illustration-hero { width: 100%; max-width: 400px; height: auto; margin: 0 auto 32px; display: block; }
.hero-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 12px;
  line-height: 1.3;
  letter-spacing: -0.01em;
}
.hero-desc {
  font-size: 1.125rem;
  color: var(--color-text-body);
  max-width: 480px;
  margin: 0 auto 28px;
  line-height: 1.7;
}
.hero .btn-lg { font-size: 1rem; padding: 12px 30px; }

/* === Steps === */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
}
.step-card { text-align: center; padding: 0; }
.illustration-step { width: 80px; height: 80px; margin: 0 auto 20px; display: block; }
.step-title {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}
.step-desc { font-size: 0.9375rem; color: var(--color-text-body); max-width: 280px; margin: 0 auto; line-height: 1.6; }

/* === Formats === */
.formats-section { background: transparent; }
.formats-text {
  text-align: center;
  font-size: 1rem;
  color: var(--color-text-muted);
  max-width: 640px;
  margin: 0 auto;
  line-height: 1.8;
}

/* === Scenes === */
.scenes-section { background: transparent; }
.scenes-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 32px;
}
.scene-card {
  text-align: center;
  padding: 0;
}
.illustration-scene { width: 80px; height: 80px; margin: 0 auto 12px; display: block; }
.scene-label {
  font-family: var(--font-heading);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text);
}

/* === FAQ === */
.faq-section { padding-top: 0; }
.faq-list { max-width: 640px; margin: 0 auto; }
.faq-item {
  border-bottom: 1px solid var(--color-border);
  padding: 0;
  margin: 0;
  background: transparent;
  border-radius: 0;
}
.faq-question {
  padding: 18px 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-body);
}
.faq-question::after {
  content: "+";
  font-size: 1.25rem;
  color: var(--color-text-muted);
  font-weight: 400;
}
.faq-item[open] .faq-question::after { content: "−"; }
.faq-answer {
  padding: 0 0 18px;
  font-size: 0.9375rem;
  color: var(--color-text-body);
  line-height: 1.7;
}

/* === Responsive === */
@media (max-width: 768px) {
  .hero { padding: 48px 0 40px; }
  .hero-title { font-size: 1.75rem; }
  .hero-desc { font-size: 1rem; }
  .steps-grid { grid-template-columns: 1fr; gap: 32px; }
  .scenes-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; }
}
@media (max-width: 480px) {
  .scenes-grid { grid-template-columns: repeat(2, 1fr); }
}
```

- [ ] **Step 3: Commit**

```bash
cd "/root/web-project/AI voice" && git add layouts/_default/home.html assets/css/homepage.css && git commit -m "$(cat <<'EOF'
refactor: redesign homepage with illustrations, remove pricing, warm layout

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Tool Page — Upload Zone Redesign

**Files:**
- Modify: `AI voice/layouts/partials/upload-zone.html` (rewrite)
- Create: `AI voice/layouts/partials/illustration-tool-upload.html`

- [ ] **Step 1: Write tool upload illustration**

Write `/root/web-project/AI voice/layouts/partials/illustration-tool-upload.html`:

```html
<svg class="illustration illustration-upload" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="16" y="36" width="16" height="4" rx="1" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <path d="M24 36 L24 10" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <path d="M16 18 L24 10 L32 18" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="8" y="20" width="32" height="16" rx="3" stroke="#2D2D2D" stroke-width="2" stroke-dasharray="4 3" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 2: Rewrite upload-zone.html**

Write `/root/web-project/AI voice/layouts/partials/upload-zone.html`:

```html
<div class="upload-area" id="uploadArea">
  <input type="file" id="fileInput" class="upload-input" accept="audio/*,video/*,.mp3,.wav,.m4a,.aac,.flac,.ogg,.amr,.mp4,.mov,.mkv,.avi">

  <div class="upload-initial" id="uploadInitial">
    {{ partial "illustration-tool-upload.html" . }}
    <p class="upload-text">{{ i18n "upload_drop_text" }}</p>
    <p class="upload-text-secondary">{{ i18n "upload_format_hint" }}</p>
  </div>

  <div class="upload-selected" id="uploadSelected" style="display:none">
    <div class="file-info">
      <svg class="file-info-icon" width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="10" y="6" width="20" height="28" rx="3" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
        <line x1="16" y1="16" x2="24" y2="16" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
        <line x1="16" y1="22" x2="24" y2="22" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <div class="file-details">
        <span class="file-name" id="fileName"></span>
        <span class="file-meta"><span id="fileDuration"></span> &middot; <span id="fileSize"></span></span>
      </div>
    </div>
    <button class="btn" id="btnTranscribe">{{ i18n "btn_transcribe" }}</button>
  </div>

  <div class="upload-progress" id="uploadProgress" style="display:none">
    <div class="progress-dots" id="progressDots">
      <span class="progress-dot" data-step="0"></span>
      <span class="progress-dot" data-step="1"></span>
      <span class="progress-dot" data-step="2"></span>
      <span class="progress-dot" data-step="3"></span>
    </div>
    <p class="progress-status" id="progressStatus"></p>
  </div>
</div>
```

- [ ] **Step 3: Commit**

```bash
cd "/root/web-project/AI voice" && git add layouts/partials/upload-zone.html layouts/partials/illustration-tool-upload.html && git commit -m "$(cat <<'EOF'
refactor: redesign upload zone with SVG illustration and progress dots

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Tool Page CSS + Player Accent

**Files:**
- Modify: `AI voice/assets/css/tool.css` (full rewrite)

- [ ] **Step 1: Rewrite tool.css**

Write `/root/web-project/AI voice/assets/css/tool.css`:

```css
/* === Tool Header === */
.tool-section { padding: 48px 0 80px; }
.tool-header { text-align: center; margin-bottom: 40px; }
.tool-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}
.tool-desc { font-size: 1.0625rem; color: var(--color-text-body); }

/* === Upload Area === */
.upload-area {
  max-width: 560px;
  margin: 0 auto 32px;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 48px 24px;
  text-align: center;
  position: relative;
}
.upload-area.drag-over { background: #FFF6EE; }
.upload-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.illustration-upload { width: 48px; height: 48px; margin: 0 auto 16px; display: block; }
.upload-text { font-family: var(--font-heading); font-size: 1.0625rem; font-weight: 600; color: var(--color-text); margin-bottom: 8px; }
.upload-text-secondary { font-size: 0.8125rem; color: var(--color-text-muted); }

/* File Info */
.file-info { display: flex; align-items: center; gap: 14px; text-align: left; margin-bottom: 24px; }
.file-details { display: flex; flex-direction: column; gap: 4px; }
.file-name { font-weight: 600; color: var(--color-text); font-size: 0.9375rem; }
.file-meta { font-size: 0.8125rem; color: var(--color-text-muted); }
#btnTranscribe { margin: 0 auto; display: inline-flex; }

/* Progress Dots */
.progress-dots { display: flex; justify-content: center; gap: 16px; margin-bottom: 16px; }
.progress-dot {
  width: 14px; height: 14px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: transparent;
  transition: all 0.3s ease;
}
.progress-dot.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
}
.progress-status { font-size: 0.875rem; color: var(--color-text-body); font-weight: 500; }

/* === Player === */
.player-bar {
  max-width: 560px;
  margin: 0 auto 24px;
  background: var(--color-player-bg);
  border-radius: var(--radius-lg);
  padding: 14px 20px;
}
.player-controls {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--color-player-text);
}
.player-btn {
  background: none;
  border: none;
  color: var(--color-player-text);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 36px; height: 36px;
  transition: background 0.15s;
}
.player-btn:hover { background: rgba(255,255,255,0.1); }
.player-times { display: flex; align-items: center; gap: 4px; font-size: 0.8125rem; font-family: "SF Mono", "Fira Code", monospace; white-space: nowrap; }
.player-separator { color: var(--color-text-muted); }
.player-time-total { color: var(--color-text-muted); }
.player-seek {
  flex: 1;
  position: relative;
  height: 28px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.seek-track {
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
  position: relative;
  overflow: visible;
}
.seek-progress {
  height: 100%;
  width: 0%;
  background: var(--color-accent);
  border-radius: 2px;
  transition: width 0.1s linear;
  position: relative;
}
.seek-progress::after {
  content: "";
  position: absolute;
  right: -4px;
  top: -3px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-accent);
}
.player-speed { display: flex; align-items: center; gap: 6px; }
.speed-label { font-size: 0.75rem; color: var(--color-text-muted); }
.speed-select {
  background: rgba(255,255,255,0.1);
  color: var(--color-player-text);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  font-size: 0.8125rem;
  cursor: pointer;
  font-family: var(--font-body);
}

/* === Transcript Panel === */
.transcript-panel {
  max-width: 560px;
  margin: 0 auto 24px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 28px;
  min-height: 160px;
}
.transcript-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  color: var(--color-text-muted);
  font-size: 0.9375rem;
}
.transcript-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}
.transcript-segments { display: flex; flex-direction: column; gap: 2px; }
.transcript-segment {
  display: flex;
  gap: 14px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.15s;
  border-left: 3px solid transparent;
}
.transcript-segment:hover { background: #FAF9F7; }
.transcript-segment.active {
  background: #FFF6EE;
  border-left-color: var(--color-text);
}
.segment-time {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-family: "SF Mono", "Fira Code", monospace;
  white-space: nowrap;
  padding-top: 2px;
  min-width: 44px;
}
.segment-body { flex: 1; }
.segment-speaker {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.segment-speaker::before {
  content: "";
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  flex-shrink: 0;
}
.segment-speaker.speaker-2::before { background: #C48B6D; }
.segment-text { font-size: 0.9375rem; color: var(--color-text); line-height: 1.65; }

/* === Export Bar === */
.export-bar {
  max-width: 560px;
  margin: 0 auto 32px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.export-label { font-size: 0.8125rem; font-weight: 600; color: var(--color-text-muted); }

/* === Privacy Badge === */
.privacy-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  width: fit-content;
  margin: 0 auto;
}

/* === Responsive === */
@media (max-width: 768px) {
  .player-controls { flex-wrap: wrap; gap: 10px; }
  .player-seek { order: 10; width: 100%; }
  .transcript-panel { padding: 20px 14px; }
  .transcript-segment { flex-direction: column; gap: 4px; }
  .upload-area { padding: 32px 16px; }
}
```

- [ ] **Step 2: Commit**

```bash
cd "/root/web-project/AI voice" && git add assets/css/tool.css && git commit -m "$(cat <<'EOF'
refactor: redesign tool page CSS with warm palette and accent dots

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: JavaScript Updates

**Files:**
- Modify: `AI voice/assets/js/upload.js` (progress dots instead of bar)
- Modify: `AI voice/assets/js/simulate.js` (speaker bullet color)

- [ ] **Step 1: Update upload.js progress logic**

In `/root/web-project/AI voice/assets/js/upload.js`, replace the progress-bar related code in the `btnTranscribe` click handler.

Find the section starting with `var statuses = ['status_detecting'...` and replace the entire interval logic with:

```javascript
    var statuses = ['status_detecting', 'status_transcribing', 'status_timestamps', 'status_complete'];
    var dots = document.querySelectorAll('.progress-dot');
    var i = 0;
    var statusInterval = setInterval(function () {
      if (i >= statuses.length) {
        clearInterval(statusInterval);
        uploadProgress.style.display = 'none';
        playerBar.style.display = 'block';
        transcriptPanel.style.display = 'block';
        transcriptEmpty.style.display = 'none';
        transcriptContent.style.display = 'block';
        exportBar.style.display = 'flex';

        if (typeof window.SoundWiseSimulate !== 'undefined') {
          window.SoundWiseSimulate.loadTranscript();
        }
        if (typeof window.SoundWisePlayer !== 'undefined') {
          window.SoundWisePlayer.init();
        }
        return;
      }

      var key = statuses[i];
      progressStatus.textContent = getI18n(key);
      for (var d = 0; d < dots.length; d++) {
        dots[d].classList.toggle('active', d <= i);
      }
      i++;
    }, 900);
```

Also remove the `var progressBar` line at the top of the function, and add `var dots` is now inside the handler — no need to declare at top.

- [ ] **Step 2: Update simulate.js speaker text color**

In `/root/web-project/AI voice/assets/js/simulate.js`, no changes needed for speaker colors (handled by CSS). But remove the word-level spans since we're no longer doing per-word marking.

In `renderSegments()`, change:
```javascript
      var wordsHtml = seg.text.split('').map(function (ch) {
        return '<span class="segment-word" data-seg="' + idx + '">' + ch + '</span>';
      }).join('');
```
To just:
```javascript
      var wordsHtml = seg.text;
```

This simplifies the DOM and aligns with the "整行点击跳转" design.

- [ ] **Step 3: Commit**

```bash
cd "/root/web-project/AI voice" && git add assets/js/upload.js assets/js/simulate.js && git commit -m "$(cat <<'EOF'
refactor: update JS for progress dots and simplified transcript rendering

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Build Verification

**Files:** (none new, verify build output)

- [ ] **Step 1: Run Hugo build**

```bash
cd "/root/web-project/AI voice" && hugo --minify
```

Expected: Build succeeds. Verify output contains:
- `public/zh-cn/index.html` — check for absence of pricing section, presence of illustration SVGs
- `public/zh-cn/tool/index.html` — check progress dots markup replacing progress bar
- `public/en/` equivalents

- [ ] **Step 2: Fix any build errors**

If Hugo fails, read the error, fix the issue, and retry until clean.

- [ ] **Step 3: Commit any final fixes**

```bash
cd "/root/web-project/AI voice" && git add -A && git diff --cached --stat
# Only commit if there are changes
```

---

## Plan Self-Review

**1. Spec coverage:**
- [x] Color system overhaul → Task 1 (main.css tokens)
- [x] Font system (Rounded Mplus 1c) → Task 1 (head.html)
- [x] Button system (outline-based) → Task 1 (main.css buttons)
- [x] Homepage hero with illustration → Task 2 (hero SVG) + Task 3 (home.html)
- [x] Step illustrations ×3 → Task 2 (step SVGs) + Task 3 (home.html)
- [x] Scene illustrations ×5 → Task 2 (scene SVGs) + Task 3 (home.html)
- [x] Format tags (text-only) → Task 3 (home.html + CSS)
- [x] FAQ (no cards) → Task 3 (home.html + CSS)
- [x] Remove pricing → Task 3 (home.html)
- [x] Tool upload zone redesign → Task 4 (upload-zone.html + illustration)
- [x] Progress dots → Task 4 (upload-zone.html) + Task 6 (JS)
- [x] Player accent (warm orange) → Task 5 (tool.css)
- [x] Transcript speaker dots → Task 5 (tool.css) + Task 6 (JS simplify)
- [x] Export bar outline buttons → Task 5 (tool.css)
- [x] Privacy badge no-background → Task 5 (tool.css)
- [x] Illustrations all inline SVG → Task 2 + Task 4

**2. Placeholder scan:** No TBDs, TODOs, or incomplete code. All code blocks are concrete.

**3. Type consistency:**
- CSS class names: `.illustration-*`, `.step-card`, `.scene-card`, `.progress-dot` consistent across layouts and CSS
- JS selectors: `.progress-dot` replaces old `#progressBar` references — verified in Task 6
- No renamed functions or mismatched signatures

