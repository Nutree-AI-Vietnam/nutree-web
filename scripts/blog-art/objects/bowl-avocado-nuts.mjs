import { BOWL, add, frame, heap, inOrder, norm, random, scale, tilt, tone } from '../kit.mjs';
import { almond, avocadoHalf, bowlInside, heapBed, lump, macadamia } from '../food.mjs';

export const vessel = BOWL;
export const description = 'A glass bowl of almonds and macadamia nuts topped with two avocado halves';

const ALMOND = ['#D4935A', '#5A2C0E'];
const MACADAMIA = ['#FCF0D4', '#AE8656'];

export function draw() {
  const rand = random(5);
  const { origin } = BOWL;
  const mound = heap(238, 66);
  const inside = bowlInside(rand, {
    colors: ['#B98250', '#5E3A1C'],
    count: 260,
    sorted: true,
    piece: (rand, at, depth) => {
      const light = 0.3 + 0.55 * depth + rand.range(-0.1, 0.1);
      return rand() < 0.6
        ? lump(at, { rx: 15, ry: 9, angle: rand.range(0, 180), color: tone(ALMOND, light), shine: 0.25 * light })
        : lump(at, { rx: 11, ry: 10, angle: rand.range(0, 180), color: tone(MACADAMIA, light), shine: 0.35 * light });
    },
  });
  const nuts = mound.scatter(origin, rand, 340).map((p) => {
    const fr = frame(add(p.point, scale(p.normal, 5)), tilt(rand, p.normal, 40), rand.range(0, 360));
    return rand() < 0.6 ? almond(origin, fr, { size: rand.range(0.9, 1.1) }) : macadamia(origin, fr, { size: rand.range(0.9, 1.1) });
  });
  // Two halves of one avocado lying on the nuts, cut faces up and tipped a little toward the viewer:
  // the one with the pit further back on the left, the empty one in front on the right, turned another way.
  const avocados = [
    [-70, 15, 25, true],
    [95, 100, -55, false],
  ].map(([X, Z, spin, pit]) => {
    const normal = norm(add(mound.normal(X, Z), [0, 0, 0.45]));
    return avocadoHalf(origin, frame(mound.at(X, Z, 16), normal, spin), { length: 150, width: 104, pit });
  });
  return [inside, heapBed(origin, mound, ['#D9AC7E', '#B08050', '#7C5432']), inOrder(nuts), inOrder(avocados)].join('\n');
}
