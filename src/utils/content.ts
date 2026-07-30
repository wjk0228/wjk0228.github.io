import {
  getCollection,
  type CollectionEntry,
} from 'astro:content';

export const collectionNames = [
  'notes',
  'exams',
  'articles',
  'projects',
  'roadmaps',
  'glossary',
] as const;

export type AnyEntry =
  | CollectionEntry<'notes'>
  | CollectionEntry<'exams'>
  | CollectionEntry<'articles'>
  | CollectionEntry<'projects'>
  | CollectionEntry<'roadmaps'>
  | CollectionEntry<'glossary'>;

export async function getAllEntries(includeDrafts = !import.meta.env.PROD): Promise<AnyEntry[]> {
  const filter = ({ data }: AnyEntry) => includeDrafts || !data.draft;
  const [notes, exams, articles, projects, roadmaps, glossary] = await Promise.all([
    getCollection('notes', filter),
    getCollection('exams', filter),
    getCollection('articles', filter),
    getCollection('projects', filter),
    getCollection('roadmaps', filter),
    getCollection('glossary', filter),
  ]);

  return [...notes, ...exams, ...articles, ...projects, ...roadmaps, ...glossary];
}

export function entryHref(entry: AnyEntry) {
  return `/${entry.collection}/${entry.id}/`;
}

export function sortByUpdated(entries: AnyEntry[]) {
  return [...entries].sort((a, b) => b.data.updated.valueOf() - a.data.updated.valueOf());
}

export function getSeriesEntries(entry: AnyEntry, entries: AnyEntry[]) {
  if (!entry.data.series) return [];

  return entries
    .filter((candidate) => candidate.data.series === entry.data.series)
    .sort((a, b) => {
      const orderA = a.data.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.data.order ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB || a.data.created.valueOf() - b.data.created.valueOf();
    });
}

export function getRelatedEntries(entry: AnyEntry, entries: AnyEntry[], limit = 3) {
  const entryTopics = new Set(entry.data.topics);
  const entryTags = new Set(entry.data.tags);

  return entries
    .filter(
      (candidate) =>
        !(candidate.collection === entry.collection && candidate.id === entry.id),
    )
    .map((candidate) => {
      let score = candidate.data.domain === entry.data.domain ? 5 : 0;
      if (entry.data.series && candidate.data.series === entry.data.series) score += 8;
      score += candidate.data.topics.filter((topic) => entryTopics.has(topic)).length * 4;
      score += candidate.data.tags.filter((tag) => entryTags.has(tag)).length * 2;
      return { candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.candidate.data.updated.valueOf() - a.candidate.data.updated.valueOf(),
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
