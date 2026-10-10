import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    planted: z.coerce.date(),
    tended: z.coerce.date().optional(),
    stage: z.enum(['seedling', 'budding', 'evergreen']),
    tags: z.array(z.enum(['learnings', 'thoughts', 'play'])),
  }),
});

export const collections = { posts };
