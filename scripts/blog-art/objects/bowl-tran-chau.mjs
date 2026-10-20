import { BOWL, heap, lightOn, nearness, project, random } from '../kit.mjs';
import { bowlInside, heapBed, tapiocaPearl } from '../food.mjs';

export const vessel = BOWL;
export const description = 'A glass bowl heaped with glossy black tapioca pearls (tran chau den)';

export function draw() {
  const rand = random(17);
  const { origin } = BOWL;
  const mound = heap(250, 70);
  // Pearls packed below the rim, seen through the wall: dark balls, dimmer towards the bottom.
  const inside = bowlInside(rand, {
    colors: ['#3A2010', '#160A04'],
    count: 150,
    sorted: true,
    piece: (rand, at, depth) => tapiocaPearl(at, { r: rand.range(15, 18), light: 0.35 + 0.55 * depth }),
  });
  // Pearls over the top of the heap, about a pearl's width apart, drawn back to front.
  const spots = [];
  for (let tries = 0; tries < 20000 && spots.length < 300; tries++) {
    const a = rand.range(0, 2 * Math.PI);
    const r = 249 * Math.sqrt(rand());
    const X = r * Math.cos(a);
    const Z = r * Math.sin(a);
    if (spots.every(([x, z]) => Math.hypot(X - x, Z - z) > 25)) spots.push([X, Z]);
  }
  const pearls = spots
    .map(([X, Z]) => {
      const point = mound.at(X, Z, 15);
      const { diffuse } = lightOn(mound.normal(X, Z));
      return { point, light: 0.45 + 0.55 * diffuse };
    })
    .sort((a, b) => nearness(a.point) - nearness(b.point))
    .map(({ point, light }) => tapiocaPearl(project(origin, point), { r: rand.range(15, 17.5), light }));
  return [inside, heapBed(origin, mound, ['#4A2A14', '#24120A', '#100602']), pearls.join('\n')].join('\n');
}
