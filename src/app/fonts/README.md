# Be Vietnam Pro (self-hosted)

Loaded in `src/app/layout.tsx` with `next/font/local`, exposed as `--font-be-vietnam`.

Each file holds one weight with Google Fonts' `latin` and `vietnamese` ranges merged. Google's
own split also declares `latin-ext`, whose range overlaps Vietnamese letters (ă, đ, ơ, ư), so
browsers fetched three files per weight; one file per weight replaces those 15 files (127 KB)
with 5 (77 KB). Characters outside these ranges (arrows, emoji, box drawing) fall back to the
system font, as they did before.

Font licensed under the SIL Open Font License 1.1 (`OFL.txt`).

## Regenerate

Sources: `ofl/bevietnampro/BeVietnamPro-{Regular,Medium,SemiBold,Bold,ExtraBold}.ttf` from
https://github.com/google/fonts. Needs `pip install fonttools brotli`.

```bash
U="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD,U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+1EA0-1EF9,U+20AB"
for w in Regular Medium SemiBold Bold ExtraBold; do
  pyftsubset "BeVietnamPro-$w.ttf" --unicodes="$U" --flavor=woff2 --no-hinting --desubroutinize \
    --output-file="BeVietnamPro-$w.woff2"
done
```
