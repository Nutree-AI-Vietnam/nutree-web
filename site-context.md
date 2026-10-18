# Site context

Filled in with the team on 2026-10-18. Every answer came from the team or from a named source.
Anything still open is marked _Missing_ or "not yet defined".

## 1. Site and CMS

- **URL:** https://nutreeai.com
- **CMS:** None. Content is MDX files in this repo (`content/blog/<slug>.mdx`), published at
  `/blog/<slug>` by the Next.js 15 (App Router) site.

## 2. What we sell, to whom, at what price

- **Product:** Nutree, a paid mobile app. There is no free tier.
- **For whom:** People everywhere who care about health and wellness.
- **Price:** We sell at several price variants. Never state a specific price in content.

## 3. Who buys

- **Buyer situations (all count):**
  - Someone trying to lose weight
  - A gym-goer tracking protein
  - Someone managing a health condition
  - A busy office worker
- **Words buyers use:** "scan calo", "keep track", "gym", "hydration", "meal planner"

## 4. Main competitors

- **MacroFactor**: a macro tracker by Stronger By Science.
  [App Store](https://apps.apple.com/us/app/-/id1553503471)
- **MyFitnessPal**: https://www.myfitnesspal.com
- **Dietfit**: Dietfit AI: Calorie Tracker by c0x12c Inc. It estimates calories from meal photos
  and runs on a subscription. [App Store](https://apps.apple.com/app/id6747063701)

## 5. Current authority

From the free Ahrefs Website Authority Checker for `nutreeai.com`, read on 2026-10-18:

| Metric | Value |
|--------|-------|
| Domain Rating | **0** |
| Referring domains ("Linking websites") | **861** (35% dofollow) |
| Backlinks | **913** (35% dofollow) |

Note: a DR of 0 alongside 861 referring domains usually means almost none of the linking sites
carry authority of their own. Review the "Top 100 backlinks" list in Ahrefs before relying on
these links.

## 6. Pages that make money today

- **Money page (per the team):** https://quiz.nutreeai.com. The quiz builds a personalized plan
  and leads to the purchase. The site sends people there from the home hero, the final CTA and
  the CTA in every blog post (`SITE_CONFIG.quizUrl` in `src/lib/constants.ts`).
- **Top pages by clicks.** Source: Google Search Console, Performance, last 3 months, read on
  2026-10-18 from a screenshot. Rows 1 to 9 are shown; row 10 was cut off.

  | # | Page | Clicks | Impressions |
  |---|------|-------:|------------:|
  | 1 | https://nutreeai.com/ | 1,749 | 3,720 |
  | 2 | https://nutreeai.com/pricing | 30 | 1,270 |
  | 3 | https://nutreeai.com/faq | 28 | 1,310 |
  | 4 | https://nutreeai.com/cancellation | 10 | 761 |
  | 5 | https://nutreeai.com/complaints | 10 | 705 |
  | 6 | https://nutreeai.com/payment | 7 | 674 |
  | 7 | https://nutreeai.com/terms | 5 | 935 |
  | 8 | https://quiz.nutreeai.com/ | 3 | 129 |
  | 9 | https://nutreeai.com/research | 2 | 403 |

- **What the data shows:**
  - The home page gets nearly all organic clicks.
  - The quiz, which is the page that makes money, gets only 3 clicks from search. Its traffic
    arrives through links from the main site, not from Google.
  - Rows 2 to 7 are policy pages. `/pricing` is a pricing *policy* page with no specific prices,
    which fits rule 1 in section 7.
  - No blog post appears in the top 9.

## 7. What we must never do

The team confirmed these apply everywhere. Rules 2 to 8 match the health content rules in
`content/blog/README.md`.

1. Never state a price. We sell at several price variants.
2. Never make medical promises: no "chữa khỏi" (cures), "đảm bảo" (guaranteed), or "lose X kg in
   Y days". For illness, pregnancy, eating disorders or medication, tell readers to ask a doctor.
3. Never invent statistics, studies, quotes, experts, testimonials, user counts or rankings. Never
   say a doctor or dietitian wrote or reviewed content.
4. Never give a number without a source.
5. Never recommend extreme diets, skipping meals, diet pills or supplements, or fasting for
   at-risk people.
6. Never claim Nutree is free, 100% accurate or a medical tool. Never cite user numbers, ratings
   or store rankings.
7. Never call the quiz free or say how long it takes.
8. Never link to other calorie-counting apps.

Not yet defined: tone of voice, and legal limits on naming or comparing competitors.
