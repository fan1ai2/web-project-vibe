# Six City Sub-Pages Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign six city guide sub-pages with unique visual identities per city while keeping the warm earthy homepage primary color system.

**Architecture:** Hugo static site. `[data-city]` CSS attribute selectors on `<body>` scope per-city styles. One shared template `single.html` delegates to city-specific partials. Custom content sections as individual partials, conditionally included via frontmatter `customSections` field.

**Tech Stack:** Hugo 0.145.0, vanilla CSS (no preprocessor), Go templates

---

### Task 1: Foundation — baseof.html data-city attribute + head.html CSS link

**Files:**
- Modify: `layouts/_default/baseof.html`
- Modify: `layouts/partials/head.html`

- [ ] **Step 1: Add `data-city` and layout class to `<body>` in baseof.html**

Replace the `<body>` tag in `layouts/_default/baseof.html`:

Current:
```html
<body>
{{ partial "nav.html" . }}
```

Replace with:
```html
<body{{ if .Params.cityColor }} data-city="{{ .File.ContentBaseName }}"{{ end }}{{ if .Params.layoutStyle }} class="layout-{{ .Params.layoutStyle }}"{{ end }}>
{{ partial "nav.html" . }}
```

- [ ] **Step 2: Add city-pages.css link to head.html**

In `layouts/partials/head.html`, after the existing stylesheet line:
```
<link rel="stylesheet" href="{{ if .IsHome }}css/style.css{{ else }}../css/style.css{{ end }}">
```

Add:
```
{{ if and (ne .File.ContentBaseName "_index") (ne .Kind "home") (ne .Params.type nil) }}<link rel="stylesheet" href="../css/city-pages.css">{{ end }}
```

- [ ] **Step 3: Build Hugo to verify no breakage**

