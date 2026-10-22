import { PLATE, blob, frameOf, inOrder, n, norm, random } from '../kit.mjs';

export const vessel = PLATE;
export const description = 'A glass plate of goi cuon: fresh rice paper rolls with shrimp, pork, noodles and herbs showing through the wrapper';

/** A pink shrimp half pressed against the wrapper: a curled crescent with orange stripes. */
function shrimp([x, y], { size = 1, angle = 0 } = {}) {
  const r = 20 * size;
  const stripes = [0.25, 0.5, 0.75]
    .map((t) => {
      const a = Math.PI * (1.1 + t * 0.8);
      const [cx, cy] = [Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78];
      return `<line x1="${n(cx * 0.72)}" y1="${n(cy * 0.72)}" x2="${n(cx * 1.2)}" y2="${n(cy * 1.2)}" stroke="#D9542E" stroke-opacity="0.75" stroke-width="${n(2.4 * size)}" stroke-linecap="round"/>`;
    })
    .join('');
  return (
    `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(angle)})" opacity="0.9">` +
    `<path d="M${n(-r)},0 A${n(r)},${n(r)} 0 0 1 ${n(r)},0 L${n(r * 0.45)},0 A${n(r * 0.45)},${n(r * 0.45)} 0 0 0 ${n(-r * 0.45)},0 Z" fill="#F3916A"/>` +
    `${stripes}</g>`
  );
}

/** A herb or lettuce leaf showing through the wrapper. */
function leaf([x, y], { size = 1, angle = 0, color = '#5E9E3A' } = {}) {
  return `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(16 * size)}" ry="${n(6 * size)}" transform="rotate(${n(angle)} ${n(x)} ${n(y)})" fill="${color}" fill-opacity="0.55"/>`;
}

/** A thin slice of boiled pork: pale pink with a white fat edge. */
function pork([x, y], { size = 1, angle = 0 } = {}) {
  return (
    `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(angle)})" opacity="0.6">` +
    `<rect x="${n(-18 * size)}" y="${n(-5 * size)}" width="${n(36 * size)}" height="${n(10 * size)}" rx="${n(3 * size)}" fill="#E8B9A8"/>` +
    `<rect x="${n(-18 * size)}" y="${n(-5 * size)}" width="${n(36 * size)}" height="${n(3 * size)}" rx="${n(1.5 * size)}" fill="#FBF1EA"/></g>`
  );
}

function roll(rand, center, along) {
  const fr = frameOf(center, along, [0, 1, 0]);
  return blob(PLATE.origin, fr, [112, 38, 42], {
    colors: ['#FBF8F0', '#B8AE9C'],
    gloss: 0.7,
    shine: 0.3,
    rimLight: 0.45,
    decorate: ({ center: [cx, cy], ellipse }) => {
      const [ra, rb] = ellipse.radii;
      const a = (ellipse.angle * Math.PI) / 180;
      const at = (t, s) => [cx + Math.cos(a) * t * ra - Math.sin(a) * s * rb, cy + Math.sin(a) * t * ra + Math.cos(a) * s * rb];
      let svg = '';
      // Noodles and greens fill the middle, shrimp sit along the front.
      for (let k = 0; k < 22; k++) {
        const [x, y] = at(rand.range(-0.8, 0.8), rand.range(-0.25, 0.45));
        svg += `<path d="M${n(x - 12)},${n(y)} q6,-4 12,0 t12,0" fill="none" stroke="#FFFFFF" stroke-opacity="0.8" stroke-width="2.2"/>`;
      }
      for (let k = 0; k < 7; k++) svg += leaf(at(rand.range(-0.75, 0.75), rand.range(-0.55, -0.1)), { angle: ellipse.angle + rand.range(-30, 30), size: rand.range(0.8, 1.2), color: k % 2 ? '#5E9E3A' : '#3F7F2A' });
      for (let k = 0; k < 2; k++) svg += pork(at(-0.45 + k * 0.9, -0.05), { angle: ellipse.angle + rand.range(-10, 10), size: 1.1 });
      for (let k = 0; k < 3; k++) svg += shrimp(at(-0.6 + k * 0.6, 0.18), { angle: ellipse.angle + 180 + rand.range(-12, 12), size: 1.05 });
      return svg;
    },
  });
}

export function draw() {
  const rand = random(31);
  const along = norm([1, 0, -0.35]);
  // Three rolls side by side, each a little in front of the last.
  return inOrder([
    roll(rand, [-36, 44, -96], along),
    roll(rand, [0, 44, 0], along),
    roll(rand, [36, 44, 96], along),
  ]);
}
