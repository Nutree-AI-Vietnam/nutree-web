import { BOWL, add, frame, heap, inOrder, norm, project, random } from '../kit.mjs';
import { BEEF, beefSlice, cilantroLeaf, noodleHeap, onionRing, phoBroth, scallionRing } from '../food.mjs';

export const vessel = BOWL;
export const description = 'A glass bowl of beef pho: rice noodles in clear broth topped with rare and well-done beef, onion, spring onion and cilantro';

export function draw() {
  const rand = random(23);
  const broth = phoBroth(rand);
  // The noodles rise out of the broth in a low mound, a little behind the bowl's centre.
  const origin = project(BOWL.origin, [0, -40, -10]);
  const mound = heap(185, 48);
  const noodles = noodleHeap(rand, origin, mound, { count: 60, width: 9 });

  // Beef fanned over the noodles, tipped toward the viewer: rare slices (tái) and well-done ones (chín).
  const beef = [
    [-110, -70, 20, BEEF.chin],
    [-25, -95, -6, BEEF.tai],
    [70, -80, 14, BEEF.chin],
    [125, -5, -18, BEEF.tai],
    [-115, 25, 8, BEEF.tai],
    [-20, 0, -10, BEEF.chin],
    [60, 40, 12, BEEF.tai],
  ].map(([X, Z, spin, kind], k) =>
    beefSlice(origin, frame(mound.at(X, Z, 6 + k * 2), norm(add(mound.normal(X, Z), [0, 0, 0.55])), spin), {
      length: 140,
      width: 88,
      thick: 4,
      kind,
      seed: k + 1,
    }),
  );

  const onions = [
    [-140, 80],
    [-45, 105],
    [140, 70],
    [20, -40],
    [-60, -30],
  ].map(([X, Z]) => onionRing(origin, frame(mound.at(X, Z, 24), norm(add(mound.normal(X, Z), [0, 0, 0.4])), 0), { r: rand.range(16, 22) }));

  let greens = '';
  const spots = (count) => mound.scatter(origin, rand, count * 2).filter((p) => Math.abs(p.point[0]) < 160 && p.point[2] < 140).slice(0, count);
  for (const p of spots(46)) {
    const [x, y] = project(origin, mound.at(p.point[0], p.point[2], 26));
    greens += scallionRing([x, y], { size: rand.range(4.5, 6.5), angle: rand.range(-30, 30) });
  }
  for (const p of spots(10)) {
    const [x, y] = project(origin, mound.at(p.point[0], p.point[2], 28));
    greens += cilantroLeaf([x, y], { size: rand.range(11, 15), angle: rand.range(-60, 60) });
  }
  return [broth.below, broth.surface, noodles, inOrder(beef), inOrder(onions), greens].join('\n');
}
