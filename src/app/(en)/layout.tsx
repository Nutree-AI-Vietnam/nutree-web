import { RootDocument } from '@/components/layout/RootDocument';
import { englishRootMetadata, rootViewport } from '@/lib/root-metadata';
import '../globals.css';

export const metadata = englishRootMetadata;
export const viewport = rootViewport;

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="en" initialLocale="en">{children}</RootDocument>;
}
