# FreeOCR.AI Clone — Design Specification

**Date**: 2026-06-16
**Status**: Draft
**Target**: Hugo static site deployed as `/root/web-project/free-ocr/`

## 1. Product Positioning

A free, browser-based online OCR tool targeting Chinese-speaking users. Pure frontend demo with Tesseract.js for real OCR recognition, showcasing full feature UI with API upgrade path. Bilingual (zh/en) via Hugo i18n.

**Key differentiators**: zero-install, privacy-first (all processing local), Markdown + LaTeX + table output format, SEO-optimized content pages.

## 2. Architecture

### 2.1 Tech Stack

| Layer | Choice | Loading |
|-------|--------|---------|
| Static generator | Hugo v0.145 extended | — |
| CSS | Tailwind CSS v4 | CDN |
| Interactivity | Alpine.js | CDN |
| OCR engine | Tesseract.js v5 | CDN (lazy) |
| Markdown render | marked.js | CDN |
| Code highlight | highlight.js | CDN |
| LaTeX render | KaTeX | CDN |
| Fonts | Inter + Noto Sans SC | Google Fonts CDN |

All dependencies via CDN. Zero build step beyond `hugo --minify`.

### 2.2 Project Structure

```
free-ocr/
├── hugo.toml
├── content/
│   ├── _index.md              # zh homepage (defaultContentLanguage=zh)
│   ├── tool.md                # zh tool page
│   ├── faq.md                 # zh FAQ
│   ├── blog/
│   │   ├── _index.md
│   │   └── introduction.md
│   └── en/
│       ├── _index.md
│       ├── tool.md
│       ├── faq.md
│       └── blog/
├── layouts/
│   ├── _default/
│   │   ├── baseof.html
│   │   ├── home.html
│   │   ├── single.html
│   │   └── list.html
│   ├── partials/
│   │   ├── head.html
│   │   ├── header.html
│   │   ├── footer.html
│   │   ├── tool-uploader.html
│   │   ├── tool-result.html
│   │   └── structured-data.html
│   └── shortcodes/
│       └── formula.html
├── static/
│   └── images/                # demo sample images
├── i18n/
│   ├── zh.yaml
│   └── en.yaml
├── data/
│   └── features.yaml
└── assets/
```

### 2.3 Page Routes

```
/                    → zh homepage
/en/                 → en homepage
/tool/               → zh OCR tool
/en/tool/            → en OCR tool
/faq/                → zh FAQ
/en/faq/             → en FAQ
/blog/               → zh blog list
/en/blog/            → en blog list
/blog/<slug>/        → zh blog post
/en/blog/<slug>/     → en blog post
```

Default language: `zh`. Hugo auto-generates hreflang tags and sitemap.

## 3. Page Design

### 3.1 Homepage (`/`)

```
┌────────────────────────────────────────────┐
│ Header (logo + nav + lang switch)           │
├────────────────────────────────────────────┤
│ Hero: "免费在线 OCR 图片文字识别工具"        │
│ Sub: "浏览器端识别，隐私安全，无需注册"       │
│ CTA: [立即使用] → /tool/                    │
│       [快速体验] → scroll to demo samples   │
├────────────────────────────────────────────┤
│ Features: 4 cards (icon + title + desc)     │
│  - 浏览器本地识别 / 隐私安全                │
│  - 支持多格式 Markdown 输出                 │
│  - 数学公式 LaTeX + 表格保留               │
│  - 多语言支持 100+ 语言                     │
├────────────────────────────────────────────┤
│ How it works: 3 steps (1-2-3 numbered)      │
│  Step 1: 上传或粘贴图片                     │
│  Step 2: AI 自动识别文字                     │
│  Step 3: 复制或下载结果                      │
├────────────────────────────────────────────┤
│ CTA banner: "开始使用免费 OCR" → /tool/     │
├────────────────────────────────────────────┤
│ Footer (links: 工具/FAQ/博客, copyright)     │
└────────────────────────────────────────────┘
```

### 3.2 Tool Page (`/tool/`)

Core interactive page. Two-panel layout on desktop, stacked on mobile.

```
┌─────────────────────────────────────────────┐
│ Header                                       │
├──────────────┬──────────────────────────────┤
│ Upload Panel │ Result Panel                 │
│              │                              │
│ [Drop zone]  │ [Tab: Preview | Raw | Source] │
│ or click     │                              │
│ or Ctrl+V    │ Markdown rendered content    │
│              │ with tables & LaTeX          │
│ [Thumbnail]  │                              │
│              │ [Copy] [Download .md]        │
│ Demo samples │                              │
│ (3 images)   │                              │
├──────────────┴──────────────────────────────┤
│ Footer                                       │
└─────────────────────────────────────────────┘
```

**States**:
- `idle` — upload zone + demo samples visible
- `loading` — progress bar, "识别中..." animation
- `result` — result panel populated, tabs active
- `error` — error message with retry button

**Demo samples**: 3 pre-loaded images (text document, table, formula) showcasing best-case results. User can click any to instantly see output without waiting for real OCR.

### 3.3 FAQ Page (`/faq/`)

5-8 Q&A items. FAQPage JSON-LD schema. Topics:
- What formats are supported?
- Is it really free?
- Are my images stored?
- What languages does it support?
- How accurate is handwriting recognition?
- What's the max image size?

