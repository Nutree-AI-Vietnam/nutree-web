import { categoryRoute } from '@/components/blog/blog-routes';

const route = categoryRoute('vi');

// Only categories with posts get a page, so an empty topic never ships as a thin page.
export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
