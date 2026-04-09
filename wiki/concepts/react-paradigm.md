---
title: ReAct 范式
status: active
source: Ch4 (datawhalechina/hello-agents) + chapter1/reActAgent.js
created: 2025-04-09
updated: 2025-04-09
---

# ReAct 范式 (Reasoning + Acting)

## 核心思想

将"思考"和"行动"紧密结合，让 Agent 边想边做、动态调整。每一步都是：

```
Thought → Action → Observation → Thought → Action → Observation → ... → Finish
```

## 特点

- **高可解释性**: 每步都有明确的 Thought 说明推理过程
- **动态规划**: 根据工具返回结果实时调整下一步
- **工具协调**: 能灵活调用多种外部工具
- **局限**: 强依赖 LLM 能力，可能出现无限循环

## 适用场景

需要根据工具执行结果动态调整策略的任务。比如：搜索信息后根据结果决定下一步查询方向。

## 核心实现分析

基于 `chapter1/reActAgent.js` 的实际代码：

### 1. 三个核心类

```
LLMAgent    — 封装 LLM 调用（流式输出）
ToolBox     — 工具注册与管理
ReActAgent  — 编排 Thought-Action-Observation 循环
```

### 2. Prompt 模板

Prompt 是 ReAct 的关键，它告诉 LLM 必须按特定格式输出：

```
Thought: 你的思考过程
Action: 工具名[输入] 或 Finish[最终答案]
```

模板包含三个动态部分：
- `{tools}` — 可用工具列表（由 ToolBox 生成）
- `{question}` — 用户问题
- `{history}` — 历史 Thought + Action + Observation 记录

### 3. 循环流程（ReActAgent.run）

```
while (步数 < 最大步数):
    1. 构建 prompt（注入工具描述 + 历史记录 + 问题）
    2. 调用 LLM 获取响应
    3. 解析输出 → 提取 Thought 和 Action
    4. 如果 Action = Finish[答案] → 返回答案
    5. 如果 Action = 工具名[输入] → 执行工具 → 记录结果到 history
    6. 回到步骤 1
```

### 4. 解析逻辑

两个正则表达式完成输出解析：

```javascript
// 提取 Thought 和 Action
const thoughtMatch = text.match(/Thought:\s*(.*?)(?=\nAction:|$)/s);
const actionMatch = text.match(/Action:\s*(.*?)$/s);

// 从 Action 中提取工具名和输入
const match = actionText.match(/(\w+)\[(.*)\]/s);
// 例如 Search[华为最新手机] → toolName=Search, toolInput=华为最新手机
```

### 5. 关键设计决策

| 决策 | 选择 | 原因 |
|------|------|------|
| LLM 调用方式 | 流式输出 | 实时获取响应，体验更好 |
| 工具管理 | Map 数据结构 | O(1) 查找，支持动态注册 |
| 历史记录 | 字符串拼接注入 prompt | 简单直接，让 LLM 看到完整上下文 |
| 最大步数限制 | maxSteps=5 | 防止无限循环 |
| 输出解析 | 正则表达式 | 轻量，匹配 Thought/Action 格式 |

## 与其他范式的对比

| | ReAct | [Plan-and-Solve](./plan-and-solve.md) | [Reflection](./reflection.md) |
|---|-------|-------|-------|
| 策略 | 边想边做 | 先规划后执行 | 做完后反思改进 |
| 规划时机 | 每步实时规划 | 开始前一次性规划 | 执行后回顾 |
| 灵活性 | 高 | 低 | 中 |
| 适合任务 | 需动态调整的任务 | 步骤明确的结构化任务 | 需要迭代优化的任务 |

## 来源

- `chapter1/reActAgent.js` — 自己的 ReAct 实现
- `sources/datawhalechina-hello-agents/docs/chapter4/`
