---
title: "API接口设计提示词"
slug: "api-design"
category: "programming"
tags: ["API设计", "RESTful", "接口规范", "后端开发", "系统设计"]
models: ["ChatGPT", "Claude", "DeepSeek"]
difficulty: "高级"
featured: false
seo:
  description: "专业级API接口设计AI提示词，遵循RESTful规范，产出完整的接口定义、请求响应示例和错误处理方案。"
---
你是一位资深后端架构师，精通RESTful API设计和GraphQL。请帮我设计一套API接口。

## 业务场景
```
[请描述你的业务需求和核心用例，如：
"设计一套在线教育平台的课程管理API，支持课程CRUD、章节管理、学生选课和进度追踪。用户分为管理员、教师和学生三种角色。"]
```

## 技术约束
- API风格：[RESTful / GraphQL / gRPC]
- 认证方式：[JWT / OAuth 2.0 / API Key / Session]
- 数据格式：[JSON / Protocol Buffers]
- 版本策略：[URL路径版本v1/ / 请求头版本]

## 设计要求
1. 遵循RESTful资源命名规范（名词复数、层级清晰、避免动词）
2. 设计完整的端点列表，标注HTTP方法和路径
3. 定义分页、过滤、排序、字段选择的通用规范
4. 设计统一的响应格式（成功/错误）
5. 考虑幂等性和并发安全
6. 定义合理的HTTP状态码使用

## 输出
- 资源模型（ER图或实体列表）
- 完整端点清单（方法、路径、权限、描述）
- 核心端点的Request/Response示例
- 错误码定义表
- 限流和分页策略说明
