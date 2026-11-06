import { blogIndexRoute } from '@/components/blog/blog-routes';

const route = blogIndexRoute('en');

export const metadata = route.metadata;
export default route.Page;
