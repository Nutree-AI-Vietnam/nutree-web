# Nutree blog posts

Each `.mdx` file in this folder is one article, published at `https://nutreeai.com/blog/<file-name>`.
There is nothing else to register: the post list, category pages, related posts, `sitemap.xml` and the
RSS feed (`/blog/feed.xml`) all pick up new files on the next build.

`macro-la-gi.mdx` is a complete example that follows every rule below.

## Adding a post

1. Check what already exists: `grep -h '^title:' content/blog/*.mdx`. If a post already targets the
   same search question, improve that post and set `updated` to today instead of writing a second one.
2. Create `content/blog/<slug>.mdx` from the template below.
3. Run `npm run build` (run `npm ci` first in a fresh checkout). The build checks every post and fails
   with a plain-language list of problems, naming the file. Fix them and build again.
4. Commit the `.mdx` file plus any images under `public/blog/<slug>/`. Nothing else needs to change.

## File name = URL

- Lowercase `a-z`, `0-9` and single hyphens, no Vietnamese accents, at most 90 characters:
  `pho-bo-bao-nhieu-calo.mdx` → `/blog/pho-bo-bao-nhieu-calo`.
- Use the post's main search phrase without accents.
- `trang`, `chu-de` and `feed` are reserved by blog routes.
- Never rename a published post: the URL changes, old links break and search rankings reset.

## Frontmatter

Every post starts with this block:

```mdx
---
title: "Phở bò bao nhiêu calo? Cách ăn phở khi đang giảm cân"
description: "Calo và macro của các loại phở bò, phần nào nhiều calo nhất và cách gọi phở phù hợp khi đang giảm cân."
date: 2026-10-13
category: calo-mon-viet
tags: ["phở bò", "calo", "giảm cân"]
---
```

| Field | Required | Rules |
| --- | --- | --- |
| `title` | yes | Up to 120 characters; aim for 50–65 so Google shows it whole. It is the page's H1, and search results show it as "title \| Nutree". |
| `description` | yes | Up to 300 characters; aim for 120–160. Used as the search snippet and shown under the title. |
| `date` | yes | Publish date as `YYYY-MM-DD`: today (Vietnam time) or earlier. A future date fails the build. |
| `updated` | no | Date of the last meaningful revision, `YYYY-MM-DD`, not earlier than `date`. Small fixes such as an added link don't need it. |
| `category` | yes | One slug from the table below. |
| `tags` | no | 3–6 short Vietnamese phrases, e.g. `["phở", "calo"]`. |
| `image` | no | Cover image path under `public/`, starting with `/`, e.g. `/blog/<slug>/cover.webp`. The file must exist. |
| `imageAlt` | with `image` | What the cover shows, in Vietnamese. |
| `draft` | no | `true` keeps the post off the live site; it still shows in `npm run dev`. |

- Wrap `title` and `description` in double quotes. For quotation marks inside them, use “ ” instead of `"`.
- No other fields are accepted. The byline is always "Đội ngũ Nutree", so there is no author field.

### Categories

| `category` | Shown as | Use for |
| --- | --- | --- |
| `calo-mon-viet` | Calo món Việt | Calories and nutrition of specific Vietnamese dishes and drinks |
| `giam-can-tang-co` | Giảm cân & tăng cơ | Calorie deficit, fat loss, muscle gain, keeping weight off |
| `dinh-duong` | Dinh dưỡng & đếm calo | Basics: calories, macros, TDEE, how to track meals |
| `thuc-don` | Thực đơn & ăn lành mạnh | Meal plans, breakfast ideas, meal prep, healthy swaps |
| `ung-dung-ai` | App & công nghệ AI | Calorie-counting apps, AI food recognition, tracking tools |

Pick the closest category. Adding a category is a code change in `src/lib/blog-categories.ts`, not part of
writing a post.

## Writing the body

- Don't repeat the title as `# Heading`: the page already shows it. Sections start at `##`, subsections at `###`.
- Open with 2–3 sentences that directly answer the search question; Google often quotes this paragraph.
- Three or more `##` sections get an automatic table of contents.
- Available Markdown: paragraphs, **bold**, *italic*, lists, links, `>` quotes, tables, footnotes (`[^1]`),
  `---` dividers and images.
- Write in Vietnamese with full diacritics. Use Vietnamese number format (`2.000 kcal`, `0,8 g/kg`) and an
  en dash for ranges (`45–65%`).

### MDX syntax the build rejects

MDX treats some characters as code. The build reports these, but avoiding them saves a round trip:

