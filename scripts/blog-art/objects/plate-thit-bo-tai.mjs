import { PLATE, frame, inOrder, norm } from '../kit.mjs';
import { BEEF, beefSlice } from '../food.mjs';

export const vessel = PLATE;
export const description = 'A glass plate of thinly sliced raw beef for pho tai, fanned in overlapping slices';

export function draw() {
  // Slices fanned in two rows, each resting on the one behind it.
  const slices = [];
  let k = 0;
  for (const [Z, row] of [
    [-55, [-130, -45, 40, 125]],
    [45, [-90, 0, 90]],
  ]) {
    for (const X of row) {
      slices.push(
        beefSlice(PLATE.origin, frame([X, 6 + (Z > 0 ? 8 : 0) + (k % 3), Z], norm([0.25, 1, 0.45]), -12 + (k % 4) * 8), {
          length: 170,
          width: 112,
          thick: 4,
          kind: BEEF.raw,
          seed: k + 3,
        }),
      );
      k++;
    }
  }
  return inOrder(slices);
}
