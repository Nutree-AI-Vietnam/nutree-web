// Draws food objects for blog images into the glass vessel templates.
//
//   npm run blog:objects -- [name ...]
//
// Each recipe is scripts/blog-art/objects/<name>.mjs and becomes content/blog/images/_objects/<name>.svg.
// With no names, every recipe is drawn. A preview of each object on white is saved to check the
// drawing before composing a scene with scripts/blog-image.mjs. See "Images" in content/blog/README.md.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { OBJECTS, ROOT, begin, inTemplate } from './kit.mjs';

const RECIPES = path.join(path.dirname(fileURLToPath(import.meta.url)), 'objects');
const PREVIEWS = path.join(os.tmpdir(), 'blog-objects');

const recipes = fs
  .readdirSync(RECIPES)
  .filter((file) => file.endsWith('.mjs'))
  .map((file) => file.slice(0, -'.mjs'.length))
  .sort();
const names = process.argv.slice(2);

if (names.includes('-h') || names.includes('--help')) {
  console.log(`Usage: npm run blog:objects -- [name ...]\n\nRecipes: ${recipes.join(', ')}`);
  process.exit(0);
}
const unknown = names.filter((name) => !recipes.includes(name));
if (unknown.length) {
  console.error(`No recipe called ${unknown.join(', ')}: add scripts/blog-art/objects/<name>.mjs. Recipes: ${recipes.join(', ')}`);
  process.exit(1);
}

fs.mkdirSync(OBJECTS, { recursive: true });
fs.mkdirSync(PREVIEWS, { recursive: true });
for (const name of names.length ? names : recipes) {
  const { vessel, description, draw } = await import(pathToFileURL(path.join(RECIPES, `${name}.mjs`)).href);
  begin();
  const svg = inTemplate(vessel, description, draw());
  const file = path.join(OBJECTS, `${name}.svg`);
  fs.writeFileSync(file, svg);
  const preview = path.join(PREVIEWS, `${name}.png`);
  await sharp(Buffer.from(svg), { density: 72 }).flatten({ background: '#FFFFFF' }).png().toFile(preview);
  console.log(`${path.relative(ROOT, file)} (${Math.round(svg.length / 1024)} KB), preview ${preview}`);
}
