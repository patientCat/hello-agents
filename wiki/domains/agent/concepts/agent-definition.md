---
title: Agent 定义、分类与演进
status: active
source: Ch1-3 (datawhalechina/hello-agents)
created: 2025-04-09
updated: 2025-04-09
---

# Agent 定义、分类与演进

## 什么是 Agent

Agent 是一个能通过传感器感知环境、并通过执行器自主采取行动以达成特定目标的实体。

核心循环：**感知 (Perception) -> 思考 (Thought) -> 行动 (Action) -> 观察 (Observation)**

> 大模型本身只具有推理能力，无法和环境交互。Agent 的目的就是提供工具能力和环境交互能力。  
> — chapter1/readme.md

## 传统 Agent 类型（由简到复杂）

1. **简单反射型 (Simple Reflex)** — 基于当前感知直接映射到动作，无记忆
2. **基于模型的反射型 (Model-Based Reflex)** — 维护内部状态模型，考虑历史信息
3. **基于目标的 (Goal-Based)** — 有明确目标，选择能达成目标的动作
4. **基于效用的 (Utility-Based)** — 用效用函数评估多个目标间的权衡
5. **学习型 (Learning)** — 能从经验中学习并改进行为

## 分类维度

| 维度 | 类型 | 特点 |
|------|------|------|
| 内部架构复杂度 | 反应式 → 模型 → 目标 → 效用 → 学习 | 逐级递增的认知能力 |
| 时间与反应性 | 反应式 / 审议式 / 混合式 | 速度 vs 最优解的权衡 |
| 知识表示方式 | 符号主义 / 连接主义 / 神经符号混合 | 逻辑规则 vs 分布式权重 |

## 任务环境：PEAS 模型

- **P**erformance measure — 性能度量
- **E**nvironment — 环境特征
- **A**ctuators — 执行器（Agent 的"手脚"）
- **S**ensors — 传感器（Agent 的"眼睛"）

## Agent 发展史（三大浪潮）

### 第一浪潮：符号主义 / 逻辑 AI

基于物理符号系统假说 — 智能来自符号操作与逻辑推理。

- **专家系统 (MYCIN)**: 知识库 + 推理引擎，IF-THEN 规则
- **SHRDLU**: 在积木世界中整合自然语言理解、规划和记忆
- **局限**: 知识获取瓶颈、脆弱性、框架问题

### 第二浪潮：连接主义 / 神经网络

知识分布式存储在连接权重中，从数据中学习模式。

- **强化学习**: Agent 通过试错与环境交互学习最优策略（如 AlphaGo）
- **预训练 + 微调范式**: 自监督学习解决知识获取瓶颈

### 第三浪潮：LLM 驱动的 Agent

大语言模型作为 Agent 的"大脑"，涌现出上下文学习、思维链等能力。

**LLM Agent 架构**:
```
感知模块 → 规划模块 + LLM（思考） → 执行模块（行动） → 工具使用/环境
```

**交互协议**: Thought-Action-Observation 结构化格式

**协作模式**:
- Agent 作为开发者工具（GitHub Copilot、Cursor）
- Agent 作为自主协作者（CrewAI、MetaGPT、AutoGen）

## LLM 基础要点（Ch3）

### Transformer 架构（2017）

用注意力机制替代循环结构，实现并行计算：

```
Attention(Q, K, V) = softmax(QK^T / √d_k) · V
```

- **自注意力**: 每个 token 关注所有其他 token，学习权重
- **多头注意力**: 多个并行注意力头处理不同表示子空间
- **位置编码**: 用正弦/余弦函数为 token 添加位置信息

### Decoder-Only 架构（GPT）

更简单的范式：用掩码自注意力预测下一个词。现代 LLM 的基础。

### LLM 的局限

- 幻觉问题（生成看似合理但不正确的内容）
- 推理能力有限（能算简单数学，但精确计算、大规模处理会出错）
- 解决方案：提供可靠工具让 Agent 调用（这正是 Agent 的价值所在）

## 三大 Agent 构建范式

Agent 原理的核心是三种构建范式，详见各自页面：

1. **[ReAct](../patterns/react-paradigm.md)** — 边想边做，动态调整
2. **[Plan-and-Solve](../patterns/plan-and-solve.md)** — 三思而后行，先规划后执行
3. **[Reflection](../patterns/reflection.md)** — 自我反思与修正

## 来源

- `sources/datawhalechina-hello-agents/docs/chapter1/`
- `sources/datawhalechina-hello-agents/docs/chapter2/`
- `sources/datawhalechina-hello-agents/docs/chapter3/`
- `chapter1/readme.md`（自己的学习笔记）
