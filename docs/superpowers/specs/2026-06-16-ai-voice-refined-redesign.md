# AI Voice — 干净克制高级感重设计 Spec

**Date**: 2026-06-16
**Status**: Approved
**Base**: 基于 2026-06-15-ai-voice-redesign.md 的二次视觉迭代

## 设计动机

当前手绘线稿版本存在以下问题：
- SVG 几何线稿太朴素，像低保真线框图，缺乏"设计完成度"
- 暖奶油底色 `#FAF7F2` 大面积铺开像未处理过的纸面
- 零阴影 + 零纵深，所有元素浮在同一平面
- 字体 Rounded Mplus 1c 圆角几何体是温和友好而非高级克制
- 炭黑 + 暖橙两个颜色太单调

本重设计方向：**接近白底 + 毛玻璃层次 + 微阴影 + 几何抽象图形**。参考 Apple 产品页的干净克制气质，用 Inter 字体 + 精密间距 + 毛玻璃卡片做出"每一像素都被刻意推敲过"的品质感。

---

## 色彩系统

| Token | 值 | 用途 |
|--------|-----|------|
| 页面底色 | `#F8F9FA` | 冷灰近白，比暖奶油更克制 |
| 卡片底色 | `rgba(255,255,255,0.72)` | 毛玻璃半透 |
| 卡片边框 | `rgba(0,0,0,0.06)` | 极淡边缘 |
| 卡片阴影 | `0 1px 3px rgba(0,0,0,0.04)` | 微深度 |
| Hover 阴影 | `0 4px 12px rgba(0,0,0,0.08)` | 悬停浮起 |
| 文字主色 | `#1D1D1F` | 接近纯黑不刺眼 |
| 文字次色 | `#6E6E73` | 苹果暖灰 |
| 文字三级 | `#86868B` | 更淡灰 |
| 分割线 | `#E8E8ED` | 稍暖浅灰 |
| 点缀色 | `#FF5E3A` | 饱满橙红，仅 CTA + 进度标记 |
| 点缀色 hover | `#E84A2D` | CTA 悬停 |
| 播放器底 | `#1D1D1F` | 极暗灰 |
| 播放器文字 | `#F5F5F7` | 近白 |

### CSS 设计令牌

```css
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
```

### 删除
- `#FAF7F2` 暖奶油 → 换 `#F8F9FA`
- `#2D2D2D` 炭黑 → 换 `#1D1D1F`
- `#E8734A` 暖橙 → 换 `#FF5E3A`
- `#6B6561` 暖灰 → 换 `#6E6E73`
- `#A09890` → 换 `#86868B`
- `#E8E3DC` 暖白 → 换 `#E8E8ED`
- 所有 `shadow: none` → 换微阴影体系
- `Rounded Mplus 1c` → 换 `Inter`

---

## 字体系统

| 层级 | 字体栈 |
|------|--------|
| 标题 | `"Inter", "SF Pro Display", "Noto Sans SC", sans-serif` |
| 正文 | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans SC", sans-serif` |
| 等宽 | `"SF Mono", "JetBrains Mono", "Fira Code", ui-monospace, monospace` |

Inter 从 Google Fonts 加载：400 + 500 + 600 + 700 四个 weight。

### 排版参数

| 层级 | 字号 | 字重 | 行高 | 字距 |
|------|------|------|------|------|
| Hero 标题 | 3.5rem | 600 | 1.15 | -0.02em |
| Hero 副标题 | 1.25rem | 400 | 1.5 | -0.01em |
| Section 标题 | 1.75rem | 600 | 1.3 | -0.01em |
| 卡片标题 | 1.125rem | 600 | 1.3 | 0 |
| 正文 | 0.9375rem | 400 | 1.6 | 0 |
| 小字/标签 | 0.8125rem | 400 | 1.5 | 0 |
| 全局 body | 16px | 400 | 1.5 | 0 |

---

## 按钮系统

| 变体 | 样式 |
|------|------|
| **Primary** | 白底 + `1px solid rgba(0,0,0,0.1)` + `box-shadow: 0 1px 2px rgba(0,0,0,0.04)`；hover: 边框 `rgba(0,0,0,0.2)` + shadow 扩为 `0 4px 12px rgba(0,0,0,0.08)` + `translateY(-1px)` |
| **Secondary** | 透明底无边框，文字 `#6E6E73`，hover 变 `#1D1D1F` |
| **Accent（仅 CTA）** | `#FF5E3A` 底 + 白字 + 无边框 + `box-shadow: 0 1px 3px rgba(255,94,58,0.2)`；hover: `#E84A2D` + shadow 扩为 `0 4px 12px rgba(255,94,58,0.35)` + `translateY(-1px)`。每个页面最多一个 |
| **导出栏按钮** | 同 Primary，字号 0.8125rem |

