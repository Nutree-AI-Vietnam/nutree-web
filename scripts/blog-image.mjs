// Turns blog illustrations into the JPEGs a post publishes, under public/blog/<slug>/.
// See "Images" in content/blog/README.md.
//
//   npm run blog:image -- --input content/blog/images/<slug>/<name>.json --out /blog/<slug>/<name>.jpg --ai
//
// The input is a scene (.json) that places separately drawn objects on the studio background, or
// one finished picture (.svg, .png, .jpg or .webp). --aspect sets the shape: 16:9 by default, which
// covers must use.

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import sharp from 'sharp';

const ASPECTS = ['16:9', '3:2', '4:3'];
const PICTURE_TYPES = ['.svg', '.png', '.jpg', '.jpeg', '.webp'];
const MIN_WIDTH = 1200;
const MAX_WIDTH = 2400;
// Keep in sync with MAX_IMAGE_BYTES in src/lib/blog.ts.
const MAX_BYTES = 400 * 1024;
const OUT_PATTERN = /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*\.jpg$/;
// JPEG has no transparency, so transparent areas get the site background.
const BACKGROUND = '#FAFCFB';
// Pictures are drawn at twice the output size, so edges and gradients stay smooth after the downscale.
const SUPERSAMPLE = 2;
// Pixels this transparent or more count as empty when measuring an object.
const EMPTY_ALPHA = 16;
// How far from pure white (per channel, 0-255) the background of a PNG or JPEG object may be.
const WHITE_TOLERANCE = 40;
const SHADOW_COLOR = '#1A4739';

// IPTC "digital source type" that Google asks sites to attach to AI-generated images.
const AI_XMP = `<?xml version="1.0"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about="" xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/"
      Iptc4xmpExt:DigitalSourceType="http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"/>
  </rdf:RDF>
</x:xmpmeta>`;

const USAGE = `Usage:
  npm run blog:image -- --input <file> --out /blog/<slug>/<name>.jpg [--aspect 16:9] [--ai]

  --input   A scene (.json) that places objects on the studio background, or one finished picture:
            an .svg drawn at the --aspect shape, or a .png, .jpg or .webp image
  --out     Where to save it, under public/: lowercase words and hyphens, ending in .jpg
  --aspect  ${ASPECTS.join(', ')} (default 16:9, which covers must use)
  --width   Output width in pixels (default and minimum ${MIN_WIDTH}, maximum ${MAX_WIDTH})
  --ai      Mark the file as AI-generated; pass it for every image Claude drew

A scene lists its objects back to front; paths are relative to the scene file:
  { "objects": [ { "src": "objects/bowl.svg", "x": 0.5, "bottom": 0.86, "height": 0.6 } ] }

  src       The object alone: an .svg with nothing drawn behind it, or a .png, .jpg or .webp
            whose white background is removed here
  x         Centre of the object, as a fraction of the image width
  bottom    Where the object stands, as a fraction of the image height
  height    Height of the object, as a fraction of the image height (or "width", of the width)
  shadow    false to leave out the soft shadow under it (default true)
  "background" (optional) replaces the studio background with an .svg drawn at the --aspect shape.`;

class UsageError extends Error {}

