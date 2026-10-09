'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

interface SpotlightGroupProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Tracks the pointer across a group of `.spotlight-card` children and writes its position into
 * each card's --spot-x/--spot-y, so the glow (styled in globals.css) follows the cursor and spills
 * onto neighbouring cards. Mouse-like pointers only; touch screens keep the plain cards.
 */
export function SpotlightGroup({ className, children }: SpotlightGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const group = ref.current;
    if (!group || !window.matchMedia('(pointer: fine)').matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      group.querySelectorAll<HTMLElement>('.spotlight-card').forEach((card) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', `${x - rect.left}px`);
        card.style.setProperty('--spot-y', `${y - rect.top}px`);
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    group.addEventListener('pointermove', onPointerMove);
    return () => {
      group.removeEventListener('pointermove', onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={cn('spotlight-group', className)}>
      {children}
    </div>
  );
}
