# CODEBUDDY — 知识编译器约定与规范

本仓库定位为你的**人生第二大脑**，用于沉淀长期可复用的工作知识。
它不只服务于 agent 相关内容，而是覆盖更广泛的知识领域（如计算机网络、分布式、云计算等）。

核心目标：把原始资料持续“编译”为结构化、可检索、可迭代的个人知识库。

## 三层架构

| 层 | 目录 | 说明 |
|----|------|------|
| Raw Sources | `sources/` | 最基础的原始资料层，**只读，不修改**（通过 .gitignore 排除） |
| Wiki | `wiki/` | 持续学习后沉淀出的结构化知识层，可持续更新与交叉引用 |
| Schema | `CODEBUDDY.md` | 本规范文件，定义结构、格式与操作流程 |

## 核心原则

1. **Source 永远只读**：`sources/` 仅保存原始输入，不在其中做编辑与加工。
2. **Wiki 持续演进**：所有理解、总结、抽象、对比与复盘都写入 `wiki/`。
3. **编译优先**：从“素材堆积”转向“知识编译”，强调提炼、关联与可复用。

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

### Ingest（摄入与编译）

新增学习材料或复习材料时执行：
1. 阅读 `sources/` 中对应原始内容（只读）
2. 提取核心概念、原理、方法、关键代码与边界条件
3. 更新或新建对应 `wiki/` 页面（如 `wiki/concepts/`）
4. 更新 `wiki/index.md` 索引，确保可检索
5. 在 `wiki/log.md` 追加学习与编译记录

### Query（查询与回顾）

需要回顾知识时：
1. 查阅 `wiki/index.md` 定位页面
2. 阅读对应概念页并沿交叉引用扩展
3. 若产生新的高价值总结，回写到 wiki

### Lint（健康检查）

定期执行：
- 检查是否有 `stale` 状态页面需要更新
- 检查交叉引用链接是否有效
- 检查是否有孤立页面（无引用也无被引用）
- 检查 `index.md` 是否与实际页面同步

## 添加新资料源

1. `git clone <url> sources/<org>-<repo>`
2. 在 `sources/README.md` 添加来源记录
3. 在 `wiki/` 下创建或更新对应知识页面
4. 更新 `wiki/index.md` 和 `wiki/log.md`

> 约束重申：`sources/` 只作为原始输入层，不进行内容修改；`wiki/` 才是持续演进的知识层。
