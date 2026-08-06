# 题库检索台

一个面向考试复习的本地题库搜索网站。已内置《2026线上知识竞赛题库1100（全）》的 1100 道题，题库文件只在浏览器中解析和保存，可部署到 GitHub Pages。

## 当前版本

- 默认载入 373 道单选题、339 道多选题、388 道判断题
- 按题型筛选，搜索题干、选项、答案、解析、标签、学科和难度
- 直接导入原始模板格式的 XLSX / XLS，也兼容 JSON / CSV
- 同时搜索题干、选项、答案、解析和分类
- 多关键词组合检索
- 题库保存在当前浏览器，不上传服务器
- 已配置 GitHub Pages 自动发布
- 针对手机屏幕优化搜索、筛选、题目卡片和答案展开操作

固定格式解析逻辑位于 `src/lib/questionBank.ts`，可识别模板中的单选题、多选题和判断题工作表以及 A–J 选项。

## 本地运行

```bash
npm install
npm run dev
```

## GitHub Pages 发布

1. 在 GitHub 新建仓库并将本项目推送到 `main` 分支。
2. 在仓库 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。
3. 此后每次推送到 `main`，`.github/workflows/deploy-pages.yml` 都会自动构建和发布。

## 通用导入字段

JSON 可直接使用数组，或使用 `{ "questions": [...] }` / `{ "data": [...] }`。CSV 第一行为字段名。

| 含义 | 当前可识别字段 |
| --- | --- |
| 题干 | `stem`、`question`、`title`、`题干`、`题目` |
| 选项 | `options`、`choices`、`选项`，或独立的 `A` 至 `F` 列 |
| 答案 | `answer`、`答案`、`correctAnswer` |
| 解析 | `explanation`、`analysis`、`解析` |
| 分类 | `category`、`subject`、`章节`、`分类`、`科目` |

> 题库若包含敏感内容，请使用私有仓库；网站本身不会把导入文件提交到仓库。
