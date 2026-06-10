# AI 动漫头像 + 旅行攻略 双项目前端美化实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 美化 AI 动漫头像和旅行攻略两个 Hugo 站点的前端 UI，统一暖色系设计语言

**Architecture:** 纯 CSS 变量驱动 + HTML 模板调整。AI 动漫头像采用组件化 CSS（main.css + 14 个组件文件），旅行攻略使用单文件 CSS（style.css 550 行）。两个项目独立构建，无共享依赖

**Tech Stack:** Hugo 静态站点、CSS3 自定义属性、HTML5、无 JS 框架

**Spec:** `docs/superpowers/specs/2026-06-08-ai-avatar-travel-guide-design.md`

---

## Part A: AI 动漫头像（ai-anime-avatar）

### Task 1: 更新 CSS 色板变量

**Files:**
- Modify: `/root/web-project/ai-anime-avatar/assets/css/main.css:1-64`

- [ ] **Step 1: 替换 :root 色板变量**

将 `main.css` 中 `:root` 块（第 1-51 行）的以下变量改为暖色系：

```css
:root {
  --color-primary: #9B6FF0;
  --color-primary-dark: #7C4FCF;
  --color-primary-light: #B794F4;
  --color-primary-bg: rgba(155, 111, 240, 0.08);
  --color-secondary: #F06292;
  --color-secondary-dark: #E04478;
  --color-bg: #FFFFFF;
  --color-bg-alt: #F8F6F4;
  --color-bg-card: #FFFFFF;
  --color-text: #111827;
  --color-text-secondary: #6B7280;
  --color-text-muted: #9CA3AF;
  --color-text-inverse: #FFFFFF;
  --color-border: #E5E7EB;
  --color-border-light: #F3F4F4;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-dark-bg: #0D0B14;
  --color-dark-text: #F9FAFB;
  --color-card-bg: #FFFFFF;
  --color-accent: #F59E0B;
  --gradient-primary: linear-gradient(135deg, #9B6FF0, #F06292);
  --gradient-hero: linear-gradient(135deg, #7C4FCF 0%, #C44D88 50%, #F59E0B 100%);
  --gradient-glow: linear-gradient(135deg, rgba(155, 111, 240, 0.3), rgba(240, 98, 146, 0.3));
  /* 其余变量不变 */
}
```

- [ ] **Step 2: 替换暗色模式变量**

将 `[data-theme="dark"]` 块（第 53-64 行）改为：

```css
[data-theme="dark"] {
  --color-bg: #0D0B14;
  --color-bg-alt: #18151F;
  --color-bg-card: #18151F;
  --color-card-bg: #18151F;
  --color-text: #F5F3F0;
  --color-text-secondary: #C4C0BA;
  --color-text-muted: #8B8680;
  --color-border: #2A2530;
  --color-border-light: #1F1B26;
  --color-dark-bg: #0A0810;
}
```

- [ ] **Step 3: 更新附加令牌块中的 accent 变量**

将第 314-340 行的附加令牌块中与 accent 相关的变量改为：

```css
--color-accent-dark: #D97706;
--color-accent-light: #FDE68A;
--gradient-accent: linear-gradient(135deg, #F06292 0%, #F59E0B 100%);
--shadow-glow: 0 0 24px rgba(155, 111, 240, 0.3);
--shadow-glow-strong: 0 0 40px rgba(155, 111, 240, 0.5);
```

- [ ] **Step 4: 构建验证**

```bash
cd /root/web-project/ai-anime-avatar && hugo --minify --destination public 2>&1
```

Expected: 构建成功，无错误输出

---

### Task 2: 重设计 Hero 区域

**Files:**
- Modify: `/root/web-project/ai-anime-avatar/assets/css/components/hero.css:1-533`
- Modify: `/root/web-project/ai-anime-avatar/layouts/partials/hero.html:1-80`

- [ ] **Step 1: 更新 hero.css — 居中聚焦布局 + 暖金光晕**

完整替换 `hero.css`：

