# AI Prompt 视觉重设计 —「独立刊物」实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 AI Prompt 站从通用 AI SaaS 风格重塑为独立杂志/印刷刊物质感，保留全部内容和功能。

**Architecture:** 纯 CSS 重写（CSS 变量 + 组件样式）+ 少量 JS 增强（Intersection Observer 滚动渐显 + Hero 光照跟随）。Hugo 模板仅做结构调整（Hero 改为错位排版、分类改为目录列表），不做逻辑变更。

**Tech Stack:** Hugo SSG, vanilla CSS (CSS custom properties), vanilla JS (Intersection Observer, mousemove), Noto Serif SC

---

## 文件结构

```
修改:
  static/css/main.css          — 完整重写（Token → 全局 → 组件 → 动画）
  layouts/index.html            — Hero 封面式布局 + 分类目录列表
  layouts/partials/prompt-card.html — 便签卡片结构微调
  layouts/_default/list.html    — 侧边栏样式 + 工具页卡片
  layouts/_default/single.html  — 提示词详情引用块
  layouts/partials/header.html  — Logo + Nav 更新
  layouts/partials/footer.html  — 杂志版权页式
  layouts/_default/baseof.html  — 新增 JS 引用

新建:
  static/js/scroll-reveal.js    — Intersection Observer 滚动渐显
  static/js/lighting-follow.js  — Hero 区光照跟随鼠标

不变:
  static/js/search.js           — 搜索逻辑完全保留
  static/js/copy.js             — 复制逻辑完全保留
  static/js/tools-mock.js       — 工具 Mock 逻辑完全保留
  content/                      — 所有内容不动
  data/                         — 所有数据不动
  hugo.toml                     — 配置不动
```

---

### Task 1: CSS 基础层 — 设计 Token + 纸张纹理 + 排版

**Files:**
- Modify: `static/css/main.css`

替换所有 `:root` 变量和全局基础样式。

- [ ] **Step 1: 替换 CSS Reset 和根变量**

将 `static/css/main.css` 的第 1-44 行（Reset + Token）替换为：

```css
/* ===== CSS Reset ===== */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;color:var(--text-primary);background:var(--bg-primary);line-height:1.7;-webkit-font-smoothing:antialiased}
img{max-width:100%;height:auto;display:block}
a{color:inherit;text-decoration:none}
button{cursor:pointer;border:none;background:none;font:inherit;color:inherit}
input{font:inherit;color:inherit}
ul,ol{list-style:none}
pre{font-family:"JetBrains Mono","SF Mono",Consolas,monospace;overflow-x:auto;line-height:1.8}
h1,h2,h3,h4{font-family:"Noto Serif SC",serif;line-height:1.35;color:var(--text-primary)}
h1{font-size:clamp(2rem,5vw,3.5rem);letter-spacing:-0.01em}
h2{font-size:clamp(1.5rem,3vw,2rem)}
h3{font-size:1.25rem}
h4{font-size:1.125rem}

/* ===== Design Tokens — 纸张印刷色系 ===== */
:root{
  --bg-primary: #FBF8F2;
  --bg-card: #F6F3EC;
  --accent: #B8403F;
  --accent-deep: #8B2E2F;
  --accent-light: #F5EDE8;
  --accent-ink: #4A6670;
  --text-primary: #2C2C2C;
  --text-secondary: #7A7068;
  --text-tertiary: #A09890;
  --border: #E6DFD2;
  --border-light: #EFE9DE;
  --success: #5B8C5A;
  --success-light: #E8F0E5;
  --tag-bg: #EDE7DB;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.03);
  --shadow-md: 0 2px 8px rgba(0,0,0,0.05);
  --shadow-lg: 0 4px 16px rgba(0,0,0,0.06);
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 20px;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
  --container: 1200px;
  --container-narrow: 760px;
}

/* ===== 全局纸张噪点纹理 ===== */
body::after{
  content:'';
  position:fixed;
  inset:0;
  z-index:99999;
  pointer-events:none;
  opacity:0.035;
  background:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")
}
```

- [ ] **Step 2: 重写工具类部分**

替换第 46-53 行（Utility + Buttons）：

```css
/* ===== Utility ===== */
.container{max-width:var(--container);margin:0 auto;padding:0 24px}
.container-narrow{max-width:var(--container-narrow);margin:0 auto;padding:0 24px}
.section{padding:72px 0}
.section-title{font-family:"Noto Serif SC",serif;text-align:center;margin-bottom:12px;font-size:1.5rem}
.section-desc{text-align:center;color:var(--text-secondary);margin-bottom:48px;font-size:1rem}
.section-cta{text-align:center;margin-top:40px}
.text-accent{color:var(--accent)}

/* ===== Buttons — 印章按压感 ===== */
.btn-primary,.btn-secondary{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;border-radius:var(--radius-md);font-weight:500;font-size:0.95rem;transition:all var(--transition-base);letter-spacing:0.02em}
.btn-primary{background:var(--accent);color:#fff}
.btn-primary:hover{background:var(--accent-deep);transform:scale(0.97);box-shadow:inset 0 0 0 2px rgba(0,0,0,0.08)}
.btn-secondary{border:1.5px solid var(--border);color:var(--text-primary);background:transparent}
.btn-secondary:hover{border-color:var(--accent-ink);color:var(--accent-ink);transform:scale(0.97)}
```

- [ ] **Step 3: 构建验证**

