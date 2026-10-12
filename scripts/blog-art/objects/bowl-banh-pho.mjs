import { BOWL, heap, random } from '../kit.mjs';
import { bowlInside, noodleHeap, noodleRibbon } from '../food.mjs';

export const vessel = BOWL;
export const description = 'A glass bowl heaped with fresh flat rice noodles (banh pho)';

export function draw() {
  const rand = random(41);
  // Noodles packed below the rim, seen through the glass.
  const inside = bowlInside(rand, {
    colors: ['#EEE8D8', '#C9C1A8'],
    count: 60,
    sorted: true,
    piece: (rand, [x, y], light) => {
      const line = Array.from({ length: 8 }, (_, i) => [x + (i - 4) * 14, y + 7 * Math.sin(i * 0.9 + x)]);
      return noodleRibbon(line, { width: 10, light: 0.45 + 0.4 * light });
    },
  });
  return `${inside}\n${noodleHeap(rand, BOWL.origin, heap(250, 96), { count: 110, width: 13 })}`;
}
