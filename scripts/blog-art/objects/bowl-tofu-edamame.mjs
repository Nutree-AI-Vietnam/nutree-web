import { BOWL, add, frame, heap, inOrder, norm, project, random, scale, tilt, tone } from '../kit.mjs';
import { bowlInside, edamameBean, edamamePod, heapBed, lump, scallionRing, sesame, tofuCube } from '../food.mjs';

export const vessel = BOWL;
export const description = 'A glass bowl of shelled edamame beans with fried tofu cubes, sesame seeds and spring onion';

export function draw() {
  const rand = random(13);
  const { origin } = BOWL;
  const mound = heap(240, 70);
  const inside = bowlInside(rand, {
    colors: ['#7DB848', '#2A5A14'],
    count: 520,
    piece: (rand, at, depth) => {
      const light = 0.3 + 0.55 * depth + rand.range(-0.1, 0.1);
      return rand() < 0.08
        ? lump(at, { rx: 22, ry: 19, angle: rand.range(-20, 20), color: tone(['#F6CF84', '#A8661E'], light), shine: 0.2 })
        : lump(at, { rx: 10, ry: 7.5, angle: rand.range(0, 180), color: tone(['#B4E070', '#2F6A14'], light), shine: 0.4 * light });
    },
  });
  const beans = mound.scatter(origin, rand, 300).map((p) =>
    edamameBean(origin, frame(add(p.point, scale(p.normal, 5)), tilt(rand, p.normal, 45), rand.range(0, 360)), { size: rand.range(0.9, 1.1) }),
  );
  // Spring onion sprinkled over the beans.
  const onion = mound.scatter(origin, rand, 14).map((p) => ({
    depth: p.depth + 6,
    svg: scallionRing(p.screen, { size: rand.range(4, 5.5), angle: rand.range(-20, 20) }),
  }));
  // Tofu cubes heaped left of centre, each with sesame seeds on top.
  const tofu = [];
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      const X = -45 + col * 62 + rand.range(-8, 8);
      const Z = 10 + row * 60 + rand.range(-8, 8);
      const size = rand.range(44, 50);
      const normal = tilt(rand, norm(add(mound.normal(X, Z), [0, 0, 0.25])), 12);
      const fr = frame(mound.at(X, Z, size * 0.9 - 12), normal, rand.range(0, 90));
      const cube = tofuCube(origin, fr, { size });
      let seeds = '';
      for (let k = 0; k < 5; k++) {
        seeds += sesame(project(origin, fr.at(rand.range(-0.35, 0.35) * size, rand.range(-0.35, 0.35) * size, 0.5)), rand.range(0, 180));
      }
      if (rand() < 0.5) seeds += scallionRing(project(origin, fr.at(rand.range(-0.2, 0.2) * size, rand.range(-0.2, 0.2) * size, 1)), { size: 4.5 });
      tofu.push({ depth: cube.depth, svg: cube.svg + seeds });
    }
  }
  const pods = [
    [140, -35, 30],
    [168, 45, -25],
    [100, 115, 10],
  ].map(([X, Z, spin]) => edamamePod(origin, frame(mound.at(X, Z, 7), norm(add(mound.normal(X, Z), [0, 0, 0.3])), spin)));
  return [inside, heapBed(origin, mound, ['#6A9E3A', '#3E6E1E', '#1E3E0C']), inOrder([...beans, ...onion]), inOrder([...pods, ...tofu])].join('\n');
}