```bash
cd /root/web-project/ai\ prompt/ && hugo --minify 2>&1 | tail -5
```
Expected: 无 error/warning

- [ ] **Step 4: Commit**

```bash
git -C /root/web-project/ai\ prompt/ add static/css/main.css
git -C /root/web-project/ai\ prompt/ commit -m "refactor(css): replace design tokens — paper color system, noise texture, ink-press buttons"
```

---

### Task 2: 全局外壳 — Header + Footer 重设计

**Files:**
- Modify: `layouts/partials/header.html`
- Modify: `layouts/partials/footer.html`
- Modify: `static/css/main.css` (Header/Footer CSS 区域)

- [ ] **Step 1: 更新 Header CSS（替换 main.css 第 62-88 行）**

```css
/* ===== Header ===== */
.site-header{position:sticky;top:0;z-index:100;background:rgba(251,248,242,0.88);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-bottom:1px solid var(--border)}
.header-inner{max-width:var(--container);margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:60px}
.logo{display:flex;align-items:center;gap:8px;font-family:"Noto Serif SC",serif;font-weight:700;font-size:1.1rem;color:var(--text-primary);letter-spacing:0.02em}
.logo-icon{display:none}
.logo-text{position:relative}
.logo-text::after{content:'';position:absolute;left:0;bottom:-2px;width:100%;height:1px;background:var(--accent);transform:scaleX(0);transition:transform var(--transition-slow);transform-origin:right}
.logo:hover .logo-text::after{transform:scaleX(1);transform-origin:left}
.site-nav{display:flex;gap:2px}
.nav-link{padding:6px 14px;border-radius:var(--radius-sm);font-size:0.9rem;color:var(--text-secondary);transition:color var(--transition-slow),background var(--transition-base)}
.nav-link:hover{color:var(--accent);background:var(--accent-light)}
.nav-link.active{color:var(--accent);font-weight:500}
.mobile-menu-btn{display:none;flex-direction:column;gap:5px;padding:8px}
.mobile-menu-btn span{display:block;width:22px;height:2px;background:var(--text-primary);border-radius:1px;transition:all var(--transition-base)}
```

- [ ] **Step 2: 更新 Header HTML — 去掉 Logo 图标**

```html
<header class="site-header" role="banner">
  <div class="header-inner">
    <a href="{{ "/" | relURL }}" class="logo" aria-label="{{ .Site.Title }} 首页">
      <span class="logo-text">{{ .Site.Data.site.name }}</span>
    </a>
    <nav class="site-nav" aria-label="主导航">
      {{ range .Site.Data.site.nav }}
      <a href="{{ .url | relURL }}" class="nav-link{{ if eq $.RelPermalink .url }} active{{ end }}">{{ .label }}</a>
      {{ end }}
    </nav>
    <button class="mobile-menu-btn" aria-label="菜单" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
```

- [ ] **Step 3: 更新 Footer CSS（替换 main.css 第 73-88 行）**

```css
/* ===== Footer — 杂志版权页 ===== */
.site-footer{border-top:1px solid var(--border);padding:40px 0 28px;text-align:center}
.footer-inner{max-width:var(--container);margin:0 auto;padding:0 24px}
.footer-brand{margin-bottom:16px}
.footer-logo{font-family:"Noto Serif SC",serif;font-weight:700;font-size:1rem;color:var(--text-primary)}
.footer-tagline{color:var(--text-secondary);font-size:0.85rem;margin-top:4px}
.footer-nav{display:flex;justify-content:center;gap:20px;margin-bottom:20px}
.footer-nav a{color:var(--text-tertiary);font-size:0.88rem;transition:color var(--transition-slow)}
.footer-nav a:hover{color:var(--accent-ink)}
.footer-bottom{padding-top:16px;border-top:1px solid var(--border-light);color:var(--text-tertiary);font-size:0.8rem;letter-spacing:0.03em}
```

- [ ] **Step 4: 更新 Footer HTML**

```html
<footer class="site-footer" role="contentinfo">
  <div class="footer-inner">
    <div class="footer-brand">
      <span class="footer-logo">{{ .Site.Data.site.name }}</span>
      <p class="footer-tagline">{{ .Site.Data.site.tagline }}</p>
    </div>
    <nav class="footer-nav" aria-label="底部导航">
      {{ range .Site.Data.site.nav }}
      <a href="{{ .url | relURL }}">{{ .label }}</a>
      {{ end }}
    </nav>
    <div class="footer-bottom">
      <p>&copy; {{ now.Format "2006" }} {{ .Site.Data.site.name }} — 高质量中文提示词独立刊物</p>
    </div>
  </div>
</footer>
```

- [ ] **Step 5: 更新响应式（追加到 main.css 末尾）**

```css
@media(max-width:768px){
  .site-nav{display:none}
  .mobile-menu-btn{display:flex}
  .section{padding:48px 0}
  .footer-nav{flex-wrap:wrap;gap:12px}
}
```

- [ ] **Step 6: 构建验证**

```bash
cd /root/web-project/ai\ prompt/ && hugo --minify 2>&1 | tail -5
```
Expected: 无 error/warning

- [ ] **Step 7: Commit**

```bash
git -C /root/web-project/ai\ prompt/ add static/css/main.css layouts/partials/header.html layouts/partials/footer.html
git -C /root/web-project/ai\ prompt/ commit -m "refactor(global): redesign header/footer — magazine colophon style, remove AI icon badge"
```

---

### Task 3: 首页 — 封面式 Hero 重做

