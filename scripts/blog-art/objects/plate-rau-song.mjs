import { PLATE, add, frame, heap, inOrder, norm, project, random } from '../kit.mjs';
import { BASIL, leaf, leafBed } from '../food.mjs';

export const vessel = PLATE;
export const description = 'A glass plate of rau song: a heap of fresh lettuce and mustard greens with sprigs of herbs';

export function draw() {
  const rand = random(23);
  const origin = project(PLATE.origin, [0, 0, -40]);
  // Lettuce and mustard greens piled high across the plate.
  const { bed, pieces } = leafBed(rand, origin, heap(160, 52), { count: 28, size: 0.95 });

  // Herb sprigs laid over the front of the pile.
  const herbs = [];
  for (let k = 0; k < 9; k++) {
    const at = [rand.range(-100, 100), rand.range(30, 48), rand.range(-30, 50)];
    herbs.push(
      ...leaf(PLATE.origin, frame(at, norm(add([rand.range(-0.4, 0.4), 1, 0], [0, 0, 0.7])), rand.range(0, 360)), {
        length: rand.range(56, 72),
        width: rand.range(28, 36),
        fold: rand.range(14, 26),
        greens: BASIL,
        ruffle: 0.03,
        phase: k,
      }),
    );
  }
  return [bed, inOrder([...pieces, ...herbs])].join('\n');
}
