import { PLATE, frame, inOrder, norm } from '../kit.mjs';
import { chaLuaSlice } from '../food.mjs';

export const vessel = PLATE;
export const description = 'A glass plate of cha lua (Vietnamese pork roll) slices fanned in overlapping rows';

export function draw() {
  // Two rows of slices, each resting on the one behind it.
  const slices = [];
  let k = 0;
  for (const [Z, row] of [
    [-50, [-120, -40, 40, 120]],
    [40, [-80, 0, 80]],
  ]) {
    for (const X of row) {
      slices.push(chaLuaSlice(PLATE.origin, frame([X, 8 + (Z > 0 ? 10 : 0) + (k % 3) * 2, Z], norm([0.22, 1, 0.5]), k * 20), { r: 60 }));
      k++;
    }
  }
  return inOrder(slices);
}
