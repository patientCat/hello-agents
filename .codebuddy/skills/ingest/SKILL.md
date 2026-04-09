---
name: ingest
description: >-
  将新的 Agent 学习素材摄入到本项目 wiki。凡是用户提到“ingest/摄入/消化章节/把学习内容写进 wiki/更新知识库/整理笔记到 concepts”，都应优先使用此技能。
  适用于 sources/ 下任意开源项目（不仅是 hello-agents）。
---

# Ingest Skill

## 目标
把 `sources/` 中的原始素材，转成 `wiki/` 中结构化知识页，并保持索引和日志同步。

## 执行流程

1. 先确认摄入范围。
   - 项目：`sources/<org>-<repo>/...`
   - 范围：章节/文件/主题（例如 Ch4 ReAct）
   - 目标页面：`wiki/concepts/*.md` 或新页面

2. 读取原始素材并提取信息。
   - 只保留“原理、关键机制、关键实现点、适用场景、限制”。
   - 去掉与目标无关的冗余背景。

3. 写入或更新 wiki 页面。
   - 页面必须包含 frontmatter：
     - `title`
     - `status` (`draft|active|stale`)
     - `source`
     - `created`
     - `updated`
   - 新增内容时优先更新已有页面，不重复造页。

4. 同步导航文件。
   - 更新 `wiki/index.md`（页面名、状态、摘要）
   - 更新 `wiki/log.md`（追加本次 ingest 记录）
   - 如涉及学习进度变化，更新 `wiki/learning-path.md`

5. 交付结果。
   - 汇报本次新增/更新的页面清单
   - 明确后续可继续 ingest 的主题

## 写作约束

- 面向“原理学习”，优先解释 why/how，不堆框架 API。
- 保持页面结构清晰：定义 -> 机制 -> 场景 -> 局限 -> 关联页面。
- 页面间使用相对链接，确保能互相跳转。
- 避免空泛总结；尽量给出可复用的要点。