```css
/* === Hero Section === */
.hero {
  position: relative;
  padding: 100px 20px 80px;
  text-align: center;
  background: var(--color-dark-bg);
  overflow: hidden;
}

.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero__bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.hero__bg-shape:nth-child(1) {
  width: 360px;
  height: 360px;
  top: -60px;
  right: -80px;
  background: radial-gradient(circle, rgba(155, 111, 240, 0.25), transparent 70%);
}

.hero__bg-shape:nth-child(2) {
  width: 280px;
  height: 280px;
  bottom: -40px;
  left: -60px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.18), transparent 70%);
}

.hero__bg-shape:nth-child(3) {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(240, 98, 146, 0.12), transparent 70%);
}

.hero__inner {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 18px;
  border-radius: var(--radius-full);
  background: rgba(155, 111, 240, 0.12);
  color: var(--color-primary-light);
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 24px;
  border: 1px solid rgba(155, 111, 240, 0.2);
}

.hero__badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
  animation: pulse 2s infinite;
}

.hero__title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-text-inverse);
  line-height: 1.2;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.hero__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  max-width: 480px;
  margin: 0 auto 32px;
  line-height: 1.65;
}

.hero__cta-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.hero__cta-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 40px;
  font-size: 1.05rem;
  font-weight: var(--font-weight-bold);
  border-radius: 14px;
  background: var(--gradient-primary);
  color: #fff;
  box-shadow: 0 4px 20px rgba(155, 111, 240, 0.4);
  transition: all var(--transition);
}

.hero__cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 28px rgba(155, 111, 240, 0.55);
  color: #fff;
}

.hero__cta-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 36px;
  font-size: 1.05rem;
  font-weight: 500;
  border-radius: 14px;
  background: rgba(255,255,255,0.05);
  color: var(--color-text-secondary);
  border: 1px solid rgba(255,255,255,0.08);
  transition: all var(--transition);
}

.hero__cta-secondary:hover {
  background: rgba(255,255,255,0.08);
  color: var(--color-text);
}

.hero__social-proof {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.hero__stat {
  text-align: center;
}

.hero__stat-value {
  font-size: 1.5rem;
  font-weight: var(--font-weight-extrabold);
  color: var(--color-text-inverse);
  letter-spacing: -0.02em;
}

.hero__stat-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.hero__stars {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  margin-top: 2px;
}

.hero__star {
  color: var(--color-accent);
  font-size: 0.85rem;
}

.hero__rating-text {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  margin-left: 4px;
}

.hero__comparison {
  max-width: 560px;
  margin: 0 auto;
}

.comparison-slider {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.comparison-card {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
}

.hero__comparison-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.hero__comparison-label {
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-weight: 500;
  backdrop-filter: blur(4px);
}

@media (max-width: 640px) {
  .hero {
    padding: 72px 16px 56px;
  }

  .hero__social-proof {
    gap: 20px;
  }

  .comparison-slider {
    grid-template-columns: 1fr;
    max-width: 300px;
    margin: 0 auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__badge-dot {
    animation: none;
  }
}
```

- [ ] **Step 2: 验证 Hero 模板**

读取 `hero.html`（已读取过，结构正确不需要改）。现有结构已支持新的 CSS 类名。

- [ ] **Step 3: 构建验证**

```bash
cd /root/web-project/ai-anime-avatar && hugo --minify --destination public 2>&1
```

---

### Task 3: 重设计 Showcase（风格展示）区域

**Files:**
- Modify: `/root/web-project/ai-anime-avatar/assets/css/components/showcase.css:1-206`

- [ ] **Step 1: 更新 showcase.css — 暖灰底 + 悬浮动效**

完整替换 `showcase.css`：

```css
/* === Showcase Section === */
.showcase {
  background: var(--color-bg-alt);
}

.showcase__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.style-card {
  position: relative;
  background: var(--color-bg-card);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  transition: transform var(--transition), box-shadow var(--transition);
}

.style-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-light);
}

.style-card__image {
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--color-bg-alt);
}

.style-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.style-card:hover .style-card__image img {
  transform: scale(1.05);
}

.style-card__label {
  padding: 14px 16px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
  text-align: center;
}

.style-card__accent {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-primary);
  transform: scaleX(0);
  transition: transform var(--transition);
}

.style-card:hover .style-card__accent {
  transform: scaleX(1);
}

@media (max-width: 768px) {
  .showcase__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .showcase__grid {
    grid-template-columns: 1fr;
    max-width: 340px;
    margin: 0 auto;
  }
}
```

- [ ] **Step 2: 构建验证**

```bash
cd /root/web-project/ai-anime-avatar && hugo --minify --destination public 2>&1
```

---

### Task 4: 重设计 How it Works + Upload

**Files:**
- Modify: `/root/web-project/ai-anime-avatar/assets/css/components/how-it-works.css:1-206`
- Modify: `/root/web-project/ai-anime-avatar/assets/css/components/upload.css:1-440`

