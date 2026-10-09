'use client';

import { useEffect, useRef } from 'react';

interface TiltOnPointerProps {
  /** Classes for the untransformed outer box; give it the perspective (e.g. md:[perspective:1400px]). */
  className?: string;
  children: React.ReactNode;
  /** Largest rotation in degrees, reached at the element's edges. */
  maxTilt?: number;
}

/**
 * Tilts its children toward a mouse pointer in 3D. Children marked preserve-3d with a translateZ
 * float at their own depth. The pointer is measured against the outer box, which never moves, so
 * the tilt cannot feed back into itself. Touch and reduced motion stay flat. Only two CSS variables
 * change per frame; the .tilt-surface transition does the easing.
 */
export function TiltOnPointer({ className, children, maxTilt = 10 }: TiltOnPointerProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const surface = surfaceRef.current;
    if (!outer || !surface) return;
    if (
      !window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let frame = 0;
    const setTilt = (rx: number, ry: number) => {
      surface.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
      surface.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = outer.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setTilt(-2 * y * maxTilt, 2 * x * maxTilt));
    };

    const onPointerLeave = () => {
      cancelAnimationFrame(frame);
      setTilt(0, 0);
    };

    outer.addEventListener('pointermove', onPointerMove);
    outer.addEventListener('pointerleave', onPointerLeave);
    return () => {
      cancelAnimationFrame(frame);
      outer.removeEventListener('pointermove', onPointerMove);
      outer.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [maxTilt]);

  return (
    <div ref={outerRef} className={className}>
      <div ref={surfaceRef} className="tilt-surface relative">
        {children}
      </div>
    </div>
  );
}