| Don't write | Write instead |
| --- | --- |
| `< 10%`, `<5 g` | `dưới 10%`, `nhỏ hơn 5 g` (or escape it as `\<`) |
| `{` or `}` | Leave them out, or escape them as `\{` and `\}` |
| `<!-- comment -->` | Delete it |
| HTML such as `<br>`, `<div>`, `<b>` | Plain Markdown |
| `<https://example.com>` | `[link text](https://example.com)` |
| `# Heading` | `## Heading` |
| Any other component | Only `<Callout>` and `<AppCta />` exist |

These rules don't apply inside `inline code` or fenced code blocks. For readability, prefer "trên" and
"dưới" over `>` and `<` in prose anyway.

## Components

### Callout: a highlighted box

```mdx
<Callout type="tip" title="Gọi phở khi đang giảm cân">
Xin thêm rau và giá, chọn thịt nạc và bớt nước béo.
</Callout>
```

- `type`: `tip` (labelled "Mẹo", the default), `note` ("Lưu ý") or `warning` ("Cảnh báo", for safety points
  such as "hỏi bác sĩ trước khi...").
- `title` is optional and replaces the label.
- Put the opening and closing tags on their own lines, with Markdown between them.
- Attribute values are plain text in double quotes, never `{...}`.

### AppCta: the Nutree app box

```mdx
<AppCta />
```

- At most once per post, on its own line with a blank line above and below.
- Place it mid-article, after the section about tracking or eating where the app is relevant. Every post
  page already ends with a call-to-action section, so don't put it at the very end.

## Links

- Link to related posts as `[macro là gì](/blog/macro-la-gi)`. The build fails if no published post has
  that slug, so only link to posts that exist. 2–4 internal links per post help readers and SEO.
- Category pages (`/blog/chu-de/<category>`) only exist once that category has a published post.
- External links open in a new tab automatically. Link primary sources: WHO, FAO, Viện Dinh dưỡng Quốc
  gia, Bộ Y tế, national dietary guidelines and peer-reviewed studies (link the DOI or PubMed page).
  Don't link to other calorie-counting apps.

## Images (optional)

- Save files in `public/blog/<slug>/` and reference them from `/blog/<slug>/...`.
- Cover image: set `image` and `imageAlt`. Use a 16:9 `.webp` or `.jpg`, at least 1200×675 px, ideally
  under 200 KB. It appears at the top of the post and on social share cards; without one, the site's
  default share image is used.
- In the body: `![Một tô phở bò với rau thơm](/blog/<slug>/pho-bo.webp)`. Alt text is required.
- Only use images Nutree may publish (its own photos, generated or licensed images). Never link images
  from other websites.

## Health content rules

People act on these articles, and Google holds health content to its strictest quality bar. Every post must:

- **Cite every number.** Calories, grams, percentages and risks each need an inline link to their source,
  and the post ends with a `## Nguồn tham khảo` list. For a dish's calories, name the database (for
  example Bảng thành phần thực phẩm Việt Nam or USDA FoodData Central), give the serving size, and say
  that values vary by recipe and portion.
- **Invent nothing.** No made-up statistics, studies, quotes, experts, doctors, reviewers, testimonials,
  user counts or rankings. Don't say a doctor or dietitian wrote or reviewed the post.
- **Make no medical promises.** No "chữa khỏi", "đảm bảo", or "giảm X kg trong Y ngày". For illness,
  pregnancy, eating disorders or medication, tell readers to ask a doctor.
- **Avoid extreme advice.** Don't recommend very-low-calorie diets, skipping meals, diet pills or
  supplements, or fasting for people at risk.
- **Describe Nutree accurately.** It estimates calories and macros from a food photo, a barcode scan or a
  typed dish name, adjusts targets automatically as you progress, and suggests meals. Don't claim it is
  free, 100% accurate or a medical tool. Don't cite user numbers, ratings or store rankings. Don't call
  the plan quiz free or say how long it takes.

A disclaimer telling readers to consult a professional is added to every post automatically; don't add
your own.

## SEO checklist

- One main search phrase per post: what people actually type into Google, e.g. "phở bò bao nhiêu calo".
- Put that phrase near the start of the title, in the description, in the first paragraph and in at least
  one `##` heading. Use it, without accents, as the file name.
- Use question-style headings, the way people search. A closing `## Câu hỏi thường gặp` section with
  `###` questions works well.
- Put numbers in tables (calories per dish, comparisons).
- Write as long as the topic needs, usually 1.000–2.000 words. Don't stuff keywords.

## Preview and publish

- `npm run dev`, then open `http://localhost:3000/blog/<slug>`. Drafts show there with a "Bản nháp" badge.
- `npm run build` validates and compiles every post.
- A post goes live with the next deploy of `main`. The sitemap, RSS feed, category pages and related posts
  update on their own.
