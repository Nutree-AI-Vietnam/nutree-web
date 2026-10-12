import { BOWL, LIGHT_2D, blur, define, linear, n, random, uid } from '../kit.mjs';

export const vessel = BOWL;
export const description = 'A glass bowl of nuoc cham: fish sauce dipping sauce with sliced chilli and chopped garlic';

// The sauce's surface, 40 below the rim: the bowl is 250 across there.
const [CX, CY, RX, RY] = [320, 210.4, 250, 69.4];

/** A random point on the surface, away from the edge. */
function onSurface(rand, reach = 0.82) {
  const a = rand.range(0, 2 * Math.PI);
  const d = reach * Math.sqrt(rand());
  return [CX + Math.cos(a) * d * RX, CY + Math.sin(a) * d * RY];
}

function chilli(rand, [x, y], { size = 1, opacity = 1 } = {}) {
  const rx = rand.range(9, 14) * size;
  const ry = rx * rand.range(0.32, 0.44);
  const angle = rand.range(-18, 18);
  const sx = x + LIGHT_2D[0] * rx * 0.35;
  const sy = y + LIGHT_2D[1] * ry * 0.5;
  let seeds = '';
  for (let k = 0; k < 3; k++) {
    seeds += `<ellipse cx="${n(rand.range(-0.3, 0.3) * rx)}" cy="${n(rand.range(-0.2, 0.2) * ry)}" rx="${n(rx * 0.12)}" ry="${n(ry * 0.16)}" fill="#FFF2C8"/>`;
  }
  return (
    `<g opacity="${opacity}" transform="translate(${n(x)} ${n(y)}) rotate(${n(angle)})">` +
    `<ellipse cy="${n(ry * 0.35)}" rx="${n(rx * 1.05)}" ry="${n(ry * 1.05)}" fill="#7A3008" fill-opacity="0.35"/>` +
    `<ellipse rx="${n(rx)}" ry="${n(ry)}" fill="#D8261A" stroke="#8E1208" stroke-width="1"/>` +
    `<ellipse rx="${n(rx * 0.6)}" ry="${n(ry * 0.55)}" fill="#F6B886"/>${seeds}</g>` +
    `<ellipse cx="${n(sx)}" cy="${n(sy)}" rx="${n(rx * 0.4)}" ry="${n(ry * 0.22)}" transform="rotate(${n(angle)} ${n(sx)} ${n(sy)})" fill="#FFFFFF" fill-opacity="${n(0.7 * opacity)}"/>`
  );
}

function garlic(rand, [x, y], { opacity = 1 } = {}) {
  const r = rand.range(2.5, 5);
  const points = Array.from({ length: 6 }, (_, k) => {
    const a = (2 * Math.PI * k) / 6 + rand.range(-0.3, 0.3);
    const reach = r * rand.range(0.7, 1.15);
    return `${n(x + Math.cos(a) * reach)},${n(y + Math.sin(a) * reach * 0.55)}`;
  });
  return `<path d="M${points.join(' ')}Z" fill="#F7EDD2" fill-opacity="${opacity}" stroke="#B8A070" stroke-opacity="${n(0.5 * opacity)}" stroke-width="0.6"/>`;
}

export function draw() {
  const rand = random(17);
  const clip = uid();
  define(`<clipPath id="${clip}"><use href="#interior"/></clipPath>`);

  // The sauce below its surface, seen through the glass, with a few bits sunk to the bottom.
  const body = `M${CX - RX},${CY} A${RX},${RY} 0 0 1 ${CX + RX},${CY} L640,560 L0,560 Z`;
  const amber = linear([0, CY], [0, 420], [
    [0, '#F2A23A'],
    [0.55, '#DA7418'],
    [1, '#A84A0A'],
  ]);
  let sunk = '';
  for (let k = 0; k < 16; k++) {
    const at = [rand.range(170, 470), rand.range(330, 405)];
    sunk += k % 3 ? garlic(rand, at, { opacity: 0.45 }) : chilli(rand, at, { size: 0.7, opacity: 0.45 });
  }

  // The surface: brighter toward the back, where it mirrors the light.
  const surface = linear([0, CY - RY], [0, CY + RY], [
    [0, '#FAD48C'],
    [0.45, '#F0A847'],
    [1, '#D9822A'],
  ]);
  const shine = [CX - RX * 0.38, CY - RY * 0.45];
  const box = [CX - RX, CY - RY, CX + RX, CY + RY];
  let floating = '';
  const bits = [
    ...Array.from({ length: 14 }, () => ({ at: onSurface(rand), kind: 'chilli' })),
    ...Array.from({ length: 22 }, () => ({ at: onSurface(rand, 0.86), kind: 'garlic' })),
  ].sort((a, b) => a.at[1] - b.at[1]);
  for (const { at, kind } of bits) floating += kind === 'chilli' ? chilli(rand, at) : garlic(rand, at);

  return [
    `<g clip-path="url(#${clip})"><path d="${body}" fill="${amber}" fill-opacity="0.88"/>${sunk}</g>`,
    `<ellipse cx="${CX}" cy="${CY}" rx="${RX}" ry="${RY}" fill="${surface}"/>`,
    `<ellipse cx="${n(shine[0])}" cy="${n(shine[1])}" rx="${n(RX * 0.34)}" ry="${n(RY * 0.18)}" fill="#FFFFFF" fill-opacity="0.55" filter="${blur(5, box)}"/>`,
    `<path d="M${CX - RX + 2},${CY} A${RX - 2},${RY - 1} 0 0 1 ${CX + RX - 2},${CY}" fill="none" stroke="#FFF4DC" stroke-opacity="0.85" stroke-width="3"/>`,
    `<path d="M${CX - RX + 4},${CY + 2} A${RX - 4},${RY - 2} 0 0 0 ${CX + RX - 4},${CY + 2}" fill="none" stroke="#8A4510" stroke-opacity="0.35" stroke-width="2.5"/>`,
    floating,
  ].join('\n');
}