- [ ] **Step 1: 更新 how-it-works.css — 深色底 + 玻璃态卡片**

完整替换 `how-it-works.css`：

```css
/* === How It Works Section === */
.how-it-works {
  background: var(--color-dark-bg);
  color: var(--color-dark-text);
}

.how-it-works .section__title {
  color: var(--color-dark-text);
}

.how-it-works .section__subtitle {
  color: var(--color-text-muted);
}

.how-it-works__steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  counter-reset: step;
}

.how-it-works__step {
  position: relative;
  padding: 40px 28px 28px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  text-align: center;
  transition: transform var(--transition), border-color var(--transition);
}

.how-it-works__step:hover {
  transform: translateY(-2px);
  border-color: rgba(155, 111, 240, 0.25);
}

.how-it-works__step::before {
  counter-increment: step;
  content: counter(step);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin: 0 auto 20px;
  font-size: 1.25rem;
  font-weight: 700;
  background: var(--gradient-primary);
  color: #fff;
}

.how-it-works__step:nth-child(2)::before {
  background: linear-gradient(135deg, #F06292, #F59E0B);
}

.how-it-works__step:nth-child(3)::before {
  background: linear-gradient(135deg, #F59E0B, #9B6FF0);
}

.how-it-works__step h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-dark-text);
  margin-bottom: 8px;
}

.how-it-works__step p {
  font-size: 0.92rem;
  color: var(--color-text-muted);
  line-height: 1.65;
}

@media (max-width: 768px) {
  .how-it-works__steps {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
}
```

- [ ] **Step 2: 更新 upload.css — 虚线拖拽区**

替换 upload.css 中的上传区样式（保留其他上传逻辑样式）：

```css
/* === Upload Section === */
.upload {
  background: var(--color-bg-alt);
}

.upload__dropzone {
  max-width: 560px;
  margin: 0 auto;
  padding: 56px 32px;
  border: 2px dashed var(--color-border);
  border-radius: 16px;
  text-align: center;
  transition: all var(--transition);
  cursor: pointer;
  background: var(--color-bg-card);
}

.upload__dropzone:hover,
.upload__dropzone.dragover {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
}

.upload__dropzone-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
  display: block;
}

.upload__dropzone h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}

.upload__dropzone p {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

/* 保留 upload.css 中其余的上传进度/结果样式 */
```

- [ ] **Step 3: 构建验证**

```bash
cd /root/web-project/ai-anime-avatar && hugo --minify --destination public 2>&1
```

---

### Task 5: 重设计 Pricing + FAQ

**Files:**
- Modify: `/root/web-project/ai-anime-avatar/assets/css/components/pricing.css:1-328`
- Modify: `/root/web-project/ai-anime-avatar/assets/css/components/faq.css:1-265`

- [ ] **Step 1: 更新 pricing.css — 深色底 + 暖金高亮推荐卡**

完整替换 `pricing.css`：

```css
/* === Pricing Section === */
.pricing {
  background: var(--color-dark-bg);
  color: var(--color-dark-text);
}

.pricing .section__title {
  color: var(--color-dark-text);
}

.pricing .section__subtitle {
  color: var(--color-text-muted);
}

.pricing__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: start;
}

.pricing__card {
  position: relative;
  padding: 36px 28px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  text-align: center;
  transition: all var(--transition);
}

.pricing__card:hover {
  transform: translateY(-2px);
}

.pricing__card--featured {
  background: rgba(245, 158, 11, 0.05);
  border: 2px solid var(--color-accent);
  transform: scale(1.03);
}

.pricing__card--featured:hover {
  transform: scale(1.03) translateY(-2px);
}

.pricing__badge {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 0.75rem;
  padding: 4px 14px;
  border-radius: var(--radius-full);
  background: var(--color-accent);
  color: #000;
  font-weight: 700;
}

.pricing__name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-dark-text);
  margin-bottom: 6px;
}

.pricing__price {
  font-size: 2.6rem;
  font-weight: 800;
  color: var(--color-dark-text);
  letter-spacing: -0.03em;
  margin-bottom: 4px;
}

.pricing__price small {
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--color-text-muted);
}

.pricing__desc {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  margin-bottom: 20px;
  line-height: 1.6;
}

.pricing__features {
  list-style: none;
  text-align: left;
  margin-bottom: 24px;
}

.pricing__features li {
  padding: 6px 0;
  font-size: 0.88rem;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.pricing__features li::before {
  content: "\2713";
  color: var(--color-success);
  font-weight: 700;
  flex-shrink: 0;
}

.pricing__cta {
  display: block;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all var(--transition);
}

.pricing__card--featured .pricing__cta {
  background: var(--gradient-primary);
  color: #fff;
}

.pricing__card:not(.pricing__card--featured) .pricing__cta {
  background: rgba(255, 255, 255, 0.06);
  color: var(--color-dark-text);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.pricing__card:not(.pricing__card--featured) .pricing__cta:hover {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .pricing__grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }

  .pricing__card--featured {
    transform: none;
  }

  .pricing__card--featured:hover {
    transform: translateY(-2px);
  }
}
```

