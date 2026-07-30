import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distRoot = join(siteRoot, 'dist');
const contentRoot = join(siteRoot, 'src', 'content');
const errors = [];

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

async function exists(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

const files = await walk(distRoot);
const htmlFiles = files.filter((file) => extname(file) === '.html');

for (const file of htmlFiles) {
  const label = relative(distRoot, file).replaceAll('\\', '/');
  const html = await readFile(file, 'utf8');
  const isRedirect = /^20\d{2}\/\d{2}\/\d{2}\//.test(label);

  if (!/<link rel="canonical" href="https:\/\/blog\.wjkun\.cn\//.test(html)) {
    errors.push(`${label}: 缺少正式域名 canonical`);
  }
  if (!isRedirect && !/<meta name="description" content="[^"]+">/.test(html)) {
    errors.push(`${label}: 缺少 description`);
  }
  if (!isRedirect && !/<script type="application\/ld\+json">/.test(html)) {
    errors.push(`${label}: 缺少结构化数据`);
  }
  if (
    (label === '404.html' || label === 'search/index.html' || label.startsWith('tags/') || isRedirect) &&
    !/<meta name="robots" content="noindex, follow">/.test(html)
  ) {
    errors.push(`${label}: 应设置 noindex`);
  }

  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const url = decodeURIComponent(match[1]);
    const clean = url.replace(/^[/\\]+|[/\\]+$/g, '');
    const targets =
      url === '/'
        ? [join(distRoot, 'index.html')]
        : [
            join(distRoot, url.replace(/^[/\\]+/, '')),
            join(distRoot, clean, 'index.html'),
          ];
    if (!(await Promise.any(targets.map(async (target) => {
      if (await exists(target)) return true;
      throw new Error('missing');
    })).catch(() => false))) {
      errors.push(`${label}: 站内资源不存在（${url}）`);
    }
  }
}

for (const required of [
  'og.png',
  'rss.xml',
  'robots.txt',
  'sitemap-index.xml',
  'sitemap-0.xml',
  'pagefind/pagefind.js',
]) {
  if (!(await exists(join(distRoot, required)))) errors.push(`缺少构建产物：${required}`);
}

const sitemap = await readFile(join(distRoot, 'sitemap-0.xml'), 'utf8');
if (/\/(?:search|tags)\//.test(sitemap) || /\/20\d{2}\/\d{2}\/\d{2}\//.test(sitemap)) {
  errors.push('sitemap-0.xml: 包含 noindex 或旧站跳转页面');
}

const rss = await readFile(join(distRoot, 'rss.xml'), 'utf8');
const rssItems = [...rss.matchAll(/<item>/g)].length;
const contentFiles = (await walk(contentRoot)).filter((file) =>
  ['.md', '.mdx'].includes(extname(file)),
);
const publishedContent = (
  await Promise.all(contentFiles.map((file) => readFile(file, 'utf8')))
).filter((source) => !/^draft:\s*true\s*$/m.test(source)).length;
if (rssItems !== publishedContent) {
  errors.push(`rss.xml: 预期 ${publishedContent} 条内容，实际 ${rssItems} 条`);
}

console.log(`构建质量检查：${htmlFiles.length} 个页面，RSS ${rssItems} 条，${errors.length} 个错误`);
errors.forEach((error) => console.error(`错误：${error}`));
if (errors.length) process.exit(1);
