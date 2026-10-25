import fs from 'node:fs';
import path from 'node:path';
import { getAllPosts, toIsoDateTime, type PostImage } from './blog';
import { BLOG_LOCALES, type BlogLocale } from './blog-locales';
import { SITE_CONFIG } from './constants';

const FEED_SIZE = 50;

const IMAGE_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

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

/** The cover as an RSS enclosure, which feed readers show as the item's picture. */
function enclosure(image: PostImage): string {
  const { size } = fs.statSync(path.join(process.cwd(), 'public', image.src));
  const type = IMAGE_TYPES[path.extname(image.src)];
  return `\n      <enclosure url="${SITE_CONFIG.url}${image.src}" length="${size}" type="${type}" />`;
}

/** RFC 822 date, as RSS 2.0 requires. */
function toRssDate(date: string): string {
  return new Date(toIsoDateTime(date)).toUTCString();
}

/** The RSS 2.0 feed of one language's blog, served at its feedPath. */
export function createFeedResponse(locale: BlogLocale): Response {
  const config = BLOG_LOCALES[locale];
  const posts = getAllPosts(locale);
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
      <pubDate>${toRssDate(post.date)}</pubDate>${post.image ? enclosure(post.image) : ''}
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(config.name)}</title>
    <link>${SITE_CONFIG.url}${config.path}</link>
    <description>${escapeXml(config.description)}</description>
    <language>${config.htmlLang}</language>${lastUpdated ? `\n    <lastBuildDate>${toRssDate(lastUpdated)}</lastBuildDate>` : ''}
    <atom:link href="${SITE_CONFIG.url}${config.feedPath}" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
