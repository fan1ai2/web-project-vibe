# FreeOCR Hugo Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete Hugo static site for a free online OCR tool — with image upload/paste/drop, Tesseract.js recognition, Markdown/table/LaTeX result display, SEO-structured content pages, and zh/en bilingual support.

**Architecture:** Hugo generates multi-page static site with i18n. OCR tool page runs interactively via Alpine.js + Tesseract.js (browser-side). All dependencies via CDN — zero JS build step. Content pages (home, FAQ, blog) drive SEO with structured data.

**Tech Stack:** Hugo v0.145 extended, Tailwind CSS (CDN), Alpine.js (CDN), Tesseract.js v5 (CDN), marked.js, KaTeX, highlight.js

---

## File Manifest

| File | Responsibility |
|------|---------------|
| `hugo.toml` | Site config, i18n, markup settings |
| `i18n/zh.yaml` | Chinese UI strings |
| `i18n/en.yaml` | English UI strings |
| `data/features.yaml` | Homepage feature cards data |
| `layouts/_default/baseof.html` | HTML skeleton shared by all pages |
| `layouts/_default/home.html` | Homepage template |
| `layouts/_default/single.html` | Tool/FAQ/Blog post template |
| `layouts/_default/list.html` | Blog list template |
| `layouts/partials/head.html` | `<head>` with CDN links, SEO meta, structured data |
| `layouts/partials/header.html` | Navigation bar with logo + lang switch |
| `layouts/partials/footer.html` | Site footer |
| `layouts/partials/tool-uploader.html` | Upload zone component |
| `layouts/partials/tool-result.html` | Result panel component |
| `layouts/shortcodes/formula.html` | KaTeX formula shortcode |
| `static/js/ocr-engine.js` | Tesseract.js wrapper (swappable) |
| `static/js/demo-data.js` | 3 demo sample results |
| `static/js/tool-app.js` | Alpine.js app controller for tool page |
| `static/images/` | SVG placeholder demo images |
| `static/robots.txt` | Crawler rules |
| `content/_index.md` | zh homepage |
| `content/tool/index.md` | zh tool page (page bundle) |
| `content/faq/index.md` | zh FAQ (page bundle) |
| `content/blog/_index.md` | zh blog list |
| `content/blog/introduction.md` | zh first blog post |
| `content/en/_index.md` | en homepage |
| `content/en/tool/index.md` | en tool page (page bundle) |
| `content/en/faq/index.md` | en FAQ (page bundle) |
| `content/en/blog/_index.md` | en blog list |
| `content/en/blog/introduction.md` | en first blog post |

---

### Task 1: Project Scaffold

**Files:**
- Create: `free-ocr/hugo.toml`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p /root/web-project/free-ocr/{content/{blog,tool,faq,en/{blog,tool,faq}},layouts/{_default,partials,shortcodes},static/{images,js},i18n,data}
```

- [ ] **Step 2: Write hugo.toml**

```toml
baseURL = "https://freeocr.app/"
languageCode = "zh-CN"
title = "FreeOCR — 免费在线OCR图片文字识别工具"
enableRobotsTXT = true

[sitemap]
  changeFreq = "weekly"
  priority = 0.5

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true

[menus]
  [[menus.main]]
    name = "工具"
    url = "/tool/"
    weight = 1
  [[menus.main]]
    name = "FAQ"
    url = "/faq/"
    weight = 2
  [[menus.main]]
    name = "博客"
    url = "/blog/"
    weight = 3

[languages]
  [languages.zh]
    languageName = "中文"
    languageCode = "zh-CN"
    contentDir = "content"
    weight = 1
  [languages.en]
    languageName = "English"
    languageCode = "en-US"
    contentDir = "content/en"
    weight = 2
```

- [ ] **Step 3: Verify directory structure**

```bash
ls -R /root/web-project/free-ocr/
```

- [ ] **Step 4: Commit**

```bash
git add free-ocr/
git commit -m "feat: scaffold FreeOCR Hugo project with config"
```

---

### Task 2: i18n Translation Strings

**Files:**
- Create: `free-ocr/i18n/zh.yaml`
- Create: `free-ocr/i18n/en.yaml`

- [ ] **Step 1: Write zh.yaml**

```yaml
# Navigation
- id: nav_home
  translation: "首页"
- id: nav_tool
  translation: "工具"
- id: nav_faq
  translation: "FAQ"
- id: nav_blog
  translation: "博客"

# Homepage — Hero
- id: hero_title
  translation: "免费在线 OCR 图片文字识别工具"
- id: hero_subtitle
  translation: "浏览器端本地识别，图片不上传服务器，隐私安全，无需注册，完全免费"
- id: hero_cta
  translation: "立即使用"
- id: hero_secondary
  translation: "查看示例"

# Homepage — Features
- id: feature_1_title
  translation: "浏览器本地识别"
- id: feature_1_desc
  translation: "基于 Tesseract.js 引擎，所有识别在您的设备上完成，图片不会上传到任何服务器，隐私绝对安全。"
- id: feature_2_title
  translation: "Markdown 格式输出"
- id: feature_2_desc
  translation: "识别结果自动格式化为 Markdown，表格、标题、列表结构完整保留，可直接复制到文档编辑器中。"
- id: feature_3_title
  translation: "公式与表格还原"
- id: feature_3_desc
  translation: "支持数学公式 LaTeX 渲染和复杂表格识别，专为学术文档和学生优化。"
- id: feature_4_title
  translation: "多语言支持"
- id: feature_4_desc
  translation: "支持中文、英文、日文、韩文等 100+ 种语言的文字识别，满足国际化需求。"

# Homepage — Steps
- id: step_how
  translation: "如何使用"
- id: step_1_title
  translation: "上传或粘贴图片"
- id: step_1_desc
  translation: "点击上传、拖拽图片到识别区，或直接 Ctrl+V 粘贴剪贴板中的截图。"
- id: step_2_title
  translation: "AI 自动识别"
- id: step_2_desc
  translation: "点击识别按钮，OCR 引擎自动提取图片中的文字内容。"
- id: step_3_title
  translation: "复制或下载"
- id: step_3_desc
  translation: "一键复制识别结果，或下载为 Markdown 文件。"

# Homepage — CTA
- id: cta_bottom
  translation: "开始使用免费 OCR"
- id: cta_bottom_sub
  translation: "无需注册，打开即用，完全免费。"
- id: cta_button
  translation: "前往工具页"

# Homepage — SEO
- id: home_title
  translation: "FreeOCR — 免费在线OCR图片文字识别工具 | 隐私安全"
- id: home_desc
  translation: "完全免费的在线OCR工具，浏览器端本地识别，不上传图片。支持Markdown格式输出、LaTeX公式渲染、表格识别，支持100+语言。无需注册，即开即用。"

# Tool page
- id: tool_title
  translation: "在线OCR工具 — 图片转文字 | FreeOCR"
- id: tool_desc
  translation: "使用我们的免费在线OCR工具将图片转换为可编辑文字。支持拖拽上传和剪贴板粘贴，Markdown格式输出，完全免费且保护隐私。"
- id: tool_heading
  translation: "图片文字识别"
- id: upload_drop
  translation: "拖拽图片到此处，或点击上传"
- id: upload_paste
  translation: "也可以直接 Ctrl+V 粘贴图片"
- id: upload_supported
  translation: "支持 PNG、JPG、WEBP 格式，最大 2048×2048px"
- id: demo_samples
  translation: "快速体验示例"
- id: demo_text
  translation: "文本文档"
