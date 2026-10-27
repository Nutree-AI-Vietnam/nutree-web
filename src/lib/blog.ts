import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { BLOG_CATEGORIES, getCategory, type BlogCategory } from './blog-categories';
import {
  BLOG_LOCALES,
  BLOG_LOCALE_LIST,
  DEFAULT_BLOG_LOCALE,
  otherLocale,
  type BlogLocale,
} from './blog-locales';
import { getImageSize } from './image-size';

/**
 * Vietnamese articles live in content/blog/<slug>.mdx and English ones in content/blog/en/<slug>.mdx;
 * content/blog/README.md documents the format. Each language is a separate blog with its own URLs
 * (see blog-locales.ts).
 */
export const POSTS_PER_PAGE = 12;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_FIELDS = [
  'title',
  'description',
  'date',
  'updated',
  'category',
  'tags',
  'image',
  'imageAlt',
  'draft',
  'translationOf',
];
/** Custom components a post may use; src/components/blog/mdx.tsx provides them. */
export const POST_COMPONENT_NAMES: readonly string[] = ['Callout', 'AppCta'];
// Vietnamese words are single syllables, so this runs faster than English reading speeds.
const WORDS_PER_MINUTE: Record<BlogLocale, number> = { vi: 230, en: 200 };
/** Largest image file a post may use. Keep in sync with MAX_BYTES in scripts/blog-image.mjs. */
export const MAX_IMAGE_BYTES = 400 * 1024;
// Google Discover and large image previews in search want pictures at least 1200 px wide.
const MIN_IMAGE_WIDTH = 1200;
const MAX_ALT_LENGTH = 150;
const IMAGE_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:jpe?g|png|webp)$/;
// ![alt text](/blog/<slug>/<name>.jpg "caption")
const BODY_IMAGE_PATTERN = /!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"([^"]*)")?\s*\)/g;

export interface PostImage {
  /** Path under public/, e.g. /blog/macro-la-gi/com-tam-du-ba-nhom-macro.jpg. */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Shown under a body image; the cover has none. */
  caption?: string;
}

export interface BlogPost {
  locale: BlogLocale;
  slug: string;
  url: string;
  title: string;
  description: string;
  /** Publish date, YYYY-MM-DD. */
  date: string;
  /** Last meaningful edit, YYYY-MM-DD; equals `date` when the post was never updated. */
  updated: string;
  category: BlogCategory;
  tags: string[];
  /** 16:9 cover for the post header, post cards and share cards. Only drafts may leave it out. */
  image?: PostImage;
  /** The cover, then the body images in order, for structured data and the image sitemap. */
  images: PostImage[];
  draft: boolean;
  readingMinutes: number;
  wordCount: number;
  /** Slug of the same article in the other language; set on both posts of a translated pair. */
  translationSlug?: string;
  /** MDX body without the frontmatter. */
  body: string;
}

interface ParsedFile {
  post: BlogPost;
  file: string;
  /** The `translationOf` frontmatter: slug of the original article in the other language. */
  translationOf?: string;
}

type PostsByLocale = Record<BlogLocale, BlogPost[]>;

const isProduction = process.env.NODE_ENV === 'production';
let cachedPosts: PostsByLocale | undefined;

/**
 * Every publishable post in one language, newest first. Drafts appear in development only. Throws
 * one error listing every invalid file in either language, so a bad post fails the build instead of
 * shipping broken.
 */
export function getAllPosts(locale: BlogLocale): BlogPost[] {
  return loadPosts()[locale];
}

