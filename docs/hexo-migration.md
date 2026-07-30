# Hexo 内容迁移记录

## 迁移范围

来源目录为 `../myblog/source/_posts/`。审计时共发现 13 篇 Markdown 文章，不存在 Hexo 的 `post_asset_folder` 随文资源目录。

所有文章均已进入 Astro 内容集合，并统一补充以下字段：

- 内容类型、知识领域、主题与标签
- 内容成熟度、创建与更新时间
- 系列名称与系列顺序
- 旧站地址和 `sourceType: migration` 来源标记

历史学习笔记统一标记为 `archived`，页面会明确显示“历史存档”，避免旧代码和旧版本知识被误认为当前最佳实践。

## 内容映射

| Hexo 原文 | Astro 内容 | 处理方式 |
| --- | --- | --- |
| 数据结构（一） | `notes/technology/data-structure-basics.md` | 人工清洗并保留原始插图 |
| 数据结构（二） | `notes/technology/linear-list.md` | 从占位内容整理为待继续完善的笔记 |
| Node2020笔记（1） | `notes/technology/legacy/nodejs-01.md` | 自动迁移 |
| Node2020笔记（2） | `notes/technology/legacy/nodejs-02.md` | 自动迁移 |
| Node2020笔记（3） | `notes/technology/legacy/nodejs-03.md` | 自动迁移 |
| Node2020笔记（4） | `notes/technology/legacy/nodejs-04.md` | 自动迁移 |
| SpringBoot学习（一） | `notes/technology/legacy/spring-boot-01.md` | 自动迁移并本地化插图 |
| SpringBoot学习（二） | `notes/technology/legacy/spring-boot-02.md` | 自动迁移并本地化插图 |
| Typescript（一） | `notes/technology/legacy/typescript-01.md` | 自动迁移 |
| Typescript（二） | `notes/technology/legacy/typescript-02.md` | 自动迁移 |
| Typescript（三） | `notes/technology/legacy/typescript-03.md` | 自动迁移 |
| Typescript（四） | `notes/technology/legacy/typescript-04.md` | 自动迁移，保留原文未完成状态 |
| 算法基础 | `notes/technology/legacy/algorithm-basics.md` | 自动迁移并标记缺失图片 |

## 资源处理

旧文章共引用 7 张仍可访问的正文插图，现已保存到 `public/images/migrated/`，正文不再依赖原图床。

《算法基础》另有 8 处图片指向旧电脑的 `QQ Files` 或 Typora 临时目录。图片本身没有进入 Git 仓库，无法从现有工程恢复。迁移结果在每个原始位置保留统一的图片缺失提示，没有伪造或静默删除。

## 可重复执行

执行以下命令可从只读 Hexo 来源重新生成 11 篇未经人工重写的迁移文章：

```bash
npm run migrate:hexo
```

迁移规则位于 `scripts/migrate-hexo.mjs`，包含文件映射、元数据、系列顺序、本地图片缺失处理和远程图片本地化映射。