**Files:**
- Modify: `layouts/index.html` (Hero 段)
- Modify: `static/css/main.css` (Hero CSS 区域)

- [ ] **Step 1: 替换 Hero CSS（替换 main.css 第 90-103 行）**

```css
/* ===== Hero — 杂志封面式排版 ===== */
.hero{position:relative;padding:96px 0 72px;overflow:hidden;cursor:default}
.hero-content{position:relative;max-width:860px;margin:0 auto;padding:0 24px}
.hero-issue{font-size:0.78rem;letter-spacing:0.12em;color:var(--text-tertiary);margin-bottom:32px;font-family:"JetBrains Mono","SF Mono",monospace}
.hero-headline{display:grid;grid-template-columns:1.2fr 0.8fr 1fr;gap:12px 24px;margin-bottom:40px}
.hero-headline .hl-part{font-family:"Noto Serif SC",serif;font-weight:700;font-size:clamp(2.8rem,6vw,5rem);line-height:1.1;position:relative}
.hero-headline .hl-part::after{content:attr(data-text);position:absolute;left:3px;top:3px;color:var(--text-primary);opacity:0.08;z-index:-1;white-space:pre}
.hero-headline .hl-part:nth-child(2){margin-top:0.5em}
.hero-headline .hl-part:nth-child(3){text-align:right;margin-top:0.3em}
.hero-subtitle{font-size:0.95rem;color:var(--text-secondary);margin-bottom:36px;line-height:1.8;max-width:480px;margin-left:auto;text-align:right}
.hero-search{position:relative;max-width:520px;margin:0 auto 24px}
.search-input{width:100%;padding:14px 48px 14px 0;border:none;border-bottom:1.5px solid var(--border);border-radius:0;font-size:1rem;background:transparent;transition:border-color var(--transition-slow);outline:none;color:var(--text-primary)}
.search-input::placeholder{color:var(--text-tertiary)}
.search-input:focus{border-color:var(--accent-ink);box-shadow:none}
.search-btn{position:absolute;right:0;top:50%;transform:translateY(-50%);padding:8px;border-radius:50%;color:var(--text-tertiary);transition:color var(--transition-slow)}
.search-btn:hover{color:var(--accent-ink)}
.hero-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:16px;font-size:0.85rem}
.hero-tags-label{color:var(--text-tertiary)}
.hero-tag{color:var(--text-secondary);transition:color var(--transition-slow);padding:2px 0;border-bottom:1px solid transparent}
.hero-tag:hover{color:var(--accent);border-bottom-color:var(--accent)}
```

- [ ] **Step 2: 替换 Hero HTML**

将 `layouts/index.html` 的 Hero 段（`<section class="hero">` 整体）替换：

```html
<section class="hero" id="hero-zone">
  <div class="hero-content">
    <p class="hero-issue">AI PROMPT &middot; No.1</p>
    <div class="hero-headline">
      <span class="hl-part" data-text="高质量">高质量</span>
      <span class="hl-part" data-text="中文">中文</span>
      <span class="hl-part" data-text="AI提示词库">AI提示词库</span>
    </div>
    <p class="hero-subtitle">精选 100+ 条实用中文提示词<br>覆盖 8 大场景 &middot; 一键复制即用</p>
    <div class="hero-search">
      <input type="text" id="hero-search-input" class="search-input" placeholder="搜索提示词..." autocomplete="off">
      <button id="hero-search-btn" class="search-btn" aria-label="搜索">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
    </div>
    <div class="hero-tags">
      <span class="hero-tags-label">热门：</span>
      {{ range first 6 (shuffle (slice "写作" "编程" "设计" "营销" "效率" "教育" "生活" "角色扮演")) }}
      <a href="{{ "/prompts/" | relURL }}" class="hero-tag">{{ . }}</a>
      {{ end }}
    </div>
  </div>
</section>
```

- [ ] **Step 3: 构建验证**

```bash
cd /root/web-project/ai\ prompt/ && hugo --minify 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git -C /root/web-project/ai\ prompt/ add static/css/main.css layouts/index.html
git -C /root/web-project/ai\ prompt/ commit -m "refactor(home): magazine-cover hero — offset headline grid, ink ghost layer, underline search"
```

---

### Task 4: 首页 — 分类目录 + 便签卡片 + 附录工具

**Files:**
- Modify: `layouts/index.html` (Categories + Featured + Tools 段)
- Modify: `layouts/partials/prompt-card.html`
- Modify: `static/css/main.css` (Categories, Cards, Tools 区域)

- [ ] **Step 1: 替换分类区 CSS（替换 main.css 第 105-115 行）**

```css
/* ===== Categories — 杂志目录式列表 ===== */
.categories-section{background:var(--bg-card);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.categories-list{max-width:680px;margin:0 auto}
.categories-list .section-title{text-align:left;font-size:1.1rem;letter-spacing:0.08em;color:var(--text-tertiary);margin-bottom:32px}
.cat-row{display:flex;align-items:baseline;gap:12px;padding:14px 0;border-bottom:1px solid var(--border-light);transition:all var(--transition-base)}
.cat-row:hover .cat-num{color:var(--accent)}
.cat-row:hover .cat-name{color:var(--text-primary)}
.cat-row:hover .cat-desc{color:var(--text-secondary)}
.cat-num{font-family:"Noto Serif SC",serif;font-size:1rem;color:var(--accent-ink);min-width:32px;transition:color var(--transition-slow)}
.cat-name{font-family:"Noto Serif SC",serif;font-size:1.15rem;color:var(--text-primary);white-space:nowrap;transition:color var(--transition-base)}
.cat-dash{color:var(--border);font-size:0.9rem}
.cat-desc{font-size:0.9rem;color:var(--text-tertiary);transition:color var(--transition-base)}
.categories-cta{text-align:center;margin-top:36px}

@media(max-width:640px){
  .cat-row{flex-wrap:wrap;gap:4px 12px}
  .cat-dash{display:none}
  .cat-desc{width:100%;padding-left:44px}
}
```

