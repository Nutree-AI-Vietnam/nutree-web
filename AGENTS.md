# Web Landing Page - Codex Context

## Quick Reference

| Item | Value |
|------|-------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5+ (strict) |
| **Styling** | Tailwind CSS 3.4 |
| **Animation** | Framer Motion 11 |
| **Package Manager** | npm |

## Architecture

```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Root layout (fonts, header, footer)
│   ├── page.tsx      # Home page
│   ├── globals.css   # Global styles + Tailwind
│   └── changelog/    # Changelog page (ISR)
│
├── components/       # React components
│   ├── ui/           # Atomic components (Button, Logo)
│   ├── layout/       # Header, Footer, MobileMenu, AuroraBackground
│   └── sections/     # Page sections (Hero, Features, etc.)
│
├── lib/              # Utilities
│   ├── cn.ts         # clsx + tailwind-merge helper
│   ├── constants.ts  # Site config, nav links
│   └── utils.ts      # Shared utilities
│
├── hooks/            # Custom React hooks
│
└── types/            # TypeScript definitions
    └── index.ts
```

## Critical Commands

```bash
# Development
npm run dev

# Build
npm run build

# Type check
npm run type-check

# Lint
npm run lint

# Full check before commit
npm run type-check && npm run lint && npm run build
```

## Component Structure

```tsx
// Standard component pattern
import { cn } from '@/lib/cn';

interface MyComponentProps {
  className?: string;
  children: React.ReactNode;
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn('base-styles', className)}>
      {children}
    </div>
  );
}
```

## Styling

### Tailwind + cn() Pattern
```tsx
import { cn } from '@/lib/cn';

// Merge classes safely
<div className={cn(
  'px-4 py-2',           // Base styles
  isActive && 'bg-primary', // Conditional
  className              // Override from props
)} />
```

### Design Tokens (in tailwind.config.ts)
```
Colors:
- primary-forest: #1A4739
- primary-teal: #29B6A1
- primary-emerald: #2D8B70
- background: #FAFCFB
- foreground: #0F1F1A

Fonts:
- Plus Jakarta Sans (display)
- DM Sans (body)
```

## Animation

### Framer Motion Patterns
```tsx
import { motion } from 'framer-motion';

// Fade in on mount
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>

// Scroll-triggered
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
```

### CSS Animations (globals.css)
```css
@keyframes aurora-shift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, 30px) scale(1.1); }
}
```

## File Naming

- `PascalCase.tsx` for components
- `kebab-case.ts` for utilities
- `page.tsx` for Next.js pages
- `layout.tsx` for layouts

## Image Handling

```tsx
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Nutree Logo"
  width={120}
  height={40}
  priority // For above-the-fold images
/>
```

## Navigation

Defined in `lib/constants.ts`:
```ts
export const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  // ...
];
```

## Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Header | `components/layout/Header.tsx` | Sticky nav |
| Footer | `components/layout/Footer.tsx` | Site footer |
| Hero | `components/sections/Hero.tsx` | Hero section |
| Button | `components/ui/Button.tsx` | Reusable button |
| AuroraBackground | `components/layout/AuroraBackground.tsx` | Animated bg |

## Common Gotchas

1. **Type errors** → Run `npm run type-check`
2. **Styling not applying** → Check Tailwind class names
3. **Animation janky** → Use `will-change` or check rerenders
4. **Image not loading** → Check `next.config.js` domains
5. **Hydration mismatch** → Use `useEffect` for client-only

## Environment

No env vars required for landing page (static).

For API integration (future):
```
NEXT_PUBLIC_API_URL=...
```

## Build Output

- Static HTML export possible
- Server components by default
- Client components marked with `'use client'`

## Performance Targets

- Lighthouse: 95+
- FCP: <1.8s
- LCP: <2.5s
- Bundle: <60kB gzipped
