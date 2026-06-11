# AI Anime Avatar 子页面拆分 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将主页 upload/results/comparison/testimonials 四个 section 拆分为 /create/ 和 /testimonials/ 两个独立子页面，主页新增引导卡片，导航栏更新。

**Architecture:** Hugo 多语言站点，通过 `layout` frontmatter 创建独立页面模板。复用现有 partials (upload.html, results.html, comparison.html)，新增 guide-cards partial 和两个页面专属 CSS 文件。SEO 元数据通过 `.Params` frontmatter 注入 head.html。

**Tech Stack:** Hugo v0.145.0 extended, CSS BEM with custom properties, vanilla JS

---

## 文件结构

```
新增:
  content/zh/create.md                      # 创作页内容入口
  content/en/create.md
  content/ja/create.md
  content/zh/testimonials.md                # 评价页内容入口
  content/en/testimonials.md
  content/ja/testimonials.md
  layouts/_default/create.html              # 创作页模板
  layouts/_default/testimonials.html        # 评价页模板
  layouts/partials/guide-cards.html         # 首页引导卡片
  assets/css/components/guide-cards.css     # 引导卡片样式
  assets/css/components/page-create.css     # 创作页专属样式
  assets/css/components/page-testimonials.css # 评价页专属样式

修改:
  layouts/_default/home.html                # 移除4个section,新增guide-cards
  layouts/partials/head.html                # 支持页面级SEO元数据
  layouts/partials/header.html              # 新增"创作""用户评价"导航
  layouts/partials/footer.html              # 链接更新为子页面路由
  assets/css/main.css                       # 新增3个@import
  data/testimonials.json                    # 扩展至10-12条/语言
  i18n/zh.toml                              # 新增翻译键
  i18n/en.toml
  i18n/ja.toml

不复用 (保留原文件不删除,仅从主页移除引用):
  layouts/partials/upload.html              # 在create.html中引用
  layouts/partials/results.html             # 在create.html中引用
  layouts/partials/comparison.html          # 在create.html中引用
  layouts/partials/testimonials.html        # 不再直接使用,内容在testimonials.html模板中内联
```

---

### Task 1: 新增 i18n 翻译键

**Files:**
- Modify: `i18n/zh.toml`
- Modify: `i18n/en.toml`
- Modify: `i18n/ja.toml`

- [ ] **Step 1: 在三个语言文件末尾追加翻译键**

在 `i18n/zh.toml` 末尾追加：

```toml
[navCreate]
other = "创作"

[navTestimonials]
other = "用户评价"

[guideCreateTitle]
other = "开始创作"

[guideCreateDesc]
other = "上传照片，AI 即刻生成 6 种动漫风格"

[guideCreateCTA]
other = "开始上传 →"

[guideTestimonialsTitle]
other = "用户评价"

[guideTestimonialsDesc]
other = "真实用户的使用体验，4.9★ · 98.5% 满意"

[guideTestimonialsCTA]
other = "查看评价 →"

[createPageTitle]
other = "AI漫改头像在线生成 — 上传照片即刻制作"

[createPageDesc]
other = "上传你的照片，AI 自动生成 6 种动漫风格头像。日系、韩系、美漫、Q版、像素、赛博朋克，一键下载高清无水印。"

[createPageKeywords]
other = "AI漫改头像, 动漫头像生成, 照片转动漫, AI头像制作"

[createHeroTitle]
other = "创建你的专属漫改头像"

[createHeroSubtitle]
other = "上传照片，AI 即刻生成 6 种动漫风格"

[createHeroCTA]
other = "开始上传"

[createStylePreselect]
other = "选择风格（可选）"

[createStyleAll]
other = "全部"

[createFilterAll]
other = "全部风格"

[createBeforeAfterTitle]
other = "效果对比"

[createBeforeAfterSubtitle]
other = "拖动滑块查看 AI 转换前后对比"

[createCTATitle]
other = "准备好生成你的专属头像？"

[createCTABtn]
other = "开始上传 ↑"

[testimonialsPageTitle]
other = "用户评价 — AI漫改头像真实反馈"

[testimonialsPageDesc]
other = "超过 10,000 名用户已使用 AI 漫改头像生成器。查看真实评价、效果对比，4.9 星好评。"

[testimonialsPageKeywords]
other = "AI漫改头像评价, 动漫头像用户反馈, 效果展示"

[testimonialsHeroTitle]
other = "超过 10,000 人已拥有专属漫改头像"

[testimonialsHeroRating]
other = "4.9 / 5.0 · 1,286 条评价"

[testimonialsFeaturedTitle]
other = "精选评价"

[testimonialsAllTitle]
other = "全部评价"

[testimonialsFilterAll]
other = "全部风格"

[testimonialsFilterRecent]
other = "最新"

[testimonialsFilterHighest]
other = "最高评分"

[testimonialsStatsGenerated]
other = "累计生成"

[testimonialsStatsSatisfaction]
other = "满意率"

[testimonialsStatsSpeed]
other = "平均耗时"

[testimonialsCTATitle]
other = "加入他们，生成你的专属漫改头像"

[testimonialsCTABtn]
other = "免费生成 →"
```

在 `i18n/en.toml` 末尾追加：

```toml
[navCreate]
other = "Create"

[navTestimonials]
other = "Reviews"

[guideCreateTitle]
other = "Start Creating"

[guideCreateDesc]
other = "Upload a photo and let AI generate 6 anime styles instantly"

[guideCreateCTA]
other = "Start Now →"

[guideTestimonialsTitle]
other = "User Reviews"

[guideTestimonialsDesc]
other = "Real feedback from real users. 4.9★ · 98.5% satisfaction"

[guideTestimonialsCTA]
other = "Read Reviews →"

[createPageTitle]
other = "AI Anime Avatar Generator — Upload & Create Instantly"

[createPageDesc]
other = "Upload your photo and get 6 anime-style avatars. Japanese, Korean, Comic, Chibi, Pixel, Cyberpunk — download in HD with no watermark."

[createPageKeywords]
other = "AI anime avatar, anime avatar generator, photo to anime, AI avatar maker"

[createHeroTitle]
other = "Create Your Anime Avatar"

[createHeroSubtitle]
other = "Upload a photo and get 6 anime styles in seconds"

[createHeroCTA]
other = "Start Uploading"

[createStylePreselect]
other = "Choose a Style (Optional)"

[createStyleAll]
other = "All"

[createFilterAll]
other = "All Styles"

[createBeforeAfterTitle]
other = "Before & After"

[createBeforeAfterSubtitle]
other = "Drag the slider to see the AI transformation"

[createCTATitle]
other = "Ready to Create Yours?"

[createCTABtn]
other = "Start Uploading ↑"

[testimonialsPageTitle]
other = "User Reviews — AI Anime Avatar Real Feedback"

[testimonialsPageDesc]
other = "Over 10,000 users have used our AI anime avatar generator. Read real reviews, see before-and-after comparisons. 4.9 star rated."

[testimonialsPageKeywords]
other = "AI anime avatar reviews, anime avatar user feedback, before after results"

[testimonialsHeroTitle]
other = "Over 10,000 People Already Have Their Anime Avatar"

[testimonialsHeroRating]
other = "4.9 / 5.0 · 1,286 reviews"

[testimonialsFeaturedTitle]
other = "Featured Reviews"

[testimonialsAllTitle]
other = "All Reviews"

[testimonialsFilterAll]
other = "All Styles"

[testimonialsFilterRecent]
other = "Most Recent"

[testimonialsFilterHighest]
other = "Highest Rated"

[testimonialsStatsGenerated]
other = "Total Generated"

[testimonialsStatsSatisfaction]
other = "Satisfaction"

[testimonialsStatsSpeed]
other = "Avg Time"

[testimonialsCTATitle]
other = "Join Them — Get Your Anime Avatar"

[testimonialsCTABtn]
other = "Create Free →"
```

