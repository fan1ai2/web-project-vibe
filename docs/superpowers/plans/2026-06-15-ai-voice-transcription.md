# AI Voice Transcription Frontend — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a frontend-only Hugo static site at `/root/web-project/AI voice/` replicating SoundWise.ai's homepage and transcription tool page with bilingual (zh-CN/en) support.

**Architecture:** Hugo-native content-driven approach. Hugo handles routing, i18n, SEO meta, and page structure. Vanilla JS handles three interactive modules: file upload UX, audio player with transcript sync, and simulated transcription flow. CSS custom properties manage the design token system.

**Tech Stack:** Hugo (static site generator), vanilla HTML/CSS/JS, system font stack

---

### Task 1: Project Scaffold

**Files:**
- Create: `AI voice/hugo.toml`
- Create: `AI voice/.gitignore`
- Create: directories (via mkdir)

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p "/root/web-project/AI voice"/{content/{en,zh-CN},i18n,layouts/{_default,partials},assets/{css,js},data,static/images}
```

- [ ] **Step 2: Write hugo.toml**

```toml
baseURL = "https://soundwise.ai/"
defaultContentLanguage = "zh-CN"
defaultContentLanguageInSubdir = true
title = "SoundWise AI - Free Unlimited Audio to Text Transcription"

[languages.zh-CN]
  languageCode = "zh-CN"
  languageName = "简体中文"
  weight = 1
  title = "SoundWise AI - 免费无限制 AI 音频转文字"

[languages.en]
  languageCode = "en"
  languageName = "English"
  weight = 2
  title = "SoundWise AI - Free Unlimited AI Audio to Text Transcription"
```

- [ ] **Step 3: Write .gitignore**

```
public/
.hugo_build.lock
resources/
```

- [ ] **Step 4: Commit**

```bash
cd "/root/web-project/AI voice" && git add hugo.toml .gitignore && git commit -m "$(cat <<'EOF'
chore: scaffold Hugo project with i18n config for AI voice

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: i18n Translation Files

**Files:**
- Create: `AI voice/i18n/zh-CN.yaml`
- Create: `AI voice/i18n/en.yaml`

- [ ] **Step 1: Write zh-CN.yaml**

```yaml
# Navigation
nav_home: 首页
nav_tool: 转录工具
cta_start: 免费试用
lang_switch: English

# Hero
hero_title: 免费无限制 AI 音频转文字
hero_subtitle: 基于 OpenAI Whisper，99.8% 准确率，90+ 语言
hero_desc: 上传音频或视频文件，秒级获取精准逐字稿。所有处理在本地完成，隐私安全无忧。
hero_cta: 立即免费转录

# Features
feature_accuracy_title: 99.8% 准确率
feature_accuracy_desc: 基于最新 Whisper 模型，即使在嘈杂环境下也能精准识别语音内容。
feature_languages_title: 90+ 语言支持
feature_languages_desc: 自动检测语言，支持中文、英语、日语等全球主流语言。
feature_privacy_title: 本地处理，隐私安全
feature_privacy_desc: 所有转录在浏览器本地完成，文件不会上传到任何服务器。
feature_interactive_title: 交互式校对播放器
feature_interactive_desc: 点击任意文字即可跳转播放，文字与音频深度同步，校对效率提升 70%。

# Steps
step_upload_title: 上传文件
step_upload_desc: 拖拽或选择音频/视频文件，支持 MP3、WAV、M4A、MP4、MOV 等主流格式。
step_transcribe_title: AI 自动转录
step_transcribe_desc: Whisper 模型在浏览器本地运行，秒级生成带时间戳的精准逐字稿。
step_export_title: 校对并导出
step_export_desc: 交互式播放器边听边校，一键导出为 TXT、PDF、DOCX 或 SRT 字幕。

# Use Cases
usecase_students_title: 学生
usecase_students_desc: 将课堂讲座录音转为学习笔记，搜索定位知识点。
usecase_podcasters_title: 播客创作者
usecase_podcasters_desc: 快速生成节目文字稿、字幕和 Show Notes。
usecase_journalists_title: 记者
usecase_journalists_desc: 访谈录音一键转文字，精确引用，提升写稿效率。
usecase_enterprise_title: 企业培训
usecase_enterprise_desc: 会议录像转为可搜索的 PDF 培训手册。
usecase_legal_title: 法律行业
usecase_legal_desc: 证据视频生成带时间戳的文字档案，便于检索归档。

# Pricing
pricing_free_name: 免费版
pricing_free_price: 免费
pricing_free_f1: 无限本地转录
pricing_free_f2: 90+ 语言支持
pricing_free_f3: 说话人识别
pricing_free_f4: 导出 TXT / DOCX / SRT
pricing_free_f5: 约 10 分钟/小时音频
pricing_free_cta: 开始使用

pricing_pro_name: 专业版
pricing_pro_price: $20/月
pricing_pro_f1: 一切免费版功能
pricing_pro_f2: 无限云端转录
pricing_pro_f3: 10x 加速处理
pricing_pro_f4: 云端存储历史记录
pricing_pro_f5: 约 30 秒/小时音频
pricing_pro_cta: 升级 Pro

# FAQ
faq_q1: 转录真的免费吗？
faq_a1: 是的，本地转录模式完全免费且无限制。我们通过 Pro 版的云端加速服务盈利，免费版用户不受影响。
faq_q2: 文件上传到哪里？
faq_a2: 在免费模式下，所有文件都在浏览器本地处理，不会上传到任何服务器。你的文件始终只存在于你的设备上。
faq_q3: 支持哪些文件格式？
faq_a3: 音频格式包括 MP3、WAV、M4A、AAC、FLAC、OGG、AMR 等；视频格式包括 MP4、MOV、MKV、AVI 等。
faq_q4: 转录准确率如何？
faq_a4: 基于 OpenAI Whisper 模型，在清晰录音条件下准确率可达 99.8%。支持自动语言检测，也能处理一定程度的背景噪音。
faq_q5: 支持多说话人识别吗？
faq_a5: 是的，系统会自动检测并标注不同说话人，在转录结果中以不同颜色区分显示。
faq_q6: 文件大小有限制吗？
faq_a6: 建议上传 4 小时以内的文件以获得最佳体验。没有硬性大小限制，但过大的文件可能导致浏览器处理缓慢。

# Tool Page
tool_title: AI 转录工具
tool_desc: 上传音频或视频，秒级获取精准逐字稿
upload_drop_text: 拖拽音频/视频文件到此处
upload_browse: 点击浏览
upload_format_hint: 支持 MP3、WAV、M4A、AAC、MP4、MOV、MKV 等格式
upload_file_selected: 已选择
upload_duration: 时长
upload_size: 大小
btn_transcribe: 开始转录
btn_browse: 选择文件
status_detecting: 正在识别语言…
status_transcribing: AI 转写中…
status_timestamps: 生成时间戳…
status_complete: 转录完成

player_play: 播放
player_pause: 暂停
player_speed: 速度
player_volume: 音量

transcript_empty: 上传文件并开始转录，逐字稿将在此显示
transcript_speaker: 说话人

export_txt: 导出 TXT
export_docx: 导出 DOCX
export_pdf: 导出 PDF
export_srt: 导出 SRT

privacy_badge: 本地处理 — 文件不会上传到服务器

# Footer
footer_tagline: 基于 OpenAI Whisper 的免费在线转录工具。隐私优先，无限使用。
footer_copyright: SoundWise AI. 保留所有权利。
footer_privacy: 隐私政策
footer_terms: 使用条款

# Formats
format_audio_title: 音频格式
format_video_title: 视频格式
```

- [ ] **Step 2: Write en.yaml**

