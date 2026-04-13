'use client';

import { useEffect, useRef, useState } from 'react';

interface AutoplayVideoProps {
  src: string;
  className?: string;
  poster?: string;
}

/**
 * Autoplay-friendly video for mobile WebViews (TikTok, Instagram, FB, etc.).
 *
 * Why: TikTok's in-app browser blocks HTML autoplay until the first user tap.
 * Our mitigation stack:
 *   - IntersectionObserver calls play() when the video enters the viewport
 *     (more reliable timing than the browser's autoplay heuristic).
 *   - On any first user interaction we try play() again.
 *   - If play() still rejects, we show a tap-to-play overlay so one tap
 *     unblocks playback for the whole page.
 *   - Extra WebView-friendly attributes: webkit-playsinline, preload=auto.
 */
export function AutoplayVideo({ src, className, poster }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      const p = video.play();
      if (p !== undefined) {
        p.then(() => setNeedsTap(false)).catch(() => setNeedsTap(true));
      }
    };

    // Observer — play when scrolled into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) tryPlay();
          else video.pause();
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(video);

    // Retry on any first user interaction (unlocks WebView autoplay policy)
    const retry = () => tryPlay();
    document.addEventListener('touchstart', retry, { once: true, passive: true });
    document.addEventListener('click', retry, { once: true });

    return () => {
      observer.disconnect();
      document.removeEventListener('touchstart', retry);
      document.removeEventListener('click', retry);
    };
  }, [src]);

  const handleTap = () => {
    const video = videoRef.current;
    if (!video) return;
    const p = video.play();
    if (p !== undefined) p.then(() => setNeedsTap(false)).catch(() => {});
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
        className={className}
      />
      {needsTap && (
        <button
          onClick={handleTap}
          className="absolute inset-0 flex items-center justify-center bg-black/40 text-white"
          aria-label="Play video"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary-forest shadow-lg">
            <svg className="h-6 w-6 ml-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
