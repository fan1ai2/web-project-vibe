# AI Prompt 视觉重设计 —「独立刊物」设计规范

**日期**: 2026-06-11
**状态**: 已确认
**目标**: 在保留现有内容和功能的基础上，彻底重塑视觉风格，从"AI SaaS 通用风格"转向"独立杂志/印刷刊物"质感

---

## 一、设计理念

不再是一堆卡片网格 + 金色渐变。网站被当作一本**纸质独立刊物**来设计：

- 首页 = 封面 + 目录
- 分类列表页 = 专栏导览
- 提示词详情 = 杂志内页文章
- 工具箱 = 附录/实用手册

核心气质：**纸张的触感、印刷的秩序感、墨迹的温度**。不使用任何 AI 网站套路的元素（渐变 Hero、金色高亮、玻璃态卡片）。

---

## 二、色彩系统

告别暖白+琥珀金，全面转向纸张印刷色系：

| Token | 旧值 | 新值 | 用途 |
|-------|------|------|------|
| `--bg-primary` | `#FAF9F6` | `#FBF8F2` | 米白纸底 |
| `--bg-card` | `#FFFFFF` | `#F6F3EC` | 略深纸色卡片 |
| `--accent` | `#D4963F` | `#B8403F` | 朱墨红（印章色） |
| `--accent-deep` | `#8B5E2B` | `#8B2E2F` | 深朱墨 |
| `--accent-light` | `#F5F0E8` | `#F5EDE8` | 淡朱墨底纹 |
| `--accent-ink` | — | `#4A6670` | 靛灰（钢笔墨水色，链接/hover） |
| `--text-primary` | `#1A1A1A` | `#2C2C2C` | 炭灰（不用纯黑） |
| `--text-secondary` | `#6B6B6B` | `#7A7068` | 暖灰 |
| `--text-tertiary` | `#999999` | `#A09890` | 淡暖灰 |
| `--border` | `#E8E5DF` | `#E6DFD2` | 淡牛皮纸色 |
| `--border-light` | `#F0EDE7` | `#EFE9DE` | 更淡纸色 |
| `--success` | `#4A9C6C` | `#5B8C5A` | 墨绿（旧印泥色） |
| `--success-light` | `#E8F5EE` | `#E8F0E5` | 淡墨绿 |
| `--tag-bg` | `#F5F0E8` | `#EDE7DB` | 标签纸色 |

点睛色用朱墨红（印章/批注感），辅助用靛灰（钢笔墨水感）。整体温润克制，没有荧光色、没有纯黑。

---

## 三、字体系统

| 用途 | 字体 | 权重 |
|------|------|------|
| 大标题（封面） | Noto Serif SC | 700 |
| 段落标题 | Noto Serif SC | 700 |
| 正文 | -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif | 400 |
| Code / 提示词内容 | "JetBrains Mono", "SF Mono", Consolas, monospace | 400 |
| 装饰/编号 | Noto Serif SC | 400 |

字号阶梯（保留现有 clamp 方案，封面标题增加到 4-6vw 级别）。

---

## 四、全局氛围层

### 4.1 纸张噪点纹理