function loadPosts(): PostsByLocale {
  // Production reads the folders once per build worker; development rereads them so new files show up.
  if (isProduction && cachedPosts) return cachedPosts;

  const errors: string[] = [];
  const visible = {} as Record<BlogLocale, ParsedFile[]>;

  for (const locale of BLOG_LOCALE_LIST) {
    const { contentDir } = BLOG_LOCALES[locale];
    const parsed: ParsedFile[] = [];
    for (const fileName of listPostFiles(contentDir)) {
      const file = `${contentDir}/${fileName}`;
      const result = parsePostFile(locale, fileName);
      if (result.errors.length > 0) {
        errors.push(`${file}\n${result.errors.map((error) => `  - ${error}`).join('\n')}`);
      } else if (result.post) {
        parsed.push({ post: result.post, file, translationOf: result.translationOf });
      }
    }
    visible[locale] = parsed.filter(({ post }) => !(isProduction && post.draft));
  }

  const targets = Object.fromEntries(
    BLOG_LOCALE_LIST.map((locale) => [
      locale,
      {
        slugs: new Set(visible[locale].map(({ post }) => post.slug)),
        categorySlugs: new Set(visible[locale].map(({ post }) => post.category.slug)),
      },
    ])
  ) as Record<BlogLocale, LinkTargets>;

  for (const locale of BLOG_LOCALE_LIST) {
    for (const { post, file } of visible[locale]) {
      const linkErrors = findBrokenBlogLinks(post.body, targets);
      if (linkErrors.length > 0) {
        errors.push(`${file}\n${linkErrors.map((error) => `  - ${error}`).join('\n')}`);
      }
    }
  }
  errors.push(...pairTranslations(visible));

  if (errors.length > 0) {
    throw new Error(
      `Invalid blog posts (see content/blog/README.md for the format):\n\n${errors.join('\n\n')}`
    );
  }

  const posts = Object.fromEntries(
    BLOG_LOCALE_LIST.map((locale) => [
      locale,
      visible[locale]
        .map(({ post }) => post)
        .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)),
    ])
  ) as PostsByLocale;

  if (isProduction) cachedPosts = posts;
  return posts;
}

/**
 * Links each `translationOf` post with its original in the other language, both ways, so either
 * page can point search engines and readers to the other.
 */
function pairTranslations(visible: Record<BlogLocale, ParsedFile[]>): string[] {
  const errors: string[] = [];

  for (const locale of BLOG_LOCALE_LIST) {
    const other = otherLocale(locale);
    for (const { post, file, translationOf } of visible[locale]) {
      if (!translationOf) continue;
      const target = visible[other].find((candidate) => candidate.post.slug === translationOf)?.post;
      if (!target) {
        errors.push(
          `${file}\n  - "translationOf": no published post in ${BLOG_LOCALES[other].contentDir}/ has the slug "${translationOf}"`
        );
      } else if (
        (target.translationSlug && target.translationSlug !== post.slug) ||
        (post.translationSlug && post.translationSlug !== target.slug)
      ) {
        errors.push(
          `${file}\n  - "translationOf": ${target.url} is already paired with another post; each article has at most one translation`
        );
      } else {
        post.translationSlug = target.slug;
        target.translationSlug = post.slug;
      }
    }
  }
  return errors;
}

export function getPostBySlug(locale: BlogLocale, slug: string): BlogPost | undefined {
  return getAllPosts(locale).find((post) => post.slug === slug);
}

/** The same article in the other language, if it has been translated. */
export function getTranslation(post: BlogPost): BlogPost | undefined {
  return post.translationSlug ? getPostBySlug(otherLocale(post.locale), post.translationSlug) : undefined;
}

export function getPostsByCategory(locale: BlogLocale, categorySlug: string): BlogPost[] {
  return getAllPosts(locale).filter((post) => post.category.slug === categorySlug);
}

/** Categories that have at least one post, in their configured order. */
export function getActiveCategories(locale: BlogLocale): BlogCategory[] {
  const used = new Set(getAllPosts(locale).map((post) => post.category.slug));
  return BLOG_CATEGORIES[locale].filter((category) => used.has(category.slug));
}

/** Same-category posts first, then the newest others, so short categories still fill the row. */
export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const others = getAllPosts(post.locale).filter((candidate) => candidate.slug !== post.slug);
  const sameCategory = others.filter((candidate) => candidate.category.slug === post.category.slug);
  const rest = others.filter((candidate) => candidate.category.slug !== post.category.slug);
  return [...sameCategory, ...rest].slice(0, limit);
}

/**
 * hreflang → path for a page that exists in more than one language, plus x-default on the default
 * language's version. Undefined when only one language has the page: there is nothing to pair.
 */
export function getLanguageAlternates(
  paths: Partial<Record<BlogLocale, string>>
): Record<string, string> | undefined {
  const locales = BLOG_LOCALE_LIST.filter((locale) => paths[locale]);
  if (locales.length < 2) return undefined;
  return {
    ...Object.fromEntries(locales.map((locale) => [BLOG_LOCALES[locale].htmlLang, paths[locale] as string])),
    'x-default': paths[DEFAULT_BLOG_LOCALE] ?? (paths[locales[0]] as string),
  };
}

