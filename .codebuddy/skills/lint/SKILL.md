---
name: lint
description: >-
  对本项目 wiki 做健康检查。凡是用户提到“lint/检查知识库/检查链接是否失效/检查索引是否同步/找孤立页面/质量巡检”，都应优先使用此技能。
  支持只报告问题，或报告后自动修复。
---

# Lint Skill

## 目标
发现并报告 wiki 结构与内容一致性问题，必要时执行最小修复。

## 检查清单

1. Frontmatter 完整性（`wiki/concepts/*.md`）。
   - 必须包含：`title/status/source/created/updated`
   - `status` 仅允许：`draft|active|stale`

2. 链接有效性。
   - 检查相对链接是否指向存在文件
   - 识别明显无效的内部跳转

3. 索引一致性。
   - `wiki/index.md` 是否覆盖现有概念页
   - index 中条目状态是否与页面 frontmatter 一致

4. 日志与进度一致性（轻检查）。
   - `wiki/log.md` 是否有最近 ingest 记录
   - `wiki/learning-path.md` 的完成项是否与页面状态大体一致

5. 孤立页面检查。
   - 页面既不引用他人，也未被索引引用时标记为孤立

## 输出格式

按以下结构输出：

- `Summary`: 总体健康度（OK/Warn/Fail）
- `Errors`: 必须修复的问题
- `Warnings`: 建议修复的问题
- `Suggested Fixes`: 建议修改项（按文件列出）

## 修复策略

- 默认先报告，不直接改文件。
- 若用户明确要求“直接修复”，仅做最小改动：
  - 补齐 frontmatter 缺失字段
  - 修复明显错误链接
  - 同步 index 状态字段
- 不做风格性大改写。