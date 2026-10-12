import { BLOG_DESCRIPTION, BLOG_FEED_PATH, BLOG_NAME, BLOG_PATH, getAllPosts, toIsoDateTime } from '@/lib/blog';
import { SITE_CONFIG } from '@/lib/constants';

// Built once per deploy, like the pages it lists.
export const dynamic = 'force-static';

const FEED_SIZE = 50;

const XML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => XML_ENTITIES[char]);
}

/** RFC 822 date, as RSS 2.0 requires. */
function toRssDate(date: string): string {
  return new Date(toIsoDateTime(date)).toUTCString();
}

export function GET() {
  const posts = getAllPosts();
  const lastUpdated = posts.reduce<string | undefined>(
    (latest, post) => (!latest || post.updated > latest ? post.updated : latest),
    undefined
  );

  const items = posts.slice(0, FEED_SIZE).map((post) => {
    const url = `${SITE_CONFIG.url}${post.url}`;
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(post.category.label)}</category>
      <pubDate>${toRssDate(post.date)}</pubDate>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(BLOG_NAME)}</title>
    <link>${SITE_CONFIG.url}${BLOG_PATH}</link>
    <description>${escapeXml(BLOG_DESCRIPTION)}</description>
    <language>vi</language>${lastUpdated ? `\n    <lastBuildDate>${toRssDate(lastUpdated)}</lastBuildDate>` : ''}
    <atom:link href="${SITE_CONFIG.url}${BLOG_FEED_PATH}" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
