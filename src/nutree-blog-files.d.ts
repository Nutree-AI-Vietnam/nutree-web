declare module 'nutree:blog-files' {
  export const mdxFiles: Record<string, string>;
  export const images: Record<
    string,
    { width: number; height: number; byteLength: number; unreadable?: boolean }
  >;
}

declare module 'nutree:blog-mdx' {
  import type { ReactNode } from 'react';
  import type { PostHeading } from '@/lib/blog-mdx-hast';

  export const posts: Record<
    string,
    {
      Content: (props: { components?: Record<string, unknown> }) => ReactNode;
      headings: PostHeading[];
    }
  >;
}
