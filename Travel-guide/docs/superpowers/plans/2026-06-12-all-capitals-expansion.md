# 全部省会城市扩展实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增 25 个省会城市攻略，首页添加「查看全部城市」展开/收起，统一通用布局模板。

**Architecture:** 新增 `layout-generic` CSS 主题 + 首页 JS 展开/收起 + 25 个 Markdown 城市文件 + 25 张 Unsplash 图片。所有新城市复用现有 `single.html` 模板和 6 个 section partials，通过 `layoutStyle: "generic"` 切换视觉主题。

**Tech Stack:** Hugo 0.145+ (Go templates), vanilla CSS/JS, Unsplash

---

## Phase 1: 基础设施

### Task 1: 通用城市布局 CSS

**Files:** Modify `static/css/city-pages.css`

- [ ] **Step 1: 在 city-pages.css 末尾追加 `.layout-generic` 样式**

```css
/* ===== GENERIC city layout ===== */
.layout-generic {
  --city-primary: #3B6B8F;
  --city-primary-light: #EEF3F7;
  --city-primary-dark: #2D5A73;
  --city-secondary: #E8864A;
  --city-font-heading: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  --city-radius: 8px;
}
.layout-generic .city-hero { min-height: 380px; }
.layout-generic .city-hero-bg { filter: brightness(0.7); }
.layout-generic .city-hero-content h1 {
  font-size: clamp(1.6rem, 4vw, 2.6rem);
  font-weight: 800; letter-spacing: 0.02em;
}
.layout-generic .city-hero-content .city-hero-desc { max-width: 720px; font-size: 0.95rem; line-height: 1.85; opacity: 0.9; }
.layout-generic .update-badge { background: rgba(255,255,255,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.3); }
.layout-generic .city-section h2 {
  font-size: 1.4rem; font-weight: 700; color: var(--text);
  padding-bottom: 10px; border-bottom: 3px solid var(--city-primary); display: inline-block;
}
.layout-generic .attraction-index { background: var(--city-primary); color: #fff; }
.layout-generic .faq-item { border-left: 3px solid var(--city-primary-light); }
.layout-generic .faq-item[open] { border-left-color: var(--city-primary); }
```

- [ ] **Step 2: 验证无报错** — `curl -s -o /dev/null -w "%{http_code}" http://localhost:8888/` → 200

- [ ] **Step 3: 提交**
```bash
git add static/css/city-pages.css
git commit -m "feat(css): add generic city layout theme for new capitals

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 2: 首页 — 全部城市网格 Partial

**Files:** Create `layouts/partials/city-sections/all-cities-grid.html`

- [ ] **Step 1: 创建**
```html
<div class="all-cities-section" id="all-cities-full" hidden>
  <div class="section-inner">
    <div class="section-header">
      <h2>全部 31 个省会城市</h2>
      <p>覆盖全国 8 大区域，每个城市都有专属自由行攻略</p>
    </div>
    <div class="all-cities-grid">
      {{ range .Site.Data.cities }}
      <article class="all-city-card" onclick="location.href='{{ .link }}'" role="link" tabindex="0" aria-label="{{ .name }}旅游攻略" onkeydown="if(event.key==='Enter') location.href='{{ .link }}'">
        <div class="all-city-card-img" style="background-image:url('{{ .image }}');">
          <div class="all-city-card-name">{{ .name }}</div>
          <div class="all-city-card-province">{{ .province }}</div>
        </div>
        <div class="all-city-card-body"><p>{{ .summary }}</p></div>
      </article>
      {{ end }}
    </div>
  </div>
</div>
```

- [ ] **Step 2: 提交**
```bash
git add layouts/partials/city-sections/all-cities-grid.html
git commit -m "feat: add all-cities grid partial for homepage expansion

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 3: 首页 — 展开/收起 JS

**Files:** Create `static/js/all-cities-toggle.js`

- [ ] **Step 1: 创建**
```javascript
(function () {
  var btn = document.getElementById('toggle-all-cities');
  var section = document.getElementById('all-cities-full');
  if (!btn || !section) return;
  var expanded = false;
  btn.addEventListener('click', function () {
    expanded = !expanded;
    section.hidden = !expanded;
    btn.textContent = expanded ? '收起 ▲' : '查看全部城市';
    btn.setAttribute('aria-expanded', String(expanded));
    if (expanded) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
```

- [ ] **Step 2: 提交**
```bash
git add static/js/all-cities-toggle.js
git commit -m "feat(js): add expand/collapse toggle for all cities

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 4: 首页模板 + CSS + JS 引入

**Files:** Modify `layouts/index.html`, `static/css/style.css`, `layouts/_default/baseof.html`

- [ ] **Step 1: 修改 `layouts/index.html`**

三处改动：
1. `<section class="section" id="cities">` → `<section class="section" id="cities-featured" aria-labelledby="cities-heading">`
2. `{{ range .Site.Data.cities }}` → `{{ range where .Site.Data.cities "featured" true }}`
3. 在 cities section 的 `</section>` 之后、`<section class="section" id="tips"` 之前插入：

```html

  <div class="section" style="text-align:center;padding:0 0 48px;">
    <button class="btn-toggle-all" id="toggle-all-cities" aria-expanded="false">
      查看全部城市
    </button>
  </div>

  {{ partial "city-sections/all-cities-grid.html" . }}
