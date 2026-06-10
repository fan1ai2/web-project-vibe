# AI Prompt — 中文AI提示词库 设计文档

**日期**: 2026-06-10  
**状态**: 已确认  
**目标**: 复刻 getprompt.cc，用 Hugo 构建纯前端精品中文AI提示词分享站

---

## 一、技术选型

| 层 | 选择 | 理由 |
|----|------|------|
| 框架 | Hugo (SSG) | 纯静态、构建快、SEO友好 |
| 样式 | 手写 CSS + CSS 变量 | 精准控制质感、零依赖 |
| 交互 | 原生 JS | 搜索/筛选/复制/Tool Mock，体积小 |
| SEO | Hugo内建 + JSON-LD结构化数据 | 富文本搜索结果 |
| 字体 | Noto Serif SC (标题) + System UI (正文) | 质感+性能 |

---

## 二、信息架构

```
首页 (/)
  Hero + 搜索 + 热门标签
  8分类卡片入口
  精选提示词 (6条)
  工具箱预览 (7个)

提示词库 (/prompts/)
  左侧分类筛选 + 搜索
  卡片网格 + 分页

提示词详情 (/prompts/<slug>/)
  面包屑 + 提示词内容 + 复制
  使用说明 + 相关推荐

工具箱 (/tools/) — 7个工具
  列表入口 + 各自详情页 (Mock UI)

关于 (/about/)
  站点介绍 + 使用指南
```

## 三、8个提示词分类

写作创作 / 编程开发 / 设计创意 / 营销文案 / 效率工具 / 学习教育 / 生活助手 / 角色扮演

每分类 10-20 条高质量中文提示词，预置在 `content/prompts/<category>/` 下。

## 四、视觉设计系统

### 配色（暖白+琥珀金）

| Token | 值 | 用途 |
|-------|-----|------|
| `--bg-primary` | `#FAF9F6` | 全局背景 |
| `--bg-card` | `#FFFFFF` | 卡片 |
| `--accent` | `#D4963F` | 主强调（按钮/链接/图标） |
| `--accent-deep` | `#8B5E2B` | hover态 |
| `--text-primary` | `#1A1A1A` | 标题正文 |
| `--text-secondary` | `#6B6B6B` | 描述/meta |
| `--border` | `#E8E5DF` | 分割线/边框 |
| `--success` | `#4A9C6C` | 复制成功 |
| `--tag-bg` | `#F5F0E8` | 标签背景 |

### 字体

- 标题: Noto Serif SC (400/700)
- 正文: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif
- 代码: "JetBrains Mono", "SF Mono", monospace
- 字号阶梯: 12/14/16/18/20/24/32/40/56

### 间距

4px基准: 4/8/12/16/20/24/32/40/48/64/80/96/120

### 微交互

| 元素 | 效果 |
|------|------|
| 卡片hover | translateY(-4px) + 阴影加深, 200ms ease-out |
| 复制按钮 | 图标切换✓ + 松石绿闪烁, 2s恢复 |
| 搜索框focus | 边框色过渡 + 微外发光 |
| 分类标签hover | 琥珀金填充渐变 |
| Hero背景 | CSS微粒子/网格动画 |
| 工具Mock | 打字机逐字输出、进度条动画 |

**不做暗黑模式**，但CSS变量架构预留data-theme切换能力。

---

## 五、Hugo 目录结构

```
ai-prompt/
├── hugo.toml
├── archetypes/prompts.md
├── content/
│   ├── _index.md
│   ├── prompts/
│   │   ├── _index.md
│   │   ├── writing/          # 10-20条
│   │   ├── programming/      # 10-20条
│   │   ├── design/           # 10-20条
│   │   ├── marketing/        # 10-20条
│   │   ├── productivity/     # 10-20条
│   │   ├── education/        # 10-20条
│   │   ├── lifestyle/        # 10-20条
│   │   └── roleplay/         # 10-20条
│   ├── tools/ (7个工具)
│   └── about.md
├── data/
│   ├── categories.yaml
│   ├── tools.yaml
│   └── site.yaml
├── layouts/
│   ├── _default/baseof.html
│   ├── _default/list.html
│   ├── _default/single.html
│   ├── partials/ (head/header/footer/structured-data/prompt-card)
│   ├── index.html
│   └── 404.html
├── static/
│   ├── css/main.css
│   ├── js/search.js
│   ├── js/copy.js
│   ├── js/tools-mock.js
│   └── icons/
└── assets/
```

## 六、提示词 Frontmatter 规范

```yaml
---
title: "提示词标题"
slug: "url-slug"
category: "writing"
tags: ["改写", "优化"]
models: ["ChatGPT", "Claude"]
difficulty: "初级"
featured: false
seo:
  description: "简短SEO描述"
  structured_data: "HowTo"
---
```

## 七、SEO 实现

### 全局层

- enableRobotsTXT, sitemap, `<html lang="zh-CN">`
- 所有页面自动 title/description/og/twitter/canonical
- `<link rel="alternate" hreflang="zh-CN">`

### JSON-LD 结构化数据

| 页面 | Schema | 效果 |
|------|--------|------|
| 首页 | WebSite + SearchAction | 搜索框直达 |
| 提示词列表 | ItemList | 列表轮播 |
| 提示词详情 | HowTo | 步骤卡片 |
| 工具页 | SoftwareApplication | 应用卡片 |

### 内容SEO

- 语义HTML5 (`<main>/<nav>/<article>/<section>`)
- 标题不跳级 (h1→h2→h3)
- 所有img有alt, loading=lazy
- 面包屑导航
- 相关提示词内链

### 搜索实现

编译时生成 `static/prompts-index.json`（所有提示词的标题+标签+分类+简介），前端JS客户端搜索+筛选，零服务端依赖。

---

## 八、不包含

- 用户注册/登录/上传（静态站不可行）
- AI API 真实调用（工具页用 Mock UI 模拟）
- 暗黑模式（预留变量架构）
- 评论区/评分系统
