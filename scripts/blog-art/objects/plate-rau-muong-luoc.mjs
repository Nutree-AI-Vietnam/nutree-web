import { PLATE, add, frame, heap, inOrder, lightOn, nearness, norm, project, random } from '../kit.mjs';
import { WATER_SPINACH, heapBed, leaf, waterSpinachStem } from '../food.mjs';

export const vessel = PLATE;
export const description = 'A glass plate of boiled water spinach (rau muong luoc): a pile of long green stems and dark leaves';

export function draw() {
  const rand = random(41);
  const { origin } = PLATE;
  const mound = heap(190, 62);
  const bed = heapBed(origin, mound, ['#4E8A2C', '#24521A', '#0E2A08']);

  // Long stems laid lengthwise across the pile, each split where it leaves the mound.
  const pieces = [];
  for (let k = 0; k < 130; k++) {
    const Z = rand.range(-150, 150);
    const X = rand.range(-60, 60);
    const angle = rand.range(-22, 22) * (Math.PI / 180);
    const length = rand.range(220, 340);
    const lift = rand.range(3, 10);
    const pts3 = [];
    for (let i = 0; i <= 16; i++) {
      const t = (i / 16 - 0.5) * length;
      const x = X + Math.cos(angle) * t;
      const z = Z + Math.sin(angle) * t + 14 * Math.sin(i * 0.6 + k);
      if (x * x + z * z > mound.rx * mound.rx * 0.93) continue;
      pts3.push(mound.at(x, z, lift));
    }
    if (pts3.length < 4) continue;
    const mid = pts3[Math.floor(pts3.length / 2)];
    const { diffuse, spec } = lightOn(mound.normal(mid[0], mid[2]));
    pieces.push({
      depth: nearness(mid) + lift,
      svg: waterSpinachStem(pts3.map((P) => project(origin, P)), { width: rand.range(6, 9), light: Math.min(1, 0.35 + 0.6 * diffuse + 0.3 * spec) }),
    });
  }

  // Wilted arrow-shaped leaves tucked among the stems.
  for (const p of mound.scatter(origin, rand, 60)) {
    const normal = norm(add(p.normal, [rand.range(-0.3, 0.3), 0, 0.5]));
    pieces.push(
      ...leaf(origin, frame(add(p.point, [0, 12, 0]), normal, rand.range(-40, 40)), {
        length: rand.range(70, 100),
        width: rand.range(22, 30),
        fold: rand.range(15, 30),
        greens: WATER_SPINACH,
        ruffle: 0.02,
        phase: rand.range(0, 6),
      }),
    );
  }
  return [bed, inOrder(pieces)].join('\n');
}
