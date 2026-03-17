# System Architecture - Nutree Web

**Last Updated**: December 10, 2025
**Version**: Phase 3 (Stable)
**Status**: Production-Ready

---

## Architecture Overview

Nutree Web is a static/SSR Next.js 14 application optimized for performance, accessibility, and developer experience. The architecture follows modern web standards with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────┐
│         Nutree Web Architecture                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │  CDN / Edge Network (Cloudflare, AWS CloudFront) │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       │                                   │
│  ┌────────────────────▼─────────────────────────────┐  │
│  │     Next.js 14 Standalone Server                 │  │
│  │  (Docker container or serverless function)       │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  ▪ App Router (pages, layouts, routes)          │  │
│  │  ▪ React 18 + TypeScript (strict mode)          │  │
│  │  ▪ Tailwind CSS + animations                    │  │
│  │  ▪ GitHub API integration (ISR)                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │     Static Files (Images, Fonts, etc.)           │  │
│  │  (Public CDN or Cloudflare R2)                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │     External APIs                                │  │
│  │  ▪ GitHub API (releases)                         │  │
│  │  ▪ Plausible/Fathom Analytics (Phase 5)         │  │
│  │  ▪ Fonts API (Google Fonts)                      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Framework

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Next.js | 14.2.0+ | React framework, SSR/SSG, routing |
| **Language** | TypeScript | 5.3.0+ | Type safety, strict mode |
| **UI Library** | React | 18.3.1+ | Component library |
| **Styling** | Tailwind CSS | 3.4.0+ | Utility-first CSS |
| **Animation** | Framer Motion | 11.0.0+ | Scroll animations, transitions |
| **Icons** | Heroicons | 2.0 | SVG icons (MIT license) |

### Build Tools

| Tool | Purpose |
|------|---------|
| **TypeScript Compiler** | Type checking, transpilation |
| **PostCSS** | CSS processing, Tailwind compilation |
| **ESLint** | Code quality, linting |
| **Webpack** | Module bundling (via Next.js) |
| **Autoprefixer** | CSS vendor prefixes |

### Runtime Environment

| Component | Specification |
|-----------|---|
| **Node.js** | 18.17+ or 20+ |
| **Package Manager** | npm 9+, yarn 4+, or pnpm |
| **Container Runtime** | Docker (node:20-alpine) |
| **Port** | 3000 (default) |
| **Output Mode** | Standalone (no external Node modules needed) |

---

## Application Architecture

### Directory Structure

```
nutree-web/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── layout.tsx                    # Root layout
│   │   ├── page.tsx                      # Home page
│   │   ├── globals.css                   # Global styles
│   │   ├── changelog/
│   │   │   └── page.tsx                  # /changelog route
│   │   ├── privacy/
│   │   │   └── page.tsx                  # /privacy route
│   │   └── terms/
│   │       └── page.tsx                  # /terms route
│   │
│   ├── components/
│   │   ├── layout/                       # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── AuroraBackground.tsx
│   │   │
│   │   ├── sections/                     # Page sections
│   │   │   ├── Hero.tsx / HeroV2.tsx
│   │   │   ├── SocialProof.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── BentoFeatures.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── FeaturesSlider.tsx
│   │   │   ├── FinalCTA.tsx
│   │   │   ├── DemoVideo.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── DownloadCTA.tsx
│   │   │   └── ReleaseList.tsx
│   │   │
│   │   └── ui/                           # Reusable UI
│   │       ├── Button.tsx
│   │       ├── Logo.tsx
│   │       ├── FeatureCard.tsx
│   │       ├── ScreenshotPlaceholder.tsx
│   │       └── ... (more UI components)
│   │
│   ├── hooks/                            # Custom hooks
│   │   └── useInView.ts
│   │
│   ├── lib/                              # Utilities
│   │   ├── cn.ts                         # classname helper
│   │   ├── constants.ts                  # Site config
│   │   ├── github.ts                     # GitHub API
│   │   └── utils.ts                      # Misc utilities
│   │
│   └── types/                            # TypeScript types
│       └── index.ts
│
├── public/                               # Static assets
│   ├── logo.png
│   ├── favicon.ico
│   └── ... (images, icons, fonts)
│
├── .next/                                # Build output (generated)
├── node_modules/                         # Dependencies (git-ignored)
├── .env.local                            # Local env vars (git-ignored)
├── .env.example                          # Template env vars
│
├── Configuration Files
├── next.config.js                        # Next.js config
├── tailwind.config.ts                    # Tailwind theme
├── tsconfig.json                         # TypeScript config
├── postcss.config.js                     # PostCSS config
├── .eslintrc.json                        # ESLint config
├── Dockerfile                            # Docker build config
│
├── Documentation
├── README.md                             # Project readme
├── CLAUDE.md                             # Development guide
├── docs/                                 # Full documentation
│
├── Version Control
├── .gitignore                            # Git ignore rules
├── LICENSE                               # BSD-3-Clause
└── package.json                          # Dependencies & scripts
```

