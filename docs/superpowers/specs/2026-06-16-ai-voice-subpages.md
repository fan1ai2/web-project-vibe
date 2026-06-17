# AI Voice — 子页面 + 登录注册 Spec

**Date**: 2026-06-16
**Status**: Approved
**Base**: 基于 2026-06-16-ai-voice-refined-redesign.md 的设计系统

## 设计原则

延续现有 Apple-minimal 设计系统：`#F8F9FA` 底色、Inter 字体、毛玻璃卡片、微阴影、`#FF5E3A` 唯一点缀色、几何 SVG 图标。不做新风格，不引入新颜色。

---

## 页面清单

| 路由 | 页面 | 类型 | 中英双语 |
|------|------|------|----------|
| `/mp3-to-text/` | MP3 转文本 | SEO 落地页 | ✅ |
| `/mp3-to-pdf/` | MP3 转 PDF | SEO 落地页 | ✅ |
| `/youtube-to-mp4/` | YouTube 转 MP4 | SEO 落地页 | ✅ |
| `/privacy/` | 隐私政策 | 纯文本 | ✅ |
| `/terms/` | 服务条款 | 纯文本 | ✅ |
| `/login/` | 登录 | 认证 | ✅ |
| `/register/` | 注册 | 认证 | ✅ |

---

## 共享设计系统

全部沿用 `main.css` 的 CSS tokens，不新增变量：

- 底色 `--color-bg: #F8F9FA`
- 卡片 `--color-surface: rgba(255,255,255,0.72)` + `1px solid --color-surface-border` + `--shadow-sm`
- 主文字 `--color-text: #1D1D1F`
- 次文字 `--color-text-secondary: #6E6E73`
- 三级文字 `--color-text-tertiary: #86868B`
- 分割线 `--color-border: #E8E8ED`
- 点缀色 `--color-accent: #FF5E3A`
- 图标线条 `--color-icon-line: #D1D1D6`
- 字体 heading `--font-heading`，body `--font-body`

---

## 一、SEO 落地页（3 页共用模板）

### 布局结构

```
┌──────────────────────────────────────────┐
│              ~56×56 几何 SVG              │
│         标题 2.5rem / Inter 600           │
│      副标题 1.125rem / text-secondary     │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │ 亮点1  亮点2  亮点3   (横排三列)  │   │
│   │ icon   icon   icon               │   │
│   │ 标题   标题   标题                │   │
│   │ 描述   描述   描述                │   │
│   └──────────────────────────────────┘   │
│                                          │
│         [橙色 Accent CTA → 工具页]        │
└──────────────────────────────────────────┘
```

### 内容规格

| 页面 | 标题 | 副标题 | 亮点 |
|------|------|--------|------|
| MP3 转文本 | MP3 转文本 | 免费在线将 MP3 音频转换为精确文字稿，支持 90+ 语言 | 高准确率 / 秒级出稿 / 隐私安全 |
| MP3 转 PDF | MP3 转 PDF | 将 MP3 音频转录后导出为 PDF 文档，排版整洁可打印 | 智能分段 / 说话人区分 / 一键导出 |
| YouTube 转 MP4 | YouTube 转 MP4 | 免费在线 YouTube 视频下载转 MP4，高清无水印 | 多分辨率 / 高速下载 / 无需注册 |

### 亮点图标（3 个几何 SVG，56×56，1.5px #D1D1D6）

为每个落地页各配 3 个几何图标，共 9 个。放在 `layouts/partials/illustration-features/` 目录下。

| 页面 | 图标1 | 图标2 | 图标3 |
|------|-------|-------|-------|
| MP3 转文本 | 波形+对勾 | 时钟+闪电 | 锁+盾 |
| MP3 转 PDF | 文档+文字线 | 双人图标 | 下载箭头 |
| YouTube 转 MP4 | 播放三角 | 分辨率网格 | 闪电 |

### 按钮

每页底部一个 Accent CTA：`btn-accent btn-lg`，文字「立即使用」/「开始转换」，链接到 `/tool/`。

---

## 二、隐私政策 / 服务条款（2 页共用模板）

### 布局

```
┌──────────────────────────────────────────┐
│          标题 1.75rem / Inter 600         │
│        最后更新：YYYY-MM-DD (小字)        │
│                                          │
│   正文区 max-width 680px，居中            │
│   字号 0.9375rem，行高 1.7               │
│   段落间距 1.25rem                        │
│   h2: 1.25rem / 600，上间距 2rem          │
│                                          │
│   无卡片、无背景、无图标，纯文字排版       │
└──────────────────────────────────────────┘
```

### 内容

使用 Hugo content `.md` 文件编写。隐私政策包含：信息收集、使用方式、Cookie、第三方分享、数据安全、用户权利、联系方式。服务条款包含：服务描述、用户义务、知识产权、免责声明、终止条款。

