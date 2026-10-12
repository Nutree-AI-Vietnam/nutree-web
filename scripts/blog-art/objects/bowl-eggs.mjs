import { BOWL, frame, heap, inOrder, random, tilt, tone } from '../kit.mjs';
import { EGGSHELL, bowlInside, egg, heapBed, lump } from '../food.mjs';

export const vessel = BOWL;
export const description = 'A glass bowl full of whole eggs';

export function draw() {
  const rand = random(9);
  const { origin } = BOWL;
  const mound = heap(246, 44);
  const shell = () => (rand() < 0.75 ? EGGSHELL.brown : EGGSHELL.white);
  const inside = bowlInside(rand, {
    colors: ['#E2C9A6', '#9A7A58'],
    count: 64,
    sorted: true,
    piece: (rand, at, depth) => {
      const light = 0.35 + 0.5 * depth + rand.range(-0.08, 0.08);
      return lump(at, { rx: 36, ry: 28, angle: rand.range(-40, 40), color: tone(shell(), light), shine: 0.45 * light });
    },
  });
  // Eggs lying every which way over the whole top, packed up to the rim: random spots kept apart by
  // about an egg's width, so they touch without overlapping much.
  const spots = [];
  for (let tries = 0; tries < 8000 && spots.length < 48; tries++) {
    const a = rand.range(0, 2 * Math.PI);
    const r = 232 * Math.sqrt(rand());
    const X = r * Math.cos(a);
    const Z = r * Math.sin(a);
    if (spots.every(([x, z]) => Math.hypot(X - x, Z - z) > 58)) spots.push([X, Z]);
  }
  const eggs = spots.map(([X, Z]) => {
    const fr = frame(mound.at(X, Z, 20), tilt(rand, mound.normal(X, Z), 22), rand.range(0, 360));
    return egg(origin, fr, { length: rand.range(78, 86), shell: shell() });
  });
  // The bed only shows in the gaps, as eggs further down in shade.
  return [inside, heapBed(origin, mound, ['#EBD6B8', '#C7A783', '#94744F']), inOrder(eggs)].join('\n');
}
