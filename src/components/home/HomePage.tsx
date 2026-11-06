import { AuroraBackground } from '@/components/layout/AuroraBackground';
import { HeroV2 } from '@/components/sections/Hero';
import { SocialProof } from '@/components/sections/SocialProof';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { BentoFeatures } from '@/components/sections/BentoFeatures';
import { Comparison } from '@/components/sections/Comparison';
import { Testimonials } from '@/components/sections/Testimonials';
import { StartupPartners } from '@/components/sections/StartupPartners';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { JsonLd } from '@/components/seo/JsonLd';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import { homeStructuredData } from '@/lib/structured-data';

export function HomePage({ language }: { language: 'vi' | 'en' }) {
  return (
    <>
      <JsonLd data={homeStructuredData(language)} />
      <noscript>
        <style
          dangerouslySetInnerHTML={{ __html: '.reveal{opacity:1!important;transform:none!important}' }}
        />
      </noscript>
      <ScrollProgressBar />
      <AuroraBackground className="min-h-screen" intensity="subtle">
        <HeroV2 />
        <SocialProof />
        <StartupPartners />
        <HowItWorks />
        <BentoFeatures />
        <Comparison />
        <Testimonials />
        <FinalCTA />
      </AuroraBackground>
    </>
  );
}