整个 body 覆盖一层极淡的噪点纹理：

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,..."); /* SVG noise */
}
```

用 SVG feTurbulence 生成噪点，opacity 0.03-0.04，不影响交互。

### 4.2 光照跟随（首页 Hero 区）

鼠标在 Hero 区域移动时，有一个极淡的光斑跟随，模拟光照在纸面上的移动：

- 用 CSS radial-gradient 跟随鼠标坐标
- opacity 极低（< 0.1），仅在 Home Hero 区域
- JS 监听 mousemove 更新 CSS 变量

### 4.3 滚动渐显

内容区滚动进入视口时，微微上浮 + 渐显（比现有 fadeInUp 更慢、更柔）：

- duration: 700ms（现有的 500ms）
- 起始 translateY: 12px（现有的 20px，更克制）
- 用 Intersection Observer 触发

---

## 五、首页布局

### 5.1 封面区（Hero 重做）

不再居中渐变背景。排版像杂志封面，标题逐词错位排列：

```
┌──────────────────────────────────┐
│                                  │
│  [左上角小字] AI PROMPT · 第1期  │
│                                  │
│  高  质  量                      │
│    中  文        提  示          │
│  AI             词  库           │
│                                  │
│           精选 100+ 条实用中文提示词│
│           覆盖 8 大场景 · 一键即用 │
│                                  │
│  ┌────────────────────────────┐  │
│  │  搜索提示词...              │  │
│  └────────────────────────────┘  │
│                                  │
│  热门：写作 / 编程 / 营销 / 设计   │
│                                  │
└──────────────────────────────────┘
```

**实现要点：**
- 标题用 CSS Grid 非对称分列（3 列不等宽），每列一个字组
- 标题带有 `::after` 伪元素做墨色错层效果（同文字略偏移，颜色更淡，在底层）
- 搜索框：宽而扁，边框像纸上的横线格
- 搜索框 focus：边框变成靛灰色，略微扩散（墨迹晕开感）
- 没有渐变背景、没有色块、没有大图标
- 光照跟随效果在此区域生效

### 5.2 分类目录区

取消 4 列卡片网格，改为杂志目录式列表：

```
┌──────────────────────────────────┐
│  目  录  CONTENTS                │
│                                  │
│  01  写作创作  ──  文章、故事、诗歌│
│  02  编程开发  ──  代码、调试、架构│
│  03  设计创意  ──  UI、品牌、排版  │
│  04  营销文案  ──  广告、社媒、邮件│
│  05  效率工具  ──  会议、邮件、数据│
│  06  学习教育  ──  课程、论文、笔记│
│  07  生活助手  ──  旅行、美食、健康│
│  08  角色扮演  ──  面试、谈判、教学│
│                                  │
│            → 浏览全部分类         │
└──────────────────────────────────┘
```

**实现要点：**
- 每行：编号（Noto Serif, 靛灰色） + 分类名 + 短横线 + 描述
- 行间用极淡横线分隔（`border-bottom: 1px solid var(--border-light)`）
- hover 时整行描述从暖灰变炭灰，编号变朱墨色
- 移动端堆叠为卡片式

### 5.3 精选提示词区

卡片保留，但改为"剪报/便签"叠放感：

- 卡片无边框，用 `box-shadow` 模拟纸张叠放阴影
- 每张卡片 `transform: rotate(var(--card-tilt))`，随机 ±0.5deg（编译时在 Hugo 中或用 CSS nth-child 模拟）
- hover 时旋转归零 + 阴影加深，像"被手指按住"
- 朱墨色分类标签（小字 + 左侧细线）
- 每卡底部有"撕纸边"效果：`border-bottom` 用 dashed 或微锯齿 SVG

### 5.4 工具箱预览区

类似精选区，但更紧凑。像杂志的"附录"板块：

- 3 列网格保留
- 图标换成简单的编号或符号（不用彩色 SVG）
- hover 时整卡微暖（背景色微变）

### 5.5 页脚

极简，像杂志版权页：
- 一行居中：`AI Prompt © 2026 — 高质量中文提示词独立刊物`
- 字号 0.8rem，颜色淡暖灰
- 上方一条淡横线

---

## 六、内页设计

### 6.1 提示词列表页（/prompts/）

侧边栏 + 主内容区结构保留，重新设计：

**侧边栏：**
- 标题"分类筛选"改为竖排"分类"二字 + 下方横线
- 当前分类高亮从纯色块改为：左侧 2px 朱墨色竖线 + 淡朱墨底纹
- 数字后缀（如"写作创作 12"）用靛灰色小字

**主内容区：**
- 标题用大号 Noto Serif SC（2rem+）
- 搜索框：在分类内实时搜索，placeholder "在当前分类中搜索..."
- 卡片：3 列便签风，薄阴影，hover 微按效果
- 分页：页码数字用印刷风格

### 6.2 提示词详情页（single prompt）

像杂志内页文章：

- 面包屑保留，分隔符用 `/` 或 `·`
- 标题用 2rem+ Noto Serif SC
- **提示词内容卡片**：左侧 3px 朱墨色竖线（杂志引用块风格），背景微纸色
- 复制按钮：朱墨色描边，hover 时填充（像印章按压）
- 标签和模型信息用小字暖灰色
- "使用方法" 区域有序号列表，行距宽松
- "相关提示词" 底部横线分隔

### 6.3 工具页

Mock UI 改为"笔记本格纸"风格：

- 输入框背景微黄 + 淡横线（模拟横线格纸），border 用淡牛皮纸色
- 输出框背景略深纸色，左边距较宽（像笔记本留白）
- 按钮用朱墨色，hover 像印章按压（微 scaling + 颜色加深）
- typewriter 光标用朱墨色

---

## 七、微交互规范

### 7.1 墨迹晕开（hover 通用）

链接和可交互元素 hover 时，颜色变化不是简单的切换，而是从靛灰 → 朱墨色过渡，模拟"墨迹慢慢渗开"：

```css
transition: color 350ms ease;
```

### 7.2 纸张按压（卡片 hover 通用）

```css
.card {
  transition: transform 250ms ease, box-shadow 250ms ease;
}
.card:hover {
  transform: scale(0.985);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
```

不是往上飘（translateY(-4px)），而是微微缩小 + 阴影加深，像被手指按住。

### 7.3 印章按压（按钮 hover）

```css
.btn-accent {
  transition: transform 150ms ease, background 200ms ease, box-shadow 200ms ease;
}
.btn-accent:hover {
  transform: scale(0.96);
  box-shadow: inset 0 0 0 2px rgba(0,0,0,0.08);
}
```

### 7.4 复制反馈

- 点击复制按钮 → 图标切换为 ✓
- 颜色从靛灰变为墨绿
- 持续 2s 后恢复
- 不做动画反馈（保持克制）

### 7.5 搜索框 focus

- 边框从淡牛皮纸色过渡到靛灰色
- `box-shadow` 扩散（不是发光，是像墨迹渗开）
- transition 350ms

### 7.6 滚动渐显

用 Intersection Observer，元素进入视口时：
- opacity: 0 → 1
- transform: translateY(12px) → translateY(0)
- duration: 700ms
- 每个元素有略微不同的 delay（靠 CSS 变量或 nth-child）

---

## 八、特效层

### 8.1 全局纸张噪点（CSS）

```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 99999;
  pointer-events: none;
  opacity: 0.035;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

### 8.2 封面区光照跟随（JS + CSS）

仅在 Hero 区域：
- JS 监听 `mousemove`，计算鼠标相对 Hero 容器的百分比位置
- 更新两个 CSS 自定义属性 `--mx` `--my`
- CSS 用 `radial-gradient(ellipse 400px 300px at calc(var(--mx)*100%) calc(var(--my)*100%), rgba(255,255,255,0.06), transparent)` 做光斑
- debounce 到 ~30fps

### 8.3 标题墨色错层（CSS only）

封面大标题的每个字组后面有一个 `::after` 伪元素：
- 相同文字
- 颜色更淡（opacity 0.15）
- 偏移 3-5px
- 像印刷时的墨迹套版不准

### 8.4 滚动渐显（Intersection Observer）

替代现有的 CSS animation + animation-delay 方案：
- JS 用 IO 监听 `.animate-in` 元素
- 进入视口 10% 时触发渐显
- 每个元素读取 `data-delay` 属性决定延迟
- `prefers-reduced-motion` 时全部跳过

---

## 九、不改变的部分

- 96 条提示词内容
- 7 个工具 Mock 功能逻辑
- 搜索/筛选/复制 JS 核心逻辑
- Hugo 目录结构
- SEO 实现（JSON-LD、meta、sitemap）
- 响应式断点策略（但视觉表现会调整）
- 所有 HTML 语义结构（仅改 CSS + 少量 JS 增强）

---

## 十、实现范围

### 阶段一：CSS 重写
- 所有 CSS 变量替换（色彩、阴影、间距微调）
- 全局纸张纹理
- 字体排印重设
- 所有组件视觉重做（header, hero, cards, sidebar, footer）

### 阶段二：首页重做
- Hero 封面式错位排版
- 分类目录列表式布局
- 卡片剪报/便签风格

### 阶段三：氛围特效
- 光照跟随（Hero 区）
- 墨迹错层标题
- 滚动渐显（Intersection Observer）
- 墨迹晕开交互
- 纸张按压 hover

### 阶段四：内页重做
- 列表页侧边栏 + 卡片
- 详情页引用块风格
- 工具页笔记本格纸风格

### 阶段五：验证
- 4 个断点验证
- 所有交互验证
- prefers-reduced-motion
- 构建验证（hugo --minify 无警告）
