import { PLATE, frame, n, project, random, slab } from '../kit.mjs';
import { beanSprout, scallionRing } from '../food.mjs';

export const vessel = PLATE;
export const description = 'A glass plate of banh xeo: a crisp golden turmeric rice crepe folded in half, with shrimp and bean sprouts at its open edge';

/** A pink shrimp curled on its side: a crescent with orange stripes. */
function shrimp([x, y], { size = 1, angle = 0 } = {}) {
  const r = 22 * size;
  const stripes = [0.25, 0.5, 0.75]
    .map((t) => {
      const a = Math.PI * (1.1 + t * 0.8);
      const [cx, cy] = [Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78];
      return `<line x1="${n(cx * 0.72)}" y1="${n(cy * 0.72)}" x2="${n(cx * 1.2)}" y2="${n(cy * 1.2)}" stroke="#D9542E" stroke-opacity="0.8" stroke-width="${n(2.6 * size)}" stroke-linecap="round"/>`;
    })
    .join('');
  return (
    `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(angle)})">` +
    `<path d="M${n(-r)},0 A${n(r)},${n(r)} 0 0 1 ${n(r)},0 L${n(r * 0.45)},0 A${n(r * 0.45)},${n(r * 0.45)} 0 0 0 ${n(-r * 0.45)},0 Z" transform="translate(1.5 2.5)" fill="#2B2014" fill-opacity="0.18"/>` +
    `<path d="M${n(-r)},0 A${n(r)},${n(r)} 0 0 1 ${n(r)},0 L${n(r * 0.45)},0 A${n(r * 0.45)},${n(r * 0.45)} 0 0 0 ${n(-r * 0.45)},0 Z" fill="#F3916A"/>` +
    `${stripes}</g>`
  );
}

export function draw() {
  const rand = random(17);
  const R = 196;
  const thick = 16;
  // The fold runs straight along the back; the open, curved edge faces the viewer.
  const fr = frame([0, thick + 4, -100], [0, 1, 0]);
  const outline = [];
  for (let k = 0; k <= 48; k++) {
    const t = (Math.PI * k) / 48;
    outline.push([R * Math.cos(t), -R * 1.1 * Math.sin(t)]);
  }
  const edge = (t, r = 1) => [R * r * Math.cos(t), -R * 1.1 * r * Math.sin(t)];

  const crepe = slab(PLATE.origin, fr, outline, thick, {
    top: ['#F7CB4E', '#A4630F'],
    side: ['#F2C25A', '#9A5A14'],
    gloss: 0.35,
    decorate: ({ project: at }) => {
      let svg = '';
      // Browned, lacy crisp spots from the hot pan.
      for (let k = 0; k < 70; k++) {
        const t = rand.range(0, Math.PI);
        const s = Math.sqrt(rand());
        const [x, y] = at(...edge(t, s));
        const r = rand.range(3, 11);
        svg += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(r)}" ry="${n(r * 0.45)}" fill="#8A4A0C" fill-opacity="${n(rand.range(0.18, 0.4) * 100) / 100}"/>`;
      }
      for (let k = 0; k < 9; k++) {
        const t = rand.range(0.2, Math.PI - 0.2);
        const [x, y] = at(...edge(t, rand.range(0.25, 0.6)));
        svg += scallionRing([x, y], { size: 4.5, angle: rand.range(0, 180) });
      }
      return svg;
    },
  });

  // Filling spilling out of the open front edge: bean sprouts with shrimp tucked between them.
  let filling = '';
  for (let k = 0; k < 18; k++) {
    const t = rand.range(0.18, Math.PI - 0.18);
    const [x, y] = project(PLATE.origin, fr.at(...edge(t, rand.range(0.97, 1.05)), -thick * 0.5));
    filling += beanSprout([x, y], { length: rand.range(34, 48), angle: rand.range(-40, 40), bend: rand.range(0.1, 0.3), light: rand.range(0.8, 1) });
  }
  for (const t of [0.55, 1.05, 1.6, 2.1, 2.6]) {
    const [x, y] = project(PLATE.origin, fr.at(...edge(t + rand.range(-0.08, 0.08), 1.02), -thick * 0.4));
    filling += shrimp([x, y + 4], { angle: 180 + rand.range(-20, 20), size: 1.1 });
  }
  return crepe.svg + '\n' + filling;
}
