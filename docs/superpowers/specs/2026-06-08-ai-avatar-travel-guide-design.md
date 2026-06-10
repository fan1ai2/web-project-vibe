# AI 动漫头像 + 旅行攻略 双项目前端美化设计规格

**日期**: 2026-06-08 | **状态**: 待实现

## 概述

两个 Hugo 静态站点的 UI/UX 美化：AI 动漫头像（`ai-anime-avatar`）定位精致高端工具，旅行攻略（`Travel-guide`）定位人文杂志+实用效率。共用暖色系设计语言，各自独立实现。

---

## 一、AI 动漫头像（ai-anime-avatar）

### 1.1 设计定位

精致高端 × 暖色系 × 深浅交替叙事。类似 Midjourney / SpaceX 的视觉品质，但用暖紫金色调替代冷紫。

### 1.2 配色令牌

```
旧 → 新：
--color-primary:    #8B5CF6 → #9B6FF0  (暖紫，保留品牌识别)
--color-secondary:  #EC4899 → #F06292  (暖粉)
新增 --color-accent:         #F59E0B  (暖金，CTA 强调、评分星、高亮边)
--gradient-primary: linear-gradient(135deg, #9B6FF0, #F06292)
--gradient-hero:    linear-gradient(135deg, #7C3AED, #C44D88, #F59E0B)
```

暗色模式保持，深底色调整为 `#0D0B14`（暖黑，带微弱红底），`--color-bg-alt` 为 `#18151F`。

### 1.3 板块视觉规格（自顶向下）

**Hero**
- 深黑底 + 暖金紫光晕（右上 320px 暖紫 + 左下 240px 暖金光晕）
- 居中布局：Logo图标 → Badge → 大标题 → 副标题 → CTA按钮（暖紫→暖粉渐变）→ 社交举证（100K+/1M+/4.9）
- Before/After 对比图在 CTA 下方
- 断点：移动端 CTA 上下堆叠

**Showcase（风格展示）**
- 浅暖灰底（`#F8F6F4`）
- 6 张风格卡片，3×2 网格，`border-radius: 16px`，白色卡片 + 微阴影
- hover: `translateY(-4px)` + 阴影加深 + 底部暖紫线出现（`::after 3px bar`）
- 图片用 `aspect-ratio: 1` 裁切，下方标签行居中

**How it Works（三步说明）**
- 深黑底，冷暖交替节奏
- 三步卡片横向排列（移动端纵向），每步圆形序号 + 暖金→暖紫渐变数字
- 玻璃态卡片（`background: rgba(255,255,255,0.04)` + `backdrop-filter: blur(12px)`）
- 步骤连线用虚线或箭头

**Upload（上传区）**
- 浅暖灰底
- 大面积虚线拖拽区（`border: 2px dashed var(--color-border)`），`border-radius: 16px`
- 中心上传图标 + "拖拽或点击上传" 文案
- hover 时虚线变暖紫实线，背景微变

**Pricing（价格）**
- 深黑底
- 三列卡片：免费 / Pro / 企业，居中推荐卡片暖金边框 + "推荐" badge
- 价格数字大号加粗，货币符号上标
- CTA 按钮：推荐卡片用渐变实心，其他用描边

**FAQ**
- 浅暖灰底
- 手风琴，点击展开时左侧 3px 暖紫条 + 内容区背景微亮
- 箭头图标旋转 180° 动画

### 1.4 多语言

三语言（zh/en/ja）均需覆盖，i18n 文件在 `i18n/` 目录。日文版字体考虑 `"Hiragino Kaku Gothic ProN"`。

### 1.5 性能

- CSS 已通过 Hugo pipe 合并压缩，保持不变
- 展示图片使用 WebP + lazy loading（已有）
- 无额外 JS 依赖

---

## 二、旅行攻略（Travel-guide）

### 2.1 设计定位

人文杂志风 × 实用效率。暖米/棕色系，类似孤独星球的编辑质感。信息层级清晰，搜索和城市导航优先。

### 2.2 配色令牌