---

## Route Architecture

### Page Routes (App Router)

| Route | Component | Type | Purpose |
|-------|-----------|------|---------|
| `/` | `page.tsx` | Static | Home landing page |
| `/changelog` | `changelog/page.tsx` | ISR (1h) | GitHub releases |
| `/privacy` | `privacy/page.tsx` | Static | Privacy policy |
| `/terms` | `terms/page.tsx` | Static | Terms of service |

### ISR Strategy

**Incremental Static Regeneration** for changelog:
- **Revalidation Time**: 1 hour (3600 seconds)
- **Benefit**: Fresh data without every request
- **Fallback**: Cached version if API fails

```typescript
// In changelog/page.tsx
export const revalidate = 3600; // 1 hour

async function ReleaseList() {
  const releases = await fetchReleases(); // Fetched at build/revalidation
  return <div>{releases.map(...)}</div>;
}
```

---

## Component Architecture

### Component Hierarchy

```
layout.tsx (Root Layout)
├── Header (sticky, mobile-aware)
├── AuroraBackground (animated mesh gradient)
├── Page Content (dynamic per route)
│   ├── Hero / HeroV2
│   ├── SocialProof
│   ├── HowItWorks
│   ├── BentoFeatures
│   ├── Testimonials
│   ├── FeaturesSlider
│   ├── FinalCTA
│   ├── DemoVideo
│   ├── Features
│   │   ├── FeatureCard
│   │   │   ├── FeatureIcon
│   │   │   └── ScreenshotPlaceholder
│   │   └── (repeated for each feature)
│   └── DownloadCTA
└── Footer
```

### Component Categories

#### Layout Components (4)
- **Header.tsx** - Sticky navigation, mobile menu detection
- **Footer.tsx** - Footer with links and copyright
- **MobileMenu.tsx** - Mobile navigation drawer
- **AuroraBackground.tsx** - Animated mesh gradient effect

#### Section Components (13)
- **Hero.tsx / HeroV2.tsx** - Main hero with CTAs
- **SocialProof.tsx** - Trust indicators
- **HowItWorks.tsx** - Step-by-step breakdown
- **BentoFeatures.tsx** - Bento grid layout
- **Testimonials.tsx** - User reviews
- **FeaturesSlider.tsx** - Carousel component
- **FinalCTA.tsx** - Bottom CTA
- **DemoVideo.tsx** - Video placeholder
- **Features.tsx** - Feature grid (Phase 3)
- **DownloadCTA.tsx** - Download buttons
- **ReleaseList.tsx** - GitHub releases

#### UI Components (10+)
- **Button.tsx** - Primary, secondary, ghost variants
- **Logo.tsx** - Brand logo
- **FeatureCard.tsx** - Feature showcase
- **ScreenshotPlaceholder.tsx** - Phone mockup
- **AnimatedCounter.tsx** - Number animations
- **FloatingIcon.tsx** - Floating elements
- **GlassCard.tsx** - Glassmorphism
- **PhoneMockup.tsx** - Detailed phone frame
- **ReleaseCard.tsx** - Release display

---

## Data Flow Architecture

### Page Rendering Flow

```
Client Request
    ↓
Cloudflare CDN
    ↓ (cache miss)
Next.js Server (Standalone)
    ├─ Static Page (/)
    │   └─ Render with components
    │       ├─ Hero
    │       ├─ Features (uses FEATURES constant)
    │       └─ DownloadCTA
    │
    ├─ ISR Page (/changelog, 1h revalidation)
    │   ├─ Check cache validity
    │   ├─ If stale: Fetch GitHub API
    │   └─ Render with fresh data
    │
    └─ Legal Pages (/privacy, /terms)
        └─ Render static content
    ↓
Render HTML + CSS + JavaScript
    ↓
Client (Browser)
    ├─ Hydrate React
    ├─ Attach event listeners
    ├─ Initialize animations
    └─ IntersectionObserver for scroll triggers
```

