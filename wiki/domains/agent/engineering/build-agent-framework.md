---
title: 从零构建 Agent 框架
status: active
source: Ch7 (datawhalechina/hello-agents) + qwibitai/nanoclaw
created: 2025-04-09
updated: 2026-04-13
---

# 从零构建 Agent 框架

## 核心思想

从工程角度看，Agent 框架最关键的是把"会话连续性"和"单轮工具循环"拆开管理。

一个实用的最小抽象包含：
- 当前输入（prompt）
- 会话身份（sessionId）
- 会话内恢复锚点（resumeAt）
- 工具执行循环（tool loop）
- 结果输出通道（stream / message route）

## CoreAgentLoop：双层循环设计

以 NanoClaw 为例，CoreLoop 可以理解为两层：

1. **外层会话循环**：`query -> wait message -> query`
2. **内层工具循环（EZ）**：一次 query 内部反复 `LLM -> tool -> LLM`

### 外层最小伪代码

```pseudo
sessionId = loadSessionId()
resumeAt  = null
prompt    = initialUserMessage

while true:
    result = runQuery(prompt, sessionId, resumeAt)

    if result.newSessionId exists:
        sessionId = result.newSessionId
    if result.lastAssistantUuid exists:
        resumeAt = result.lastAssistantUuid

    if result.shouldExit:
        break

    nextMessage = waitForNextMessage()
    if nextMessage is null:
        break

    prompt = nextMessage
```

### 内层 EZ 最小伪代码

```pseudo
function EZLoop(prompt, sessionId, resumeAt):
    messages = [prompt]
    while true:
        resp = callLLM(messages, sessionId, resumeAt)

        if resp.hasNoToolUse():
            return resp

        toolResults = runTools(resp.toolCalls)
        messages.append(resp)
        messages.append(toolResults)
```

## 三个核心参数（白话版）

- `prompt`：这一次要处理的输入内容
- `sessionId`：同一段长期对话的编号，保证不从零开始
- `resumeAt`：在该会话里从哪条 assistant 消息后继续

三者合起来：**在同一个会话里，从上次停点继续，处理新的输入**。

## 为什么双层循环有价值

- 外层保证长期会话可持续（消息驱动）
- 内层保证单轮内的工具推理闭环（ReAct 风格）
- 会话态与工具态解耦，便于调试、恢复、扩展

## 与三种范式的对应

- [ReAct](../patterns/react-paradigm.md)：主要体现在内层 EZ 工具循环
- [Plan-and-Solve](../patterns/plan-and-solve.md)：可作为外层/前置阶段（先规划再进入执行）
- [Reflection](../patterns/reflection.md)：可作为执行后优化层（复盘再下一轮）

## 来源

- `sources/qwibitai-nanoclaw/container/agent-runner/src/index.ts`
- `sources/qwibitai-nanoclaw/docs/SDK_DEEP_DIVE.md`
- `sources/qwibitai-nanoclaw/src/index.ts`
- `sources/datawhalechina-hello-agents/docs/chapter7/`