```
保持不变（已符合方向）：
--primary:        #b08968  (暖棕)
--primary-dark:   #8b6848
--primary-light:  #f5efe6
--accent:         #e07b39  (暖橙，CTA)
--text:           #3d3027
--bg:             #faf7f2  (暖米底)

新增：
--color-ink:      #2C2416  (深棕黑，正文用)
--color-cream:    #FBF8F3  (更浅米色，卡片背景)
--color-champagne:#F5EDE0  (香槟色，Hero 渐变)
```

每座城市特色色（用于卡片顶部色条/hover状态）：
- 北京：`#9B2D30`（故宫红）
- 上海：`#3B6B8F`（外滩蓝）
- 广州：`#4A8C3F`（岭南绿）
- 成都：`#C4823D`（火锅橙）
- 西安：`#8B6914`（古城金）
- 杭州：`#5B8C5A`（龙井绿）

### 2.3 板块视觉规格

**Hero**
- 香槟→暖米渐变底 `linear-gradient(165deg, #F5EDE0, #EDE1CE, #E5D5BB)`
- 右上角 "2026 EDITION" 小标签
- 大号衬线标题（可 CSS `font-weight: 300` + `letter-spacing: 0.08em`）+ 加粗关键词
- 引导语 + 搜索框（大圆角，focus 时暖棕边框发光）
- 搜索框下方 6 城小圆点快捷入口

**城市卡片网格**
- 2 列网格（移动端 1 列），卡片 `border-radius: 14px`
- 顶部城市特色色条（4px） → 大图区（带渐变遮罩+城市名覆盖） → 标签行 → 简介
- hover: `translateY(-6px)` + 阴影加深 + 边框暖棕
- 标签使用 `border-radius: 50px` 胶囊，字号 `0.76rem`

**旅行贴士**
- 三列（移动端堆叠），暖米底卡片，`border: 1px solid var(--border)`
- 图标 + 标题 + 短描述
- hover: 边框变暖棕

**城市详情页（single.html）**
- 大图头图区（`height: 360px`），城市特色色渐变遮罩
- 面包屑导航
- 文章式排版：正文 `max-width: 720px` 居中，`line-height: 1.85`
- h2 标题下 48px 宽暖棕短线装饰
- 景点/美食/行程 分节，每节卡片式呈现

**Footer**
- 深棕底（`#3D2E1F`），白色文字
- 邮件订阅输入框 + 社交媒体链接
- 底部版权行

### 2.4 搜索增强

- 搜索框实时筛选（已有 JS），风格统一为暖棕系
- 搜索结果下拉卡片 `border: 1px solid var(--border)` + `box-shadow: var(--shadow-lg)`
- hover 项背景 `var(--primary-light)`

### 2.5 性能

- 纯静态 Hugo，CSS 通过 `<link>` 引入（非 Hugo pipe，保持不变）
- 城市图片 WebP + lazy loading
- search.js 已有（5KB），保持不变

---

## 三、通用规范

### 响应式断点

| 断点 | 宽度 | 调整 |
|------|------|------|
| 移动端 | < 640px | 单列、堆叠、CTA 全宽、字号缩小 |
| 平板 | 640-1024px | 2 列网格、中等间距 |
| 桌面 | > 1024px | 完整布局、更大 Hero、hover 动效 |

### 无障碍

- 所有交互元素 min 44×44px 触控区域
- `prefers-reduced-motion` 降级所有动画
- 焦点态可见（暖紫 outline）
- 图片 alt 文本完整

### 动效

- transition 统一 `0.2s cubic-bezier(0.4, 0, 0.2, 1)`
- hover 卡片上移 4-6px
- 页面加载无闪动（避免 FOUC）

---

## 四、实现范围

### 包含

- CSS 变量调整（色板统一）
- 所有 partials 的视觉优化（两个项目）
- 城市详情页排版美化
- 响应式验证（四个断点）
- 暗色模式适配（仅 ai-anime-avatar）

### 不包含

- 新增页面/功能
- 图片资源替换（保留现有占位图路径）
- 后端/API 改动
- Hugo 内容（.md）修改

---

## 五、实现顺序

1. AI 动漫头像 CSS 色板 + Hero 重设计
2. AI 动漫头像其余板块依次美化
3. 旅行攻略 CSS 色板 + 城市色
4. 旅行攻略 Hero + 城市卡片
5. 旅行攻略详情页 + Footer
6. 双项目响应式验证 + 构建测试