- id: demo_table
  translation: "数据表格"
- id: demo_formula
  translation: "数学公式"
- id: btn_recognize
  translation: "开始识别"
- id: recognizing
  translation: "识别中..."
- id: tab_preview
  translation: "预览"
- id: tab_raw
  translation: "原始文本"
- id: tab_source
  translation: "Markdown 源码"
- id: btn_copy
  translation: "复制结果"
- id: btn_download
  translation: "下载 .md"
- id: copied
  translation: "已复制！"
- id: error_ocr
  translation: "识别失败，请重试"
- id: error_no_image
  translation: "请先上传或粘贴图片"
- id: btn_retry
  translation: "重试"
- id: confidence_label
  translation: "识别置信度"

# FAQ page
- id: faq_title
  translation: "常见问题 — FreeOCR"
- id: faq_desc
  translation: "关于FreeOCR在线工具的常见问题解答。了解支持的格式、语言、隐私政策和使用限制。"
- id: faq_heading
  translation: "常见问题"
- id: faq_q1
  translation: "支持哪些图片格式？"
- id: faq_a1
  translation: "支持 PNG、JPG、WEBP 格式的图片，最大尺寸为 2048×2048 像素。超过此尺寸的图片会自动缩放。"
- id: faq_q2
  translation: "真的是完全免费的吗？"
- id: faq_a2
  translation: "是的，FreeOCR 完全免费使用，没有隐藏费用，不需要订阅，也不需要注册账户。所有识别工作在您的浏览器中完成。"
- id: faq_q3
  translation: "我的图片会被上传到服务器吗？"
- id: faq_a3
  translation: "不会。所有 OCR 识别都在您的浏览器本地完成，图片不会上传到任何服务器。这是 FreeOCR 的核心隐私承诺。"
- id: faq_q4
  translation: "支持哪些语言的文字识别？"
- id: faq_a4
  translation: "支持超过 100 种语言的文字识别，包括中文、英文、日文、韩文、法文、德文、西班牙文等主流语言。"
- id: faq_q5
  translation: "手写文字能识别吗？"
- id: faq_a5
  translation: "支持手写文字识别，但识别精度取决于字迹的清晰度。清晰工整的手写字识别效果较好，潦草字迹可能效果不佳。"
- id: faq_q6
  translation: "有使用次数限制吗？"
- id: faq_a6
  translation: "没有使用次数限制。您可以无限次使用 FreeOCR，没有任何每日或每月的配额限制。"

# Blog
- id: blog_title
  translation: "博客 — FreeOCR"
- id: blog_desc
  translation: "FreeOCR 使用教程、OCR技术科普、图片文字识别技巧分享。"
- id: blog_heading
  translation: "博客文章"
- id: blog_readmore
  translation: "阅读全文"
- id: blog_published
  translation: "发布于"
- id: blog_back
  translation: "← 返回博客列表"

# Footer
- id: footer_desc
  translation: "完全免费的在线OCR工具，浏览器端识别，隐私安全。"
- id: footer_copyright
  translation: "© 2026 FreeOCR. All rights reserved."

# Structured Data
- id: sd_org_name
  translation: "FreeOCR"
- id: sd_org_desc
  translation: "免费在线OCR图片文字识别工具，浏览器端本地识别保障隐私安全。"
- id: sd_howto_name
  translation: "如何使用FreeOCR在线工具识别图片文字"
- id: sd_howto_desc
  translation: "上传或粘贴图片，AI自动识别文字，复制或下载结果。"
```

- [ ] **Step 2: Write en.yaml**

```yaml
# Navigation
- id: nav_home
  translation: "Home"
- id: nav_tool
  translation: "Tool"
- id: nav_faq
  translation: "FAQ"
- id: nav_blog
  translation: "Blog"

# Homepage — Hero
- id: hero_title
  translation: "Free Online OCR Image to Text Tool"
- id: hero_subtitle
  translation: "Browser-based local recognition, images never leave your device. Privacy-safe, no registration, completely free."
- id: hero_cta
  translation: "Try It Now"
- id: hero_secondary
  translation: "View Demo"

# Homepage — Features
- id: feature_1_title
  translation: "Local Browser Recognition"
- id: feature_1_desc
  translation: "Powered by Tesseract.js engine, all OCR processing runs locally on your device. Your images are never uploaded to any server — absolute privacy."
- id: feature_2_title
  translation: "Markdown Output"
- id: feature_2_desc
  translation: "Results are automatically formatted as Markdown with tables, headings, and lists preserved. Copy directly into any document editor."
- id: feature_3_title
  translation: "Formula & Table Recovery"
- id: feature_3_desc
  translation: "Supports LaTeX math formula rendering and complex table recognition, optimized for academic documents and students."
- id: feature_4_title
  translation: "Multilingual Support"
- id: feature_4_desc
  translation: "Supports 100+ languages including Chinese, English, Japanese, Korean, French, German, and more."

# Homepage — Steps
- id: step_how
  translation: "How It Works"
- id: step_1_title
  translation: "Upload or Paste Image"
- id: step_1_desc
  translation: "Click to upload, drag and drop an image, or simply press Ctrl+V to paste from your clipboard."
- id: step_2_title
  translation: "AI Auto Recognition"
- id: step_2_desc
  translation: "Click the recognize button and the OCR engine extracts text content from your image automatically."
- id: step_3_title
  translation: "Copy or Download"
- id: step_3_desc
  translation: "Copy results with one click, or download as a Markdown file."

# Homepage — CTA
- id: cta_bottom
  translation: "Start Using Free OCR Now"
- id: cta_bottom_sub
  translation: "No registration required. Open and use instantly. Completely free."
- id: cta_button
  translation: "Go to Tool"

# Homepage — SEO
- id: home_title
  translation: "FreeOCR — Free Online OCR Image to Text Tool | Privacy-Safe"
- id: home_desc
  translation: "100% free online OCR tool with browser-based local recognition. No image upload. Markdown output, LaTeX formula rendering, table recognition. 100+ languages supported. No registration needed."

# Tool page
- id: tool_title
  translation: "Online OCR Tool — Image to Text | FreeOCR"
- id: tool_desc
  translation: "Convert images to editable text with our free online OCR tool. Supports drag-and-drop and clipboard paste. Markdown format output. Completely free and privacy-safe."
- id: tool_heading
  translation: "Image to Text OCR"
- id: upload_drop
  translation: "Drop image here, or click to upload"
- id: upload_paste
  translation: "Or press Ctrl+V to paste from clipboard"
- id: upload_supported
  translation: "Supports PNG, JPG, WEBP — max 2048×2048px"
- id: demo_samples
  translation: "Quick Demo Examples"
- id: demo_text
  translation: "Text Document"
- id: demo_table
  translation: "Data Table"
- id: demo_formula
  translation: "Math Formula"
- id: btn_recognize
  translation: "Recognize"
- id: recognizing
  translation: "Recognizing..."
- id: tab_preview
  translation: "Preview"
- id: tab_raw
  translation: "Raw Text"
- id: tab_source
  translation: "Markdown Source"
- id: btn_copy
  translation: "Copy Result"
- id: btn_download
  translation: "Download .md"
- id: copied
  translation: "Copied!"
- id: error_ocr
  translation: "Recognition failed, please try again"
- id: error_no_image
  translation: "Please upload or paste an image first"
- id: btn_retry
  translation: "Retry"
- id: confidence_label
  translation: "Confidence"

# FAQ page
- id: faq_title
  translation: "FAQ — FreeOCR"
