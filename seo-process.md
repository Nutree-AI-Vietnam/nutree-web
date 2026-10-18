# SEO process

These rules apply to every page created or edited on nutreeai.com, every time, without anyone
having to ask. Where they are stricter than `content/blog/README.md`, these rules win. Business
context (audience, competitors, tone, what we must never claim) is in `site-context.md`.

## Rules

1. **Check before creating.** Before creating a page, check Search Console and the sitemap. If a
   page already targets the keyword, optimize that page instead of creating a new one.
2. **One main keyword per page.** The title starts with that keyword, word for word.
3. **At least 5 internal links to every new page.** They come from pages on the same topic, sit
   inside the body text, and use the new page's main keyword as the anchor.
4. **One anchor, one page.** Never use the same anchor for two different pages.
5. **Structured data that fits the page, validated.** Article for articles, FAQPage for FAQ
   content, Person for the author, and Organization site-wide.
6. **Update the sitemap after every new page.**
7. **Never invent a number, a quote, a review or a source.** If a fact is missing, ask.
8. **Never rank Nutree first in a list of tools or providers.**
9. **Show the diff before publishing on a page that already gets clicks.** No change goes live on
   such a page until it has been approved.

## Campaign rules (from Paul Vengeons' guide, adopted 2026-10-18)

Source: "The complete 20-prompt SEO campaign process with Claude Opus 5.5" (X post by @VengeonsP,
2026-10-17). The guide presents these as rules of thumb from one practitioner, not proven laws.

10. **Rank every action by the five levers.** The levers are: search intent, the keyword in the
    title, internal links, site authority, and links to the page. An action that serves none of
    them goes to the bottom of the list.
11. **Match the search intent.** Read the live Google results before writing. The page type
    Google shows for a query is the only page type that can rank for it.
12. **Pick battles our authority can win.** Say so plainly when a keyword is out of reach.
    - Prefer keywords with buying intent ("[competitor] alternative", "[A] vs [B]", "[tool] for
      [audience]") over "what is X".
    - Prefer keywords that fewer than half of the top 10 results have in their title.
13. **Title formula.** The keyword word for word, then a colon, then one promise shaped by the
    intent.
    - Add the current year to rankings, comparisons and "best" pages.
    - Keep the title to about 600px and the description to about 920px.
14. **Protect what already ranks.** Before editing a page, check which queries it already gets
    clicks for. If optimizing it for a new query could cost those clicks, create a new page instead.
15. **Verify the report, not just the work.** After every edit, check the diff removed nothing
    that wasn't asked for. Check every ranking we claim on the live Google results that day.
16. **Pace.** At most one new page a day. On a site with little authority, about one a week.
17. **The 90-day rule.** After a real change, leave the page alone for 90 days. If someone asks
    how to improve it in that time, the answer is "nothing, work on the next keyword".
18. **Links in this order.**
    - Internal links come first.
    - Start homepage links from day one.
    - Add links to a specific page only once it has shown potential, and only as many as the top 3
      results have.
    - Never buy a link to a page less than 90 days old.
    - Never do A-to-B link exchanges.
19. **One page by hand per category first.** Build the first page of a category with the team in
    the loop. Later pages in that category copy it as their template.
20. **Honest comparisons.** A comparison page says where the rival wins.

## The weekly content routine

**Status: pending.** The team still has to apply this change in the routine's settings. Until
then, the "Nutree - SEM" routine still runs daily with its old instructions. Once applied, it runs
every Monday at 01:05 UTC (08:05 in Vietnam), reads this file, `site-context.md` and
`seo-roadmap.md` before every run, and follows rule 16.

- It publishes one page a week, only in a category whose first page has already been approved.
- The first page of a new category goes to the team as a pull request (rule 19).
- Any change to a page that gets clicks also goes to the team as a pull request, with the diff
  (rule 9).

## How each rule works in this repo

1. **Existing pages:** the sitemap is `src/app/sitemap.ts` (live at `/sitemap.xml`). To find
   blog posts that already target a keyword, run `grep -h '^title:' content/blog/*.mdx`. Search
   Console data comes from the team: the Ahrefs connector has no API access on the current plan.
2. **Title:** `title` in the post frontmatter is the page's H1 and its search title. Rule 2 is
   stricter than the README, which only asks for the keyword "near the start".
3. **Incoming links:** these are edits to existing posts. If one of those posts gets clicks,
   rule 9 applies to it.
4. **Anchor check:** before adding a link, grep `content/blog/` for the anchor text and confirm
   it doesn't already point to a different page.
5. **Structured data:** it is built in `src/lib/structured-data.ts` (Organization, WebSite,
   MobileApplication) and `src/lib/blog-structured-data.ts` (BlogPosting, Blog, BreadcrumbList,
   ItemList). Validate with Google's Rich Results Test and the Schema Markup Validator.
6. **Sitemap:** blog posts and categories are added to the sitemap automatically. Any other new
   page has to be added to `ROUTES` in `src/app/sitemap.ts` by hand.
7. **Missing facts:** this is the same rule as the README's "Invent nothing" and rule 3 in
   `site-context.md`.
8. **Tool lists:** competitors may be named but never linked (rule 8 in `site-context.md`).
9. **Pages with clicks:** the list of pages that get clicks is in section 6 of `site-context.md`.

## Open questions

- **Named author:** the guide says a real named author beats "the editorial team". The README
  fixes the byline as "Đội ngũ Nutree" (the Nutree team). This is the same question as Person
  markup below.

- **Person for the author:** posts have no author field, and the README fixes the byline as
  "Đội ngũ Nutree". It also forbids saying a doctor or dietitian wrote or reviewed a post. There
  is no real named author to describe, so Person markup can't be added without inventing one.
  Who is the author?
- **At least 5 incoming links:** the blog has 8 posts, so most topics don't yet have 5 pages on
  the same topic. When there are fewer, should the new page wait, or link from as many as exist?
- **FAQPage:** posts have a "Câu hỏi thường gặp" section, but no FAQPage markup is generated yet.
