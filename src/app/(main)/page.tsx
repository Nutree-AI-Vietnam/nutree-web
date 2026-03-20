import { AuroraBackground } from '@/components/layout/AuroraBackground';
import { HeroV2 } from '@/components/sections/Hero';
import { SocialProof } from '@/components/sections/SocialProof';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { BentoFeatures } from '@/components/sections/BentoFeatures';
import { Testimonials } from '@/components/sections/Testimonials';
import { FinalCTA } from '@/components/sections/FinalCTA';

export default function Home() {
  return (
    <AuroraBackground className="min-h-screen" intensity="subtle">
      <HeroV2 />
      <SocialProof />
      <HowItWorks />
      <BentoFeatures />
      <Testimonials />
      <FinalCTA />
    </AuroraBackground>
  );
}
