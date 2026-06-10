# Six City Sub-Pages Redesign

## Overview

Redesign the six city guide sub-pages (Beijing, Shanghai, Guangzhou, Chengdu, Xi'an, Hangzhou) with unique visual identities while maintaining the warm earthy primary color system from the homepage. Each city gets its own personality through distinct color accents, typographic rhythm, decorative elements, and custom content sections.

## Technical Architecture

### Template Strategy

All six pages share `layouts/_default/single.html`. Differentiation is driven by:

1. **Frontmatter fields** in each city `.md` file — `cityColor`, `layoutStyle`, `customSections`
2. **CSS data-attribute selectors** — `[data-city="beijing"]` on `<body>` scopes per-city styles
3. **`layouts/partials/city-sections/`** — one partial per custom section, included conditionally

```
Travel-guide/
├── layouts/
│   ├── _default/
│   │   ├── single.html          # Main template (updated)
│   │   └── baseof.html          # Adds data-city attr to body
│   └── partials/
│       ├── city-hero.html       # City-specific hero banners
│       └── city-sections/
│           ├── overview.html
│           ├── attractions.html
│           ├── food.html
│           ├── transport.html
│           ├── itinerary.html
│           ├── faq.html
│           ├── beijing-axis.html       # Beijing: 中轴线漫步
│           ├── shanghai-bund.html      # Shanghai: 外滩漫步指南
│           ├── guangzhou-dimsum.html   # Guangzhou: 早茶时辰
│           ├── chengdu-teahouse.html   # Chengdu: 茶馆体验
│           ├── xian-citywall.html      # Xi'an: 城墙骑行
│           └── hangzhou-westlake.html  # Hangzhou: 西湖十景
├── static/css/
│   ├── style.css                # Base styles (updated)
│   └── city-pages.css           # Per-city styles with [data-city] scoping
└── content/cities/
    ├── beijing.md               # Updated frontmatter
    ├── shanghai.md
    ├── guangzhou.md
    ├── chengdu.md
    ├── xian.md
    └── hangzhou.md
```

### City Color Variables

Each city gets accent colors that override the neutral `--primary` in scoped contexts:

| City | Primary Accent | Secondary | CSS Class |
|------|---------------|-----------|-----------|
| Beijing | `#9B2D30` 故宫红 | `#C4A24E` 琉璃金 | `[data-city="beijing"]` |
| Shanghai | `#3B6B8F` 外滩蓝灰 | `#D4A843` 霓虹金 | `[data-city="shanghai"]` |
| Guangzhou | `#4A8C3F` 岭南绿 | `#E8C44A` 暖阳黄 | `[data-city="guangzhou"]` |
| Chengdu | `#C4823D` 辣椒橙 | `#7B9E5A` 竹青 | `[data-city="chengdu"]` |
| Xi'an | `#8B6914` 城墙土黄 | `#A04030` 唐红 | `[data-city="xian"]` |
| Hangzhou | `#5B8C5A` 龙井绿 | `#8FA0A8` 水墨灰 | `[data-city="hangzhou"]` |

### Frontmatter Schema

```yaml
cityColor: "#9B2D30"
cityColorSecondary: "#C4A24E"
layoutStyle: "magazine"   # beijing | magazine | market | teahouse | scroll | ink
customSections:
  - partial: "city-sections/beijing-axis.html"
    order: 3               # Insert after attractions
```

---

## Design Per City

### 1. Beijing — Palace Scroll `layoutStyle: "beijing"`

**Color**: 故宫红 `#9B2D30` + 琉璃金 `#C4A24E`

**Hero**: Full-bleed hero image of the Forbidden City, title centered in serif font, gold decorative line above/below. Red semi-transparent overlay instead of dark. Update badge styled as a red seal stamp (fangyin).

**Typographic rhythm**: Centered section headings with gold underline. Serif font (`Noto Serif CJK SC`) for h2/h3. Numbered attraction indices use a square seal style — gold background, red number.

**Layout**: Symmetrical single-column, wider content area. Section backgrounds alternate between white and `#FBF8F3` for rhythm. Decorative gold vertical rules flank key paragraphs.

**Custom section — 中轴线漫步**: Horizontal scroll timeline card showing 8 landmarks from Bell Tower to Yongdingmen, each with a small icon, distance marker, and one-line description. Connects with a gold horizontal line.

**Motion**: Subtle. Cards fade in on scroll, gold accent lines draw in.

---

### 2. Shanghai — Urban Magazine `layoutStyle: "magazine"`

**Color**: 外滩蓝灰 `#3B6B8F` + 霓虹金 `#D4A843`

**Hero**: Half-height hero (not full-bleed). Image on left 50%, bold title + description on right 50% over a clean white background. Title in bold sans-serif with tight letter-spacing.

**Typographic rhythm**: Magazine grid — three-column card layout for top-level sections. Sans-serif throughout (`-apple-system, PingFang SC`). Large drop-cap on overview first paragraph.

**Layout**: Variable-width sections. Full-width hero images as section dividers. Attractions in a 2-column masonry-like grid. Sidebar elevated to a horizontal "related cities" strip between sections rather than a sticky right column.

**Custom section — 外滩漫步指南**: Side-by-side split card — left half "万国建筑群" with classic architecture shots, right half "陆家嘴天际线" with modern towers. Walk route map as a simple line with stops.

**Motion**: Snappy. Cards lift on hover with a blue glow shadow. Section dividers parallax slightly.

---

### 3. Guangzhou — Arcade Market `layoutStyle: "market"`

**Color**: 岭南绿 `#4A8C3F` + 暖阳黄 `#E8C44A`

**Hero**: Warm-toned image of morning dim sum steam. Title overlays the bottom-left. Rounded corner container with generous padding. Green botanical decorative elements in corners.

**Typographic rhythm**: Friendly, rounded. Food section is the visual anchor — larger than attractions. Generous line-height (`1.9`). Tag-style labels for cuisine types.

**Layout**: Food-first hierarchy. Food items as large rounded cards (16px border-radius) with a green left-border accent, restaurant name as a warm yellow badge. Attractions simpler — clean numbered list with green dot indicators.

**Custom section — 早茶时辰**: Time-slot menu layout. Four horizontal cards for 早茶/午饭/下午茶/宵夜, each with clock icon, recommended dishes, and restaurant. Yellow-green gradient connecting line between slots.

**Motion**: Warm and inviting. Cards have a gentle scale on hover. Steam-like fade animation on hero.

---

### 4. Chengdu — Teahouse Slow `layoutStyle: "teahouse"`

**Color**: 辣椒橙 `#C4823D` + 竹青 `#7B9E5A`

**Hero**: Compact hero (50vh). Panda image as primary visual, city title secondary. Bamboo-green decorative leaves. Soft warm gradient overlay.

**Typographic rhythm**: Airy — lots of whitespace, short paragraphs, large line-height (2.0). Section headings smaller and lighter than other cities. Bamboo-green section dividers as thin horizontal rules with leaf end-cap.

**Layout**: Single column, narrow max-width (680px), centered. Each section separated by generous padding (80px+). Itinerary as a horizontal bamboo-themed timeline — circular day markers connected by a green line. Food items as small rounded cards in a 3-column grid.

**Custom section — 茶馆体验**: Two cards side by side: 鹤鸣茶社 and 其他推荐茶馆. Each with photo, address, recommended tea, and atmosphere description. Gaiwan (lidded cup) icon motifs.

**Motion**: Very slow, gentle. Cards barely lift on hover. Subtle sway animation on bamboo leaf decorations.

---

### 5. Xi'an — Tang Scroll `layoutStyle: "scroll"`

**Color**: 城墙土黄 `#8B6914` + 唐红 `#A04030`

**Hero**: Full-bleed image of the city wall or Terracotta Warriors. The hero bottom edge has a curved/arched cut (using clip-path or border-radius on the bottom). Title in bold serif, slightly tilted decorative angle brackets flanking it.

**Typographic rhythm**: Heavy, grounded. Section headings use Tang-dynasty inspired decorative elements — a small diamond shape before each number. Earthy tan background blocks behind key stats or quotes.

**Layout**: Alternating wide sections — some full-width tan background, some white. Attractions as timeline cards with a vertical earth-red rule on the left. Card borders use the tan color.

**Custom section — 城墙骑行**: A horizontal illustration-style map showing the 13.7km wall circuit with key gates (南门/北门/东门/西门) marked. Stats: duration ~2hrs, bike rental ¥45, best time late afternoon.

**Motion**: Weighted, deliberate. Cards slide up on scroll. Decorative border patterns animate in.

---

### 6. Hangzhou — Ink Wash `layoutStyle: "ink"`

**Color**: 龙井绿 `#5B8C5A` + 水墨灰 `#8FA0A8`

**Hero**: Light, ethereal hero. Image with reduced opacity overlay (0.2 black). Title in light-weight serif. Watercolor-like soft gradient wash behind the hero. Subtitle styled like a classical poem couplet.

**Typographic rhythm**: Poetic — lots of breathing room, short line lengths (max 65ch). H2 section headings in light serif with watercolor green brushstroke underline (CSS gradient). Body text slightly lighter color.

**Layout**: Single column, centered, narrow (max 640px). Generous vertical rhythm. Sidebar hidden — related cities as a simple centered text row at the bottom.

**Custom section — 西湖十景画廊**: Horizontal scrollable card row (or stacked on mobile). Ten cards, each with a poetic name (断桥残雪, 苏堤春晓...), small landscape image, and one-line description. Pagination dots.

**Motion**: Minimal, almost imperceptible. Fade transitions only. The gallery scrolls smoothly.

---

## CSS Architecture

### Scoped variables per city

```css
[data-city="beijing"] {
  --city-primary: #9B2D30;
  --city-primary-light: #F5EAEA;
  --city-secondary: #C4A24E;
  --city-font-heading: "Noto Serif CJK SC", serif;
  --city-radius: 4px;
}

[data-city="shanghai"] {
  --city-primary: #3B6B8F;
  --city-primary-light: #EEF3F7;
  --city-secondary: #D4A843;
  --city-font-heading: -apple-system, "PingFang SC", sans-serif;
  --city-radius: 0px;
}
/* ... etc */
```

### Layout mode classes

Each `layoutStyle` maps to a CSS class on the main content wrapper that controls grid, max-width, and section rhythm:

- `.layout-beijing` — single column, centered, symmetrical
- `.layout-magazine` — variable grid, magazine columns
- `.layout-market` — food-first, rounded cards
- `.layout-teahouse` — narrow centered, generous whitespace
- `.layout-scroll` — alternating wide sections
- `.layout-ink` — narrow centered, poetic spacing

---

## Implementation Order

1. Update `baseof.html` to add `data-city` attribute to `<body>`
2. Add city frontmatter fields to all 6 `.md` files (`cityColor`, `layoutStyle`, `customSections`)
3. Create `city-pages.css` with all `[data-city]` scoped styles
4. Refactor `single.html` into partials
5. Implement each city's custom section partial (content + HTML)
6. Build with Hugo and verify all pages render correctly
7. Visual QA — check responsive breakpoints (320/768/1024/1440) for every city

## Responsive Behavior

- **Desktop (1024+)**: All layout modes at full expression
- **Tablet (768-1023)**: Two-column grids collapse to one; horizontal scroll galleries remain but with snap points
- **Mobile (<768)**: Single column all cities; custom sections stack vertically; horizontal scrolls become vertical stacks; reduced decorative elements

## Motion Policy

All animations respect `prefers-reduced-motion: reduce`. By city:
- Beijing/Shanghai: Subtle scroll-triggered fade-ins
- Guangzhou: Gentle hover scales on food cards
- Chengdu: Very slow, barely perceptible transitions
- Xi'an: Weighted slide-ups
- Hangzhou: Fade only, no movement
