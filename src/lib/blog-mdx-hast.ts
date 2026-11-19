import type { Element, ElementContent, Root, RootContent } from 'hast';

export interface PostHeading {
  id: string;
  text: string;
}

/** The fields the image rewrite needs. A parsed post image satisfies this. */
export interface MdxSizedImage {
  src: string;
  width: number;
  height: number;
  caption?: string;
}

/** Records each top-level h2 after rehype-slug has given it an id. */
export function collectHeadings(headings: PostHeading[]) {
  return () => (tree: Root) => {
    for (const node of tree.children) {
      if (node.type === 'element' && node.tagName === 'h2' && typeof node.properties.id === 'string') {
        headings.push({ id: node.properties.id, text: textOf(node).trim() });
      }
    }
  };
}

/**
 * Turns each image standing alone in a paragraph into a figure captioned with its Markdown title,
 * and gives it the pixel size the loader read from the file.
 */
export function imageFigures(images: MdxSizedImage[]) {
  const bySrc = new Map(images.map((image) => [image.src, image]));

  const toFigure = (node: Element): Element | undefined => {
    const content = node.children.filter((child) => child.type !== 'text' || child.value.trim());
    const [img] = content;
    if (node.tagName !== 'p' || content.length !== 1 || img?.type !== 'element' || img.tagName !== 'img') {
      return undefined;
    }
    const image = bySrc.get(String(img.properties.src));
    const { title } = img.properties;
    delete img.properties.title;
    if (image) Object.assign(img.properties, { width: image.width, height: image.height });

    const caption = image?.caption ?? (typeof title === 'string' ? title.trim() : '');
    const children: ElementContent[] = [img];
    if (caption) {
      children.push({ type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: caption }] });
    }
    return { type: 'element', tagName: 'figure', properties: {}, children };
  };

  // Callouts are MDX elements rather than HTML ones, so walk anything with children.
  const walk = (parent: { children: Array<RootContent | ElementContent> }) => {
    parent.children.forEach((child, index) => {
      const figure = child.type === 'element' ? toFigure(child) : undefined;
      if (figure) parent.children[index] = figure;
      else if ('children' in child) walk(child);
    });
  };

  return () => (tree: Root) => walk(tree);
}

function textOf(node: Element | ElementContent): string {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') return node.children.map(textOf).join('');
  return '';
}