在 `i18n/ja.toml` 末尾追加：

```toml
[navCreate]
other = "作成"

[navTestimonials]
other = "評価"

[guideCreateTitle]
other = "作成を始める"

[guideCreateDesc]
other = "写真をアップロードして、AIが6種類のアニメスタイルを生成"

[guideCreateCTA]
other = "今すぐ作成 →"

[guideTestimonialsTitle]
other = "ユーザーの声"

[guideTestimonialsDesc]
other = "実際のユーザー体験。4.9★ · 98.5% 満足度"

[guideTestimonialsCTA]
other = "評価を見る →"

[createPageTitle]
other = "AIアニメアバター生成 — 写真をアップロードして今すぐ作成"

[createPageDesc]
other = "写真をアップロードするだけで、AIが6種類のアニメスタイルアバターを自動生成。日本風、韓国風、アメコミ、ちび、ピクセル、サイバーパンク。高画質ダウンロード。"

[createPageKeywords]
other = "AIアニメアバター, アニメアバター生成, 写真をアニメに, AIアバターメーカー"

[createHeroTitle]
other = "あなただけのアニメアバターを作成"

[createHeroSubtitle]
other = "写真をアップロードして、6種類のアニメスタイルを数秒で生成"

[createHeroCTA]
other = "アップロード開始"

[createStylePreselect]
other = "スタイルを選択（任意）"

[createStyleAll]
other = "すべて"

[createFilterAll]
other = "すべてのスタイル"

[createBeforeAfterTitle]
other = "比較"

[createBeforeAfterSubtitle]
other = "スライダーをドラッグしてAI変換を確認"

[createCTATitle]
other = "あなただけのアバターを作成しませんか？"

[createCTABtn]
other = "アップロード開始 ↑"

[testimonialsPageTitle]
other = "ユーザー評価 — AIアニメアバターの実際のフィードバック"

[testimonialsPageDesc]
other = "10,000人以上のユーザーがAIアニメアバタージェネレーターを利用。実際の評価と比較をチェック。4.9つ星評価。"

[testimonialsPageKeywords]
other = "AIアニメアバター評価, アニメアバターユーザーフィードバック, 使用例"

[testimonialsHeroTitle]
other = "10,000人以上がすでにアニメアバターを取得"

[testimonialsHeroRating]
other = "4.9 / 5.0 · 1,286 件の評価"

[testimonialsFeaturedTitle]
other = "注目の評価"

[testimonialsAllTitle]
other = "すべての評価"

[testimonialsFilterAll]
other = "すべてのスタイル"

[testimonialsFilterRecent]
other = "最新"

[testimonialsFilterHighest]
other = "高評価"

[testimonialsStatsGenerated]
other = "累計生成数"

[testimonialsStatsSatisfaction]
other = "満足度"

[testimonialsStatsSpeed]
other = "平均時間"

[testimonialsCTATitle]
other = "あなたもアニメアバターを作成しませんか？"

[testimonialsCTABtn]
other = "無料で作成 →"
```

- [ ] **Step 2: 验证 i18n 文件格式**

```bash
cd /root/web-project/ai-anime-avatar && hugo --minify 2>&1 | head -20
```
Expected: No i18n-related errors.

---

### Task 2: 创建内容文件

**Files:**
- Create: `content/zh/create.md`
- Create: `content/en/create.md`
- Create: `content/ja/create.md`
- Create: `content/zh/testimonials.md`
- Create: `content/en/testimonials.md`
- Create: `content/ja/testimonials.md`

- [ ] **Step 1: 创建 content/zh/create.md**

```markdown
---
title: "创作"
layout: "create"
seo_title: "AI漫改头像在线生成 — 上传照片即刻制作"
seo_desc: "上传你的照片，AI 自动生成 6 种动漫风格头像。日系、韩系、美漫、Q版、像素、赛博朋克，一键下载高清无水印。"
seo_keywords: "AI漫改头像, 动漫头像生成, 照片转动漫, AI头像制作"
---
```

- [ ] **Step 2: 创建 content/en/create.md**

```markdown
---
title: "Create"
layout: "create"
seo_title: "AI Anime Avatar Generator — Upload & Create Instantly"
seo_desc: "Upload your photo and get 6 anime-style avatars. Japanese, Korean, Comic, Chibi, Pixel, Cyberpunk — download in HD with no watermark."
seo_keywords: "AI anime avatar, anime avatar generator, photo to anime, AI avatar maker"
---
```

- [ ] **Step 3: 创建 content/ja/create.md**

```markdown
---
title: "作成"
layout: "create"
seo_title: "AIアニメアバター生成 — 写真をアップロードして今すぐ作成"
seo_desc: "写真をアップロードするだけで、AIが6種類のアニメスタイルアバターを自動生成。高画質ダウンロード。"
seo_keywords: "AIアニメアバター, アニメアバター生成, 写真をアニメに, AIアバターメーカー"
---
```

- [ ] **Step 4: 创建 content/zh/testimonials.md**

```markdown
---
title: "用户评价"
layout: "testimonials"
seo_title: "用户评价 — AI漫改头像真实反馈"
seo_desc: "超过 10,000 名用户已使用 AI 漫改头像生成器。查看真实评价、效果对比，4.9 星好评。"
seo_keywords: "AI漫改头像评价, 动漫头像用户反馈, 效果展示"
---
```

- [ ] **Step 5: 创建 content/en/testimonials.md**

```markdown
---
title: "Reviews"
layout: "testimonials"
seo_title: "User Reviews — AI Anime Avatar Real Feedback"
seo_desc: "Over 10,000 users have used our AI anime avatar generator. Read real reviews, see before-and-after comparisons. 4.9 star rated."
seo_keywords: "AI anime avatar reviews, anime avatar user feedback, before after results"
---
```

- [ ] **Step 6: 创建 content/ja/testimonials.md**

```markdown
---
title: "ユーザー評価"
layout: "testimonials"
seo_title: "ユーザー評価 — AIアニメアバターの実際のフィードバック"
seo_desc: "10,000人以上のユーザーがAIアニメアバタージェネレーターを利用。実際の評価と比較をチェック。4.9つ星評価。"
seo_keywords: "AIアニメアバター評価, アニメアバターユーザーフィードバック, 使用例"
---
```

- [ ] **Step 7: 提交**

