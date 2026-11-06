import { CUP } from '../kit.mjs';
import { icedCoffee } from '../food.mjs';

export const vessel = CUP;
export const description = 'A glass of bac xiu: iced milk with a little coffee, a pale milky tan, with ice cubes';

export function draw() {
  // Mostly milk with a little coffee: a pale, milky tan.
  return icedCoffee({
    id: 'bacXiu',
    colors: ['#8A6444', '#BC9468', '#DEBF98'],
    surface: ['#F0DCBC', '#DCBE96', '#B8936A'],
    cubeOpacity: 0.45,
  });
}
