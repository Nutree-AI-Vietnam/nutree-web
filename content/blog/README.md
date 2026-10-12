# Nutree blog posts

Each `.mdx` file in this folder is one article, published at `https://nutreeai.com/blog/<file-name>`.
There is nothing else to register: the post list, category pages, related posts, `sitemap.xml` and the
RSS feed (`/blog/feed.xml`) all pick up new files on the next build.

`macro-la-gi.mdx` is a complete example that follows every rule below.

## Adding a post

In a fresh checkout, run `npm ci` first: the build and the image scripts need it.

1. Check what already exists: `grep -h '^title:' content/blog/*.mdx`. If a post already targets the
   same search question, improve that post and set `updated` to today instead of writing a second one.
2. Create `content/blog/<slug>.mdx` from the template below.
3. Make its pictures: a cover and 1–2 images in the body (see [Images](#images)).
4. Run `npm run build`. The build checks every post and fails with a plain-language list of problems,
   naming the file. Fix them and build again.
5. Commit the `.mdx` file, `public/blog/<slug>/`, `content/blog/images/<slug>/` and any new object
   recipe with its `.svg`. Nothing else needs to change.

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
image: /blog/pho-bo-bao-nhieu-calo/pho-bo-tai-chin.jpg
imageAlt: "Tô phở bò tái chín trong bát thuỷ tinh, bên cạnh đĩa rau thơm, giá đỗ và chanh"
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
| `image` | yes | The 16:9 cover, saved as `public/blog/<slug>/<name>.jpg` and written as `/blog/<slug>/<name>.jpg`. See [Images](#images). |
| `imageAlt` | yes | What the cover shows, in Vietnamese, under 150 characters. Wrap it in double quotes. |
| `draft` | no | `true` keeps the post off the live site; it still shows in `npm run dev`. A draft may skip the cover. |

- Wrap `title`, `description` and `imageAlt` in double quotes. For quotation marks inside them, use “ ” instead of `"`.
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
  `---` dividers and captioned images (see [Images](#images)).
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

## Images

Every published post has a cover and usually 1–2 pictures in the body; the build fails without a cover.
The cover heads the post and shows on post cards, share cards, Google Discover and image search. Body
pictures break up long sections and show the food the text is about.

Draw every picture with the scripts below. Don't download pictures from other websites or stock sites,
and don't use image-generation services. A photo or render that Nutree owns can still be used as an
object in a scene (see [Composing a picture](#composing-a-picture)).

### The look

Food in glossy, see-through mint-green glass bowls, plates and glasses, on a soft white studio
background with gentle shadows, seen slightly from above and lit from the top left. No people, hands,
text or logos. Each picture shows the dishes or foods its section talks about, recognisably.

### Ready-made objects

Objects are single vessels of food, drawn once and reused. They are in `content/blog/images/_objects/`:

| Object | Shows |
| --- | --- |
| `bowl-avocado-nuts` | Almonds and macadamias with two avocado halves |
| `bowl-chicken-egg` | Salad greens with grilled chicken, boiled egg halves and cherry tomatoes |
| `bowl-eggs` | Whole eggs |
| `bowl-nuoc-mam` | Nước mắm with sliced chilli and garlic |
| `bowl-rice` | White rice |
| `bowl-tofu-edamame` | Edamame with fried tofu, sesame and spring onion |
| `glass-milk` | A glass of milk |
| `plate-com-tam` | Cơm tấm: broken rice, mỡ hành, grilled pork chop, fried egg, cucumber, tomato and đồ chua |
| `plate-salmon` | Baked salmon on salad leaves with lemon and cherry tomatoes |

Reuse these whenever they fit. Add a row here for every new object.

### Drawing a new object

1. Copy the closest recipe in `scripts/blog-art/objects/` to `<vessel>-<food>.mjs`, e.g. `bowl-pho.mjs`.
   A recipe exports `vessel` (`BOWL`, `PLATE` or `CUP` from `../kit.mjs`), a one-line English
   `description` and `draw()`, which returns the SVG of the food inside the glass.
2. Build the food from the helpers in `scripts/blog-art/food.mjs`: rice and other heaps, leaves, chicken,
   salmon, pork chop, eggs, tofu, tomato, cucumber, lemon, avocado, nuts, edamame, pickles, sesame and
   spring onion. `kit.mjs` places things in 3D (`frame`, `heap`, `inOrder`) and shades them. When a food
   is missing, add a helper to `food.mjs` rather than drawing it inline.
3. Run `npm run blog:objects -- <name>`. It saves `content/blog/images/_objects/<name>.svg` and prints the
   path of a preview PNG. Open the preview and check that the food is recognisable and sits inside the
   glass; redraw until it does.

Objects have no background: the glass template draws only the vessel and its contents, and
`blog:image` adds the background and shadows when it composes the picture.

### Composing a picture

A scene places 1–4 objects on the background. Save it as `content/blog/images/<slug>/<name>.json`,
named like the picture it makes:

```json
{
  "objects": [
    { "src": "../_objects/glass-milk.svg", "x": 0.5, "bottom": 0.56, "height": 0.4 },
    { "src": "../_objects/bowl-eggs.svg", "x": 0.22, "bottom": 0.7, "height": 0.36 },
    { "src": "../_objects/bowl-tofu-edamame.svg", "x": 0.78, "bottom": 0.7, "height": 0.36 },
    { "src": "../_objects/plate-salmon.svg", "x": 0.5, "bottom": 0.95, "width": 0.46 }
  ]
}
```

- `x` is the object's centre and `bottom` the line it stands on, as fractions of the picture's width and
  height measured from the left and top edges. Size it with `height` (fraction of the picture's height)
  or `width` (fraction of its width).
- List objects back to front. Objects further back stand higher (smaller `bottom`): tall glasses and
  bowls go behind, low plates in front, so nothing looks stacked on something else.
- `src` can also be a `.png`, `.jpg` or `.webp` photo on a white background; the white is removed.

Render it, then open the JPEG and check it before using it:

```bash
npm run blog:image -- --input content/blog/images/<slug>/<name>.json --out /blog/<slug>/<name>.jpg --width 1600 --ai
```

- The cover must be 16:9, the default. Body pictures may also use `--aspect 3:2` or `--aspect 4:3`.
- `--ai` labels the file as AI-made in its IPTC metadata, which Google reads. Always pass it.
- The tool prints the frontmatter or Markdown to paste into the post.

### File names, alt text and captions

- Name files after what they show, in Vietnamese without accents: `com-tam-du-ba-nhom-macro.jpg`, not
  `cover.jpg` or `image-1.jpg`. Google reads the file name.
- Alt text describes the picture for people who can't see it and for image search: name the foods, in
  Vietnamese, under 150 characters. Don't start with "Hình ảnh" or "Ảnh". Write "quả bơ" for avocado,
  since "bơ" alone means butter.
- Put each body picture on its own line, with a blank line above and below, right after the paragraph it
  illustrates and outside lists, tables and callouts. The text in quotes is the caption, a sentence
  shown under the picture:

```mdx
![Đĩa cơm tấm với sườn nướng, trứng ốp la và mỡ hành](/blog/<slug>/com-tam-du-ba-nhom-macro.jpg "Một đĩa cơm tấm có đủ ba nhóm macro.")
```

- Captions follow the health content rules like any other sentence: no numbers without a source.

The build checks that every picture is in `public/blog/<slug>/` with a lowercase hyphenated name, is a
JPEG, PNG or WebP at least 1200 px wide and under 400 KB, and has alt text; that the cover is 16:9; and
that each body picture has a caption and appears once.

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
- Show the dish or food the post is about in the cover, and use the main search phrase, without accents,
  in the cover's file name and naturally in its alt text. Pictures bring visits from Google Images and
  Discover.

## Preview and publish

- `npm run dev`, then open `http://localhost:3000/blog/<slug>`. Drafts show there with a "Bản nháp" badge.
- `npm run build` validates and compiles every post.
- A post goes live with the next deploy of `main`. The sitemap, RSS feed, category pages and related posts
  update on their own.