/** Paths of a post and its translation, keyed by language. */
export function getPostPaths(post: BlogPost): Partial<Record<BlogLocale, string>> {
  const translation = getTranslation(post);
  return { [post.locale]: post.url, ...(translation && { [translation.locale]: translation.url }) };
}

/** Paths of a category page in every language where that topic has posts. */
export function getCategoryPaths(category: BlogCategory): Partial<Record<BlogLocale, string>> {
  return Object.fromEntries(
    BLOG_LOCALE_LIST.flatMap((locale) => {
      const match = getActiveCategories(locale).find((candidate) => candidate.id === category.id);
      return match ? [[locale, getCategoryPath(locale, match.slug)]] : [];
    })
  );
}

export function getTotalPages(count: number): number {
  return Math.max(1, Math.ceil(count / POSTS_PER_PAGE));
}

export function getPageItems<T>(items: T[], page: number): T[] {
  const start = (page - 1) * POSTS_PER_PAGE;
  return items.slice(start, start + POSTS_PER_PAGE);
}

/** Static params for pagination routes: pages 2..n, since page 1 is the unnumbered listing. */
export function getExtraPageNumbers(count: number): string[] {
  return Array.from({ length: getTotalPages(count) - 1 }, (_, index) => String(index + 2));
}

/** Parses a page segment such as "2"; anything that is not a page past the first is undefined. */
export function parsePageNumber(segment: string, count: number): number | undefined {
  if (!/^\d+$/.test(segment)) return undefined;
  const page = Number(segment);
  return page >= 2 && page <= getTotalPages(count) ? page : undefined;
}

export function getCategoryPath(locale: BlogLocale, categorySlug: string, page = 1): string {
  const { path: blogPath, categorySegment, pageSegment } = BLOG_LOCALES[locale];
  const base = `${blogPath}/${categorySegment}/${categorySlug}`;
  return page > 1 ? `${base}/${pageSegment}/${page}` : base;
}

export function getBlogPagePath(locale: BlogLocale, page = 1): string {
  const { path: blogPath, pageSegment } = BLOG_LOCALES[locale];
  return page > 1 ? `${blogPath}/${pageSegment}/${page}` : blogPath;
}

/**
 * "12 tháng 10, 2026" or "October 12, 2026". Dates are calendar days, so format in UTC to avoid
 * shifting them.
 */