---

## 三、登录页

### 布局

```
┌──────────────────────────────────────────┐
│     毛玻璃卡片，420px 宽，居中，圆角 16px  │
│                                          │
│         标题「登录」1.5rem / 600           │
│                                          │
│     ┌────────────────────────────┐       │
│     │ 📧 邮箱地址                │       │
│     └────────────────────────────┘       │
│     ┌────────────────────────────┐       │
│     │ 🔒 密码                    │       │
│     └────────────────────────────┘       │
│                                          │
│     [ 登录  ] Accent 橙色全宽按钮         │
│                                          │
│     没有账号？立即注册 →  (text-tertiary)  │
└──────────────────────────────────────────┘
```

- 输入框：`1px solid --color-border`，圆角 8px，focus 边框变 `--color-accent`
- 间距：上下 14px 内边距
- 「立即注册」链接到 `/register/`

### 表单行为（前端校验）

- 邮箱格式校验 `@` 和 `.`
- 密码不少于 6 位
- 为空时按钮禁用（opacity 0.5）
- 注：暂时无后端，点击后显示「功能即将上线」提示

---

## 四、注册页

### 布局

```
┌──────────────────────────────────────────┐
│     毛玻璃卡片，420px 宽，居中，圆角 16px  │
│                                          │
│         标题「注册」1.5rem / 600           │
│                                          │
│     ┌────────────────────────────┐       │
│     │ 📧 邮箱地址                │       │
│     └────────────────────────────┘       │
│     ┌────────────────────────────┐       │
│     │ 🔒 密码                    │       │
│     └────────────────────────────┘       │
│     ┌────────────────────────────┐       │
│     │ 🔒 确认密码                │       │
│     └────────────────────────────┘       │
│     ┌──────────────┐ ┌─────────────────┐ │
│     │ 验证码       │ │ [图片验证码占位] │ │
│     └──────────────┘ └─────────────────┘ │
│                                          │
│     [ 注册  ] Accent 橙色全宽按钮         │
│                                          │
│     已有账号？立即登录 →  (text-tertiary)  │
└──────────────────────────────────────────┘
```

### 表单行为（前端校验）

- 邮箱格式、密码 ≥6 位、确认密码匹配
- 验证码为图片验证码（预留接口，暂时显示占位图）
- 为空时按钮禁用
- 注：暂时无后端，点击后显示「功能即将上线」提示

---

## 五、导航更新

### Header 主导航

```
首页 | 转录工具 | 工具 ▾ | 登录
                  ├ MP3 转文本
                  ├ MP3 转 PDF
                  └ YouTube 转 MP4
```

- 下拉用纯 CSS `:hover` 触发，无 JS
- 下拉项 hover 背景 `rgba(0,0,0,0.04)`，圆角 6px
- 登录后显示用户名替代「登录」按钮（预留）

### Footer

```
隐私政策 | 服务条款
```

加到现有 footer-links。

---

## 六、新增 SVG 图标清单

| 位置 | 文件 | 描述 | 尺寸 |
|------|------|------|------|
| mp3-to-text 图标1 | `illustration-features/waveform-check.html` | 波形+对勾 | 56×56 |
| mp3-to-text 图标2 | `illustration-features/clock-bolt.html` | 时钟+闪电 | 56×56 |
| mp3-to-text 图标3 | `illustration-features/lock-shield.html` | 锁+盾 | 56×56 |
| mp3-to-pdf 图标1 | `illustration-features/doc-lines.html` | 文档+文字线 | 56×56 |
| mp3-to-pdf 图标2 | `illustration-features/dual-person.html` | 双人图标 | 56×56 |
| mp3-to-pdf 图标3 | `illustration-features/download-arrow.html` | 下载箭头 | 56×56 |
| youtube-to-mp4 图标1 | `illustration-features/play-triangle.html` | 播放三角 | 56×56 |
| youtube-to-mp4 图标2 | `illustration-features/resolution-grid.html` | 分辨率网格 | 56×56 |
| youtube-to-mp4 图标3 | `illustration-features/bolt.html` | 闪电 | 56×56 |
| 落地页 Hero | `illustration-landing-hero.html` | 通用几何图形 | 56×56 |

全部 1.5px 线宽，`#D1D1D6` 色，`stroke-linecap="round"` + `stroke-linejoin="round"`。

---

## 七、i18n 新增 key

在 `i18n/zh-CN.yaml` 和 `i18n/en.yaml` 新增：

