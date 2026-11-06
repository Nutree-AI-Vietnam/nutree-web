const QUIZ_HOST = 'quiz.nutreeai.com';

/** Quoted href values, in document order. This does not decide whether a URL is trusted. */
export function hrefsFromHtml(html: string): string[] {
  const found: string[] = [];
  const marker = 'href="';
  let cursor = 0;
  while (cursor < html.length) {
    const start = html.indexOf(marker, cursor);
    if (start === -1) break;
    const valueStart = start + marker.length;
    const valueEnd = html.indexOf('"', valueStart);
    if (valueEnd === -1) break;
    found.push(html.slice(valueStart, valueEnd));
    cursor = valueEnd + 1;
  }
  return found;
}

export function parseLink(href: string): URL | null {
  try {
    return new URL(href);
  } catch {
    return null;
  }
}

/**
 * English quiz entry: https, host quiz.nutreeai.com, path /survey/en.
 * A campaign query is allowed. A lookalike host or a different path is not.
 */
export function isEnglishQuizEntry(href: string): boolean {
  const url = parseLink(href);
  if (!url) return false;
  return url.protocol === 'https:' && url.hostname === QUIZ_HOST && url.pathname === '/survey/en';
}

/** Vietnamese quiz entry stays on the quiz host root. */
export function isVietnameseQuizEntry(href: string): boolean {
  const url = parseLink(href);
  if (!url) return false;
  return url.protocol === 'https:' && url.hostname === QUIZ_HOST && url.pathname === '/';
}
