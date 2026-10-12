import { PLATE, add, frame, heap, inOrder, lightOn, norm, project, random } from '../kit.mjs';
import { BASIL, beanSprout, chilliSlice, leaf, limeSlice } from '../food.mjs';

export const vessel = PLATE;
export const description = 'A glass plate of pho herbs: bean sprouts, Thai basil, lime slices and sliced red chilli';

export function draw() {
  const rand = random(31);
  // Bean sprouts heaped on the left.
  const sproutOrigin = project(PLATE.origin, [-75, 0, -10]);
  const sproutMound = heap(118, 58);
  const sprouts = sproutMound.scatter(sproutOrigin, rand, 120).map((p) => {
    const { diffuse } = lightOn(p.normal);
    return beanSprout(p.screen, { length: rand.range(46, 66), angle: rand.range(-50, 50), bend: rand.range(0.1, 0.3), light: 0.55 + 0.45 * diffuse });
  });

  // Sprigs of Thai basil on the right, leaning on each other.
  const basil = [];
  for (let k = 0; k < 13; k++) {
    const X = rand.range(40, 170);
    const Z = rand.range(-80, 10);
    const at = [X, 10 + rand.range(0, 26), Z];
    basil.push(
      ...leaf(PLATE.origin, frame(at, norm(add([rand.range(-0.4, 0.4), 1, 0], [0, 0, 0.7])), rand.range(0, 360)), {
        length: rand.range(70, 92),
        width: rand.range(36, 46),
        fold: rand.range(14, 28),
        greens: BASIL,
        ruffle: 0.03,
        phase: k,
      }),
    );
  }

  const limes = [
    [95, 70, -0.2],
    [160, 60, 0.3],
  ].map(([X, Z, lean]) => limeSlice(PLATE.origin, frame([X, 14, Z], norm([lean, 0.6, 1]), 0), { r: 34 }));

  let chillies = '';
  for (const [X, Z] of [
    [-30, 110],
    [5, 125],
    [-60, 125],
    [20, 100],
  ]) {
    chillies += chilliSlice(project(PLATE.origin, [X, 3, Z]), { size: 9, angle: rand.range(-20, 20) });
  }
  return [sprouts.join('\n'), inOrder([...basil, ...limes]), chillies].join('\n');
}
