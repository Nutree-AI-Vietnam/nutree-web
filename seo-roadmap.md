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
  1. Translate the Vietnamese posts that suit English searchers through the daily routine, one
     page a day at most (rule 16), in the order of the "Daily content queue" below: bánh mì, cơm
     tấm, bún bò Huế and bún chả first. Check each English keyword on the live results first.
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
  - The daily routine follows the "Daily content queue" below; see "The daily content routine" in
    `seo-process.md`.
  - At the 90-day reviews, check whether daily publishing got pages indexed. If most of them
    weren't indexed, slow down.
- **Categories with an approved first page** (the routine may publish more pages in these):
  - Vietnamese dish calories. Template: `content/blog/pho-bo-bao-nhieu-calo.mdx`.
  - English translations of Vietnamese dish calories, once pull request #34 is merged. Template:
    `content/blog/en/pho-calories.mdx`.
- **New categories waiting for a first page** (the routine drafts these as a pull request and
  never publishes them):
  - "[competitor] alternative"
  - "[A] vs [B]"
  - "[app] for [audience]"
  - "Thực phẩm giàu [X]" (a food list, Vinamilk's "thuc-pham-giau-X" pattern)
  - "[Situation] nên ăn gì" (Vinamilk's "nên ăn gì" pattern)

## Daily content queue (from 2026-10-26)

Content goes out one page a day, never in bulk (Alex, 2026-10-25: "This should be daily job everyday
not a bulk publishing now"). The daily "Nutree - SEM" routine takes the first row marked "Next" that
it is allowed to do, then marks it "Done <date>" (or "Draft PR <link>") in the same commit. One page
a day in total, English and Vietnamese together (rule 16). Rows that start a new category only ever
go to the team as a draft pull request (rule 19), at most one open at a time; the routine then moves
on to the next row the following day.

| # | Lang | Page | Type | Status |
| --- | --- | --- | --- | --- |
| 1 | EN | `banh-mi-calories`: translation of `banh-mi-thit-bao-nhieu-calo` | Approved after PR #34 | Next |
| 2 | VI | Next "[món] bao nhiêu calo" dish the routine picks (rule 1 check first) | Approved | Next |
| 3 | EN | `com-tam-calories`: translation of `com-tam-bao-nhieu-calo` | Approved after PR #34 | Next |
| 4 | VI | "Thực phẩm giàu chất xơ ít calo" (research notes below) | New category: draft PR | Next |
| 5 | EN | `bun-bo-hue-calories`: translation of `bun-bo-hue-bao-nhieu-calo` | Approved after PR #34 | Next |
| 6 | VI | Next "[món] bao nhiêu calo" dish | Approved | Next |
| 7 | EN | `bun-cha-calories`: translation of `bun-cha-bao-nhieu-calo` | Approved after PR #34 | Next |
| 8 | VI | Next "[món] bao nhiêu calo" dish | Approved | Next |

- **English rows wait for pull request #34.** Until `content/blog/en/` exists on `main`, skip
  English rows and do the next Vietnamese one. Each English row needs its own live-results check
  for the English keyword first (rule 11): keep the article format only if the results are articles.
- **When the queue runs out**, the routine picks a Vietnamese dish as before and adds the next
  8 rows here in the same pattern (English translations of published dish posts, alternating with
  new Vietnamese dishes), plus at most one row from the Vinamilk topic ideas in "Lessons from
  vinamilk.com.vn/blogs" above.

**Research notes for row 4 (checked 2026-10-25; reuse, don't redo):**
- Keyword: "thực phẩm giàu chất xơ ít calo". The head term "thực phẩm giàu chất xơ" is out of reach
  (rule 12): its live results are numbered list articles from Vinmec, Pharmacity and Long Châu, all
  with the phrase in the title. Use a numbered list format, as they do.
- WHO (2023): adults should eat at least 25 g of naturally occurring dietary fibre a day, and at
  least 400 g of vegetables and fruit.
  [WHO news, 17 Jul 2023](https://www.who.int/news/item/17-07-2023-who-updates-guidelines-on-fats-and-carbohydrates).
- Reynolds et al. (2019), Lancet 393:434–445,
  [doi:10.1016/S0140-6736(18)31809-9](https://doi.org/10.1016/S0140-6736(18)31809-9): trials show
  lower body weight with higher fibre intakes; risk reduction was greatest at 25–29 g a day.
- Miketinas et al. (2019), J Nutr 149:1742–1748,
  [doi:10.1093/jn/nxz117](https://doi.org/10.1093/jn/nxz117): in adults on calorie-restricted
  diets (POUNDS Lost, 345 people, 6 months), fibre intake was the strongest predictor of weight loss
  and was linked to sticking to the diet.
- NIDDK, [Eating, diet & nutrition for constipation](https://www.niddk.nih.gov/health-information/digestive-diseases/constipation/eating-diet-nutrition):
  add fibre "a little at a time" and "drink plenty of liquids". NIDDK,
  [gas page](https://www.niddk.nih.gov/health-information/digestive-diseases/gas-digestive-tract/eating-diet-nutrition):
  "Some people have more gas symptoms when they consume too much fiber."
- USDA FoodData Central (SR Legacy), fibre and energy per 100 g, link as
  `https://fdc.nal.usda.gov/food-details/<id>/nutrients`: ổi 5,4 g / 68 kcal (173044); quả bơ
  6,7 g / 160 kcal (171705); lê 3,1 g / 57 kcal (169118); táo cả vỏ 2,4 g / 52 kcal (171688); chuối
  2,6 g / 89 kcal (173944); cam 2,4 g / 47 kcal (169097); đu đủ 1,7 g / 43 kcal (169926); xoài
  1,6 g / 60 kcal (169910); bông cải xanh luộc 3,3 g / 35 kcal (169967); đậu bắp luộc 2,5 g / 22 kcal
  (169261); cà rốt sống 2,8 g / 41 kcal (170393); bắp cải sống 2,5 g / 25 kcal (169975); rau bina
  sống 2,2 g / 23 kcal (168462); giá đỗ 1,8 g / 30 kcal (169957); đậu đen luộc 8,7 g / 132 kcal
  (173735); đậu xanh (hạt) luộc 7,6 g / 105 kcal (174257); đậu nành Nhật chín 5,2 g / 121 kcal
  (168411); đậu phụ cứng 2,3 g / 144 kcal (172475); khoai lang nướng cả vỏ 3,3 g / 90 kcal (168483);
  bắp ngọt luộc 2,4 g / 96 kcal (169999); yến mạch khô 10,1 g / 379 kcal (173904); yến mạch nấu với
  nước 1,7 g / 71 kcal (173905); gạo lứt nấu chín 1,6 g / 123 kcal (169704); cơm trắng 0,4 g /
  130 kcal (168878); bánh mì nguyên cám 6,0 g / 252 kcal (172688); bánh mì trắng 2,7 g / 266 kcal
  (174924); hạt chia 34,4 g / 486 kcal (170554); đậu phộng rang 8,4 g / 587 kcal (173806).
- Angle: fibre helps you stay full on fewer calories; whole-food swaps (gạo lứt for some cơm trắng,
  bánh mì nguyên cám, fruit instead of juice); no fibre supplements (site rule: no supplements).
  Readers with digestive conditions ask a doctor. Re-check every number on the USDA page before use.
- **90-day review (prompt 19):** each published page gets a check 90 days after it goes live.
  The first is due 2027-01-10 for `macro-la-gi` and `pho-bo-bao-nhieu-calo`.
- **Monday loop (prompt 20):** a weekly run that returns 5 tasks, not a report.
  - **Partly set up:** every Monday, the daily routine ends its run with up to 5 next tasks taken
    from this file.
  - **Missing:** a data-driven loop that reads Search Console. That waits for a working data
    source.
