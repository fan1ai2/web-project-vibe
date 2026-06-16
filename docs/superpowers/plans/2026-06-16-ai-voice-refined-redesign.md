# AI Voice Refined Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all CSS design tokens, fonts, shadows, and SVG illustrations with the clean Apple-minimal aesthetic defined in the spec — cold near-white background, glass morphism cards, Inter font, geometric abstract graphics.

**Architecture:** CSS-only visual redesign. No JS changes, no HTML structure changes, no i18n/content changes. Three CSS files get complete rewrites with new design tokens, 10 SVG partials get new geometric content, and head.html gets font swap. Hugo pipeline builds and fingerprints CSS assets automatically.

**Tech Stack:** Hugo static site, vanilla CSS custom properties, inline SVG illustrations, Google Fonts (Inter)

---

## File Responsibility Map

| File | Role | Change Type |
|------|------|-------------|
| `assets/css/main.css` | Design tokens, reset, buttons, header, footer, sections, utility | Complete rewrite |
| `assets/css/homepage.css` | Hero, steps grid, formats, scenes grid, FAQ | Complete rewrite |
| `assets/css/tool.css` | Tool header, upload area, progress, player, transcript, export, privacy | Complete rewrite |
| `layouts/partials/head.html` | Google Fonts import | Replace font name |
| `layouts/partials/header.html` | Site header with logo SVG | Update logo colors |
| `layouts/partials/illustration-hero.html` | Hero geometric graphic | Replace SVG content |
| `layouts/partials/illustration-step-1.html` | Upload step graphic | Replace SVG content |
| `layouts/partials/illustration-step-2.html` | Transcribe step graphic | Replace SVG content |
| `layouts/partials/illustration-step-3.html` | Export step graphic | Replace SVG content |
| `layouts/partials/illustration-tool-upload.html` | Tool upload zone graphic | Replace SVG content |
| `layouts/partials/illustration-scenes/*.html` | 5 use-case scene graphics | Replace SVG content each |

---

### Task 1: Replace main.css design tokens and global styles

**Files:**
- Modify: `/root/web-project/AI voice/assets/css/main.css`

- [ ] **Step 1: Write the complete replacement main.css**

Write the full file:

