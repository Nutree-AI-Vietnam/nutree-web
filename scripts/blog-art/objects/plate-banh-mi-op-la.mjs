import { PLATE, frame, inOrder, norm } from '../kit.mjs';
import { baguette, friedEgg } from '../food.mjs';

export const vessel = PLATE;
export const description = 'A glass plate of banh mi op la: an unfilled Vietnamese baguette with two fried eggs';

export function draw() {
  const { origin } = PLATE;
  // The loaf lies across the back of the plate; two fried eggs sit in front of it, a little apart.
  const loaf = baguette(origin, frame([0, 50, -40], norm([0, 1, 0.12]), -6), { length: 380, width: 96, depth: 48 });
  const eggs = [
    friedEgg(origin, frame([-80, 12, 80], norm([0.04, 1, 0.3]), 20), { r: 66 }),
    friedEgg(origin, frame([90, 12, 74], norm([-0.04, 1, 0.3]), -35), { r: 62 }),
  ];
  return [loaf.svg, inOrder(eggs)].join('\n');
}