### Data Sources

**1. Constants (Static)**
```
src/lib/constants.ts
├── FEATURES array (5 items)
├── NAVIGATION links
└── SITE_CONFIG
```

**2. GitHub API (Dynamic, ISR cached)**
```
GitHub API (via @octokit/rest)
    ↓
src/lib/github.ts (wrapper)
    ↓
changelog/page.tsx (server component)
    ↓
ReleaseList.tsx (component)
    ↓
ReleaseCard.tsx (individual releases)
```

**3. Local Files (Static)**
```
src/app/privacy/page.tsx (HTML content)
src/app/terms/page.tsx (HTML content)
```

---

## State Management

### Pattern: React Hooks (Lightweight)

**No Redux/Zustand required** - Simple hooks pattern:

| State Type | Implementation | Example |
|-----------|---|---|
| Component State | `useState` | Mobile menu open/close |
| Scroll Visibility | `useInView` hook | Feature card animations |
| Derived State | Computed values | `isEven = index % 2 === 0` |
| Context (future) | React Context API | Theme switching (Phase 5) |

### Current State Usage

**Header Component**
```tsx
const [isOpen, setIsOpen] = useState(false);
// Mobile menu toggle
```

**Features Component**
```tsx
const { ref, isInView } = useInView({ threshold: 0.2 });
// Scroll animation trigger
```

**MobileMenu Component**
```tsx
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'; // Prevent scroll
  }
  return () => {
    document.body.style.overflow = 'unset';
  };
}, [isOpen]);
```

---

## Styling Architecture

### Tailwind CSS Configuration

**File**: `tailwind.config.ts`

```typescript
export default {
  content: ['./src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      colors: {
        forest: '#1A4739',
        teal: '#29B6A1',
        emerald: '#2D8B70',
      },
      fontFamily: {
        display: ['var(--font-plus-jakarta)'],
        body: ['var(--font-dm-sans)'],
      },
      animation: {
        'aurora-shift': 'aurora 8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
    },
  },
};
```

### CSS Layers (Global Styles)

**File**: `src/app/globals.css`

```css
@layer base {
  /* Font definitions, resets */
  * {
    @apply border-border;
  }
}

@layer components {
  /* Reusable component styles */
  .glass-card {
    @apply backdrop-blur-xl bg-white/10 border border-white/20;
  }

  .gradient-brand {
    @apply bg-gradient-to-r from-forest via-emerald to-teal;
  }
}

@layer utilities {
  /* Custom utilities (rarely needed) */
}
```

### CSS Properties (Custom)

```css
:root {
  --font-plus-jakarta: var(--font-plus-jakarta);
  --font-dm-sans: var(--font-dm-sans);
}
```

---

## Performance Architecture

### Static Site Generation (SSG)

**Pages**:
- `/` (home)
- `/privacy` (legal)
- `/terms` (legal)

**Build Time Generation**:
- Generated at `npm run build`
- Output: HTML files ready for CDN
- No runtime computation needed

### Incremental Static Regeneration (ISR)

**Pages**:
- `/changelog` (revalidate every 1 hour)

**Benefit**:
- Fresh data without rebuilding entire site
- Cached responses while revalidating
- Automatic fallback if API fails

### Image Optimization

**Strategy**: Next.js Image Component

```tsx
<Image
  src="https://example.com/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={false}
  placeholder="blur"
/>
```

**Optimizations**:
- Auto WebP format (falls back to original)
- Responsive srcset generation
- Lazy loading by default
- Blur placeholder support

### Code Splitting

**Automatic by Next.js App Router**:
```
/ (home) → /_next/static/chunks/app/page.js
/changelog → /_next/static/chunks/app/changelog/page.js
/privacy → /_next/static/chunks/app/privacy/page.js
/terms → /_next/static/chunks/app/terms/page.js
```

**Dynamic Imports** (for non-critical sections):
```tsx
const Testimonials = dynamic(
  () => import('@/components/sections/Testimonials'),
  { loading: () => <Skeleton /> }
);
```

### Animation Performance

**GPU-Accelerated Only**:
- ✅ `transform` (translate, scale, rotate)
- ✅ `opacity` (fade in/out)
- ❌ NOT `width`, `height`, `margin`, `padding` (causes layout shifts)

**Framer Motion Defaults**:
- Respects `prefers-reduced-motion`
- GPU layers automatically
- No jank on 60fps target

---

## API Architecture

### GitHub API Integration

**File**: `src/lib/github.ts`