- [ ] **Step 2: 替换分类区 HTML**

将 `layouts/index.html` 的 categories-section 段替换：

```html
<section class="section categories-section">
  <div class="container">
    <div class="categories-list">
      <h2 class="section-title">目&ensp;录&ensp;CONTENTS</h2>
      {{ range $i, $cat := .Site.Data.categories }}
      <a href="{{ printf "/prompts/%s/" $cat.slug | relURL }}" class="cat-row">
        <span class="cat-num">{{ printf "%02d" (add $i 1) }}</span>
        <span class="cat-name">{{ $cat.name }}</span>
        <span class="cat-dash">──</span>
        <span class="cat-desc">{{ $cat.description }}</span>
      </a>
      {{ end }}
      <div class="categories-cta">
        <a href="{{ "/prompts/" | relURL }}" class="btn-secondary">浏览全部分类 &rarr;</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: 替换提示词卡片 CSS（替换 main.css 第 117-138 行）**

```css
/* ===== Prompt Cards — 便签纸叠放 ===== */
.prompts-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
@media(max-width:1024px){.prompts-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.prompts-grid{grid-template-columns:1fr}}

.prompt-card{padding:24px;background:var(--bg-card);border:none;border-radius:var(--radius-md);box-shadow:var(--shadow-sm);transition:transform var(--transition-base),box-shadow var(--transition-base);display:flex;flex-direction:column;gap:12px;position:relative}
.prompt-card:nth-child(3n+1){transform:rotate(-0.3deg)}
.prompt-card:nth-child(3n+2){transform:rotate(0.2deg)}
.prompt-card:nth-child(3n+3){transform:rotate(0.35deg)}
.prompt-card:hover{transform:rotate(0deg) scale(0.985);box-shadow:var(--shadow-lg);z-index:2}
.prompt-card-header{display:flex;justify-content:space-between;align-items:center}
.prompt-card-category{font-size:0.75rem;font-weight:500;color:var(--accent);letter-spacing:0.06em;padding-left:10px;border-left:2px solid var(--accent)}
.prompt-card-title{font-family:"Noto Serif SC",serif;font-size:1.05rem;line-height:1.4}
.prompt-card-title a{transition:color var(--transition-slow)}
.prompt-card-title a:hover{color:var(--accent-ink)}
.prompt-card-desc{font-size:0.85rem;color:var(--text-secondary);line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;flex:1}
.prompt-card-tags{display:flex;flex-wrap:wrap;gap:6px}
.tag{padding:2px 10px;background:var(--tag-bg);border-radius:3px;font-size:0.75rem;color:var(--text-secondary)}
.prompt-card-models{display:flex;flex-wrap:wrap;gap:6px}
.model-badge{padding:1px 8px;border:1px solid var(--border);border-radius:3px;font-size:0.72rem;color:var(--text-tertiary)}

/* Copy Button — 卡片内 */
.copy-btn{padding:6px;border-radius:var(--radius-sm);color:var(--text-tertiary);transition:color var(--transition-slow)}
.copy-btn:hover{color:var(--accent-ink)}
.copy-btn.copied{color:var(--success);background:none}
```

- [ ] **Step 4: 替换精选提示词区域 HTML（index.html featured-section）**

保持结构不变，但移动端 section title 调整：

```html
<section class="section featured-section">
  <div class="container">
    <h2 class="section-title">精选提示词</h2>
    <p class="section-desc">编辑精选 &mdash; 最常用、最好用的高质量中文提示词</p>
    <div class="prompts-grid">
      {{ range first 6 (where .Site.RegularPages "Params.featured" true) }}
      {{ partial "prompt-card.html" . }}
      {{ end }}
    </div>
    <div class="section-cta">
      <a href="{{ "/prompts/" | relURL }}" class="btn-primary">查看全部 96 条提示词</a>
    </div>
  </div>
</section>
```

- [ ] **Step 5: 替换工具预览 CSS（替换 main.css 第 164-172 行）**

```css
/* ===== Tools — 附录式 ===== */
.tools-section{background:var(--bg-card);border-top:1px solid var(--border)}
.tools-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
@media(max-width:1024px){.tools-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.tools-grid{grid-template-columns:1fr}}
.tool-card{padding:24px;background:var(--bg-primary);border:none;border-radius:var(--radius-md);box-shadow:var(--shadow-sm);transition:transform var(--transition-base),box-shadow var(--transition-base);text-align:left}
.tool-card:hover{transform:scale(0.985);box-shadow:var(--shadow-lg)}
.tool-icon{display:block;margin-bottom:12px;color:var(--accent-ink)}
.tool-name{font-family:"Noto Serif SC",serif;font-size:1.05rem;margin-bottom:6px;color:var(--text-primary)}
.tool-desc{font-size:0.85rem;color:var(--text-secondary);line-height:1.5}
```

- [ ] **Step 6: 更新工具预览 HTML（index.html tools-section）**

```html
<section class="section tools-section">
  <div class="container">
    <h2 class="section-title">附录：在线AI工具箱</h2>
    <p class="section-desc">7 款实用工具，前端演示体验</p>
    <div class="tools-grid">
      {{ range .Site.Data.tools }}
      <a href="{{ printf "/tools/%s/" .slug | relURL }}" class="tool-card">
        <span class="tool-icon">{{ partial "icon" .icon }}</span>
        <h3 class="tool-name">{{ .name }}</h3>
        <p class="tool-desc">{{ .description }}</p>
      </a>
      {{ end }}
    </div>
    <div class="section-cta">
      <a href="{{ "/tools/" | relURL }}" class="btn-secondary">探索全部工具 &rarr;</a>
    </div>
  </div>
