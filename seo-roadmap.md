# SEO roadmap

Where nutreeai.com stands on each part of the campaign process in `seo-process.md` (rules 10 to 20,
from Paul Vengeons' 20-prompt guide). Last updated 2026-10-25. Every number here comes from
`site-context.md` or the repo. Anything that needs data we don't have yet is marked **Needs data**.

## Part 0: setup

| Step | Status |
|------|--------|
| Context file (prompt 1) | Done: `site-context.md` |
| Rules file (prompt 2) | Done: `seo-process.md` |
| Connected data source | **Blocked.** The Ahrefs connector returns "Insufficient plan" on every call. Search Console data arrives as screenshots from the team. |
| Two-minute test (top 5 pages from the data source match Search Console) | **Can't run** until a data source answers. |

## Part 1: pick the battles

- **Authority check (prompt 3):**
  - Ahrefs reports DR 0 with 861 referring domains.
  - The guide's line is about 50 referring domains, but a DR of 0 means those domains pass almost
    nothing.
  - Working assumption: treat the site as having **no authority**, so no competitive keyword is
    in reach yet.
- **Current search demand:**
  - Every top query in Search Console is the brand name ("nutreeai", "nutree", "nutree ai", ...).
  - We have no non-brand clicks yet.
- **Search Console trend.** Source: the team's daily export of site-wide clicks, impressions, CTR
  and position, 2026-07-17 to 2026-10-16.

  | Period | Days | Clicks | Clicks/day | Impressions | CTR |
  |--------|-----:|-------:|-----------:|------------:|----:|
  | Jul 17 – Aug 7 | 22 | 152 | 6.9 | 484 | 31.4% |
  | **Aug 8 – Aug 28 (spike)** | 21 | **1,260** | **60.0** | 2,244 | 56.1% |
  | Aug 29 – Oct 6 | 39 | 278 | 7.1 | 915 | 30.4% |
  | Oct 7 – Oct 8 (small spike) | 2 | 50 | 25.0 | 132 | 37.9% |
  | Oct 9 – Oct 16 | 8 | 63 | 7.9 | 323 | 19.5% |
  | **Total** | 92 | **1,803** | 19.6 | 4,098 | 44.0% |

  - **70% of all clicks (1,260 of 1,803) came in three weeks, Aug 8–28.** The peak was 248
    clicks on Aug 9.
    - The average position was about 1.4 and the CTR over 50%, which looks like people
      searching the brand name.
    - **The cause is unknown.** The team wasn't sure when asked on 2026-10-18. Don't attribute
      the spike to anything without a source.
  - **Outside the spikes, the site gets about 7 clicks a day.** That was true before the spike
    and is true again after it.
  - **Since the blog started (Oct 12):** impressions are up a little (about 40 a day against
    about 23 a day in September), but CTR fell to about 18–20%.
    - The new impressions aren't turning into clicks yet.
    - It's too early to judge, because of the 90-day rule (rule 17).
  - **This export has no per-page or per-query positions**, so the quick wins (prompt 6) still
    need the Pages and Queries export with the Position column.
- **Content so far:** 8 blog posts in 7 days (2026-10-12 to 2026-10-18).
  - 4 are "what is X / how to calculate" posts: macro, TDEE, thâm hụt calo, protein.
  - 2 are Vietnamese food calories: phở bò, bánh mì thịt.
  - 1 is a list: món ăn sáng giàu protein.
  - 1 is an app explainer: app tính calo bằng hình ảnh.
- **Keyword categories (prompt 4):** **Needs data.** These candidate categories fit the guide's
  patterns but have **not** been checked for volume, results page type or competition:
  - "[competitor] alternative", e.g. app thay thế MyFitnessPal
  - "[A] vs [B]", e.g. MacroFactor vs MyFitnessPal
  - "[app] for [audience]", e.g. app đếm calo cho người tập gym
  - "[Vietnamese dish] bao nhiêu calo" (already started)
- **Title test (prompt 5):** **Needs data.** For each candidate keyword, check whether fewer than
  half of today's top 10 Google results have it in their title. This needs a live results-page
  check.
- **Quick wins (prompt 6):** **Needs data.** Pull a Search Console export with the **position**
  column (Pages and Queries, last 3 months). Then list page and query pairs at positions 5 to 20
  that have real impressions.

## Part 2: build the page

- Pick one category and one keyword from Part 1, then build the first page by hand with the team
  (rule 19).
- That page becomes the template for its category.

## Part 3: links

- **Internal:** add at least 5 contextual links to every page that matters (rule 3).
- **Homepage authority:** start free homepage links now, in parallel with the strategy work. Use
  real sites our buyers read, with no exchanges and no paid links (rule 18).
- **Backlink audit:** review "Top 100 backlinks" in Ahrefs to find out why 861 referring domains
  add up to DR 0.

## Part 4: GEO (being quoted by AI assistants)

- **Evaluation queries (prompt 16):** **Not started.** List 5 to 10 real questions buyers ask AI
  assistants, for example "best calorie app for …". The team should write these from what buyers
  actually ask.
- **Bing Webmaster Tools:** set it up and open the AI Performance report. The guide calls it the
  only free source of the searches AI assistants actually make.
- **Third-party lists:** get Nutree into other people's lists, reviews and threads. Never rank
  Nutree first on our own site (rule 8).

## Bilingual blog (added 2026-10-25)

The team asked for a Vietnamese and an English blog, kept apart so each language ranks on its own,
following vinamilk.com.vn/blogs.

- **Done:**
  - `/en/blog` is a separate English blog with its own categories (`/en/blog/topic/...`), feed
    (`/en/blog/feed.xml`) and sitemap entries. `/blog` and every Vietnamese URL are unchanged.
  - Translated posts are paired by `translationOf`. The pair gets `hreflang` (vi, en, x-default → vi),
    a link to the other language under the title, and `workTranslation`/`translationOfWork` data.
  - English pages carry `og:locale en_US`, `inLanguage en`, English breadcrumbs and an English header
    and footer. The EN/VI switch on a blog page opens the translation, or the other blog's home when
    there is none.
  - First English post: `/en/blog/pho-calories`, a translation of the category template
    `pho-bo-bao-nhieu-calo`. The live results for "pho calories" are articles (LIVESTRONG, FatSecret
    and similar), so an article matches the intent. With no authority, this keyword is a long shot
    (rule 12); its first job is to serve English readers.
- **Not possible yet:** the root `<html lang>` stays `vi` in the server HTML on English pages, since
  the whole site shares one root layout. The content wrapper carries `lang="en"`, and the browser
  switches the root to `en` after load. Google says it detects a page's language from its content
  and ignores `lang`, so this does not affect ranking. Changing it means splitting the app into two
  root layouts, a larger change.
- **Next:**
  1. Translate the Vietnamese posts that suit English searchers, one page a day at most (rule 16). The
     next candidates are the other dish posts: bánh mì, cơm tấm, bún bò Huế and bún chả. Check each
     English keyword on the live results first.
  2. Give each English post links from other English posts (rule 3) as the English blog grows.
  3. Add Search Console filters for `/en/` to track the English blog separately.

## Lessons from vinamilk.com.vn/blogs (studied 2026-10-25)

What their blog does, and what we take from it. We learn from their structure and do not copy their
text: copying would be someone else's work, and Google filters duplicate pages.

| They do | We do |
| --- | --- |
| Separate trees per language (`/blogs`, `/en/blogs`), localized category and article slugs, `hreflang` only between real translations | Same since 2026-10-25 |
| English edition is smaller: only some articles are translated | Same: translate selectively |
| Titles are a question plus a promise: "Sữa A2 là gì? Lợi ích…", "Bé bị tiêu chảy nên ăn gì và hạn chế ăn gì…", "TOP 10+ …" | Already our pattern; add the "[situation] nên ăn gì" form (see below) |
| Numbered outline: `1.`, `2.`, `3.` H2s and `3.1`, `3.2` H3s in list articles | Use numbered H3s in list posts, e.g. "món ăn sáng giàu protein" |
| In-body links with descriptive anchors to related posts and to product pages | We link related posts; also link the quiz from the body where the topic fits |
| Category pages act as topic hubs | Same (`/blog/chu-de/...`) |
| Expert author box with Person markup (a real, named doctor) | Open question: no real named author yet; never invent one |
| Article + BreadcrumbList data, `wordCount`, meta keyword | We now also send `wordCount` and `thumbnailUrl` |
| Weak spots: listing descriptions repeat the label, articles use `og:type website`, many posts have no sources or FAQ | We already do better on all three |

**Topic ideas from their pattern** (need a volume and live-results check before use, rule 11):
"giảm cân nên ăn gì", "tập gym nên ăn gì", "ăn kiêng nên ăn gì buổi tối", "TOP món ăn ít calo".
Medical-condition topics ("tiểu đường nên ăn gì") need extra care under the health content rules.
A recipe category like their "Công thức món ngon" (low-calorie recipes with calories per serving)
would be a new category, so its first page goes to the team first (rule 19).

## SEM (paid search)

Before 2026-10-25 nothing in the site code supported paid search: the site had the TikTok pixel and
PostHog, but no Google Ads tag and no UTM handling, and ad click IDs were lost on the way to the
quiz, where people actually buy.

- **Done (2026-10-25, `src/components/providers/AdAttribution.tsx`):**
  - **Attribution reaches the quiz.** UTM tags and ad click IDs (`gclid`, `gbraid`, `wbraid`,
    `fbclid`, `ttclid`, `msclkid`) from the landing URL are kept for the session and added to every
    link to quiz.nutreeai.com, even after the visitor browses other pages first. Paid clicks can now
    be matched to quiz purchases, as long as the quiz records these parameters with the purchase
    (check with the quiz team).
  - **Quiz clicks are measured.** Each click through to the quiz is sent to PostHog as
    `quiz_cta_click`, with the page it came from and the campaign tags. This shows which blog posts and
    campaigns send people to the money page.
  - **Google Ads is ready to switch on.** Set `NEXT_PUBLIC_GOOGLE_ADS_ID` (the `AW-...` ID) and the
    Google tag loads, linked across to the quiz domain. Set `NEXT_PUBLIC_GOOGLE_ADS_QUIZ_LABEL` too and
    each quiz click counts as a conversion. With neither set, nothing loads.
- **Needs the team:**
  1. A Google Ads account: put its ID and conversion label in the deploy environment.
  2. Make the purchase on quiz.nutreeai.com the main conversion (a Google tag on the quiz's thank-you
     page, same `AW-` ID). The quiz-click conversion is a secondary signal.
- **Campaign plan:**
  1. **Brand campaign first:** every top organic query is the brand name (section 3 of
     `site-context.md`), so a small brand campaign protects those searches from competitors' ads.
     Landing page: the home page or the quiz.
  2. **Non-brand ad groups mirror the blog categories**, each landing on the matching post or category
     page with the quiz CTA: "[món] bao nhiêu calo" → the dish post; "app đếm calo" →
     `/blog/app-tinh-calo-bang-hinh-anh`; English "pho calories" → `/en/blog/pho-calories`. Check
     volumes and costs in Keyword Planner first; this file has no numbers for them yet.
  3. **Tag every ad URL** with `utm_source`, `utm_medium=cpc` and `utm_campaign`, so PostHog's
     `quiz_cta_click` events can be split by campaign.
  4. **Ad copy follows section 7 of `site-context.md`:** no price, no "free", no medical promises, no
     user counts.
  5. **Paid data feeds SEO:** paid search terms that convert are the best candidates for new blog
     posts.

## Part 5: keep the machine honest

- **Pace:** at most one page a day. The team chose this on 2026-10-18 (rule 16). The guide's
  suggestion for a site with little authority is about one a week.
  - The new routine instructions are pending until the team pastes them in; see "The daily
    content routine" in `seo-process.md`.
  - At the 90-day reviews, check whether daily publishing got pages indexed. If most of them
    weren't indexed, slow down.
- **Categories with an approved first page** (the routine may publish more pages in these):
  - Vietnamese dish calories. Template: `content/blog/pho-bo-bao-nhieu-calo.mdx`.
- **New categories waiting for a first page** (the routine drafts these as a pull request and
  never publishes them):
  - "[competitor] alternative"
  - "[A] vs [B]"
  - "[app] for [audience]"
- **90-day review (prompt 19):** each published page gets a check 90 days after it goes live.
  The first is due 2027-01-10 for `macro-la-gi` and `pho-bo-bao-nhieu-calo`.
- **Monday loop (prompt 20):** a weekly run that returns 5 tasks, not a report.
  - **Partly set up:** every Monday, the daily routine ends its run with up to 5 next tasks taken
    from this file.
  - **Missing:** a data-driven loop that reads Search Console. That waits for a working data
    source.