- [ ] **Step 2: 更新 faq.css — 手风琴左侧暖紫条**

完整替换 `faq.css`：

```css
/* === FAQ Section === */
.faq {
  background: var(--color-bg-alt);
}

.faq__list {
  max-width: 720px;
  margin: 0 auto;
}

.faq__item {
  border-bottom: 1px solid var(--color-border-light);
  transition: all var(--transition);
}

.faq__item:first-child {
  border-top: 1px solid var(--color-border-light);
}

.faq__question {
  width: 100%;
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  text-align: left;
  transition: color var(--transition);
  position: relative;
  padding-left: 16px;
  border-left: 3px solid transparent;
}

.faq__question:hover {
  color: var(--color-primary);
}

.faq__item.open .faq__question {
  color: var(--color-primary);
  border-left-color: var(--color-primary);
  background: var(--color-primary-bg);
}

.faq__arrow {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--color-text-muted);
  transition: transform var(--transition);
  flex-shrink: 0;
}

.faq__item.open .faq__arrow {
  transform: rotate(180deg);
  color: var(--color-primary);
}

.faq__answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
}

.faq__item.open .faq__answer {
  max-height: 400px;
}

.faq__answer-content {
  padding: 0 20px 20px;
  font-size: 0.93rem;
  color: var(--color-text-secondary);
  line-height: 1.75;
  padding-left: 36px;
}

@media (prefers-reduced-motion: reduce) {
  .faq__answer {
    transition: none;
  }
}
```

- [ ] **Step 3: 构建验证**

```bash
cd /root/web-project/ai-anime-avatar && hugo --minify --destination public 2>&1
```

---

### Task 6: 更新 AI 动漫头像其余组件样式

**Files:**
- Modify: `/root/web-project/ai-anime-avatar/assets/css/components/header.css:1-173`
- Modify: `/root/web-project/ai-anime-avatar/assets/css/components/footer.css:1-360`
- Modify: `/root/web-project/ai-anime-avatar/assets/css/components/results.css:1-411`
- Modify: `/root/web-project/ai-anime-avatar/assets/css/components/comparison.css:1-286`
- Modify: `/root/web-project/ai-anime-avatar/assets/css/components/testimonials.css:1-214`

- [ ] **Step 1: header.css — 适配暖色**

在 header.css 中更新 header 背景色和导航链接颜色：

```css
.header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-light);
  height: var(--header-height);
}

[data-theme="dark"] .header {
  background: rgba(13, 11, 20, 0.88);
  border-bottom-color: var(--color-border);
}
```

- [ ] **Step 2: footer.css — 深棕底 + 暖色点缀**

在 footer.css 中将 footer 背景改为深暖色：

```css
.footer {
  background: #1A151F;
  color: var(--color-text-muted);
  padding: 56px 0 28px;
}

.footer a:hover {
  color: var(--color-primary-light);
}

.footer__bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 22px;
  margin-top: 36px;
  text-align: center;
  font-size: 0.82rem;
}
```

- [ ] **Step 3: results/comparison/testimonials.css — 颜色引用更新**

这些文件使用了 `var(--color-primary)`、`var(--gradient-primary)` 等变量，主色板在 Task 1 已更新，故这些组件自动适配。仅需检查并调整 `results.css` 中暗色底 section：

在 `results.css` 中添加：
```css
.results {
  background: var(--color-dark-bg);
  color: var(--color-dark-text);
}
```

在 `comparison.css` 中将 section 背景设为浅色：
```css
.comparison {
  background: var(--color-bg-alt);
}
```

在 `testimonials.css` 中将 section 背景设为浅色：
```css
.testimonials {
  background: var(--color-bg);
}
```

- [ ] **Step 4: 构建验证**

