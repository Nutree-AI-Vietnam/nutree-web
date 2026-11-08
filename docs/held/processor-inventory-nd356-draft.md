# DRAFT — processor and data-flow inventory for ND356/392 discussion

This is not a filing, not a notification, and not a legal certification. It records what the nutree-web repository shows, plus source-review facts from `mealtrack_backend` that were not checked against a running deployment.

## How to read dates and countries

- A commit hash below is the earliest **code-introduction** evidence found in that repository: the first mainline commit that added the cited code. It is not the date production first processed personal data, not the date an integration was enabled, and not a compliance deadline.
- **Actual processing start: UNKNOWN** for every processor in this note.
- **Actual processing or storage country: UNKNOWN** for every processor in this note.
- A company headquarters, a CDN or API hostname, a package in `package.json` or `requirements.txt`, a placeholder host, or a git commit is not evidence of the processing country or the processing start. USDA’s hostname and an example PostHog host that contains `us` do not establish a country.

## A. nutree-web

Source tree: `Nutree-AI-Vietnam/nutree-web` `main` `67b51cf9d69983a55fcf3bde1c95ee8e4287d359`. No secret values are copied here.

Declared text in `src/lib/legal-content.ts` (“Third-Party Services”) names categories the policy says must match production. That text is **declared**. It is not, by itself, code integration or an observation.

| Processor | Role in this repo | Data this repo can send or store | Purpose | Class | Code-introduction commit (not a processing start) | Actual start | Country |
|---|---|---|---|---|---|---|---|
| TikTok pixel and Events API | `src/lib/tiktok-pixel.ts` loads `analytics.tiktok.com` after consent. `src/lib/cookie-consent.ts` holds the pixel id. `src/app/(vi)/api/tiktok-events/route.ts` forwards events only when the consent cookie allows it. | Page events and the pixel id after Allow. The access token is an env name (`TIKTOK_EVENTS_ACCESS_TOKEN`), not printed here. | Ads measurement | Code-integrated. Events API is runtime-configured. Pixel id is in source. | `70f9c7a45eab42b3fcf59cce7e03efa0fe5b9bfd`, 2026-07-18, “feat: add TikTok pixel”. Consent gate is later, in `#44`. | UNKNOWN | UNKNOWN. Hostnames seen in one smoke are not a country. |
| PostHog | `posthog-js` is a dependency. `src/components/providers/PostHogProvider.tsx` calls it only when `NEXT_PUBLIC_POSTHOG_KEY` is set, and only after consent. Default host string in code is `https://app.posthog.com`. | Usage events and, if recording is started, session replay. | Product analytics | Code-integrated and runtime-configured. | `58d596b8523841a92a8ca29940c15e559f610340`, 2026-02-06, “feat(web): add PostHog analytics with session recording”. | UNKNOWN | UNKNOWN |
| Google Ads tag | `src/lib/optional-analytics.ts` and `src/components/providers/AdAttribution.tsx` use `NEXT_PUBLIC_GOOGLE_ADS_ID`. Empty in `.env.example`. | A conversion event after consent, only if the id is set. | Ad measurement | Code-integrated and runtime-configured. | `74e98a162c66f6773901ce06076874dce61bee22`, 2026-10-25, `#34`. | UNKNOWN | UNKNOWN |
| Quiz host | `src/lib/constants.ts` links to `https://quiz.nutreeai.com` and `https://quiz.nutreeai.com/survey/en`. Campaign query parameters are copied onto that link. | The browser navigates away. This repo does not receive quiz cookies. | Plan quiz and English checkout handoff | Code-integrated outbound link. The quiz app’s own processors are outside this repo. | English path: `b2707da0ffdd22771fa348bc1a84def603c55930`, 2026-11-07, `#43`. The Vietnamese quiz URL is older; first processing is still UNKNOWN. | UNKNOWN | UNKNOWN |
| VietQR / MB Bank display | `src/lib/pay-bank.ts` and the Vietnamese `/mua-goi` screen. English `/mua-goi` hides that screen. | The page shows the transfer instructions. This repo does not call a bank API. | One-time yearly website transfer | Code-integrated display. | `0128f7c977a4218fcad44c3319bf6ff0947b2c23`, 2026-08-26. | UNKNOWN | UNKNOWN |
| Firebase Auth (admin catalog only) | `src/lib/firebase-admin-auth.ts` can call Identity Toolkit and the secure-token endpoint when an admin API key env is set. | Admin email and password for that login. Not the public account-deletion flow. | Staff login to the meal catalog | Code-integrated and runtime-configured. | `64c0b9f615289c0e6365815dd44efdc144768be2`, 2026-07-22, `#15`. | UNKNOWN | UNKNOWN |
| Paddle, RevenueCat, Apple, Google Play | Named in policy and FAQ copy. No Paddle, RevenueCat, Apple, or Google Play SDK or client integration was found under `src/`. | This repository does not contain a purchase SDK call for these providers. Outbound links in the pages, including Paddle, Apple, and Google Play URLs, can cause the browser to request that host when someone follows the link. | Declared purchase channels, plus outbound links | No SDK or client integration found. Links are present. | Not applicable as an SDK integration commit. Actual processing start remains UNKNOWN. | UNKNOWN | UNKNOWN |
| Sentry | A logo links to `https://sentry.io` in `src/components/sections/StartupPartners.tsx`. `package.json` has no Sentry SDK. | No error payload from this repo was found. | Partner mark | Declared in the privacy policy. Not code-integrated here. | Not used as a processing date. | UNKNOWN | UNKNOWN |
| Vercel | This site’s known host from deployment records. The repo does not set a region. | The rendered site and request logs the host keeps. | Hosting | Runtime platform. | Not a processing-start date. | UNKNOWN | UNKNOWN |

