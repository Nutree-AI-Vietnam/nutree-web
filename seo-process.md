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

- **Person for the author:** posts have no author field, and the README fixes the byline as
  "Đội ngũ Nutree". It also forbids saying a doctor or dietitian wrote or reviewed a post. There
  is no real named author to describe, so Person markup can't be added without inventing one.
  Who is the author?
- **At least 5 incoming links:** the blog has 8 posts, so most topics don't yet have 5 pages on
  the same topic. When there are fewer, should the new page wait, or link from as many as exist?
- **FAQPage:** posts have a "Câu hỏi thường gặp" section, but no FAQPage markup is generated yet.
- **Wrong price in the app's structured data:** `src/lib/structured-data.ts:50` tells search
  engines the app costs `price: '0'` (free). That contradicts "no free tier" and "never state a
  price" in `site-context.md`. It is on the home page, which gets clicks, so rule 9 applies to
  any fix.