Run: `cd /root/web-project/Travel-guide && hugo --minify --destination public 2>&1`
Expected: Build succeeds, pages render without changes (CSS file doesn't exist yet, but the link is added).

- [ ] **Step 4: Commit**

```bash
cd /root/web-project/Travel-guide && git add layouts/_default/baseof.html layouts/partials/head.html && git commit -m "$(cat <<'EOF'
feat(city-pages): add data-city body attr and city-pages.css link

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Add frontmatter fields to all 6 city content files

**Files:**
- Modify: `content/cities/beijing.md`
- Modify: `content/cities/shanghai.md`
- Modify: `content/cities/guangzhou.md`
- Modify: `content/cities/chengdu.md`
- Modify: `content/cities/xian.md`
- Modify: `content/cities/hangzhou.md`

- [ ] **Step 1: Add frontmatter to beijing.md**

Insert after `type: "cities"` line:
```yaml
cityColor: "#9B2D30"
cityColorSecondary: "#C4A24E"
layoutStyle: "beijing"
customSections:
  - partial: "city-sections/beijing-axis.html"
    order: 3
```

Run:
```bash
cd /root/web-project/Travel-guide && sed -i '/^type: "cities"$/a\cityColor: "#9B2D30"\ncityColorSecondary: "#C4A24E"\nlayoutStyle: "beijing"\ncustomSections:\n  - partial: "city-sections/beijing-axis.html"\n    order: 3' content/cities/beijing.md
```

- [ ] **Step 2: Add frontmatter to shanghai.md**

```bash
cd /root/web-project/Travel-guide && sed -i '/^type: "cities"$/a\cityColor: "#3B6B8F"\ncityColorSecondary: "#D4A843"\nlayoutStyle: "magazine"\ncustomSections:\n  - partial: "city-sections/shanghai-bund.html"\n    order: 3' content/cities/shanghai.md
```

- [ ] **Step 3: Add frontmatter to guangzhou.md**

```bash
cd /root/web-project/Travel-guide && sed -i '/^type: "cities"$/a\cityColor: "#4A8C3F"\ncityColorSecondary: "#E8C44A"\nlayoutStyle: "market"\ncustomSections:\n  - partial: "city-sections/guangzhou-dimsum.html"\n    order: 3' content/cities/guangzhou.md
```

- [ ] **Step 4: Add frontmatter to chengdu.md**

```bash
cd /root/web-project/Travel-guide && sed -i '/^type: "cities"$/a\cityColor: "#C4823D"\ncityColorSecondary: "#7B9E5A"\nlayoutStyle: "teahouse"\ncustomSections:\n  - partial: "city-sections/chengdu-teahouse.html"\n    order: 3' content/cities/chengdu.md
```

- [ ] **Step 5: Add frontmatter to xian.md**

```bash
cd /root/web-project/Travel-guide && sed -i '/^type: "cities"$/a\cityColor: "#8B6914"\ncityColorSecondary: "#A04030"\nlayoutStyle: "scroll"\ncustomSections:\n  - partial: "city-sections/xian-citywall.html"\n    order: 3' content/cities/xian.md
```

- [ ] **Step 6: Add frontmatter to hangzhou.md**

```bash
cd /root/web-project/Travel-guide && sed -i '/^type: "cities"$/a\cityColor: "#5B8C5A"\ncityColorSecondary: "#8FA0A8"\nlayoutStyle: "ink"\ncustomSections:\n  - partial: "city-sections/hangzhou-westlake.html"\n    order: 3' content/cities/hangzhou.md
```

- [ ] **Step 7: Commit**

```bash
cd /root/web-project/Travel-guide && git add content/cities/ && git commit -m "$(cat <<'EOF'
feat(city-pages): add cityColor, layoutStyle, customSections frontmatter

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Create city-pages.css — scoped variables and hero styles

**Files:**
- Create: `static/css/city-pages.css`

- [ ] **Step 1: Create city-pages.css with CSS variable blocks and hero styles**

Write `static/css/city-pages.css`:

```css
/* ===== Per-City CSS Variables ===== */

[data-city="beijing"] {
  --city-primary: #9B2D30;
  --city-primary-light: #F5EAEA;
  --city-primary-dark: #7A2023;
  --city-secondary: #C4A24E;
  --city-font-heading: "Noto Serif CJK SC", "Source Han Serif SC", "Songti SC", Georgia, serif;
  --city-radius: 4px;
}

[data-city="shanghai"] {
  --city-primary: #3B6B8F;
  --city-primary-light: #EEF3F7;
  --city-primary-dark: #2D5A73;
  --city-secondary: #D4A843;
  --city-font-heading: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  --city-radius: 0px;
}

[data-city="guangzhou"] {
  --city-primary: #4A8C3F;
  --city-primary-light: #EDF5EB;
  --city-primary-dark: #3A6F32;
  --city-secondary: #E8C44A;
  --city-font-heading: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  --city-radius: 16px;
}

[data-city="chengdu"] {
  --city-primary: #C4823D;
  --city-primary-light: #FFF5EB;
  --city-primary-dark: #A0682E;
  --city-secondary: #7B9E5A;
  --city-font-heading: "Noto Serif CJK SC", "Source Han Serif SC", Georgia, serif;
  --city-radius: 8px;
}

[data-city="xian"] {
  --city-primary: #8B6914;
  --city-primary-light: #FBF5E8;
  --city-primary-dark: #6B5010;
  --city-secondary: #A04030;
  --city-font-heading: "Noto Serif CJK SC", "Source Han Serif SC", Georgia, serif;
  --city-radius: 2px;
}

[data-city="hangzhou"] {
  --city-primary: #5B8C5A;
  --city-primary-light: #EEF5ED;
  --city-primary-dark: #4A7249;
  --city-secondary: #8FA0A8;
  --city-font-heading: "Noto Serif CJK SC", "Source Han Serif SC", "Songti SC", Georgia, serif;
  --city-radius: 12px;
}

/* ===== Shared city page overrides ===== */

/* Use city colors for primary elements */
[data-city] .city-hero-bg::after {
  background: linear-gradient(to bottom, rgba(44,36,22,0.25) 0%, rgba(44,36,22,0.5) 100%);
}

[data-city] .city-section h2::after {
  background: var(--city-primary);
}

[data-city] .section-num {
  color: var(--city-primary);
}

[data-city] .city-nav a:active,
[data-city] .city-nav a:focus {
  color: var(--city-primary);
  border-bottom-color: var(--city-primary);
}

[data-city] .attraction-index {
  color: var(--city-primary);
}

[data-city] .food-price {
  color: var(--city-primary);
}

[data-city] .food-restaurant {
  background: var(--city-primary-light);
  color: var(--city-primary-dark);
}

[data-city] .itinerary-day-label {
  color: var(--city-primary);
}

[data-city] .itinerary-note {
  background: var(--city-primary-light);
}

[data-city] .faq-q:hover {
  color: var(--city-primary);
}

[data-city] .faq-q::after {
  color: var(--city-primary);
}

[data-city] .faq-item.open .faq-q {
  color: var(--city-primary);
}

[data-city] .sidebar-card h4 {
  border-left-color: var(--city-primary);
}

[data-city] .city-cta {
  background: linear-gradient(165deg, var(--city-primary-light), var(--bg));
}

[data-city] .city-cta .btn-primary {
  background: var(--city-primary);
}

[data-city] .city-cta .btn-primary:hover {
  background: var(--city-primary-dark);
}

[data-city] .transport-item h4 {
  color: var(--city-primary);
}

/* Update badge — city colored */
[data-city] .update-badge {
  background: var(--city-primary);
  border-color: var(--city-primary-dark);
}

/* ===== BEIJING layout-beijing ===== */

.layout-beijing .city-hero {
  padding: 100px 24px 80px;
}

.layout-beijing .city-hero-content h1 {
  font-family: var(--city-font-heading);
  font-weight: 400;
  letter-spacing: 0.08em;
}

.layout-beijing .city-hero-content h1::before,
.layout-beijing .city-hero-content h1::after {
  content: "";
  display: block;
  width: 60px;
  height: 2px;
  background: var(--city-secondary);
  margin: 0 auto;
}

.layout-beijing .city-hero-content h1::before {
  margin-bottom: 16px;
}

.layout-beijing .city-hero-content h1::after {
  margin-top: 16px;
}

.layout-beijing .city-section h2 {
  font-family: var(--city-font-heading);
  text-align: center;
  font-weight: 600;
}

.layout-beijing .city-section h2::after {
  margin-left: auto;
  margin-right: auto;
  background: var(--city-secondary);
}

.layout-beijing .attraction-index {
  background: var(--city-secondary);
  color: #fff;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  font-weight: 700;
  font-size: 1.2rem;
}

.layout-beijing .section:nth-child(even) {
  background: var(--bg);
}

.layout-beijing .section:nth-child(odd) {
  background: var(--white);
}

.layout-beijing .update-badge {
  background: var(--city-primary);
  border-radius: 2px;
  font-family: var(--city-font-heading);
  letter-spacing: 0.1em;
}

/* ===== SHANGHAI layout-magazine ===== */

.layout-magazine .city-hero {
  display: flex;
  min-height: 60vh;
  padding: 0;
  text-align: left;
}

.layout-magazine .city-hero-bg {
  width: 50%;
  position: relative;
  flex-shrink: 0;
}

.layout-magazine .city-hero-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px 48px;
  background: var(--white);
  color: var(--text);
}

.layout-magazine .city-hero-content h1 {
  color: var(--color-ink);
  font-family: var(--city-font-heading);
  font-weight: 800;
  letter-spacing: -0.02em;
  text-shadow: none;
  font-size: clamp(1.5rem, 4vw, 2.2rem);
}

.layout-magazine .city-hero-content .city-hero-desc {
  color: var(--text-secondary);
}

.layout-magazine .attraction-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.layout-magazine .attraction-item {
  background: var(--white);
  border-radius: var(--radius);
  padding: 24px;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition), transform var(--transition);
}

.layout-magazine .attraction-item:hover {
  box-shadow: 0 4px 20px rgba(59,107,143,0.15);
  transform: translateY(-2px);
}

.layout-magazine .city-sidebar {
  display: none;
}

/* Related cities strip */
.layout-magazine .city-layout {
  grid-template-columns: 1fr;
}

/* ===== GUANGZHOU layout-market ===== */

.layout-market .city-hero-content {
  text-align: left;
  padding-left: 24px;
}

.layout-market .city-hero-content h1 {
  text-align: left;
}

.layout-market .food-item {
  background: var(--white);
  border-radius: var(--city-radius);
  padding: 28px;
  margin-bottom: 16px;
  border-left: 4px solid var(--city-primary);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition), box-shadow var(--transition);
}

.layout-market .food-item:hover {
  transform: scale(1.01);
  box-shadow: var(--shadow);
}

.layout-market .food-restaurant {
  background: var(--city-secondary);
  color: #fff;
  border-radius: 50px;
  padding: 4px 16px;
  font-weight: 600;
}

.layout-market .attraction-item {
  padding: 24px;
  background: var(--white);
  border-radius: var(--city-radius);
  margin-bottom: 12px;
  border: 1px solid var(--border-light);
}

.layout-market .attraction-index {
  color: var(--city-primary);
  background: var(--city-primary-light);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1rem;
  font-weight: 700;
}

.layout-market .city-section#food {
  order: -1;
}

/* ===== CHENGDU layout-teahouse ===== */

.layout-teahouse .city-hero {
  min-height: 50vh;
  padding: 60px 24px;
}

.layout-teahouse .city-hero-bg::after {
  background: linear-gradient(to bottom, rgba(44,36,22,0.2) 0%, rgba(44,36,22,0.4) 100%);
}

.layout-teahouse .city-layout {
  max-width: 680px;
  margin: 0 auto;
  grid-template-columns: 1fr;
}

.layout-teahouse .city-sidebar {
  display: none;
}

.layout-teahouse .city-section {
  margin-bottom: 80px;
}

.layout-teahouse .city-section h2 {
  font-weight: 400;
  font-size: 1.25rem;
  color: var(--city-secondary);
  border-bottom: 1px solid var(--city-primary-light);
}

.layout-teahouse .city-section h2::after {
  height: 1px;
  background: var(--city-secondary);
  width: 32px;
}

.layout-teahouse .food-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.layout-teahouse .food-item {
  background: var(--white);
  border-radius: var(--city-radius);
  padding: 20px;
  text-align: center;
  border: 1px solid var(--border-light);
  transition: transform 0.3s ease;
}

.layout-teahouse .food-item:hover {
  transform: translateY(-3px);
}

.layout-teahouse .food-content h3 {
  font-size: 1rem;
  color: var(--city-primary);
}

/* ===== XI'AN layout-scroll ===== */

.layout-scroll .city-hero {
  clip-path: ellipse(150% 100% at 50% 0%);
  padding-bottom: 100px;
}

.layout-scroll .city-hero-content h1 {
  font-family: var(--city-font-heading);
  font-weight: 700;
}

.layout-scroll .city-section {
  position: relative;
}

.layout-scroll .city-section h2 {
  font-family: var(--city-font-heading);
  font-weight: 700;
}

.layout-scroll .attraction-item {
  position: relative;
  padding-left: 32px;
  border-left: 3px solid var(--city-primary);
  margin-left: 16px;
  padding-bottom: 32px;
  border-bottom: none;
}

.layout-scroll .attraction-item:last-child {
  border-left: 3px solid transparent;
}

.layout-scroll .attraction-index {
  position: absolute;
  left: -18px;
  top: 0;
  background: var(--city-primary);
  color: #fff;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  font-size: 0.85rem;
  font-weight: 700;
}

.layout-scroll .section:nth-child(odd) {
  background: var(--city-primary-light);
}

.layout-scroll .section:nth-child(even) {
  background: var(--white);
}

/* ===== HANGZHOU layout-ink ===== */

.layout-ink .city-hero {
  min-height: 50vh;
  background: linear-gradient(165deg, #e8f0e7 0%, #dce8db 50%, #cfdfce 100%);
}

.layout-ink .city-hero-bg::after {
  background: linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.35) 100%);
}

.layout-ink .city-hero-content h1 {
  color: var(--color-ink);
  font-family: var(--city-font-heading);
  font-weight: 300;
  text-shadow: none;
  letter-spacing: 0.08em;
}

.layout-ink .city-hero-content .city-hero-desc {
  color: var(--text-secondary);
  font-style: italic;
}

.layout-ink .city-layout {
  max-width: 640px;
  margin: 0 auto;
  grid-template-columns: 1fr;
}

.layout-ink .city-sidebar {
  display: none;
}

.layout-ink .city-section h2 {
  font-family: var(--city-font-heading);
  font-weight: 400;
  border-bottom: none;
  text-align: center;
  color: var(--city-primary-dark);
}

.layout-ink .city-section h2::after {
  height: 2px;
  background: linear-gradient(to right, transparent, var(--city-secondary), transparent);
  width: 120px;
  margin-left: auto;
  margin-right: auto;
}

.layout-ink .section-num {
  display: none;
}

.layout-ink .city-section p {
  max-width: 65ch;
  margin-left: auto;
  margin-right: auto;
  font-size: 1rem;
  line-height: 2;
  color: #555;
}

.layout-ink .attraction-item {
  max-width: 65ch;
  margin-left: auto;
  margin-right: auto;
  padding: 32px 0;
  border-bottom: 1px dashed var(--border);
}

/* ===== Responsive ===== */

@media (max-width: 1023px) {
  .layout-magazine .city-hero {
    flex-direction: column;
    min-height: auto;
  }

  .layout-magazine .city-hero-bg {
    width: 100%;
    min-height: 280px;
  }

  .layout-magazine .city-hero-content {
    padding: 40px 24px;
  }

  .layout-magazine .attraction-list {
    grid-template-columns: 1fr;
  }

  .layout-teahouse .food-list {
    grid-template-columns: 1fr 1fr;
  }

  .layout-beijing .city-hero-content h1::before,
  .layout-beijing .city-hero-content h1::after {
    width: 40px;
  }
}

@media (max-width: 767px) {
  .layout-teahouse .food-list {
    grid-template-columns: 1fr;
  }

  .layout-teahouse .city-layout {
    padding: 0 16px;
  }

  .layout-ink .city-layout {
    padding: 0 16px;
  }

  .layout-scroll .city-hero {
    clip-path: ellipse(200% 100% at 50% 0%);
  }
}

/* ===== Custom Section Styles ===== */

/* Beijing: Central Axis Timeline */
.city-section-axis {
  padding: 64px 0;
  overflow-x: auto;
}

.axis-timeline {
  display: flex;
  gap: 0;
  min-width: max-content;
  padding: 24px 0;
  position: relative;
}

.axis-timeline::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--city-secondary, #C4A24E);
  z-index: 0;
}

.axis-stop {
  position: relative;
  z-index: 1;
  text-align: center;
  min-width: 120px;
  padding: 0 16px;
}

.axis-stop-dot {
  width: 16px;
  height: 16px;
  background: var(--city-primary, #9B2D30);
  border: 3px solid var(--city-secondary, #C4A24E);
  border-radius: 50%;
  margin: 0 auto 12px;
}

.axis-stop-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text);
  margin-bottom: 4px;
}

.axis-stop-dist {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Shanghai: Bund Walk */
.bund-compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-top: 24px;
}

.bund-side {
  background: var(--white);
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border-light);
  padding: 24px;
}

.bund-side h4 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--city-primary);
}

.bund-side p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.8;
}

/* Guangzhou: Dim Sum Timeline */
.dimsum-slots {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 24px;
}

.dimsum-slot {
  background: var(--white);
  border-radius: var(--city-radius);
  padding: 24px 16px;
  text-align: center;
  border: 1px solid var(--border-light);
  position: relative;
  transition: transform var(--transition);
}

.dimsum-slot:hover {
  transform: translateY(-4px);
}

.dimsum-slot-time {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--city-primary);
  margin-bottom: 8px;
}

.dimsum-slot-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.dimsum-slot-dishes {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.dimsum-slot::before {
  content: "";
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--city-secondary);
}

/* Chengdu: Teahouse Cards */
.teahouse-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 24px;
}

.teahouse-card {
  background: var(--white);
  border-radius: var(--city-radius);
  overflow: hidden;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease;
}

.teahouse-card:hover {
  transform: translateY(-2px);
}

.teahouse-card-body {
  padding: 24px;
}

.teahouse-card-body h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.teahouse-card-body .teahouse-meta {
  font-size: 0.82rem;
  color: var(--city-secondary);
  font-weight: 600;
  margin-bottom: 8px;
}

.teahouse-card-body p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* Xi'an: City Wall Route */
.citywall-route {
  display: flex;
  gap: 24px;
  align-items: center;
  margin-top: 24px;
  padding: 32px;
  background: var(--white);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.citywall-map {
  flex: 1;
  min-height: 200px;
  background: var(--city-primary-light);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.citywall-map-inner {
  width: 180px;
  height: 130px;
  border: 3px solid var(--city-primary);
  position: relative;
}

.citywall-map-inner::before {
  content: "城墙 13.7km";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 700;
  color: var(--city-primary);
  font-size: 0.9rem;
  white-space: nowrap;
}

.citywall-gate {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--city-primary);
  border-radius: 50%;
}

.citywall-gate:nth-child(2) { top: -6px; left: 50%; }   /* North */
.citywall-gate:nth-child(3) { bottom: -6px; left: 50%; } /* South */
.citywall-gate:nth-child(4) { top: 50%; left: -6px; }    /* West */
.citywall-gate:nth-child(5) { top: 50%; right: -6px; }   /* East */

.citywall-stats {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.citywall-stat {
  text-align: center;
}

.citywall-stat-val {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--city-primary);
}

.citywall-stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Hangzhou: West Lake Gallery */
.westlake-gallery {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding: 24px 0;
  scrollbar-width: none;
}

.westlake-gallery::-webkit-scrollbar {
  display: none;
}

.westlake-card {
  flex: 0 0 200px;
  scroll-snap-align: start;
  background: var(--white);
  border-radius: var(--city-radius);
  overflow: hidden;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition);
}

.westlake-card:hover {
  transform: translateY(-4px);
}

.westlake-card-img {
  height: 140px;
  background-size: cover;
  background-position: center;
}

.westlake-card-body {
  padding: 16px;
}

.westlake-card-body h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}

.westlake-card-body p {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  [data-city] *,
  [data-city] *::before,
  [data-city] *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd /root/web-project/Travel-guide && git add static/css/city-pages.css && git commit -m "$(cat <<'EOF'
feat(city-pages): add per-city scoped CSS with 6 layout modes

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Refactor single.html into city section partials

**Files:**
- Modify: `layouts/_default/single.html`
- Create: `layouts/partials/city-sections/overview.html`
- Create: `layouts/partials/city-sections/attractions.html`
- Create: `layouts/partials/city-sections/food.html`
- Create: `layouts/partials/city-sections/transport.html`
- Create: `layouts/partials/city-sections/itinerary.html`
- Create: `layouts/partials/city-sections/faq.html`

- [ ] **Step 1: Create directory**

```bash
mkdir -p /root/web-project/Travel-guide/layouts/partials/city-sections
```

- [ ] **Step 2: Write overview.html partial**

Write `layouts/partials/city-sections/overview.html`:

```html
<div class="city-section">
  <h2 id="overview-heading"><span class="section-num">01</span>城市概览</h2>
  {{ range .Params.overview }}
  <p>{{ . | safeHTML }}</p>
  {{ end }}
</div>
```

- [ ] **Step 3: Write attractions.html partial**

Write `layouts/partials/city-sections/attractions.html`:

```html
<div class="city-section" id="attractions">
  <h2><span class="section-num">02</span>必去景点推荐</h2>
  <div class="attraction-list">
    {{ range $idx, $a := .Params.attractions }}
    <article class="attraction-item">
      <div class="attraction-body">
        <div class="attraction-header">
          <span class="attraction-index">{{ printf "%02d" (add $idx 1) }}</span>
          <h3>{{ .name }}</h3>
        </div>
        <p>{{ .description }}</p>
        <div class="attraction-info">
          <span>{{ .price }}</span>
          <span class="ai-sep">&middot;</span>
          <span>{{ .transport }}</span>
          <span class="ai-sep">&middot;</span>
          <span>{{ .time }}</span>
        </div>
      </div>
    </article>
    {{ end }}
  </div>
</div>
```

- [ ] **Step 4: Write food.html partial**

Write `layouts/partials/city-sections/food.html`:

```html
<div class="city-section" id="food">
  <h2><span class="section-num">03</span>美食推荐</h2>
  <div class="food-list">
    {{ range .Params.food }}
    <div class="food-item">
      <div class="food-content">
        <h3>{{ .name }}<span class="food-price">&mdash; 人均{{ .price }}</span></h3>
        <p>{{ .description }}</p>
        <div class="food-restaurant">{{ .restaurant }}</div>
      </div>
    </div>
    {{ end }}
  </div>
</div>
```

- [ ] **Step 5: Write transport.html partial**

Write `layouts/partials/city-sections/transport.html`:

```html
<div class="city-section" id="transport">
  <h2><span class="section-num">04</span>交通出行</h2>
  <div class="transport-block">
    <div class="transport-item">
      <h4>机场交通</h4>
      <p>{{ .Params.transport.airport | safeHTML }}</p>
    </div>
    <div class="transport-item">
      <h4>市内地铁</h4>
      <p>{{ .Params.transport.metro | safeHTML }}</p>
    </div>
    {{ if .Params.transport.tips }}
    <div class="transport-item">
      <h4>出行贴士</h4>
      <p>{{ .Params.transport.tips | safeHTML }}</p>
    </div>
    {{ end }}
  </div>
</div>
```

- [ ] **Step 6: Write itinerary.html partial**

Write `layouts/partials/city-sections/itinerary.html`:

```html
<div class="city-section" id="itinerary">
  <h2><span class="section-num">05</span>行程推荐</h2>
  {{ range .Params.itineraries }}
  <div class="itinerary-block">
    <h3 class="itinerary-block-title">{{ .name }}</h3>
    <div class="itinerary-days">
      {{ range $idx, $d := .days }}
      <div class="itinerary-day">
        <div class="itinerary-day-head">
          <span class="itinerary-day-label">第{{ add $idx 1 }}天</span>
          <h4>{{ .day }}</h4>
        </div>
        <p>{{ .items }}</p>
      </div>
      {{ end }}
    </div>
    {{ if .note }}<p class="itinerary-note">{{ .note }}</p>{{ end }}
  </div>
  {{ end }}
</div>
```

- [ ] **Step 7: Write faq.html partial**

Write `layouts/partials/city-sections/faq.html`:

```html
<div class="city-section" id="faq">
  <h2><span class="section-num">06</span>常见问题</h2>
  <div class="faq-list">
    {{ range $i, $f := .Params.faq }}
    <div class="faq-item">
      <div class="faq-q" onclick="var p=this.parentElement;var o=p.classList.toggle('open');this.setAttribute('aria-expanded',o)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click()}" role="button" tabindex="0" aria-expanded="false">
        <span>{{ $f.q }}</span>
      </div>
      <div class="faq-a"><p>{{ $f.a }}</p></div>
    </div>
    {{ end }}
  </div>
</div>
```

- [ ] **Step 8: Rewrite single.html main block to use partials + conditional custom sections**

Write `layouts/_default/single.html` — replace the `{{ define "main" }}` block:

```html
{{ define "main" }}
<nav aria-label="页面内导航" class="city-nav-wrapper">
  <div class="city-nav-inner">
    <ul class="city-nav">
      <li><a href="#overview">城市概览</a></li>
      <li><a href="#attractions">必去景点</a></li>
      <li><a href="#food">美食推荐</a></li>
      <li><a href="#transport">交通出行</a></li>
      <li><a href="#itinerary">行程推荐</a></li>
      <li><a href="#faq">常见问题</a></li>
    </ul>
  </div>
</nav>

<nav class="breadcrumb" aria-label="面包屑导航">
  <a href="/">首页</a><span>&rsaquo;</span>{{ .Params.cityName }}旅游攻略
</nav>

<header class="city-hero">
  <div class="city-hero-bg" style="background-image:url('/images/cities/{{ .File.ContentBaseName }}.jpg');"></div>
  <div class="city-hero-content">
    <h1>{{ .Params.title }}</h1>
    <p class="city-hero-desc">{{ .Params.description }}</p>
    <span class="update-badge">2026年6月更新</span>
  </div>
</header>

<main>
  <section class="section" id="overview" aria-labelledby="overview-heading">
    <div class="city-layout">
      <div class="city-main">
        {{ partial "city-sections/overview.html" . }}

        {{ $customAfter := dict }}
        {{ range .Params.customSections }}
          {{ if eq .order 2 }}
            {{ partial .partial $ }}
          {{ end }}
        {{ end }}

        {{ partial "city-sections/attractions.html" . }}

        {{ range .Params.customSections }}
          {{ if eq .order 3 }}
            {{ partial .partial $ }}
          {{ end }}
        {{ end }}

        {{ partial "city-sections/food.html" . }}

        {{ range .Params.customSections }}
          {{ if eq .order 4 }}
            {{ partial .partial $ }}
          {{ end }}
        {{ end }}

        {{ partial "city-sections/transport.html" . }}

        {{ range .Params.customSections }}
          {{ if eq .order 5 }}
            {{ partial .partial $ }}
          {{ end }}
        {{ end }}

        {{ partial "city-sections/itinerary.html" . }}

        {{ range .Params.customSections }}
          {{ if eq .order 6 }}
            {{ partial .partial $ }}
          {{ end }}
        {{ end }}

        {{ partial "city-sections/faq.html" . }}
      </div>

      <aside class="city-sidebar">
        <div class="sidebar-card">
          <h4>其他热门城市</h4>
          <ul class="sidebar-city-list">
            {{ range .Params.sidebarCities }}
            <li><a href="{{ .link }}">{{ .name }}</a></li>
            {{ end }}
          </ul>
        </div>
      </aside>
    </div>
  </section>

  <section class="cta-band city-cta">
    <h2>准备好探索{{ .Params.cityName }}了吗？</h2>
    <p>收藏这份攻略，出发前再看一遍行程规划，确保不错过任何精彩。</p>
    <a href="#itinerary" class="btn-primary">查看行程推荐</a>
  </section>
</main>
{{ end }}
```

- [ ] **Step 9: Commit**

```bash
cd /root/web-project/Travel-guide && git add layouts/ && git commit -m "$(cat <<'EOF'
refactor(city-pages): split single.html into modular city section partials

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Create Beijing custom section — 中轴线漫步

**Files:**
- Create: `layouts/partials/city-sections/beijing-axis.html`

- [ ] **Step 1: Write beijing-axis.html**

Write `layouts/partials/city-sections/beijing-axis.html`:

```html
<div class="city-section city-section-axis" id="axis">
  <h2><span class="section-num">&spadesuit;</span>中轴线漫步</h2>
  <p>北京中轴线全长7.8公里，北起钟鼓楼、南至永定门，2024年列入世界遗产。沿着这条线从北走到南，是理解北京最直接的方式。</p>
  <div class="axis-timeline">
    <div class="axis-stop">
      <div class="axis-stop-dot"></div>
      <div class="axis-stop-name">钟鼓楼</div>
      <div class="axis-stop-dist">0 km</div>
    </div>
    <div class="axis-stop">
      <div class="axis-stop-dot"></div>
      <div class="axis-stop-name">万宁桥</div>
      <div class="axis-stop-dist">0.5 km</div>
    </div>
    <div class="axis-stop">
      <div class="axis-stop-dot"></div>
      <div class="axis-stop-name">景山</div>
      <div class="axis-stop-dist">1.2 km</div>
    </div>
    <div class="axis-stop">
      <div class="axis-stop-dot"></div>
      <div class="axis-stop-name">故宫</div>
      <div class="axis-stop-dist">2.0 km</div>
    </div>
    <div class="axis-stop">
      <div class="axis-stop-dot"></div>
      <div class="axis-stop-name">天安门</div>
      <div class="axis-stop-dist">3.5 km</div>
    </div>
    <div class="axis-stop">
      <div class="axis-stop-dot"></div>
      <div class="axis-stop-name">正阳门</div>
      <div class="axis-stop-dist">4.5 km</div>
    </div>
    <div class="axis-stop">
      <div class="axis-stop-dot"></div>
      <div class="axis-stop-name">天坛</div>
      <div class="axis-stop-dist">6.0 km</div>
    </div>
    <div class="axis-stop">
      <div class="axis-stop-dot"></div>
      <div class="axis-stop-name">永定门</div>
      <div class="axis-stop-dist">7.8 km</div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
cd /root/web-project/Travel-guide && git add layouts/partials/city-sections/beijing-axis.html && git commit -m "$(cat <<'EOF'
feat(city-pages): add Beijing central axis custom section

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Create Shanghai custom section — 外滩漫步指南

**Files:**
- Create: `layouts/partials/city-sections/shanghai-bund.html`

- [ ] **Step 1: Write shanghai-bund.html**

Write `layouts/partials/city-sections/shanghai-bund.html`:

```html
<div class="city-section" id="bund">
  <h2><span class="section-num">&spadesuit;</span>外滩漫步指南</h2>
  <p>黄浦江把上海一分为二——浦西是百年外滩万国建筑群，浦东是陆家嘴摩天大楼森林。从外白渡桥走到十六铺码头，1.5公里的漫步穿越了上海的百年时空。</p>
  <div class="bund-compare">
    <div class="bund-side">
      <h4>浦西 · 万国建筑博览群</h4>
      <p>和平饭店（1929年，沙逊大厦）&mdash; 外滩最高的历史建筑，绿色铜皮屋顶。海关大楼（1927年）&mdash; 大钟每15分钟报时。汇丰银行大楼（1923年）&mdash; 穹顶壁画精美。外白渡桥（1907年）&mdash; 上海最老的钢桥，电影取景地。建议从北往南走，最后在金陵东路渡口花2元坐轮渡到浦东。</p>
    </div>
    <div class="bund-side">
      <h4>浦东 · 陆家嘴天际线</h4>
      <p>上海中心大厦 632m &mdash; 中国第一高楼，118层观光厅180元。环球金融中心 492m &mdash; \"开瓶器\"造型，100层观光厅150元。金茂大厦 420m &mdash; 88层观光厅120元。东方明珠 468m &mdash; 263m主观景层199元。最佳合影机位：陆家嘴环形天桥（免费），建议傍晚5:30-7:00。</p>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
cd /root/web-project/Travel-guide && git add layouts/partials/city-sections/shanghai-bund.html && git commit -m "$(cat <<'EOF'
feat(city-pages): add Shanghai Bund walk custom section

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Create Guangzhou custom section — 早茶时辰

**Files:**
- Create: `layouts/partials/city-sections/guangzhou-dimsum.html`

- [ ] **Step 1: Write guangzhou-dimsum.html**

Write `layouts/partials/city-sections/guangzhou-dimsum.html`:

```html
<div class="city-section" id="dimsum">
  <h2><span class="section-num">&spadesuit;</span>早茶时辰</h2>
  <p>广州人的一天，从一盅两件开始。早茶不只是一顿饭，是一种生活方式——虾饺、烧卖、凤爪、叉烧包、肠粉、蛋挞，一笼一笼慢慢吃，一壶茶慢慢饮。按时间段给你一份\"老广\"吃饭时间表。</p>
  <div class="dimsum-slots">
    <div class="dimsum-slot">
      <div class="dimsum-slot-time">07:30</div>
      <div class="dimsum-slot-label">早茶 · 一盅两件</div>
      <div class="dimsum-slot-dishes">虾饺、烧卖、凤爪、叉烧包、肠粉</div>
      <div style="font-size:0.78rem;margin-top:8px;color:var(--city-primary);font-weight:600;">推荐: 陶陶居 · 上下九</div>
    </div>
    <div class="dimsum-slot">
      <div class="dimsum-slot-time">12:00</div>
      <div class="dimsum-slot-label">午饭 · 老火靓汤</div>
      <div class="dimsum-slot-dishes">白切鸡、烧鹅、煲仔饭、老火汤</div>
      <div style="font-size:0.78rem;margin-top:8px;color:var(--city-primary);font-weight:600;">推荐: 广州酒家 · 文昌南路</div>
    </div>
    <div class="dimsum-slot">
      <div class="dimsum-slot-time">15:00</div>
      <div class="dimsum-slot-label">下午茶 · 糖水甜品</div>
      <div class="dimsum-slot-dishes">双皮奶、姜撞奶、杨枝甘露、芝麻糊</div>
      <div style="font-size:0.78rem;margin-top:8px;color:var(--city-primary);font-weight:600;">推荐: 南信牛奶甜品 · 第十甫路</div>
    </div>
    <div class="dimsum-slot">
      <div class="dimsum-slot-time">21:00</div>
      <div class="dimsum-slot-label">宵夜 · 镬气大排档</div>
      <div class="dimsum-slot-dishes">干炒牛河、啫啫煲、椒盐濑尿虾</div>
      <div style="font-size:0.78rem;margin-top:8px;color:var(--city-primary);font-weight:600;">推荐: 银记肠粉 · 宝华路</div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
cd /root/web-project/Travel-guide && git add layouts/partials/city-sections/guangzhou-dimsum.html && git commit -m "$(cat <<'EOF'
feat(city-pages): add Guangzhou dim sum timeline custom section

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Create Chengdu custom section — 茶馆体验

**Files:**
- Create: `layouts/partials/city-sections/chengdu-teahouse.html`

- [ ] **Step 1: Write chengdu-teahouse.html**

Write `layouts/partials/city-sections/chengdu-teahouse.html`:

```html
<div class="city-section" id="teahouse">
  <h2><span class="section-num">&spadesuit;</span>茶馆体验</h2>
  <p>成都茶馆不是\"喝茶的地方\"，是成都人的客厅、棋牌室、社交空间和发呆场所。一碗盖碗茶十几块钱可以坐一下午——掏耳朵、打麻将、嗑瓜子、看川剧变脸，这才是真正的成都生活。</p>
  <div class="teahouse-cards">
    <div class="teahouse-card">
      <div class="teahouse-card-body">
        <h4>鹤鸣茶社</h4>
        <div class="teahouse-meta">人民公园内 · 百年老茶馆 · 人均 15-30元</div>
        <p>成都现存最老的茶馆之一，1923年开业。竹椅子、方桌子、盖碗茶，人民公园的锦江水从旁边流过。点一杯碧潭飘雪或竹叶青，叫师傅掏个耳朵（30元），看大爷打麻将，就是最正宗的成都下午。</p>
      </div>
    </div>
    <div class="teahouse-card">
      <div class="teahouse-card-body">
        <h4>更多茶馆推荐</h4>
        <div class="teahouse-meta">每个都有不一样的味道</div>
        <p><strong>大慈寺茶社</strong> — 藏在太古里旁边的大慈寺里，闹中取静，一碗茶10元。<br><strong>陈锦茶社</strong> — 宽窄巷子附近，本地人多，盖碗茶15元。<br><strong>可居茶社</strong> — 锦里古街旁，可以看川剧变脸和滚灯表演，茶+演出88元。<br><strong>彭镇老茶馆</strong> — 双流区，保留着50年代的茶馆风貌，适合拍照。</p>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
cd /root/web-project/Travel-guide && git add layouts/partials/city-sections/chengdu-teahouse.html && git commit -m "$(cat <<'EOF'
feat(city-pages): add Chengdu teahouse experience custom section

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Create Xi'an custom section — 城墙骑行

**Files:**
- Create: `layouts/partials/city-sections/xian-citywall.html`

- [ ] **Step 1: Write xian-citywall.html**

Write `layouts/partials/city-sections/xian-citywall.html`:

```html
<div class="city-section" id="citywall">
  <h2><span class="section-num">&spadesuit;</span>城墙骑行</h2>
  <p>西安城墙是中国现存规模最大、保存最完整的古代城垣，全长13.74公里。在600多年历史的城墙上骑车兜一圈，俯瞰城内古建和城外现代建筑交错，是西安最独特的体验。</p>
  <div class="citywall-route">
    <div class="citywall-map">
      <div class="citywall-map-inner">
        <div class="citywall-gate"></div>
        <div class="citywall-gate"></div>
        <div class="citywall-gate"></div>
        <div class="citywall-gate"></div>
        <div class="citywall-gate"></div>
      </div>
    </div>
    <div class="citywall-stats">
      <div class="citywall-stat">
        <div class="citywall-stat-val">13.74 km</div>
        <div class="citywall-stat-label">全程长度</div>
      </div>
      <div class="citywall-stat">
        <div class="citywall-stat-val">~2 小时</div>
        <div class="citywall-stat-label">骑行时间</div>
      </div>
      <div class="citywall-stat">
        <div class="citywall-stat-val">¥45</div>
        <div class="citywall-stat-label">单车租金</div>
      </div>
      <div class="citywall-stat">
        <div class="citywall-stat-val">54元</div>
        <div class="citywall-stat-label">城墙门票</div>
      </div>
    </div>
  </div>
  <p style="font-size:0.85rem;color:var(--text-muted);margin-top:12px;"><strong>建议：</strong>下午4点后上城墙，躲过日头，骑一圈刚好赶上日落。从南门（永宁门）上城墙最方便。双人自行车90元/辆。城墙上没有遮阳处，做好防晒。</p>
</div>
```

- [ ] **Step 2: Commit**

```bash
cd /root/web-project/Travel-guide && git add layouts/partials/city-sections/xian-citywall.html && git commit -m "$(cat <<'EOF'
feat(city-pages): add Xi'an city wall cycling custom section

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Create Hangzhou custom section — 西湖十景画廊

**Files:**
- Create: `layouts/partials/city-sections/hangzhou-westlake.html`

- [ ] **Step 1: Write hangzhou-westlake.html**

Write `layouts/partials/city-sections/hangzhou-westlake.html`:

```html
<div class="city-section" id="westlake">
  <h2><span class="section-num">&spadesuit;</span>西湖十景</h2>
  <p>西湖十景始于南宋，每一景都有一个诗意的名字。春夏秋冬、晨昏雨雪，不同时节、不同时辰，西湖有十种不一样的美。</p>
  <div class="westlake-gallery">
    <div class="westlake-card">
      <div class="westlake-card-img" style="background-image:url('/images/cities/hangzhou.jpg');background-position:center;"></div>
      <div class="westlake-card-body">
        <h4>苏堤春晓</h4>
        <p>春天苏堤上桃花盛开，2.8公里漫步或骑行，湖光山色尽收眼底</p>
      </div>
    </div>
    <div class="westlake-card">
      <div class="westlake-card-img" style="background-image:url('/images/cities/hangzhou.jpg');background-position:top;"></div>
      <div class="westlake-card-body">
        <h4>断桥残雪</h4>
        <p>冬日雪后桥面半融半白，远看像桥断了。白娘子与许仙相遇的地方</p>
      </div>
    </div>
    <div class="westlake-card">
      <div class="westlake-card-img" style="background-image:url('/images/cities/hangzhou.jpg');background-position:left;"></div>
      <div class="westlake-card-body">
        <h4>曲院风荷</h4>
        <p>夏日荷花盛开，清风送来荷香与酒香。北山路沿线最佳赏荷处</p>
      </div>
    </div>
    <div class="westlake-card">
      <div class="westlake-card-img" style="background-image:url('/images/cities/hangzhou.jpg');background-position:right;"></div>
      <div class="westlake-card-body">
        <h4>平湖秋月</h4>
        <p>白堤西端，中秋之夜在平台上看月亮从湖面升起，三面环水视野开阔</p>
      </div>
    </div>
    <div class="westlake-card">
      <div class="westlake-card-img" style="background-image:url('/images/cities/hangzhou.jpg');background-position:bottom;"></div>
      <div class="westlake-card-body">
        <h4>雷峰夕照</h4>
        <p>傍晚雷峰塔在夕阳下镀上金边，对面净慈寺钟声回荡，西湖最美日落机位</p>
      </div>
    </div>
  </div>
  <p style="font-size:0.85rem;color:var(--text-muted);margin-top:16px;text-align:center;">十景之外还有：柳浪闻莺、花港观鱼、南屏晚钟、双峰插云、三潭印月。环湖一圈约15公里，骑车2小时或步行4-5小时。</p>
</div>
```

- [ ] **Step 2: Commit**

```bash
cd /root/web-project/Travel-guide && git add layouts/partials/city-sections/hangzhou-westlake.html && git commit -m "$(cat <<'EOF'
feat(city-pages): add Hangzhou West Lake gallery custom section

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Build with Hugo and verify all pages

**Files:** (verification only, no changes)

- [ ] **Step 1: Build Hugo**

Run:
```bash
cd /root/web-project/Travel-guide && hugo --minify --destination public 2>&1
```
Expected: Build succeeds with no errors. All six city pages generated.

- [ ] **Step 2: Verify data-city attributes are present in output**

Run:
```bash
grep -l 'data-city' /root/web-project/Travel-guide/public/cities/*/index.html
```
Expected: All 6 city pages listed.

- [ ] **Step 3: Verify city-pages.css is referenced**

Run:
```bash
grep 'city-pages.css' /root/web-project/Travel-guide/public/cities/beijing/index.html
```
Expected: Link tag referencing city-pages.css.

- [ ] **Step 4: Verify custom sections rendered**

Run:
```bash
grep -l 'axis-timeline\|bund-compare\|dimsum-slots\|teahouse-cards\|citywall-route\|westlake-gallery' /root/web-project/Travel-guide/public/cities/*/index.html
```
Expected: All 6 files listed (each city has its custom section).

- [ ] **Step 5: Commit**

```bash
cd /root/web-project/Travel-guide && git add public/ && git commit -m "$(cat <<'EOF'
build(city-pages): rebuild with per-city design system

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Visual QA — start dev server and review each city

- [ ] **Step 1: Start Hugo dev server**

```bash
cd /root/web-project/Travel-guide && hugo server --buildDrafts --bind=0.0.0.0 --port=8888 &
```
Wait for "Web Server is available" message.

- [ ] **Step 2: Verify Beijing page** — Open `http://localhost:8888/cities/beijing/` and check:
  - Hero uses serif font with gold decorative lines
  - Red-themed accent colors on section headings, attraction numbers, badges
  - "中轴线漫步" horizontal timeline section is visible and styled
  - Responsive at 768px and 480px widths

- [ ] **Step 3: Verify Shanghai page** — Open `http://localhost:8888/cities/shanghai/` and check:
  - Split hero (image left, text right) on desktop
  - Attractions in 2-column grid with hover shadow
  - "外滩漫步指南" split card is visible
  - Stacks to single column on mobile

- [ ] **Step 4: Verify Guangzhou page** — Open `http://localhost:8888/cities/guangzhou/` and check:
  - Food cards with green left border, warm yellow restaurant badges
  - "早茶时辰" four time-slot cards visible
  - Cards have rounded corners and hover scale effect

- [ ] **Step 5: Verify Chengdu page** — Open `http://localhost:8888/cities/chengdu/` and check:
  - Narrow centered layout (680px max)
  - Food cards in 3-column grid on desktop
  - "茶馆体验" two teahouse cards visible
  - Generous whitespace, lighter section headings

- [ ] **Step 6: Verify Xi'an page** — Open `http://localhost:8888/cities/xian/` and check:
  - Hero bottom edge is curved (clip-path ellipse)
  - Attractions have left timeline border with numbered dots
  - "城墙骑行" map + stats layout visible
  - Alternating section backgrounds (tan/white)

- [ ] **Step 7: Verify Hangzhou page** — Open `http://localhost:8888/cities/hangzhou/` and check:
  - Light hero with soft overlay
  - Narrow centered layout (640px max)
  - Section headings centered with gradient underline
  - "西湖十景" horizontal scroll gallery visible
  - Cards snap to scroll positions

- [ ] **Step 8: Kill dev server and report findings**

```bash
kill $(lsof -t -i:8888) 2>/dev/null; echo "Server stopped"
```