export function formatPostDate(date: string, locale: BlogLocale): string {
  return new Intl.DateTimeFormat(BLOG_LOCALES[locale].dateLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

/** ISO timestamp at midnight Vietnam time, for structured data and Open Graph. */
export function toIsoDateTime(date: string): string {
  return `${date}T00:00:00+07:00`;
}

/**
 * Every language's posts live under this folder. Next bundles the files a server function may read by
 * following the paths written in this module, so the literal root must come first: joining
 * process.cwd() with a variable folder pulled the whole repo (node_modules and the build cache) into
 * the blog functions, past Vercel's 250 MB limit.
 */
const BLOG_CONTENT_ROOT = path.join(process.cwd(), 'content', 'blog');

/** Absolute path of a language's contentDir, which is relative to the repo root. */
function contentDirPath(contentDir: string): string {
  return path.join(BLOG_CONTENT_ROOT, path.relative(path.join('content', 'blog'), contentDir));
}

function listPostFiles(contentDir: string): string[] {
  const dir = contentDirPath(contentDir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((fileName) => fileName.endsWith('.mdx'))
    .sort();
}

function parsePostFile(
  locale: BlogLocale,
  fileName: string
): { post?: BlogPost; translationOf?: string; errors: string[] } {
  const errors: string[] = [];
  const config = BLOG_LOCALES[locale];
  const other = BLOG_LOCALES[otherLocale(locale)];
  const slug = fileName.replace(/\.mdx$/, '');
  // Route segments under the blog path that a post slug would collide with.
  const reserved = new Set([config.categorySegment, config.pageSegment, 'feed']);

  if (!SLUG_PATTERN.test(slug) || slug.length > 90) {
    errors.push(
      'file name must be the URL slug: lowercase a-z, 0-9 and single hyphens, no Vietnamese accents (e.g. pho-bo-bao-nhieu-calo.mdx)'
    );
  }
  if (reserved.has(slug)) {
    errors.push(`"${slug}" is reserved by a blog route; choose another file name`);
  }

  const raw = fs.readFileSync(path.join(contentDirPath(config.contentDir), fileName), 'utf8').replace(/^\uFEFF/, '');
  const match = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(raw);
  if (!match) {
    errors.push('file must start with a YAML frontmatter block between two "---" lines');
    return { errors };
  }

  let data: unknown;
  try {
    data = parseYaml(match[1]);
  } catch (error) {
    errors.push(`frontmatter is not valid YAML (wrap titles and descriptions in double quotes): ${(error as Error).message}`);
    return { errors };
  }
  if (!isRecord(data)) {
    errors.push('frontmatter must be a list of "key: value" fields');
    return { errors };
  }

  const body = raw.slice(match[0].length).trim();

  for (const key of Object.keys(data)) {
    if (!ALLOWED_FIELDS.includes(key)) {
      errors.push(`unknown frontmatter field "${key}"; allowed fields: ${ALLOWED_FIELDS.join(', ')}`);
    }
  }

  const title = requireText(data.title, 'title', 120, errors);
  const description = requireText(data.description, 'description', 300, errors);
  const date = requireDate(data.date, 'date', errors);
  const updated = data.updated === undefined ? date : requireDate(data.updated, 'updated', errors);
  if (date && updated && updated < date) {
    errors.push('"updated" cannot be earlier than "date"');
  }

  const category = typeof data.category === 'string' ? getCategory(locale, data.category) : undefined;
  if (!category) {
    errors.push(`"category" must be one of: ${BLOG_CATEGORIES[locale].map((item) => item.slug).join(', ')}`);
  }

  let translationOf: string | undefined;
  if (data.translationOf !== undefined) {
    if (typeof data.translationOf !== 'string' || !SLUG_PATTERN.test(data.translationOf)) {
      errors.push(`"translationOf" must be the slug of the original post in ${other.contentDir}/, e.g. pho-bo-bao-nhieu-calo`);
    } else {
      translationOf = data.translationOf;
    }
  }
  // A translation may reuse its original's pictures instead of copying them.
  const imageFolders = [
    `${config.path}/${slug}/`,
    ...(translationOf ? [`${other.path}/${translationOf}/`] : []),
  ];

  let tags: string[] = [];
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags) || !data.tags.every((tag) => typeof tag === 'string' && tag.trim())) {
      errors.push(`"tags" must be a list of words or phrases, e.g. ${locale === 'vi' ? '["phở", "calo"]' : '["pho", "calories"]'}`);
    } else {
      tags = Array.from(new Set(data.tags.map((tag: string) => tag.trim())));
    }
  }

  let image: PostImage | undefined;
  if (data.image !== undefined) {
    const file = readImageFile(imageFolders, data.image, '"image"', errors);
    const alt = readAltText(data.imageAlt, '"imageAlt"', errors);
    if (file && Math.abs(file.width / file.height - 16 / 9) > 0.01) {
      errors.push(`"image" is ${file.width}×${file.height}; covers must be 16:9, which npm run blog:image makes by default`);
    }
    if (file && alt) image = { ...file, alt };
  } else if (data.imageAlt !== undefined) {
    errors.push('"imageAlt" is set but "image" is missing');
  } else if (data.draft !== true) {
    errors.push('"image" is required: every published post needs a 16:9 cover (see "Images" in content/blog/README.md)');
  }

  if (data.draft !== undefined && typeof data.draft !== 'boolean') {
    errors.push('"draft" must be true or false');
  }

  if (!body) {
    errors.push('article body is empty');
  }
  if (hasHeadingLevelOne(body)) {
    errors.push('remove "# " headings: the page already shows the title as the only H1, so sections start at "## "');
  }
  errors.push(...findMdxProblems(body));
  const bodyImages = readBodyImages(imageFolders, body, image, errors);

  if (errors.length > 0 || !title || !description || !date || !updated || !category) {
    return { errors };
  }

  const wordCount = countWords(body);

  return {
    errors,
    translationOf,
    post: {
      locale,
      slug,
      url: `${config.path}/${slug}`,
      title,
      description,
      date,
      updated,
      category,
      tags,
      image,
      images: image ? [image, ...bodyImages] : bodyImages,
      draft: data.draft === true,
      readingMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE[locale])),
      wordCount,
      body,
    },
  };
}

