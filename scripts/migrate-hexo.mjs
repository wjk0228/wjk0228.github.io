import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const legacyRoot = resolve(siteRoot, '..', 'myblog', 'source', '_posts');

const localizedImages = new Map([
  [
    'https://b2.kuibu.net/file/imgdisk/imgs/2022/02/ab880a59a4d225bc.png',
    '/images/migrated/spring-boot-roadmap.png',
  ],
  [
    'https://s4.ax1x.com/2022/02/04/HelDfI.png',
    '/images/migrated/spring-boot-project-structure.png',
  ],
  [
    'https://s4.ax1x.com/2022/02/05/Hmvu3q.png',
    '/images/migrated/spring-initializr-step-1.png',
  ],
  [
    'https://s4.ax1x.com/2022/02/05/Hmv3bF.png',
    '/images/migrated/spring-initializr-step-2.png',
  ],
  [
    'https://s4.ax1x.com/2022/02/05/HnekrQ.png',
    '/images/migrated/spring-boot-auto-config.png',
  ],
  [
    'https://s4.ax1x.com/2022/02/07/HMKhzn.png',
    '/images/migrated/spring-boot-run-process.png',
  ],
]);

const migrations = [
  {
    source: 'Node2020笔记（1）.md',
    target: 'src/content/notes/technology/legacy/nodejs-01.md',
    slug: 'Node2020笔记（1）',
    title: 'Node.js 学习笔记（一）：基础、模块与文件系统',
    description: '旧站 Node.js 系列第一篇，记录运行时特点、模块系统、文件系统与流的基础用法。',
    topics: ['Node.js'],
    tags: ['Node', '前端', 'JavaScript', '历史笔记'],
    series: 'Node.js 旧站学习笔记',
    order: 1,
  },
  {
    source: 'Node2020笔记（2）.md',
    target: 'src/content/notes/technology/legacy/nodejs-02.md',
    slug: 'Node2020笔记（2）',
    title: 'Node.js 学习笔记（二）：事件循环与事件驱动',
    description: '旧站 Node.js 系列第二篇，记录事件循环、EventEmitter 与事件驱动程序的基础概念。',
    topics: ['Node.js'],
    tags: ['Node', '前端', 'JavaScript', '事件循环', '历史笔记'],
    series: 'Node.js 旧站学习笔记',
    order: 2,
  },
  {
    source: 'Node2020笔记（3）.md',
    target: 'src/content/notes/technology/legacy/nodejs-03.md',
    slug: 'Node2020笔记（3）',
    title: 'Node.js 学习笔记（三）：Path 与 OS 模块',
    description: '旧站 Node.js 系列第三篇，整理路径处理、文件信息和操作系统模块的常用接口。',
    topics: ['Node.js'],
    tags: ['Node', '前端', 'JavaScript', 'Path', '历史笔记'],
    series: 'Node.js 旧站学习笔记',
    order: 3,
  },
  {
    source: 'Node2020笔记（4）.md',
    target: 'src/content/notes/technology/legacy/nodejs-04.md',
    slug: 'Node2020笔记（4）',
    title: 'Node.js 学习笔记（四）：URL 与网页数据抓取',
    description: '旧站 Node.js 系列第四篇，记录 URL 模块、HTTP 请求、Cheerio 解析与文件下载示例。',
    topics: ['Node.js'],
    tags: ['Node', '前端', 'JavaScript', '网络请求', '历史笔记'],
    series: 'Node.js 旧站学习笔记',
    order: 4,
  },
  {
    source: 'SpringBoot学习（一）.md',
    target: 'src/content/notes/technology/legacy/spring-boot-01.md',
    slug: 'SpringBoot学习（一）',
    title: 'Spring Boot 学习（一）：入门与项目创建',
    description: '旧站 Spring Boot 系列第一篇，记录框架特点、项目结构、配置方式和 Maven 基础配置。',
    topics: ['Java 后端'],
    tags: ['Spring Boot', 'Spring', 'Java', '后端', '历史笔记'],
    series: 'Spring Boot 旧站学习笔记',
    order: 1,
  },
  {
    source: 'SpringBoot学习（二）.md',
    target: 'src/content/notes/technology/legacy/spring-boot-02.md',
    slug: 'SpringBoot学习（二）',
    title: 'Spring Boot 学习（二）：自动装配与启动原理',
    description: '旧站 Spring Boot 系列第二篇，整理依赖管理、自动装配、主启动类与运行过程。',
    topics: ['Java 后端'],
    tags: ['Spring Boot', 'Spring', 'Java', '后端', '自动装配', '历史笔记'],
    series: 'Spring Boot 旧站学习笔记',
    order: 2,
  },
  {
    source: 'Typescript（一）.md',
    target: 'src/content/notes/technology/legacy/typescript-01.md',
    slug: 'Typescript（一）',
    title: 'TypeScript 初学（一）：基础数据类型',
    description: '旧站 TypeScript 系列第一篇，记录布尔值、数字、字符串、数组、元组、void 与 never 等类型。',
    topics: ['TypeScript'],
    tags: ['TypeScript', '前端', '类型系统', '历史笔记'],
    series: 'TypeScript 旧站学习笔记',
    order: 1,
  },
  {
    source: 'Typescript（二）.md',
    target: 'src/content/notes/technology/legacy/typescript-02.md',
    slug: 'Typescript（二）',
    title: 'TypeScript 初学（二）：函数',
    description: '旧站 TypeScript 系列第二篇，记录函数参数、默认值、剩余参数、重载与箭头函数。',
    topics: ['TypeScript'],
    tags: ['TypeScript', '前端', '函数', '历史笔记'],
    series: 'TypeScript 旧站学习笔记',
    order: 2,
  },
  {
    source: 'Typescript（三）.md',
    target: 'src/content/notes/technology/legacy/typescript-03.md',
    slug: 'Typescript（三）',
    title: 'TypeScript 初学（三）：类、继承与多态',
    description: '旧站 TypeScript 系列第三篇，整理类、继承、修饰符、静态成员、多态与抽象类。',
    topics: ['TypeScript'],
    tags: ['TypeScript', '前端', '面向对象', '历史笔记'],
    series: 'TypeScript 旧站学习笔记',
    order: 3,
  },
  {
    source: 'Typescript（四）.md',
    target: 'src/content/notes/technology/legacy/typescript-04.md',
    slug: 'Typescript（四）',
    title: 'TypeScript 初学（四）：接口',
    description: '旧站 TypeScript 系列第四篇的接口学习提纲，原文尚未继续补充。',
    topics: ['TypeScript'],
    tags: ['TypeScript', '前端', '接口', '历史笔记'],
    series: 'TypeScript 旧站学习笔记',
    order: 4,
  },
  {
    source: '算法基础.md',
    target: 'src/content/notes/technology/legacy/algorithm-basics.md',
    slug: '算法基础',
    title: '基础算法（一）：排序、查找与字符串',
    description: '旧站算法笔记，记录排序、二分查找、双指针、滑动窗口与字符串相关练习。',
    topics: ['数据结构与算法'],
    tags: ['算法', '排序', '查找', '历史笔记'],
    series: '基础算法旧站笔记',
    order: 1,
  },
];