```yaml
nav_home: Home
nav_tool: Transcription
cta_start: Try Free
lang_switch: 中文

hero_title: Free Unlimited AI Audio to Text
hero_subtitle: Powered by OpenAI Whisper, 99.8% accuracy, 90+ languages
hero_desc: Upload audio or video files, get accurate transcripts in seconds. All processing happens locally — your privacy is guaranteed.
hero_cta: Transcribe for Free

feature_accuracy_title: 99.8% Accuracy
feature_accuracy_desc: Powered by the latest Whisper model, accurately recognizes speech even in noisy environments.
feature_languages_title: 90+ Languages
feature_languages_desc: Auto-detects language, supporting Chinese, English, Japanese and major global languages.
feature_privacy_title: Local Processing, Full Privacy
feature_privacy_desc: All transcription happens in your browser. Files are never uploaded to any server.
feature_interactive_title: Interactive Proofing Player
feature_interactive_desc: Click any word to jump to that point in the audio. Deep text-audio sync improves proofing efficiency by 70%.

step_upload_title: Upload File
step_upload_desc: Drag & drop or select audio/video files. Supports MP3, WAV, M4A, MP4, MOV and more.
step_transcribe_title: AI Auto Transcription
step_transcribe_desc: Whisper model runs locally in your browser, generating timestamped transcripts in seconds.
step_export_title: Proofread & Export
step_export_desc: Listen and proofread with the interactive player. Export as TXT, PDF, DOCX, or SRT subtitles.

usecase_students_title: Students
usecase_students_desc: Turn lecture recordings into searchable study notes.
usecase_podcasters_title: Podcasters
usecase_podcasters_desc: Generate show notes, subtitles, and transcripts instantly.
usecase_journalists_title: Journalists
usecase_journalists_desc: Convert interview recordings to text for accurate quoting.
usecase_enterprise_title: Enterprise
usecase_enterprise_desc: Turn meeting recordings into searchable PDF training manuals.
usecase_legal_title: Legal
usecase_legal_desc: Generate timestamped text archives from evidence videos for discovery.

pricing_free_name: Free
pricing_free_price: Free
pricing_free_f1: Unlimited local transcription
pricing_free_f2: 90+ language support
pricing_free_f3: Speaker identification
pricing_free_f4: Export TXT / DOCX / SRT
pricing_free_f5: ~10 min per hour of audio
pricing_free_cta: Get Started

pricing_pro_name: Pro
pricing_pro_price: $20/mo
pricing_pro_f1: Everything in Free
pricing_pro_f2: Unlimited cloud transcription
pricing_pro_f3: 10x faster processing
pricing_pro_f4: Cloud storage & history
pricing_pro_f5: ~30 sec per hour of audio
pricing_pro_cta: Upgrade to Pro

faq_q1: Is transcription really free?
faq_a1: Yes, local transcription is completely free and unlimited. We monetize through the Pro cloud acceleration tier — free users are unaffected.
faq_q2: Where are my files uploaded?
faq_a2: In Free mode, all processing happens locally in your browser. Your files never leave your device.
faq_q3: What file formats are supported?
faq_a3: Audio: MP3, WAV, M4A, AAC, FLAC, OGG, AMR. Video: MP4, MOV, MKV, AVI.
faq_q4: How accurate is the transcription?
faq_a4: Up to 99.8% accuracy with clear audio, powered by OpenAI Whisper. Handles background noise and auto-detects language.
faq_q5: Does it support multiple speakers?
faq_a5: Yes, the system automatically detects and labels different speakers, shown in different colors in the transcript.
faq_q6: Is there a file size limit?
faq_a6: We recommend files under 4 hours for best performance. There is no hard limit, but very large files may slow browser processing.

tool_title: AI Transcription
tool_desc: Upload audio or video, get accurate transcripts in seconds
upload_drop_text: Drop audio/video files here
upload_browse: click to browse
upload_format_hint: Supports MP3, WAV, M4A, AAC, MP4, MOV, MKV and more
upload_file_selected: Selected
upload_duration: Duration
upload_size: Size
btn_transcribe: Start Transcribing
btn_browse: Choose File
status_detecting: Detecting language…
status_transcribing: AI transcribing…
status_timestamps: Generating timestamps…
status_complete: Transcription complete

player_play: Play
player_pause: Pause
player_speed: Speed
player_volume: Volume

transcript_empty: Upload a file and start transcribing. Transcript will appear here.
transcript_speaker: Speaker

export_txt: Export TXT
export_docx: Export DOCX
export_pdf: Export PDF
export_srt: Export SRT

privacy_badge: Local Processing — Files never uploaded to servers

footer_tagline: A free online transcription tool powered by OpenAI Whisper. Privacy-first, unlimited use.
footer_copyright: SoundWise AI. All rights reserved.
footer_privacy: Privacy Policy
footer_terms: Terms of Service

format_audio_title: Audio Formats
format_video_title: Video Formats
```

- [ ] **Step 3: Commit**

```bash
cd "/root/web-project/AI voice" && git add i18n/ && git commit -m "$(cat <<'EOF'
feat: add i18n translation files for zh-CN and en

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Data Files

**Files:**
- Create: `AI voice/data/transcript_sample.json`
- Create: `AI voice/data/site.json`

- [ ] **Step 1: Write transcript sample JSON**

```json
{
  "title": "AI in Healthcare: Deep Learning for Medical Imaging",
  "segments": [
    { "start": 0, "end": 4.2, "speaker": 1, "text": "今天我们来讨论人工智能在医疗领域的应用前景。" },
    { "start": 4.5, "end": 9.8, "speaker": 2, "text": "是的，首先我们需要了解深度学习模型是如何处理医学影像的。" },
    { "start": 10.1, "end": 15.3, "speaker": 1, "text": "没错，特别是卷积神经网络在CT扫描和MRI图像分析中表现出色。" },
    { "start": 15.8, "end": 22.0, "speaker": 2, "text": "根据最新研究，AI辅助诊断系统的准确率已经达到95%以上，在某些特定领域甚至超过了人类放射科医生。" },
    { "start": 22.5, "end": 29.1, "speaker": 1, "text": "这确实令人印象深刻。但我们需要考虑数据隐私和模型可解释性的问题。" },
    { "start": 29.5, "end": 36.3, "speaker": 2, "text": "你说得对。联邦学习是一个很好的解决方案，它允许模型在保护患者数据隐私的同时进行训练。" },
    { "start": 36.8, "end": 43.5, "speaker": 1, "text": "另外，迁移学习也大大降低了医疗AI模型对大规模标注数据的依赖。" },
    { "start": 44.0, "end": 50.2, "speaker": 2, "text": "是的，通过预训练的视觉模型进行微调，我们可以在较小的医疗数据集上取得很好的效果。" },
    { "start": 50.8, "end": 57.4, "speaker": 1, "text": "展望未来，多模态AI系统将整合影像、病历、基因组学等多种数据源。" },
    { "start": 58.0, "end": 64.5, "speaker": 2, "text": "这将实现真正的精准医疗，为每位患者提供个性化的诊断和治疗方案。" }
  ]
}
```

- [ ] **Step 2: Write site data JSON**

```json
{
  "features": ["accuracy", "languages", "privacy", "interactive"],
  "steps": ["upload", "transcribe", "export"],
  "usecases": ["students", "podcasters", "journalists", "enterprise", "legal"],
  "formats_audio": ["MP3", "WAV", "M4A", "AAC", "FLAC", "OGG", "AMR"],
  "formats_video": ["MP4", "MOV", "MKV", "AVI"],
  "faq_items": ["q1", "q2", "q3", "q4", "q5", "q6"],
  "transcript_statuses": ["detecting", "transcribing", "timestamps", "complete"]
}
```

- [ ] **Step 3: Commit**

```bash
cd "/root/web-project/AI voice" && git add data/ && git commit -m "$(cat <<'EOF'
feat: add transcript sample and site structure data

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Content Files

