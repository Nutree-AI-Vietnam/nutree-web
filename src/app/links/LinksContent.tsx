'use client';

import { useEffect, useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { LinkCard } from '@/components/ui/LinkCard';
import { SOCIAL_LINKS, SITE_CONFIG } from '@/lib/constants';
import { LinkIcon } from './LinkIcon';

/** Detect TikTok in-app browser via user-agent */
function isTikTokWebView(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /trill|TikTok|musical_ly|BytedanceWebview/i.test(navigator.userAgent);
}

export function LinksContent() {
  const [inTikTok, setInTikTok] = useState(false);

  useEffect(() => {
    setInTikTok(isTikTokWebView());
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 px-4 py-12">
      {/* Brand header */}
      <div className="flex flex-col items-center gap-2">
        <Logo size="lg" linkHome={false} />
        <p className="text-center text-sm text-muted">
          AI Nutrition Assistant
        </p>
      </div>

      {/* TikTok WebView notice */}
      {inTikTok && (
        <p className="rounded-xl bg-energy-lime/10 px-4 py-2.5 text-center text-xs text-foreground/80">
          Links open in TikTok&apos;s browser. To download the app, search{' '}
          <strong>&quot;{SITE_CONFIG.name}&quot;</strong> in your App Store.
        </p>
      )}

      {/* Link cards */}
      <div className="flex w-full flex-col gap-3">
        {SOCIAL_LINKS.map((link, i) => (
          <LinkCard
            key={link.id}
            label={link.label}
            url={link.url}
            icon={<LinkIcon type={link.icon} />}
            description={link.description}
            showSearchGuidance={inTikTok && link.isAppStore === true}
            appName={SITE_CONFIG.name}
            index={i}
          />
        ))}
      </div>

      {/* Footer */}
      <p className="mt-4 text-xs text-muted">
        &copy; {new Date().getFullYear()} {SITE_CONFIG.name}
      </p>
    </div>
  );
}
