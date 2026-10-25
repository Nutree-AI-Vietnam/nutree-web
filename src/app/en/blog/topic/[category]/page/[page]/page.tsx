import { categoryNumberedRoute } from '@/components/blog/blog-routes';

const route = categoryNumberedRoute('en');

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
