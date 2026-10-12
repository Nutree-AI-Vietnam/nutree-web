import { BOWL, heap, random } from '../kit.mjs';
import { riceHeap, riceInside } from '../food.mjs';

export const vessel = BOWL;
export const description = 'A glass bowl heaped with white rice';

export function draw() {
  const rand = random(11);
  const inside = riceInside(rand);
  return `${inside}\n${riceHeap(rand, BOWL.origin, heap(252, 104), { count: 2300 })}`;
}