</section>
```

- [ ] **Step 7: 构建验证**

```bash
cd /root/web-project/ai\ prompt/ && hugo --minify 2>&1 | tail -5
```

- [ ] **Step 8: Commit**

```bash
git -C /root/web-project/ai\ prompt/ add static/css/main.css layouts/index.html layouts/partials/prompt-card.html
git -C /root/web-project/ai\ prompt/ commit -m "refactor(home): directory-list categories, sticky-note cards, appendix tools"
```

---

### Task 5: 内页 — 提示词列表页（侧边栏 + 便签卡片）

**Files:**
- Modify: `layouts/_default/list.html`（prompts 段）
- Modify: `static/css/main.css`（Prompts List Layout 区域）

- [ ] **Step 1: 替换列表页 CSS（替换 main.css 第 194-213 行）**

```css
/* ===== Prompts List Layout ===== */
.prompts-page{padding-top:40px}
.prompts-layout{display:grid;grid-template-columns:200px 1fr;gap:48px;align-items:start}
.prompts-sidebar{position:sticky;top:76px}
.sidebar-title{font-family:"Noto Serif SC",serif;font-size:1rem;writing-mode:horizontal-tb;color:var(--text-primary);margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid var(--accent)}
.category-filter{display:flex;flex-direction:column;gap:0}
.filter-link{display:block;padding:6px 10px;border-radius:0;font-size:0.9rem;color:var(--text-tertiary);transition:color var(--transition-slow),background var(--transition-base);border-left:2px solid transparent}
.filter-link:hover{color:var(--text-primary);background:var(--accent-light);border-left-color:var(--border)}
.filter-link.active{color:var(--accent);background:var(--accent-light);border-left-color:var(--accent);font-weight:500}
.filter-link .count{font-size:0.78rem;color:var(--text-tertiary);margin-left:4px}
.prompts-toolbar{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:32px}
.prompts-page-title{font-family:"Noto Serif SC",serif;font-size:1.8rem}
.prompts-search{width:280px}
.prompts-search .search-input{padding:10px 0;border:none;border-bottom:1.5px solid var(--border);border-radius:0;font-size:0.93rem;background:transparent}
.prompts-search .search-input:focus{border-color:var(--accent-ink)}

@media(max-width:768px){
  .prompts-layout{grid-template-columns:1fr}
  .prompts-sidebar{position:static}
  .category-filter{flex-direction:row;flex-wrap:wrap;gap:4px}
  .filter-link{border-left:none;border-bottom:2px solid transparent;padding:6px 10px}
  .filter-link.active{border-left-color:transparent;border-bottom-color:var(--accent)}
  .prompts-search{width:100%}
}
```

- [ ] **Step 2: 更新 list.html 侧边栏 HTML**

将 `layouts/_default/list.html` prompts 分类侧边栏部分更新为带计数：

```html
{{ define "main" }}
{{ if eq .Section "prompts" }}
<section class="section prompts-page">
  <div class="container">
    <div class="prompts-layout">
      <aside class="prompts-sidebar">
        <h3 class="sidebar-title">分类</h3>
        <ul class="category-filter">
          {{ $allCount := len (where .Site.RegularPages "Section" "prompts") }}
          <li><a href="{{ "/prompts/" | relURL }}" class="filter-link{{ if eq .RelPermalink "/prompts/" }} active{{ end }}">全部<span class="count">{{ $allCount }}</span></a></li>
          {{ range .Site.Data.categories }}
          {{ $count := len (where $.Site.RegularPages "Params.category" .slug) }}
          <li><a href="{{ printf "/prompts/%s/" .slug | relURL }}" class="filter-link{{ if eq $.RelPermalink (printf "/prompts/%s/" .slug | relURL) }} active{{ end }}">{{ .name }}<span class="count">{{ $count }}</span></a></li>
          {{ end }}
        </ul>
      </aside>
      <div class="prompts-content">
        <div class="prompts-toolbar">
          <h1 class="prompts-page-title">
            {{ if eq .RelPermalink "/prompts/" }}
            全部提示词
            {{ else }}
            {{ .Title }}
            {{ end }}
          </h1>
          <div class="prompts-search">
            <input type="text" id="prompts-search" class="search-input" placeholder="在当前分类中搜索..." autocomplete="off">
          </div>
        </div>
        {{ $pages := .Pages }}
        {{ if eq .RelPermalink "/prompts/" }}
        {{ $pages = where .Site.RegularPages "Section" "prompts" }}
        {{ end }}
        <div class="prompts-grid" id="prompts-grid">
          {{ range $pages }}
          {{ partial "prompt-card.html" . }}
          {{ end }}
        </div>
        {{ if gt (len $pages) 12 }}
        <nav class="pagination" aria-label="分页">
          {{ template "_internal/pagination.html" . }}
        </nav>
        {{ end }}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: 构建验证**