```bash
cd /root/web-project/ai-anime-avatar && hugo --minify --destination public 2>&1
```

---

### Task 7: AI 动漫头像整体构建 + 检查

- [ ] **Step 1: 清理构建**

```bash
cd /root/web-project/ai-anime-avatar && rm -rf public && hugo --minify --destination public 2>&1
```

Expected: 构建成功，无 WARN/ERROR

- [ ] **Step 2: 检查构建产物**

```bash
ls /root/web-project/ai-anime-avatar/public/ && echo "---" && ls /root/web-project/ai-anime-avatar/public/en/ && ls /root/web-project/ai-anime-avatar/public/ja/
```

Expected: 三语言页面均生成

- [ ] **Step 3: 检查 CSS 输出**

```bash
ls -lh /root/web-project/ai-anime-avatar/public/css/bundle.css
```

Expected: bundle.css 存在且包含更新后的色值

---

## Part B: 旅行攻略（Travel-guide）

### Task 8: 更新旅行攻略 CSS 色板 + 城市特色色

**Files:**
- Modify: `/root/web-project/Travel-guide/static/css/style.css:1-40`

- [ ] **Step 1: 在 :root 中添加城市特色色变量**

在 `style.css` 的 `:root` 块末尾（第 18 行结束前）添加：

```css
--color-ink: #2C2416;
--color-cream: #FBF8F3;
--color-champagne: #F5EDE0;
--city-beijing: #9B2D30;
--city-shanghai: #3B6B8F;
--city-guangzhou: #4A8C3F;
--city-chengdu: #C4823D;
--city-xian: #8B6914;
--city-hangzhou: #5B8C5A;
```

- [ ] **Step 2: 更新 body 背景色**

将 `body` 样式中 `background: var(--bg)` 改为 `background: var(--color-cream)`（需先在 :root 添加 `--color-cream` 替代 `--bg` 或保持 `--bg` 值更新）：

实际上保持 `--bg: #FBF8F3` 即可（改值不改名）。

```css
--bg: #FBF8F3;
```

- [ ] **Step 3: 构建验证**

```bash
cd /root/web-project/Travel-guide && hugo --minify --destination public 2>&1
```

---

### Task 9: 重设计旅行攻略 Hero

**Files:**
- Modify: `/root/web-project/Travel-guide/static/css/style.css` (hero section, 约第 65-87 行)
- Modify: `/root/web-project/Travel-guide/layouts/index.html:41-47`

- [ ] **Step 1: 替换 Hero CSS 为编辑叙事风**

在 `style.css` 中找到 `.hero` 相关样式并替换为：

```css
/* ===== Hero ===== */
.hero {
  background: linear-gradient(165deg, #F5EDE0 0%, #EDE1CE 50%, #E5D5BB 100%);
  padding: 96px 24px 72px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: "";
  position: absolute;
  top: -80px;
  right: -80px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(176,137,104,0.1) 0%, transparent 70%);
  pointer-events: none;
}

.hero::after {
  content: "";
  position: absolute;
  bottom: -50px;
  left: -50px;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(224,123,57,0.08) 0%, transparent 70%);
  pointer-events: none;
}

.hero-inner {
  max-width: 720px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-edition {
  display: inline-block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--primary);
  margin-bottom: 16px;
  font-weight: 600;
}

.hero h1 {
  font-size: clamp(2rem, 5.5vw, 3rem);
  font-weight: 300;
  color: var(--primary-dark);
  line-height: 1.3;
  margin-bottom: 12px;
  letter-spacing: 0.04em;
}

.hero h1 strong {
  font-weight: 800;
  font-size: 1.05em;
}

.hero-subtitle {
  font-size: 1.05rem;
  color: var(--text-secondary);
  margin-bottom: 36px;
  line-height: 1.75;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.hero-search {
  max-width: 460px;
  margin: 0 auto 24px;
  position: relative;
}

.hero-search input {
  width: 100%;
  padding: 14px 52px 14px 22px;
  border: 2px solid var(--border);
  border-radius: 50px;
  font-size: 0.95rem;
  color: var(--text);
  background: var(--white);
  font-family: inherit;
  outline: none;
  transition: border-color var(--transition), box-shadow var(--transition);
}

.hero-search input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(176,137,104,0.12);
}

.hero-search input::placeholder {
  color: var(--text-muted);
}

.hero-search-icon {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: var(--text-muted);
  pointer-events: none;
}

.hero-cities {
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}

.hero-city-dot {
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: rgba(255,255,255,0.7);
  border: 1px solid var(--border);
  transition: all var(--transition);
  cursor: pointer;
  text-decoration: none;
}

.hero-city-dot:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--white);
}
```

