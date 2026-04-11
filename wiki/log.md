# 时间线日志

按时间倒序记录每次 Ingest / Query / Lint 操作。

---

## 2026-04-11

### Ingest: TCP/IP 四层与 OSI 七层

- 新增页面：`wiki/concepts/network-layers-and-tcp.md`
- 梳理 TCP/IP 四层与 OSI 七层的映射，明确 5/6/7 层在工程中的合并
- 总结交换机 vs 路由器、TCP 握手与 3/4 次挥手、TIME_WAIT 的作用，以及 Nginx 在 L4/L7 的位置
- 更新索引：`wiki/index.md` 新增“TCP/IP 四层与 OSI 七层”概念页入口

## 2026-04-10

### Ingest: LLM 流式输出与 SSE

- 新增页面：`wiki/concepts/streaming-and-sse.md`
- 提炼“为什么 LLM 可以流式输出”的原理链路：自回归逐 token 生成 → SSE 分块传输 → SDK 增量事件（delta/snapshot）
- 补充 HTTP 无状态与同一流识别机制：同一请求内流、同一 completion id
- 更新索引：`wiki/index.md` 新增“LLM 流式输出与 SSE”概念页入口

### Ingest: 结构化输出约束（用于回答 how to structure llm model's response）

- 新增页面：`wiki/concepts/structured-outputs.md`
- 提炼 OpenAI SDK 在结构化输出上的核心机制：`response_format json_schema`、`strict`、自动解析 `message.parsed`
- 补充失败处理要点：`finish_reason=length/content_filter` 抛错、非 strict tool 不参与 auto-parse
- 更新索引：`wiki/index.md` 新增“结构化输出（Structured Outputs）”概念页入口

## 2025-04-09

### Ingest: 知识库初始化

- 创建 Wiki Pattern 三层架构（CODEBUDDY.md / sources/ / wiki/）
- Clone datawhalechina/hello-agents 到 sources/
- 基于 chapter1 已学内容，撰写首批概念页：Agent 定义、ReAct 范式
- 创建其余 7 个概念页占位模板
- 建立学习路线图（P0/P1/P2 优先级）