```bash
cd /root/web-project/ai\ prompt/ && hugo --minify 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git -C /root/web-project/ai\ prompt/ add static/css/main.css layouts/_default/list.html
git -C /root/web-project/ai\ prompt/ commit -m "refactor(list): ink-brush sidebar with counts, underline search, sticky-note grid"
```

---

### Task 6: 内页 — 提示词详情页（引用块 + 杂志内页）

**Files:**
- Modify: `layouts/_default/single.html`（prompts 段）
- Modify: `static/css/main.css`（Prompt Detail + Generic Pages 区域）

- [ ] **Step 1: 替换详情页 CSS（替换 main.css 第 140-163 行）**

```css
/* ===== Prompt Detail — 杂志内页 ===== */
.prompt-detail{padding-top:40px}
.breadcrumb{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text-tertiary);margin-bottom:32px}
.breadcrumb a{color:var(--text-secondary);transition:color var(--transition-slow)}
.breadcrumb a:hover{color:var(--accent-ink)}
.breadcrumb-sep{color:var(--border)}
.breadcrumb-current{color:var(--text-primary);font-weight:500}
.prompt-header{margin-bottom:28px}
.prompt-title{font-family:"Noto Serif SC",serif;font-size:2rem;margin-bottom:12px;letter-spacing:-0.01em}
.prompt-meta{display:flex;gap:10px;align-items:center}
.prompt-category-badge{padding:3px 12px;background:var(--accent);color:#fff;border-radius:3px;font-size:0.8rem;font-weight:500;letter-spacing:0.04em}
.prompt-difficulty{padding:3px 12px;border:1px solid var(--border);border-radius:3px;font-size:0.8rem;color:var(--text-secondary)}
.prompt-content-card{background:var(--bg-card);border:none;border-radius:var(--radius-md);overflow:hidden;margin-bottom:24px;box-shadow:var(--shadow-sm)}
.prompt-content-header{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid var(--border-light);background:var(--bg-primary)}
.prompt-content-label{font-weight:500;font-size:0.9rem;color:var(--text-tertiary);letter-spacing:0.04em}
.prompt-content-body{padding:24px 20px 24px 28px;border-left:3px solid var(--accent);margin:16px 20px 24px 20px;background:var(--bg-primary)}
.prompt-content-body pre{white-space:pre-wrap;word-break:break-word;font-size:0.93rem;line-height:1.9;color:var(--text-primary)}
.copy-btn-large{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;font-size:0.9rem;font-weight:500;border:1px solid var(--accent);color:var(--accent);border-radius:var(--radius-sm);transition:all var(--transition-base)}
.copy-btn-large:hover{background:var(--accent);color:#fff;transform:scale(0.97)}
.copy-btn-large.copied{color:var(--success);border-color:var(--success);background:var(--success-light)}
.prompt-info-row{display:flex;flex-wrap:wrap;gap:24px;margin-bottom:32px}
.info-label{font-size:0.85rem;color:var(--text-tertiary);margin-right:4px}
.prompt-howto{margin-top:40px;padding-top:32px;border-top:1px solid var(--border)}
.prompt-howto h2{font-family:"Noto Serif SC",serif;font-size:1.2rem;margin-bottom:16px;color:var(--text-primary)}
.prompt-howto ol{padding-left:20px;color:var(--text-secondary);line-height:2.2}
.related-prompts{margin-top:48px;padding-top:40px;border-top:1px solid var(--border)}
.related-prompts h2{font-family:"Noto Serif SC",serif;font-size:1.2rem;margin-bottom:24px}
```

- [ ] **Step 2: 替换通用页面 CSS（替换 main.css 第 215-226 行）**

```css
/* ===== Generic Pages ===== */
.page-header{margin-bottom:40px;text-align:center}
.page-header h1{font-family:"Noto Serif SC",serif;font-size:2rem;margin-bottom:12px}
.page-desc{font-size:1rem;color:var(--text-secondary);max-width:560px;margin:0 auto}
.page-content{font-size:0.95rem;line-height:1.9;color:var(--text-secondary)}
.page-content h2{color:var(--text-primary);font-family:"Noto Serif SC",serif;font-size:1.3rem;margin:40px 0 16px}
.page-content p{margin-bottom:16px}
.page-content ul,.page-content ol{padding-left:20px;margin-bottom:16px}
.page-content li{line-height:2.2}
.page-404{text-align:center;padding:120px 24px}
.page-404 h1{font-family:"Noto Serif SC",serif;font-size:5rem;color:var(--accent);margin-bottom:8px}
.page-404 p{color:var(--text-secondary);font-size:1.1rem;margin-bottom:32px}
```

- [ ] **Step 3: 更新工具 Mock UI CSS（追加到 main.css）**

