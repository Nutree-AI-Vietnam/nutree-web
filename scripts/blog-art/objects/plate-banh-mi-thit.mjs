import { PLATE, frame, norm, random } from '../kit.mjs';
import { banhMi } from '../food.mjs';

export const vessel = PLATE;
export const description =
  'A glass plate with a Vietnamese banh mi: a crisp baguette filled with pate, cha lua, roast pork, cucumber, pickles, coriander and chilli';

export function draw() {
  const rand = random(42);
  // The loaf lies across the plate, its cut 32 above the well, turned a little to the right.
  return banhMi(rand, PLATE.origin, frame([0, 36, 6], norm([0, 1, 0.12]), -6), { length: 400, width: 118 });
}