**Files:**
- Create: `AI voice/content/_index.md`
- Create: `AI voice/content/tool.md`
- Create: `AI voice/content/zh-CN/_index.md`
- Create: `AI voice/content/zh-CN/tool.md`
- Create: `AI voice/content/en/_index.md`
- Create: `AI voice/content/en/tool.md`

- [ ] **Step 1: Write default homepage (_index.md)**

```markdown
---
title: SoundWise AI - 免费无限制 AI 音频转文字
description: 基于 OpenAI Whisper 的免费在线音频/视频转文字工具。99.8% 准确率，90+ 语言支持，隐私安全，本地处理。
keywords:
  - AI 转文字
  - 语音转文字
  - 音频转录
  - Whisper
  - 免费转录工具
type: homepage
---
```

- [ ] **Step 2: Write default tool page (tool.md)**

```markdown
---
title: AI 转录工具 - 上传音频视频秒级转文字
description: 上传音频或视频文件，AI 自动转录为带时间戳的逐字稿。支持 MP3/WAV/MP4/MOV 等格式，免费无限制。
keywords:
  - 在线转录
  - 音频转文字
  - 视频转文字
  - 语音识别
type: tool
layout: tool
---
```

- [ ] **Step 3: Write zh-CN homepage**

```markdown
---
title: SoundWise AI - 免费无限制 AI 音频转文字
description: 基于 OpenAI Whisper 的免费在线音频/视频转文字工具。99.8% 准确率，90+ 语言支持，隐私安全，本地处理。
keywords:
  - AI 转文字
  - 语音转文字
  - 音频转录
  - Whisper
  - 免费转录工具
type: homepage
---
```

- [ ] **Step 4: Write zh-CN tool page**

```markdown
---
title: AI 转录工具 - 上传音频视频秒级转文字
description: 上传音频或视频文件，AI 自动转录为带时间戳的逐字稿。支持 MP3/WAV/MP4/MOV 等格式，免费无限制。
keywords:
  - 在线转录
  - 音频转文字
  - 视频转文字
  - 语音识别
type: tool
layout: tool
---
```

- [ ] **Step 5: Write en homepage**

```markdown
---
title: SoundWise AI - Free Unlimited AI Audio to Text Transcription
description: Free online audio/video to text tool powered by OpenAI Whisper. 99.8% accuracy, 90+ languages, privacy-first local processing.
keywords:
  - AI transcription
  - speech to text
  - audio to text
  - free transcription
  - Whisper
type: homepage
---
```

- [ ] **Step 6: Write en tool page**

```markdown
---
title: AI Transcription Tool - Upload Audio & Video, Get Instant Transcripts
description: Upload audio or video files, AI auto-generates timestamped transcripts. Supports MP3/WAV/MP4/MOV. Free & unlimited.
keywords:
  - online transcription
  - audio to text
  - video to text
  - speech recognition
type: tool
layout: tool
---
```

- [ ] **Step 7: Commit**

```bash
cd "/root/web-project/AI voice" && git add content/ && git commit -m "$(cat <<'EOF'
feat: add bilingual content pages with SEO frontmatter

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Base Layout + Head Partial

**Files:**
- Create: `AI voice/layouts/_default/baseof.html`
- Create: `AI voice/layouts/partials/head.html`

- [ ] **Step 1: Write baseof.html**

```html
<!DOCTYPE html>
<html lang="{{ .Site.Language.Lang }}">
<head>
  {{ partial "head.html" . }}
</head>
<body>
  {{ partial "header.html" . }}
  <main>
    {{ block "main" . }}{{ end }}
  </main>
  {{ partial "footer.html" . }}
  {{ block "scripts" . }}{{ end }}
</body>
</html>
```

- [ ] **Step 2: Write head.html**

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="{{ .Params.description | default .Site.Params.description }}">
<meta name="keywords" content="{{ delimit .Params.keywords ", " }}">
<title>{{ .Params.title }}</title>

<!-- Open Graph -->
<meta property="og:title" content="{{ .Params.title }}">
<meta property="og:description" content="{{ .Params.description }}">
<meta property="og:type" content="website">
<meta property="og:locale" content="{{ .Site.Language.Lang }}">

<!-- Canonical -->
<link rel="canonical" href="{{ .Permalink }}">

<!-- Alternate hreflang -->
{{ if .IsTranslated }}
  {{ range .Translations }}
<link rel="alternate" hreflang="{{ .Lang }}" href="{{ .Permalink }}">
  {{ end }}
{{ end }}

<link rel="icon" type="image/svg+xml" href="/images/favicon.svg">

{{ $main := resources.Get "css/main.css" | minify | fingerprint }}
<link rel="stylesheet" href="{{ $main.RelPermalink }}">
{{ if eq .Params.type "homepage" }}
  {{ $home := resources.Get "css/homepage.css" | minify | fingerprint }}
<link rel="stylesheet" href="{{ $home.RelPermalink }}">
{{ end }}
{{ if eq .Params.type "tool" }}
  {{ $tool := resources.Get "css/tool.css" | minify | fingerprint }}
<link rel="stylesheet" href="{{ $tool.RelPermalink }}">
{{ end }}
```

- [ ] **Step 3: Commit**

```bash
cd "/root/web-project/AI voice" && git add layouts/ && git commit -m "$(cat <<'EOF'
feat: add base layout and SEO head partial

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Header and Footer Partials

**Files:**
- Create: `AI voice/layouts/partials/header.html`
- Create: `AI voice/layouts/partials/footer.html`

- [ ] **Step 1: Write header.html**

```html
<header class="site-header">
  <div class="header-inner container">
    <a href="{{ "/" | relLangURL }}" class="logo">
      <svg class="logo-icon" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#4F46E5"/>
        <path d="M8 14.5C8 12.015 10.015 10 12.5 10V10C14.985 10 17 12.015 17 14.5V16H8V14.5Z" fill="white" opacity="0.9"/>
        <path d="M15 16V18.5C15 20.985 17.015 23 19.5 23V23C21.985 23 24 20.985 24 18.5V16H15Z" fill="white" opacity="0.7"/>
        <path d="M8 18H15V20H10C8.895 20 8 19.105 8 18Z" fill="white" opacity="0.5"/>
      </svg>
      <span class="logo-text">SoundWise</span>
    </a>
    <nav class="main-nav" aria-label="Main navigation">
      <a href="{{ "/" | relLangURL }}">{{ i18n "nav_home" }}</a>
      <a href="{{ "tool" | relLangURL }}">{{ i18n "nav_tool" }}</a>
    </nav>
    <div class="header-actions">
      <a href="{{ "tool" | relLangURL }}" class="btn btn-primary btn-sm">{{ i18n "cta_start" }}</a>
      <div class="lang-switch">
        {{ range .Site.Languages }}
          {{ if ne .Lang $.Site.Language.Lang }}
            <a href="{{ $.RelPermalink | replaceRE (printf "^/%s/" $.Site.Language.Lang) (printf "/%s/" .Lang) | relURL }}" class="lang-link">
              {{ .Params.languageName }}
            </a>
          {{ end }}
        {{ end }}
      </div>
    </div>
  </div>
</header>
```

- [ ] **Step 2: Write footer.html**

```html
<footer class="site-footer">
  <div class="footer-inner container">
    <div class="footer-brand">
      <span class="footer-logo">SoundWise</span>
      <p class="footer-tagline">{{ i18n "footer_tagline" }}</p>
    </div>
    <div class="footer-links">
      <a href="{{ "tool" | relLangURL }}">{{ i18n "nav_tool" }}</a>
      <a href="#">{{ i18n "footer_privacy" }}</a>
      <a href="#">{{ i18n "footer_terms" }}</a>
    </div>
    <p class="footer-copy">&copy; 2026 {{ i18n "footer_copyright" }}</p>
  </div>
