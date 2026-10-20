import { BOWL, heap, random } from '../kit.mjs';
import { bowlInside, noodleHeap, noodleRibbon } from '../food.mjs';

export const vessel = BOWL;
export const description = 'A glass bowl heaped with thick round rice vermicelli (bún bò Huế noodles)';

export function draw() {
  const rand = random(59);
  // Round noodles are narrower than flat bánh phở, so the strands are thinner and more of them.
  const inside = bowlInside(rand, {
    colors: ['#F2EEE2', '#CFC8B2'],
    count: 80,
    sorted: true,
    piece: (rand, [x, y], light) => {
      const line = Array.from({ length: 8 }, (_, i) => [x + (i - 4) * 14, y + 8 * Math.sin(i * 1.1 + x)]);
      return noodleRibbon(line, { width: 6, light: 0.5 + 0.4 * light });
    },
  });
  return `${inside}\n${noodleHeap(rand, BOWL.origin, heap(250, 96), { count: 170, width: 7 })}`;
}
