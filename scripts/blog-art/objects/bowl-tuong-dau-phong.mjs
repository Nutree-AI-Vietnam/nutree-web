import { BOWL, LIGHT_2D, blur, define, linear, n, random, uid } from '../kit.mjs';

export const vessel = BOWL;
export const description = 'A glass bowl of tuong dau phong: thick brown hoisin and peanut dipping sauce topped with crushed roasted peanuts and a little chilli';

// The sauce's surface, 40 below the rim: the bowl is 250 across there.
const [CX, CY, RX, RY] = [320, 210.4, 250, 69.4];

/** A random point on the surface, away from the edge. */
function onSurface(rand, reach = 0.8) {
  const a = rand.range(0, 2 * Math.PI);
  const d = reach * Math.sqrt(rand());
  return [CX + Math.cos(a) * d * RX, CY + Math.sin(a) * d * RY];
}

/** A crushed peanut piece: a pale golden chip with a darker skin edge. */
function peanut(rand, [x, y]) {
  const r = rand.range(5, 10);
  const points = Array.from({ length: 7 }, (_, k) => {
    const a = (2 * Math.PI * k) / 7 + rand.range(-0.3, 0.3);
    const reach = r * rand.range(0.65, 1.15);
    return `${n(x + Math.cos(a) * reach)},${n(y + Math.sin(a) * reach * 0.6)}`;
  });
  const sx = x + LIGHT_2D[0] * r * 0.3;
  const sy = y + LIGHT_2D[1] * r * 0.2;
  return (
    `<path d="M${points.join(' ')}Z" fill="#E9C27E" stroke="#8A5A26" stroke-width="1.2"/>` +
    `<ellipse cx="${n(sx)}" cy="${n(sy)}" rx="${n(r * 0.4)}" ry="${n(r * 0.18)}" fill="#FFF6DC" fill-opacity="0.7"/>`
  );
}

function chilli(rand, [x, y]) {
  const rx = rand.range(6, 9);
  const ry = rx * 0.4;
  return `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}" transform="rotate(${n(rand.range(-20, 20))} ${n(x)} ${n(y)})" fill="#C8281A" stroke="#7E1208" stroke-width="0.8"/>`;
}

export function draw() {
  const rand = random(23);
  const clip = uid();
  define(`<clipPath id="${clip}"><use href="#interior"/></clipPath>`);

  // The sauce below its surface: thick and opaque, so nothing shows through it.
  const body = `M${CX - RX},${CY} A${RX},${RY} 0 0 1 ${CX + RX},${CY} L640,560 L0,560 Z`;
  const brown = linear([0, CY], [0, 420], [
    [0, '#8A4E24'],
    [0.55, '#6A3414'],
    [1, '#4A220A'],
  ]);

  // The surface: glossy, brighter toward the back, where it mirrors the light.
  const surface = linear([0, CY - RY], [0, CY + RY], [
    [0, '#B4743E'],
    [0.45, '#8C4E22'],
    [1, '#6E3814'],
  ]);
  const shine = [CX - RX * 0.38, CY - RY * 0.45];
  const box = [CX - RX, CY - RY, CX + RX, CY + RY];
  const bits = [
    ...Array.from({ length: 34 }, () => ({ at: onSurface(rand, 0.55), kind: 'peanut' })),
    ...Array.from({ length: 5 }, () => ({ at: onSurface(rand, 0.5), kind: 'chilli' })),
  ].sort((a, b) => a.at[1] - b.at[1]);
  let topping = '';
  for (const { at, kind } of bits) topping += kind === 'peanut' ? peanut(rand, at) : chilli(rand, at);

  return [
    `<g clip-path="url(#${clip})"><path d="${body}" fill="${brown}" fill-opacity="0.95"/></g>`,
    `<ellipse cx="${CX}" cy="${CY}" rx="${RX}" ry="${RY}" fill="${surface}"/>`,
    `<ellipse cx="${n(shine[0])}" cy="${n(shine[1])}" rx="${n(RX * 0.34)}" ry="${n(RY * 0.18)}" fill="#FFFFFF" fill-opacity="0.4" filter="${blur(5, box)}"/>`,
    `<path d="M${CX - RX + 2},${CY} A${RX - 2},${RY - 1} 0 0 1 ${CX + RX - 2},${CY}" fill="none" stroke="#E8C49A" stroke-opacity="0.7" stroke-width="3"/>`,
    topping,
  ].join('\n');
}
