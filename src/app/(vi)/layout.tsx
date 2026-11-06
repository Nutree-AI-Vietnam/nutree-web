import { RootDocument } from '@/components/layout/RootDocument';
import { rootViewport, vietnameseRootMetadata } from '@/lib/root-metadata';
import '../globals.css';

export const metadata = vietnameseRootMetadata;
export const viewport = rootViewport;

export default function VietnameseLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="vi">{children}</RootDocument>;
}
