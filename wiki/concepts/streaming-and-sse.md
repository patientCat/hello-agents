---
title: LLM 流式输出与 SSE
status: active
source: Ch3 (datawhalechina/hello-agents) + openai-node
created: 2026-04-10
updated: 2026-04-10
---

# LLM 流式输出与 SSE

## 定义

流式输出（Streaming）是指：模型生成过程中，服务端将增量结果持续推送给客户端，而不是等待完整结果一次性返回。

SSE（Server-Sent Events）是流式输出在 HTTP 上的一种常见承载方式：服务器通过一条长连接持续发送事件块。

## 为什么 LLM 可以 Streaming

根本原因是生成机制本身是“逐 token 自回归”——不是先算完整段落再整体返回。

根据 Decoder-Only 的描述：
1. 给起始文本
2. 预测下一个词
3. 把新词拼回上下文
4. 再预测下一个词
5. 重复直到停止

见 `sources/datawhalechina-hello-agents/docs/chapter3/第三章 大语言模型基础.md:484`

这意味着每一步都可以形成“可交付的增量”，天然适配流式返回。

## SSE 在这里做了什么

### 1) 传输层分块

openai-node 的底层按 SSE 消息解析，遇到双换行分隔就产出一个事件块。

- `sources/openai-node/src/core/streaming.ts:219`
- `sources/openai-node/src/core/streaming.ts:255`

### 2) SDK 层暴露增量接口

当 `stream: true` 时，接口返回 `Stream<ChatCompletionChunk>`，可通过 async iterator 消费；
非流式则返回完整 `ChatCompletion`。

- `sources/openai-node/src/resources/chat/completions/completions.ts:61`
- `sources/openai-node/src/resources/chat/completions/completions.ts:63`

### 3) 事件语义

SDK 事件里同时给：
- `delta`：本次新增文本
- `snapshot`：当前累计文本

- `sources/openai-node/src/lib/ChatCompletionStream.ts:36`

## HTTP 无状态 与 “同一段文本” 如何识别

HTTP 无状态指“请求之间”默认不共享状态；
但 SSE 流通常是“同一请求内的一条持续连接”，所以并不是很多独立请求拼起来。

在同一流内，chunk 共享同一个 completion id：
- `sources/openai-node/src/resources/chat/completions/completions.ts:534`

因此可用“同一请求 + 同一 completion id + 顺序 delta”来还原同一段文本。

## SSE vs WebSocket（在 LLM 输出场景）

- SSE：Server → Client 单向推送，适合 token 增量下发
- WebSocket：双向实时通信，适合高频双向交互

LLM 文本生成大多是服务端单向吐流，SSE 通常足够且实现更简单。

## 适用场景

- 聊天机器人逐字输出
- 长回答降低首字等待
- 结构化输出时增量展示解析进度

## 局限

- SSE 主要是单向文本事件；若需要高频双向实时交互，WebSocket 更合适。
- 流式连接中断后通常需要新请求续传，续传逻辑需业务层处理。

## 关联页面

- [结构化输出（Structured Outputs）](./structured-outputs.md)
- [ReAct 范式](./react-paradigm.md)
- [从零构建 Agent 框架](./build-agent-framework.md)

## 来源

- `sources/datawhalechina-hello-agents/docs/chapter3/第三章 大语言模型基础.md`
- `sources/openai-node/src/core/streaming.ts`
- `sources/openai-node/src/resources/chat/completions/completions.ts`
- `sources/openai-node/src/lib/ChatCompletionStream.ts`
- `sources/openai-node/helpers.md`