async function main() {
  const { values } = parseArgs({
    options: {
      input: { type: 'string' },
      out: { type: 'string' },
      aspect: { type: 'string', default: '16:9' },
      width: { type: 'string', default: String(MIN_WIDTH) },
      ai: { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });

  if (values.help) {
    console.log(USAGE);
    return;
  }
  const inputType = path.extname(values.input ?? '').toLowerCase();
  if (!values.input || ![...PICTURE_TYPES, '.json'].includes(inputType)) {
    throw new UsageError(`--input must be a .json scene or one of these file types: ${PICTURE_TYPES.join(', ')}`);
  }
  if (!fs.existsSync(values.input)) {
    throw new UsageError(`--input ${values.input} does not exist`);
  }
  if (!values.out || !OUT_PATTERN.test(values.out)) {
    throw new UsageError('--out must look like /blog/<slug>/<descriptive-name>.jpg (lowercase a-z, 0-9 and hyphens)');
  }
  if (!ASPECTS.includes(values.aspect)) {
    throw new UsageError(`--aspect must be one of ${ASPECTS.join(', ')}`);
  }
  const width = Number(values.width);
  if (!Number.isInteger(width) || width < MIN_WIDTH || width > MAX_WIDTH) {
    throw new UsageError(`--width must be a whole number from ${MIN_WIDTH} to ${MAX_WIDTH}`);
  }

  const [ratioWidth, ratioHeight] = values.aspect.split(':').map(Number);
  const size = { width, height: Math.round((width * ratioHeight) / ratioWidth), aspect: values.aspect };
  const isDrawing = inputType === '.json' || inputType === '.svg';
  let source;
  if (inputType === '.json') source = await composeScene(values.input, size);
  else if (inputType === '.svg') source = await renderSvg(fs.readFileSync(values.input), size);
  else source = fs.readFileSync(values.input);
  const output = await compress(source, { ...size, isDrawing, isAiGenerated: values.ai });

  const file = path.join(process.cwd(), 'public', values.out);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, output);

  console.log(`Saved public${values.out} (${size.width}×${size.height}, ${Math.round(output.length / 1024)} KB)`);
  console.log(`  cover:  image: ${values.out}`);
  console.log(`  body:   ![alt text](${values.out} "caption")`);
}

/** Renders an SVG drawn at the output shape, at SUPERSAMPLE times the output size. */
async function renderSvg(svg, { width, height, aspect }) {
  const { width: svgWidth, height: svgHeight } = await sharp(svg).metadata();
  // A drawing is composed for its frame, so it is never cropped to fit another shape.
  if (Math.abs(svgWidth / svgHeight - width / height) > 0.01) {
    throw new UsageError(`the SVG is ${svgWidth}×${svgHeight}, which is not ${aspect}; draw it at ${width}×${height}`);
  }
  return sharp(svg, { density: (72 * SUPERSAMPLE * width) / svgWidth }).png().toBuffer();
}

/** Places each object of a scene on the background, back to front, each above its own soft shadow. */
async function composeScene(file, size) {
  const scene = readScene(file);
  const canvas = { width: size.width * SUPERSAMPLE, height: size.height * SUPERSAMPLE };
  const background = scene.background
    ? await renderSvg(fs.readFileSync(scene.background), size)
    : await renderSvg(Buffer.from(studioBackground(size)), size);

  const layers = [];
  for (const object of scene.objects) {
    const { image, box } = await cutOut(object, canvas);
    const left = Math.round(object.x * canvas.width - (box.left + box.right) / 2);
    const top = Math.round(object.bottom * canvas.height - box.bottom);
    if (object.shadow) layers.push(await shadowLayer(box, left, top));
    layers.push({ input: image, left, top });
  }
  const visible = await Promise.all(layers.map((layer) => fitToCanvas(layer, canvas)));
  return sharp(background).composite(visible.filter(Boolean)).png().toBuffer();
}

function readScene(file) {
  let scene;
  try {
    scene = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new UsageError(`${file} is not valid JSON: ${error.message}`);
  }
  const relativeFile = (value, where, types) => {
    if (typeof value !== 'string' || !types.includes(path.extname(value).toLowerCase())) {
      throw new UsageError(`${where} must be a path to one of these file types: ${types.join(', ')}`);
    }
    const resolved = path.resolve(path.dirname(file), value);
    if (!fs.existsSync(resolved)) throw new UsageError(`${where}: ${value} does not exist`);
    return resolved;
  };
  const fraction = (value, where) => {
    if (typeof value !== 'number' || !(value >= 0 && value <= 1)) {
      throw new UsageError(`${where} must be a number from 0 to 1`);
    }
    return value;
  };

  checkKeys(scene, ['background', 'objects'], file);
  if (!Array.isArray(scene.objects) || scene.objects.length === 0) {
    throw new UsageError(`${file} needs an "objects" list`);
  }
  const objects = scene.objects.map((object, index) => {
    const where = `${file} objects[${index}]`;
    checkKeys(object, ['src', 'x', 'bottom', 'height', 'width', 'shadow'], where);
    if ((object.height === undefined) === (object.width === undefined)) {
      throw new UsageError(`${where} needs either "height" or "width", not both`);
    }
    const sizeKey = object.height === undefined ? 'width' : 'height';
    if (!(fraction(object[sizeKey], `${where}.${sizeKey}`) > 0)) {
      throw new UsageError(`${where}.${sizeKey} must be more than 0`);
    }
    if (object.shadow !== undefined && typeof object.shadow !== 'boolean') {
      throw new UsageError(`${where}.shadow must be true or false`);
    }
    return {
      src: relativeFile(object.src, `${where}.src`, PICTURE_TYPES),
      x: fraction(object.x, `${where}.x`),
      bottom: fraction(object.bottom, `${where}.bottom`),
      height: object.height,
      width: object.width,
      shadow: object.shadow ?? true,
    };
  });
  const background = scene.background === undefined
    ? undefined
    : relativeFile(scene.background, `${file} background`, ['.svg']);
  return { background, objects };
}

function checkKeys(value, allowed, where) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new UsageError(`${where} must be a JSON object`);
  }
  const unknown = Object.keys(value).filter((key) => !allowed.includes(key));
  if (unknown.length > 0) {
    throw new UsageError(`${where} has unknown keys (${unknown.join(', ')}); allowed: ${allowed.join(', ')}`);
  }
}

