import { BOWL, add, frame, heap, inOrder, norm, project, random } from '../kit.mjs';
import { chaLuaSlice, cilantroLeaf, noodleHeap, phoBroth, scallionRing } from '../food.mjs';

export const vessel = BOWL;
export const description = 'A glass bowl of banh canh: thick round noodles in light broth topped with sliced cha lua, spring onion and cilantro';

export function draw() {
  const rand = random(41);
  const broth = phoBroth(rand, { fat: 40 });
  const origin = project(BOWL.origin, [0, -40, -10]);
  const mound = heap(185, 44);
  // Bánh canh noodles are thick, so draw fewer, wider ribbons than phở.
  const noodles = noodleHeap(rand, origin, mound, { count: 34, width: 17 });

  const slices = [
    [-95, -60, 10],
    [10, -85, -8],
    [105, -45, 16],
    [-60, 35, -12],
    [70, 45, 6],
  ].map(([X, Z, spin]) =>
    chaLuaSlice(origin, frame(mound.at(X, Z, 8), norm(add(mound.normal(X, Z), [0, 0, 0.55])), spin), { r: 52, thick: 6 }),
  );

  let greens = '';
  const spots = (count) => mound.scatter(origin, rand, count * 2).filter((p) => Math.abs(p.point[0]) < 160 && p.point[2] < 140).slice(0, count);
  for (const p of spots(50)) {
    const [x, y] = project(origin, mound.at(p.point[0], p.point[2], 22));
    greens += scallionRing([x, y], { size: rand.range(4.5, 6.5), angle: rand.range(-30, 30) });
  }
  for (const p of spots(8)) {
    const [x, y] = project(origin, mound.at(p.point[0], p.point[2], 24));
    greens += cilantroLeaf([x, y], { size: rand.range(11, 15), angle: rand.range(-60, 60) });
  }
  return [broth.below, broth.surface, noodles, inOrder(slices), greens].join('\n');
}
