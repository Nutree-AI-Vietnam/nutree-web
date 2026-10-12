import { BOWL, add, frame, heap, inOrder, norm, random } from '../kit.mjs';
import { cherryTomato, chickenSlice, eggHalf, leafBed, leavesInside } from '../food.mjs';

export const vessel = BOWL;
export const description = 'A glass bowl of salad greens with grilled chicken, boiled egg halves and cherry tomatoes';

export function draw() {
  const rand = random(7);
  const { origin } = BOWL;
  const mound = heap(244, 84);
  const inside = leavesInside(rand);
  const { bed, pieces: leaves } = leafBed(rand, origin, mound, { count: 46 });

  const toppings = [];
  // Grilled chicken, sliced and fanned from the back left toward the front, each slice resting on the one behind it.
  for (let i = 0; i < 5; i++) {
    const X = -160 + i * 19;
    const Z = -105 + i * 44;
    const normal = norm(add(mound.normal(X, Z), [0, 0, 0.6]));
    toppings.push(
      chickenSlice(origin, frame(mound.at(X, Z, 14 + i * 3), normal, 22), {
        length: 128 + rand.range(-6, 6),
        width: 46,
        thick: 15,
      }),
    );
  }
  // Boiled egg halves at the front right.
  for (const [X, Z, spin] of [
    [150, 20, -30],
    [95, 95, -10],
    [185, 105, 20],
  ]) {
    const normal = norm(add(mound.normal(X, Z), [0, 0, 0.7]));
    toppings.push(eggHalf(origin, frame(mound.at(X, Z, 10), normal, spin)));
  }
  // Cherry tomatoes.
  for (const [X, Z, calyx] of [
    [30, -60, true],
    [-10, 120, false],
    [80, -120, false],
  ]) {
    toppings.push(cherryTomato(origin, mound.at(X, Z, 18), { r: 21, spin: rand.range(0, 360), calyx }));
  }
  return [inside, bed, inOrder(leaves), inOrder(toppings)].join('\n');
}
