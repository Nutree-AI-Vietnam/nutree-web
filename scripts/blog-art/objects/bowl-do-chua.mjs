import { BOWL, add, frame, heap, inOrder, random, scale, tilt, tone } from '../kit.mjs';
import { bowlInside, heapBed, lump, pickleStick } from '../food.mjs';

export const vessel = BOWL;
export const description = 'A glass bowl of do chua: pickled carrot and daikon sticks';

export function draw() {
  const rand = random(7);
  const { origin } = BOWL;
  const mound = heap(240, 66);
  const inside = bowlInside(rand, {
    colors: ['#F8C890', '#B87A40'],
    count: 420,
    piece: (rand, at, depth) => {
      const light = 0.35 + 0.55 * depth + rand.range(-0.1, 0.1);
      const carrot = rand() < 0.55;
      return lump(at, {
        rx: 18,
        ry: 4.5,
        angle: rand.range(-60, 60),
        color: tone(carrot ? ['#FFB060', '#A84406'] : ['#FFFFFF', '#B8AE8E'], light),
        shine: 0.35 * light,
      });
    },
  });
  const sticks = mound.scatter(origin, rand, 230).map((p) =>
    pickleStick(origin, frame(add(p.point, scale(p.normal, 4)), tilt(rand, p.normal, 35), rand.range(0, 180)), {
      length: rand.range(40, 54),
      width: 8,
      thick: 7,
      carrot: rand() < 0.55,
    }),
  );
  return [inside, heapBed(origin, mound, ['#F4D2A8', '#C8945C', '#7A4A20']), inOrder(sticks)].join('\n');
}