Privacy-policy rows for Firebase, Gemini or OpenAI, Cloudinary, Apple Health, and generic food or database providers are **declared** for the product. They are not integrations found in nutree-web application code. Whether the app or backend actually uses them is the backend and app evidence below, not a conclusion from the policy sentence.

### What was observed, once, on the deployed site

After pull request 44 was in production, a browser smoke of `https://nutreeai.com` saw: no TikTok, PostHog, or Google tag before a choice; `POST /api/tiktok-events` returned 403 without the consent cookie; after Allow, the TikTok script and `window.ttq` loaded. PostHog and Google Ads did not load in that build, which fits missing public keys, not a finding that they never ran. After a later reload with the denied cookie, `window.ttq` was absent. That smoke is one observation. It is not the first processing date, and the hostnames are not a country.

## B. mealtrack_backend (source review only)

Source: `Nutree-AI-Vietnam/mealtrack_backend` `main` `a2f71d8bf3c371114d911b61cfc96092c46f5049`, read from git. No database, deploy, or vendor account was queried. Production env values can differ from defaults. **Actual processing start and actual country are UNKNOWN for every row**, including where a hostname looks like a US government API or an example host contains `us`.

The commit named in the backend review is code-introduction evidence only. Those commits are not repeated here as processing dates. File anchors below are in that backend tree at that SHA.

| Processor | What the source sends or stores | Purpose | Class at that SHA |
|---|---|---|---|
| Neon Postgres | Account, health, meals, payments, web-funnel email. Env names only: `APP_DATABASE_URL`, `DATABASE_URL`, `DATABASE_URL_DIRECT`, `DB_HOST` (`src/infra/config/settings.py`). | Primary store | Code-integrated. Region string in the example host is a placeholder. |
| Render | Docker web service (`render.yaml`). Health output can echo the service name, git SHA, and environment. | Host | Code-integrated. No region in `render.yaml`. |
| Firebase Auth and FCM | ID token, uid, email, phone, display name, photo URL; device tokens and notification text. | Sign-in and push | Code-integrated. |
| OpenAI | Meal text, photos, chat, recipe text, transcription audio, depending on route. `store_responses` defaults false. | Inference | Code-integrated. The default is a request flag, not a retention period. |
| Google Gemini | No current `src/` import. Packages remain in `requirements.txt`. An image class posts to `generativelanguage.googleapis.com` and is not constructed by the app. | Historical / unwired | Package present. Not current app wiring. |
| Cloudflare Workers AI, Images, R2 | Text, vision, generated images; avatar and other images; meal photo bytes. R2 signing scope string `auto` is not a country. | AI fallback and media | Code-integrated. |
| Cloudinary | No current SDK. Old URLs can still be rewritten. | Historical image host | Code remnant. |
| Redis | Cache and rate-limit counters. Default host `localhost`. Example comments mention Upstash and Render. | Cache | Code-integrated. Production host UNKNOWN. |
| RevenueCat | Subscriber id and store webhooks. | Subscriptions | Code-integrated. |
| Google Play Developer API | Purchase tokens when cancelling a renewal. | Store subscription call | Code-integrated. |
| Apple | Universal-link file and an App Store redirect. Movement rows can be labeled `apple_health` from the client. No Apple API client found. | Links and a client-supplied label | Partial. |
| Sentry | Exceptions and diagnostics. `SENTRY_SEND_PII` defaults false. Off when environment is development or local. | Monitoring | Code-integrated. Whether the DSN is set in production is UNKNOWN. |
| PostHog | Not called by current backend `src/`. Example host remains in `.env.example`. Removed in commit `faea0b783469ade73d90af55ecd918e2dc767982` (2026-10-04), which is a code-removal date, not proof of when processing stopped. | Was analytics | Historical code. |
| FatSecret, USDA FoodData Central, Open Food Facts, Brave Search | Food and barcode lookups. USDA host is `api.nal.usda.gov`. | Nutrition reference | Code-integrated. Hostname is not a processing country. |
| Pexels, Unsplash | Food-photo search. | Stock photos | Code-integrated. |
| YouTube Data API, yt-dlp, TikTok oEmbed | Recipe import. TikTok here is oEmbed, not the website pixel. | Recipe import | Code-integrated. |
| Resend | Legacy claim email only, and only if several flags including `EMAIL_ENABLED` (default false) are set. | Claim email | Code-integrated, default off. Production flags UNKNOWN. |
| nutree-affiliate | Affiliate code and subscription events when the handler runs. | Affiliate | Code-integrated. |
| Pollinations | Image class is not constructed outside tests. | Unwired | Code present, not wired. |

`ffmpeg` in the image runs locally for recipe import. It is not a remote processor.

Account deletion in that source does not call RevenueCat, Sentry, OpenAI, Resend, R2, or PostHog to erase a person. It soft-deletes and partially anonymizes. That behavior is described in the held deletion note. It is not a retention period.

A source review of the backend rate limiter says its default key reads an unverified JWT `sub`. That is not recorded here as observed abuse, and this inventory does not change the backend.

## Still open

App binaries, store consoles, vendor contracts, DPAs, production env values, backup and region settings, and the quiz app’s own server are not in the two trees reviewed here. Destination country and the first actual processing date stay UNKNOWN until those records exist. This draft does not fill them in.