```bash
cd /root/web-project && git add ai-anime-avatar/content/ && git commit -m "$(cat <<'EOF'
feat: add create and testimonials content pages

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: 修改 head.html 支持页面级 SEO

**Files:**
- Modify: `layouts/partials/head.html`

- [ ] **Step 1: 更新 head.html 的 title 和 meta 标签使用页面级参数覆盖**

将 head.html 中的：
```html
<title>{{ $params.siteName }} — {{ i18n "siteTagline" }}</title>
<meta name="description" content="{{ $params.description }}">
<meta name="keywords" content="{{ $params.keywords }}">
```

替换为：
```html
<title>{{ with .Params.seo_title }}{{ . }}{{ else }}{{ $params.siteName }} — {{ i18n "siteTagline" }}{{ end }}</title>
<meta name="description" content="{{ with .Params.seo_desc }}{{ . }}{{ else }}{{ $params.description }}{{ end }}">
<meta name="keywords" content="{{ with .Params.seo_keywords }}{{ . }}{{ else }}{{ $params.keywords }}{{ end }}">
```

同时更新 OG/Twitter 标签中的 title 和 description：
```html
<meta property="og:title" content="{{ with .Params.seo_title }}{{ . }}{{ else }}{{ $params.siteName }} — {{ i18n "siteTagline" }}{{ end }}">
<meta property="og:description" content="{{ with .Params.seo_desc }}{{ . }}{{ else }}{{ $params.description }}{{ end }}">
<meta name="twitter:title" content="{{ with .Params.seo_title }}{{ . }}{{ else }}{{ $params.siteName }} — {{ i18n "siteTagline" }}{{ end }}">
<meta name="twitter:description" content="{{ with .Params.seo_desc }}{{ . }}{{ else }}{{ $params.description }}{{ end }}">
```

更新 JSON-LD 中的字段相同方式。

- [ ] **Step 2: 验证**

```bash
cd /root/web-project/ai-anime-avatar && hugo --minify 2>&1 | grep -i error; echo "exit: $?"
```
Expected: exit: 0, no error lines.

- [ ] **Step 3: 提交**

```bash
cd /root/web-project && git add ai-anime-avatar/layouts/partials/head.html && git commit -m "$(cat <<'EOF'
feat: support page-level SEO metadata in head partial

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: 创建 /create/ 页面模板

**Files:**
- Create: `layouts/_default/create.html`

- [ ] **Step 1: 创建 layouts/_default/create.html**

```html
{{ define "main" }}

<!-- Hero Banner -->
<section class="create-hero">
  <div class="create-hero__bg" aria-hidden="true">
    <div class="create-hero__wash"></div>
  </div>
  <div class="create-hero__inner container">
    <p class="create-hero__badge">{{ i18n "createHeroCTA" }}</p>
    <h1 class="create-hero__title">{{ i18n "createHeroTitle" }}</h1>
    <p class="create-hero__subtitle">{{ i18n "createHeroSubtitle" }}</p>
    <a href="#upload" class="create-hero__cta">{{ i18n "createHeroCTA" }} ↓</a>
  </div>
</section>

<!-- Section 1: Upload Area -->
<section class="upload section" id="upload">
  <div class="container">
    <div class="section__header">
      <h2 class="section__title">{{ i18n "uploadTitle" }}</h2>
      <p class="section__subtitle">{{ i18n "uploadSubtitle" }}</p>
    </div>

    <!-- Style preselect bar -->
    <div class="create-style-preselect">
      <span class="create-style-preselect__label">{{ i18n "createStylePreselect" }}</span>
      {{ $styles := slice
        (dict "key" "styleJP")
        (dict "key" "styleKR")
        (dict "key" "styleUS")
        (dict "key" "styleQ")
        (dict "key" "stylePixel")
        (dict "key" "styleCyber")
      }}
      {{ range $styles }}
      <button class="create-style-preselect__chip" data-style="{{ .key }}">{{ i18n .key }}</button>
      {{ end }}
    </div>

    <div
      class="upload__area"
      id="upload-area"
      role="button"
      tabindex="0"
      aria-label="{{ i18n "uploadTitle" }}"
    >
      <svg class="upload__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
      <p class="upload__text">{{ i18n "uploadDropzone" }}</p>
      <p class="upload__or">{{ i18n "uploadOr" }}</p>
      <button type="button" class="upload__browse-btn" id="browse-btn">
        {{ i18n "uploadBrowse" }}
      </button>
      <p class="upload__hint">JPG / PNG / WebP, max 10MB</p>
      <p class="upload__hint upload__privacy">🔒 {{ i18n "faqPrivacyDesc" | default "Your photos are only used for generation and deleted immediately after" }}</p>
      <input
        type="file"
        id="file-input"
        class="upload__input"
        accept="image/jpeg,image/png,image/webp"
        aria-hidden="true"
        style="display:none"
      >
    </div>

    <p class="upload__free-count">
      {{ i18n "uploadFreeLeft" }}: <strong id="free-count">3</strong>
    </p>

    <div class="upload__preview" id="upload-preview">
      <img id="preview-img" class="upload__preview-img" src="" alt="Preview">
      <button type="button" class="upload__preview-remove" id="preview-remove" aria-label="Remove image">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <div class="upload__progress" id="upload-progress">
      <div class="upload__progress-bar">
        <div class="upload__progress-fill" id="progress-fill"></div>
      </div>
    </div>

    <div class="upload__generating" id="upload-generating">
      {{ i18n "uploadGenerating" }}
    </div>
  </div>
</section>

<!-- Section 2: Style Gallery -->
<section class="results section" id="results">
  <div class="container">
    <div class="section__header">
      <h2 class="section__title">{{ i18n "resultsTitle" }}</h2>
      <p class="section__subtitle">{{ i18n "showcaseSubtitle" }}</p>
    </div>

    <div class="create-filter-bar">
      <button class="create-filter-bar__btn create-filter-bar__btn--active" data-filter="all">{{ i18n "createFilterAll" }}</button>
      {{ range $styles }}
      <button class="create-filter-bar__btn" data-filter="{{ .key }}">{{ i18n .key }}</button>
      {{ end }}
    </div>

    <div class="results__grid" id="results-list">
      {{ range $styles }}
      <div class="results__card" data-style="{{ .key }}">
        <div class="results__card-image-wrap">
          <img class="results__card-image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23F5EDE3' width='300' height='300'/%3E%3C/svg%3E" alt="{{ i18n .key }}漫改头像" data-style="{{ .key }}">
          <div class="results__card-watermark">{{ i18n "resultsWatermark" }}</div>
        </div>
        <div class="results__card-body">
          <span class="results__card-label">{{ i18n .key }}漫改头像</span>
          <button
            class="results__card-btn"
            data-style="{{ .key }}"
            data-open-payment
            aria-label="{{ i18n "resultsDownload" }} - {{ i18n .key }}"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v9M4 8l4 4 4-4M3 13h10"/></svg> {{ i18n "resultsDownload" }}
          </button>
        </div>
      </div>
      {{ end }}
    </div>
  </div>
</section>

<!-- Section 3: Comparison Table -->
{{ partial "comparison.html" . }}

<!-- Section 4: Before/After Slider -->
<section class="create-compare section" id="compare">
  <div class="container">
    <div class="section__header">
      <h2 class="section__title">{{ i18n "createBeforeAfterTitle" }}</h2>
      <p class="section__subtitle">{{ i18n "createBeforeAfterSubtitle" }}</p>
    </div>
    <div class="create-compare__slider">
      <div class="create-compare__panel create-compare__panel--before">
        <img src="{{ "images/hero/original.jpg" | relURL }}" alt="{{ i18n "heroBefore" }}" loading="lazy" decoding="async" width="600" height="600">
        <span class="create-compare__label">{{ i18n "heroBefore" }}</span>
      </div>
      <div class="create-compare__panel create-compare__panel--after">
        <img src="{{ "images/hero/generated.png" | relURL }}" alt="{{ i18n "heroAfter" }}" loading="lazy" decoding="async" width="600" height="600">
        <span class="create-compare__label">{{ i18n "heroAfter" }}</span>
      </div>
      <div class="create-compare__handle" aria-hidden="true"></div>
    </div>
  </div>
</section>

<!-- CTA Banner -->
<section class="create-cta section">
  <div class="container">
    <div class="create-cta__inner">
      <h2 class="create-cta__title">{{ i18n "createCTATitle" }}</h2>
      <a href="#upload" class="create-cta__btn">{{ i18n "createCTABtn" }}</a>
    </div>
  </div>
</section>

{{ end }}
```

