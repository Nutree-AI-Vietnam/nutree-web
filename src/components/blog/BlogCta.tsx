import { FinalCTA } from '@/components/sections/FinalCTA';

/** The home page's closing call to action, for the end of blog pages. */
export function BlogCta() {
  return (
    <>
      {/* FinalCTA reveals on scroll through script; without script it would stay hidden. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{ __html: '.reveal{opacity:1!important;transform:none!important}' }}
        />
      </noscript>
      <FinalCTA />
    </>
  );
}