- 圆角统一 `border-radius: 12px`
- 字体 Inter 500
- 内边距：`10px 22px`（常规），`14px 32px`（lg）
- 过渡：`transition: background 0.2s, box-shadow 0.2s, transform 0.2s, border-color 0.2s`（不用 `all`）

### 删除
- 描边炭黑 2px 按钮样式全部删除
- `.btn-outline` 的炭黑边框变体删除

---

## 首页设计

**整体底色** `#F8F9FA`，全页无大面积色块，无 CSS 渐变。

### 页面结构

1. **Hero**
   - 上方 ~64×64 抽象几何 SVG（两个偏移的同心圆 + 三个错位小圆），线 1.5px，色 `#D1D1D6`
   - 下方：大字标题 `3.5rem / weight 600 / letter-spacing -0.02em`
   - 一行副标题 `1.25rem / #86868B / weight 400 / letter-spacing -0.01em`
   - 一个橙色 Accent CTA 按钮
   - 上下 padding 各 120px，无背景色块

2. **步骤卡片 ×3**（上传 / 转录 / 导出）
   - 横排三张，毛玻璃白底 + 微阴影 + 1px 淡边框，圆角 16px
   - 每张上方 ~48×48 抽象几何 SVG（圆环、折线、方块偏移），线 1.5px，色 `#D1D1D6`
   - 下方标题 + 一句话
   - 悬停：阴影扩为 `--shadow-md` + `transform: translateY(-2px)`

3. **格式标签**
   - 纯文字标签，`#86868B` 小字，逗号分隔，无边框无背景

4. **使用场景 ×5**
   - 横排五张，无卡片无边框
   - 每张上方 ~56×56 抽象几何 SVG，线 1.5px，色 `#D1D1D6`
   - 下方一行标签文字 Inter 500 `#6E6E73`
   - 无悬停效果，纯信息陈列

5. **FAQ**
   - `<details>` 折叠，无容器卡片，无边框
   - Q&A 之间 `0.5px solid #E8E8ED` 分隔线
   - 底色保持页面底色

---

## 工具页设计

**原则**：白底毛玻璃卡片 + 微阴影层次 + 暗色播放器做锚点。

### 上传区
- 毛玻璃白底卡片 + 微阴影 + 1px 淡边框，圆角 16px
- 中间 ~48×48 抽象几何上传图标（空心圆 + 上箭头），线 1.5px，色 `#D1D1D6`
- 拖拽悬停：背景变纯白不透明 + 边框变 `rgba(0,0,0,0.15)` + 图标变 `#FF5E3A` + shadow 扩为 `--shadow-md`
- 文字：主提示 Inter 500 `#6E6E73`，格式提示 `#86868B`
- 选中文件后：文件图标也换几何线条风格

### 进度指示器
- 四阶段小圆点，当前 `#FF5E3A` 实心，未完成 `#D1D1D6` 描边空心
- 每 900ms 向前点亮一个
- 状态文字 `#86868B` 小字

### 音频播放器
- 暗色底 `#1D1D1F` + 文字 `#F5F5F7`
- 进度轨道 `rgba(255,255,255,0.15)`，已播放 `#FF5E3A`，当前位 8px `#FF5E3A` 实心圆
- 速度选择器文字 `#86868B`
- 播放/暂停按钮白色，hover 圆底 `rgba(255,255,255,0.1)`

### 转录面板
- 毛玻璃白底卡片，和上传区同套视觉
- 时间戳 `#86868B` 等宽小字
- 说话人：纯文字标签 weight 600 `#1D1D1F`（无圆点前缀）
- 当前行：左侧 `#1D1D1F` 3px 竖线 + 背景 `rgba(0,0,0,0.02)`
- 整行点击跳转

### 导出栏
- 四个 Primary 样式按钮

### 隐私标识
- `#86868B` 小字 + 几何锁图标，无背景无边框

---

## 图形系统（替代手绘 SVG）

所有图形改为**抽象几何 SVG**——干净的线、圆、矩形偏移。不画人物/场景/具象物体。

### 清单

| 位置 | 尺寸 | 内容 | 线宽 | 颜色 |
|------|------|------|------|------|
| 首页 Hero 图形 | ~64×64 | 两个偏移同心圆 + 三个错位小圆点 | 1.5px | `#D1D1D6` |
| 步骤 ×3 | ~48×48 | 上传（箭头+虚线环）、转录（波形折线）、导出（文档+对勾）| 1.5px | `#D1D1D6` |
| 场景 ×5 | ~56×56 | 五个各不相同的几何构成（见下方） | 1.5px | `#D1D1D6` |
| 工具页上传 | ~48×48 | 空心圆 + 上箭头 | 1.5px | `#D1D1D6`，悬停 `#FF5E3A` |
| 隐私锁 | ~14×14 | 锁体 + 锁扣 | 1.5px | `#86868B` |
| 文件图标 | 40×40 | 文档轮廓 + 两条横线 | 1.5px | `#D1D1D6` |

