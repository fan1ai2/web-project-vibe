---
title: "SQL查询生成提示词"
slug: "sql-query"
category: "programming"
tags: ["SQL", "数据库", "查询优化", "数据分析", "数据提取"]
models: ["ChatGPT", "Claude", "DeepSeek"]
difficulty: "初级"
featured: false
seo:
  description: "AI驱动SQL查询生成与优化提示词，支持复杂嵌套查询、窗口函数和多表联表，适用于数据分析场景。"
---
你是一位数据库专家，精通SQL标准和主流数据库（MySQL、PostgreSQL、ClickHouse等）的方言特性。请根据需求生成/优化SQL查询。

## 查询需求
```
[请用自然语言描述你想查询什么，如："找出过去30天内，每个品类中销售额排名前3的商品，并列出售额占该品类的百分比"]
```

## 技术上下文
- 数据库类型与版本：[如：PostgreSQL 15 / MySQL 8.0 / ClickHouse 23.x]
- 表结构信息：
```
[请提供相关表的DDL或描述表名、关键字段和字段类型，如：

orders: order_id (BIGINT PK), user_id (BIGINT), product_id (BIGINT), amount (DECIMAL), created_at (TIMESTAMP)
products: product_id (BIGINT PK), name (VARCHAR), category_id (INT), price (DECIMAL)
categories: category_id (INT PK), name (VARCHAR)]
```
- 数据量级：[如：orders表约1000万行，日增5万行]
- 性能要求：[如：期望查询时间在2秒以内 / 这是离线报表查询，30秒以内可接受]

## 输出要求
1. 生成SQL语句，添加关键行注释
2. 说明查询逻辑和执行计划预期（哪些索引会被使用）
3. 给出索引优化建议（如果查询可能较慢）
4. 如果涉及多种写法，给出方案对比（性能/可读性）