```css
/* === Design Tokens === */
:root {
  --color-bg: #F8F9FA;
  --color-surface: rgba(255,255,255,0.72);
  --color-surface-border: rgba(0,0,0,0.06);
  --color-accent: #FF5E3A;
  --color-accent-hover: #E84A2D;
  --color-text: #1D1D1F;
  --color-text-secondary: #6E6E73;
  --color-text-tertiary: #86868B;
  --color-border: #E8E8ED;
  --color-player-bg: #1D1D1F;
  --color-player-text: #F5F5F7;
  --color-icon-line: #D1D1D6;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --font-heading: "Inter", "SF Pro Display", "Noto Sans SC", sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans SC", sans-serif;
  --font-mono: "SF Mono", "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  --max-width: 1200px;
}

/* === Reset === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  color: var(--color-text-secondary);
  background: var(--color-bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
a { color: var(--color-text); text-decoration: none; }
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
  font-weight: 500;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s, border-color 0.2s;
  white-space: nowrap;
  padding: 10px 22px;
  font-size: 0.9375rem;
  background: #fff;
  color: var(--color-text);
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}
.btn:hover {
  border-color: rgba(0,0,0,0.2);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
  opacity: 1;
}
.btn-sm { padding: 6px 14px; font-size: 0.8125rem; }
.btn-lg { padding: 14px 32px; font-size: 1.0625rem; }

.btn-secondary {
  background: transparent;
  border: none;
  box-shadow: none;
  color: var(--color-text-secondary);
}
.btn-secondary:hover {
  color: var(--color-text);
  border: none;
  box-shadow: none;
  transform: none;
}

.btn-accent,
a.btn-accent {
  background: var(--color-accent);
  color: #fff;
  border: none;
  box-shadow: 0 1px 3px rgba(255,94,58,0.2);
}
.btn-accent:hover,
a.btn-accent:hover {
  background: var(--color-accent-hover);
  box-shadow: 0 4px 12px rgba(255,94,58,0.35);
  transform: translateY(-1px);
  opacity: 1;
}

/* === Section === */
.section { padding: 80px 0; }
.section-header {
  text-align: center;
  margin-bottom: 48px;
}
.section-title {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 12px;
  letter-spacing: -0.01em;
  line-height: 1.3;
}
.section-desc {
  font-size: 1.0625rem;
  color: var(--color-text-secondary);
  max-width: 560px;
  margin: 0 auto;
}

/* === Header === */
.site-header {
  background: rgba(248,249,250,0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
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
.logo { display: flex; align-items: center; gap: 10px; font-weight: 600; font-family: var(--font-heading); font-size: 1.125rem; color: var(--color-text); }
.logo:hover { opacity: 0.7; }
.logo-icon { flex-shrink: 0; }
.main-nav { display: flex; gap: 32px; }
.main-nav a { color: var(--color-text-secondary); font-weight: 500; font-size: 0.9375rem; }
.main-nav a:hover { color: var(--color-text); }
.header-actions { display: flex; align-items: center; gap: 14px; }
.lang-link { font-size: 0.8125rem; color: var(--color-text-tertiary); font-weight: 500; padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
.lang-link:hover { color: var(--color-text); border-color: var(--color-text); }

/* === Footer === */
.site-footer {
  background: var(--color-text);
  color: var(--color-text-tertiary);
  padding: 48px 0 32px;
}
.footer-inner { display: flex; flex-direction: column; gap: 24px; }
.footer-brand { display: flex; flex-direction: column; gap: 8px; }
.footer-logo { font-family: var(--font-heading); font-weight: 600; font-size: 1.125rem; color: #fff; }
.footer-tagline { font-size: 0.875rem; }
.footer-links { display: flex; gap: 24px; }
.footer-links a { color: var(--color-text-tertiary); font-size: 0.875rem; }
.footer-links a:hover { color: #fff; }
.footer-copy { font-size: 0.8125rem; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); }

/* === Utility === */
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* === Reduced Motion === */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  html { scroll-behavior: auto; }
}

/* === Responsive === */
@media (max-width: 768px) {
  .container { padding: 0 16px; }
  .section { padding: 48px 0; }
  .section-title { font-size: 1.5rem; }
  .main-nav { display: none; }
  .header-inner { height: 56px; }
}
```

- [ ] **Step 2: Build to verify no CSS errors**

Run: `cd "/root/web-project/AI voice" && hugo --minify 2>&1`
Expected: exit code 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add "AI voice/assets/css/main.css"
git commit -m "$(cat <<'EOF'
feat(style): replace design tokens with Apple-minimal system

