---
title: Agent 领域索引
status: active
source: Schema
created: 2026-04-13
updated: 2026-04-13
---

# Agent 领域索引

本页用于聚合 Agent 相关知识。

## Concepts（基础概念）

| 页面 | 状态 | 摘要 |
|------|------|------|
| [Agent 定义与演进](concepts/agent-definition.md) | active | Agent 的定义、分类、发展历程、与 LLM 的关系 |
| [Agentic-RL](concepts/agentic-rl.md) | draft | 从 SFT 到 GRPO 的 Agent 强化学习训练 |

## Patterns（方法范式）

| 页面 | 状态 | 摘要 |
|------|------|------|
| [ReAct 范式](patterns/react-paradigm.md) | active | Reasoning + Acting 交替执行的 Agent 构建范式 |
| [Plan-and-Solve 范式](patterns/plan-and-solve.md) | active | 先整体规划再执行，强调计划持久化与稳定执行 |
| [Reflection 范式](patterns/reflection.md) | active | 在执行后加入评估-修正循环，作为优化层叠加 |

## Engineering（工程实现）

| 页面 | 状态 | 摘要 |
|------|------|------|
| [构建 Agent 框架](engineering/build-agent-framework.md) | active | 以双层 CoreLoop（外层会话/内层工具）解释工程化实现 |
| [结构化输出（Structured Outputs）](engineering/structured-outputs.md) | active | 使用 JSON Schema 与 strict 工具约束 LLM 输出，并自动解析 |
| [LLM 流式输出与 SSE](engineering/streaming-and-sse.md) | active | 从自回归生成到 SSE 分块传输，解释为何可实时增量输出 |
| [记忆与 RAG](engineering/memory-and-rag.md) | draft | Agent 记忆系统与检索增强生成 |
| [上下文工程](engineering/context-engineering.md) | draft | Agent 的持续交互与上下文管理 |

## Protocols（通信与标准）

| 页面 | 状态 | 摘要 |
|------|------|------|
| [Agent 通信协议](protocols/agent-protocols.md) | draft | MCP / A2A / ANP 协议原理 |
