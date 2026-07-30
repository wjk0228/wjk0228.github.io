---
title: 个人知识库：从 Hexo 到 Astro 的重构复盘
description: 复盘如何将旧 Hexo 博客升级为覆盖技术、考试、金融和趋势观察的长期知识系统。
type: project
domain: general
topics:
  - 知识管理
  - Web 开发
tags:
  - Astro
  - GitHub Pages
status: evergreen
created: 2026-07-30
updated: 2026-07-30
difficulty: intermediate
draft: false
featured: true
sourceType: original
---

## 项目目标

建设一套长期可维护、内容归属清晰、能够部署到 GitHub Pages 的个人知识库。

## 已完成的能力

- 统一的内容模型、分类与视觉系统。
- 全文搜索、页面目录、系列导航与关联阅读。
- 旧 Hexo 内容和插图迁移。
- SEO、RSS、可访问性与自动质量检查。
- GitHub Pages 自动发布、自定义域名和 HTTPS。

## 长期维护方式

网站已经进入持续维护状态。内容使用 Markdown 保存，通过 Obsidian 辅助整理，提交到 `main` 分支后由 GitHub Actions 自动检查并发布。

旧 Hexo 静态站保留在 `master` 分支，作为历史快照与回退来源。