/**
 * Loads one object at the size the scene asks for, with nothing around it. An SVG object must not
 * draw a background; a PNG, JPEG or WebP object has its white background removed.
 */
async function cutOut(object, canvas) {
  const name = path.basename(object.src);
  const input = fs.readFileSync(object.src);
  const isSvg = path.extname(object.src).toLowerCase() === '.svg';

  // Measure the object at its natural size first.
  let image = isSvg ? await sharp(input).png().toBuffer() : await removeWhiteBackground(input);
  let box = await visibleBox(image);
  if (!box) throw new UsageError(`${name} is empty`);
  if (box.hasBackground) {
    throw new UsageError(
      isSvg
        ? `${name} has a background; delete it so only the object is drawn`
        : `${name} has a background that is not white; cut the object out or put it on white`,
    );
  }

  const scale = object.height
    ? (object.height * canvas.height) / (box.bottom - box.top)
    : (object.width * canvas.width) / (box.right - box.left);
  if (isSvg) {
    image = await sharp(input, { density: 72 * scale }).png().toBuffer();
  } else {
    const { width } = await sharp(image).metadata();
    image = await sharp(image).resize(Math.max(1, Math.round(width * scale))).png().toBuffer();
  }
  box = await visibleBox(image);
  return { image, box };
}

/**
 * Finds the box that the visible pixels of an image fill, and how wide the object is where it
 * stands. hasBackground is true when all four corners are solid.
 */
async function visibleBox(png) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const alpha = (x, y) => data[(y * width + x) * 4 + 3];
  let left = width;
  let right = -1;
  let top = height;
  let bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alpha(x, y) <= EMPTY_ALPHA) continue;
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      bottom = y;
    }
  }
  if (right < 0) return undefined;

  // The footprint: how wide the object is across its lowest rows.
  let footLeft = right;
  let footRight = left;
  const footTop = Math.max(top, Math.round(bottom - (bottom - top) * 0.06));
  for (let y = footTop; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      if (alpha(x, y) <= EMPTY_ALPHA) continue;
      if (x < footLeft) footLeft = x;
      if (x > footRight) footRight = x;
    }
  }
  const corners = [alpha(0, 0), alpha(width - 1, 0), alpha(0, height - 1), alpha(width - 1, height - 1)];
  return {
    left,
    right: right + 1,
    top,
    bottom: bottom + 1,
    footLeft,
    footRight: footRight + 1,
    hasBackground: corners.every((value) => value > 250),
  };
}

/**
 * Makes the white background around a PNG or JPEG object transparent. The fill starts at the edges,
 * so white inside the object stays, and soft gray shadows become see-through rather than gray.
 */