- id: faq_desc
  translation: "Frequently asked questions about FreeOCR. Learn about supported formats, languages, privacy policy, and usage limits."
- id: faq_heading
  translation: "Frequently Asked Questions"
- id: faq_q1
  translation: "What image formats are supported?"
- id: faq_a1
  translation: "PNG, JPG, and WEBP formats are supported, with a maximum size of 2048×2048 pixels. Larger images will be automatically scaled down."
- id: faq_q2
  translation: "Is it really free?"
- id: faq_a2
  translation: "Yes, FreeOCR is completely free to use. No hidden fees, no subscriptions, no account registration required. All recognition happens in your browser."
- id: faq_q3
  translation: "Are my images uploaded to a server?"
- id: faq_a3
  translation: "No. All OCR recognition runs locally in your browser. Images never leave your device. This is FreeOCR's core privacy commitment."
- id: faq_q4
  translation: "What languages are supported?"
- id: faq_a4
  translation: "Over 100 languages are supported, including English, Chinese, Japanese, Korean, French, German, Spanish, and more."
- id: faq_q5
  translation: "Can it recognize handwriting?"
- id: faq_a5
  translation: "Yes, handwriting recognition is supported, but accuracy depends on handwriting clarity. Clear, neat handwriting works well; messy scribbles may not produce good results."
- id: faq_q6
  translation: "Is there a usage limit?"
- id: faq_a6
  translation: "No usage limits. You can use FreeOCR as many times as you want with no daily or monthly quotas."

# Blog
- id: blog_title
  translation: "Blog — FreeOCR"
- id: blog_desc
  translation: "FreeOCR tutorials, OCR technology insights, and image-to-text tips."
- id: blog_heading
  translation: "Blog Posts"
- id: blog_readmore
  translation: "Read More"
- id: blog_published
  translation: "Published on"
- id: blog_back
  translation: "← Back to Blog"

# Footer
- id: footer_desc
  translation: "A completely free online OCR tool with browser-based recognition and privacy protection."
- id: footer_copyright
  translation: "© 2026 FreeOCR. All rights reserved."

# Structured Data
- id: sd_org_name
  translation: "FreeOCR"
- id: sd_org_desc
  translation: "Free online OCR image-to-text tool with browser-based local recognition for privacy protection."
- id: sd_howto_name
  translation: "How to Use FreeOCR Online Tool for Image Text Recognition"
- id: sd_howto_desc
  translation: "Upload or paste an image, let AI recognize the text automatically, then copy or download the result."
```

- [ ] **Step 3: Commit**

```bash
git add free-ocr/i18n/
git commit -m "feat: add zh/en i18n translation strings"
```

---

### Task 3: Data File + robots.txt

**Files:**
- Create: `free-ocr/data/features.yaml`
- Create: `free-ocr/static/robots.txt`

- [ ] **Step 1: Write features.yaml**

```yaml
- title_key: feature_1_title
  desc_key: feature_1_desc
  icon: "shield-check"
- title_key: feature_2_title
  desc_key: feature_2_desc
  icon: "markdown"
- title_key: feature_3_title
  desc_key: feature_3_desc
  icon: "formula"
- title_key: feature_4_title
  desc_key: feature_4_desc
  icon: "language"
```

- [ ] **Step 2: Write robots.txt**

```
User-agent: *
Allow: /
Sitemap: https://freeocr.app/sitemap.xml
```

- [ ] **Step 3: Commit**

```bash
git add free-ocr/data/ free-ocr/static/robots.txt
git commit -m "feat: add features data and robots.txt"
```

---

### Task 4: Head Partial (CDN links + SEO meta)

**Files:**
- Create: `free-ocr/layouts/partials/head.html`

- [ ] **Step 1: Write head.html**

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>{{ if .Params.seo_title }}{{ .Params.seo_title }}{{ else }}{{ .Title }}{{ end }}</title>
<meta name="description" content="{{ if .Params.description }}{{ .Params.description }}{{ else }}{{ .Site.Params.description }}{{ end }}">

<link rel="canonical" href="{{ .Permalink }}">

{{ range .AllTranslations }}
<link rel="alternate" hreflang="{{ .Language.LanguageCode }}" href="{{ .Permalink }}">
{{ end }}

<!-- Open Graph -->
<meta property="og:title" content="{{ .Title }}">
<meta property="og:description" content="{{ .Params.description | default .Site.Params.description }}">
<meta property="og:type" content="{{ if .IsHome }}website{{ else }}article{{ end }}">
<meta property="og:url" content="{{ .Permalink }}">
<meta property="og:site_name" content="{{ .Site.Title }}">
<meta property="og:locale" content="{{ .Language.LanguageCode }}">

<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">

<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        'primary-dark': '#1D4ED8',
        surface: '#FFFFFF',
        muted: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        'content': '1200px',
      }
    }
  }
}
</script>
<style>
  :root { --color-bg: #FAFAFA; --color-text: #1A1A2E; --color-border: #E5E7EB; }
  body { background: var(--color-bg); color: var(--color-text); font-family: 'Inter', 'Noto Sans SC', sans-serif; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
</style>

<!-- Alpine.js -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

<!-- Structured Data (JSON-LD) -->
{{ partial "structured-data.html" . }}
```

- [ ] **Step 2: Commit**

```bash
git add free-ocr/layouts/partials/head.html
git commit -m "feat: add head partial with CDN links and SEO meta"
```

---

### Task 5: Header + Footer Partials

**Files:**
- Create: `free-ocr/layouts/partials/header.html`
- Create: `free-ocr/layouts/partials/footer.html`

- [ ] **Step 1: Write header.html**

```html
<header class="bg-white border-b border-gray-200 sticky top-0 z-50">
  <nav class="max-w-content mx-auto px-4 h-16 flex items-center justify-between" aria-label="Main navigation">
    <a href="{{ "/" | relLangURL }}" class="flex items-center gap-2 font-bold text-xl text-primary hover:text-primary-dark transition-colors">
      <svg class="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="#2563EB"/>
        <path d="M8 12h6v2H8zm0 3h10v2H8zm0 3h12v2H8zm0 3h8v2H8z" fill="white"/>
        <path d="M22 10l-4 12h2l4-12z" fill="white"/>
      </svg>
      <span>FreeOCR</span>
    </a>

    <div class="flex items-center gap-6">
      <div class="hidden md:flex items-center gap-6 text-sm font-medium">
        {{ range .Site.Menus.main }}
        <a href="{{ .URL | relLangURL }}" class="text-gray-600 hover:text-primary transition-colors">{{ .Name }}</a>
        {{ end }}
      </div>

      <div class="flex items-center gap-1 text-sm">
        {{ range .AllTranslations }}
        <a href="{{ .Permalink }}" class="px-2 py-1 rounded {{ if eq .Language $.Language }}bg-primary text-white{{ else }}text-gray-500 hover:text-primary{{ end }} transition-colors">
          {{ .Language.LanguageName }}
        </a>
        {{ end }}
      </div>

      <button class="md:hidden text-gray-600" id="mobile-menu-btn" aria-label="Toggle menu" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </nav>

  <div id="mobile-menu" class="hidden md:hidden border-t border-gray-100 bg-white px-4 py-3">
    {{ range .Site.Menus.main }}
    <a href="{{ .URL | relLangURL }}" class="block py-2 text-sm font-medium text-gray-600 hover:text-primary">{{ .Name }}</a>
    {{ end }}
  </div>
</header>
```

- [ ] **Step 2: Write footer.html**

