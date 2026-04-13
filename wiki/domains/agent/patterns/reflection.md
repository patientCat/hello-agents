---
title: Reflection 范式
status: active
source: Ch4 (datawhalechina/hello-agents) + qwibitai/nanoclaw
created: 2025-04-09
updated: 2026-04-13
---

# Reflection 范式

## 核心思想

Reflection 的重点不是"再做一次"，而是"先复盘再决定下一步"。

它在执行之后加入一层元循环：

```
Execute -> Evaluate -> Revise -> Next Action
```

## 与 ReAct / Plan-and-Solve 的关系

Reflection 可以叠加在两者之上：

- 叠加在 [ReAct](./react-paradigm.md) 上：每轮工具执行后做质量检查，再继续下一轮
- 叠加在 [Plan-and-Solve](./plan-and-solve.md) 上：执行完计划后复盘，必要时重规划

所以 Reflection 更像"优化层"，而不是底层行动编排本身。

## 机制拆解

### 1) Execute
先执行当前策略（可能是 ReAct，也可能是 Plan-and-Solve）。

### 2) Evaluate
对结果做质量评估：正确性、完整性、约束满足度、失败原因。

### 3) Revise
根据评估结果修正策略：补步骤、改工具选择、重写计划。

### 4) Next Action
进入下一轮执行，直到达到停止条件。

## 工程实现要点

1. **反思信息要可追踪**
   - 需要保存"本轮输入、输出、评估结论、修正动作"，否则无法稳定迭代。

2. **把反思和执行解耦**
   - 执行链路负责产出结果；反思链路负责打分与修正建议。
   - 解耦后更容易替换评估器（规则、模型、人工 review）。

3. **NanoClaw 的现状**
   - 已有任务结果与运行日志持久化（可用于复盘）。
   - 但暂无内建的自动"critic -> refine -> retry"闭环；更多是提供了可搭建该闭环的基础设施。

## 适用场景

- 需要高正确性、可迭代优化的复杂任务
- 一次执行结果不可靠，且允许多轮改进的任务

## 局限

- 成本更高（额外评估轮次）
- 若评估标准不清晰，可能出现"反思噪声"

## 关联页面

- [ReAct 范式](./react-paradigm.md)
- [Plan-and-Solve 范式](./plan-and-solve.md)
- [从零构建 Agent 框架](../engineering/build-agent-framework.md)

## 来源

- `sources/datawhalechina-hello-agents/docs/chapter4/`
- `sources/qwibitai-nanoclaw/src/db.ts`
- `sources/qwibitai-nanoclaw/src/task-scheduler.ts`
- `sources/qwibitai-nanoclaw/container/agent-runner/src/index.ts`