```typescript
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Optional, for higher rate limits
});

export async function fetchReleases() {
  const { data } = await octokit.repos.listReleases({
    owner: 'trandactri',
    repo: 'nutree-web',
    per_page: 10,
  });
  return data;
}
```

**Usage** in `changelog/page.tsx`:
```tsx
export const revalidate = 3600; // ISR: 1 hour

async function ReleaseList() {
  const releases = await fetchReleases();
  return (
    <div>
      {releases.map(release => (
        <ReleaseCard key={release.id} release={release} />
      ))}
    </div>
  );
}
```

### Rate Limiting

**Without Token**:
- 60 requests/hour per IP
- Sufficient for changelog updates (1 per hour)

**With Token** (GITHUB_TOKEN env var):
- 5,000 requests/hour per user
- Recommended for reliability

---

## Build & Deployment Architecture

### Build Process

```
npm run build
    ↓
Next.js Compiler
    ├─ TypeScript → JavaScript
    ├─ React → HTML (SSG pages)
    ├─ Tailwind → CSS (purged)
    ├─ PostCSS → vendor prefixes
    └─ Image optimization
    ↓
.next/standalone (self-contained output)
    ├─ Next.js server
    ├─ Pages (pre-rendered)
    └─ Assets
```

### Docker Containerization

**File**: `Dockerfile`

```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production runtime
FROM node:20-alpine

WORKDIR /app
RUN addgroup nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => { if (r.statusCode !== 200) throw new Error(r.statusCode) })"

CMD ["node", "server.js"]
```

**Image Size**: ~150MB (minimal Alpine-based)
**Startup Time**: < 5 seconds

### Deployment Options

| Platform | Method | Cold Start |
|----------|--------|-----------|
| **Cloudflare Pages** | Git push → auto deploy | Instant (edge) |
| **Vercel** | Git push → auto deploy | < 1s |
| **AWS Lambda** | Docker image + API Gateway | < 100ms |
| **Docker Compose** | Standalone server | < 5s |
| **Kubernetes** | Container orchestration | < 10s |

---

## Security Architecture

### XSS Prevention

**Rule**: No `dangerouslySetInnerHTML`

**Safe Pattern**:
```tsx
function FeatureIcon({ icon }: { icon: 'camera' | 'sparkles' }) {
  switch (icon) {
    case 'camera':
      return <svg {...}>{/* hard-coded path */}</svg>;
    default:
      return null;
  }
}
```

### Input Sanitization

**Headers**: Content Security Policy (CSP)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
```

### Secret Management

**Rule**: Never hardcode secrets

```typescript
// ❌ WRONG
const API_KEY = 'sk-123456';