```html
<footer class="bg-white border-t border-gray-200 mt-20">
  <div class="max-w-content mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 class="font-bold text-lg mb-3 text-primary">FreeOCR</h3>
        <p class="text-sm text-muted">{{ i18n "footer_desc" }}</p>
      </div>
      <div>
        <h4 class="font-semibold text-sm mb-3 text-gray-900">{{ i18n "nav_tool" }}</h4>
        <ul class="space-y-2 text-sm text-muted">
          <li><a href="{{ "/tool/" | relLangURL }}" class="hover:text-primary transition-colors">{{ i18n "nav_tool" }}</a></li>
          <li><a href="{{ "/faq/" | relLangURL }}" class="hover:text-primary transition-colors">{{ i18n "nav_faq" }}</a></li>
          <li><a href="{{ "/blog/" | relLangURL }}" class="hover:text-primary transition-colors">{{ i18n "nav_blog" }}</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold text-sm mb-3 text-gray-900">Legal</h4>
        <ul class="space-y-2 text-sm text-muted">
          <li><span>{{ i18n "footer_copyright" }}</span></li>
        </ul>
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Commit**

```bash
git add free-ocr/layouts/partials/header.html free-ocr/layouts/partials/footer.html
git commit -m "feat: add header and footer partials with i18n"
```

---

### Task 6: Structured Data Partial

**Files:**
- Create: `free-ocr/layouts/partials/structured-data.html`

- [ ] **Step 1: Write structured-data.html**

```html
{{ if .IsHome }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "{{ i18n "sd_org_name" }}",
  "description": "{{ i18n "sd_org_desc" }}",
  "url": "{{ .Site.BaseURL }}",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "{{ .Site.BaseURL }}search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "{{ i18n "sd_org_name" }}",
  "description": "{{ i18n "sd_org_desc" }}",
  "url": "{{ .Site.BaseURL }}"
}
</script>
{{ end }}

{{ if eq .Section "tool" }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "{{ i18n "sd_howto_name" }}",
  "description": "{{ i18n "sd_howto_desc" }}",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "{{ i18n "step_1_title" }}",
      "text": "{{ i18n "step_1_desc" }}"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "{{ i18n "step_2_title" }}",
      "text": "{{ i18n "step_2_desc" }}"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "{{ i18n "step_3_title" }}",
      "text": "{{ i18n "step_3_desc" }}"
    }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "FreeOCR",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web Browser",
  "description": "{{ i18n "sd_org_desc" }}",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
</script>
{{ end }}

{{ if eq .Section "faq" }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{{ i18n "faq_q1" }}",
      "acceptedAnswer": { "@type": "Answer", "text": "{{ i18n "faq_a1" }}" }
    },
    {
      "@type": "Question",
      "name": "{{ i18n "faq_q2" }}",
      "acceptedAnswer": { "@type": "Answer", "text": "{{ i18n "faq_a2" }}" }
    },
    {
      "@type": "Question",
      "name": "{{ i18n "faq_q3" }}",
      "acceptedAnswer": { "@type": "Answer", "text": "{{ i18n "faq_a3" }}" }
    },
    {
      "@type": "Question",
      "name": "{{ i18n "faq_q4" }}",
      "acceptedAnswer": { "@type": "Answer", "text": "{{ i18n "faq_a4" }}" }
    },
    {
      "@type": "Question",
      "name": "{{ i18n "faq_q5" }}",
      "acceptedAnswer": { "@type": "Answer", "text": "{{ i18n "faq_a5" }}" }
    },
    {
      "@type": "Question",
      "name": "{{ i18n "faq_q6" }}",
      "acceptedAnswer": { "@type": "Answer", "text": "{{ i18n "faq_a6" }}" }
    }
  ]
}
</script>
{{ end }}

{{ if and (eq .Section "blog") (not .IsNode) }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{ .Title }}",
  "description": "{{ .Params.description }}",
  "datePublished": "{{ .Date.Format "2006-01-02" }}",
  "author": { "@type": "Organization", "name": "FreeOCR" }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "{{ i18n "nav_home" }}", "item": "{{ "/" | absLangURL }}" },
    { "@type": "ListItem", "position": 2, "name": "{{ i18n "nav_blog" }}", "item": "{{ "/blog/" | absLangURL }}" },
    { "@type": "ListItem", "position": 3, "name": "{{ .Title }}" }
  ]
}
</script>
{{ end }}
```

- [ ] **Step 2: Commit**

```bash
git add free-ocr/layouts/partials/structured-data.html
git commit -m "feat: add structured data partial with all JSON-LD schemas"
```

---

### Task 7: Base Template (baseof.html)

**Files:**
- Create: `free-ocr/layouts/_default/baseof.html`

- [ ] **Step 1: Write baseof.html**

```html
<!DOCTYPE html>
<html lang="{{ .Language.LanguageCode }}">
<head>
  {{ partial "head.html" . }}
</head>
<body class="min-h-screen flex flex-col">
  {{ partial "header.html" . }}

  <main class="flex-1">
    {{ block "main" . }}{{ end }}
  </main>

  {{ partial "footer.html" . }}

  {{ block "scripts" . }}{{ end }}
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add free-ocr/layouts/_default/baseof.html
git commit -m "feat: add base template skeleton"
```

---

### Task 8: Homepage Template + Content

**Files:**
- Create: `free-ocr/layouts/_default/home.html`
- Create: `free-ocr/content/_index.md`
- Create: `free-ocr/content/en/_index.md`

- [ ] **Step 1: Write home.html**

```html
{{ define "main" }}

<!-- Hero -->
<section class="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 md:py-28">
  <div class="max-w-content mx-auto px-4 text-center">
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
      {{ i18n "hero_title" }}
    </h1>
    <p class="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-8">
      {{ i18n "hero_subtitle" }}
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="{{ "/tool/" | relLangURL }}" class="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-blue-500/25 min-h-[44px]">
        {{ i18n "hero_cta" }}
      </a>
      <a href="{{ "/tool/" | relLangURL }}#demo" class="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-primary hover:text-primary transition-colors min-h-[44px]">
        {{ i18n "hero_secondary" }}
      </a>
    </div>
  </div>
</section>

<!-- Features -->
<section class="py-20">
  <div class="max-w-content mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {{ range .Site.Data.features }}
      <div class="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all">
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          {{ if eq .icon "shield-check" }}
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          {{ else if eq .icon "markdown" }}
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
          {{ else if eq .icon "formula" }}
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zm4 2h8M8 11h8M8 15h5"/></svg>
          {{ else if eq .icon "language" }}
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ end }}
        </div>
        <h3 class="font-bold text-lg mb-2">{{ i18n .title_key }}</h3>
        <p class="text-sm text-muted leading-relaxed">{{ i18n .desc_key }}</p>
      </div>
      {{ end }}
    </div>
  </div>
</section>

