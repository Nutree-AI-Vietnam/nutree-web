'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PhoneMockup } from './PhoneMockup';
import { FloatingIcon } from './FloatingIcon';

interface FlipPhoneProps {
  frontImage: string;
  backImage: string;
  frontImageAlt?: string;
  backImageAlt?: string;
  priority?: boolean;
  frontIcons?: { emoji: string; position: string; delay: number }[];
  backIcons?: { emoji: string; position: string; delay: number }[];
}

export function FlipPhone({
  frontImage,
  backImage,
  frontImageAlt = '',
  backImageAlt = '',
  priority = false,
  frontIcons = [],
  backIcons = [],
}: FlipPhoneProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Tap instruction with emoji */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-1 mb-8 pointer-events-none"
      >
        {/* Text with bounce animation - disabled on mobile */}
        <motion.span
          className="text-base sm:text-lg text-muted/80 font-medium"
          animate={!isMobile ? { y: [0, 6, 0] } : { y: 0 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          Tap to flip
        </motion.span>
        {/* Down arrow emoji with bounce - disabled on mobile */}
        <motion.div
          className="text-3xl"
          animate={!isMobile ? { y: [0, 10, 0] } : { y: 0 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          👇
        </motion.div>
      </motion.div>

      {/* Static glow effect - persists on hover/click */}
      <div className="absolute -z-10 bg-gradient-to-br from-primary-teal/20 via-primary-forest/15 to-transparent rounded-[3rem] blur-xl scale-105" />

      {/* Phone container - only this scales on hover */}
      <motion.div
        className="cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Mobile: Simple 2D fade transition */}
        {isMobile ? (
          <div className="relative">
            {/* Front */}
            <div
              className={`transition-opacity duration-400 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
            >
              <PhoneMockup
                variant="floating"
                backgroundImage={frontImage}
                imageAlt={frontImageAlt}
                imagePriority={priority}
              />
              {frontIcons.map((icon) => (
                <FloatingIcon
                  key={`front-${icon.emoji}`}
                  emoji={icon.emoji}
                  className={icon.position}
                  delay={icon.delay}
                  size="md"
                />
              ))}
            </div>
            {/* Back */}
            <div
              className={`absolute inset-0 transition-opacity duration-400 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
            >
              <PhoneMockup
                variant="floating"
                backgroundImage={backImage}
                imageAlt={backImageAlt}
                imagePriority={priority}
              />
              {backIcons.map((icon) => (
                <FloatingIcon
                  key={`back-${icon.emoji}`}
                  emoji={icon.emoji}
                  className={icon.position}
                  delay={icon.delay}
                  size="md"
                />
              ))}
            </div>
          </div>
        ) : (
          /* Desktop: 3D rotateY transition */
          <motion.div
            className="relative preserve-3d"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div className="relative backface-hidden">
              <PhoneMockup
                variant="floating"
                backgroundImage={frontImage}
                imageAlt={frontImageAlt}
                imagePriority={priority}
              />
              {frontIcons.map((icon) => (
                <FloatingIcon
                  key={`front-${icon.emoji}`}
                  emoji={icon.emoji}
                  className={icon.position}
                  delay={icon.delay}
                  size="md"
                />
              ))}
            </div>

            {/* Back (flipped 180deg) */}
            <div
              className="absolute inset-0 backface-hidden"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <PhoneMockup
                variant="floating"
                backgroundImage={backImage}
                imageAlt={backImageAlt}
                imagePriority={priority}
              />
              {backIcons.map((icon) => (
                <FloatingIcon
                  key={`back-${icon.emoji}`}
                  emoji={icon.emoji}
                  className={icon.position}
                  delay={icon.delay}
                  size="md"
                />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-6 mb-32 sm:mb-6">
        <motion.div
          className={`w-2 h-2 rounded-full ${!isFlipped ? 'bg-primary-teal' : 'bg-muted/40'}`}
          animate={{ scale: !isFlipped ? 1.2 : 1 }}
        />
        <motion.div
          className={`w-2 h-2 rounded-full ${isFlipped ? 'bg-primary-teal' : 'bg-muted/40'}`}
          animate={{ scale: isFlipped ? 1.2 : 1 }}
        />
      </div>
    </div>
  );
}
