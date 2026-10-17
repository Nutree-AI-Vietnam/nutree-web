import { PLATE, add, frame, heap, inOrder, norm, project, random } from '../kit.mjs';
import { cherryTomato, chickenSlice, cucumberSlice, leafBed } from '../food.mjs';

export const vessel = PLATE;
export const description = 'A glass plate of sliced grilled chicken breast fanned over a few salad leaves, with cucumber slices and cherry tomatoes';

export function draw() {
  const rand = random(17);
  // Everything sits a little behind the plate's centre, so the front pieces stay inside the rim.
  const origin = project(PLATE.origin, [0, 0, -30]);
  const mound = heap(170, 30);
  const { bed, pieces: leaves } = leafBed(rand, origin, mound, { count: 22, size: 0.85 });

  // A sliced chicken breast: two rows of slices fanned from left to right, each resting on the one beside it.
  const slices = [];
  for (const [Z, lift, count] of [
    [-50, 8, 6],
    [40, 12, 5],
  ]) {
    for (let i = 0; i < count; i++) {
      const X = -120 + i * 46 + (Z > 0 ? 23 : 0);
      const normal = norm(add(mound.normal(X, Z), [-0.3, 0, 0.2]));
      slices.push(
        chickenSlice(origin, frame(mound.at(X, Z, lift + i * 3), normal, 88 + rand.range(-6, 6)), {
          length: 132 + rand.range(-8, 8),
          width: 64,
          thick: 14,
        }),
      );
    }
  }
  // Cucumber slices along the front edge and cherry tomatoes at the sides.
  const sides = [
    ...[
      [-120, 110],
      [-75, 125],
      [-30, 130],
    ].map(([X, Z], k) => cucumberSlice(origin, frame(mound.at(X, Z, 8 + k * 2), norm([0.1, 1, 0.55]), 0), { r: 26 })),
    ...[
      [150, 70, true],
      [110, 120, false],
      [-170, 30, false],
    ].map(([X, Z, calyx]) => cherryTomato(origin, mound.at(X, Z, 18), { r: 20, spin: rand.range(0, 360), calyx })),
  ];
  return [bed, inOrder(leaves), inOrder([...slices, ...sides])].join('\n');
}
