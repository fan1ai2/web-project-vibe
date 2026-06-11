# AI Anime Avatar — 子页面拆分设计文档

**日期**: 2026-06-11
**状态**: 已审核，进入实现阶段

**关键决策**:
- 导航标签: "创作" (非"开始创作")
- Comparison 竞品对比表放在风格画廊后
- Testimonials 评价数据由实现阶段生成（中英日各 10-12 条）

---

## 目标

将当前主页的"上传"、"风格画廊"、"用户评价"内容拆分为独立子页面，主页精简为核心引导入口，增强 SEO、用户体验和内容可维护性。

## 路由设计

| 页面 | 路由 | Hugo 内容文件 |
|------|------|-------------|
| 主页 (精简) | `/` `/en/` `/ja/` | `content/zh/_index.md` |
| 创作页 (上传+画廊) | `/create/` `/en/create/` `/ja/create/` | `content/zh/create.md` |
| 用户评价 | `/testimonials/` `/en/testimonials/` `/ja/testimonials/` | `content/zh/testimonials.md` |

## 主页调整

### 保留 (不变)
1. **Hero** — 标题 + 副标题 + CTA + 数据统计 + Before/After 对比图 + 花瓣动画
2. **Showcase** — 6 张风格卡片 (日系/韩系/美漫/Q版/像素/赛博)
3. **HowItWorks** — 3 步流程 (上传 → AI生成 → 下载)

### 新增
- **引导卡片区** — 两张玻璃 CTA 卡片，放在 HowItWorks 下方、FAQ 上方

### 从主页移除
- `upload.html` (上传区域) → 迁入 `/create/`
- `results.html` (结果画廊) → 迁入 `/create/`
- `comparison.html` (竞品对比) → 迁入 `/create/`
- `testimonials.html` (用户评价) → 迁入 `/testimonials/`

### 保留在主页
- `faq.html`
- `share.html`

## 主页引导卡片设计

### 方案: 玻璃悬浮双卡片 (方案 C)

复用现有 `glass` + `watercolor-bg` 设计令牌。

| 属性 | 左卡片 | 右卡片 |
|------|--------|--------|
| 标题 | 开始创作 | 用户评价 |
| 描述 | 上传照片，AI 即刻生成 6 种动漫风格 | 真实用户的使用体验，4.9★ · 98.5% 满意 |
| CTA | 开始上传 → | 查看评价 → |
| 跳转 | `/create/` | `/testimonials/` |
| 光晕 | 杏色 (rgba 212,167,116,0.2) | 樱色 (rgba 232,180,184,0.2) |
| SVG 插画 | 人像轮廓 + 星星火花 + 上传箭头 | 多头像轮廓交错 + 大五角星 |
| hover 边框 | `--color-primary` | `--color-secondary` |

### 卡片布局

```
[SVG 插画 80×80px 居中]
[标题 24px Noto Serif SC Bold]
[描述 16px Noto Sans SC, color-text-secondary]
[CTA 文字 + → 箭头, color-primary / color-secondary]
```

### 交互动效

- **光晕视差**: 卡片 `::before` 径向渐变光晕跟随鼠标偏移 15-20px (mousemove JS)
- **Hover**: translateY(-6px) + shadow-lg + 光晕增亮 + 边框渐变色 + CTA 箭头右移 4px
- **入场**: IntersectionObserver 触发 fadeInUp，左卡 0ms / 右卡 100ms 错开
- **触屏**: hover 替换为 `:active` scale(0.98)，光晕关闭

### 响应式

| 断点 | 布局 | 卡片宽 |
|------|------|--------|
| ≥860px | 双列并排 | 1fr (max 400px)，间距 24px |
| 768-859px | 双列并排 | 1fr，间距 16px |
| <768px | 单列堆叠 | 100%，间距 16px |

## 导航更新

### Header 新增导航链接

```
首页 | 创作 | 用户评价 | 功能介绍 | 常见问题
```

- "创作" → `/create/`
- "用户评价" → `/testimonials/`
- "功能介绍" 和 "常见问题" 保留为主页锚点 (`#how-it-works`、`#faq`)

### 移动端汉堡菜单同步新增

### Footer 链接更新
- 原有锚点链接替换为子页面路由

## /create/ 页面结构