</footer>
```

- [ ] **Step 3: Commit**

```bash
cd "/root/web-project/AI voice" && git add layouts/partials/ && git commit -m "$(cat <<'EOF'
feat: add header and footer partials with i18n

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Main CSS (Design Tokens + Shared Styles)

**Files:**
- Create: `AI voice/assets/css/main.css`

- [ ] **Step 1: Write main.css**

```css
/* === Design Tokens === */
:root {
  --color-primary: #4F46E5;
  --color-primary-light: #6366F1;
  --color-primary-dark: #4338CA;
  --color-primary-gradient: linear-gradient(135deg, #4F46E5, #7C3AED);
  --color-accent: #10B981;
  --color-accent-light: #D1FAE5;
  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-text: #0F172A;
  --color-text-body: #475569;
  --color-text-muted: #94A3B8;
  --color-border: #E2E8F0;
  --color-player-bg: #1E293B;
  --color-player-text: #E2E8F0;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-card-hover: 0 4px 12px rgba(0,0,0,0.12);
  --shadow-lg: 0 10px 40px rgba(0,0,0,0.12);
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans SC", sans-serif;
  --max-width: 1200px;
}

/* === Reset === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body {
  font-family: var(--font-family);
  color: var(--color-text-body);
  background: var(--color-bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
a { color: var(--color-primary); text-decoration: none; }
a:hover { color: var(--color-primary-dark); }
img { max-width: 100%; display: block; }
ul { list-style: none; }

/* === Container === */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
}

/* === Buttons === */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-family);
  font-weight: 600;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  white-space: nowrap;
}
.btn-primary {
  background: var(--color-primary);
  color: #fff;
  padding: 12px 28px;
  font-size: 1rem;
}
.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-card-hover);
}
.btn-sm { padding: 8px 16px; font-size: 0.875rem; }
.btn-lg { padding: 16px 36px; font-size: 1.125rem; }
.btn-outline {
  background: transparent;
  border-color: var(--color-border);
  color: var(--color-text-body);
  padding: 10px 24px;
  font-size: 0.875rem;
}
.btn-outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* === Section === */
.section { padding: 80px 0; }
.section-header {
  text-align: center;
  margin-bottom: 48px;
}
.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 12px;
}
.section-desc {
  font-size: 1.125rem;
  color: var(--color-text-body);
  max-width: 640px;
  margin: 0 auto;
}

/* === Header === */
.site-header {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.logo { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 1.25rem; color: var(--color-text); }
.logo:hover { color: var(--color-primary); }
.logo-icon { flex-shrink: 0; }
.main-nav { display: flex; gap: 32px; }
.main-nav a { color: var(--color-text-body); font-weight: 500; font-size: 0.9375rem; }
.main-nav a:hover { color: var(--color-primary); }
.header-actions { display: flex; align-items: center; gap: 16px; }
.lang-link { font-size: 0.8125rem; color: var(--color-text-muted); font-weight: 500; padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
.lang-link:hover { color: var(--color-primary); border-color: var(--color-primary); }

/* === Footer === */
.site-footer {
  background: var(--color-text);
  color: var(--color-text-muted);
  padding: 48px 0 32px;
}
.footer-inner { display: flex; flex-direction: column; gap: 24px; }
.footer-brand { display: flex; flex-direction: column; gap: 8px; }
.footer-logo { font-weight: 700; font-size: 1.125rem; color: #fff; }
.footer-tagline { font-size: 0.875rem; }
.footer-links { display: flex; gap: 24px; }
.footer-links a { color: var(--color-text-muted); font-size: 0.875rem; }
.footer-links a:hover { color: #fff; }
.footer-copy { font-size: 0.8125rem; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); }

/* === Utility === */
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* === Responsive === */
@media (max-width: 768px) {
  .container { padding: 0 16px; }
  .section { padding: 48px 0; }
  .section-title { font-size: 1.5rem; }
  .main-nav { display: none; }
  .header-inner { height: 56px; }
}
```

- [ ] **Step 2: Commit**

```bash
cd "/root/web-project/AI voice" && git add assets/css/main.css && git commit -m "$(cat <<'EOF'
feat: add main CSS with design tokens, reset, and shared styles

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Homepage Layout + CSS

**Files:**
- Create: `AI voice/layouts/_default/home.html`
- Create: `AI voice/assets/css/homepage.css`

- [ ] **Step 1: Write home.html**

```html
{{ define "main" }}

<!-- Hero -->
<section class="hero">
  <div class="container">
    <h1 class="hero-title">{{ i18n "hero_title" }}</h1>
    <p class="hero-subtitle">{{ i18n "hero_subtitle" }}</p>
    <p class="hero-desc">{{ i18n "hero_desc" }}</p>
    <a href="{{ "tool" | relLangURL }}" class="btn btn-primary btn-lg">{{ i18n "hero_cta" }}</a>
  </div>
</section>

<!-- Features -->
<section class="section" id="features">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">核心功能</h2>
      <p class="section-desc">一切你需要的转录能力，都在这里。</p>
    </div>
    <div class="features-grid">
      {{ range .Site.Data.site.features }}
      <div class="feature-card">
        <div class="feature-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#EEF2FF"/>
            {{ if eq . "accuracy" }}
            <path d="M20 10l5 15H15l5-15zm0 0v25m-9-12l9 9 9-9" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            {{ else if eq . "languages" }}
            <circle cx="20" cy="20" r="12" stroke="#4F46E5" stroke-width="2"/><path d="M12 20h16M20 12c3 4 3 12 0 16-3-4-3-12 0-16" stroke="#4F46E5" stroke-width="1.5"/>
            {{ else if eq . "privacy" }}
            <rect x="12" y="16" width="16" height="12" rx="2" stroke="#4F46E5" stroke-width="2"/><circle cx="20" cy="14" r="3" stroke="#4F46E5" stroke-width="2"/><path d="M20 22v3" stroke="#4F46E5" stroke-width="2" stroke-linecap="round"/>
            {{ else }}
            <rect x="10" y="12" width="20" height="16" rx="2" stroke="#4F46E5" stroke-width="2"/><path d="M18 22l3 3 6-6" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            {{ end }}
          </svg>
        </div>
        <h3 class="feature-title">{{ i18n (printf "feature_%s_title" .) }}</h3>
        <p class="feature-desc">{{ i18n (printf "feature_%s_desc" .) }}</p>
      </div>
      {{ end }}
    </div>
  </div>
</section>

<!-- How It Works -->
<section class="section steps-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">如何使用</h2>
      <p class="section-desc">三步完成音频转文字，简单高效。</p>
    </div>
    <div class="steps-grid">
      {{ range $i, $step := .Site.Data.site.steps }}
      <div class="step-card">
        <div class="step-number">{{ add $i 1 }}</div>
        <h3 class="step-title">{{ i18n (printf "step_%s_title" $step) }}</h3>
        <p class="step-desc">{{ i18n (printf "step_%s_desc" $step) }}</p>
      </div>
      {{ end }}
    </div>
  </div>
</section>

<!-- Supported Formats -->
<section class="section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">支持的格式</h2>
      <p class="section-desc">覆盖主流音频和视频格式，无需预先转换。</p>
    </div>
    <div class="formats-block">
      <div class="format-group">
        <h3 class="format-group-title">{{ i18n "format_audio_title" }}</h3>
        <div class="format-tags">
          {{ range .Site.Data.site.formats_audio }}
          <span class="format-tag">{{ . }}</span>
          {{ end }}
        </div>
      </div>
      <div class="format-group">
        <h3 class="format-group-title">{{ i18n "format_video_title" }}</h3>
        <div class="format-tags">
          {{ range .Site.Data.site.formats_video }}
          <span class="format-tag">{{ . }}</span>
          {{ end }}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Use Cases -->
