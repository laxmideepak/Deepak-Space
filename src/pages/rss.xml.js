import rss from '@astrojs/rss';
import { getPosts } from '../lib';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: 'Deepak’s Tokenizer',
    description: 'Learnings from work, thoughts on life, and the games I play.',
    site: context.site,
    trailingSlash: false,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.planted,
      link: `/posts/${p.id}`,
    })),
  });
}
