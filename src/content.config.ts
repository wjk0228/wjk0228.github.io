import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const domain = z.enum(['technology', 'study', 'finance', 'insights', 'general']);
const status = z.enum([
  'seedling',
  'growing',
  'evergreen',
  'archived',
  'time-sensitive',
]);
const difficulty = z.enum(['beginner', 'intermediate', 'advanced']);

const common = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  domain,
  topics: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  status: status.default('seedling'),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  difficulty: difficulty.optional(),
  series: z.string().optional(),
  order: z.number().int().optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  legacyUrl: z.string().optional(),
  sourceType: z.enum(['original', 'migration', 'reference']).default('original'),
});

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: common.extend({ type: z.literal('note') }),
});

const exams = defineCollection({
  loader: glob({ base: './src/content/exams', pattern: '**/*.{md,mdx}' }),
  schema: common.extend({
    type: z.literal('exam'),
    exam: z.string(),
    subject: z.string().optional(),
  }),
});

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: common.extend({ type: z.literal('article') }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: common.extend({ type: z.literal('project') }),
});

const roadmaps = defineCollection({
  loader: glob({ base: './src/content/roadmaps', pattern: '**/*.{md,mdx}' }),
  schema: common.extend({ type: z.literal('roadmap') }),
});

const glossary = defineCollection({
  loader: glob({ base: './src/content/glossary', pattern: '**/*.{md,mdx}' }),
  schema: common.extend({ type: z.literal('glossary') }),
});

export const collections = {
  notes,
  exams,
  articles,
  projects,
  roadmaps,
  glossary,
};
