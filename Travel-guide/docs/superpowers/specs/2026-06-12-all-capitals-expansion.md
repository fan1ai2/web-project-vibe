# 全部省会城市扩展设计

日期：2026-06-12
状态：已确认

## 目标

在现有 6 城基础上，新增 25 个省会城市攻略，实现覆盖中国全部 31 个省会/直辖市的完整城市矩阵。

## 首页 — "查看全部城市"

### 交互行为

- 默认展示 6 个精选城市卡片（北京/上海/广州/成都/西安/杭州），保持现有布局不变
- 下方新增一个「查看全部城市」按钮
- 点击展开：6 城卡片自动融入全部 31 城网格（避免重复），新城市以较轻量卡片展示
- 展开后按钮文案变为「收起」，点击恢复默认 6 城视图

### 展开态卡片

每张新城市卡片包含：缩略图 + 城市名 + 省份归属 + 一句话简介。与现有 6 城卡片尺寸一致，但视觉权重略低（无 accent 色条、无标签行），区分"深度攻略城市"和"基础攻略城市"。

### 数据

- `data/cities.json` 新增 25 条记录，每城标记 `featured: false`
- 已有 6 城标记 `featured: true`
- 城市卡片排序：优先 featured，其余按省份/拼音排列

## 新城市页面

### 覆盖清单

25 个新增省会/直辖市：

华北：天津、石家庄、太原、呼和浩特
东北：沈阳、长春、哈尔滨
华东：南京、合肥、福州、南昌、济南
华中：郑州、武汉、长沙
华南：南宁、海口
西南：重庆、贵阳、昆明、拉萨
西北：兰州、西宁、银川、乌鲁木齐

### 内容结构（与现有 6 城完全一致）

每城 1 个 Markdown 文件 `content/cities/<slug>.md`，包含：

- **frontmatter**: title, description, keywords, cityName, cityColor, layoutStyle: "generic", sidebarCities (5个其他城市), overview(2段), attractions(5个), food(4-5道), transport(机场+地铁+贴士), itineraries(3日+5日), faq(7条)
- 约 100 行高质量中文内容，覆盖：景点门票/交通/游玩时间、餐厅/人均/招牌菜、地铁/机场/公交、行程路线规划

### 布局模板

新增 `layoutStyle: "generic"` 对应 CSS 类 `.layout-generic`，写在 `city-pages.css` 中：

- Hero 区：站点主色渐变底 + 城市图片背景
- 景点编号圆点使用 `cityColor` 自定义色
- FAQ 展开边框、链接 hover 使用 `cityColor`
- 整体风格干净统一，不抢 6 城的专属主题风头

### 图片

每城 1 张 800×500 城市地标图，存放于 `static/images/cities/<slug>.jpg`。图片来源：Unsplash/Pexels 无版权素材。

### 数据

`data/cities.json` 每城一条记录，格式与现有保持一致：

```json
{
  "name": "南京",
  "link": "/cities/nanjing/",
  "image": "/images/cities/nanjing.jpg",
  "tags": ["六朝古都", "秦淮风情", "民国记忆"],
  "summary": "...",
  "featured": false
}
```

## 文件变更清单

| 类型 | 文件 | 说明 |
|------|------|------|
| 新增 | `content/cities/<slug>.md` ×25 | 城市 Markdown 内容 |
| 新增 | `static/images/cities/<slug>.jpg` ×25 | 城市图片 |
| 修改 | `data/cities.json` | 新增 25 条 + featured 标记 |
| 修改 | `layouts/index.html` | 展开/收起交互 + 全部城市渲染 |
| 新增 | `layouts/partials/city-sections/all-cities-grid.html` | 全部城市网格 partial |
| 修改 | `layouts/_default/single.html` | 支持 layoutStyle "generic" |
| 修改 | `static/css/city-pages.css` | 新增 `.layout-generic` 样式 |
| 修改 | `static/css/style.css` | 展开/收起按钮动画样式 |
| 新增 | `static/js/all-cities-toggle.js` | 展开/收起 JS 逻辑 |
| 修改 | `layouts/partials/footer.html` | 热门目的地列表更新 |

## 非功能约束

- 所有内容中文撰写，面向自由行游客
- 无广告、无追踪、纯静态
- 页面 LCP < 2.5s，CLS < 0.1
- 移动端 320px 断点验证，触控区域 ≥ 44×44px
- 图片 lazy loading，prefers-reduced-motion 降级动画
