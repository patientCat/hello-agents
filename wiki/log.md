# 时间线日志

按时间倒序记录每次 Ingest / Query / Lint 操作。

---

## 2026-04-13

### Migrate: Wiki 目录结构硬迁移完成

- 迁移 Agent 领域页面：
  - `concepts/agent-definition.md` → `domains/agent/concepts/`
  - `concepts/structured-outputs.md` → `domains/agent/engineering/`
  - `concepts/streaming-and-sse.md` → `domains/agent/engineering/`
  - `concepts/memory-and-rag.md` → `domains/agent/engineering/`
  - `concepts/context-engineering.md` → `domains/agent/engineering/`
  - `concepts/react-paradigm.md` → `domains/agent/patterns/`
  - `concepts/plan-and-solve.md` → `domains/agent/patterns/`
  - `concepts/reflection.md` → `domains/agent/patterns/`
  - `concepts/build-agent-framework.md` → `domains/agent/engineering/`
  - `concepts/agentic-rl.md` → `domains/agent/concepts/`
  - `concepts/agent-protocols.md` → `domains/agent/protocols/`
- 迁移计算机网络领域页面：
  - `concepts/network-layers-and-tcp.md` → `domains/computer-network/concepts/`
- 更新导航与引用：
  - `wiki/index.md`：删除"现有内容（待迁移）"区块
  - `wiki/domains/agent/index.md`：添加按分组的页面链接
  - `wiki/domains/computer-network/index.md`：添加 network-layers-and-tcp 链接
  - `wiki/learning-path.md`：更新表格链接到新路径
  - `sources/README.md`：更新 Wiki 关联页面链接

### Ingest: 多领域 Wiki 目录脚手架

- 新增目录：`wiki/domains/`（agent / computer-network / algorithms / data-structures）
- 新增目录：`wiki/cross-domain/`（system-design / comparisons）
- 新增页面：`wiki/domains/*/index.md`（4 个领域入口页）
- 新增页面：`wiki/cross-domain/index.md`
- 新增页面：`wiki/meta/taxonomy.md`（分类法与命名规范）
- 更新索引：`wiki/index.md` 改为“领域导航 + 跨领域 + 待迁移内容”结构
- 迁移策略：现有 `wiki/concepts/` 页面暂保留，后续按主题逐步迁入 `wiki/domains/`

### Ingest: report_final 维护元数据页（Meta）

- 新增目录：`wiki/meta/`
- 新增页面：`wiki/meta/maintenance-metadata-and-flow.md`
- 主题定位：项目维护元数据（维护规范与编译流程），非概念页
- 更新索引：`wiki/index.md` 新增「维护元数据（Meta）」分组与页面入口

### Ingest: ReAct / Plan-and-Solve / Reflection 组织方式 + NanoClaw CoreLoop

- 更新页面：`wiki/concepts/plan-and-solve.md`（draft → active）
- 更新页面：`wiki/concepts/reflection.md`（draft → active）
- 更新页面：`wiki/concepts/build-agent-framework.md`（draft → active）
- 新增工程化总结：CoreLoop 双层循环（外层会话循环 + 内层 EZ 工具循环）
- 补充参数白话解释：`prompt` / `sessionId` / `resumeAt`
- 更新索引：`wiki/index.md` 同步三个页面状态与摘要
- 更新路线图：`wiki/learning-path.md` 将 Ch4 Plan-and-Solve / Reflection 标记为 done

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
