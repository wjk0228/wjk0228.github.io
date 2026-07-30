import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const contentRoot = join(siteRoot, 'src', 'content');
const publicRoot = join(siteRoot, 'public');
const errors = [];
const warnings = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? walk(path) : path;
    }),
  );
  return files.flat();
}

function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!match) return undefined;
  const value = match[1].trim();
  if (value.startsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      return value.slice(1, -1);
    }
  }
  return value;
}

function list(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*\\n((?:\\s+-\\s+.+\\n?)*)`, 'm'));
  if (!match) return [];
  return match[1]
    .split('\n')
    .map((line) => line.replace(/^\s*-\s+/, '').trim())
    .filter(Boolean)
    .map((value) => {
      if (!value.startsWith('"')) return value;
      try {
        return JSON.parse(value);
      } catch {
        return value.slice(1, -1);
      }
    });
}

const files = (await walk(contentRoot)).filter((file) => ['.md', '.mdx'].includes(extname(file)));
const titles = new Map();
const seriesOrders = new Map();

for (const file of files) {
  const label = relative(contentRoot, file).replaceAll('\\', '/');
  const source = (await readFile(file, 'utf8')).replace(/\r\n/g, '\n');
  const document = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!document) {
    errors.push(`${label}: 缺少合法 Front Matter`);
    continue;
  }

  const [, frontmatter, body] = document;
  const required = [
    'title',
    'description',
    'type',
    'domain',
    'status',
    'created',
    'updated',
    'draft',
    'sourceType',
  ];
  for (const key of required) {
    if (!scalar(frontmatter, key)) errors.push(`${label}: 缺少 ${key}`);
  }

  const title = scalar(frontmatter, 'title');
  const description = scalar(frontmatter, 'description');
  const created = scalar(frontmatter, 'created');
  const updated = scalar(frontmatter, 'updated');
  const status = scalar(frontmatter, 'status');
  const series = scalar(frontmatter, 'series');
  const order = scalar(frontmatter, 'order');
  const tags = list(frontmatter, 'tags');
  const topics = list(frontmatter, 'topics');

  if (title) {
    if (titles.has(title)) errors.push(`${label}: 标题与 ${titles.get(title)} 重复`);
    titles.set(title, label);
  }
  if (description && (description.length < 18 || description.length > 160)) {
    warnings.push(`${label}: description 长度为 ${description.length}，建议保持在 18–160 字`);
  }
  if (tags.length === 0 && topics.length === 0) warnings.push(`${label}: 未设置主题或标签`);
  if (created && updated && new Date(updated) < new Date(created)) {
    errors.push(`${label}: updated 早于 created`);
  }
  if (status === 'time-sensitive' && updated) {
    const age = (Date.now() - new Date(updated).getTime()) / 86_400_000;
    if (age > 180) warnings.push(`${label}: 时效内容已有 ${Math.floor(age)} 天未更新`);
  }
  if (series) {
    if (!order || !Number.isInteger(Number(order))) {
      errors.push(`${label}: 系列内容缺少整数 order`);
    } else {
      const key = `${series}#${order}`;
      if (seriesOrders.has(key)) {
        errors.push(`${label}: 系列顺序与 ${seriesOrders.get(key)} 重复（${key}）`);
      }
      seriesOrders.set(key, label);
    }
  }
  if (/^#\s+/m.test(body)) errors.push(`${label}: 正文不应再包含一级标题`);

  for (const match of body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
    const [, alt, url] = match;
    if (!alt.trim()) errors.push(`${label}: 图片缺少替代文字（${url}）`);
    if (/^https?:\/\//.test(url)) errors.push(`${label}: 仍在使用远程正文图片（${url}）`);
    if (url.startsWith('/')) {
      const target = join(publicRoot, decodeURIComponent(url).replace(/^[/\\]+/, ''));
      try {
        if (!(await stat(target)).isFile()) errors.push(`${label}: 图片不存在（${url}）`);
      } catch {
        errors.push(`${label}: 图片不存在（${url}）`);
      }
    }
  }
}

console.log(`内容质量检查：${files.length} 篇，${errors.length} 个错误，${warnings.length} 个提醒`);
warnings.forEach((warning) => console.warn(`提醒：${warning}`));
errors.forEach((error) => console.error(`错误：${error}`));
if (errors.length) process.exit(1);
