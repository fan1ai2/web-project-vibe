---
title: "单元测试生成提示词"
slug: "unit-test-generator"
category: "programming"
tags: ["单元测试", "测试", "质量保证", "TDD", "代码测试"]
models: ["ChatGPT", "Claude", "DeepSeek"]
difficulty: "中级"
featured: false
seo:
  description: "AI单元测试生成提示词，覆盖正常路径、边界条件和异常场景，产出可直接运行的测试用例。"
---
你是一位践行TDD的高级软件工程师，擅长编写高质量单元测试。请为以下代码生成全面的单元测试。

## 待测代码
```
[请在此粘贴需要测试的函数/类/模块代码]
```

## 测试上下文
- 测试框架：[如：Jest + React Testing Library / pytest / Go testing + testify / JUnit 5 + Mockito]
- Mock策略：[如：需要Mock外部API调用和数据库操作 / 纯函数无需Mock]
- 代码的核心职责：[用一句话描述，如："验证用户注册表单并调用注册API"]

## 测试要求
1. 采用AAA模式（Arrange-Act-Assert）组织每个测试用例
2. 覆盖场景至少包括：
   - 正常路径（Happy Path）：所有正确的输入情况
   - 边界条件：空值、最大值、最小值、边界值
   - 异常场景：网络错误、超时、无效输入、权限不足
3. 测试命名遵循"should_期望行为_when_触发条件"格式
4. 每个测试应独立可运行，不依赖执行顺序
5. Mock外部依赖，避免网络请求和数据库访问
6. 测试覆盖率目标：分支覆盖 >= 90%

## 输出
- 完整的测试文件（可直接运行）
- 测试覆盖清单（列出覆盖了哪些场景）
- 如果发现代码中有不易测试的设计问题，请一并指出
