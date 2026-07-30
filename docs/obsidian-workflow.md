# Obsidian 内容工作流

## 打开知识库

在 Obsidian 中选择“打开本地库”，目录选择：

```text
site/src/content
```

该目录既是 Obsidian Vault，也是 Astro 的内容来源。保存 Markdown 后无需导出或同步。

## 推荐设置

仓库已经配置：

- 新笔记默认进入 `_inbox`
- 模板目录为 `_templates`
- 附件目录为 `_attachments`
- 使用标准 Markdown 链接
- 移动文件时自动更新内部链接

标准 Markdown 链接可以同时被 Obsidian 和网站识别。不要改回 `[[Wikilinks]]`，图片也不要使用 `![[图片.png]]`。

## 内容目录

| 目录 | 用途 |
| --- | --- |
| `notes/technology` | 开发技术、工程实践、工具与方法 |
| `notes/finance` | 银行、金融、信贷、财务与风险知识 |
| `exams` | MBA、软考等考试知识、真题和错题 |
| `articles` | 金融热点、市场趋势和科技观察 |
| `projects` | 项目记录与复盘 |
| `roadmaps` | 学习路线 |
| `glossary` | 术语词条 |

## 从记录到发布

1. 在 `_inbox` 创建临时笔记。
2. 使用 Obsidian 的核心“模板”功能插入对应模板。
3. 完善 Properties 和正文，将文件移动到正式目录。
4. 保持 `draft: true`，运行 `npm run dev` 检查页面。
5. 更新 `updated`，将 `draft` 改为 `false`。
6. 运行 `npm run verify`。
7. 提交并推送 `main`，GitHub Actions 会自动发布。

## Properties 说明

| 字段 | 说明 |
| --- | --- |
| `title` | 页面标题 |
| `description` | 搜索和分享摘要 |
| `type` | `note`、`exam`、`article`、`project`、`roadmap` 或 `glossary` |
| `domain` | `technology`、`study`、`finance`、`insights` 或 `general` |
| `topics` | 稳定主题 |
| `tags` | 更具体、可跨领域连接的关键词 |
| `status` | `seedling`、`growing`、`evergreen`、`archived` 或 `time-sensitive` |
| `created` | 首次创建日期 |
| `updated` | 最近一次实质更新日期 |
| `series` / `order` | 连续内容的系列名称与顺序 |
| `draft` | `true` 时不进入生产网站 |
| `featured` | 是否优先展示 |

## 合规边界

- 不记录或公开客户姓名、证件、联系方式和账户信息。
- 不公开银行内部经营数据、授信材料、敏感制度或未经授权文件。
- 案例必须匿名化，并删除能够反向识别客户的组合信息。
- 金融市场内容注明时间、来源，并避免表达为个性化投资建议。
