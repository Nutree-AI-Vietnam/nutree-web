import { PLATE, add, blur, frame, heap, inOrder, n, norm, project, random, tilt } from '../kit.mjs';
import { cucumberSlice, friedEgg, pickleStick, porkChop, riceHeap, scallionRing, tomatoSlice } from '../food.mjs';

export const vessel = PLATE;
export const description =
  'A glass plate of com tam: broken rice with spring onion oil, a grilled pork chop, a fried egg, cucumber and tomato slices and pickles';

export function draw() {
  const rand = random(21);
  const { origin } = PLATE;

  // Broken rice heaped at the back left, with spring onion oil (mỡ hành) spooned over the top.
  const riceOrigin = project(origin, [-70, 0, -35]);
  const mound = heap(122, 88);
  const top = project(riceOrigin, [0, mound.height, 0]);
  const sheen = [top[0] - 6, top[1] + 26];
  const box = [sheen[0] - 80, sheen[1] - 30, sheen[0] + 80, sheen[1] + 30];
  const onion = mound
    .scatter(riceOrigin, rand, 110)
    .filter((p) => p.rise > 0.5)
    .map((p) => scallionRing(p.screen, { size: rand.range(3.5, 5.5), angle: rand.range(-25, 25) }));
  const rice = [
    riceHeap(rand, riceOrigin, mound, { count: 1600, grain: { length: 4.5, width: 2.4 } }),
    `<ellipse cx="${n(sheen[0])}" cy="${n(sheen[1])}" rx="62" ry="22" fill="#F6E27A" fill-opacity="0.3" filter="${blur(8, box)}"/>`,
    ...onion,
  ].join('\n');

  // The grilled pork chop (sườn) at the right, tipped toward the viewer, its left end over the rice.
  const chopFrame = frame([85, 42, 42], norm([0.03, 1, 0.45]), 8);
  const chop = porkChop(origin, chopFrame, { length: 200, width: 118 });
  for (let k = 0; k < 8; k++) {
    chop.svg += scallionRing(project(origin, chopFrame.at(rand.range(-70, 55), rand.range(-32, 32), 1)), {
      size: rand.range(3.5, 5),
      angle: rand.range(-30, 30),
    });
  }

  // A fried egg at the front left, lying on the plate with its back edge up on the rice.
  const egg = friedEgg(origin, frame([-130, 20, 90], norm([0.06, 1, 0.3]), 15), { r: 60 });

  // Cucumber and tomato slices along the front right, each lying half over the one behind it.
  const slices = [
    [196, 72, 'cucumber'],
    [166, 94, 'tomato'],
    [134, 110, 'cucumber'],
    [100, 120, 'tomato'],
    [66, 126, 'cucumber'],
  ].map(([X, Z, kind]) => {
    const fr = frame([X, 16, Z], norm([0.12, 1, 0.42]), rand.range(0, 360));
    return kind === 'cucumber' ? cucumberSlice(origin, fr, { r: 25 }) : tomatoSlice(origin, fr, { r: 27 });
  });

  // A little pile of pickled carrot and daikon (đồ chua) at the front.
  const pickles = Array.from({ length: 14 }, () => {
    const a = rand.range(0, 2 * Math.PI);
    const d = Math.sqrt(rand());
    const X = -25 + Math.cos(a) * d * 32;
    const Z = 124 + Math.sin(a) * d * 13;
    const fr = frame([X, 4 + 9 * (1 - d * d) + rand.range(0, 4), Z], tilt(rand, [0, 1, 0.3], 25), rand.range(0, 180));
    return pickleStick(origin, fr, { length: rand.range(38, 50), carrot: rand() < 0.6 });
  });

  return [rice, inOrder([chop, egg, ...slices, ...pickles])].join('\n');
}