function requireText(value: unknown, field: string, maxLength: number, errors: string[]): string | undefined {
  if (typeof value !== 'string' || !value.trim()) {
    errors.push(`"${field}" is required and must be text`);
    return undefined;
  }
  const text = value.trim().replace(/\s+/g, ' ');
  if (text.length > maxLength) {
    errors.push(`"${field}" is ${text.length} characters; keep it under ${maxLength}`);
  }
  return text;
}

function requireDate(value: unknown, field: string, errors: string[]): string | undefined {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) {
    errors.push(`"${field}" must be a date written as YYYY-MM-DD`);
    return undefined;
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    errors.push(`"${field}" ${value} is not a real calendar date`);
    return undefined;
  }
  // One day of slack covers the gap between Vietnam time and the UTC build clock.
  if (parsed.getTime() > Date.now() + 24 * 60 * 60 * 1000) {
    errors.push(`"${field}" ${value} is in the future; pages are built ahead of time, so use today's date`);
  }
  return value;
}

interface LinkTargets {
  slugs: Set<string>;
  categorySlugs: Set<string>;
}

/**
 * Links to a post or category page, in either language's blog, that would 404. Category pages exist
 * only once they have a post.
 */
function findBrokenBlogLinks(body: string, targets: Record<BlogLocale, LinkTargets>): string[] {
  const errors: string[] = [];
  const pattern = /(?:\]\(|href=["'])(?:https:\/\/nutreeai\.com)?(\/en)?\/blog\/([^)"'\s#?]+)/g;
  // Images live under /blog/<slug>/ too; readBodyImages checks those.
  const links = withoutCode(body).replace(BODY_IMAGE_PATTERN, '');

  for (const [, en, target] of links.matchAll(pattern)) {
    const locale: BlogLocale = en ? 'en' : 'vi';
    const { path: blogPath, categorySegment, pageSegment } = BLOG_LOCALES[locale];
    const { slugs, categorySlugs } = targets[locale];
    const parts = target.replace(/\/$/, '').split('/');
    if (parts[0] === categorySegment) {
      if (!categorySlugs.has(parts[1] ?? '')) {
        errors.push(`link to ${blogPath}/${target}: no such category, or it has no published posts yet`);
      }
    } else if (parts[0] === pageSegment || parts[0] === 'feed.xml') {
      continue;
    } else if (parts.length > 1 || !slugs.has(parts[0])) {
      errors.push(`link to ${blogPath}/${target}: no published post has that slug`);
    }
  }
  return errors;
}

/** MDX mistakes whose compiler errors are cryptic, reported in plain words instead. */
function findMdxProblems(body: string): string[] {
  const text = withoutCode(body);
  const problems: string[] = [];

  if (text.includes('<!--')) {
    problems.push('remove HTML comments (<!-- -->); MDX cannot parse them');
  } else if (/(^|[^\\])<(?![A-Za-z/])/m.test(text)) {
    problems.push('a "<" that does not open a component breaks MDX; write "dưới" or "nhỏ hơn", or escape it as \\<');
  }
  if (/(^|[^\\])[{}]/m.test(text)) {
    problems.push('curly braces { } are code in MDX; remove them or escape them as \\{ and \\}');
  }

  const available = POST_COMPONENT_NAMES.map((component) => `<${component}>`).join(', ');
  const tagNames = new Set(Array.from(text.matchAll(/<([A-Za-z][\w.-]*)/g), (match) => match[1]));
  for (const name of tagNames) {
    if (POST_COMPONENT_NAMES.includes(name)) continue;
    if (/^(?:https?|mailto)$|^www\./i.test(name)) {
      problems.push('links in angle brackets <https://...> break MDX; write [link text](https://...) instead');
    } else if (/^[a-z]/.test(name)) {
      problems.push(`raw HTML <${name}> is not supported; use Markdown or ${available}`);
    } else {
      problems.push(`<${name}> is not an available component; use ${available} or plain Markdown`);
    }
  }

  return problems;
}

/**
 * Images in the body, each alone between blank lines so it renders as a figure, with alt text and a
 * caption written as the Markdown title.
 */
function readBodyImages(
  folders: string[],
  body: string,
  cover: PostImage | undefined,
  errors: string[]
): PostImage[] {
  const images: PostImage[] = [];
  const lines = withoutCode(body).split('\n');

  if (lines.some((line) => /!\[[^\]]*\]\[/.test(line))) {
    errors.push('write images as ![alt text](/blog/<slug>/<name>.jpg "caption"), not as ![alt text][reference]');
  }

  lines.forEach((line, index) => {
    const found = Array.from(line.matchAll(BODY_IMAGE_PATTERN));
    for (const [markdown, altText, src, captionText] of found) {
      const label = `image ${src}`;
      if (found.length > 1 || line.trim() !== markdown || lines[index - 1]?.trim() || lines[index + 1]?.trim()) {
        errors.push(`${label} must be on a line of its own, with a blank line above and below`);
      }
      const file = readImageFile(folders, src, 'image', errors);
      const alt = readAltText(altText, `alt text of ${label}`, errors);
      const caption = captionText?.trim().replace(/\s+/g, ' ');
      if (!caption) {
        errors.push(`${label} needs a caption: ![alt text](${src} "one sentence shown under the picture")`);
      }
      if (src === cover?.src) {
        errors.push(`${label} is the cover, which already shows above the post; pick another picture`);
      } else if (images.some((image) => image.src === src)) {
        errors.push(`${label} appears twice; show each picture once`);
      } else if (file && alt && caption) {
        images.push({ ...file, alt, caption });
      }
    }
  });
  return images;
}

/**
 * Checks that an image is a file in one of the post's folders (its own, or its original's when it is a
 * translation), big enough and small enough, and reads its size.
 */
function readImageFile(folders: string[], src: unknown, label: string, errors: string[]) {
  const folder = typeof src === 'string' ? folders.find((candidate) => src.startsWith(candidate)) : undefined;
  if (typeof src !== 'string' || !folder || !IMAGE_NAME_PATTERN.test(src.slice(folder.length))) {
    errors.push(
      `${label} ${String(src)} must be saved in public${folders[0]}, named in lowercase words and hyphens and ending in .jpg, .png or .webp`
    );
    return undefined;
  }
  const file = path.join(process.cwd(), 'public', src);
  if (!fs.existsSync(file)) {
    errors.push(`${label} ${src} does not exist; save it as public${src}`);
    return undefined;
  }
  const data = fs.readFileSync(file);
  const size = getImageSize(data);
  if (!size) {
    errors.push(`${label} ${src} is not a readable JPEG, PNG or WebP image`);
    return undefined;
  }
  if (size.width < MIN_IMAGE_WIDTH) {
    errors.push(`${label} ${src} is ${size.width} px wide; images must be at least ${MIN_IMAGE_WIDTH} px wide`);
  }
  if (data.length > MAX_IMAGE_BYTES) {
    errors.push(
      `${label} ${src} is ${Math.round(data.length / 1024)} KB; keep images under ${MAX_IMAGE_BYTES / 1024} KB (npm run blog:image compresses them)`
    );
  }
  return { src, ...size };
}

function readAltText(value: unknown, label: string, errors: string[]): string | undefined {
  const alt = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
  if (!alt) {
    errors.push(`${label} is required: say what the picture shows, in the post's language`);
    return undefined;
  }
  if (alt.length > MAX_ALT_LENGTH) {
    errors.push(`${label} is ${alt.length} characters; keep it under ${MAX_ALT_LENGTH}`);
  }
  return alt;
}

function hasHeadingLevelOne(body: string): boolean {
  return /^#[ \t]+\S/m.test(withoutCode(body));
}

/** The body without fenced code blocks and inline code, where MDX syntax rules do not apply. */
function withoutCode(body: string): string {
  return body.replace(/^(```|~~~)[\s\S]*?^\1/gm, '').replace(/`[^`\n]*`/g, '');
}

function countWords(body: string): number {
  const text = withoutCode(body)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/[#>*_`|[\]-]/g, ' ');
  return text.split(/\s+/).filter(Boolean).length;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