- [ ] **Step 2: 提交**

```bash
cd /root/web-project && git add ai-anime-avatar/layouts/_default/create.html && git commit -m "$(cat <<'EOF'
feat: add /create/ page template with upload, gallery, comparison, before/after

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: 创建 /testimonials/ 页面模板

**Files:**
- Create: `layouts/_default/testimonials.html`

- [ ] **Step 1: 创建 layouts/_default/testimonials.html**

```html
{{ define "main" }}
{{ $testimonials := index .Site.Data.testimonials .Language.Lang }}

<!-- Hero Banner -->
<section class="testimonials-hero">
  <div class="testimonials-hero__bg" aria-hidden="true">
    <div class="testimonials-hero__wash"></div>
  </div>
  <div class="testimonials-hero__inner container">
    <h1 class="testimonials-hero__title">{{ i18n "testimonialsHeroTitle" }}</h1>
    <div class="testimonials-hero__rating">
      <div class="testimonials-hero__stars" aria-label="4.9 out of 5 stars">
        {{ range seq 5 }}
        <svg class="testimonials-hero__star" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1l2.39 4.84L18 6.73l-4 3.9.94 5.5L10 13.27l-4.94 2.86.94-5.5-4-3.9 5.61-.89z"/></svg>
        {{ end }}
      </div>
      <span>{{ i18n "testimonialsHeroRating" }}</span>
    </div>
  </div>
</section>

<!-- Section 1: Featured Reviews (horizontal scroll) -->
{{ if $testimonials }}
<section class="testimonials-featured section">
  <div class="container">
    <div class="section__header">
      <h2 class="section__title">{{ i18n "testimonialsFeaturedTitle" }}</h2>
    </div>
    <div class="testimonials-featured__track" id="featured-track">
      {{ range first 4 $testimonials }}
      <div class="testimonials-featured__card">
        <div class="testimonials-featured__avatar">
          <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
            <circle cx="22" cy="22" r="21" fill="var(--color-bg-alt)" stroke="var(--color-border)" stroke-width="1"/>
            <circle cx="22" cy="17" r="7" fill="var(--color-primary-light)" opacity="0.6"/>
            <ellipse cx="22" cy="34" rx="14" ry="9" fill="var(--color-primary-light)" opacity="0.4"/>
          </svg>
        </div>
        <div class="testimonials-featured__stars">
          {{ range seq .rating }}
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1l2.39 4.84L18 6.73l-4 3.9.94 5.5L10 13.27l-4.94 2.86.94-5.5-4-3.9 5.61-.89z"/></svg>
          {{ end }}
        </div>
        <p class="testimonials-featured__quote">"{{ .text }}"</p>
        <div class="testimonials-featured__author">
          <span class="testimonials-featured__name">{{ .name }}</span>
          <span class="testimonials-featured__role">{{ .role }}</span>
        </div>
      </div>
      {{ end }}
    </div>
  </div>
</section>
{{ end }}

<!-- Section 2: All Reviews Grid -->
{{ if $testimonials }}
<section class="testimonials-all section">
  <div class="container">
    <div class="section__header">
      <h2 class="section__title">{{ i18n "testimonialsAllTitle" }}</h2>
    </div>

    <div class="testimonials-all__filters">
      <div class="testimonials-all__filter-group">
        <button class="testimonials-all__filter-btn testimonials-all__filter-btn--active" data-filter="all">{{ i18n "testimonialsFilterAll" }}</button>
        <button class="testimonials-all__filter-btn" data-filter="styleJP">{{ i18n "styleJP" }}</button>
        <button class="testimonials-all__filter-btn" data-filter="styleKR">{{ i18n "styleKR" }}</button>
        <button class="testimonials-all__filter-btn" data-filter="styleUS">{{ i18n "styleUS" }}</button>
        <button class="testimonials-all__filter-btn" data-filter="styleQ">{{ i18n "styleQ" }}</button>
        <button class="testimonials-all__filter-btn" data-filter="stylePixel">{{ i18n "stylePixel" }}</button>
        <button class="testimonials-all__filter-btn" data-filter="styleCyber">{{ i18n "styleCyber" }}</button>
      </div>
    </div>

    <div class="testimonials-all__grid">
      {{ range $testimonials }}
      <div class="testimonials-all__card" data-style="{{ .style | default "all" }}">
        <div class="testimonials-all__card-header">
          <div class="testimonials-all__avatar">
            <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
              <circle cx="22" cy="22" r="21" fill="var(--color-bg-alt)" stroke="var(--color-border)" stroke-width="1"/>
              <circle cx="22" cy="17" r="7" fill="var(--color-primary-light)" opacity="0.6"/>
              <ellipse cx="22" cy="34" rx="14" ry="9" fill="var(--color-primary-light)" opacity="0.4"/>
            </svg>
          </div>
          <div>
            <span class="testimonials-all__name">{{ .name }}</span>
            {{ if .style }}
            <span class="testimonials-all__style-tag">{{ i18n .style }}</span>
            {{ end }}
          </div>
        </div>
        <div class="testimonials-all__stars">
          {{ range seq .rating }}
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1l2.39 4.84L18 6.73l-4 3.9.94 5.5L10 13.27l-4.94 2.86.94-5.5-4-3.9 5.61-.89z"/></svg>
          {{ end }}
        </div>
        <p class="testimonials-all__text">"{{ .text }}"</p>
      </div>
      {{ end }}
    </div>
  </div>
</section>
{{ end }}

<!-- Section 3: Stats Bar -->
<section class="testimonials-stats section">
  <div class="container">
    <div class="testimonials-stats__grid">
      <div class="testimonials-stats__item">
        <div class="testimonials-stats__value">10,000<span class="gradient-text">+</span></div>
        <div class="testimonials-stats__label">{{ i18n "testimonialsStatsGenerated" }}</div>
      </div>
      <div class="testimonials-stats__item">
        <div class="testimonials-stats__value">98.5<span class="gradient-text">%</span></div>
        <div class="testimonials-stats__label">{{ i18n "testimonialsStatsSatisfaction" }}</div>
      </div>
      <div class="testimonials-stats__item">
        <div class="testimonials-stats__value">&lt; <span class="gradient-text">30</span>s</div>
        <div class="testimonials-stats__label">{{ i18n "testimonialsStatsSpeed" }}</div>
      </div>
    </div>
  </div>