// ✅ RIGHT
const API_KEY = process.env.GITHUB_TOKEN;
```

**Files**:
- `.env.local` (git-ignored, local only)
- `.env.example` (template, committed)

### HTTPS-Only

**Requirement**: All deployment targets must use HTTPS
- Cloudflare: Auto HTTPS
- Vercel: Auto HTTPS
- Docker: Behind reverse proxy with HTTPS

---

## Monitoring & Observability

### Performance Monitoring

**Tools**:
- Google PageSpeed Insights (Lighthouse)
- Web Vitals (Core Web Vitals)
- Chrome DevTools (local testing)

**Metrics**:
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1

### Error Tracking

**Future Implementation** (Phase 5):
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Analytics

**Future Implementation** (Phase 5):
- Plausible Analytics (privacy-first)
- Fathom Analytics (alternative)
- Google Analytics 4 (if needed)

---

## Development Workflow

### Local Development

```bash
npm install
npm run dev
# Server on http://localhost:3000
```

**Hot Reload**:
- Component changes: Instant (< 100ms)
- Style changes: Instant (< 100ms)
- Config changes: Full rebuild required

### Type Checking

```bash
npm run type-check
# TypeScript compiler in strict mode
# Catches type errors before runtime
```

### Linting

```bash
npm run lint
npm run lint -- --fix
# ESLint with auto-fix enabled
```

### Production Build

```bash
npm run build     # ~12 seconds
npm start         # Starts production server
```

---

## Scalability Considerations

### Horizontal Scaling

**Pattern**: Stateless server

```
Load Balancer
├── Next.js Server 1
├── Next.js Server 2
├── Next.js Server 3
└── ... (auto-scaled)
```

**No session state**: Can scale horizontally without sticky sessions

### Edge Deployment

**Option 1: Cloudflare Pages**
- Global edge network
- Automatic caching
- Zero-config deployment

**Option 2: AWS CloudFront + Lambda**
- Fast edge cache
- Lambda execution at edge
- Flexible configuration

### Database (Future)

**Phase 5+**: If dynamic features needed
- PostgreSQL (relational)
- MongoDB (document)
- Upstash Redis (cache)

---

## Accessibility Architecture

### WCAG 2.1 Level AA Compliance

**Built-in**:
- Semantic HTML (section, nav, main, article)
- Proper heading hierarchy (h1 > h2 > h3)
- Color contrast 4.5:1 minimum
- ARIA labels where needed

**Testing**:
- axe DevTools (automated)
- Screen reader testing (manual)
- Keyboard navigation (manual)

---

## Internationalization (i18n)

### Current State
English-only

### Future Implementation (Phase 5)
```
7 Languages:
├── English (en)
├── Spanish (es)
├── French (fr)
├── German (de)
├── Vietnamese (vi)
├── Chinese (zh)
└── Japanese (ja)
```

**Technology**: next-i18next or similar

---

## Disaster Recovery

### Backup Strategy

| Component | Backup | Frequency | Recovery Time |
|-----------|--------|-----------|---|
| Source Code | GitHub | Continuous | < 1 minute |
| Docker Image | Container Registry | Each build | < 5 minutes |
| CDN Cache | Automatic | Real-time | Instant |
| Static Content | Git | Continuous | < 1 minute |

### Failover

**Single Point of Failure**: None
- Stateless application
- Content on GitHub (source of truth)
- CDN caches content
- Automatic rollback via Git

---

## Migration Guide

### Next.js Version Updates

Current: 14.2.0 → Future: 15+

**Steps**:
1. Update package.json
2. Run `npm install`
3. Test locally
4. Type-check: `npm run type-check`
5. Build: `npm run build`
6. Deploy

### Breaking Changes

Monitor:
- Next.js release notes
- React breaking changes
- Tailwind CSS updates

---

## Technology Decision Records (TDR)

### TDR-1: Standalone Output Mode
**Decision**: Use `output: 'standalone'` in next.config.js
**Rationale**: Smaller Docker image, self-contained, faster cold starts
**Trade-off**: Cannot use Node.js APIs beyond basic HTTP

### TDR-2: Tailwind CSS + CSS Layers
**Decision**: Prefer Tailwind utilities + @layer for reusable patterns
**Rationale**: Utility-first is faster, @layer adds structure without CSS-in-JS
**Trade-off**: Slightly larger HTML class names

### TDR-3: IntersectionObserver for Scroll Animations
**Decision**: Use native IntersectionObserver API instead of library
**Rationale**: No dependency overhead, browser native, perfect for landing page
**Trade-off**: No IE11 support (acceptable for target audience)

### TDR-4: React Hooks State Management
**Decision**: Use React hooks instead of Redux/Zustand
**Rationale**: Landing page has simple state, no need for external state manager
**Trade-off**: Not suitable if state becomes complex (Phase 5+ decision)

---

## Future Enhancements

### Phase 4: Changelog & Testimonials
- [ ] Testimonials carousel
- [ ] FAQ section (expandable)
- [ ] Blog integration
- [ ] Waitlist form

### Phase 5: Performance & SEO
- [ ] Analytics integration
- [ ] Internationalization (2 languages: EN, VI)
- [ ] A/B testing framework
- [ ] Schema.org structured data
- [ ] Mobile app deeplinks

---

## Support & Questions

For architecture questions or proposals:
1. Review this document first
2. Check existing code patterns
3. Open GitHub discussion or issue
4. Propose with examples and trade-offs
5. Get consensus before implementation

---

## Summary

| Aspect | Technology | Status |
|--------|-----------|--------|
| **Framework** | Next.js 14 App Router | ✅ Stable |
| **Language** | TypeScript strict mode | ✅ Stable |
| **Styling** | Tailwind CSS | ✅ Stable |
| **Animation** | Framer Motion | ✅ Stable |
| **State** | React Hooks | ✅ Stable |
| **Deployment** | Docker standalone | ✅ Stable |
| **Database** | None (static site) | ✅ N/A |
| **Analytics** | Plausible (future) | ⏳ Phase 5 |
| **i18n** | Not yet implemented | ⏳ Phase 5 |

---

**Last Updated**: December 10, 2025
**Maintained By**: @trandactri
**License**: BSD-3-Clause

---

**End of Document**
