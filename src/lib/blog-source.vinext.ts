import type { PublicImageFile } from './blog-source';
import { images, mdxFiles } from 'nutree:blog-files';

/** MDX filenames directly inside one language folder. Nested folders are not posts. */
export function listMdxFileNames(contentDir: string): string[] {
  const prefix = `${contentDir}/`;
  return Object.keys(mdxFiles)
    .filter((file) => file.startsWith(prefix) && !file.slice(prefix.length).includes('/') && file.endsWith('.mdx'))
    .map((file) => file.slice(prefix.length))
    .sort();
}

export function readMdxFile(contentDir: string, fileName: string): string {
  const key = `${contentDir}/${fileName}`;
  const raw = mdxFiles[key];
  if (raw === undefined) throw new Error(`Missing blog file ${key}`);
  return raw;
}

export function readPublicImage(src: string): PublicImageFile {
  const image = images[src];
  if (!image) return { status: 'missing' };
  if (image.unreadable) return { status: 'unreadable', byteLength: image.byteLength };
  return { status: 'ok', width: image.width, height: image.height, byteLength: image.byteLength };
}
