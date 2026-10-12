import { PLATE, add, frame, heap, inOrder, norm, project, random } from '../kit.mjs';
import { GREENS, cherryTomato, leaf, leafBed, lemonSlice, salmonFillet } from '../food.mjs';

export const vessel = PLATE;
export const description = 'A glass plate with a baked salmon fillet on salad leaves, a lemon slice and cherry tomatoes';

export function draw() {
  const rand = random(3);
  // Everything sits a little behind the plate's centre, so the front leaves stay inside the rim.
  const origin = project(PLATE.origin, [0, 0, -40]);
  const mound = heap(158, 40);
  const { bed, pieces: leaves } = leafBed(rand, origin, mound, { count: 34, size: 0.9 });
  // The fillet lies on the leaves, turned toward the viewer so its top shows.
  const fishFrame = frame(mound.at(-10, 10, 40), norm([0.05, 1, 0.8]), -8);
  const fish = salmonFillet(origin, fishFrame);
  const lemon = lemonSlice(origin, frame([140, 38, 58], norm([0.35, 0.5, 1]), 0), { r: 40 });
  const tomatoes = [
    [-138, 50, true],
    [-100, 100, false],
    [88, 105, false],
  ].map(([X, Z, calyx]) => cherryTomato(origin, mound.at(X, Z, 18), { r: 20, spin: rand.range(0, 360), calyx }));
  // A sprig of dill on top of the fillet.
  const sprig = [-30, -14, 4].flatMap((p, k) =>
    leaf(origin, frame(fishFrame.at(p, 8 - k * 6, 3), add(fishFrame.w, [0, 0.2, 0.1]), 30 + k * 50), {
      length: 34,
      width: 16,
      fold: 25,
      greens: GREENS.spinach,
      phase: k,
    }),
  );
  return [bed, inOrder(leaves), inOrder([fish, lemon, ...tomatoes]), inOrder(sprig)].join('\n');
}