```css
/* ===== Tool Detail (Mock UI) — 笔记本格纸 ===== */
.tool-mock{background:var(--bg-card);border:none;border-radius:var(--radius-md);overflow:hidden;margin:32px 0;box-shadow:var(--shadow-sm)}
.tool-mock-header{padding:14px 20px;background:var(--bg-primary);border-bottom:1px solid var(--border);font-weight:500;font-size:0.85rem;color:var(--text-tertiary);letter-spacing:0.04em}
.tool-mock-body{padding:24px 20px}
.tool-mock-input{width:100%;padding:14px 16px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:0.93rem;resize:vertical;min-height:120px;outline:none;transition:border-color var(--transition-slow);background:var(--bg-primary)}
.tool-mock-input:focus{border-color:var(--accent-ink)}
.tool-mock-btn{display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:10px 22px;background:var(--accent);color:#fff;border-radius:var(--radius-sm);font-weight:500;font-size:0.9rem;transition:all var(--transition-base)}
.tool-mock-btn:hover{background:var(--accent-deep);transform:scale(0.97)}
.tool-mock-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none}
.tool-mock-output{margin-top:20px;padding:20px;background:var(--bg-primary);border-radius:var(--radius-sm);border:1px solid var(--border-light);min-height:60px;font-size:0.93rem;line-height:1.8;color:var(--text-secondary)}
.tool-mock-output.active{color:var(--text-primary)}
.typewriter-cursor{display:inline-block;width:2px;height:1.1em;background:var(--accent);animation:blink 0.8s infinite;vertical-align:text-bottom;margin-left:2px}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.mock-notice{text-align:center;margin-top:16px;padding:12px 20px;background:var(--accent-light);border-radius:var(--radius-sm);font-size:0.85rem;color:var(--accent-deep)}
.tool-features{margin:32px 0}
.tool-features h2{font-family:"Noto Serif SC",serif;font-size:1.2rem;margin-bottom:16px}
.tool-features ul{padding-left:20px}
.tool-features li{color:var(--text-secondary);line-height:2.2;list-style:disc}
```

- [ ] **Step 4: 构建验证**

```bash
cd /root/web-project/ai\ prompt/ && hugo --minify 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git -C /root/web-project/ai\ prompt/ add static/css/main.css
git -C /root/web-project/ai\ prompt/ commit -m "refactor(detail): magazine article layout — left-border quote block, notepad mock UI"
```

---

### Task 7: 交互层 — 墨迹晕开 + 纸张按压 + 滚动渐显

**Files:**
- Modify: `static/css/main.css` (Animations 区域)
- Create: `static/js/scroll-reveal.js`
- Modify: `layouts/_default/baseof.html` (引用新 JS)

- [ ] **Step 1: 替换动画区域 CSS（替换 main.css 第 228-241 行）**

```css
/* ===== Animations — 克制、纸墨感 ===== */
@keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
.animate-in{opacity:0;transform:translateY(12px);transition:opacity 0.7s ease,transform 0.7s ease}
.animate-in.visible{opacity:1;transform:translateY(0)}

/* 通用墨迹晕开 — 链接 hover 颜色过渡 */
a{transition:color var(--transition-slow)}

/* 分页 */
.pagination{display:flex;justify-content:center;gap:8px;margin-top:40px}
.pagination .page-item a,.pagination .page-item span{padding:8px 14px;border-radius:var(--radius-sm);font-size:0.9rem;color:var(--text-secondary);transition:all var(--transition-base)}
.pagination .page-item.active span{color:var(--accent);font-weight:600}
.pagination .page-item a:hover{color:var(--accent-ink);background:var(--accent-light)}

@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:0.01ms !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}
  .animate-in{opacity:1;transform:none;transition:none}
}
```

- [ ] **Step 2: 创建 scroll-reveal.js**

新建 `static/js/scroll-reveal.js`：

```javascript
(function() {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-delay') || '0');
        setTimeout(function() {
          el.classList.add('visible');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.animate-in').forEach(function(el) {
    observer.observe(el);
  });
})();
```

- [ ] **Step 3: 给 Prompt 卡片和分类行添加 animate-in 类**

更新 `layouts/partials/prompt-card.html`，给 `<article>` 添加 class 和 data-delay：

```html
<article class="prompt-card animate-in" data-delay="{{ mul (mod .Index 6) 60 }}">
  <div class="prompt-card-header">
    {{ with .Params.category }}
    {{ $cat := index (where $.Site.Data.categories "slug" .) 0 }}
    <span class="prompt-card-category">{{ if $cat }}{{ $cat.name }}{{ else }}{{ . }}{{ end }}</span>
    {{ end }}
    <button class="copy-btn" data-copy="{{ .Title }}" aria-label="复制提示词" title="复制提示词">
      <svg class="copy-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      <svg class="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none"><polyline points="20 6 9 17 4 12"/></svg>
    </button>
  </div>
  <h3 class="prompt-card-title"><a href="{{ .Permalink }}">{{ .Title }}</a></h3>
  <p class="prompt-card-desc">{{ .Summary | plainify | truncate 100 }}</p>
  <div class="prompt-card-tags">
    {{ range .Params.tags }}
    <span class="tag">{{ . }}</span>
    {{ end }}
  </div>
  <div class="prompt-card-models">
    {{ range .Params.models }}
    <span class="model-badge">{{ . }}</span>
    {{ end }}
  </div>
</article>
```

给分类列表行添加 animate-in（在 index.html 的 cat-row）：

```html
<a href="{{ printf "/prompts/%s/" $cat.slug | relURL }}" class="cat-row animate-in" data-delay="{{ mul $i 80 }}">
```

- [ ] **Step 4: 在 baseof.html 引用 scroll-reveal.js**

在 `layouts/_default/baseof.html` 的 scripts block 之前添加：

```html
<script src="{{ "js/scroll-reveal.js" | relURL }}" defer></script>
```

- [ ] **Step 5: 构建验证**

```bash
cd /root/web-project/ai\ prompt/ && hugo --minify 2>&1 | tail -5
```