<!-- How It Works -->
<section class="py-20 bg-white">
  <div class="max-w-content mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-12">{{ i18n "step_how" }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
        <h3 class="font-bold text-lg mb-2">{{ i18n "step_1_title" }}</h3>
        <p class="text-sm text-muted">{{ i18n "step_1_desc" }}</p>
      </div>
      <div class="text-center">
        <div class="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
        <h3 class="font-bold text-lg mb-2">{{ i18n "step_2_title" }}</h3>
        <p class="text-sm text-muted">{{ i18n "step_2_desc" }}</p>
      </div>
      <div class="text-center">
        <div class="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
        <h3 class="font-bold text-lg mb-2">{{ i18n "step_3_title" }}</h3>
        <p class="text-sm text-muted">{{ i18n "step_3_desc" }}</p>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="py-20">
  <div class="max-w-content mx-auto px-4 text-center">
    <h2 class="text-3xl font-bold mb-4">{{ i18n "cta_bottom" }}</h2>
    <p class="text-muted mb-8">{{ i18n "cta_bottom_sub" }}</p>
    <a href="{{ "/tool/" | relLangURL }}" class="inline-flex items-center px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-blue-500/25 min-h-[44px]">
      {{ i18n "cta_button" }}
    </a>
  </div>
</section>

{{ end }}
```

- [ ] **Step 2: Write zh homepage content (content/_index.md)**

```yaml
---
seo_title: "FreeOCR — 免费在线OCR图片文字识别工具 | 隐私安全"
description: "完全免费的在线OCR工具，浏览器端本地识别，不上传图片。支持Markdown格式输出、LaTeX公式渲染、表格识别，支持100+语言。无需注册，即开即用。"
---
```

- [ ] **Step 3: Write en homepage content (content/en/_index.md)**

```yaml
---
seo_title: "FreeOCR — Free Online OCR Image to Text Tool | Privacy-Safe"
description: "100% free online OCR tool with browser-based local recognition. No image upload. Markdown output, LaTeX formula rendering, table recognition. 100+ languages supported. No registration needed."
---
```

- [ ] **Step 4: Commit**

```bash
git add free-ocr/layouts/_default/home.html free-ocr/content/_index.md free-ocr/content/en/_index.md
git commit -m "feat: add homepage template and zh/en content"
```

---

### Task 9: Tool Page Template + Content

**Files:**
- Create: `free-ocr/layouts/_default/single.html`
- Create: `free-ocr/content/tool/index.md`
- Create: `free-ocr/content/en/tool/index.md`

- [ ] **Step 1: Write single.html (with tool page special handling)**

```html
{{ define "main" }}

{{ if eq .Section "tool" }}
  <!-- Tool page: two-panel layout -->
  <div x-data="toolApp()" x-cloak class="max-w-content mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-center">{{ i18n "tool_heading" }}</h1>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Left: Upload Panel -->
      <div class="lg:w-1/2">
        {{ partial "tool-uploader.html" . }}
      </div>

      <!-- Right: Result Panel -->
      <div class="lg:w-1/2">
        {{ partial "tool-result.html" . }}
      </div>
    </div>
  </div>

{{ else if eq .Section "blog" }}
  <article class="max-w-content mx-auto px-4 py-8">
    <header class="mb-8">
      <a href="{{ "/blog/" | relLangURL }}" class="text-primary hover:underline text-sm mb-4 inline-block">{{ i18n "blog_back" }}</a>
      <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ .Title }}</h1>
      <time class="text-sm text-muted" datetime="{{ .Date.Format "2006-01-02" }}">{{ i18n "blog_published" }} {{ .Date.Format "2006-01-02" }}</time>
    </header>
    <div class="prose max-w-none">
      {{ .Content }}
    </div>
  </article>

{{ else if eq .Section "faq" }}
  <div class="max-w-content mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-center">{{ i18n "faq_heading" }}</h1>
    <div class="max-w-2xl mx-auto space-y-4">
      {{ range $i := (seq 1 6) }}
      {{ $q := printf "faq_q%d" $i }}
      {{ $a := printf "faq_a%d" $i }}
      <details class="bg-white rounded-lg border border-gray-200 group">
        <summary class="px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:text-primary transition-colors marker:content-none list-none flex items-center justify-between">
          {{ i18n $q }}
          <svg class="w-5 h-5 text-muted group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </summary>
        <div class="px-6 pb-4 text-muted leading-relaxed">{{ i18n $a }}</div>
      </details>
      {{ end }}
    </div>
  </div>

{{ else }}
  <div class="max-w-content mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">{{ .Title }}</h1>
    <div class="prose max-w-none">
      {{ .Content }}
    </div>
  </div>
{{ end }}

{{ end }}

{{ define "scripts" }}
{{ if eq .Section "tool" }}
<!-- Tesseract.js -->
<script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
<!-- marked.js -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<!-- KaTeX -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16/dist/contrib/auto-render.min.js"></script>
<!-- highlight.js -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github.min.css">
<script src="https://cdn.jsdelivr.net/npm/highlight.js@11/lib/highlight.min.js"></script>

<script src="{{ "js/demo-data.js" | relURL }}"></script>
<script src="{{ "js/ocr-engine.js" | relURL }}"></script>
<script src="{{ "js/tool-app.js" | relURL }}"></script>
{{ end }}
{{ end }}
```

- [ ] **Step 2: Write zh tool page content (content/tool/index.md)**

```yaml
---
title: "在线OCR工具"
seo_title: "在线OCR工具 — 图片转文字 | FreeOCR"
description: "使用我们的免费在线OCR工具将图片转换为可编辑文字。支持拖拽上传和剪贴板粘贴，Markdown格式输出，完全免费且保护隐私。"
section: "tool"
layout: "single"
---
```

- [ ] **Step 3: Write en tool page content (content/en/tool/index.md)**

```yaml
---
title: "Online OCR Tool"
seo_title: "Online OCR Tool — Image to Text | FreeOCR"
description: "Convert images to editable text with our free online OCR tool. Supports drag-and-drop and clipboard paste. Markdown format output. Completely free and privacy-safe."
section: "tool"
layout: "single"
---
```

- [ ] **Step 4: Commit**

```bash
git add free-ocr/layouts/_default/single.html free-ocr/content/tool/ free-ocr/content/en/tool/
git commit -m "feat: add tool page template and zh/en content"
```

---

### Task 10: Tool Uploader Partial

**Files:**
- Create: `free-ocr/layouts/partials/tool-uploader.html`

- [ ] **Step 1: Write tool-uploader.html**

```html
<div class="bg-white rounded-xl border border-gray-200 p-6">
  <!-- Drop zone -->
  <div
    class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-blue-50/50 transition-colors min-h-[200px] flex flex-col items-center justify-center"
    :class="{ 'border-primary bg-blue-50': dragOver }"
    @click="$refs.fileInput.click()"
    @dragover.prevent="dragOver = true"
    @dragleave.prevent="dragOver = false"
    @drop.prevent="handleDrop($event)"
    role="button"
    aria-label="{{ i18n "upload_drop" }}"
    tabindex="0"
    @keydown.enter="$refs.fileInput.click()"
    @keydown.space.prevent="$refs.fileInput.click()"
  >
    <template x-if="!imageSrc">
      <div>
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
        </svg>
        <p class="text-gray-600 font-medium mb-1">{{ i18n "upload_drop" }}</p>
        <p class="text-sm text-muted">{{ i18n "upload_paste" }}</p>
        <p class="text-xs text-muted mt-3">{{ i18n "upload_supported" }}</p>
      </div>
    </template>
    <template x-if="imageSrc">
      <img :src="imageSrc" class="max-w-full max-h-[300px] rounded-lg object-contain" alt="Preview">
    </template>
  </div>

  <input type="file" accept="image/*" class="hidden" x-ref="fileInput" @change="handleFile($event)">

  <!-- Recognize button -->
  <button
    class="w-full mt-4 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
    :disabled="!imageSrc || loading"
    @click="recognize()"
  >
    <span x-show="!loading">{{ i18n "btn_recognize" }}</span>
    <span x-show="loading" class="flex items-center justify-center gap-2">
      <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      {{ i18n "recognizing" }}
    </span>
  </button>

  <!-- Confidence -->
  <p x-show="confidence !== null" class="text-sm text-muted mt-2 text-center">
    {{ i18n "confidence_label" }}: <span x-text="confidence + '%'" class="font-semibold" :class="confidence > 70 ? 'text-green-600' : 'text-yellow-600'"></span>
  </p>

  <!-- Demo samples -->
  <div id="demo" class="mt-8">
    <p class="text-sm font-semibold text-gray-500 mb-3">{{ i18n "demo_samples" }}</p>
    <div class="grid grid-cols-3 gap-3">
      <button @click="loadDemo('text')" class="p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors text-center text-sm min-h-[44px]">
        <svg class="w-6 h-6 text-gray-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        {{ i18n "demo_text" }}
      </button>
      <button @click="loadDemo('table')" class="p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors text-center text-sm min-h-[44px]">
        <svg class="w-6 h-6 text-gray-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
        {{ i18n "demo_table" }}
      </button>
      <button @click="loadDemo('formula')" class="p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors text-center text-sm min-h-[44px]">
        <svg class="w-6 h-6 text-gray-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zm4 2h8M8 11h8M8 15h5"/></svg>
        {{ i18n "demo_formula" }}
      </button>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add free-ocr/layouts/partials/tool-uploader.html
