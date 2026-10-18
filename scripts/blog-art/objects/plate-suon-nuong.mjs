import { PLATE, frame, inOrder, norm, project, random } from '../kit.mjs';
import { porkChop, scallionRing } from '../food.mjs';

export const vessel = PLATE;
export const description = 'A glass plate of two grilled pork chops (suon nuong) with char lines, topped with a few spring onion rings';

export function draw() {
  const rand = random(31);
  const { origin } = PLATE;

  // Two chops side by side, the front one resting a little over the back one.
  const chops = [
    [frame([-40, 14, -40], norm([0.05, 1, 0.4]), -14), { length: 230, width: 128 }],
    [frame([45, 26, 45], norm([-0.04, 1, 0.45]), 10), { length: 220, width: 122 }],
  ].map(([fr, size]) => {
    const chop = porkChop(origin, fr, size);
    for (let k = 0; k < 7; k++) {
      chop.svg += scallionRing(project(origin, fr.at(rand.range(-75, 60), rand.range(-35, 35), 1)), {
        size: rand.range(3.5, 5),
        angle: rand.range(-30, 30),
      });
    }
    return chop;
  });
  return inOrder(chops);
}
