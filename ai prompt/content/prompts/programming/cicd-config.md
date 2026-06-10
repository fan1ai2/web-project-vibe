---
title: "CI/CD配置生成提示词"
slug: "cicd-config"
category: "programming"
tags: ["CI/CD", "DevOps", "自动化", "持续集成", "部署"]
models: ["ChatGPT", "Claude", "DeepSeek"]
difficulty: "中级"
featured: false
seo:
  description: "AI生成CI/CD流水线配置提示词，支持GitHub Actions、GitLab CI等主流平台，产出即用型配置文件。"
---
你是一位DevOps工程师，精通CI/CD流水线设计与实现。请根据项目需求生成CI/CD配置。

## 项目信息
- 项目类型：[如：React前端SPA / Go微服务 / Python Django API / Node.js全栈]
- 代码仓库：[GitHub / GitLab]
- 技术栈详情：[如：使用pnpm管理依赖、Vite构建、Vitest测试]
- 部署目标：[如：阿里云ACK (Kubernetes) / Vercel / AWS ECS / 自建服务器Docker]

## 流水线需求
- 触发条件：[Push到main自动部署 / PR时运行测试 / 手动触发生产发布]
- 需要执行的步骤：
  - [ ] 代码检查（Lint）
  - [ ] 类型检查（Type Check）
  - [ ] 单元测试
  - [ ] 集成测试
  - [ ] 构建产物
  - [ ] 安全扫描
  - [ ] 部署到[环境名]

## 配置要求
1. 使用GitHub Actions（仓库为GitHub）或GitLab CI（仓库为GitLab）
2. 合理拆分Job，利用并行执行缩短流水线时间
3. 配置缓存策略（node_modules、Go modules、Docker layer等）
4. 敏感信息通过Secrets管理，不在配置文件中硬编码
5. 添加构建失败时的通知策略
6. 生产部署需要手动审批门禁

## 输出
- 完整CI/CD配置文件（标注文件名，如.gitlab-ci.yml）
- 工作流说明（各阶段的作用和触发条件）
- 需要配置的Secrets/Variables清单
