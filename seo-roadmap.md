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

- **Pace:** about one page a week at our authority (rule 16). The "Nutree - SEM" routine was moved
  from daily to weekly (Mondays) on 2026-10-18. See "The weekly content routine" in
  `seo-process.md`.
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
  - **Partly set up:** the weekly routine ends every run with up to 5 next tasks taken from this
    file.
  - **Missing:** a data-driven loop that reads Search Console. That waits for a working data
    source.
