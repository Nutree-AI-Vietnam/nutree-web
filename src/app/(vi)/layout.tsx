import Script from 'next/script';
import { RootDocument } from '@/components/layout/RootDocument';
import { TIKTOK_PIXEL_SCRIPT } from '@/lib/tiktok-pixel';
import { rootViewport, vietnameseRootMetadata } from '@/lib/root-metadata';
import '../globals.css';

export const metadata = vietnameseRootMetadata;
export const viewport = rootViewport;

export default function VietnameseLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootDocument lang="vi">
      <Script id="tiktok-pixel" strategy="beforeInteractive">
        {TIKTOK_PIXEL_SCRIPT}
      </Script>
      {children}
    </RootDocument>
  );
}
