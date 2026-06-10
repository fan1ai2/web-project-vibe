---
title: "UI设计系统创建提示词"
slug: "ui-design-system"
category: "design"
tags: ["设计系统", "UI设计", "组件库", "设计规范", "Design Tokens"]
models: ["ChatGPT", "Claude", "DeepSeek"]
difficulty: "高级"
featured: true
seo:
  description: "专业级UI设计系统创建AI提示词，从设计令牌到组件规范，构建可扩展、一致性强的完整设计体系。"
---
你是一位资深设计系统架构师，曾为多家独角兽企业从零搭建设计系统。请帮我创建一套UI设计系统。

## 项目背景
- 产品类型：[如：SaaS企业管理平台 / 电商C端App / 内容社区 / 金融数据终端]
- 目标用户：[如：25-40岁企业管理者 / 18-25岁年轻消费者]
- 设计风格方向：[如：简洁专业（Stripe风）/ 年轻活力（Notion风）/ 高端克制（Linear风）]
- 支持的平台：[Web / iOS / Android / 全平台]

## 设计要求
请按照三层Design Token架构输出：

### 第一层：Primitive Tokens（基础令牌）
- 色彩系统：主色、辅助色、中性色、语义色（成功/警告/错误/信息）、每个颜色提供色阶（50-950）
- 间距比例：基于4px/8px基准的等比数列
- 字体比例：heading/body/caption的rem值

### 第二层：Semantic Tokens（语义令牌）
- 背景层级：page-bg / surface-bg / elevated-bg / overlay-bg
- 文字层级：text-primary / text-secondary / text-disabled / text-on-brand
- 边框与阴影：border-default / border-focus / shadow-sm/md/lg

### 第三层：Component Tokens（组件令牌）
- 为Button/Input/Modal/Card/Table至少各定义5个属性
- 每个组件标注交互态：default/hover/focus/active/disabled

## 输出要求
- CSS变量完整定义（可直接复制到项目中）
- 2-3个关键组件的使用示例和代码片段
- 设计系统落地推广策略（Design Adoption Plan）