### 几何构成描述（场景 ×5）

1. **学生**：三个堆叠的水平长条（代表书本）+ 上方一个小圆
2. **播客**：同心波纹弧线 ×3 + 中心圆（代表声波/麦克风）
3. **记者**：一个直角矩形 + 内部两条交叉线 + 右下角一个小三角箭头
4. **企业**：两个偏移重叠的圆角方块 + 一个小连接线
5. **法律**：竖直矩形 + 内部三道等距横线 + 左侧一个竖条（代表卷宗/天平简化）

### 风格参数

- `stroke-linecap="round"` + `stroke-linejoin="round"`
- 线宽 1.5px（比手绘的 2px 更细更精致）
- 颜色统一 `#D1D1D6`（浅灰，不抢文字的风头）
- 几何图形精确对齐——不故意偏移网格（和手绘风不同）
- SVG 设 `viewBox`，百分比宽度，自然响应式

---

## 动画 & 交互

| 场景 | 动画 |
|------|------|
| Hero | 无动画，图形固定（可以在图形上的小圆点加极慢 6s 呼吸） |
| 卡片 hover | `transform: translateY(-2px)` + shadow 扩展，过渡 0.2s |
| 按钮 hover | `translateY(-1px)` + shadow 扩展，过渡 0.2s |
| 上传区拖拽悬停 | 即时颜色切换（无过渡延迟） |
| 进度圆点 | 每 900ms 点亮一个，过渡 0.3s |
| 转录行 | 切换时背景 + 左侧竖线即时变化，无过渡 |
| 页面加载 | 无入场动画 |

### prefers-reduced-motion
- 所有 `transform` 和 `transition` 在 `prefers-reduced-motion: reduce` 时禁用
- 进度圆点保留变化（功能性），去掉过渡时间

---

## 实现变更清单

### 修改文件

| 文件 | 变更 |
|------|------|
| `assets/css/main.css` | 全面替换设计令牌、按钮、圆角、色彩、字体、阴影 |
| `assets/css/homepage.css` | 重写 Hero、卡片毛玻璃、场景区样式 |
| `assets/css/tool.css` | 重写上传区毛玻璃、播放器色值、转录面板、点缀色 |
| `layouts/_default/home.html` | 插画 partial 引用换新 |
| `layouts/_default/tool.html` | 文件图标路径等微调 |
| `layouts/partials/head.html` | Inter 字体替换 Rounded Mplus 1c |
| `layouts/partials/upload-zone.html` | 上传区图标 partial 换新 |

### 新增文件

| 文件 | 内容 |
|------|------|
| `layouts/partials/illustration-hero.html` | Hero 几何图形 SVG（覆盖） |
| `layouts/partials/illustration-step-1.html` | 上传步骤几何 SVG（覆盖） |
| `layouts/partials/illustration-step-2.html` | 转录步骤几何 SVG（覆盖） |
| `layouts/partials/illustration-step-3.html` | 导出步骤几何 SVG（覆盖） |
| `layouts/partials/illustration-scenes/student.html` | 学生场景几何 SVG（覆盖） |
| `layouts/partials/illustration-scenes/podcaster.html` | 播客场景几何 SVG（覆盖） |
| `layouts/partials/illustration-scenes/journalist.html` | 记者场景几何 SVG（覆盖） |
| `layouts/partials/illustration-scenes/enterprise.html` | 企业场景几何 SVG（覆盖） |
| `layouts/partials/illustration-scenes/legal.html` | 法律场景几何 SVG（覆盖） |
| `layouts/partials/illustration-tool-upload.html` | 上传区几何 SVG（覆盖） |

### 删除
- 旧手绘 SVG partial 全部覆盖（不改文件路径，内容换新）
- Rounded Mplus 1c 字体引用

---

## 不变量

- Hugo 项目结构、i18n 文件、content 文件、data 文件 — 不变
- JS 模块（upload.js, player.js, simulate.js）— 行为逻辑不变，DOM 结构不变
- 中英双语、SEO 结构 — 不变
- 播放器暗色底 — 概念保留，色值微调
- HTML 模板结构和 partial 引用路径 — 不变（只改 SVG 内容 + CSS 值）

---

## Spec Self-Review

- [x] 无 TBD/TODO，所有颜色、字体、尺寸、图形规格明确
- [x] 色彩系统内部一致：CSS token 名称与用途一一对应，无残留旧 token
- [x] 首页+工具页共享同一套色彩/字体/按钮/图形系统
- [x] 图形策略可行：抽象几何 SVG，1.5px 线宽，不依赖外部资源
- [x] 按钮、阴影、间距参数全部具体
- [x] prefers-reduced-motion 已纳入
- [x] 无过度规定，给实现留合理自由度
