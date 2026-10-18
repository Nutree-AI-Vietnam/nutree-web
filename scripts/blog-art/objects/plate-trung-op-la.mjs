import { PLATE, frame, inOrder, norm } from '../kit.mjs';
import { friedEgg } from '../food.mjs';

export const vessel = PLATE;
export const description = 'A glass plate of two sunny-side-up fried eggs (trung op la) with crisp browned edges';

export function draw() {
  // Two eggs side by side, the right one lying slightly over the left one's edge.
  const eggs = [
    friedEgg(PLATE.origin, frame([-75, 8, -10], norm([0.05, 1, 0.35]), 20), { r: 92 }),
    friedEgg(PLATE.origin, frame([85, 14, 20], norm([-0.04, 1, 0.38]), -15), { r: 88 }),
  ];
  return inOrder(eggs);
}