async function removeWhiteBackground(input) {
  const { data, info } = await sharp(input).rotate().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const pixels = width * height;
  const isWhite = (p) =>
    data[p * 4 + 3] === 0 || Math.min(data[p * 4], data[p * 4 + 1], data[p * 4 + 2]) >= 255 - WHITE_TOLERANCE;

  const background = new Uint8Array(pixels);
  const queue = new Int32Array(pixels);
  let queued = 0;
  const visit = (p) => {
    if (background[p] || !isWhite(p)) return;
    background[p] = 1;
    queue[queued++] = p;
  };
  for (let x = 0; x < width; x++) {
    visit(x);
    visit((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    visit(y * width);
    visit(y * width + width - 1);
  }
  for (let next = 0; next < queued; next++) {
    const p = queue[next];
    const x = p % width;
    if (x > 0) visit(p - 1);
    if (x < width - 1) visit(p + 1);
    if (p >= width) visit(p - width);
    if (p < pixels - width) visit(p + width);
  }

  // "Colour to alpha" against white: the most transparent colour that looks the same over white.
  for (let p = 0; p < pixels; p++) {
    if (!background[p]) continue;
    const i = p * 4;
    const alpha = (255 - Math.min(data[i], data[i + 1], data[i + 2])) / 255;
    for (let c = 0; c < 3; c++) data[i + c] = alpha ? Math.round(255 - (255 - data[i + c]) / alpha) : 0;
    data[i + 3] = Math.round(data[i + 3] * alpha);
  }
  return sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

/** A soft shadow on the floor under an object: a wide, faint one and a darker one where it stands. */
async function shadowLayer(box, left, top) {
  const objectWidth = box.right - box.left;
  const footWidth = Math.max(box.footRight - box.footLeft, objectWidth * 0.3);
  const wide = { rx: objectWidth * 0.5, ry: objectWidth * 0.07, blur: objectWidth * 0.05 };
  const contact = { rx: footWidth * 0.5, ry: Math.max(footWidth * 0.05, 3), blur: objectWidth * 0.015 };
  const width = Math.ceil(2 * (wide.rx + 3 * wide.blur));
  const height = Math.ceil(2 * (wide.ry + 3 * wide.blur));
  const cx = width / 2;
  const cy = height / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <filter id="wide" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${wide.blur}"/></filter>
  <filter id="contact" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${contact.blur}"/></filter>
  <ellipse cx="${cx}" cy="${cy}" rx="${wide.rx}" ry="${wide.ry}" fill="${SHADOW_COLOR}" fill-opacity="0.16" filter="url(#wide)"/>
  <ellipse cx="${cx}" cy="${cy - contact.ry * 0.4}" rx="${contact.rx}" ry="${contact.ry}" fill="${SHADOW_COLOR}" fill-opacity="0.26" filter="url(#contact)"/>
</svg>`;
  const footCentre = left + (box.footLeft + box.footRight) / 2;
  return {
    input: await sharp(Buffer.from(svg)).png().toBuffer(),
    left: Math.round(footCentre - cx),
    top: Math.round(top + box.bottom - cy),
  };
}

/** Crops a layer to the part that falls on the canvas, since sharp only composites layers that fit. */
async function fitToCanvas(layer, canvas) {
  const { width, height } = await sharp(layer.input).metadata();
  const left = Math.max(0, layer.left);
  const top = Math.max(0, layer.top);
  const right = Math.min(canvas.width, layer.left + width);
  const bottom = Math.min(canvas.height, layer.top + height);
  if (right <= left || bottom <= top) return undefined;
  if (left === layer.left && top === layer.top && right - left === width && bottom - top === height) return layer;
  const input = await sharp(layer.input)
    .extract({ left: left - layer.left, top: top - layer.top, width: right - left, height: bottom - top })
    .png()
    .toBuffer();
  return { input, left, top };
}

/** The studio backdrop scenes stand on: pale mint with soft brand-coloured light. */
function studioBackground({ width, height }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F3FAF7"/>
      <stop offset="0.62" stop-color="#E8F5EF"/>
      <stop offset="1" stop-color="#D9EEE6"/>
    </linearGradient>
    <radialGradient id="spot" cx="0.5" cy="0.42" r="0.55">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" filterUnits="userSpaceOnUse" x="${-width / 2}" y="${-height / 2}" width="${width * 2}" height="${height * 2}">
      <feGaussianBlur stdDeviation="${width * 0.06}"/>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#wall)"/>
  <g filter="url(#glow)">
    <circle cx="${width * 0.08}" cy="${height * 0.1}" r="${width * 0.17}" fill="#29B6A1" fill-opacity="0.22"/>
    <circle cx="${width * 0.93}" cy="${height * 0.14}" r="${width * 0.15}" fill="#FFC56E" fill-opacity="0.24"/>
    <circle cx="${width * 0.9}" cy="${height * 0.98}" r="${width * 0.17}" fill="#FF9B85" fill-opacity="0.14"/>
    <circle cx="${width * 0.1}" cy="${height * 0.98}" r="${width * 0.18}" fill="#7FD6C0" fill-opacity="0.26"/>
  </g>
  <rect width="${width}" height="${height}" fill="url(#spot)"/>
</svg>`;
}

/** Crops to the exact size, then lowers the quality until the file fits under MAX_BYTES. */
async function compress(source, { width, height, isDrawing, isAiGenerated }) {
  for (const quality of [84, 76, 68, 60]) {
    let image = sharp(source)
      .rotate()
      // Photos are cropped around their busiest part; drawings already have the right shape.
      .resize(width, height, { fit: 'cover', position: isDrawing ? 'centre' : sharp.strategy.attention })
      .flatten({ background: BACKGROUND });
    if (isAiGenerated) image = image.withXmp(AI_XMP);
    const output = await image.jpeg({ quality, mozjpeg: true }).toBuffer();
    if (output.length <= MAX_BYTES) return output;
  }
  throw new Error(`the image stays above ${MAX_BYTES / 1024} KB even at low quality; use a simpler picture`);
}

main().catch((error) => {
  console.error(`blog:image failed: ${error.message}`);
  if (error instanceof UsageError) console.error(`\n${USAGE}`);
  process.exitCode = 1;
});