- [ ] **Step 2: 更新 layouts/index.html Hero HTML**

将 `layouts/index.html` 第 41-47 行的 hero 块替换为：

```html
<header class="hero">
  <div class="hero-inner">
    <div class="hero-edition">2026 Edition</div>
    <h1>探索中国<br><strong>六座必游之城</strong></h1>
    <p class="hero-subtitle">深度人文指南 &times; 实用行程规划<br>让你的自由行有深度、不踩坑</p>
    <div class="hero-search">
      <input type="text" placeholder="搜索城市、景点或美食..." aria-label="搜索目的地" autocomplete="off"
        onfocus="document.getElementById('cities').scrollIntoView({behavior:'smooth'})">
      <span class="hero-search-icon">&#x1F50D;</span>
    </div>
    <div class="hero-cities">
      {{ range .Site.Data.cities }}
      <a href="{{ .link }}" class="hero-city-dot">{{ .name }}</a>
      {{ end }}
    </div>
  </div>
</header>
```

- [ ] **Step 3: 构建验证**

```bash
cd /root/web-project/Travel-guide && hugo --minify --destination public 2>&1
```

---

### Task 10: 城市卡片 + 城市色条美化

**Files:**
- Modify: `/root/web-project/Travel-guide/static/css/style.css` (city card section, 约第 103-152 行)

- [ ] **Step 1: 更新城市卡片样式 — 添加城市特色色条**

替换 `.city-card` 及相关样式：

```css
/* ===== City Cards Grid (Homepage) ===== */
.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 28px;
}

.city-card {
  background: var(--white);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform var(--transition), box-shadow var(--transition);
  border: 1px solid var(--border-light);
  cursor: pointer;
}

.city-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
}

.city-card-accent {
  height: 4px;
}

.city-card-accent--beijing   { background: var(--city-beijing); }
.city-card-accent--shanghai  { background: var(--city-shanghai); }
.city-card-accent--guangzhou { background: var(--city-guangzhou); }
.city-card-accent--chengdu   { background: var(--city-chengdu); }
.city-card-accent--xian      { background: var(--city-xian); }
.city-card-accent--hangzhou  { background: var(--city-hangzhou); }

.city-card:hover .city-card-accent {
  opacity: 0.85;
}

.city-card-img {
  height: 240px;
  display: flex;
  align-items: flex-end;
  padding: 24px;
  background-size: cover !important;
  background-position: center !important;
  position: relative;
}

.city-card-img::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.08) 55%, transparent 100%);
  pointer-events: none;
}

.city-card-name-overlay {
  position: relative;
  z-index: 1;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.06em;
  text-shadow: 0 2px 16px rgba(0,0,0,0.35);
}

.city-card-body {
  padding: 20px 22px 22px;
}

.city-card-body h3 {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.city-card-body h3 a {
  color: var(--text);
  transition: color var(--transition);
}

.city-card-body h3 a:hover {
  color: var(--primary);
}

.city-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0 12px;
}

.city-card-tags span {
  font-size: 0.74rem;
  padding: 3px 14px;
  border-radius: 50px;
  background: var(--primary-light);
  color: var(--primary-dark);
  font-weight: 500;
  letter-spacing: 0.02em;
}

.city-card-body p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
}
```

- [ ] **Step 2: 构建验证**

```bash
cd /root/web-project/Travel-guide && hugo --minify --destination public 2>&1
```

---

### Task 11: 城市详情页排版美化

**Files:**
- Modify: `/root/web-project/Travel-guide/static/css/style.css` (city page sections, 约第 272-476 行)

- [ ] **Step 1: 更新城市详情页 Hero + 面包屑 + 排版**

更新相关样式：