Swap warm cream palette for cold near-white (#F8F9FA), Inter font,
glass morphism surface tokens, micro-shadows, new button system with
accent variant, and prefers-reduced-motion support.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Replace homepage.css

**Files:**
- Modify: `/root/web-project/AI voice/assets/css/homepage.css`

- [ ] **Step 1: Write the complete replacement homepage.css**

Write the full file:

```css
/* === Hero === */
.hero {
  padding: 120px 0 120px;
  text-align: center;
}
.illustration-hero { width: 64px; height: 64px; margin: 0 auto 32px; display: block; }
.hero-title {
  font-family: var(--font-heading);
  font-size: 3.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 16px;
  line-height: 1.15;
  letter-spacing: -0.02em;
}
.hero-desc {
  font-size: 1.25rem;
  color: var(--color-text-tertiary);
  max-width: 520px;
  margin: 0 auto 32px;
  line-height: 1.5;
  letter-spacing: -0.01em;
}
.hero .btn-accent { font-size: 1rem; padding: 14px 32px; }

/* === Steps === */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.step-card {
  text-align: center;
  padding: 40px 28px;
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s, transform 0.2s;
}
.step-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.illustration-step { width: 48px; height: 48px; margin: 0 auto 20px; display: block; }
.step-title {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
  line-height: 1.3;
}
.step-desc { font-size: 0.9375rem; color: var(--color-text-secondary); max-width: 260px; margin: 0 auto; line-height: 1.6; }

/* === Formats === */
.formats-section { background: transparent; }
.formats-text {
  text-align: center;
  font-size: 0.9375rem;
  color: var(--color-text-tertiary);
  max-width: 640px;
  margin: 0 auto;
  line-height: 1.8;
}

/* === Scenes === */
.scenes-section { background: transparent; }
.scenes-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 48px;
}
.scene-card { text-align: center; padding: 0; }
.illustration-scene { width: 56px; height: 56px; margin: 0 auto 16px; display: block; }
.scene-label {
  font-family: var(--font-heading);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

/* === FAQ === */
.faq-section { padding-top: 0; }
.faq-list { max-width: 640px; margin: 0 auto; }
.faq-item {
  border-bottom: 0.5px solid var(--color-border);
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
  color: var(--color-text-tertiary);
  font-weight: 400;
}
.faq-item[open] .faq-question::after { content: "\2212"; }
.faq-answer {
  padding: 0 0 18px;
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

/* === Responsive === */
@media (max-width: 768px) {
  .hero { padding: 80px 0 64px; }
  .hero-title { font-size: 2rem; }
  .hero-desc { font-size: 1.0625rem; }
  .steps-grid { grid-template-columns: 1fr; gap: 16px; }
  .scenes-grid { grid-template-columns: repeat(3, 1fr); gap: 32px; }
}
@media (max-width: 480px) {
  .scenes-grid { grid-template-columns: repeat(2, 1fr); }
}
```

- [ ] **Step 2: Build to verify**

Run: `cd "/root/web-project/AI voice" && hugo --minify 2>&1`
Expected: exit code 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add "AI voice/assets/css/homepage.css"
git commit -m "$(cat <<'EOF'
feat(style): rewrite homepage with glass cards, new typography, micro-shadows

Hero at 3.5rem/600, step cards with glass surface + hover lift,
scenes as bare labels with geometric icons, FAQ with 0.5px dividers.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Replace tool.css

**Files:**
- Modify: `/root/web-project/AI voice/assets/css/tool.css`
- Modify: `/root/web-project/AI voice/layouts/partials/upload-zone.html` (lines 12-16, file icon SVG colors)
- Modify: `/root/web-project/AI voice/layouts/_default/tool.html` (lines 16-18, privacy badge SVG)

- [ ] **Step 1: Write the complete replacement tool.css**

Write the full file:

```css
/* === Tool Header === */
.tool-section { padding: 48px 0 80px; }
.tool-header { text-align: center; margin-bottom: 40px; }
.tool-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}
.tool-desc { font-size: 1.0625rem; color: var(--color-text-secondary); }

/* === Upload Area === */
.upload-area {
  max-width: 560px;
  margin: 0 auto 32px;
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: 48px 24px;
  text-align: center;
  position: relative;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
}
.upload-area.drag-over {
  background: #fff;
  border-color: rgba(0,0,0,0.15);
  box-shadow: var(--shadow-md);
  transition: none;
}
.upload-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.illustration-upload { width: 48px; height: 48px; margin: 0 auto 16px; display: block; }
.upload-text { font-family: var(--font-heading); font-size: 1.0625rem; font-weight: 500; color: var(--color-text-secondary); margin-bottom: 8px; }
.upload-text-secondary { font-size: 0.8125rem; color: var(--color-text-tertiary); }

/* File Info */
.file-info { display: flex; align-items: center; gap: 14px; text-align: left; margin-bottom: 24px; }
.file-details { display: flex; flex-direction: column; gap: 4px; }
.file-name { font-weight: 600; color: var(--color-text); font-size: 0.9375rem; }
.file-meta { font-size: 0.8125rem; color: var(--color-text-tertiary); }
#btnTranscribe { margin: 0 auto; display: inline-flex; }

/* Progress Dots */
.progress-dots { display: flex; justify-content: center; gap: 16px; margin-bottom: 16px; }
.progress-dot {
  width: 12px; height: 12px;
  border-radius: 50%;
  border: 1.5px solid var(--color-icon-line);
  background: transparent;
  transition: background 0.3s, border-color 0.3s;
}
.progress-dot.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
}
.progress-status { font-size: 0.875rem; color: var(--color-text-tertiary); font-weight: 400; }

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
.player-times { display: flex; align-items: center; gap: 4px; font-size: 0.8125rem; font-family: var(--font-mono); white-space: nowrap; }
.player-separator { color: var(--color-text-tertiary); }
.player-time-total { color: var(--color-text-tertiary); }
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
  background: rgba(255,255,255,0.15);
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
.speed-label { font-size: 0.75rem; color: var(--color-text-tertiary); }
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
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: 28px;
  min-height: 160px;
}
.transcript-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  color: var(--color-text-tertiary);
  font-size: 0.9375rem;
}
.transcript-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
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
.transcript-segment:hover { background: rgba(0,0,0,0.02); }
.transcript-segment.active {
  background: rgba(0,0,0,0.02);
  border-left-color: var(--color-text);
}
.segment-time {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
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
}
.segment-speaker::before { display: none; }
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
.export-label { font-size: 0.8125rem; font-weight: 500; color: var(--color-text-tertiary); }

/* === Privacy Badge === */
.privacy-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--color-text-tertiary);
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

- [ ] **Step 2: Update file info icon in upload-zone.html**

Edit lines 12-16 — old file icon uses `#2D2D2D` stroke-width 2. Replace with geometric style `#D1D1D6` stroke-width 1.5:

Old:
```html
<svg class="file-info-icon" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <rect x="10" y="6" width="20" height="28" rx="3" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="16" y1="16" x2="24" y2="16" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
  <line x1="16" y1="22" x2="24" y2="22" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
</svg>
```

New:
```html
<svg class="file-info-icon" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <rect x="10" y="6" width="20" height="28" rx="3" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="15" y1="14" x2="25" y2="14" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="15" y1="20" x2="25" y2="20" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 3: Update privacy badge SVG in tool.html**

Edit lines 16-18 — old shield icon. Replace with geometric lock icon per spec (lock body + shackle, ~14x14, 1.5px, `#86868B`):

Old:
```html
<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
  <path d="M8 1L2 4v5c0 3.5 2.5 6 6 7 3.5-1 6-3.5 6-7V4L8 1z"/>
</svg>
```

New:
```html
<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
  <rect x="3" y="7" width="8" height="6" rx="1.5" stroke="#86868B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5 7V4.5C5 3.12 6.12 2 7.5 2C8.88 2 10 3.12 10 4.5V7" stroke="#86868B" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 4: Build to verify**

Run: `cd "/root/web-project/AI voice" && hugo --minify 2>&1`
Expected: exit code 0, no errors.

- [ ] **Step 5: Commit**

```bash
git add "AI voice/assets/css/tool.css" "AI voice/layouts/partials/upload-zone.html" "AI voice/layouts/_default/tool.html"
git commit -m "$(cat <<'EOF'
feat(style): rewrite tool page with glass upload zone, dark player, clean transcript

Glass morphism upload card, #1D1D1F player base, accent seek thumb,
3px left border active segment indicator, mono timestamps, no speaker dots.
Update file icon and privacy lock to geometric SVG style.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Replace Google Font in head.html

**Files:**
- Modify: `/root/web-project/AI voice/layouts/partials/head.html` (line 27)

- [ ] **Step 1: Replace Rounded Mplus 1c with Inter**

Edit line 27 — change the Google Fonts URL:

Old:
```html
<link href="https://fonts.googleapis.com/css2?family=Rounded+Mplus+1c:wght@400;700&display=swap" rel="stylesheet">
```

New:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Build to verify**

Run: `cd "/root/web-project/AI voice" && hugo --minify 2>&1`
Expected: exit code 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add "AI voice/layouts/partials/head.html"
git commit -m "$(cat <<'EOF'
feat(font): swap Rounded Mplus 1c for Inter (400/500/600/700)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Update header logo SVG colors

**Files:**
- Modify: `/root/web-project/AI voice/layouts/partials/header.html` (logo SVG, lines 4-9)

- [ ] **Step 1: Replace logo SVG with monochrome version**

Change the logo SVG. Old logo uses purple `#4F46E5` fill. New logo uses `#1D1D1F` base with `#FF5E3A` accent, matching the design system:

Old lines 4-9:
```html
<svg class="logo-icon" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#4F46E5"/>
  <path d="M8 14.5C8 12.015 10.015 10 12.5 10V10C14.985 10 17 12.015 17 14.5V16H8V14.5Z" fill="white" opacity="0.9"/>
  <path d="M15 16V18.5C15 20.985 17.015 23 19.5 23V23C21.985 23 24 20.985 24 18.5V16H15Z" fill="white" opacity="0.7"/>
  <path d="M8 18H15V20H10C8.895 20 8 19.105 8 18Z" fill="white" opacity="0.5"/>
</svg>
```

New:
```html
<svg class="logo-icon" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#1D1D1F"/>
  <path d="M8 14.5C8 12.015 10.015 10 12.5 10V10C14.985 10 17 12.015 17 14.5V16H8V14.5Z" fill="white" opacity="0.9"/>
  <path d="M15 16V18.5C15 20.985 17.015 23 19.5 23V23C21.985 23 24 20.985 24 18.5V16H15Z" fill="#FF5E3A" opacity="0.85"/>
  <path d="M8 18H15V20H10C8.895 20 8 19.105 8 18Z" fill="white" opacity="0.5"/>
</svg>
```

- [ ] **Step 2: Build to verify**

Run: `cd "/root/web-project/AI voice" && hugo --minify 2>&1`
Expected: exit code 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add "AI voice/layouts/partials/header.html"
git commit -m "$(cat <<'EOF'
feat(logo): update logo colors to new design system

Replace purple fill with #1D1D1F and accent with #FF5E3A.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Replace Hero + 3 Step SVG illustrations

**Files:**
- Modify: `/root/web-project/AI voice/layouts/partials/illustration-hero.html`
- Modify: `/root/web-project/AI voice/layouts/partials/illustration-step-1.html`
- Modify: `/root/web-project/AI voice/layouts/partials/illustration-step-2.html`
- Modify: `/root/web-project/AI voice/layouts/partials/illustration-step-3.html`

- [ ] **Step 1: Write illustration-hero.html (64x64 geometric)**

Two offset concentric circles + three staggered small dots. Line 1.5px, color `#D1D1D6`.

```html
<svg class="illustration illustration-hero" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="30" cy="30" r="20" stroke="#D1D1D6" stroke-width="1.5"/>
  <circle cx="34" cy="27" r="14" stroke="#D1D1D6" stroke-width="1.5"/>
  <circle cx="18" cy="38" r="2.5" fill="#D1D1D6"/>
  <circle cx="46" cy="22" r="2" fill="#D1D1D6"/>
  <circle cx="40" cy="44" r="1.8" fill="#D1D1D6"/>
</svg>
```

- [ ] **Step 2: Write illustration-step-1.html (48x48 upload)**

Arrow + dashed ring. Line 1.5px, color `#D1D1D6`.

```html
<svg class="illustration illustration-step" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="22" r="14" stroke="#D1D1D6" stroke-width="1.5" stroke-dasharray="4 3" stroke-linecap="round"/>
  <path d="M24 28 L24 10" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M17 17 L24 10 L31 17" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 3: Write illustration-step-2.html (48x48 transcribe waveform)**

Waveform zigzag lines. Line 1.5px, color `#D1D1D6`.

```html
<svg class="illustration illustration-step" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <polyline points="8,28 12,28 16,16 20,36 24,20 28,32 32,24 36,28 40,28" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="6" y1="28" x2="8" y2="28" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="40" y1="28" x2="42" y2="28" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 4: Write illustration-step-3.html (48x48 document + checkmark)**

Document outline + checkmark. Line 1.5px, color `#D1D1D6`.

```html
<svg class="illustration illustration-step" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="6" width="28" height="36" rx="3" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="16" y1="16" x2="32" y2="16" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="16" y1="23" x2="28" y2="23" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <polyline points="16,32 21,37 32,28" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 5: Build to verify**

Run: `cd "/root/web-project/AI voice" && hugo --minify 2>&1`
Expected: exit code 0, no errors.

- [ ] **Step 6: Commit**

```bash
git add "AI voice/layouts/partials/illustration-hero.html"
git add "AI voice/layouts/partials/illustration-step-1.html"
git add "AI voice/layouts/partials/illustration-step-2.html"
git add "AI voice/layouts/partials/illustration-step-3.html"
git commit -m "$(cat <<'EOF'
feat(svg): replace hero and step illustrations with geometric abstract graphics

Offset concentric circles for hero, dashed-ring upload, waveform zigzag
for transcribe, document+checkmark for export. All 1.5px #D1D1D6 lines.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Replace tool upload SVG illustration

**Files:**
- Modify: `/root/web-project/AI voice/layouts/partials/illustration-tool-upload.html`

- [ ] **Step 1: Write illustration-tool-upload.html (48x48 geometric upload icon)**

Hollow circle + up arrow. Line 1.5px, color `#D1D1D6`.

```html
<svg class="illustration illustration-upload" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="24" r="16" stroke="#D1D1D6" stroke-width="1.5"/>
  <path d="M24 32 L24 12" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M17 19 L24 12 L31 19" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 2: Build to verify**

Run: `cd "/root/web-project/AI voice" && hugo --minify 2>&1`
Expected: exit code 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add "AI voice/layouts/partials/illustration-tool-upload.html"
git commit -m "$(cat <<'EOF'
feat(svg): replace tool upload icon with geometric circle+arrow

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Replace 5 scene SVG illustrations

**Files:**
- Modify: `/root/web-project/AI voice/layouts/partials/illustration-scenes/student.html`
- Modify: `/root/web-project/AI voice/layouts/partials/illustration-scenes/podcaster.html`
- Modify: `/root/web-project/AI voice/layouts/partials/illustration-scenes/journalist.html`
- Modify: `/root/web-project/AI voice/layouts/partials/illustration-scenes/enterprise.html`
- Modify: `/root/web-project/AI voice/layouts/partials/illustration-scenes/legal.html`

- [ ] **Step 1: Write student.html (56x56 — stacked books + circle)**

Three stacked horizontal bars + small circle above. Line 1.5px, color `#D1D1D6`.

```html
<svg class="illustration illustration-scene" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <line x1="12" y1="28" x2="44" y2="28" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="14" y1="34" x2="42" y2="34" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="16" y1="40" x2="40" y2="40" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="28" cy="16" r="4" stroke="#D1D1D6" stroke-width="1.5"/>
</svg>
```

- [ ] **Step 2: Write podcaster.html (56x56 — concentric ripple arcs + center circle)**

Three concentric arc pairs + center dot. Line 1.5px, color `#D1D1D6`.

```html
<svg class="illustration illustration-scene" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 18 Q28 6 42 18" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M10 24 Q28 8 46 24" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M6 30 Q28 10 50 30" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="28" cy="34" r="4" stroke="#D1D1D6" stroke-width="1.5"/>
</svg>
```

- [ ] **Step 3: Write journalist.html (56x56 — rectangle + crossed lines + triangle)**

Rectangle with two interior crossing lines + small triangle arrow. Line 1.5px, color `#D1D1D6`.

```html
<svg class="illustration illustration-scene" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="14" width="28" height="26" rx="2" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="16" y1="24" x2="32" y2="24" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="16" y1="30" x2="28" y2="30" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M38 18 L44 14 L46 16 L40 20" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M40 16 L44 14" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 4: Write enterprise.html (56x56 — two offset overlapping rounded squares + connector)**

Two offset overlapping rounded rectangles + small connecting line. Line 1.5px, color `#D1D1D6`.

```html
<svg class="illustration illustration-scene" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="18" width="20" height="20" rx="4" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="24" y="14" width="20" height="20" rx="4" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="28" y1="32" x2="24" y2="38" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 5: Write legal.html (56x56 — vertical rectangle + three horizontal lines + side bar)**

Vertical rectangle with three interior lines + left vertical bar. Line 1.5px, color `#D1D1D6`.

```html
<svg class="illustration illustration-scene" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <line x1="14" y1="10" x2="14" y2="46" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <rect x="20" y="10" width="24" height="36" rx="2" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="26" y1="20" x2="38" y2="20" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="26" y1="28" x2="38" y2="28" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="26" y1="36" x2="34" y2="36" stroke="#D1D1D6" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 6: Build to verify**

Run: `cd "/root/web-project/AI voice" && hugo --minify 2>&1`
Expected: exit code 0, no errors.

- [ ] **Step 7: Commit**

```bash
git add "AI voice/layouts/partials/illustration-scenes/student.html"
git add "AI voice/layouts/partials/illustration-scenes/podcaster.html"
git add "AI voice/layouts/partials/illustration-scenes/journalist.html"
git add "AI voice/layouts/partials/illustration-scenes/enterprise.html"
git add "AI voice/layouts/partials/illustration-scenes/legal.html"
git commit -m "$(cat <<'EOF'
feat(svg): replace 5 scene illustrations with geometric abstract graphics

Student (stacked bars), podcaster (ripple arcs), journalist (rectangle+crosshair),
enterprise (offset squares), legal (lined document+bar). All 1.5px #D1D1D6.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Final build, visual verification, and cleanup

- [ ] **Step 1: Clean build from scratch**

Run: `cd "/root/web-project/AI voice" && rm -rf public && hugo --minify 2>&1`
Expected: exit code 0, no errors or warnings.

- [ ] **Step 2: Verify output HTML references new font and correct CSS paths**

Run: `head -15 "/root/web-project/AI voice/public/index.html"`
Expected: Should see `Inter` in the Google Fonts link, and fingerprinted CSS files referenced.

- [ ] **Step 3: Start dev server and do spot checks**

Run: `cd "/root/web-project/AI voice" && hugo server --bind 0.0.0.0 --port 1313 &`

Check in browser (if available):
- Homepage: `http://localhost:1313/` — verify `#F8F9FA` background, Inter font, glass step cards, geometric hero icon, orange CTA button
- Tool page: `http://localhost:1313/tool/` — verify glass upload card, dark player bar, accent seek thumb
- Hover step cards — verify lift effect + shadow expansion
- Hover CTA button — verify orange darkens + shadow expands
- Resize to 375px — verify responsive layout

- [ ] **Step 4: Stop dev server and commit if clean**

Run: `pkill hugo`

No code changes in this step — just verification. If issues found, fix and re-commit the relevant file.

---

## Spec Coverage Checklist

| Spec Section | Task(s) | Status |
|-------------|---------|--------|
| Color system + CSS tokens | Task 1 | Covered |
| Typography + Inter font | Tasks 1, 4 | Covered |
| Button system (Primary/Secondary/Accent) | Task 1 | Covered |
| Homepage Hero | Tasks 2, 6 | Covered |
| Homepage Step cards (glass) | Tasks 2, 6 | Covered |
| Homepage Formats (text-only) | Task 2 | Covered |
| Homepage Scenes (no cards) | Tasks 2, 8 | Covered |
| Homepage FAQ (0.5px dividers) | Task 2 | Covered |
| Tool upload area (glass, drag states) | Tasks 3, 7 | Covered |
| Tool progress dots | Task 3 | Covered |
| Tool audio player (dark, accent seek) | Task 3 | Covered |
| Tool transcript panel (glass, 3px bar) | Task 3 | Covered |
| Tool export bar (primary buttons) | Task 3 | Covered |
| Tool privacy badge | Task 3 | Covered |
| Geometric SVG system (10 icons) | Tasks 6, 7, 8 | Covered |
| prefers-reduced-motion | Task 1 | Covered |
| Header glass + logo colors | Tasks 1, 5 | Covered |
| Responsive breakpoints | Tasks 1, 2, 3 | Covered |
| Remove old colors/fonts/shadows | All tasks | Covered |