### 3.4 Blog (`/blog/`)

Initial post: "Introduction to FreeOCR.AI" — tool overview and usage guide.
List page: card grid with post title, date, excerpt.

## 4. Component Design

### 4.1 Upload Zone

- Border-dashed drop area, `ondragover`/`ondrop` handlers
- Hidden `<input type="file" accept="image/*">`
- `paste` event listener on `document`
- Preview thumbnail on image load
- Demo sample buttons below zone

**Accessibility**: keyboard operable (Enter/Space to open file dialog), `role="button"`, `aria-label`

### 4.2 Result Panel

Three tabs managed by Alpine.js `x-show`:

| Tab | Content | Renderer |
|-----|---------|----------|
| Preview | Rendered Markdown | marked.js + KaTeX |
| Raw | Plain text in `<pre>` | editable contenteditable |
| Source | Markdown source | highlight.js code block |

**Copy button**: `navigator.clipboard.writeText()`
**Download button**: generates `.md` blob → triggers download

### 4.3 OCR Engine Integration

```js
// ocr-engine.js — modular, swappable
const OcrEngine = {
  mode: 'tesseract', // 'tesseract' | 'api' (future)

  async recognize(imageData) {
    if (this.mode === 'tesseract') {
      return this.tesseractRecognize(imageData);
    }
    // future: return this.apiRecognize(imageData);
  },

  async tesseractRecognize(imageData) {
    const worker = await Tesseract.createWorker('chi_sim+eng');
    const { data } = await worker.recognize(imageData);
    await worker.terminate();
    return { text: data.text, confidence: data.confidence };
  }
};
```

API upgrade path: swap `mode` to `'api'`, implement `apiRecognize()` with fetch().

### 4.4 Demo Mode

`demoData` object in JS containing 3 pre-written results (markdown with tables, LaTeX formulas). When user clicks a demo sample, skip Tesseract, directly render demo result. User uploads trigger real Tesseract path.

## 5. i18n Strategy

Hugo native i18n via `i18n/zh.yaml` and `i18n/en.yaml`. All UI strings keyed.

```yaml
# i18n/zh.yaml
- id: hero_title
  translation: "免费在线 OCR 图片文字识别工具"
- id: hero_subtitle
  translation: "浏览器端识别，隐私安全，无需注册"
- id: cta_try
  translation: "立即使用"
- id: upload_drop
  translation: "拖拽图片到此处，或点击上传"
- id: upload_paste
  translation: "也可以直接 Ctrl+V 粘贴图片"
```

Language switcher in header: `{{ range .AllTranslations }}` loop.

## 6. SEO Strategy

### 6.1 Per-Page Meta

Every page gets unique `<title>` and `<meta name="description">` via Hugo frontmatter.

### 6.2 Structured Data

| Page | Schema Type |
|------|-------------|
| Homepage | WebSite + Organization |
| Tool | HowTo (3 steps) + SoftwareApplication |
| FAQ | FAQPage |
| Blog post | Article + BreadcrumbList |

All via `layouts/partials/structured-data.html` with conditional logic.

### 6.3 Technical SEO

- `hreflang` tags auto-generated by Hugo
- `sitemap.xml` auto-generated by Hugo
- `robots.txt` in `static/`
- Semantic HTML: `<main>`, `<article>`, `<section>`, `<nav>`, heading hierarchy (h1→h2→h3) strict descending
- Images: `loading="lazy"`, `decoding="async"`, `alt` text
- Canonical URLs set
- Open Graph tags: `og:title`, `og:description`, `og:image`, `og:type`

### 6.4 Target Keywords

- 免费OCR、在线OCR、图片转文字、OCR工具
- 图片文字识别、OCR在线工具
- free OCR, online OCR, image to text

## 7. Feature Checklist

### MVP (Current Demo)

- [ ] Image upload via click
- [ ] Image upload via drag & drop
- [ ] Image upload via clipboard paste (Ctrl+V)
- [ ] 3 demo sample images with instant results
- [ ] Tesseract.js real OCR recognition
- [ ] Loading progress indicator
- [ ] Markdown rendered preview (marked.js)
- [ ] Table formatting display
- [ ] LaTeX formula rendering (KaTeX)
- [ ] Source/Raw/Preview tab switching
- [ ] Copy result to clipboard
- [ ] Download result as .md file
- [ ] Full zh/en i18n
- [ ] All SEO meta, structured data, sitemap
- [ ] Mobile responsive (320px–1440px)

### Future (API Upgrade)

- [ ] API mode toggle (VLM backend)
- [ ] Batch image upload
- [ ] Confidence score display
- [ ] More output formats (DOCX, PDF)
- [ ] User accounts / history

## 8. Design Tokens

### Colors
```
--color-primary: #2563EB (blue-600)
--color-primary-dark: #1D4ED8 (blue-700)
--color-bg: #FAFAFA
--color-surface: #FFFFFF
--color-text: #1A1A2E
--color-text-muted: #6B7280
--color-border: #E5E7EB
```

### Typography
- Headings: Inter (Latin) + Noto Sans SC (CJK), weight 700
- Body: Inter (Latin) + Noto Sans SC (CJK), weight 400
- Code/Mono: JetBrains Mono (CDN), weight 400

### Spacing
- Section padding: 80px desktop / 48px mobile
- Card gap: 24px
- Content max-width: 1200px