<section class="section steps-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">应用场景</h2>
      <p class="section-desc">无论你是谁，AI 转录都能提升工作效率。</p>
    </div>
    <div class="usecases-grid">
      {{ range .Site.Data.site.usecases }}
      <div class="usecase-card">
        <h3 class="usecase-title">{{ i18n (printf "usecase_%s_title" .) }}</h3>
        <p class="usecase-desc">{{ i18n (printf "usecase_%s_desc" .) }}</p>
      </div>
      {{ end }}
    </div>
  </div>
</section>

<!-- Pricing -->
<section class="section" id="pricing">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">定价方案</h2>
      <p class="section-desc">选择适合你的方案，随时升级。</p>
    </div>
    <div class="pricing-grid">
      <div class="pricing-card">
        <h3 class="pricing-name">{{ i18n "pricing_free_name" }}</h3>
        <div class="pricing-price">{{ i18n "pricing_free_price" }}</div>
        <ul class="pricing-features">
          {{ range seq 1 5 }}
          <li>{{ i18n (printf "pricing_free_f%d" .) }}</li>
          {{ end }}
        </ul>
        <a href="{{ "tool" | relLangURL }}" class="btn btn-outline pricing-cta">{{ i18n "pricing_free_cta" }}</a>
      </div>
      <div class="pricing-card pricing-card-featured">
        <h3 class="pricing-name">{{ i18n "pricing_pro_name" }}</h3>
        <div class="pricing-price">{{ i18n "pricing_pro_price" }}</div>
        <ul class="pricing-features">
          {{ range seq 1 5 }}
          <li>{{ i18n (printf "pricing_pro_f%d" .) }}</li>
          {{ end }}
        </ul>
        <a href="#" class="btn btn-primary pricing-cta">{{ i18n "pricing_pro_cta" }}</a>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section steps-section" id="faq">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">常见问题</h2>
    </div>
    <div class="faq-list">
      {{ range .Site.Data.site.faq_items }}
      <details class="faq-item">
        <summary class="faq-question">{{ i18n (printf "faq_%s" .) }}</summary>
        <p class="faq-answer">{{ i18n (printf "faq_a%s" .) }}</p>
      </details>
      {{ end }}
    </div>
  </div>
</section>

{{ end }}
```

- [ ] **Step 2: Write homepage.css**

```css
/* === Hero === */
.hero {
  background: var(--color-primary-gradient);
  padding: 100px 0 80px;
  text-align: center;
  color: #fff;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%);
  pointer-events: none;
}
.hero .container { position: relative; z-index: 1; }
.hero-title {
  font-size: 2.75rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}
.hero-subtitle {
  font-size: 1.25rem;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 16px;
}
.hero-desc {
  font-size: 1.0625rem;
  opacity: 0.75;
  max-width: 560px;
  margin: 0 auto 32px;
  line-height: 1.7;
}
.hero .btn-primary {
  background: #fff;
  color: var(--color-primary);
  border: none;
}
.hero .btn-primary:hover {
  background: rgba(255,255,255,0.9);
  color: var(--color-primary-dark);
}

/* === Features Grid === */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.feature-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 32px 24px;
  text-align: center;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.feature-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
.feature-icon { margin-bottom: 16px; display: flex; justify-content: center; }
.feature-title { font-size: 1.0625rem; font-weight: 700; color: var(--color-text); margin-bottom: 8px; }
.feature-desc { font-size: 0.875rem; color: var(--color-text-body); line-height: 1.6; }

/* === Steps === */
.steps-section { background: var(--color-surface); }
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.step-card {
  text-align: center;
  padding: 32px 20px;
}
.step-number {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: var(--color-primary-gradient);
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.step-title { font-size: 1.125rem; font-weight: 700; color: var(--color-text); margin-bottom: 8px; }
.step-desc { font-size: 0.9375rem; color: var(--color-text-body); }

/* === Formats === */
.formats-block { max-width: 800px; margin: 0 auto; }
.format-group { margin-bottom: 24px; }
.format-group-title { font-size: 0.875rem; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
.format-tags { display: flex; flex-wrap: wrap; gap: 10px; }
.format-tag {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 10px 20px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text);
  font-family: "SF Mono", "Fira Code", "Cascadia Code", monospace;
}

/* === Use Cases === */
.usecases-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}
.usecase-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 28px 20px;
  text-align: center;
  transition: box-shadow 0.2s ease;
}
.usecase-card:hover { box-shadow: var(--shadow-card-hover); }
.usecase-title { font-size: 1rem; font-weight: 700; color: var(--color-text); margin-bottom: 8px; }
.usecase-desc { font-size: 0.8125rem; color: var(--color-text-body); line-height: 1.5; }

/* === Pricing === */
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(2, 380px);
  gap: 24px;
  justify-content: center;
  max-width: 820px;
  margin: 0 auto;
}
.pricing-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 40px 32px;
  text-align: center;
}
.pricing-card-featured {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
  position: relative;
}
.pricing-card-featured::before {
  content: "推荐";
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 100px;
}
.pricing-name { font-size: 1.25rem; font-weight: 700; color: var(--color-text); margin-bottom: 12px; }
.pricing-price { font-size: 2.5rem; font-weight: 800; color: var(--color-text); margin-bottom: 24px; }
.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  text-align: left;
}
.pricing-features li {
  padding: 8px 0;
  font-size: 0.9375rem;
  color: var(--color-text-body);
  display: flex;
  align-items: center;
  gap: 8px;
}
.pricing-features li::before {
  content: "✓";
  color: var(--color-accent);
  font-weight: 700;
  flex-shrink: 0;
}
.pricing-cta { width: 100%; }