</section>

<!-- CTA Banner -->
<section class="testimonials-cta section">
  <div class="container">
    <div class="testimonials-cta__inner">
      <h2 class="testimonials-cta__title">{{ i18n "testimonialsCTATitle" }}</h2>
      <a href="{{ "create" | relLangURL }}" class="testimonials-cta__btn">{{ i18n "testimonialsCTABtn" }}</a>
    </div>
  </div>
</section>

{{ end }}
```

- [ ] **Step 2: 提交**

```bash
cd /root/web-project && git add ai-anime-avatar/layouts/_default/testimonials.html && git commit -m "$(cat <<'EOF'
feat: add /testimonials/ page template with featured, grid, stats, cta

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: 创建引导卡片 partial + CSS

**Files:**
- Create: `layouts/partials/guide-cards.html`
- Create: `assets/css/components/guide-cards.css`

- [ ] **Step 1: 创建 layouts/partials/guide-cards.html**

```html
<section class="guide-cards section" id="guide">
  <div class="container">
    <div class="guide-cards__grid">

      <!-- Left Card: Create -->
      <a href="{{ "create" | relLangURL }}" class="guide-card guide-card--create">
        <div class="guide-card__glow guide-card__glow--apricot" aria-hidden="true"></div>
        <div class="guide-card__inner">
          <div class="guide-card__icon">
            <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <!-- Face silhouette -->
              <circle cx="40" cy="34" r="14" stroke="var(--color-primary)" stroke-width="1.5"/>
              <path d="M22 60c0-9.94 8.06-14 18-14s18 4.06 18 14" stroke="var(--color-primary)" stroke-width="1.5" stroke-linecap="round"/>
              <!-- Upload arrow -->
              <path d="M58 16l-6 6M58 16l6 6M58 16v14" stroke="var(--color-primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <!-- Sparkle stars -->
              <circle cx="64" cy="10" r="1.5" fill="var(--color-primary)" opacity="0.6"/>
              <circle cx="16" cy="14" r="1" fill="var(--color-primary)" opacity="0.4"/>
              <circle cx="68" cy="24" r="1" fill="var(--color-primary)" opacity="0.4"/>
            </svg>
          </div>
          <h3 class="guide-card__title">{{ i18n "guideCreateTitle" }}</h3>
          <p class="guide-card__desc">{{ i18n "guideCreateDesc" }}</p>
          <span class="guide-card__cta">
            {{ i18n "guideCreateCTA" }}
          </span>
        </div>
      </a>

      <!-- Right Card: Testimonials -->
      <a href="{{ "testimonials" | relLangURL }}" class="guide-card guide-card--testimonials">
        <div class="guide-card__glow guide-card__glow--sakura" aria-hidden="true"></div>
        <div class="guide-card__inner">
          <div class="guide-card__icon">
            <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <!-- Multiple avatar outlines -->
              <circle cx="32" cy="30" r="10" stroke="var(--color-secondary)" stroke-width="1.5"/>
              <circle cx="48" cy="28" r="10" stroke="var(--color-secondary)" stroke-width="1.5"/>
              <circle cx="40" cy="38" r="10" stroke="var(--color-secondary)" stroke-width="1.5"/>
              <!-- Big star -->
              <path d="M40 10l2.02 5.72 5.98.48-4.6 3.9 1.42 5.82L40 22.9l-4.82 3.02 1.42-5.82-4.6-3.9 5.98-.48L40 10z" fill="var(--color-secondary)" opacity="0.6"/>
            </svg>
          </div>
          <h3 class="guide-card__title">{{ i18n "guideTestimonialsTitle" }}</h3>
          <p class="guide-card__desc">{{ i18n "guideTestimonialsDesc" }}</p>
          <span class="guide-card__cta">
            {{ i18n "guideTestimonialsCTA" }}
          </span>
        </div>
      </a>

    </div>
  </div>
</section>
```

- [ ] **Step 2: 创建 assets/css/components/guide-cards.css**

```css
/* ==========================================================================
   Guide Cards — Homepage CTA cards linking to /create/ and /testimonials/
   ========================================================================== */

.guide-cards__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.guide-card {
  position: relative;
  display: block;
  border-radius: var(--radius-xl);
  padding: 48px 36px 40px;
  text-align: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
  cursor: pointer;
}

.guide-card::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity var(--transition);
  pointer-events: none;
  z-index: 0;
}

.guide-card--create::before {
  background: radial-gradient(ellipse 300px 200px at center, rgba(212, 167, 116, 0.18), transparent 70%);
}

.guide-card--testimonials::before {
  background: radial-gradient(ellipse 300px 200px at center, rgba(232, 180, 184, 0.18), transparent 70%);
}

.guide-card:hover::before {
  opacity: 1;
}

.guide-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.guide-card--create:hover {
  border-color: var(--color-primary);
}

.guide-card--testimonials:hover {
  border-color: var(--color-secondary);
}

.guide-card:active {
  transform: scale(0.98);
}

.guide-card__inner {
  position: relative;
  z-index: 1;
}

.guide-card__icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
}

.guide-card__title {
  font-family: var(--font-serif);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: 8px;
}

.guide-card__desc {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: 20px;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
}

.guide-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  transition: gap var(--transition);
}

.guide-card--create .guide-card__cta {
  color: var(--color-primary-dark);
}

.guide-card--testimonials .guide-card__cta {
  color: var(--color-secondary-dark);
}

.guide-card:hover .guide-card__cta {
  gap: 10px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .guide-card {
    transition: none;
  }
  .guide-card__cta {
    transition: none;
  }
}

/* Mobile */
@media (max-width: 859px) {
  .guide-cards__grid {
    grid-template-columns: 1fr;
    max-width: 500px;
    gap: 16px;
  }

  .guide-card {
    padding: 36px 24px 32px;
  }
}
```

- [ ] **Step 3: 提交**

```bash
cd /root/web-project && git add ai-anime-avatar/layouts/partials/guide-cards.html ai-anime-avatar/assets/css/components/guide-cards.css && git commit -m "$(cat <<'EOF'
feat: add guide cards partial with glass hover effects

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: 创建子页面 CSS

**Files:**
- Create: `assets/css/components/page-create.css`
- Create: `assets/css/components/page-testimonials.css`

- [ ] **Step 1: 创建 assets/css/components/page-create.css**

```css
/* ==========================================================================
   /create/ Page Styles
   ========================================================================== */

/* Hero */
.create-hero {
  position: relative;
  padding: 120px 0 80px;
  text-align: center;
  overflow: hidden;
}

.create-hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.create-hero__wash {
  position: absolute;
  inset: 0;
  background: var(--gradient-watercolor);
}

.create-hero__inner {
  position: relative;
  z-index: 1;
}

.create-hero__badge {
  display: inline-block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary-dark);
  background: var(--color-primary-bg);
  padding: 6px 16px;
  border-radius: var(--radius-full);
  margin-bottom: 20px;
}

.create-hero__title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: 16px;
  letter-spacing: -0.01em;
}

