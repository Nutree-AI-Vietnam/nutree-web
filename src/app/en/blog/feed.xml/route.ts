import { createFeedResponse } from '@/lib/blog-feed';

// Built once per deploy, like the pages it lists.
export const dynamic = 'force-static';

export function GET() {
  return createFeedResponse('en');
}
