import { postRoute } from '@/components/blog/blog-routes';

const route = postRoute('en');

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
