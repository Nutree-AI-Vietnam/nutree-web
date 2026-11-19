import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cloudflare } from '@cloudflare/vite-plugin';
import { imagesOptimizer } from '@vinext/cloudflare/images/images-optimizer';
import { defineConfig, type Plugin } from 'vite';
import vinext from 'vinext';
import { compileBlogModule } from './src/lib/compile-blog-mdx';
import type { BlogLocale } from './src/lib/blog-locales';
import { getImageSize } from './src/lib/image-size';

const root = path.dirname(fileURLToPath(import.meta.url));

interface BlogBundle {
  mdxFiles: Record<string, string>;
  images: Record<string, { width: number; height: number; byteLength: number; unreadable?: boolean }>;
  modules: Record<string, string>;
  watched: string[];
}

const BODY_PREFIX = 'nutree:blog-mdx-body:';

function postIdentity(rel: string): { key: string; locale: BlogLocale } | undefined {
  const english = /^content\/blog\/en\/([^/]+)\.mdx$/.exec(rel);
  if (english) return { key: `en:${english[1]}`, locale: 'en' };
  const vietnamese = /^content\/blog\/([^/]+)\.mdx$/.exec(rel);
  if (vietnamese) return { key: `vi:${vietnamese[1]}`, locale: 'vi' };
  return undefined;
}

function mdxBody(raw: string, rel: string): string {
  const match = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(raw);
  if (!match) throw new Error(`${rel} is missing YAML frontmatter`);
  return raw.slice(match[0].length).trim();
}

/** Embeds blog MDX and image headers. The Worker has no project directory at request time. */
function nutreeBlogFiles(): Plugin {
  const filesId = '\0nutree:blog-files';
  const indexId = '\0nutree:blog-mdx';
  let pending: Promise<BlogBundle> | undefined;

  const bundle = (): Promise<BlogBundle> => {
    pending ??= (async () => {
      const mdxFiles: BlogBundle['mdxFiles'] = {};
      const images: BlogBundle['images'] = {};
      const modules: BlogBundle['modules'] = {};
      const watched: string[] = [];
      const walk = (dir: string, visitFile: (full: string) => void) => {
        if (!fs.existsSync(dir)) return;
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) walk(full, visitFile);
          else visitFile(full);
        }
      };

      walk(path.join(root, 'content', 'blog'), (full) => {
        if (!full.endsWith('.mdx')) return;
        watched.push(full);
        const rel = path.relative(root, full).split(path.sep).join('/');
        mdxFiles[rel] = fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
      });

      const publicRoot = path.join(root, 'public');
      walk(publicRoot, (full) => {
        if (!/\.(?:jpe?g|png|webp)$/i.test(full)) return;
        watched.push(full);
        const src = `/${path.relative(publicRoot, full).split(path.sep).join('/')}`;
        const data = fs.readFileSync(full);
        const size = getImageSize(data);
        images[src] = size
          ? { width: size.width, height: size.height, byteLength: data.length }
          : { width: 0, height: 0, byteLength: data.length, unreadable: true };
      });

      const sized = Object.entries(images)
        .filter(([, image]) => !image.unreadable)
        .map(([src, image]) => ({ src, width: image.width, height: image.height }));
      for (const [rel, raw] of Object.entries(mdxFiles)) {
        const identity = postIdentity(rel);
        if (!identity) continue;
        modules[identity.key] = await compileBlogModule(mdxBody(raw, rel), identity.locale, sized);
      }
      return { mdxFiles, images, modules, watched };
    })();
    return pending;
  };

  return {
    name: 'nutree-blog-files',
    resolveId(source) {
      if (source === 'nutree:blog-files') return filesId;
      if (source === 'nutree:blog-mdx') return indexId;
      if (source.startsWith(BODY_PREFIX)) return `\0${source}`;
    },
    async load(id) {
      if (id !== filesId && id !== indexId && !id.startsWith(`\0${BODY_PREFIX}`)) return;
      const data = await bundle();
      for (const file of data.watched) this.addWatchFile(file);

      if (id === filesId) {
        return `export const mdxFiles = ${JSON.stringify(data.mdxFiles)};\nexport const images = ${JSON.stringify(data.images)};\n`;
      }
      if (id.startsWith(`\0${BODY_PREFIX}`)) return data.modules[id.slice(`\0${BODY_PREFIX}`.length)];

      const keys = Object.keys(data.modules);
      const imports = keys
        .map((key, index) => `import Post${index}, { headings as headings${index} } from ${JSON.stringify(`${BODY_PREFIX}${key}`)};`)
        .join('\n');
      const entries = keys
        .map((key, index) => `  ${JSON.stringify(key)}: { Content: Post${index}, headings: headings${index} },`)
        .join('\n');
      return `${imports}\nexport const posts = {\n${entries}\n};\n`;
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      'nutree-blog-source': path.join(root, 'src/lib/blog-source.vinext.ts'),
      'nutree-blog-render': path.join(root, 'src/lib/blog-render.vinext.ts'),
    },
  },
  plugins: [
    nutreeBlogFiles(),
    vinext({
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({
      viteEnvironment: {
        name: 'rsc',
        childEnvironments: ['ssr'],
      },
    }),
  ],
});
