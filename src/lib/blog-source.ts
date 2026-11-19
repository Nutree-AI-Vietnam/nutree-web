import fs from 'node:fs';
import path from 'node:path';
import { getImageSize } from './image-size';

export type PublicImageFile =
  | { status: 'ok'; width: number; height: number; byteLength: number }
  | { status: 'missing' }
  | { status: 'unreadable'; byteLength: number };

/**
 * Every language's posts live under this folder. Next bundles the files a server function may read by
 * following the paths written in this module, so the literal root must come first: joining
 * process.cwd() with a variable folder pulled the whole repo (node_modules and the build cache) into
 * the blog functions, past Vercel's 250 MB limit.
 *
 * The vinext build aliases `nutree-blog-source` to blog-source.vinext.ts, which embeds the same
 * files. Workers have no project directory to read at request time.
 */
const BLOG_CONTENT_ROOT = path.join(process.cwd(), 'content', 'blog');

/** Absolute path of a language's contentDir, which is relative to the repo root. */
function contentDirPath(contentDir: string): string {
  return path.join(BLOG_CONTENT_ROOT, path.relative(path.join('content', 'blog'), contentDir));
}

export function listMdxFileNames(contentDir: string): string[] {
  const dir = contentDirPath(contentDir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((fileName) => fileName.endsWith('.mdx'))
    .sort();
}

export function readMdxFile(contentDir: string, fileName: string): string {
  return fs.readFileSync(path.join(contentDirPath(contentDir), fileName), 'utf8').replace(/^\uFEFF/, '');
}

export function readPublicImage(src: string): PublicImageFile {
  const file = path.join(process.cwd(), 'public', src);
  if (!fs.existsSync(file)) return { status: 'missing' };
  const data = fs.readFileSync(file);
  const size = getImageSize(data);
  if (!size) return { status: 'unreadable', byteLength: data.length };
  return { status: 'ok', width: size.width, height: size.height, byteLength: data.length };
}
