'use client';

import { useEffect, useRef } from 'react';

// Half the spotlight's 1100px size, so its centre sits on the pointer.
const SPOT_RADIUS = 550;

/**
 * Hero backdrop: brand mesh, a fading grid, drifting aurora blobs and a soft spotlight that follows
 * a mouse pointer across the section. Purely decorative and static on touch, phones and reduced motion.
 */
export function HeroBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const spot = spotRef.current;
    const section = root?.closest('section');
    if (!root || !spot || !section) return;
    if (
      !window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      spot.style.transform = `translate3d(${x - SPOT_RADIUS}px, ${y - SPOT_RADIUS}px, 0)`;
      spot.dataset.active = 'true';
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = root.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onPointerLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      spot.dataset.active = 'false';
    };

    section.addEventListener('pointermove', onPointerMove);
    section.addEventListener('pointerleave', onPointerLeave);
    return () => {
      section.removeEventListener('pointermove', onPointerMove);
      section.removeEventListener('pointerleave', onPointerLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_72%,transparent)]"
    >
      <div className="mesh-bg absolute inset-0 opacity-60" />
      <div className="hero-grid absolute inset-0" />
      <div className="hero-blob absolute -left-40 -top-32 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(41,182,161,0.22),transparent)]" />
      <div
        className="hero-blob absolute -right-32 top-[18%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(163,230,53,0.16),transparent)]"
        style={{ animationDelay: '-7s', animationDuration: '24s' }}
      />
      <div
        className="hero-blob absolute -bottom-48 left-[30%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgba(45,139,112,0.18),transparent)]"
        style={{ animationDelay: '-13s', animationDuration: '28s' }}
      />
      <div
        ref={spotRef}
        data-active="false"
        className="absolute left-0 top-0 h-[1100px] w-[1100px] rounded-full bg-[radial-gradient(circle,rgba(41,182,161,0.14),transparent_60%)] opacity-0 transition-opacity duration-500 will-change-transform data-[active=true]:opacity-100"
      />
    </div>
  );
}