git commit -m "feat: add tool uploader partial with drop zone and demo buttons"
```

---

### Task 11: Tool Result Partial

**Files:**
- Create: `free-ocr/layouts/partials/tool-result.html`

- [ ] **Step 1: Write tool-result.html**

```html
<div class="bg-white rounded-xl border border-gray-200 p-6 min-h-[400px]">
  <!-- Tabs -->
  <div class="flex gap-1 border-b border-gray-200 mb-4" x-show="result">
    <button
      class="px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-[1px]"
      :class="activeTab === 'preview' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-gray-700'"
      @click="activeTab = 'preview'"
    >{{ i18n "tab_preview" }}</button>
    <button
      class="px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-[1px]"
      :class="activeTab === 'raw' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-gray-700'"
      @click="activeTab = 'raw'"
    >{{ i18n "tab_raw" }}</button>
    <button
      class="px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-[1px]"
      :class="activeTab === 'source' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-gray-700'"
      @click="activeTab = 'source'"
    >{{ i18n "tab_source" }}</button>
  </div>

  <!-- Empty state -->
  <div x-show="!result && !error" class="flex items-center justify-center h-64 text-muted text-sm">
    <div class="text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <p>{{ i18n "upload_drop" }}</p>
    </div>
  </div>

  <!-- Error state -->
  <div x-show="error" class="flex items-center justify-center h-64">
    <div class="text-center">
      <svg class="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      <p class="text-red-600 mb-4">{{ i18n "error_ocr" }}</p>
      <button @click="recognize()" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">{{ i18n "btn_retry" }}</button>
    </div>
  </div>

  <!-- Result tabs -->
  <div x-show="result" x-cloak>

    <!-- Preview Tab -->
    <div x-show="activeTab === 'preview'">
      <div class="prose max-w-none markdown-body" x-html="renderedMarkdown"></div>
    </div>

    <!-- Raw Tab -->
    <div x-show="activeTab === 'raw'">
      <pre class="text-sm text-gray-800 whitespace-pre-wrap font-sans bg-gray-50 rounded-lg p-4 min-h-[200px] max-h-[500px] overflow-auto" contenteditable="true" x-text="result"></pre>
    </div>

    <!-- Source Tab -->
    <div x-show="activeTab === 'source'">
      <pre class="text-sm bg-gray-50 rounded-lg p-4 min-h-[200px] max-h-[500px] overflow-auto"><code class="language-markdown" x-text="result"></code></pre>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 mt-4 pt-4 border-t border-gray-100">
      <button @click="copyResult()" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium min-h-[44px]">
        <span x-show="!copied">{{ i18n "btn_copy" }}</span>
        <span x-show="copied" class="text-green-600">{{ i18n "copied" }}</span>
      </button>
      <button @click="downloadMd()" class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium min-h-[44px]">
        {{ i18n "btn_download" }}
      </button>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add free-ocr/layouts/partials/tool-result.html
