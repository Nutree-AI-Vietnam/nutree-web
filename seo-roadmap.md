# SEO roadmap

Where nutreeai.com stands on each part of the campaign process in `seo-process.md` (rules 10 to 20,
from Paul Vengeons' 20-prompt guide). Last updated 2026-10-18. Every number here comes from
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