```
Hero Banner (水彩渐变)
  └─ 标题: 创建你的专属漫改头像
     └─ 副标题: 上传照片，AI 即刻生成 6 种动漫风格
     └─ CTA: ↓ 立即开始

Section 1: 上传区域
  └─ 玻璃卡片 (max-width 720px 居中)
     └─ 拖拽区 + 文件选择按钮 + 格式提示 + 隐私声明
     └─ 风格预选条 (6 个标签，默认"全部")
     └─ 免费次数提示 (3次/天)
     └─ 预览区 + 进度条 + 生成中动画

Section 2: 风格画廊
  └─ 筛选条: [全部] [日系] [韩系] [美漫] [Q版] [像素] [赛博]
  └─ 3 列网格，hover 切换原图/效果图
  └─ 每张卡: 原图(hover→效果图) + 风格标签 + 下载按钮

Section 3: 竞品对比表
  └─ 复用 comparison.html 功能对比表
  └─ 5 列 × 7 行 (功能/风格数/语言/价格/授权等)

Section 4: Before/After 对比器
  └─ 滑动对比组件，可切换风格

CTA Banner
  └─ "准备好生成你的专属头像？" [开始上传 ↑]
```

## /testimonials/ 页面结构

```
Hero Banner (暖色水彩)
  └─ 标题: 超过 10,000 人已拥有专属漫改头像
     └─ ⭐ 4.9 / 5.0 · 1,286 条评价

Section 1: 精选评价
  └─ 横向滚动 (3-4 张大卡片)
  └─ 每张: 原图→效果对比 + 评价原文 + 用户信息 + 风格标签

Section 2: 全部评价
  └─ 筛选: [全部风格▾] [最高评分▼]
  └─ 2 列网格，卡片: 头像 + 姓名 + 风格标签 + 星级 + 评价文字
  └─ 数据扩展至 10-12 条 (当前 3 条)

Section 3: 数据统计条
  └─ 10,000+ 累计生成 · 98.5% 满意率 · <30s 平均耗时

CTA Banner
  └─ "加入他们，生成你的专属漫改头像" → /create/
```

## SEO 策略

每个子页面独立 SEO 元数据：

| 页面 | Title | Description | Keywords |
|------|-------|-------------|----------|
| /create/ | AI漫改头像在线生成 — 上传照片即刻制作 | 上传你的照片，AI 自动生成 6 种动漫风格头像。日系、韩系、美漫、Q版、像素、赛博朋克，一键下载高清无水印。 | AI漫改头像, 动漫头像生成, 照片转动漫, AI头像制作 |
| /testimonials/ | 用户评价 — AI漫改头像真实反馈 | 超过 10,000 名用户已使用 AI 漫改头像生成器。查看真实评价、效果对比，4.9 星好评。 | AI漫改头像评价, 动漫头像用户反馈, 效果展示 |

每个页面包含：
- 独立 `<title>` + `<meta description>` + `<meta keywords>`
- OG / Twitter Card 独立标签
- JSON-LD 结构化数据 (WebApplication / Review)
- Canonical URL + hreflang 三语言交替链接

## Hugo 文件变更清单

### 新建文件
- `content/zh/create.md`
- `content/en/create.md`
- `content/ja/create.md`
- `content/zh/testimonials.md`
- `content/en/testimonials.md`
- `content/ja/testimonials.md`
- `layouts/_default/create.html` (或 `/create/` 单页模板)
- `layouts/_default/testimonials.html`
- `layouts/partials/guide-cards.html` (主页引导卡片)
- `assets/css/components/page-create.css`
- `assets/css/components/page-testimonials.css`
- `assets/css/components/guide-cards.css`

### 修改文件
- `layouts/_default/home.html` — 移除 upload/results/comparison/testimonials，新增 guide-cards
- `layouts/partials/header.html` — 新增导航链接
- `layouts/partials/footer.html` — 更新链接
- `i18n/zh.toml` / `en.toml` / `ja.toml` — 新增翻译键
- `assets/css/main.css` — 新增组件 import
- `data/testimonials.json` — 扩展评价数据至 10-12 条

### 可能移除
- `layouts/partials/comparison.html` — 内容迁入 /create/，可移除或改为 partial 复用

## 技术约束

- Hugo v0.145.0 extended
- 多语言: zh / en / ja
- CSS: BEM 组件风格，复用 CSS 变量系统
- JS: 原生 JS，无框架，上传/预览/进度条/生成逻辑从主页 JS 迁移
- 兼容 `prefers-reduced-motion`
- 兼容 `[data-theme="dark"]` 暗色模式