```yaml
# 导航
nav_mp3_to_text: MP3 转文本
nav_mp3_to_pdf: MP3 转 PDF
nav_youtube_to_mp4: YouTube 转 MP4
nav_login: 登录
nav_register: 注册

# 落地页通用
landing_cta: 立即使用

# MP3 转文本
mp3totext_title: MP3 转文本
mp3totext_subtitle: 免费在线将 MP3 音频转换为精确文字稿，支持 90+ 语言
mp3totext_feature_1_title: 高准确率
mp3totext_feature_1_desc: 基于 Whisper 模型，识别准确率 99.8%
mp3totext_feature_2_title: 秒级出稿
mp3totext_feature_2_desc: 1 小时音频仅需 3 分钟转录
mp3totext_feature_3_title: 隐私安全
mp3totext_feature_3_desc: 本地处理，文件不离开你的浏览器

# MP3 转 PDF
mp3topdf_title: MP3 转 PDF
mp3topdf_subtitle: 将 MP3 音频转录后导出为 PDF 文档，排版整洁可打印
mp3topdf_feature_1_title: 智能分段
mp3topdf_feature_1_desc: 自动识别段落，生成结构化文档
mp3topdf_feature_2_title: 说话人区分
mp3topdf_feature_2_desc: 多人对话自动标注说话人
mp3topdf_feature_3_title: 一键导出
mp3topdf_feature_3_desc: 转录完成即出 PDF，无需手动排版

# YouTube 转 MP4
youtubetomp4_title: YouTube 转 MP4
youtubetomp4_subtitle: 免费在线 YouTube 视频下载转 MP4，高清无水印
youtubetomp4_feature_1_title: 多分辨率
youtubetomp4_feature_1_desc: 支持 360p 到 4K，按需选择
youtubetomp4_feature_2_title: 高速下载
youtubetomp4_feature_2_desc: 多线程加速，无需漫长等待
youtubetomp4_feature_3_title: 无需注册
youtubetomp4_feature_3_desc: 打开网页即可使用，无需登录

# 隐私政策
privacy_title: 隐私政策
privacy_last_updated: 最后更新

# 服务条款
terms_title: 服务条款

# 登录
login_title: 登录
login_email_placeholder: 邮箱地址
login_password_placeholder: 密码
login_btn: 登录
login_no_account: 没有账号？
login_register_link: 立即注册
login_coming_soon: 功能即将上线，敬请期待

# 注册
register_title: 注册
register_email_placeholder: 邮箱地址
register_password_placeholder: 密码（至少 6 位）
register_confirm_password_placeholder: 确认密码
register_captcha_placeholder: 验证码
register_btn: 注册
register_has_account: 已有账号？
register_login_link: 立即登录

# 通用
coming_soon: 功能即将上线，敬请期待
```

---

## 八、实现变更清单

### 新增文件

| 文件 | 说明 |
|------|------|
| `content/mp3-to-text.md` | MP3 转文本 content（zh） |
| `content/mp3-to-text.en.md` | MP3 转文本 content（en） |
| `content/mp3-to-pdf.md` | MP3 转 PDF content（zh） |
| `content/mp3-to-pdf.en.md` | MP3 转 PDF content（en） |
| `content/youtube-to-mp4.md` | YouTube 转 MP4 content（zh） |
| `content/youtube-to-mp4.en.md` | YouTube 转 MP4 content（en） |
| `content/privacy.md` | 隐私政策 content（zh） |
| `content/privacy.en.md` | 隐私政策 content（en） |
| `content/terms.md` | 服务条款 content（zh） |
| `content/terms.en.md` | 服务条款 content（en） |
| `content/login.md` | 登录 content（zh） |
| `content/login.en.md` | 登录 content（en） |
| `content/register.md` | 注册 content（zh） |
| `content/register.en.md` | 注册 content（en） |
| `layouts/_default/landing.html` | SEO 落地页模板 |
| `layouts/_default/legal.html` | 隐私/条款纯文本模板 |
| `layouts/_default/login.html` | 登录模板 |
| `layouts/_default/register.html` | 注册模板 |
| `layouts/partials/illustration-features/*.html` | 10 个特征图标 |

### 修改文件

| 文件 | 说明 |
|------|------|
| `layouts/partials/header.html` | 导航加工具下拉 + 登录入口 |
| `layouts/partials/footer.html` | 加隐私政策/服务条款链接 |
| `i18n/zh-CN.yaml` | 新增所有 i18n key |
| `i18n/en.yaml` | 新增所有 i18n key |
| `assets/css/main.css` | 加表单输入框、下拉导航样式 |

### 不变

- JS 模块不动
- 数据文件不动
- 设计 tokens 不动
- 现有页面不动

---

## Spec Self-Review

- [x] 无 TBD/TODO
- [x] 所有 7 页面布局、表单字段、校验规则明确
- [x] 色彩/字体/间距全部复用现有设计系统
- [x] 10 个 SVG 图标已列出
- [x] i18n key 完整列出
- [x] 实现文件清单精确到每个文件
- [x] 导航结构已定义
- [x] 无过度设计，纯静态 UI
