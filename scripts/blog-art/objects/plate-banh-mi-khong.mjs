import { PLATE, frame, norm } from '../kit.mjs';
import { baguette } from '../food.mjs';

export const vessel = PLATE;
export const description = 'A glass plate with a whole, unfilled Vietnamese baguette (banh mi khong)';

export function draw() {
  return baguette(PLATE.origin, frame([0, 50, 6], norm([0, 1, 0.12]), -6), { length: 420, width: 100, depth: 50 }).svg;
}
