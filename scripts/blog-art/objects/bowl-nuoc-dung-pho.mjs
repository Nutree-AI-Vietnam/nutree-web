import { BOWL, inOrder, project, random } from '../kit.mjs';
import { onionRing, phoBroth, scallionRing } from '../food.mjs';

export const vessel = BOWL;
export const description = 'A glass bowl of clear pho broth with drops of beef fat, onion rings and spring onion';

export function draw() {
  const rand = random(53);
  const broth = phoBroth(rand, { noodles: false, fat: 60 });
  const onions = Array.from({ length: 6 }, (_, k) =>
    onionRing(BOWL.origin, broth.onSurface(-150 + k * 60 + rand.range(-15, 15), rand.range(-120, 140)), { r: rand.range(20, 28) }),
  );
  let greens = '';
  for (let k = 0; k < 40; k++) {
    const [x, y] = project(BOWL.origin, [rand.range(-210, 210), -40, rand.range(-200, 200)]);
    if (((x - 320) / 225) ** 2 + ((y - 210) / 60) ** 2 > 1) continue;
    greens += scallionRing([x, y], { size: rand.range(4.5, 6.5), angle: rand.range(-20, 20) });
  }
  return [broth.below, broth.surface, inOrder(onions), greens].join('\n');
}