```

- [ ] **Step 2: 在 `static/css/style.css` 末尾追加**

```css
/* ===== All Cities Toggle & Grid ===== */
.btn-toggle-all {
  display: inline-block; padding: 14px 40px; font-size: 1.02rem; font-weight: 600;
  color: var(--primary); background: var(--white); border: 2px solid var(--primary);
  border-radius: 40px; cursor: pointer; transition: all var(--transition);
}
.btn-toggle-all:hover { background: var(--primary); color: #fff; box-shadow: 0 4px 16px rgba(59,107,143,0.25); transform: translateY(-1px); }
.btn-toggle-all:active { transform: translateY(0); }
.all-cities-section { background: var(--bg-light); padding: 64px 24px; }
.all-cities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; max-width: var(--content-width); margin: 0 auto; }
.all-city-card { background: var(--white); border-radius: var(--radius); overflow: hidden; cursor: pointer; border: 1px solid var(--border); transition: all var(--transition); }
.all-city-card:hover { border-color: var(--primary); box-shadow: var(--shadow); transform: translateY(-2px); }
.all-city-card-img { height: 120px; background-size: cover; background-position: center; position: relative; display: flex; align-items: flex-end; justify-content: space-between; padding: 12px; }
.all-city-card-img::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%); }
.all-city-card-name { position: relative; z-index: 1; color: #fff; font-weight: 700; font-size: 1.08rem; }
.all-city-card-province { position: relative; z-index: 1; color: rgba(255,255,255,0.8); font-size: 0.78rem; background: rgba(255,255,255,0.15); padding: 2px 10px; border-radius: 20px; }
.all-city-card-body { padding: 14px; }
.all-city-card-body p { font-size: 0.82rem; color: var(--text-secondary); line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
@media (max-width: 768px) {
  .all-cities-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
  .all-city-card-img { height: 90px; }
  .all-city-card-name { font-size: 0.95rem; }
}
@media (max-width: 480px) {
  .all-cities-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
}
```

- [ ] **Step 3: 在 `layouts/_default/baseof.html` 中引入 JS**

在 `<script src="/js/subscribe.js" defer></script>` 之后添加：
```html
<script src="/js/all-cities-toggle.js" defer></script>
```

- [ ] **Step 4: 验证** — `curl -s http://localhost:8888/ | grep -c 'btn-toggle-all'` → 1

- [ ] **Step 5: 提交**
```bash
git add layouts/index.html static/css/style.css layouts/_default/baseof.html
git commit -m "feat(homepage): add all-cities toggle with grid, styles, and JS

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 5: 更新 cities.json — 添加 25 城

**Files:** Modify `data/cities.json`

- [ ] **Step 1: 现有 6 城每城加 `"featured": true,` 和 `"province"` 字段**

北京 province 华北、上海 province 华东、广州 province 华南、成都 province 西南、西安 province 西北、杭州 province 华东。

- [ ] **Step 2: 在数组末尾追加 25 城**

```json
,{"name":"天津","link":"/cities/tianjin/","image":"/images/cities/tianjin.jpg","featured":false,"province":"华北","tags":["渤海明珠","万国建筑","相声曲艺"],"summary":"海河穿城而过，五大道藏着2000多栋小洋楼。天津之眼俯瞰津城、听茶馆相声、吃煎饼果子和嘎巴菜，一座适合慢逛的北方名城。"}
,{"name":"石家庄","link":"/cities/shijiazhuang/","image":"/images/cities/shijiazhuang.jpg","featured":false,"province":"华北","tags":["燕赵大地","正定古城","太行风光"],"summary":"河北省会，西倚太行。正定古城藏着隆兴寺宋代大佛，赵州桥是1400年前的工程奇迹。物价平实，适合做河北深度游的集散地。"}
,{"name":"太原","link":"/cities/taiyuan/","image":"/images/cities/taiyuan.jpg","featured":false,"province":"华北","tags":["龙城古韵","晋商文化","面食天堂"],"summary":"2500年建城史，山西博物院馆藏晋侯鸟尊，晋祠圣母殿是宋建孤例。打卤面、过油肉、头脑——太原是面食爱好者的北方重镇。"}
,{"name":"呼和浩特","link":"/cities/huhehaote/","image":"/images/cities/huhehaote.jpg","featured":false,"province":"华北","tags":["草原青城","蒙元文化","乳都"],"summary":"内蒙古首府，蒙古语意为青色的城。大召寺银佛、希拉穆仁草原一日可达。手把肉、奶茶、烧麦，草原豪情尽在一餐。"}
,{"name":"沈阳","link":"/cities/shenyang/","image":"/images/cities/shenyang.jpg","featured":false,"province":"东北","tags":["盛京旧都","工业摇篮","东北第一城"],"summary":"清朝入关前的都城，沈阳故宫是中国仅存的两座皇宫建筑群之一。铁西1905创意园是工业遗产改造的标杆。鸡架、老边饺子、锅包肉——东北菜的精华在沈阳。"}
,{"name":"长春","link":"/cities/changchun/","image":"/images/cities/changchun.jpg","featured":false,"province":"东北","tags":["北国春城","汽车之城","电影之都"],"summary":"伪满皇宫博物院讲述了末代皇帝溥仪的最后宫廷岁月，长春电影制片厂是中国电影的摇篮。净月潭森林公园距市区仅18公里。"}
,{"name":"哈尔滨","link":"/cities/haerbin/","image":"/images/cities/haerbin.jpg","featured":false,"province":"东北","tags":["东方莫斯科","冰雪王国","音乐之都"],"summary":"圣索菲亚教堂的洋葱头穹顶是哈尔滨的天际线，中央大街的面包石路走了100年。冬季冰雪大世界规模惊人，夏季松花江畔凉爽宜人。"}
,{"name":"南京","link":"/cities/nanjing/","image":"/images/cities/nanjing.jpg","featured":false,"province":"华东","tags":["六朝古都","民国记忆","秦淮风情"],"summary":"钟山风景区藏着明孝陵和中山陵，秦淮河夫子庙灯火千年不熄。鸭血粉丝汤、盐水鸭、小笼包——南京的美食自带古都的讲究。"}
,{"name":"合肥","link":"/cities/hefei/","image":"/images/cities/hefei.jpg","featured":false,"province":"华东","tags":["三国故地","科技新城","包拯故里"],"summary":"安徽省会，逍遥津公园是张辽大战孙权的古战场。中国科学技术大学和量子信息实验室让这座城市充满未来感。徽菜重油重色，李鸿章大杂烩是招牌。"}
,{"name":"福州","link":"/cities/fuzhou/","image":"/images/cities/fuzhou.jpg","featured":false,"province":"华东","tags":["榕城古韵","温泉之都","海上丝路"],"summary":"三坊七巷是中国保存最完整的里坊制街区，2200年历史沉淀在每一条石板巷里。福州鱼丸、佛跳墙、肉燕——闽菜之首的府城味道。"}
,{"name":"南昌","link":"/cities/nanchang/","image":"/images/cities/nanchang.jpg","featured":false,"province":"华东","tags":["英雄之城","滕王高阁","鄱湖明珠"],"summary":"滕王阁因王勃一句落霞与孤鹜齐飞流芳千古。八一起义纪念馆记录了军旗升起的地方。南昌拌粉配瓦罐汤，是本地人的早餐标配。"}
,{"name":"济南","link":"/cities/jinan/","image":"/images/cities/jinan.jpg","featured":false,"province":"华东","tags":["泉城风光","七十二名泉","齐鲁之都"],"summary":"趵突泉、黑虎泉、五龙潭——济南家家泉水户户垂杨。大明湖和千佛山山水相依。把子肉、油旋、甜沫，济南的市井美味藏在老商埠的巷子里。"}
,{"name":"郑州","link":"/cities/zhengzhou/","image":"/images/cities/zhengzhou.jpg","featured":false,"province":"华中","tags":["商都故城","天地之中","铁路枢纽"],"summary":"河南省会，中国八大古都之一。河南博物院馆藏贾湖骨笛等国宝级文物，距少林寺和龙门石窟均在1.5小时车程内。烩面是郑州的城市名片。"}
,{"name":"武汉","link":"/cities/wuhan/","image":"/images/cities/wuhan.jpg","featured":false,"province":"华中","tags":["九省通衢","江城百湖","过早之都"],"summary":"长江和汉江把武汉分成三镇。黄鹤楼上望江流，东湖绿道骑行，江汉路逛百年老建筑。热干面、豆皮、小龙虾——武汉的过早文化全国独一份。"}
,{"name":"长沙","link":"/cities/changsha/","image":"/images/cities/changsha.jpg","featured":false,"province":"华中","tags":["星城网红","楚汉名都","娱乐之都"],"summary":"橘子洲头的青年毛泽东雕像与岳麓山隔江相望。湖南博物院藏马王堆辛追夫人千年不腐。茶颜悦色和文和友让长沙成为年轻人的快乐星球。"}
,{"name":"南宁","link":"/cities/nanning/","image":"/images/cities/nanning.jpg","featured":false,"province":"华南","tags":["绿城水都","东盟枢纽","壮乡首府"],"summary":"广西首府，半城绿树半城楼。青秀山俯瞰邕江，三街两巷感受老南宁。老友粉酸辣鲜香、柠檬鸭开胃——南宁的夜市从晚上7点亮到凌晨2点。"}
,{"name":"海口","link":"/cities/haikou/","image":"/images/cities/haikou.jpg","featured":false,"province":"华南","tags":["椰城海滨","骑楼老街","自贸港"],"summary":"海南省会，比三亚更接地气。骑楼老街藏着下南洋的历史记忆，假日海滩傍晚的日落美得让人不想走。老爸茶、清补凉、海南粉——海口的美食节奏很慢。"}
,{"name":"重庆","link":"/cities/chongqing/","image":"/images/cities/chongqing.jpg","featured":false,"province":"西南","tags":["8D魔幻之都","山城夜景","火锅发源地"],"summary":"轻轨穿楼、洪崖洞吊脚楼、长江索道——重庆的地形创造了独一无二的城市景观。火锅沸腾的牛油香弥漫在大街小巷，小面和江湖菜同样让人上瘾。"}
,{"name":"贵阳","link":"/cities/guiyang/","image":"/images/cities/guiyang.jpg","featured":false,"province":"西南","tags":["林城避暑","大数据谷","黔味江湖"],"summary":"贵州省会，夏季平均气温23°C。甲秀楼是贵阳的地标，黔灵山公园的猕猴是市民的邻居。酸汤鱼、肠旺面、丝娃娃——贵阳的酸辣让人欲罢不能。"}
,{"name":"昆明","link":"/cities/kunming/","image":"/images/cities/kunming.jpg","featured":false,"province":"西南","tags":["春城花都","滇池风光","民族风情"],"summary":"云南省会，天气常如二三月花枝不断四时春。滇池海埂公园冬天有成群的红嘴鸥，石林是喀斯特地貌的教科书。过桥米线、汽锅鸡、野生菌——昆明是云南美食的起点站。"}
,{"name":"拉萨","link":"/cities/lasa/","image":"/images/cities/lasa.jpg","featured":false,"province":"西南","tags":["日光之城","藏传佛教","雪域圣地"],"summary":"西藏首府，海拔3650米。布达拉宫是藏式建筑的巅峰，大昭寺前磕长头的信徒让人动容。八廓街的甜茶馆里，时光慢得像酥油茶在碗里打转。"}
,{"name":"兰州","link":"/cities/lanzhou/","image":"/images/cities/lanzhou.jpg","featured":false,"province":"西北","tags":["黄河之都","丝路重镇","牛肉面之城"],"summary":"黄河穿城而过，中山桥是兰州的精神地标。甘肃省博物馆的铜奔马是国宝中的国宝。一碗牛肉面——一清二白三红四绿五黄，兰州的早晨从这碗面开始。"}
,{"name":"西宁","link":"/cities/xining/","image":"/images/cities/xining.jpg","featured":false,"province":"西北","tags":["高原夏都","塔尔古刹","青海门户"],"summary":"青海省会，海拔2261米，夏季凉爽如春。塔尔寺是藏传佛教格鲁派六大寺院之一。手抓羊肉、酿皮、甜醅——西宁的美食有高原的粗犷和回族的讲究。"}
,{"name":"银川","link":"/cities/yinchuan/","image":"/images/cities/yinchuan.jpg","featured":false,"province":"西北","tags":["塞上江南","西夏古都","回乡风情"],"summary":"宁夏首府，贺兰山挡住了腾格里沙漠的风沙。西夏王陵被称为东方金字塔，镇北堡西部影城是《大话西游》的取景地。手抓羊肉和羊杂碎是银川的味道名片。"}
,{"name":"乌鲁木齐","link":"/cities/wulumuqi/","image":"/images/cities/wulumuqi.jpg","featured":false,"province":"西北","tags":["亚心之都","天山脚下","西域风情"],"summary":"新疆首府，世界上离海洋最远的大城市。国际大巴扎的穹顶在阳光下闪耀，天山天池距市区仅110公里。大盘鸡、烤包子、手抓饭——乌鲁木齐的美食是丝绸之路的馈赠。"}
```

- [ ] **Step 2: 验证 JSON** — `python3 -m json.tool data/cities.json > /dev/null && echo "OK"` → OK

- [ ] **Step 3: 提交**
```bash
git add data/cities.json
git commit -m "feat(data): add 25 provincial capitals with featured/province fields

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Phase 2: 城市内容（7 个 Region × N 个城市）

每个城市文件结构完全一致：
- 文件名：`content/cities/<slug>.md`
- frontmatter 包含：title, description, keywords, cityName, cityColor, layoutStyle: "generic", sidebarCities (5个), overview(2段), attractions(5个景点, 含 name/price/transport/time/description), food(4-5道, 含 name/restaurant/price/description), transport(airport/metro/tips), itineraries(3日+5日), faq(7条, 含 q/a)
- 末尾 `---` 闭合 frontmatter

由于格式固定，以下任务用**城市内容规范表**指定每个城市的核心差异化数据。执行时按表填充完整 markdown。

---

### Task 6: 华北 4 城 — 天津/石家庄/太原/呼和浩特

**Files:** Create 4 markdown files

使用以下城市数据，以北京 markdown 为模板填充完整 frontmatter：

| 字段 | 天津 | 石家庄 | 太原 | 呼和浩特 |
|------|------|--------|------|----------|
| slug | tianjin | shijiazhuang | taiyuan | huhehaote |
| cityName | 天津 | 石家庄 | 太原 | 呼和浩特 |
| cityColor | #8B3A3A | #2E6B3E | #8B4513 | #3B7A57 |
| **景点1** | 天津之眼/70元/2号线 | 正定古城隆兴寺/50元/1号线 | 晋祠/80元/公交308 | 大召寺/35元/公交6路 |
| **景点2** | 五大道/免费/1号线 | 赵州桥/40元/大巴1.5h | 山西博物院/免费/公交865 | 塞上老街/免费/步行 |
| **景点3** | 意式风情区/免费/2号线 | 西柏坡/免费/大巴2h | 双塔寺/30元/公交812 | 内蒙古博物院/免费/公交3路 |
| **景点4** | 瓷房子/50元/2号线 | 河北省博/免费/3号线 | 柳巷食品街/免费/2号线 | 昭君墓/免费/公交44路 |
| **景点5** | 古文化街+天后宫/10元 | 抱犊寨+苍岩山/50-65元 | 蒙山大佛/50元/公交308 | 希拉穆仁草原/免费/自驾90km |
| **美食1** | 煎饼果子/杨姐/15元 | 驴肉火烧/高建民/25元 | 刀削面/山西会馆/40元 | 手把肉/格日勒阿妈/80元 |
| **美食2** | 狗不理包子/总店/80元 | 缸炉烧饼/燕风楼/20元 | 打卤面/认一力/30元 | 烧麦/老绥元/30元 |
| **美食3** | 耳朵眼炸糕/古文化街/15元 | 金凤扒鸡/总店/40元 | 头脑/清和元/25元 | 奶茶+炒米/赛音巴雅尔/50元 |
| **美食4** | 锅巴菜+老豆腐/大福来/25元 | 正定崩肝/古城各馆子/30元 | 过油肉/并州饭庄/50元 | 烤羊排/巴彦德勒海/120元 |
| **机场** | 滨海机场/2号线25min | 正定机场/高铁15min | 武宿机场/打车30min | 白塔机场/1号线25min |
| **地铁** | 11条线/起步2元 | 3条线/起步2元 | 2号线(1号线待开) | 2条线/起步2元 |
| **3日游核心** | 海河线→五大道→市井 | 正定→赵州桥→太行 | 晋祠→省博→蒙山 | 大召→省博→草原 |
| **5日游加** | 文化+滨海新区 | 西柏坡+自由 | 平遥一日+纯阳宫 | 哈素海+老牛湾 |

**执行说明：** 每个城市创建独立的 `.md` 文件，参考 `content/cities/beijing.md` 的 YAML frontmatter 结构。关键字段规范：attractions 每项必含 name/price/transport/time/description；food 每项必含 name/restaurant/price/description；transport 含 airport/metro/tips 三个子字段；itineraries 含 3日和5日两个数组；faq 含 7 对 q/a。文件末尾以 `---` 闭合。

**验证 & 提交：**
```bash
# 逐城验证
for city in tianjin shijiazhuang taiyuan huhehaote; do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8888/cities/$city/)
  echo "$city: $code"
done
# 期望全部 200

git add content/cities/tianjin.md content/cities/shijiazhuang.md content/cities/taiyuan.md content/cities/huhehaote.md
git commit -m "feat(cities): add Tianjin, Shijiazhuang, Taiyuan, Hohhot guides

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 7: 东北 3 城 — 沈阳/长春/哈尔滨

**Files:** Create `content/cities/shenyang.md`, `content/cities/changchun.md`, `content/cities/haerbin.md`

| 字段 | 沈阳 | 长春 | 哈尔滨 |
|------|------|------|--------|
| slug | shenyang | changchun | haerbin |
| cityName | 沈阳 | 长春 | 哈尔滨 |
| cityColor | #8B2500 | #2E5E4E | #4A6FA5 |
| **景点1** | 沈阳故宫/50元/1号线 | 伪满皇宫/70元/轻轨3号线 | 圣索菲亚教堂/20元/公交101 |
| **景点2** | 张氏帅府/60元/1号线 | 净月潭/30元/轻轨3号线 | 中央大街/免费/步行 |
| **景点3** | 铁西1905创意园/免费/1号线 | 长影世纪城/240元/轻轨 | 冰雪大世界/330元(冬季)/公交 |
| **景点4** | 北陵公园/6元/2号线 | 长春世界雕塑公园/30元 | 松花江铁路大桥/免费/公交 |
| **景点5** | 辽宁省博/免费/2号线 | 南湖公园/免费/公交 | 太阳岛/30元/轮渡 |
| **美食1** | 鸡架/老四季/15元 | 酱骨头/王记/50元 | 锅包肉/老厨家/60元 |
| **美食2** | 老边饺子/中街总店/50元 | 冷面+锅包肉/元奶奶/40元 | 哈尔滨红肠/秋林/30元 |
| **美食3** | 锅包肉/鹿鸣春/80元 | 春饼/老昌春饼/30元 | 铁锅炖/山河屯/80元 |
| **美食4** | 烤肉/韩都/70元 | 东北菜包饭/各小店/15元 | 马迭尔冰棍/中央大街/5元 |
| **机场** | 桃仙机场/2号线80min | 龙嘉机场/高铁15min到市区 | 太平机场/机场大巴20元 |
| **地铁** | 5条线/起步2元 | 3条轻轨/起步2元 | 3条线/起步2元 |
| **3日游核心** | 故宫→帅府→北陵 | 伪满皇宫→净月潭→雕塑 | 中央大街→索菲亚→太阳岛 |
| **5日游加** | 省博+铁西文创 | 长影世纪城+南湖 | 冰雪大世界(冬季)/伏尔加庄园 |

**美食1 额外：** 沈阳补充老四季拌鸡架12元/碗；长春补充元奶奶参鸡汤55元；哈尔滨补充张包铺排骨包子6元/个。

```bash
for city in shenyang changchun haerbin; do
  curl -s -o /dev/null -w "%{http_code}" http://localhost:8888/cities/$city/
done  # 期望全部 200

git add content/cities/shenyang.md content/cities/changchun.md content/cities/haerbin.md
git commit -m "feat(cities): add Shenyang, Changchun, Harbin guides

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 8: 华东 5 城 — 南京/合肥/福州/南昌/济南

**Files:** Create 5 markdown files

| 字段 | 南京 | 合肥 | 福州 | 南昌 | 济南 |
|------|------|------|------|------|------|
| slug | nanjing | hefei | fuzhou | nanchang | jinan |
| cityName | 南京 | 合肥 | 福州 | 南昌 | 济南 |
| cityColor | #8B4513 | #2E5090 | #3A6B3A | #8B2020 | #3B7A9B |
| **景点1** | 中山陵/免费预约/2号线 | 逍遥津/免费/公交 | 三坊七巷/免费/1号线 | 滕王阁/50元/1号线 | 趵突泉/40元/公交K51 |
| **景点2** | 明孝陵/70元/2号线 | 包公园/20元/公交 | 鼓山涌泉寺/40元/公交 | 八一起义纪念馆/免费/地铁 | 大明湖/免费/公交K11 |
| **景点3** | 夫子庙秦淮河/免费/3号线 | 李鸿章故居/20元/步行街 | 上下杭/免费/1号线 | 江西省博/免费/1号线 | 千佛山/30元/公交K64 |
| **景点4** | 南京博物院/免费预约/2号线 | 安徽博物院/免费/公交 | 福州国家森林公园/免费/公交 | 绳金塔/免费/地铁 | 黑虎泉/免费/步行 |
| **景点5** | 总统府/40元/2号线 | 三河古镇/免费/大巴 | 平潭岛(蓝眼泪)/免费/大巴 | 梅岭/40元/公交 | 五龙潭/5元/公交K66 |
| **美食1** | 鸭血粉丝汤/回味/30元 | 臭鳜鱼/刀板香/80元 | 福州鱼丸/永和/15元 | 南昌拌粉+瓦罐汤/周真真/15元 | 把子肉/超意兴/20元 |
| **美食2** | 盐水鸭/韩复兴/50元 | 李鸿章杂烩/同庆楼/120元 | 佛跳墙/聚春园/298元 | 藜蒿炒腊肉/民间饭店/40元 | 油旋/草包包子铺/10元 |
| **美食3** | 小笼包/鸡鸣汤包/25元 | 三河米饺/三河古镇/3元/个 | 肉燕/同利/15元 | 白糖糕/街头小摊/5元 | 甜沫/泉城老店/8元 |
| **美食4** | 皮肚面/易记/20元 | 包公鱼/徽宴楼/60元 | 锅边糊+虾酥/街边/10元 | 米粉蒸肉/家常馆子/30元 | 九转大肠/燕喜堂/80元 |
| **机场** | 禄口机场/S1号线40min | 新桥机场/大巴25元 | 长乐机场/大巴40元 | 昌北机场/大巴15元 | 遥墙机场/大巴20元 |
| **地铁** | 13条线/起步2元 | 5条线/起步2元 | 4条线/起步2元 | 4条线/起步2元 | 3条线/起步2元 |
| **3日游核心** | 钟山→夫子庙→博物院 | 逍遥津→包公园→合柴 | 三坊七巷→鼓山→上下杭 | 滕王阁→八一起义→绳金塔 | 趵突泉→大明湖→千佛山 |
| **5日游加** | 总统府+玄武湖 | 三河古镇+徽园 | 平潭岛+森林公园 | 梅岭+省博 | 黑虎泉+五龙潭+宽厚里 |

```bash
for city in nanjing hefei fuzhou nanchang jinan; do
  curl -s -o /dev/null -w "%{http_code}" http://localhost:8888/cities/$city/
done  # 期望全部 200

git add content/cities/nanjing.md content/cities/hefei.md content/cities/fuzhou.md content/cities/nanchang.md content/cities/jinan.md
git commit -m "feat(cities): add Nanjing, Hefei, Fuzhou, Nanchang, Jinan guides

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 9: 华中 3 城 — 郑州/武汉/长沙

**Files:** Create 3 markdown files

| 字段 | 郑州 | 武汉 | 长沙 |
|------|------|------|------|
| slug | zhengzhou | wuhan | changsha |
| cityName | 郑州 | 武汉 | 长沙 |
| cityColor | #B8860B | #3B6B8F | #D2691E |
| **景点1** | 河南博物院/免费/2号线 | 黄鹤楼/70元/5号线 | 橘子洲/免费/2号线 |
| **景点2** | 少林寺/80元/大巴1.5h | 东湖绿道/免费/8号线 | 岳麓山/免费/4号线 |
| **景点3** | 二七纪念塔/免费/1号线 | 江汉路/免费/2号线 | 湖南博物院/免费/6号线 |
| **景点4** | 嵩阳书院/30元/大巴 | 湖北省博/免费/4号线 | 太平街+坡子街/免费/1号线 |
| **景点5** | 黄河风景区/60元/公交 | 武汉长江大桥/免费/轮渡1.5元 | IFS国金中心/免费/2号线 |
| **美食1** | 羊肉烩面/萧记/35元 | 热干面/蔡林记/8元 | 臭豆腐/黑色经典/10元 |
| **美食2** | 胡辣汤/方中山/15元 | 豆皮/老通城/15元 | 口味虾/文和友/150元 |
| **美食3** | 黄河大鲤鱼/阿五/120元 | 排骨藕汤/亢龙太子/60元 | 剁椒鱼头/玉楼东/80元 |
| **美食4** | 桶子鸡/开封第一楼/50元 | 清蒸武昌鱼/湖锦酒楼/80元 | 茶颜悦色/遍地/18元 |
| **机场** | 新郑机场/城郊线40min | 天河机场/2号线40min | 黄花机场/6号线30min |
| **地铁** | 11条线/起步2元 | 12条线/起步2元 | 7条线/起步2元 |
| **3日游核心** | 省博→少林寺→黄河 | 黄鹤楼→东湖→江汉路 | 橘子洲→岳麓山→省博 |
| **5日游加** | 嵩阳书院+开封(40min高铁) | 省博+长江大桥+楚河汉街 | 太平街+IFS+梅溪湖 |

```bash
for city in zhengzhou wuhan changsha; do
  curl -s -o /dev/null -w "%{http_code}" http://localhost:8888/cities/$city/
done  # 期望全部 200

git add content/cities/zhengzhou.md content/cities/wuhan.md content/cities/changsha.md
git commit -m "feat(cities): add Zhengzhou, Wuhan, Changsha guides

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 10: 华南 2 城 — 南宁/海口

**Files:** Create 2 markdown files

| 字段 | 南宁 | 海口 |
|------|------|------|
| slug | nanning | haikou |
| cityName | 南宁 | 海口 |
| cityColor | #2E8B57 | #008080 |
| **景点1** | 青秀山/20元/公交 | 骑楼老街/免费/公交 |
| **景点2** | 三街两巷/免费/1号线 | 假日海滩/免费/公交 |
| **景点3** | 广西民族博物馆/免费/公交 | 火山口地质公园/60元/公交 |
| **景点4** | 南湖公园/免费/1号线 | 海南省博/免费/公交 |
| **景点5** | 扬美古镇/10元/大巴 | 冯小刚电影公社/148元/公交 |
| **美食1** | 老友粉/舒记/15元 | 海南粉/亚妹/10元 |
| **美食2** | 柠檬鸭/甘家界/80元 | 清补凉/文昌邓记/12元 |
| **美食3** | 生榨米粉/老店/10元 | 老爸茶/正方华/30元 |
| **美食4** | 酸野/街头/10元 | 白切文昌鸡/琼菜坊/80元 |
| **机场** | 吴圩机场/1号线40min | 美兰机场/高铁10min到市区 |
| **地铁** | 5条线/起步2元 | 无地铁/公交+打车 |
| **3日游核心** | 青秀山→博物馆→三街两巷 | 骑楼→假日海滩→火山口 |
| **5日游加** | 南湖+扬美古镇+酸野扫街 | 电影公社+省博+老爸茶深度 |

```bash
for city in nanning haikou; do
  curl -s -o /dev/null -w "%{http_code}" http://localhost:8888/cities/$city/
done  # 期望全部 200

git add content/cities/nanning.md content/cities/haikou.md
git commit -m "feat(cities): add Nanning, Haikou guides

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 11: 西南 4 城 — 重庆/贵阳/昆明/拉萨

**Files:** Create 4 markdown files

| 字段 | 重庆 | 贵阳 | 昆明 | 拉萨 |
|------|------|------|------|------|
| slug | chongqing | guiyang | kunming | lasa |
| cityName | 重庆 | 贵阳 | 昆明 | 拉萨 |
| cityColor | #B22222 | #228B22 | #4169E1 | #8B0000 |
| **景点1** | 洪崖洞/免费/1号线 | 甲秀楼/免费/公交 | 滇池海埂/免费/公交 | 布达拉宫/200元/步行 |
| **景点2** | 长江索道/20元/1号线 | 黔灵山/5元/公交 | 石林/130元/大巴1.5h | 大昭寺/85元/步行 |
| **景点3** | 解放碑/免费/2号线 | 花溪公园/免费/公交 | 云南民族村/90元/公交 | 八廓街/免费/步行 |
| **景点4** | 磁器口/免费/1号线 | 青岩古镇/10元/大巴 | 翠湖公园/免费/公交 | 色拉寺/50元/公交 |
| **景点5** | 南山一棵树/30元/公交 | 天河潭/60元/大巴 | 金马碧鸡坊/免费/地铁 | 纳木错/120元/包车 |
| **美食1** | 火锅/佩姐/100元 | 酸汤鱼/老凯里/80元 | 过桥米线/建新园/40元 | 甜茶/光明港琼/5元/壶 |
| **美食2** | 小面/花市碗杂/12元 | 肠旺面/金牌罗记/12元 | 汽锅鸡/福照楼/80元 | 藏面+肉饼/路边茶馆/15元 |
| **美食3** | 江湖菜/南山泉水鸡/80元 | 牛肉粉/花溪飞碗/15元 | 野生菌火锅/一朵菌/150元 | 牦牛肉/雪域餐厅/80元 |
| **美食4** | 抄手/吴抄手/18元 | 丝娃娃/丝恋/30元 | 烤饵块/街头/5元 | 藏式酸奶/古树酸奶/15元 |
| **机场** | 江北机场/10号线50min | 龙洞堡机场/1号线30min | 长水机场/6号线40min | 贡嘎机场/大巴1h/30元 |
| **地铁** | 12条线/起步2元 | 2条线/起步2元 | 6条线/起步2元 | 无地铁/公交+打车 |
| **3日游核心** | 洪崖洞→长江索道→南山 | 甲秀楼→黔灵山→花溪 | 翠湖→滇池→石林 | 八廓街→大昭寺→布达拉宫 |
| **5日游加** | 磁器口+解放碑+观音桥 | 青岩+天河潭+酸汤鱼 | 金马碧鸡+汽锅鸡+斗南花市 | 色拉寺+纳木错(1天) |
| **特殊提醒** | 穿平底鞋/轻轨穿楼看2号线李子坝 | 避暑胜地/夏季23°C | 冬天喂红嘴鸥 | 海拔3650m/提前一周吃红景天/首天别洗澡 |

```bash
for city in chongqing guiyang kunming lasa; do
  curl -s -o /dev/null -w "%{http_code}" http://localhost:8888/cities/$city/
done  # 期望全部 200

git add content/cities/chongqing.md content/cities/guiyang.md content/cities/kunming.md content/cities/lasa.md
git commit -m "feat(cities): add Chongqing, Guiyang, Kunming, Lhasa guides

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 12: 西北 4 城 — 兰州/西宁/银川/乌鲁木齐

**Files:** Create 4 markdown files

| 字段 | 兰州 | 西宁 | 银川 | 乌鲁木齐 |
|------|------|------|------|----------|
| slug | lanzhou | xining | yinchuan | wulumuqi |
| cityName | 兰州 | 西宁 | 银川 | 乌鲁木齐 |
| cityColor | #DAA520 | #3B6B8F | #CD853F | #2E8B57 |
| **景点1** | 中山桥+白塔山/免费/公交 | 塔尔寺/70元/大巴 | 西夏王陵/75元/公交 | 国际大巴扎/免费/公交 |
| **景点2** | 甘肃省博/免费/1号线 | 东关清真大寺/免费/公交 | 镇北堡西部影城/80元/大巴 | 天山天池/95元/大巴1.5h |
| **景点3** | 五泉山/免费/公交 | 青海湖(二郎剑)/90元/大巴 | 沙湖/80元/大巴 | 红山公园/免费/公交 |
| **景点4** | 水车博览园/免费/公交 | 茶卡盐湖/60元/火车+大巴 | 贺兰山岩画/70元/公交 | 新疆博物馆/免费/公交 |
| **景点5** | 黄河母亲雕塑/免费/步行 | 清真巷美食街/免费/步行 | 中华回乡文化园/60元 | 南山牧场/30元/大巴 |
| **美食1** | 牛肉面/磨沟沿/8元 | 手抓羊肉/益鑫/80元 | 手抓羊肉/国强/80元 | 大盘鸡/血站/80元 |
| **美食2** | 手抓羊肉/阿西娅/100元 | 酿皮/莫家街/8元 | 羊杂碎/阿叶/15元 | 烤包子/大巴扎/3元/个 |
| **美食3** | 烤肉+黄河啤酒/正宁路/60元 | 甜醅/街头/5元 | 羊肉臊子面/老字号/18元 | 手抓饭/五月花/50元 |
| **美食4** | 牛奶醪糟/正宁路夜市/10元 | 青海土火锅/80元 | 八宝茶/回乡文化园/15元 | 拌面(拉条子)/街头/20元 |
| **机场** | 中川机场/城际铁路40min | 曹家堡机场/大巴21元 | 河东机场/大巴20元 | 地窝堡机场/1号线30min |
| **地铁** | 2条线/起步2元 | 无地铁/公交 | 无地铁/BRT | 1条线/起步2元 |
| **3日游核心** | 中山桥→省博→白塔山 | 塔尔寺→东关→莫家街 | 西夏王陵→影城→怀远夜市 | 大巴扎→博物馆→红山 |
| **5日游加** | 五泉山+正宁路+水墨丹霞 | 青海湖+茶卡盐湖(各1天) | 沙湖+贺兰山岩画 | 天山天池+南山牧场 |
| **特殊提醒** | 牛肉面早起吃头汤 | 海拔2261m/青海湖3200m防高反 | 羊杂碎是早餐 | 和内地有时差/天黑的晚 |

```bash
for city in lanzhou xining yinchuan wulumuqi; do
  curl -s -o /dev/null -w "%{http_code}" http://localhost:8888/cities/$city/
done  # 期望全部 200

git add content/cities/lanzhou.md content/cities/xining.md content/cities/yinchuan.md content/cities/wulumuqi.md
git commit -m "feat(cities): add Lanzhou, Xining, Yinchuan, Urumqi guides

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Phase 3: 图片

### Task 13: 下载 25 张城市图片

**Files:** Create 25 × `static/images/cities/<slug>.jpg`

- [ ] **Step 1: Unsplash 搜索关键词**

| 城市 | Unsplash 搜索词 | 目标 URL pattern |
|------|----------------|-----------------|
| 天津 | tianjin skyline eye ferris wheel | tianjin.jpg |
| 石家庄 | shijiazhuang zhengding ancient temple | shijiazhuang.jpg |
| 太原 | taiyuan jinci temple shanxi | taiyuan.jpg |
| 呼和浩特 | hohhot inner mongolia temple | huhehaote.jpg |
| 沈阳 | shenyang imperial palace mukden | shenyang.jpg |
| 长春 | changchun puppet emperors palace | changchun.jpg |
| 哈尔滨 | harbin saint sophia cathedral | haerbin.jpg |
| 南京 | nanjing Confucius temple qinhuai | nanjing.jpg |
| 合肥 | hefei swan lake anhui | hefei.jpg |
| 福州 | fuzhou three lanes seven alleys | fuzhou.jpg |
| 南昌 | nanchang tengwang pavilion | nanchang.jpg |
| 济南 | jinan baotu spring darning lake | jinan.jpg |
| 郑州 | zhengzhou shaolin temple henan | zhengzhou.jpg |
| 武汉 | wuhan yellow crane tower | wuhan.jpg |
| 长沙 | changsha orange island yuelu | changsha.jpg |
| 南宁 | nanning qingxiu mountain guangxi | nanning.jpg |
| 海口 | haikou qilou old street hainan | haikou.jpg |
| 重庆 | chongqing hongyadong night | chongqing.jpg |
| 贵阳 | guiyang jiaxiu tower guizhou | guiyang.jpg |
| 昆明 | kunming dian lake spring city | kunming.jpg |
| 拉萨 | lhasa potala palace tibet | lasa.jpg |
| 兰州 | lanzhou yellow river zhongshan bridge | lanzhou.jpg |
| 西宁 | xining taer temple kumbum monastery | xining.jpg |
| 银川 | yinchuan western xia tombs ningxia | yinchuan.jpg |
| 乌鲁木齐 | urumqi tianshan grand bazaar xinjiang | wulumuqi.jpg |

- [ ] **Step 2: 使用 Unsplash Source API 下载**

```bash
#!/bin/bash
# 下载 800x500 裁剪图到 static/images/cities/
# Unsplash Source URL 格式: https://source.unsplash.com/800x500/?<keyword>
cd /root/web-project/Travel-guide/static/images/cities/

declare -A keywords=(
  ["tianjin"]="tianjin-skyline"
  ["shijiazhuang"]="zhengding-temple"
  ["taiyuan"]="taiyuan-jinci"
  # ... (以上全部 25 城)
)

for slug in "${!keywords[@]}"; do
  if [ ! -f "${slug}.jpg" ]; then
    curl -L -o "${slug}.jpg" "https://source.unsplash.com/800x500/?${keywords[$slug]}"
    echo "Downloaded: ${slug}.jpg"
  fi
done
```

⚠️ **注意：** `source.unsplash.com` 可能已弃用（Unsplash 2025年关闭了该服务）。如果不可用，改用 `https://images.unsplash.com/photo-<id>?w=800&h=500&fit=crop` 或直接从 unsplash.com 搜索下载。

备选方案：使用 Pexels API (`api.pexels.com/v1/search?query=<keyword>`)，需要免费 API key。

- [ ] **Step 3: 验证所有图片存在且尺寸合理**

```bash
for city in tianjin shijiazhuang taiyuan huhehaote shenyang changchun haerbin nanjing hefei fuzhou nanchang jinan zhengzhou wuhan changsha nanning haikou chongqing guiyang kunming lasa lanzhou xining yinchuan wulumuqi; do
  if [ -f "static/images/cities/${city}.jpg" ]; then
    dims=$(identify "static/images/cities/${city}.jpg" 2>/dev/null | awk '{print $3}')
    echo "$city: $dims"
  else
    echo "$city: MISSING"
  fi
done
```

期望：全部文件存在，尺寸接近 800×500（允许 ±200px 差异）。

- [ ] **Step 4: 提交图片**

```bash
git add static/images/cities/
git commit -m "feat(images): add 25 provincial capital hero images

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Phase 4: 最终验证

### Task 14: 全面验证

- [ ] **Step 1: 验证全部 31 城页面 200**

```bash
total=0; ok=0; fail=0
for city in beijing shanghai guangzhou chengdu xian hangzhou \
    tianjin shijiazhuang taiyuan huhehaote \
    shenyang changchun haerbin \
    nanjing hefei fuzhou nanchang jinan \
    zhengzhou wuhan changsha \
    nanning haikou \
    chongqing guiyang kunming lasa \
    lanzhou xining yinchuan wulumuqi; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8888/cities/${city}/")
  total=$((total+1))
  if [ "$code" = "200" ]; then ok=$((ok+1)); else echo "FAIL: $city → $code"; fail=$((fail+1)); fi
done
echo "Total: $total, OK: $ok, FAIL: $fail"
```
期望：Total: 31, OK: 31, FAIL: 0

- [ ] **Step 2: 验证首页展开/收起**

```bash
# 默认状态：隐藏全部城市网格
curl -s http://localhost:8888/ | grep -c 'all-cities-full.*hidden'  # 期望: 1

# 展开按钮存在
curl -s http://localhost:8888/ | grep -c 'toggle-all-cities'  # 期望: 1
```

- [ ] **Step 3: 验证 JSON-LD**

```bash
for city in tianjin wuhan chongqing; do
  echo -n "$city: "
  curl -s http://localhost:8888/cities/$city/ | grep -c 'application/ld+json'
done
# 期望: 每个城市 3 个 JSON-LD block (Article + Breadcrumb + FAQ)
```

- [ ] **Step 4: Hugo 生产构建**

```bash
cd /root/web-project/Travel-guide
hugo --minify --destination public
echo "Exit code: $?"
```
期望：Exit code: 0，无错误

- [ ] **Step 5: 验证生产构建中的城市页面**

```bash
for city in tianjin wuhan chongqing lhasa; do
  if [ -f "public/cities/${city}/index.html" ]; then
    echo "$city: OK ($(wc -c < public/cities/${city}/index.html) bytes)"
  else
    echo "$city: MISSING"
  fi
done
```
期望：全部 OK，文件大小 > 5KB

- [ ] **Step 6: 提交**

```bash
git add public/
git commit -m "chore: production build with 31 cities

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```
