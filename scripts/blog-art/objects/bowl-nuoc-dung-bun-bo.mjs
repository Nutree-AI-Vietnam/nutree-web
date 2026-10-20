import { BOWL, inOrder, project, random } from '../kit.mjs';
import { onionRing, phoBroth, scallionRing } from '../food.mjs';

export const vessel = BOWL;
export const description = 'A glass bowl of red-orange bún bò Huế broth with drops of chilli oil, onion rings and spring onion';

export function draw() {
  const rand = random(67);
  const broth = phoBroth(rand, { noodles: false, fat: 70, tint: 'bunBo' });
  const onions = Array.from({ length: 5 }, (_, k) =>
    onionRing(BOWL.origin, broth.onSurface(-130 + k * 65 + rand.range(-15, 15), rand.range(-120, 140)), { r: rand.range(20, 28) }),
  );
  let greens = '';
  for (let k = 0; k < 40; k++) {
    const [x, y] = project(BOWL.origin, [rand.range(-210, 210), -40, rand.range(-200, 200)]);
    if (((x - 320) / 225) ** 2 + ((y - 210) / 60) ** 2 > 1) continue;
    greens += scallionRing([x, y], { size: rand.range(4.5, 6.5), angle: rand.range(-20, 20) });
  }
  return [broth.below, broth.surface, inOrder(onions), greens].join('\n');
}
