import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../data/site';
import { entryHref, getAllEntries, sortByUpdated } from '../utils/content';

export async function GET(context: APIContext) {
  const entries = sortByUpdated(await getAllEntries(false));

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.domain,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.updated,
      link: entryHref(entry),
      categories: [...new Set([...entry.data.topics, ...entry.data.tags])],
      author: site.author,
    })),
    customData: '<language>zh-CN</language>',
  });
}