- [ ] **Step 6: Commit**

```bash
git -C /root/web-project/ai\ prompt/ add static/css/main.css static/js/scroll-reveal.js layouts/_default/baseof.html layouts/partials/prompt-card.html layouts/index.html
git -C /root/web-project/ai\ prompt/ commit -m "feat(ux): scroll reveal with Intersection Observer, ink-bleed transitions, stagger delays"
```

---

### Task 8: 氛围特效 — Hero 光照跟随

**Files:**
- Create: `static/js/lighting-follow.js`
- Modify: `static/css/main.css` (Hero 光照样式)
- Modify: `layouts/_default/baseof.html` (只在首页加载)

- [ ] **Step 1: 追加 Hero 光照跟随 CSS**

在 main.css 的 Hero 区域追加：

```css
.hero-light{position:absolute;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse 500px 350px at 50% 30%,rgba(255,255,255,0.08),transparent 70%);transition:opacity 0.6s ease}
```

- [ ] **Step 2: 创建 lighting-follow.js**

新建 `static/js/lighting-follow.js`：

```javascript
(function() {
  'use strict';
  var hero = document.getElementById('hero-zone');
  if (!hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var light = document.createElement('div');
  light.className = 'hero-light';
  light.style.opacity = '0';
  hero.appendChild(light);

  var ticking = false;

  hero.addEventListener('mouseenter', function() {
    light.style.opacity = '1';
  });

  hero.addEventListener('mouseleave', function() {
    light.style.opacity = '0';
  });

  hero.addEventListener('mousemove', function(e) {
    if (!ticking) {
      requestAnimationFrame(function() {
        var rect = hero.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        light.style.background = 'radial-gradient(ellipse 500px 350px at ' + x + '% ' + y + '%, rgba(255,255,255,0.08), transparent 70%)';
        ticking = false;
      });
      ticking = true;
    }
  });
})();
```

- [ ] **Step 3: 首页条件加载 lighting-follow.js**

在 `layouts/_default/baseof.html` 中，将 lighting-follow 的引用放在 `{{ block "scripts" . }}{{ end }}` 之前，但只在首页生效。更好的方案：在 `layouts/index.html` 的 `{{ define "scripts" }}` 中添加：

```html
<script src="{{ "js/lighting-follow.js" | relURL }}" defer></script>
```

同时将现有的 search.js 保留。更新 index.html 的 scripts block：

```html
{{ define "scripts" }}
<script src="{{ "js/search.js" | relURL }}" defer></script>
<script src="{{ "js/lighting-follow.js" | relURL }}" defer></script>
{{ end }}
```

- [ ] **Step 4: 构建验证**

```bash
cd /root/web-project/ai\ prompt/ && hugo --minify 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git -C /root/web-project/ai\ prompt/ add static/js/lighting-follow.js static/css/main.css layouts/index.html
git -C /root/web-project/ai\ prompt/ commit -m "feat(ambiance): hero lighting follow effect on mouse move"
```

---

### Task 9: 最终验证 — 构建检查 + 多断点

**Files:** 无新增，全量验证

- [ ] **Step 1: 完整构建**

```bash
cd /root/web-project/ai\ prompt/ && hugo --minify 2>&1
```
Expected: `Total in XX ms`，无任何 error/warning

- [ ] **Step 2: 启动 dev server 验证**

```bash
cd /root/web-project/ai\ prompt/ && hugo server --port 9090 --bind 0.0.0.0 &
sleep 3
echo "Server should be running at http://localhost:9090"
```

- [ ] **Step 3: 验证关键页面可访问**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:9090/
curl -s -o /dev/null -w "%{http_code}" http://localhost:9090/prompts/
curl -s -o /dev/null -w "%{http_code}" http://localhost:9090/prompts/writing/
curl -s -o /dev/null -w "%{http_code}" http://localhost:9090/tools/
curl -s -o /dev/null -w "%{http_code}" http://localhost:9090/about/
```
Expected: 全部返回 200

- [ ] **Step 4: 验证搜索功能**

```bash
curl -s http://localhost:9090/ | grep -q 'search.js' && echo "search.js found"
curl -s http://localhost:9090/ | grep -q 'scroll-reveal.js' && echo "scroll-reveal.js found"
curl -s http://localhost:9090/ | grep -q 'lighting-follow.js' && echo "lighting-follow.js found"
```
Expected: 三个 JS 都 loaded

- [ ] **Step 5: 验证 OG 图片可访问**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:9090/icons/og-image.svg
```
Expected: 200

- [ ] **Step 6: 验证 CSS 文件包含新 token**

```bash
grep -c '--accent-ink' /root/web-project/ai\ prompt/static/css/main.css
grep -c '#FBF8F2' /root/web-project/ai\ prompt/static/css/main.css
```
Expected: 至少返回 >0

- [ ] **Step 7: 检查 Hugo 页面总数**

```bash
cd /root/web-project/ai\ prompt/ && hugo --minify 2>&1 | grep -oP '\d+ pages'
```
Expected: 应该 >= 之前的 949 pages

- [ ] **Step 8: 停止 dev server 并最终提交**

```bash
kill $(lsof -t -i:9090) 2>/dev/null
git -C /root/web-project/ai\ prompt/ add -A
git -C /root/web-project/ai\ prompt/ status
```

如果有遗漏文件则提交：
```bash
git -C /root/web-project/ai\ prompt/ commit -m "chore: final verification — build passes, all pages 200, JS loaded"
```
