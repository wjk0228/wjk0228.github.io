# Kun 的个人知识库

基于 Astro 构建的静态个人知识系统，覆盖：

- 技术成长
- 考试学习
- 金融知识
- 观察分享

## 本地运行

```bash
npm install
npm run dev
```

默认本地地址为 `http://localhost:4321`。

## 检查与构建

```bash
npm run check
npm run build
npm run verify
```

构建结果输出到 `dist/`。`npm run build` 会在 Astro 静态构建完成后自动生成 Pagefind 全文搜索索引。

如需在本地验证完整搜索功能：

```bash
npm run build
npm run preview
```

开发服务器不会生成搜索索引，因此 `/search/` 在 `npm run dev` 下会显示开发环境提示。

## 阶段 2 能力

- `/knowledge/`：统一知识目录，支持领域、内容类型、成熟度和关键词组合筛选
- `/search/`：基于 Pagefind 的静态全文搜索，无需后端服务
- `/tags/`：主题与标签入口，以及每个标签的聚合页
- 内容详情：自动目录、系列上下篇、标签跳转和关联阅读
- 内容排序：按最近更新时间统一呈现

## 阶段 4 能力

- 为所有正式页面生成 canonical、Open Graph、X 分享信息和 JSON-LD 结构化数据
- 自动生成 `sitemap-index.xml`、`robots.txt` 和包含全部知识内容的 `rss.xml`
- 为搜索页、标签聚合页、404 和旧站跳转页设置 `noindex`
- 为旧 Hexo 的 13 个原始地址生成兼容跳转页
- 提供键盘焦点、跳到正文、减少动态效果、移动端表格和打印样式
- 使用专属 `public/og.png` 作为社交分享封面
- 使用 `npm run verify` 统一执行类型、内容、构建和产物质量检查
- 提供 GitHub Actions 质量检查工作流，为上线阶段做准备

## 内容模型

内容入口位于 `src/content/`：

- `notes`：长期知识笔记
- `exams`：考试知识、真题与错题
- `articles`：时效性文章与个人观察
- `projects`：项目展示与复盘
- `roadmaps`：学习路线
- `glossary`：术语词条

字段约束统一定义在 `src/content.config.ts`。生产构建会排除 `draft: true` 的内容。

新增内容时优先维护 `domain`、`topics`、`tags`、`status`、`updated`；需要形成连续阅读路径时，再填写相同的 `series` 和递增的 `order`。

## Hexo 迁移

旧 Hexo 的 13 篇文章已全部纳入当前内容模型：

- 2 篇数据结构笔记在建设初期完成了人工清洗
- 11 篇 Node.js、TypeScript、Spring Boot 和算法笔记由迁移脚本生成
- 7 张仍可访问的外部插图已保存到站点内部
- 8 处未进入旧仓库的本地图片保留缺失提示，等待未来找到原文件后补回

重新执行迁移：

```bash
npm run migrate:hexo
```

迁移脚本只生成 `src/content/notes/technology/legacy/` 下的 11 篇历史文章，不会覆盖已经人工清洗的数据结构笔记。详细映射与遗留问题见 `docs/hexo-migration.md`。

旧 Hexo 源工程继续保存在同级 `../myblog/`，作为只读来源档案，不参与新站构建。

## GitHub Pages

站点正式域名为 `https://blog.wjkun.cn`。推送到 `main` 分支后，`.github/workflows/deploy-pages.yml` 会：

1. 使用 Node.js 24 安装锁定依赖
2. 执行完整的 `npm run verify`
3. 上传 `dist/` 静态产物
4. 发布到 GitHub Pages

Pages 仓库设置需要选择 GitHub Actions 作为构建来源，并将自定义域名设置为 `blog.wjkun.cn`。DNS 的 `blog` CNAME 应直接指向 `wjk0228.github.io`。

当前源码位于 `main` 分支，旧 Hexo 静态站保留在 `master` 分支作为历史回退快照。
