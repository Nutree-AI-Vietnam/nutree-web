import { AuroraBackground } from '@/components/layout/AuroraBackground';
import { HeroV2 } from '@/components/sections/Hero';
import { SocialProof } from '@/components/sections/SocialProof';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { BentoFeatures } from '@/components/sections/BentoFeatures';
import { HomePricing } from '@/components/sections/HomePricing';
import { Testimonials } from '@/components/sections/Testimonials';
import { StartupPartners } from '@/components/sections/StartupPartners';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { ScreenshotPreloader } from '@/components/providers/ScreenshotPreloader';

export default function Home() {
  return (
    <AuroraBackground className="min-h-screen" intensity="subtle">
      <ScreenshotPreloader />
      <HeroV2 />
      <SocialProof />
      <StartupPartners />
      <HowItWorks />
      <BentoFeatures />
      <HomePricing />
      <Testimonials />
      <FinalCTA />
    </AuroraBackground>
  );
}
