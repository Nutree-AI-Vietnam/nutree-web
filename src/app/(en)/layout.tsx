import Script from 'next/script';
import { RootDocument } from '@/components/layout/RootDocument';
import { TIKTOK_PIXEL_SCRIPT } from '@/lib/tiktok-pixel';
import { englishRootMetadata, rootViewport } from '@/lib/root-metadata';
import '../globals.css';

export const metadata = englishRootMetadata;
export const viewport = rootViewport;

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootDocument lang="en">
      <Script id="tiktok-pixel" strategy="beforeInteractive">
        {TIKTOK_PIXEL_SCRIPT}
      </Script>
      {children}
    </RootDocument>
  );
}