git commit -m "feat: add tool result partial with tabs and actions"
```

---

### Task 12: OCR Engine + Demo Data JS

**Files:**
- Create: `free-ocr/static/js/ocr-engine.js`
- Create: `free-ocr/static/js/demo-data.js`

- [ ] **Step 1: Write ocr-engine.js**

```js
const OcrEngine = {
  mode: 'tesseract', // 'tesseract' | 'api' (future)

  async recognize(imageSrc) {
    if (this.mode === 'tesseract') {
      return this.tesseractRecognize(imageSrc);
    }
    // Future: return this.apiRecognize(imageSrc);
    throw new Error('Unknown OCR mode');
  },

  async tesseractRecognize(imageSrc, onProgress) {
    const worker = await Tesseract.createWorker('chi_sim+eng', 1, {
      logger: m => {
        if (onProgress && m.status === 'recognizing text') {
          onProgress(Math.round(m.progress * 100));
        }
      }
    });
    const { data } = await worker.recognize(imageSrc);
    await worker.terminate();
    return {
      text: data.text,
      confidence: Math.round(data.confidence)
    };
  },

  // Future API path — swap mode to 'api' and implement
  async apiRecognize(imageBlob) {
    const formData = new FormData();
    formData.append('image', imageBlob);
    const response = await fetch('/api/ocr', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  }
};
```

- [ ] **Step 2: Write demo-data.js**

```js
const DemoData = {
  text: {
    image: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
      <rect width="400" height="200" fill="#f8f9fa" rx="8"/>
      <text x="30" y="50" font-family="serif" font-size="18" fill="#333">2026年人工智能技术发展报告</text>
      <text x="30" y="80" font-family="serif" font-size="14" fill="#555">人工智能正在深刻改变各行各业的运作方式。</text>
      <text x="30" y="105" font-family="serif" font-size="14" fill="#555">从自然语言处理到计算机视觉，AI技术已经</text>
      <text x="30" y="130" font-family="serif" font-size="14" fill="#555">成为推动数字化转型的核心引擎。据预测，</text>
      <text x="30" y="155" font-family="serif" font-size="14" fill="#555">到2030年AI将为全球经济贡献超过15万亿</text>
      <text x="30" y="180" font-family="serif" font-size="14" fill="#555">美元的增长，成为21世纪最重要的技术革命。</text>
    </svg>`,
    result: `# 2026年人工智能技术发展报告

人工智能正在深刻改变各行各业的运作方式。从自然语言处理到计算机视觉，AI技术已经成为推动数字化转型的核心引擎。据预测，到2030年AI将为全球经济贡献超过15万亿美元的增长，成为21世纪最重要的技术革命。`
  },

  table: {
    image: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
      <rect width="400" height="200" fill="#f8f9fa" rx="8"/>
      <text x="30" y="40" font-family="sans-serif" font-size="16" font-weight="bold" fill="#333">季度销售数据对比</text>
      <line x1="20" y1="55" x2="380" y2="55" stroke="#ddd" stroke-width="1"/>
      <text x="40" y="75" font-family="monospace" font-size="13" fill="#444">产品     Q1      Q2      Q3      Q4</text>
      <text x="40" y="95" font-family="monospace" font-size="13" fill="#444">A系列   12,500  15,800  18,200  22,100</text>
      <text x="40" y="115" font-family="monospace" font-size="13" fill="#444">B系列    8,300   9,600  10,400  13,700</text>
      <text x="40" y="135" font-family="monospace" font-size="13" fill="#444">C系列    5,200   6,100   7,800   9,200</text>
      <text x="40" y="155" font-family="monospace" font-size="13" fill="#444">总计   26,000  31,500  36,400  45,000</text>
    </svg>`,
    result: `## 季度销售数据对比

| 产品 | Q1 | Q2 | Q3 | Q4 |
|------|-----|-----|-----|-----|
| A系列 | 12,500 | 15,800 | 18,200 | 22,100 |
| B系列 | 8,300 | 9,600 | 10,400 | 13,700 |
| C系列 | 5,200 | 6,100 | 7,800 | 9,200 |
| **总计** | **26,000** | **31,500** | **36,400** | **45,000** |`
  },

  formula: {
    image: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
      <rect width="400" height="200" fill="#f8f9fa" rx="8"/>
      <text x="30" y="50" font-family="serif" font-size="16" fill="#333">傅里叶变换公式：</text>
      <text x="50" y="80" font-family="serif" font-size="20" font-style="italic" fill="#1a1a2e">F(ω) = ∫ f(t) · e^(-iωt) dt</text>
      <text x="30" y="115" font-family="serif" font-size="16" fill="#333">二次方程求根公式：</text>
      <text x="50" y="145" font-family="serif" font-size="20" font-style="italic" fill="#1a1a2e">x = (-b ± √(b² - 4ac)) / (2a)</text>
      <text x="30" y="175" font-family="serif" font-size="16" fill="#333">欧拉恒等式：</text>
      <text x="50" y="195" font-family="serif" font-size="18" font-style="italic" fill="#1a1a2e">e^(iπ) + 1 = 0</text>
    </svg>`,
    result: `## 数学公式

### 傅里叶变换公式

$$F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) \\cdot e^{-i\\omega t} \\, dt$$

### 二次方程求根公式

$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

### 欧拉恒等式

$$e^{i\\pi} + 1 = 0$$`
  }
};
```

- [ ] **Step 3: Commit**

```bash
git add free-ocr/static/js/ocr-engine.js free-ocr/static/js/demo-data.js
git commit -m "feat: add OCR engine wrapper and demo data"
```

---

### Task 13: Tool App JS (Alpine.js Controller)

**Files:**
- Create: `free-ocr/static/js/tool-app.js`

- [ ] **Step 1: Write tool-app.js**

```js
function toolApp() {
  return {
    // State
    imageSrc: null,
    imageBlob: null,
    dragOver: false,
    loading: false,
    result: '',
    renderedMarkdown: '',
    confidence: null,
    error: false,
    copied: false,
    activeTab: 'preview',

    // Handle file input
    handleFile(event) {
      this.error = false;
      this.result = '';
      const file = event.target.files[0];
      if (!file) return;
      this.loadImage(file);
    },

    // Handle drop
    handleDrop(event) {
      this.dragOver = false;
      this.error = false;
      this.result = '';
      const file = event.dataTransfer.files[0];
      if (!file) return;
      this.loadImage(file);
    },

    // Load image from file
    loadImage(file) {
      if (!file.type.startsWith('image/')) return;
      this.imageBlob = file;
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = e.target.result;
      reader.readAsDataURL(file);
    },

    // Handle paste
    handlePaste(event) {
      const items = event.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          this.error = false;
          this.result = '';
          const file = item.getAsFile();
          this.imageBlob = file;
          const reader = new FileReader();
          reader.onload = e => this.imageSrc = e.target.result;
          reader.readAsDataURL(file);
          break;
        }
      }
    },

    // Recognize
    async recognize() {
      if (!this.imageSrc) return;
      this.loading = true;
      this.error = false;
      this.result = '';
      this.renderedMarkdown = '';

      try {
        const ocrResult = await OcrEngine.recognize(this.imageSrc, progress => {
          // Progress updates handled by Tesseract logger
        });
        this.result = ocrResult.text;
        this.confidence = ocrResult.confidence;
        this.renderMarkdown(ocrResult.text);
        this.activeTab = 'preview';
      } catch (err) {
        console.error('OCR failed:', err);
        this.error = true;
        this.confidence = null;
      } finally {
        this.loading = false;
      }
    },

    // Render markdown with KaTeX
    renderMarkdown(text) {
      const rawHtml = marked.parse(text);
      this.renderedMarkdown = rawHtml;
      // KaTeX render after DOM update
      this.$nextTick(() => {
        try {
          renderMathInElement(this.$el.querySelector('.markdown-body'), {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ]
          });
        } catch (e) {
          // KaTeX rendering may fail gracefully on non-formula content
        }
        // Highlight code blocks
        this.$el.querySelectorAll('.markdown-body pre code').forEach(block => {
          hljs.highlightElement(block);
        });
      });
    },

    // Load demo sample
    loadDemo(type) {
      const demo = DemoData[type];
      this.result = demo.result;
      this.confidence = 99;
      this.error = false;
      this.loading = false;
      this.imageSrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(demo.image)));
      this.renderMarkdown(demo.result);
      this.activeTab = 'preview';
      window.scrollTo({ top: this.$el.offsetTop, behavior: 'smooth' });
    },

    // Copy result
    async copyResult() {
      try {
        await navigator.clipboard.writeText(this.result);
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = this.result;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
      }
    },

    // Download markdown
    downloadMd() {
      const blob = new Blob([this.result], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ocr-result.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    // Init
    init() {
      document.addEventListener('paste', this.handlePaste.bind(this));
      // Check for Tesseract availability
      if (typeof Tesseract === 'undefined') {
        console.warn('Tesseract.js not loaded — OCR will use demo mode');
      }
    }
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add free-ocr/static/js/tool-app.js
git commit -m "feat: add Alpine.js tool app controller"
```

---

### Task 14: Blog Templates + Content

**Files:**
- Create: `free-ocr/layouts/_default/list.html`
- Create: `free-ocr/content/blog/_index.md`
- Create: `free-ocr/content/blog/introduction.md`
- Create: `free-ocr/content/en/blog/_index.md`
- Create: `free-ocr/content/en/blog/introduction.md`

- [ ] **Step 1: Write list.html**

```html
{{ define "main" }}
<div class="max-w-content mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">{{ i18n "blog_heading" }}</h1>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {{ range .Pages }}
    <article class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary/20 transition-all">
      <time class="text-xs text-muted" datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "2006-01-02" }}</time>
      <h2 class="text-lg font-bold mt-2 mb-3">
        <a href="{{ .Permalink }}" class="text-gray-900 hover:text-primary transition-colors">{{ .Title }}</a>
      </h2>
      <p class="text-sm text-muted line-clamp-3">{{ .Params.description }}</p>
      <a href="{{ .Permalink }}" class="inline-block mt-4 text-sm font-medium text-primary hover:text-primary-dark">{{ i18n "blog_readmore" }} →</a>
    </article>
    {{ end }}
  </div>
</div>
{{ end }}
```

- [ ] **Step 2: Write zh blog list (content/blog/_index.md)**

```yaml
---
seo_title: "博客 — FreeOCR | OCR教程与技巧"
description: "FreeOCR 使用教程、OCR技术科普、图片文字识别技巧分享。"
---
```

- [ ] **Step 3: Write zh blog post (content/blog/introduction.md)**

```markdown
---
title: "FreeOCR 使用指南：免费的在线图片文字识别工具"
description: "详细介绍FreeOCR的功能特点和使用方法，帮助你快速上手这款免费在线OCR工具。"
date: 2026-06-16
---

## 什么是 FreeOCR？

FreeOCR 是一款完全免费的在线 OCR（光学字符识别）工具。你只需要上传或粘贴图片，就能快速提取图中的文字内容。所有识别工作都在你的浏览器本地完成，图片不会上传到任何服务器。

## 核心功能

### 1. 多种图片输入方式

- **点击上传**：点击上传区域，从电脑中选择图片
- **拖拽上传**：直接将图片文件拖拽到识别区域
- **剪贴板粘贴**：使用 `Ctrl+V` 快捷键直接粘贴截图

### 2. Markdown 格式输出

识别结果会自动格式化为 Markdown，保留标题、列表、表格等文档结构。你可以直接复制到 Notion、Obsidian、Typora 等支持 Markdown 的编辑器中使用。

### 3. 数学公式渲染

对于学术文档中的数学公式，FreeOCR 支持 LaTeX 格式渲染，确保公式的准确和美观。

### 4. 隐私安全

所有识别工作在你自己的浏览器中完成，图片绝不会被上传到任何服务器。这是 FreeOCR 与其他在线 OCR 工具最大的不同。

## 支持的语言

FreeOCR 支持超过 100 种语言的文字识别，包括中文、英文、日文、韩文、法文、德文、西班牙文等主流语言。

## 使用技巧

1. **确保图片清晰**：清晰度越高的图片，识别准确率越高
2. **避免背景干扰**：纯色背景的文字图片效果最好
3. **选择合适的光线**：拍摄文件时确保光线均匀
4. **字体大小适中**：太小的文字可能影响识别精度

立即访问 [工具页](/tool/) 开始使用 FreeOCR！
```

- [ ] **Step 4: Write en blog list (content/en/blog/_index.md)**

```yaml
---
seo_title: "Blog — FreeOCR | OCR Tutorials & Tips"
description: "FreeOCR tutorials, OCR technology insights, and image-to-text tips."
---
```

- [ ] **Step 5: Write en blog post (content/en/blog/introduction.md)**

```markdown
---
title: "FreeOCR Guide: Free Online Image to Text Recognition Tool"
description: "A comprehensive guide to FreeOCR's features and usage, helping you get started with this free online OCR tool."
date: 2026-06-16
---

## What is FreeOCR?

FreeOCR is a completely free online OCR (Optical Character Recognition) tool. Simply upload or paste an image to extract text content. All recognition happens locally in your browser — images are never uploaded to any server.

## Core Features

### 1. Multiple Input Methods

- **Click to upload**: Click the upload area and select an image from your computer
- **Drag and drop**: Drag image files directly into the recognition zone
- **Clipboard paste**: Use `Ctrl+V` to paste screenshots directly

### 2. Markdown Output

Recognition results are automatically formatted as Markdown, preserving headings, lists, tables, and document structure. Copy directly into Notion, Obsidian, Typora, or any Markdown-compatible editor.

### 3. Math Formula Rendering

For academic documents, FreeOCR supports LaTeX formula rendering, ensuring formulas are accurate and well-displayed.

### 4. Privacy Protection

All recognition runs in your own browser. Images are never uploaded to any server — this is FreeOCR's key differentiator from other online OCR tools.

## Supported Languages

FreeOCR supports 100+ languages including English, Chinese, Japanese, Korean, French, German, Spanish, and more.

## Tips for Best Results

1. **Ensure image clarity**: Higher resolution means better accuracy
2. **Avoid background noise**: Clean backgrounds produce the best results
3. **Even lighting**: Ensure uniform lighting when photographing documents
4. **Appropriate font size**: Very small text may affect recognition quality

Visit the [tool page](/en/tool/) to start using FreeOCR now!
```

- [ ] **Step 6: Commit**

```bash
git add free-ocr/layouts/_default/list.html free-ocr/content/blog/ free-ocr/content/en/blog/
git commit -m "feat: add blog templates and zh/en blog content"
```

---

### Task 15: FAQ Content

**Files:**
- Create: `free-ocr/content/faq/index.md`
- Create: `free-ocr/content/en/faq/index.md`

- [ ] **Step 1: Write zh FAQ (content/faq/index.md)**

```yaml
---
title: "常见问题"
seo_title: "常见问题 — FreeOCR"
description: "关于FreeOCR在线工具的常见问题解答。了解支持的格式、语言、隐私政策和使用限制。"
section: "faq"
layout: "single"
---
```

- [ ] **Step 2: Write en FAQ (content/en/faq/index.md)**

```yaml
---
title: "FAQ"
seo_title: "FAQ — FreeOCR"
description: "Frequently asked questions about FreeOCR. Learn about supported formats, languages, privacy policy, and usage limits."
section: "faq"
layout: "single"
---
```

- [ ] **Step 3: Commit**

```bash
git add free-ocr/content/faq/ free-ocr/content/en/faq/
git commit -m "feat: add faq page content zh/en"
```

---

### Task 16: Build and Verify

- [ ] **Step 1: Build the Hugo site**

```bash
cd /root/web-project/free-ocr && hugo --minify
```

Expected: Build succeeds with no errors. Output in `public/`.

- [ ] **Step 2: Verify output structure**

```bash
ls -R /root/web-project/free-ocr/public/ | head -50
```

Expected: `index.html`, `en/index.html`, `tool/index.html`, `en/tool/index.html`, `faq/index.html`, `blog/index.html`, `js/`, `robots.txt`, `sitemap.xml`

- [ ] **Step 3: Check SEO elements in output**

```bash
grep -r 'hreflang' /root/web-project/free-ocr/public/ | head -10
grep -r 'application/ld+json' /root/web-project/free-ocr/public/ | head -10
grep -r '<title>' /root/web-project/free-ocr/public/ | head -10
```

Expected: hreflang links, JSON-LD blocks, title tags present.

- [ ] **Step 4: Start dev server and spot-check**

```bash
cd /root/web-project/free-ocr && hugo server --bind 0.0.0.0 --port 8080 --noHTTPCache &
sleep 2
curl -s http://localhost:8080/ | head -30
curl -s http://localhost:8080/en/ | head -30
curl -s http://localhost:8080/tool/ | head -30
```

Expected: Each page returns valid HTML with proper content.

- [ ] **Step 5: Kill dev server and commit any fixes**

```bash
kill %1 2>/dev/null
git add -A
git commit -m "chore: build verification and fixes"
```

---

### Task 17: Polish — Shortcode + CSS + Formula Shortcode

**Files:**
- Create: `free-ocr/layouts/shortcodes/formula.html`

- [ ] **Step 1: Write formula shortcode**

```html
<span class="inline-block katex-formula" data-formula="{{ .Inner | safeHTMLAttr }}">
  \( {{ .Inner }} \)
</span>
```

- [ ] **Step 2: Commit**

```bash
git add free-ocr/layouts/shortcodes/formula.html
git commit -m "feat: add formula shortcode"
```

---

### Task 18: Final SEO Audit

- [ ] **Step 1: Build with verification**

```bash
cd /root/web-project/free-ocr && hugo --minify
```

- [ ] **Step 2: Run SEO checklist**

```bash
echo "=== Sitemap ===" && curl -s http://localhost:8080/sitemap.xml 2>/dev/null || cat public/sitemap.xml | head -20
echo "=== Robots ===" && cat public/robots.txt
echo "=== Structured Data ===" && grep -c 'application/ld+json' public/index.html
echo "=== hreflang ===" && grep -c 'hreflang' public/index.html
echo "=== OG tags ===" && grep -c 'og:' public/index.html
echo "=== Canonical ===" && grep -c 'canonical' public/index.html
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: final SEO audit and polish"
```