/* === FAQ === */
.faq-list { max-width: 720px; margin: 0 auto; }
.faq-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: 12px;
  overflow: hidden;
}
.faq-question {
  padding: 18px 24px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.faq-question::after {
  content: "+";
  font-size: 1.25rem;
  color: var(--color-text-muted);
  transition: transform 0.2s;
}
.faq-item[open] .faq-question::after {
  content: "−";
  transform: rotate(0);
}
.faq-answer {
  padding: 0 24px 20px;
  font-size: 0.9375rem;
  color: var(--color-text-body);
  line-height: 1.7;
}

/* === Responsive === */
@media (max-width: 1024px) {
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .usecases-grid { grid-template-columns: repeat(3, 1fr); }
  .pricing-grid { grid-template-columns: 1fr; max-width: 400px; }
}
@media (max-width: 768px) {
  .hero { padding: 60px 0 48px; }
  .hero-title { font-size: 2rem; }
  .hero-subtitle { font-size: 1.0625rem; }
  .features-grid { grid-template-columns: 1fr; }
  .steps-grid { grid-template-columns: 1fr; gap: 16px; }
  .usecases-grid { grid-template-columns: repeat(2, 1fr); }
}
```

- [ ] **Step 3: Commit**

```bash
cd "/root/web-project/AI voice" && git add layouts/_default/home.html assets/css/homepage.css && git commit -m "$(cat <<'EOF'
feat: add homepage layout with hero, features, steps, pricing, FAQ

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Tool Page Layout + Partials

**Files:**
- Create: `AI voice/layouts/_default/tool.html`
- Create: `AI voice/layouts/partials/upload-zone.html`
- Create: `AI voice/layouts/partials/audio-player.html`
- Create: `AI voice/layouts/partials/transcript-panel.html`
- Create: `AI voice/layouts/partials/export-bar.html`

- [ ] **Step 1: Write tool.html**

```html
{{ define "main" }}

<section class="tool-section">
  <div class="container">
    <div class="tool-header">
      <h1 class="tool-title">{{ i18n "tool_title" }}</h1>
      <p class="tool-desc">{{ i18n "tool_desc" }}</p>
    </div>

    {{ partial "upload-zone.html" . }}
    {{ partial "audio-player.html" . }}
    {{ partial "transcript-panel.html" . }}
    {{ partial "export-bar.html" . }}

    <div class="privacy-badge">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1L2 4v5c0 3.5 2.5 6 6 7 3.5-1 6-3.5 6-7V4L8 1z"/>
      </svg>
      {{ i18n "privacy_badge" }}
    </div>
  </div>
</section>

{{ end }}

{{ define "scripts" }}
<script src="/js/upload.js"></script>
<script src="/js/player.js"></script>
<script src="/js/simulate.js"></script>
{{ end }}
```

- [ ] **Step 2: Write upload-zone.html**

```html
<div class="upload-area" id="uploadArea">
  <input type="file" id="fileInput" class="upload-input" accept="audio/*,video/*,.mp3,.wav,.m4a,.aac,.flac,.ogg,.amr,.mp4,.mov,.mkv,.avi">

  <div class="upload-initial" id="uploadInitial">
    <div class="upload-icon">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="8" width="40" height="32" rx="4" stroke="#94A3B8" stroke-width="2"/>
        <path d="M4 14h40M16 24l6-6 6 6M24 18v14" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <p class="upload-text">{{ i18n "upload_drop_text" }}</p>
    <p class="upload-text-secondary">{{ i18n "upload_format_hint" }}</p>
    <label for="fileInput" class="btn btn-outline upload-browse-btn">{{ i18n "btn_browse" }}</label>
  </div>

  <div class="upload-selected" id="uploadSelected" style="display:none">
    <div class="file-info">
      <div class="file-icon">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill="#EEF2FF"/>
          <path d="M12 10h10l6 6v14a2 2 0 01-2 2H12a2 2 0 01-2-2V12a2 2 0 012-2z" stroke="#4F46E5" stroke-width="2"/>
          <path d="M22 10v6h6" stroke="#4F46E5" stroke-width="2"/>
        </svg>
      </div>
      <div class="file-details">
        <span class="file-name" id="fileName"></span>
        <span class="file-meta"><span id="fileDuration"></span> &middot; <span id="fileSize"></span></span>
      </div>
    </div>
    <button class="btn btn-primary" id="btnTranscribe">{{ i18n "btn_transcribe" }}</button>
  </div>

  <div class="upload-progress" id="uploadProgress" style="display:none">
    <div class="progress-bar-track">
      <div class="progress-bar-fill" id="progressBar"></div>
    </div>
    <p class="progress-status" id="progressStatus">{{ i18n "status_detecting" }}</p>
  </div>
</div>
```

- [ ] **Step 3: Write audio-player.html**

```html
<div class="player-bar" id="playerBar" style="display:none">
  <audio id="audioElement" preload="metadata"></audio>
  <div class="player-controls">
    <button class="player-btn" id="btnPlay" aria-label="Play">
      <svg id="iconPlay" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M6 4l12 6-12 6V4z"/></svg>
      <svg id="iconPause" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="display:none"><rect x="4" y="3" width="4" height="14" rx="1"/><rect x="12" y="3" width="4" height="14" rx="1"/></svg>
    </button>
    <div class="player-times">
      <span class="player-time" id="timeCurrent">00:00</span>
      <span class="player-separator">/</span>
      <span class="player-time player-time-total" id="timeTotal">00:00</span>
    </div>
    <div class="player-seek" id="seekBar">
      <div class="seek-track">
        <div class="seek-progress" id="seekProgress"></div>
      </div>
      <div class="seek-thumb" id="seekThumb"></div>
    </div>
    <div class="player-speed">
      <label class="speed-label" for="speedSelect">{{ i18n "player_speed" }}</label>
      <select id="speedSelect" class="speed-select">
        <option value="0.5">0.5x</option>
        <option value="0.75">0.75x</option>
        <option value="1" selected>1x</option>
        <option value="1.5">1.5x</option>
        <option value="2">2x</option>
      </select>
    </div>
  </div>
</div>
```

- [ ] **Step 4: Write transcript-panel.html**

```html
<div class="transcript-panel" id="transcriptPanel" style="display:none">
  <div class="transcript-empty" id="transcriptEmpty">
    <p>{{ i18n "transcript_empty" }}</p>
  </div>
  <div class="transcript-content" id="transcriptContent" style="display:none">
    <h3 class="transcript-title" id="transcriptTitle"></h3>
    <div class="transcript-segments" id="transcriptSegments">
      <!-- JS populates segments here -->
    </div>
  </div>
</div>
```

- [ ] **Step 5: Write export-bar.html**

```html
<div class="export-bar" id="exportBar" style="display:none">
  <span class="export-label">导出格式：</span>
  <button class="btn btn-outline export-btn" data-format="txt">{{ i18n "export_txt" }}</button>
  <button class="btn btn-outline export-btn" data-format="docx">{{ i18n "export_docx" }}</button>
  <button class="btn btn-outline export-btn" data-format="pdf">{{ i18n "export_pdf" }}</button>
  <button class="btn btn-outline export-btn" data-format="srt">{{ i18n "export_srt" }}</button>
</div>
```

- [ ] **Step 6: Commit**

```bash
cd "/root/web-project/AI voice" && git add layouts/_default/tool.html layouts/partials/ && git commit -m "$(cat <<'EOF'
feat: add tool page layout with upload, player, transcript, export partials

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Tool Page CSS

**Files:**
- Create: `AI voice/assets/css/tool.css`

- [ ] **Step 1: Write tool.css**

```css
/* === Tool Header === */
.tool-section { padding: 48px 0 80px; }
.tool-header { text-align: center; margin-bottom: 40px; }
.tool-title { font-size: 2rem; font-weight: 700; color: var(--color-text); margin-bottom: 8px; }
.tool-desc { font-size: 1.0625rem; color: var(--color-text-body); }

/* === Upload Area === */
.upload-area {
  max-width: 700px;
  margin: 0 auto 32px;
  background: var(--color-surface);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-xl);
  padding: 48px 24px;
  text-align: center;
  transition: border-color 0.2s, background 0.2s;
  position: relative;
}
.upload-area.drag-over {
  border-color: var(--color-primary);
  background: #EEF2FF;
}
.upload-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.upload-icon { margin-bottom: 16px; display: flex; justify-content: center; }
.upload-text { font-size: 1.125rem; font-weight: 600; color: var(--color-text); margin-bottom: 8px; }
.upload-text-secondary { font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 20px; }
.upload-browse-btn { cursor: pointer; }

/* File Info (after selection) */
.file-info { display: flex; align-items: center; gap: 16px; text-align: left; margin-bottom: 24px; }
.file-details { display: flex; flex-direction: column; gap: 4px; }
.file-name { font-weight: 600; color: var(--color-text); font-size: 0.9375rem; }
.file-meta { font-size: 0.8125rem; color: var(--color-text-muted); }
#btnTranscribe { margin: 0 auto; display: inline-flex; }

/* Progress */
.progress-bar-track {
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 16px;
}
.progress-bar-fill {
  height: 100%;
  width: 0%;
  background: var(--color-primary-gradient);
  border-radius: 3px;
  transition: width 0.3s ease;
}
.progress-status { font-size: 0.875rem; color: var(--color-text-body); font-weight: 500; }

