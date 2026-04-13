---
title: 结构化输出（Structured Outputs）
status: active
source: openai-node/helpers.md + OpenAI Structured Outputs Guide
created: 2026-04-10
updated: 2026-04-10
---

# 结构化输出（Structured Outputs）

## 定义

结构化输出的目标是：
让 LLM 的响应不仅是"可读文本"，而是严格符合预定义 Schema 的 JSON 结构，便于程序直接消费。

在 OpenAI Node SDK 中，主要通过 `response_format: { type: "json_schema" }` 和 `strict: true` 实现约束，并通过 `.parse()` 返回已解析对象。

## 两条主路径

### 1) 响应结构化（Response Format）

使用 `zodResponseFormat()` 或 `zodTextFormat()` 将 Zod Schema 转为 JSON Schema，并开启 `strict: true`。

- `zodResponseFormat(...): json_schema + strict: true`  
  见 `sources/openai-node/src/helpers/zod.ts:82`
- `zodTextFormat(...): json_schema + strict: true`  
  见 `sources/openai-node/src/helpers/zod.ts:101`

### 2) 工具参数结构化（Function Tools）

使用 `zodFunction()` 定义工具参数 Schema，并强制 `function.strict = true`。

- `zodFunction(...): function.parameters + strict: true`  
  见 `sources/openai-node/src/helpers/zod.ts:123`

## SDK 的关键约束机制（How）

### A. `.parse()` 自动解析

`.parse()` 是对 `.create()` 的增强封装：
- 自动发送 schema
- 自动把 `message.content` 解析回对象（`message.parsed`）

见 `sources/openai-node/helpers.md:5`、`sources/openai-node/helpers.md:10`、`sources/openai-node/helpers.md:42`

### B. Strict Schema 归一化

`toStrictJsonSchema()` 会把 schema 规范化到 API 期望的 strict 形式：

1. 根节点必须是 `type: "object"`  
   `sources/openai-node/src/lib/transform.ts:3`
2. 对象默认补 `additionalProperties: false`（若未声明）  
   `sources/openai-node/src/lib/transform.ts:67`
3. 所有 properties 进入 `required`（all fields required）  
   `sources/openai-node/src/lib/transform.ts:87`
4. 仅 `.optional()` 且非 `.nullable()` 会报错  
   `sources/openai-node/src/lib/transform.ts:79`
5. 会处理/展开 `$ref` 与 `allOf` 的 strict 兼容问题  
   `sources/openai-node/src/lib/transform.ts:129`、`sources/openai-node/src/lib/transform.ts:110`

### C. Tool 自动解析门槛

只有满足条件才会自动解析工具参数：
- 工具类型必须是 `function`
- 工具必须 `strict: true`

见 `sources/openai-node/src/lib/parser.ts:297`、`sources/openai-node/src/lib/parser.ts:305`

## 常见失败与恢复

### 1) 生成被截断或过滤

在 `.parse()` 路径下，如果：
- `finish_reason = "length"`
- `finish_reason = "content_filter"`

SDK 会直接抛错，需要上层重试或降级。

见 `sources/openai-node/helpers.md:127`、`sources/openai-node/src/lib/parser.ts:183`

### 2) refusal 场景

如果模型拒绝，`message.parsed` 不会有有效结构化结果，需要读取 refusal 并走业务分支。

见 `sources/openai-node/src/lib/parser.ts:204`

### 3) 非 strict tool

非 strict 工具不会被 auto-parse。

见 `sources/openai-node/helpers.md:128`、`sources/openai-node/src/lib/parser.ts:307`

## 实操模板（可复用）

1. 先定义 Zod Schema（尽量扁平、字段语义清晰）
2. 用 `zodResponseFormat()` / `zodTextFormat()` 生成 strict json_schema
3. 使用 `client.chat.completions.parse(...)`
4. 分支处理：
   - 成功：消费 `message.parsed`
   - refusal：给出可解释拒绝
   - length/content_filter：重试（调整 token/任务拆分）
5. 若是工具调用，统一改成 strict function tools

## 局限

- strict 模式对 schema 约束更强，宽松的"可选字段"设计会被收紧（要求 all fields required，再用 nullable 表达可空）。
- 结构化约束提升了稳定性，但不等于业务正确性；仍需业务层校验与回退策略。

## 关联页面

- [从零构建 Agent 框架](./build-agent-framework.md)
- [ReAct 范式](../patterns/react-paradigm.md)
- [上下文工程](./context-engineering.md)

## 来源

- `sources/openai-node/helpers.md`
- `sources/openai-node/src/helpers/zod.ts`
- `sources/openai-node/src/lib/parser.ts`
- `sources/openai-node/src/lib/transform.ts`
