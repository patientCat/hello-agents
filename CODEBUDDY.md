# CODEBUDDY — Wiki 约定与规范

本文件定义了知识库的结构约定、页面格式和操作流程。
基于 [Karpathy LLM Wiki Pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)。

## 三层架构

| 层 | 目录 | 说明 |
|----|------|------|
| Raw Sources | `sources/` | 不可变的原始素材（clone 的开源项目），通过 .gitignore 排除 |
| Wiki | `wiki/` | LLM 辅助生成的知识页面，结构化、有交叉引用 |
| Schema | `CODEBUDDY.md` | 本文件，定义约定和规范 |

## 页面格式

每个 wiki 页面使用以下 YAML front-matter：

```yaml
---
title: 页面标题
status: draft | active | stale
source: 对应的原始素材章节（如 Ch4）
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

### 状态说明

- `draft` — 占位模板，待填充内容
- `active` — 已写入实际内容，保持更新
- `stale` — 内容可能过时，需要复查

## 交叉引用

页面间使用相对路径链接：

```markdown
参见 [ReAct 范式](./react-paradigm.md)
```

## 核心操作

### Ingest（摄入）

学习新章节后执行：
1. 阅读 `sources/` 中对应章节的原始内容
2. 提取核心概念、原理、关键代码
3. 更新或新建对应的 `wiki/concepts/` 页面
4. 更新 `wiki/index.md` 索引
5. 在 `wiki/log.md` 追加记录

### Query（查询）

需要回顾知识时：
1. 查阅 `wiki/index.md` 定位页面
2. 阅读对应概念页
3. 如果查询产生了新的有价值的总结，回写到 wiki

### Lint（健康检查）

定期执行：
- 检查是否有 `stale` 状态的页面需要更新
- 检查交叉引用链接是否有效
- 检查是否有孤立页面（无引用也无被引用）
- 检查 `index.md` 是否与实际页面同步

## 添加新学习项目

1. `git clone <url> sources/<org>-<repo>`
2. 在 `sources/README.md` 添加记录
3. 在 `wiki/concepts/` 中创建对应知识页面
4. 更新 `wiki/index.md` 和 `wiki/log.md`