/* === Player === */
.player-bar {
  max-width: 700px;
  margin: 0 auto 24px;
  background: var(--color-player-bg);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
}
.player-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--color-player-text);
}
.player-btn {
  background: none;
  border: none;
  color: var(--color-player-text);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 36px; height: 36px;
  transition: background 0.15s;
}
.player-btn:hover { background: rgba(255,255,255,0.1); }
.player-times { display: flex; align-items: center; gap: 4px; font-size: 0.8125rem; font-family: "SF Mono", "Fira Code", monospace; white-space: nowrap; }
.player-separator { color: var(--color-text-muted); }
.player-time-total { color: var(--color-text-muted); }
.player-seek {
  flex: 1;
  position: relative;
  height: 28px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.seek-track {
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}
.seek-progress {
  height: 100%;
  width: 0%;
  background: var(--color-primary);
  border-radius: 2px;
  transition: width 0.1s linear;
}
.player-speed { display: flex; align-items: center; gap: 6px; }
.speed-label { font-size: 0.75rem; color: var(--color-text-muted); }
.speed-select {
  background: rgba(255,255,255,0.1);
  color: var(--color-player-text);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  font-size: 0.8125rem;
  cursor: pointer;
  font-family: var(--font-family);
}

/* === Transcript Panel === */
.transcript-panel {
  max-width: 700px;
  margin: 0 auto 24px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 32px;
  min-height: 200px;
}
.transcript-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--color-text-muted);
  font-size: 0.9375rem;
}
.transcript-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}
.transcript-segments { display: flex; flex-direction: column; gap: 4px; }
.transcript-segment {
  display: flex;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.15s;
  border-left: 3px solid transparent;
}
.transcript-segment:hover { background: #F8FAFC; }
.transcript-segment.active {
  background: #EEF2FF;
  border-left-color: var(--color-primary);
}
.segment-time {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-family: "SF Mono", "Fira Code", monospace;
  white-space: nowrap;
  padding-top: 2px;
  min-width: 48px;
}
.segment-body { flex: 1; }
.segment-speaker {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 2px;
}
.segment-speaker.speaker-2 { color: #7C3AED; }
.segment-text { font-size: 0.9375rem; color: var(--color-text); line-height: 1.65; }
.segment-word {
  cursor: pointer;
  border-radius: 2px;
  transition: background 0.1s;
}
.segment-word:hover { background: rgba(79,70,229,0.15); }
.segment-word.active { background: rgba(79,70,229,0.25); }

/* === Export Bar === */
.export-bar {
  max-width: 700px;
  margin: 0 auto 32px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.export-label { font-size: 0.875rem; font-weight: 600; color: var(--color-text-body); }
.export-btn { font-size: 0.8125rem; padding: 8px 16px; }

/* === Privacy Badge === */
.privacy-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--color-accent);
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 12px 24px;
  background: var(--color-accent-light);
  border-radius: 100px;
  width: fit-content;
  margin: 0 auto;
}

/* === Responsive === */
@media (max-width: 768px) {
  .player-controls { flex-wrap: wrap; gap: 10px; }
  .player-seek { order: 10; width: 100%; }
  .transcript-panel { padding: 20px 16px; }
  .transcript-segment { flex-direction: column; gap: 4px; }
}
```

- [ ] **Step 2: Commit**

```bash
cd "/root/web-project/AI voice" && git add assets/css/tool.css && git commit -m "$(cat <<'EOF'
feat: add tool page CSS with upload, player, transcript, export styles

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: JavaScript Modules

**Files:**
- Create: `AI voice/assets/js/upload.js`
- Create: `AI voice/assets/js/player.js`
- Create: `AI voice/assets/js/simulate.js`

- [ ] **Step 1: Write upload.js**

```javascript
(function () {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  const uploadInitial = document.getElementById('uploadInitial');
  const uploadSelected = document.getElementById('uploadSelected');
  const uploadProgress = document.getElementById('uploadProgress');
  const btnTranscribe = document.getElementById('btnTranscribe');
  const btnPlay = document.getElementById('btnPlay');
  const audio = document.getElementById('audioElement');
  const playerBar = document.getElementById('playerBar');
  const exportBar = document.getElementById('exportBar');
  const transcriptPanel = document.getElementById('transcriptPanel');
  const transcriptContent = document.getElementById('transcriptContent');
  const transcriptEmpty = document.getElementById('transcriptEmpty');
  const transcriptTitle = document.getElementById('transcriptTitle');
  const transcriptSegments = document.getElementById('transcriptSegments');
  const progressBar = document.getElementById('progressBar');
  const progressStatus = document.getElementById('progressStatus');

  let selectedFile = null;

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  function formatSize(bytes) {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function handleFile(file) {
    if (!file) return;
    selectedFile = file;
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatSize(file.size);

    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = function () {
      document.getElementById('fileDuration').textContent = formatTime(audio.duration);
    };

    uploadInitial.style.display = 'none';
    uploadSelected.style.display = 'block';
  }

  fileInput.addEventListener('change', function (e) {
    handleFile(e.target.files[0]);
  });

  uploadArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', function () {
    uploadArea.classList.remove('drag-over');
  });

  uploadArea.addEventListener('drop', function (e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
  });

  btnTranscribe.addEventListener('click', function () {
    if (!selectedFile) return;
    uploadSelected.style.display = 'none';
    uploadProgress.style.display = 'block';

    var statuses = ['status_detecting', 'status_transcribing', 'status_timestamps', 'status_complete'];
    var i = 0;
    var statusInterval = setInterval(function () {
      if (i >= statuses.length) {
        clearInterval(statusInterval);
        uploadProgress.style.display = 'none';
        playerBar.style.display = 'block';
        transcriptPanel.style.display = 'block';
        transcriptEmpty.style.display = 'none';
        transcriptContent.style.display = 'block';
        exportBar.style.display = 'flex';

        // Populate transcript from simulated data
        if (typeof window.SoundWiseSimulate !== 'undefined') {
          window.SoundWiseSimulate.loadTranscript();
        }
        // Enable seek bar
        if (typeof window.SoundWisePlayer !== 'undefined') {
          window.SoundWisePlayer.init();
        }
        return;
      }

      var key = statuses[i];
      progressStatus.textContent = getI18n(key);
      var pct = ((i + 1) / statuses.length) * 100;
      progressBar.style.width = pct + '%';

      // On last step, go to 95% instead of 100% for smooth finish
      if (i === statuses.length - 2) {
        progressBar.style.width = '85%';
      }

      i++;
    }, 900);

    // Complete to 100%
    setTimeout(function () {
      progressBar.style.width = '100%';
    }, statuses.length * 900);
  });

  function getI18n(key) {
    var map = {
      status_detecting: '正在识别语言…',
      status_transcribing: 'AI 转写中…',
      status_timestamps: '生成时间戳…',
      status_complete: '转录完成'
    };
    return map[key] || key;
  }
})();
```

- [ ] **Step 2: Write player.js**

```javascript
(function () {
  var audio, btnPlay, iconPlay, iconPause, timeCurrent, timeTotal, seekBar, seekProgress, speedSelect;
  var initCalled = false;

  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function init() {
    if (initCalled) return;
    initCalled = true;

    audio = document.getElementById('audioElement');
    btnPlay = document.getElementById('btnPlay');
    iconPlay = document.getElementById('iconPlay');
    iconPause = document.getElementById('iconPause');
    timeCurrent = document.getElementById('timeCurrent');
    timeTotal = document.getElementById('timeTotal');
    seekBar = document.getElementById('seekBar');
    seekProgress = document.getElementById('seekProgress');
    speedSelect = document.getElementById('speedSelect');

    audio.addEventListener('loadedmetadata', function () {
      timeTotal.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', function () {
      timeCurrent.textContent = formatTime(audio.currentTime);
      var pct = (audio.currentTime / audio.duration) * 100 || 0;
      seekProgress.style.width = pct + '%';

      // Highlight active segment
      if (typeof window.SoundWiseSimulate !== 'undefined') {
        window.SoundWiseSimulate.highlightSegment(audio.currentTime);
      }
    });

    btnPlay.addEventListener('click', function () {
      if (audio.paused) {
        audio.play();
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
      } else {
        audio.pause();
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
      }
    });

    audio.addEventListener('ended', function () {
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    });

    seekBar.addEventListener('click', function (e) {
      var rect = seekBar.getBoundingClientRect();
      var pct = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pct * audio.duration;
    });

    speedSelect.addEventListener('change', function () {
      audio.playbackRate = parseFloat(this.value);
    });
  }

  window.SoundWisePlayer = { init: init };
})();
```

- [ ] **Step 3: Write simulate.js**

```javascript
(function () {
  var segments = [];
  var activeSegmentIdx = -1;
  var audio = document.getElementById('audioElement');

  function loadTranscript() {
    var container = document.getElementById('transcriptSegments');
    var titleEl = document.getElementById('transcriptTitle');

    // Fetch fake transcript data from Hugo data file
    fetch('/data/transcript_sample.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        segments = data.segments;
        titleEl.textContent = data.title;
        renderSegments();
      })
      .catch(function () {
        // Fallback: use inline data for Hugo built output
        fetch('/transcript_sample.json')
          .then(function (r) { return r.json(); })
          .then(function (d) {
            segments = d.segments;
            titleEl.textContent = d.title;
            renderSegments();
          });
      });
  }

  function renderSegments() {
    var container = document.getElementById('transcriptSegments');
    var html = '';
    segments.forEach(function (seg, idx) {
      var wordsHtml = seg.text.split('').map(function (ch) {
        return '<span class="segment-word" data-seg="' + idx + '">' + ch + '</span>';
      }).join('');

      html += '<div class="transcript-segment" data-seg="' + idx + '" data-start="' + seg.start + '">' +
        '<span class="segment-time">' + formatTime(seg.start) + '</span>' +
        '<div class="segment-body">' +
          '<div class="segment-speaker speaker-' + seg.speaker + '">Speaker ' + seg.speaker + '</div>' +
          '<p class="segment-text">' + wordsHtml + '</p>' +
        '</div>' +
      '</div>';
    });
    container.innerHTML = html;

    // Click handler: click segment or word → seek
    container.addEventListener('click', function (e) {
      var segEl = e.target.closest('.transcript-segment');
      if (segEl) {
        var t = parseFloat(segEl.getAttribute('data-start'));
        if (!isNaN(t) && audio) {
          audio.currentTime = t;
          if (audio.paused) audio.play();
          document.getElementById('iconPlay').style.display = 'none';
          document.getElementById('iconPause').style.display = 'block';
        }
      }
    });
  }

  function highlightSegment(currentTime) {
    var newIdx = -1;
    for (var i = 0; i < segments.length; i++) {
      if (currentTime >= segments[i].start && currentTime <= segments[i].end) {
        newIdx = i;
        break;
      }
    }
    if (newIdx === activeSegmentIdx) return;

    var allSegs = document.querySelectorAll('.transcript-segment');
    allSegs.forEach(function (el) { el.classList.remove('active'); });

    if (newIdx >= 0) {
      var active = document.querySelector('.transcript-segment[data-seg="' + newIdx + '"]');
      if (active) {
        active.classList.add('active');
        active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    activeSegmentIdx = newIdx;
  }

  function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  // Export functionality
  document.addEventListener('DOMContentLoaded', function () {
    var exportBtns = document.querySelectorAll('.export-btn');
    exportBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var format = this.getAttribute('data-format');
        doExport(format);
      });
    });
  });

  function doExport(format) {
    if (segments.length === 0) return;
    var content = '';
    var filename = 'transcript';
    var mime = 'text/plain';

    switch (format) {
      case 'txt':
        content = segments.map(function (s) {
          return '[' + formatTime(s.start) + '] Speaker ' + s.speaker + ': ' + s.text;
        }).join('\n\n');
        filename += '.txt';
        break;
      case 'srt':
        content = segments.map(function (s, i) {
          return (i + 1) + '\n' +
            srtTime(s.start) + ' --> ' + srtTime(s.end) + '\n' +
            'Speaker ' + s.speaker + ': ' + s.text;
        }).join('\n\n');
        filename += '.srt';
        break;
      case 'docx':
        content = '【转录稿 — 此为模拟导出】\n\n' +
          segments.map(function (s) {
            return '[' + formatTime(s.start) + '] Speaker ' + s.speaker + ': ' + s.text;
          }).join('\n\n');
        filename += '.txt';
        mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'pdf':
        content = '【转录稿 — 此为模拟导出】\n\n' +
          segments.map(function (s) {
            return '[' + formatTime(s.start) + '] Speaker ' + s.speaker + ': ' + s.text;
          }).join('\n\n');
        filename += '.txt';
        mime = 'application/pdf';
        break;
    }

    var blob = new Blob([content], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function srtTime(seconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);
    var ms = Math.floor((seconds % 1) * 1000);
    return String(h).padStart(2, '0') + ':' +
      String(m).padStart(2, '0') + ':' +
      String(s).padStart(2, '0') + ',' +
      String(ms).padStart(3, '0');
  }

  window.SoundWiseSimulate = {
    loadTranscript: loadTranscript,
    highlightSegment: highlightSegment
  };
})();
```

- [ ] **Step 4: Commit**

```bash
cd "/root/web-project/AI voice" && git add assets/js/ && git commit -m "$(cat <<'EOF'
feat: add JS modules for upload, player, transcript simulation, and export

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Static Assets + Build Verification

**Files:**
- Create: `AI voice/static/images/favicon.svg`

- [ ] **Step 1: Create favicon SVG**

```bash
cat > "/root/web-project/AI voice/static/images/favicon.svg" << 'SVGEOF'
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#4F46E5"/>
  <path d="M8 14.5C8 12.015 10.015 10 12.5 10V10C14.985 10 17 12.015 17 14.5V16H8V14.5Z" fill="white"/>
  <path d="M15 16V18.5C15 20.985 17.015 23 19.5 23V23C21.985 23 24 20.985 24 18.5V16H15Z" fill="white" opacity="0.7"/>
</svg>
SVGEOF
```

- [ ] **Step 2: Copy transcript data to static for JS fetch access**

```bash
cp "/root/web-project/AI voice/data/transcript_sample.json" "/root/web-project/AI voice/static/transcript_sample.json"
```

- [ ] **Step 3: Build and verify**

```bash
cd "/root/web-project/AI voice" && hugo --minify
```

Expected: Build succeeds with no errors. Output in `public/` directory containing:
- `public/index.html` (homepage)
- `public/tool/index.html` (tool page)
- `public/zh-CN/` (Chinese pages)
- `public/en/` (English pages)
- `public/js/upload.js`, `player.js`, `simulate.js`
- `public/transcript_sample.json`

- [ ] **Step 4: Commit**

```bash
cd "/root/web-project/AI voice" && git add static/ && git commit -m "$(cat <<'EOF'
feat: add favicon and static transcript data for build

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Plan Self-Review

**1. Spec coverage check:**
- [x] Hugo project scaffold → Task 1
- [x] i18n zh-CN + en → Task 2
- [x] Content files bilingual → Task 4
- [x] Base layout + head partial (SEO) → Task 5
- [x] Header + Footer → Task 6
- [x] Homepage: hero, features, steps, formats, use cases, pricing, FAQ → Task 8
- [x] Tool page: upload zone, player, transcript panel, export bar → Task 9
- [x] Design tokens + visual design → Task 7, 8 (homepage.css), 10 (tool.css)
- [x] Fake transcript data → Task 3
- [x] JS: upload, player, simulate → Task 11
- [x] Build verification → Task 12

**2. Placeholder scan:** No TBDs, TODOs, or "implement later" found. All code steps have concrete content.

**3. Type consistency:** 
- `segments` array uses `{start, end, speaker, text}` — consistent across JSON data (Task 3), render code (Task 11), and export code (Task 11)
- CSS class names match between partials (Task 9) and CSS (Task 10)
- JS global namespaces `window.SoundWisePlayer` and `window.SoundWiseSimulate` match across upload.js (caller) and player.js/simulate.js (definers)
- Element IDs consistent across HTML partials and JS selectors
- Data file path `/data/transcript_sample.json` used in `simulate.js` with `/transcript_sample.json` fallback for static copy