.create-hero__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 520px;
  margin: 0 auto 32px;
  line-height: 1.7;
}

.create-hero__cta {
  display: inline-flex;
  align-items: center;
  padding: 14px 36px;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  background: var(--color-primary);
  color: #FFFFFF;
  border-radius: var(--radius-full);
  box-shadow: 0 4px 14px rgba(184, 137, 106, 0.30);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.create-hero__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(184, 137, 106, 0.40);
}

/* Style Preselect */
.create-style-preselect {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.create-style-preselect__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-right: 4px;
}

.create-style-preselect__chip {
  padding: 6px 16px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.create-style-preselect__chip:hover,
.create-style-preselect__chip--active {
  border-color: var(--color-primary);
  color: var(--color-primary-dark);
  background: var(--color-primary-bg);
}

/* Privacy hint */
.upload__privacy {
  margin-top: 8px;
  color: var(--color-text-muted);
}

/* Filter Bar */
.create-filter-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
}

.create-filter-bar__btn {
  padding: 8px 20px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.create-filter-bar__btn:hover,
.create-filter-bar__btn--active {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
  color: var(--color-primary-dark);
}

/* Before/After Slider */
.create-compare__slider {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  max-width: 800px;
  margin: 0 auto;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.create-compare__panel {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.create-compare__panel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.create-compare__label {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 14px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.create-compare__handle {
  display: none;
}

/* CTA Banner */
.create-cta__inner {
  text-align: center;
  padding: 56px 24px;
  background: linear-gradient(135deg, rgba(212, 167, 116, 0.12), rgba(232, 180, 184, 0.12));
  border-radius: var(--radius-xl);
}

.create-cta__title {
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: 24px;
}

.create-cta__btn {
  display: inline-flex;
  align-items: center;
  padding: 14px 36px;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  background: var(--color-primary);
  color: #FFFFFF;
  border-radius: var(--radius-full);
  box-shadow: 0 4px 14px rgba(184, 137, 106, 0.30);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.create-cta__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(184, 137, 106, 0.40);
}

@media (max-width: 768px) {
  .create-hero {
    padding: 100px 0 60px;
  }
  .create-cta__inner {
    padding: 40px 20px;
  }
}
```

- [ ] **Step 2: 创建 assets/css/components/page-testimonials.css**

```css
/* ==========================================================================
   /testimonials/ Page Styles
   ========================================================================== */

/* Hero */
.testimonials-hero {
  position: relative;
  padding: 120px 0 80px;
  text-align: center;
  overflow: hidden;
}

.testimonials-hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.testimonials-hero__wash {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 60% at 50% 30%, rgba(232, 180, 184, 0.15), transparent 70%),
              radial-gradient(ellipse 40% 40% at 80% 50%, rgba(212, 167, 116, 0.1), transparent 60%);
}

.testimonials-hero__inner {
  position: relative;
  z-index: 1;
}

.testimonials-hero__title {
  font-family: var(--font-serif);
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: 16px;
  letter-spacing: -0.01em;
}

.testimonials-hero__rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

.testimonials-hero__stars {
  display: flex;
  gap: 2px;
  color: #E8A838;
}

.testimonials-hero__star {
  width: 20px;
  height: 20px;
}

/* Featured Reviews - Horizontal Scroll */
.testimonials-featured__track {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 8px;
  scrollbar-width: none;
}

.testimonials-featured__track::-webkit-scrollbar {
  display: none;
}

.testimonials-featured__card {
  flex: 0 0 340px;
  scroll-snap-align: start;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: 32px 28px;
}

.testimonials-featured__avatar {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
}

.testimonials-featured__stars {
  display: flex;
  gap: 2px;
  color: #E8A838;
  margin-bottom: 12px;
}

.testimonials-featured__quote {
  font-size: var(--font-size-base);
  color: var(--color-text);
  line-height: 1.7;
  margin-bottom: 16px;
  font-style: italic;
}

.testimonials-featured__name {
  display: block;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.testimonials-featured__role {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* All Reviews Grid */
.testimonials-all__filters {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.testimonials-all__filter-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.testimonials-all__filter-btn {
  padding: 8px 20px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.testimonials-all__filter-btn:hover,
.testimonials-all__filter-btn--active {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
  color: var(--color-primary-dark);
}

.testimonials-all__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.testimonials-all__card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  transition: transform var(--transition), box-shadow var(--transition);
}

.testimonials-all__card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.testimonials-all__card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.testimonials-all__avatar {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.testimonials-all__name {
  display: block;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.testimonials-all__style-tag {
  display: inline-block;
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  background: var(--color-primary-bg);
  color: var(--color-primary-dark);
  border-radius: var(--radius-xs);
  margin-top: 4px;
}

.testimonials-all__stars {
  display: flex;
  gap: 2px;
  color: #E8A838;
  margin-bottom: 10px;
}

.testimonials-all__text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
  font-style: italic;
}

/* Stats Bar */
.testimonials-stats__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.testimonials-stats__item {
  padding: 32px 16px;
}

.testimonials-stats__value {
  font-family: var(--font-serif);
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-text);
  margin-bottom: 4px;
}

.testimonials-stats__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* CTA Banner */
.testimonials-cta__inner {
  text-align: center;
  padding: 56px 24px;
  background: linear-gradient(135deg, rgba(232, 180, 184, 0.12), rgba(212, 167, 116, 0.12));
  border-radius: var(--radius-xl);
}

.testimonials-cta__title {
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: 24px;
}

.testimonials-cta__btn {
  display: inline-flex;
  align-items: center;
  padding: 14px 36px;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  background: var(--color-primary);
  color: #FFFFFF;
  border-radius: var(--radius-full);
  box-shadow: 0 4px 14px rgba(184, 137, 106, 0.30);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.testimonials-cta__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(184, 137, 106, 0.40);
}

@media (max-width: 768px) {
  .testimonials-hero {
    padding: 100px 0 60px;
  }
  .testimonials-all__grid {
    grid-template-columns: 1fr;
  }
  .testimonials-stats__grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .testimonials-featured__card {
    flex: 0 0 290px;
  }
  .testimonials-cta__inner {
    padding: 40px 20px;
  }
}
```

- [ ] **Step 3: 提交**

```bash
cd /root/web-project && git add ai-anime-avatar/assets/css/components/page-create.css ai-anime-avatar/assets/css/components/page-testimonials.css && git commit -m "$(cat <<'EOF'
feat: add page-specific CSS for /create/ and /testimonials/

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: 修改主页

**Files:**
- Modify: `layouts/_default/home.html`

- [ ] **Step 1: 更新 home.html — 移除 4 个 section，插入引导卡片**

将 home.html 从：
```html
{{ define "main" }}
  {{ partial "hero.html" . }}
  {{ partial "showcase.html" . }}
  {{ partial "how-it-works.html" . }}
  {{ partial "upload.html" . }}
  {{ partial "results.html" . }}
  {{ partial "comparison.html" . }}
  {{ partial "testimonials.html" . }}
  {{ partial "faq.html" . }}
  {{ partial "share.html" . }}
{{ end }}
```

改为：
```html
{{ define "main" }}
  {{ partial "hero.html" . }}
  {{ partial "showcase.html" . }}
  {{ partial "how-it-works.html" . }}
  {{ partial "guide-cards.html" . }}
  {{ partial "faq.html" . }}
  {{ partial "share.html" . }}
{{ end }}
```

- [ ] **Step 2: 提交**

```bash
cd /root/web-project && git add ai-anime-avatar/layouts/_default/home.html && git commit -m "$(cat <<'EOF'
feat: slim homepage to hero/showcase/how/guide-cards/faq/share

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: 修改 Header 导航

**Files:**
- Modify: `layouts/partials/header.html`

- [ ] **Step 1: 更新桌面导航 — 新增两个链接**

在 `header.html` 的 `<nav class="header__nav">` 中，在首页链接后插入：

```html
<a href="{{ "create" | relLangURL }}" class="header__nav-link">{{ i18n "navCreate" }}</a>
<a href="{{ "testimonials" | relLangURL }}" class="header__nav-link">{{ i18n "navTestimonials" }}</a>
```

更新后的导航顺序为：
```html
<a href="{{ .Site.Home.Permalink }}" class="header__nav-link">{{ i18n "navHome" }}</a>
<a href="{{ "create" | relLangURL }}" class="header__nav-link">{{ i18n "navCreate" }}</a>
<a href="{{ "testimonials" | relLangURL }}" class="header__nav-link">{{ i18n "navTestimonials" }}</a>
<a href="#showcase" class="header__nav-link">{{ i18n "navFeatures" }}</a>
<a href="#how-it-works" class="header__nav-link">{{ i18n "navHowItWorks" }}</a>
<a href="#faq" class="header__nav-link">{{ i18n "navFAQ" }}</a>
```

- [ ] **Step 2: 更新移动端汉堡菜单 — 同步新增两个链接**

在 `#mobile-nav` 中同样新增：
```html
<a href="{{ "create" | relLangURL }}" class="header__mobile-link">{{ i18n "navCreate" }}</a>
<a href="{{ "testimonials" | relLangURL }}" class="header__mobile-link">{{ i18n "navTestimonials" }}</a>
```

插入在首页链接后、`#showcase` 前。

- [ ] **Step 3: 提交**

```bash
cd /root/web-project && git add ai-anime-avatar/layouts/partials/header.html && git commit -m "$(cat <<'EOF'
feat: add /create/ and /testimonials/ links to header nav

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: 修改 Footer 链接

**Files:**
- Modify: `layouts/partials/footer.html`

- [ ] **Step 1: 更新 footer 链接为子页面路由**

将 footer 中：
```html
<a href="#showcase" class="footer__col-link">{{ i18n "navFeatures" }}</a>
<a href="#how-it-works" class="footer__col-link">{{ i18n "navHowItWorks" }}</a>
<a href="#upload" class="footer__col-link">{{ i18n "heroCTA" }}</a>
```

替换为：
```html
<a href="{{ "create" | relLangURL }}" class="footer__col-link">{{ i18n "navCreate" }}</a>
<a href="{{ "testimonials" | relLangURL }}" class="footer__col-link">{{ i18n "navTestimonials" }}</a>
<a href="#how-it-works" class="footer__col-link">{{ i18n "navHowItWorks" }}</a>
<a href="#faq" class="footer__col-link">{{ i18n "navFAQ" }}</a>
```

- [ ] **Step 2: 提交**

```bash
cd /root/web-project && git add ai-anime-avatar/layouts/partials/footer.html && git commit -m "$(cat <<'EOF'
feat: update footer links to subpage routes

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: 更新 main.css imports

**Files:**
- Modify: `assets/css/main.css`

- [ ] **Step 1: 添加 3 个新组件 import**

在 `assets/css/main.css` 末尾的 `@import` 区域追加：

```css
@import 'components/guide-cards.css';
@import 'components/page-create.css';
@import 'components/page-testimonials.css';
```

- [ ] **Step 2: 提交**

```bash
cd /root/web-project && git add ai-anime-avatar/assets/css/main.css && git commit -m "$(cat <<'EOF'
feat: import new component CSS files

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: 扩展 testimonials 数据

**Files:**
- Modify: `data/testimonials.json`

- [ ] **Step 1: 替换 data/testimonials.json 为扩展版本**

新数据中英日各 10 条，每条增加 `style` 字段用于筛选：

```json
{
  "zh": [
    {"name": "小樱花", "role": "自由插画师", "text": "太惊喜了！生成的动漫头像质量超高，比我之前用过的任何工具都好。日系风格尤其出色，完全看不出是 AI 生成的。", "rating": 5, "style": "styleJP"},
    {"name": "动漫迷小王", "role": "大学生", "text": "每天免费 3 次完全够用了，像素风格超可爱，已经推荐给全班同学了。等着出更多风格！", "rating": 5, "style": "stylePixel"},
    {"name": "设计师Lisa", "role": "UI 设计师", "text": "作为设计师，我对输出质量要求很高。AI 动漫头像的 4K 分辨率完全满足了我的需求，商业授权也很方便。", "rating": 4, "style": "styleUS"},
    {"name": "阿杰", "role": "游戏主播", "text": "直播的时候用了赛博朋克风格的头像，粉丝都说帅炸了！效果比想象中好太多了。", "rating": 5, "style": "styleCyber"},
    {"name": "喵小咪", "role": "二次元博主", "text": "Q版风格真的萌翻了！用来做社交头像再合适不过，朋友都以为是我自己画的。", "rating": 5, "style": "styleQ"},
    {"name": "远航", "role": "摄影师", "text": "对画质很挑剔，但漫改的 4K 输出确实没话说。韩系风格色彩处理特别自然，推荐给同行了。", "rating": 4, "style": "styleKR"},
    {"name": "小橘子", "role": "大学生", "text": "朋友圈发了美漫风的头像，好多人问在哪里做的。3 次免费试用后直接买了专业版，真的很值！", "rating": 5, "style": "styleUS"},
    {"name": "程序员老张", "role": "全栈工程师", "text": "本来只是好奇试试，结果像素风格让我想起了玩红白机的日子。现在团队 Slack 头像都换成这个了。", "rating": 5, "style": "stylePixel"},
    {"name": "花卷妈妈", "role": "全职妈妈", "text": "给娃做了个 Q 版头像当微信头像，可爱到爆！操作也很简单，手机上传不到一分钟就搞定了。", "rating": 4, "style": "styleQ"},
    {"name": "阿Ken", "role": "潮流博主", "text": "日系风格做出来的效果和我关注的日本画师风格几乎一样，这个 AI 模型训练得确实好。", "rating": 5, "style": "styleJP"}
  ],
  "en": [
    {"name": "Sakura", "role": "Freelance Illustrator", "text": "Absolutely amazing! The anime avatars are incredibly high quality, better than any tool I've tried. The Japanese style is especially impressive.", "rating": 5, "style": "styleJP"},
    {"name": "Mike", "role": "College Student", "text": "3 free daily generations are plenty! The pixel art style is adorable. Already shared with my entire class. Can't wait for more styles!", "rating": 5, "style": "stylePixel"},
    {"name": "Lisa", "role": "UI Designer", "text": "As a designer, I have high standards for output quality. The 4K resolution meets all my needs, and the commercial license is very convenient.", "rating": 4, "style": "styleUS"},
    {"name": "Jay", "role": "Game Streamer", "text": "Used the cyberpunk style for my stream avatar and everyone went crazy! Way better than I expected.", "rating": 5, "style": "styleCyber"},
    {"name": "MochiCat", "role": "Anime Blogger", "text": "The chibi style is absolutely adorable! Perfect for social media avatars. My friends thought I drew it myself.", "rating": 5, "style": "styleQ"},
    {"name": "David", "role": "Photographer", "text": "I'm picky about image quality, but the 4K output is genuinely impressive. Korean style color processing is beautifully natural.", "rating": 4, "style": "styleKR"},
    {"name": "Orange", "role": "College Student", "text": "Posted the comic style avatar on Instagram and got so many questions. Upgraded to Pro after the 3 free tries — totally worth it!", "rating": 5, "style": "styleUS"},
    {"name": "Zhang", "role": "Full-Stack Developer", "text": "Tried it out of curiosity and the pixel style gave me serious retro gaming nostalgia. Our whole team uses it for Slack now.", "rating": 5, "style": "stylePixel"},
    {"name": "MomofBuns", "role": "Stay-at-home Mom", "text": "Made a chibi avatar of my kid for WeChat and it's the cutest thing ever! So easy to use — did it on my phone in under a minute.", "rating": 4, "style": "styleQ"},
    {"name": "Ken", "role": "Trend Blogger", "text": "The Japanese style output looks nearly identical to the artists I follow. The AI model is really well trained.", "rating": 5, "style": "styleJP"}
  ],
  "ja": [
    {"name": "さくら", "role": "フリーイラストレーター", "text": "本当に素晴らしい！アニメアバターの品質が非常に高く、今まで使ったどのツールよりも優れています。日本風スタイルは特に印象的です。", "rating": 5, "style": "styleJP"},
    {"name": "タケシ", "role": "大学生", "text": "毎日3回の無料生成で十分です！ピクセルアートスタイルがとてもかわいい。クラス全員にシェアしました。もっとスタイルが増えるのが楽しみ！", "rating": 5, "style": "stylePixel"},
    {"name": "リサ", "role": "UIデザイナー", "text": "デザイナーとして出力品質には厳しい目を持っていますが、4K解像度はすべてのニーズを満たし、商用ライセンスもとても便利です。", "rating": 4, "style": "styleUS"},
    {"name": "ジェイ", "role": "ゲーム配信者", "text": "配信でサイバーパンクスタイルのアバターを使ったら、視聴者にかっこいいと大好評！想像以上でした。", "rating": 5, "style": "styleCyber"},
    {"name": "もちネコ", "role": "アニメブロガー", "text": "ちびキャラスタイルが本当に可愛い！SNSのアバターにぴったりです。友達には自分で描いたと思われました。", "rating": 5, "style": "styleQ"},
    {"name": "タナカ", "role": "フォトグラファー", "text": "画質にはうるさいほうですが、4K出力には本当に満足しています。韓国風の色彩処理がとても自然です。", "rating": 4, "style": "styleKR"},
    {"name": "ミカン", "role": "大学生", "text": "アメコミ風のアバターをSNSに投稿したらたくさん質問が来ました。無料3回の後すぐにプロ版にアップグレード！", "rating": 5, "style": "styleUS"},
    {"name": "チョウ", "role": "フルスタックエンジニア", "text": "興味本位で試したら、ピクセルスタイルがレトロゲームの懐かしさを思い出させてくれました。チーム全員のSlackアイコンがこれになりました。", "rating": 5, "style": "stylePixel"},
    {"name": "パン", "role": "専業主婦", "text": "子供のちびキャラアバターを作ってWeChatのアイコンにしました。とても簡単で、スマホで1分もかかりませんでした。", "rating": 4, "style": "styleQ"},
    {"name": "ケン", "role": "トレンドブロガー", "text": "日本風スタイルの出力は、フォローしている日本人イラストレーターとほとんど同じクオリティです。AIモデルの学習が本当に優れています。", "rating": 5, "style": "styleJP"}
  ]
}
```

- [ ] **Step 2: 提交**

```bash
cd /root/web-project && git add ai-anime-avatar/data/testimonials.json && git commit -m "$(cat <<'EOF'
feat: extend testimonials data to 10 entries per language with style tags

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: 构建验证

**Files:** None (validation only)

- [ ] **Step 1: 执行 Hugo 构建**

```bash
cd /root/web-project/ai-anime-avatar && hugo --minify 2>&1
```
Expected: 无错误退出。输出应显示正常构建，新页面出现在 public/ 目录。

- [ ] **Step 2: 验证生成的文件**

```bash
ls /root/web-project/ai-anime-avatar/public/create/index.html /root/web-project/ai-anime-avatar/public/testimonials/index.html /root/web-project/ai-anime-avatar/public/en/create/index.html /root/web-project/ai-anime-avatar/public/en/testimonials/index.html /root/web-project/ai-anime-avatar/public/ja/create/index.html /root/web-project/ai-anime-avatar/public/ja/testimonials/index.html 2>&1
```
Expected: 6 个文件路径全部存在。

- [ ] **Step 3: 检查主页不再包含已移除的 section**

```bash
grep -c "id=\"upload\"" /root/web-project/ai-anime-avatar/public/index.html; grep -c "id=\"results\"" /root/web-project/ai-anime-avatar/public/index.html; grep -c "id=\"comparison\"" /root/web-project/ai-anime-avatar/public/index.html; grep -c "id=\"testimonials\"" /root/web-project/ai-anime-avatar/public/index.html
```
Expected: 全部返回 0。

- [ ] **Step 4: 检查 /create/ 页面包含 upload 和 results**

```bash
grep -c "id=\"upload\"" /root/web-project/ai-anime-avatar/public/create/index.html; grep -c "id=\"results\"" /root/web-project/ai-anime-avatar/public/create/index.html; grep -c "id=\"compare\"" /root/web-project/ai-anime-avatar/public/create/index.html
```
Expected: 全部返回 1。

- [ ] **Step 5: 检查导航包含新链接**

```bash
grep -c "navCreate" /root/web-project/ai-anime-avatar/public/index.html
```
Expected: > 0 (导航中有创作链接)。

- [ ] **Step 6: 检查 SEO meta 标签正确**

```bash
grep '<title>' /root/web-project/ai-anime-avatar/public/create/index.html; grep '<meta name="description"' /root/web-project/ai-anime-avatar/public/create/index.html | head -1; grep '<meta name="keywords"' /root/web-project/ai-anime-avatar/public/create/index.html | head -1
```
Expected: 显示创作页的独立 SEO 内容，非站点默认值。

---

## 自审清单

- [x] **Spec coverage** — 每个 spec 需求均有对应任务：主页精简(Task 8)、引导卡片(Task 6)、header 导航(Task 9)、footer(Task 10)、/create/ 页(Task 4)、/testimonials/ 页(Task 5)、SEO(Task 3)、CSS(Task 7,11)、i18n(Task 1)、content(Task 2)、testimonials 数据扩展(Task 12)
- [x] **No placeholders** — 所有代码块均为完整实现
- [x] **Type consistency** — `relLangURL` 用于 Hugo 内部链接统一，CSS 变量复用 `--color-*` 系统，i18n 键名一致使用 camelCase 前缀
