---
title: Plan-and-Solve 范式
status: active
source: Ch4 (datawhalechina/hello-agents) + qwibitai/nanoclaw
created: 2025-04-09
updated: 2026-04-13
---

# Plan-and-Solve 范式

## 核心思想

先做全局规划（Plan），再执行规划（Solve）。

最小流程可以写成：

```
Plan -> Solve -> Result
```

它与 ReAct 的差异不在"是否会思考"，而在"思考发生的时机"：
- ReAct：每步都边做边调整
- Plan-and-Solve：先整体想清楚，再按计划推进

## 机制拆解

### 1) Plan（整体思考）

先产出任务分解、执行顺序、终止条件。目标是减少中途频繁改路。

### 2) Solve（按计划执行）

执行阶段优先遵循计划；只有在外部约束变化或计划失效时才回到重规划。

### 3) Result（得到结果）

输出最终结果，并评估是否达到任务目标。

## 与 ReAct / Reflection 的本质区别

| 范式 | 思考与行动的组织方式 | 典型循环 |
|---|---|---|
| [ReAct](./react-paradigm.md) | 局部闭环，边思考边行动 | `Thought -> Action -> Observation` |
| Plan-and-Solve | 全局先规划，再执行 | `Plan -> Solve -> Result` |
| [Reflection](./reflection.md) | 在执行后增加反思与修正 | `Execute -> Reflect -> Revise` |

## 工程实践要点

1. **计划建议持久化**
   - 原因：进程重启、上下文压缩、任务跨时段执行时，临时状态容易丢失。
   - 实践：把计划、执行状态、运行结果落到数据库/日志中。

2. **NanoClaw 的对应设计（部分体现 Plan-and-Solve）**
   - 计划状态持久化到 `scheduled_tasks`，执行结果落到 `task_run_logs`。
   - 在定时任务里存在"先脚本决策，再唤醒 Agent"的前置规划阶段（script phase）。
   - 其主会话循环仍以消息驱动为主，不是严格的"全局规划器"。

## 适用场景

- 步骤明确、依赖关系清晰、需求稳定的任务
- 需要先估算全局路径再执行的任务（如批处理流水线、固定流程审批）

## 局限

- 对环境变化响应慢于 ReAct
- 前期规划质量不足时，后续执行会被整体拖累

## 关联页面

- [ReAct 范式](./react-paradigm.md)
- [Reflection 范式](./reflection.md)
- [从零构建 Agent 框架](../engineering/build-agent-framework.md)

## 来源

- `sources/datawhalechina-hello-agents/docs/chapter4/`
- `sources/qwibitai-nanoclaw/src/db.ts`
- `sources/qwibitai-nanoclaw/src/task-scheduler.ts`
- `sources/qwibitai-nanoclaw/container/agent-runner/src/index.ts`