function quote(value) {
  return JSON.stringify(value);
}

function yamlList(values) {
  return values.map((value) => `  - ${quote(value)}`).join('\n');
}

function parseLegacyDocument(source) {
  const normalized = source.replace(/\r\n/g, '\n').replace(/^\uFEFF/, '');
  const match = normalized.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) throw new Error('缺少合法 Front Matter');

  const header = match[1];
  const date = header.match(/^date:\s*(.+)$/m)?.[1]?.trim();
  if (!date) throw new Error('缺少 date');

  return { date, body: match[2] };
}

function normalizeBody(body) {
  let output = body
    .replace(/\r\n/g, '\n')
    .replace(/^\s*##\s*\n+/gm, '')
    .replace(
      /^!\[[^\]]*\]\((?:file:\/\/\/)?[A-Za-z]:.*\)\s*$/gm,
      '> 图像缺失：旧文章引用的是作者电脑本地文件，源文件未随仓库保存。',
    )
    .replace(
      /<img\s+src="([^"]+)"[^>]*\/?>/gi,
      (_, src) => `![旧文插图](${src})`,
    )
    .replace(/!\[\]\(([^)]+)\)/g, '![旧文插图]($1)')
    .trim();

  output = output.replace(/^#\s+.+\n+/m, '');
  for (const [remoteUrl, localUrl] of localizedImages) {
    output = output.replaceAll(remoteUrl, localUrl);
  }

  return [
    '> 迁移说明：本文来自旧 Hexo 站点，保留当时的学习记录与代码写法，可能不代表当前最佳实践。',
    '',
    output,
    '',
  ].join('\n');
}

for (const item of migrations) {
  const sourcePath = resolve(legacyRoot, item.source);
  const targetPath = resolve(siteRoot, item.target);
  const legacy = parseLegacyDocument(await readFile(sourcePath, 'utf8'));
  const created = legacy.date.slice(0, 10);
  const body = normalizeBody(legacy.body);

  const frontmatter = [
    '---',
    `title: ${quote(item.title)}`,
    `description: ${quote(item.description)}`,
    'type: note',
    'domain: technology',
    'topics:',
    yamlList(item.topics),
    'tags:',
    yamlList(item.tags),
    'status: archived',
    `created: ${created}`,
    `updated: ${created}`,
    'difficulty: beginner',
    `series: ${quote(item.series)}`,
    `order: ${item.order}`,
    'draft: false',
    'featured: false',
    `legacyUrl: ${quote(`/${created.replaceAll('-', '/')}/${item.slug}/`)}`,
    'sourceType: migration',
    '---',
    '',
  ].join('\n');

  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, frontmatter + body, 'utf8');
  console.log(`migrated: ${item.source} -> ${item.target}`);
}

console.log(`completed: ${migrations.length} legacy posts migrated`);