```css
/* ===== City Page Layout ===== */
.breadcrumb {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 16px 24px;
  font-size: 0.83rem;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

.breadcrumb a {
  color: var(--text-muted);
  transition: color var(--transition);
}

.breadcrumb a:hover {
  color: var(--primary);
}

.breadcrumb span {
  margin: 0 6px;
  color: var(--border);
}

.city-hero {
  position: relative;
  padding: 80px 24px 56px;
  text-align: center;
  overflow: hidden;
}

.city-hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.city-hero-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(44,36,22,0.3) 0%, rgba(44,36,22,0.55) 100%);
}

.city-hero-content {
  position: relative;
  z-index: 1;
}

.city-hero-content h1 {
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  font-weight: 300;
  color: #fff;
  line-height: 1.3;
  margin-bottom: 10px;
  letter-spacing: 0.06em;
  text-shadow: 0 2px 20px rgba(0,0,0,0.4);
}

.city-hero-content h1 strong {
  font-weight: 800;
}

.city-hero-content .city-hero-desc {
  font-size: 1rem;
  color: rgba(255,255,255,0.8);
  max-width: 520px;
  margin: 0 auto 14px;
  line-height: 1.7;
}

.city-hero-content .update-badge {
  display: inline-block;
  font-size: 0.75rem;
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.85);
  padding: 4px 16px;
  border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.15);
  font-weight: 500;
  letter-spacing: 0.04em;
  backdrop-filter: blur(4px);
}

/* 文章排版 */
.city-layout {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 56px;
  max-width: var(--max-width);
  margin: 0 auto;
}

.city-main {
  min-width: 0;
}

.city-sidebar {
  position: sticky;
  top: 82px;
  align-self: start;
}

.city-section {
  margin-bottom: 64px;
}

.city-section h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-ink);
  margin-bottom: 28px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  position: relative;
  letter-spacing: -0.01em;
}

.city-section h2::after {
  content: "";
  display: block;
  width: 48px;
  height: 3px;
  background: var(--primary);
  margin-top: 12px;
  border-radius: 2px;
}

.section-num {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary);
  letter-spacing: 0.06em;
  margin-right: 8px;
  text-transform: uppercase;
}

.city-section h3 {
  font-size: 1.12rem;
  font-weight: 700;
  color: var(--color-ink);
  margin-bottom: 8px;
}

.city-section p {
  font-size: 0.98rem;
  color: var(--text-secondary);
  line-height: 1.9;
  margin-bottom: 18px;
}

/* 景点列表 */
.attraction-item {
  padding: 28px 0;
  border-bottom: 1px solid var(--border-light);
}

.attraction-item:last-child {
  border-bottom: none;
}

.attraction-index {
  font-size: 1.6rem;
  font-weight: 300;
  color: var(--primary);
  line-height: 1;
  min-width: 34px;
  letter-spacing: -0.02em;
}

.attraction-body h3 {
  font-size: 1.18rem;
  font-weight: 700;
  color: var(--text);
}

.attraction-body p {
  font-size: 0.93rem;
  color: var(--text-secondary);
  line-height: 1.85;
}

/* 侧边栏 */
.sidebar-card {
  margin-bottom: 36px;
}

.sidebar-card h4 {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 18px;
  padding-left: 12px;
  border-left: 2px solid var(--primary);
}

.sidebar-city-list {
  list-style: none;
}

.sidebar-city-list a {
  display: block;
  padding: 10px 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-light);
  transition: color var(--transition);
}

.sidebar-city-list a:hover {
  color: var(--primary);
}

.sidebar-city-list li:last-child a {
  border-bottom: none;
}
```

- [ ] **Step 2: 构建验证**

```bash
cd /root/web-project/Travel-guide && hugo --minify --destination public 2>&1
```

---

### Task 12: Footer 重设计

**Files:**
- Modify: `/root/web-project/Travel-guide/static/css/style.css` (footer section, 约第 444-456 行)
- Modify: `/root/web-project/Travel-guide/layouts/partials/footer.html`

- [ ] **Step 1: 更新 Footer CSS**

替换 `.footer` 样式：

```css
/* ===== Footer ===== */
.footer {
  background: var(--color-ink);
  color: #9C9185;
  padding: 64px 24px 28px;
}

.footer-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
}

.footer-col h3 {
  color: #FBF8F3;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.footer-col p {
  font-size: 0.88rem;
  line-height: 1.8;
}

.footer-col ul {
  list-style: none;
}

.footer-col li {
  margin-bottom: 8px;
}

.footer-col a {
  color: #9C9185;
  font-size: 0.88rem;
  transition: color var(--transition);
}

.footer-col a:hover {
  color: #FBF8F3;
}

.footer-subscribe {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.footer-subscribe input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  font-size: 0.88rem;
  background: rgba(255,255,255,0.05);
  color: #FBF8F3;
  font-family: inherit;
  outline: none;
  transition: border-color var(--transition);
}

.footer-subscribe input:focus {
  border-color: var(--primary);
}

.footer-subscribe input::placeholder {
  color: #6B6055;
}

.footer-subscribe button {
  padding: 10px 20px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  font-family: inherit;
  transition: background var(--transition);
}

.footer-subscribe button:hover {
  background: var(--accent-dark);
}

.footer-bottom {
  max-width: var(--max-width);
  margin: 40px auto 0;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.06);
  text-align: center;
  font-size: 0.8rem;
  color: #6B6055;
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
}

@media (max-width: 480px) {
  .footer-inner {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: 更新 footer.html 模板 — 添加订阅区**

```html
<footer class="footer">
  <div class="footer-inner">
    <div class="footer-col">
      <h3>城市旅游攻略</h3>
      <p>2026年持续更新的城市自由行攻略平台。每一份攻略都由真实旅行者人工撰写，信息每季度复核。无广告、纯静态、加载快。</p>
      <div class="footer-subscribe">
        <input type="email" placeholder="输入邮箱，获取更新" aria-label="邮箱订阅">
        <button type="button">订阅</button>
      </div>
    </div>
    <div class="footer-col">
      <h3>热门目的地</h3>
      <ul>
        <li><a href="/cities/beijing/">北京旅游攻略</a></li>
        <li><a href="/cities/shanghai/">上海旅游攻略</a></li>
        <li><a href="/cities/guangzhou/">广州旅游攻略</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>更多城市</h3>
      <ul>
        <li><a href="/cities/chengdu/">成都旅游攻略</a></li>
        <li><a href="/cities/xian/">西安旅游攻略</a></li>
        <li><a href="/cities/hangzhou/">杭州旅游攻略</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 城市旅游攻略 — 自由行指南. All rights reserved.</p>
  </div>
</footer>
```

- [ ] **Step 3: 构建验证**

```bash
cd /root/web-project/Travel-guide && hugo --minify --destination public 2>&1
```

---

### Task 13: 旅行攻略响应式 + 整体构建检查

- [ ] **Step 1: 验证所有响应式断点样式**

检查 `style.css` 中 `@media` 规则覆盖了以下样式：
- 900px: city-layout 单列、sidebar 取消 sticky
- 768px: nav-links 隐藏、city-grid 单列、section padding 缩小
- 480px: tips-grid 单列、footer 单列

- [ ] **Step 2: 清理构建**

```bash
cd /root/web-project/Travel-guide && rm -rf public && hugo --minify --destination public 2>&1
```

- [ ] **Step 3: 检查构建产物**

```bash
ls /root/web-project/Travel-guide/public/ && echo "---" && ls /root/web-project/Travel-guide/public/cities/
```

Expected: 首页 + 6 城详情页均生成

---

## Part C: 验证

### Task 14: 双项目构建 + 并排预览

- [ ] **Step 1: 两个项目都构建**

```bash
cd /root/web-project/ai-anime-avatar && rm -rf public && hugo --minify --destination public 2>&1
cd /root/web-project/Travel-guide && rm -rf public && hugo --minify --destination public 2>&1
```

- [ ] **Step 2: 启动本地预览服务**

```bash
# AI 动漫头像
cd /root/web-project/ai-anime-avatar/public && python3 -m http.server 8081 &
# 旅行攻略
cd /root/web-project/Travel-guide/public && python3 -m http.server 8083 &
```

- [ ] **Step 3: 视觉检查清单**

在浏览器打开：
- `http://localhost:8081/` — AI 动漫头像，检查 Hero 居中/光晕/CTA/社交举证
- `http://localhost:8081/` — 滚动查看深浅交替节奏
- `http://localhost:8081/en/` — 英文版
- `http://localhost:8083/` — 旅行攻略首页，检查 Hero/搜索框/城市卡片/城市色条
- `http://localhost:8083/cities/chengdu/` — 城市详情页排版
- 调整浏览器宽度至 375px / 768px / 1024px 验证响应式

---

### Task 15: 无障碍 + 动效降级检查

- [ ] **Step 1: 检查 prefers-reduced-motion**

在浏览器 DevTools 中开启 `prefers-reduced-motion: reduce`，确认所有动画停止

- [ ] **Step 2: 键盘导航检查**

Tab 键遍历所有交互元素，确认 focus 状态可见（暖紫 outline）

- [ ] **Step 3: 触控区域检查**

在 375px 移动端视口确认按钮、链接、FAQ 展开区域 ≥ 44×44px
