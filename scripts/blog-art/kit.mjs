// Drawing kit for the food that goes into the glass vessel templates in
// content/blog/images/_templates. Everything shares the templates' camera and light, so food drawn
// with it sits in the vessels naturally. See "Images" in content/blog/README.md.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../..', import.meta.url));
export const TEMPLATES = path.join(ROOT, 'content/blog/images/_templates');
export const OBJECTS = path.join(ROOT, 'content/blog/images/_objects');

/**
 * The vessels. origin is the screen point of world (0, 0, 0): the centre of the opening (bowl, cup)
 * or of the well (plate). radius is the world radius there.
 */
export const BOWL = { template: 'glass-bowl.svg', width: 640, height: 560, origin: [320, 172], radius: 252 };
export const PLATE = { template: 'glass-plate.svg', width: 640, height: 380, origin: [320, 263], radius: 222 };
export const CUP = { template: 'glass-cup.svg', width: 400, height: 600, origin: [200, 97], radius: 139 };

// ---------- numbers and vectors ----------
export const n = (v) => +v.toFixed(1);
const f3 = (v) => +v.toFixed(3);
export const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const add = (...vs) => vs.reduce((a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]);
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = (a) => scale(a, 1 / Math.hypot(a[0], a[1], a[2]));
export const UP = [0, 1, 0];
export const rad = (deg) => (deg * Math.PI) / 180;

/** A repeatable random sequence, so an object redraws the same way every time. */
export function random(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next.range = (lo, hi) => lo + (hi - lo) * next();
  next.pick = (list) => list[Math.floor(next() * list.length)];
  return next;
}

// ---------- camera and light ----------
// World: X right, Y up, Z toward the viewer, one unit per pixel across. Screen: x right, y down,
// z toward the viewer. The camera looks down at the angle that turns the bowl opening into its
// 252×70 ellipse.
export const SIN_E = 70 / 252;
export const COS_E = Math.sqrt(1 - SIN_E * SIN_E);
/** A world direction seen on screen (the same turn works both ways). */
export const turn = ([x, y, z]) => [x, z * SIN_E - y * COS_E, z * COS_E + y * SIN_E];
/** Where a world point lands, with world (0, 0, 0) at the screen point origin. */
export const project = (origin, [X, Y, Z]) => [origin[0] + X, origin[1] + Z * SIN_E - Y * COS_E];
/** How near the viewer a world point is: draw nearer things later. */
export const nearness = ([X, Y, Z]) => Z * COS_E + Y * SIN_E;
export const facesViewer = (normal) => turn(normal)[2] > 0.02;

// Light from the top left, in screen space like the templates; HALF is the shine direction.
export const LIGHT = norm([-0.45, -0.6, 0.66]);
export const HALF = norm([LIGHT[0], LIGHT[1], LIGHT[2] + 1]);
export const LIGHT_W = turn(LIGHT);
export const HALF_W = turn(HALF);
/** Light on a surface with this world normal. */
export const lightOn = (normal, power = 40) => ({
  diffuse: clamp(dot(norm(normal), LIGHT_W)),
  spec: Math.pow(clamp(dot(norm(normal), HALF_W)), power),
});
/** The light's direction across the screen, pointing toward the light. */
export const LIGHT_2D = (() => {
  const l = Math.hypot(LIGHT[0], LIGHT[1]);
  return [LIGHT[0] / l, LIGHT[1] / l];
})();

// ---------- colour ----------
export const rgb = (hex) => {
  const v = parseInt(hex.slice(1), 16);
  return [v >> 16, (v >> 8) & 255, v & 255];
};
export const hex = (c) => '#' + c.map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
export const mix = (a, b, t) => hex(rgb(a).map((v, i) => v + (rgb(b)[i] - v) * t));
/** A colour between its shadow tone and its lit tone, plus white where the light glints. */
export const tone = ([light, dark], diffuse, spec = 0) =>
  hex(rgb(dark).map((v, i) => v + (rgb(light)[i] - v) * clamp(diffuse) + 255 * spec));

// ---------- the defs an object needs ----------
let defs = [];
let ids = 0;
/** Start a new object. */
export function begin() {
  defs = [];
  ids = 0;
}
export const uid = () => `q${(++ids).toString(36)}`;
/** Add raw defs (shared symbols, gradients) to the object. */
export const define = (svg) => defs.push(svg);
export const defsSvg = () => `<defs>\n${defs.join('\n')}\n</defs>`;
const stopsOf = (stops) =>
  stops
    .map(([offset, color, opacity = 1]) =>
      `<stop offset="${f3(clamp(offset))}" stop-color="${color}"${opacity < 1 ? ` stop-opacity="${f3(clamp(opacity))}"` : ''}/>`)
    .join('');
export function linear([x1, y1], [x2, y2], stops) {
  const id = uid();
  defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}">${stopsOf(stops)}</linearGradient>`);
  return `url(#${id})`;
}
/** A radial gradient on an ellipse: stops run from the focus (in the ellipse's unit circle) to its edge. */
export function radial({ center, radii, angle = 0, focus = [0, 0] }, stops) {
  const id = uid();
  defs.push(`<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" fx="${f3(focus[0])}" fy="${f3(focus[1])}" gradientTransform="translate(${n(center[0])} ${n(center[1])}) rotate(${n(angle)}) scale(${f3(Math.max(radii[0], 0.1))} ${f3(Math.max(radii[1], 0.1))})">${stopsOf(stops)}</radialGradient>`);
  return `url(#${id})`;
}
export function clipTo(d) {
  const id = uid();
  defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
  return `url(#${id})`;
}
/** A soft blur for one shape whose screen bounds are box [x0, y0, x1, y1]. */
export function blur(sd, box) {
  const id = uid();
  const m = sd * 3 + 2;
  const [x0, y0, x1, y1] = box;
  defs.push(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${n(x0 - m)}" y="${n(y0 - m)}" width="${n(x1 - x0 + 2 * m)}" height="${n(y1 - y0 + 2 * m)}"><feGaussianBlur stdDeviation="${n(sd)}"/></filter>`);
  return `url(#${id})`;
}
const grow = ([x0, y0, x1, y1], m) => [x0 - m, y0 - m, x1 + m, y1 + m];

// ---------- 2D shapes ----------
export const pts = (list) => list.map(([x, y]) => `${n(x)},${n(y)}`).join(' ');
export const pathOf = (poly) => `M${pts(poly)}Z`;
export const openPath = (poly) => `M${pts(poly)}`;
const area = (poly) =>
  poly.reduce((s, [x, y], i) => {
    const [x2, y2] = poly[(i + 1) % poly.length];
    return s + x * y2 - x2 * y;
  }, 0) / 2;
const counterClockwise = (poly) => (area(poly) < 0 ? [...poly].reverse() : poly);
export function bounds(points) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}
export function hull(points) {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const turnOf = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const q of p) {
    while (lower.length >= 2 && turnOf(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  const upper = [];
  for (const q of [...p].reverse()) {
    while (upper.length >= 2 && turnOf(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
/** The region a screen polygon covers as it slides along the screen vector d. */
export function sweep(poly, d) {
  const moved = poly.map(([x, y]) => [x + d[0], y + d[1]]);
  const parts = [poly, moved];
  poly.forEach((p, i) => {
    const j = (i + 1) % poly.length;
    if (Math.abs((poly[j][0] - p[0]) * d[1] - (poly[j][1] - p[1]) * d[0]) > 0.01) parts.push([p, poly[j], moved[j], moved[i]]);
  });
  return parts.map((part) => pathOf(counterClockwise(part))).join('');
}
/** Points around an ellipse, for outlines. */
export const ellipsePoints = (a, b, count = 40, phase = 0) =>
  Array.from({ length: count }, (_, i) => {
    const t = phase + (2 * Math.PI * i) / count;
    return [a * Math.cos(t), b * Math.sin(t)];
  });
/** A soft drop shadow for a screen shape, offset away from the light. */
export function softShadow(d, box, { dx = 3, dy = 4, opacity = 0.3, blur: sd = 3, color = '#2B2014' } = {}) {
  return `<path d="${d}" transform="translate(${n(dx)} ${n(dy)})" fill="${color}" fill-opacity="${opacity}" filter="${blur(sd, box)}"/>`;
}

// ---------- frames: where a flat piece lies ----------
/**
 * A patch at a world point: u and v run along it and w is its normal. u starts along world X
 * flattened onto the patch, turned by spin degrees.
 */
export function frame(origin, normal, spin = 0) {
  const w = norm(normal);
  let t = sub([1, 0, 0], scale(w, w[0]));
  if (Math.hypot(...t) < 1e-3) t = sub([0, 0, 1], scale(w, w[2]));
  t = norm(t);
  const b = cross(w, t);
  const u = add(scale(t, Math.cos(rad(spin))), scale(b, Math.sin(rad(spin))));
  return frameOf(origin, u, w);
}
/** A frame from a normal w and a direction u along the patch. */
export function frameOf(origin, u, w) {
  w = norm(w);
  u = norm(sub(u, scale(w, dot(u, w))));
  const v = cross(w, u);
  return { origin, u, v, w, at: (p, q, r = 0) => add(origin, scale(u, p), scale(v, q), scale(w, r)) };
}
/** A normal tipped away from n by up to maxDeg degrees in a random direction. */
export function tilt(rand, normal, maxDeg) {
  const fr = frame([0, 0, 0], normal, rand.range(0, 360));
  const a = rad(rand.range(0, maxDeg));
  return norm(add(scale(fr.w, Math.cos(a)), scale(fr.u, Math.sin(a))));
}

// ---------- solid pieces ----------
/**
 * A flat piece of food: an outline [[u, v], ...] on the frame, thick below it.
 * look: { top: [light, dark] | (shade, api) => fill, side: [light, dark], gloss, bevel, rim,
 *         rimShade, sheen, sideShade, shadow: false | { dx, dy, opacity, blur }, edge,
 *         decorate(api) => svg drawn on the top face, sideDecorate(api) => svg drawn on the sides }
 */
export function slab(origin, fr, outline, thick, look) {
  const poly = counterClockwise(outline);
  const top3 = poly.map(([p, q]) => fr.at(p, q, 0));
  const top = top3.map((P) => project(origin, P));
  const at0 = project(origin, fr.origin);
  const below = project(origin, fr.at(0, 0, -thick));
  const d = [below[0] - at0[0], below[1] - at0[1]];
  const moved = top.map(([x, y]) => [x + d[0], y + d[1]]);
  const sidePath = sweep(top, d);
  const topPath = pathOf(top);
  const box = bounds([...top, ...moved]);
  const [x0, y0, x1, y1] = box;
  const size = Math.max(x1 - x0, y1 - y0);
  const api = { top, moved, d, poly, fr, origin, project: (p, q, r = 0) => project(origin, fr.at(p, q, r)) };
  let svg = '';

  if (look.shadow !== false) {
    svg += softShadow(sidePath, box, { blur: clamp(size * 0.04, 1.5, 6), ...look.shadow });
  }

  // The sides, shaded edge by edge across the direction they slide in.
  if (Math.hypot(d[0], d[1]) > 0.3) {
    const across = [-d[1] / Math.hypot(...d), d[0] / Math.hypot(...d)];
    const along = (p) => p[0] * across[0] + p[1] * across[1];
    const values = top.map(along);
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const stops = [];
    poly.forEach((_, i) => {
      const j = (i + 1) % poly.length;
      if (Math.hypot(...sub(top3[j], top3[i])) < 1e-6) return;
      const out = norm(cross(sub(top3[j], top3[i]), fr.w));
      if (!facesViewer(out)) return;
      const { diffuse, spec } = lightOn(out);
      const mid = [(top[i][0] + top[j][0]) / 2, (top[i][1] + top[j][1]) / 2];
      stops.push([(along(mid) - lo) / (hi - lo || 1), tone(look.side, diffuse, spec * (look.gloss ?? 0) * 0.6)]);
    });
    stops.sort((a, b) => a[0] - b[0]);
    const fill = stops.length
      ? linear([across[0] * lo, across[1] * lo], [across[0] * hi, across[1] * hi], stops)
      : tone(look.side, 0.3);
    svg += `<path d="${sidePath}" fill="${fill}"/>`;
    const shadeWidth = Math.max(2, Math.hypot(...d) * 0.7);
    svg += `<g clip-path="${clipTo(sidePath)}">`;
    if (look.sideDecorate) svg += look.sideDecorate(api);
    svg += `<path d="${pathOf(moved)}" fill="none" stroke="#1E140A" stroke-opacity="${look.sideShade ?? 0.3}" stroke-width="${n(shadeWidth)}" filter="${blur(clamp(Math.hypot(...d) * 0.3, 0.8, 4), grow(bounds(moved), shadeWidth))}"/>`;
    svg += '</g>';
  }

  // The top face.
  const shade = lightOn(fr.w);
  const fill = typeof look.top === 'function' ? look.top(shade, api) : tone(look.top, shade.diffuse, shade.spec * (look.gloss ?? 0) * 0.3);
  svg += `<path d="${topPath}" fill="${fill}"/>`;
  const bevel = look.bevel ?? clamp(size * 0.05, 1.5, 6);
  const c = [(x0 + x1) / 2, (y0 + y1) / 2];
  const r = size / 2;
  const toLight = [c[0] + LIGHT_2D[0] * r, c[1] + LIGHT_2D[1] * r];
  const awayFromLight = [c[0] - LIGHT_2D[0] * r, c[1] - LIGHT_2D[1] * r];
  const edgeLight = linear(toLight, awayFromLight, [
    [0, '#FFFFFF', look.rim ?? 0.75],
    [0.42, '#FFFFFF', 0],
    [0.58, '#1E140A', 0],
    [1, '#1E140A', look.rimShade ?? 0.3],
  ]);
  svg += `<g clip-path="${clipTo(topPath)}">`;
  if (look.decorate) svg += look.decorate(api);
  svg += `<path d="${topPath}" fill="none" stroke="${edgeLight}" stroke-width="${n(bevel * 2)}" filter="${blur(bevel * 0.45, grow(bounds(top), bevel))}"/>`;
  if (look.sheen !== false) {
    const sheen = linear(toLight, awayFromLight, [
      [0, '#FFFFFF', 0.18],
      [0.5, '#FFFFFF', 0],
      [1, '#000000', 0.08],
    ]);
    svg += `<path d="${topPath}" fill="${sheen}"/>`;
  }
  svg += '</g>';
  if (look.edge) svg += `<path d="${topPath}" fill="none" stroke="${look.edge}" stroke-opacity="0.35" stroke-width="0.8"/>`;
  return { depth: nearness(fr.origin), svg, top, topPath };
}

/** The ellipse an ellipsoid with these world semi-axes shows on screen. */
function screenEllipse(axes) {
  const cols = axes.map((a) => [a[0], a[2] * SIN_E - a[1] * COS_E]);
  const p = cols.reduce((s, c) => s + c[0] * c[0], 0);
  const r = cols.reduce((s, c) => s + c[1] * c[1], 0);
  const q = cols.reduce((s, c) => s + c[0] * c[1], 0);
  const mid = (p + r) / 2;
  const spread = Math.sqrt(((p - r) / 2) ** 2 + q * q);
  const angle = 0.5 * Math.atan2(2 * q, p - r);
  return { radii: [Math.sqrt(mid + spread), Math.sqrt(Math.max(mid - spread, 0.01))], angle: (angle * 180) / Math.PI };
}
/** The point of an ellipsoid whose normal is closest to dir. */
function pointFacing(axes, dir) {
  const m = axes.map((a) => dot(a, dir));
  const l = Math.hypot(...m) || 1;
  return add(...axes.map((a, i) => scale(a, m[i] / l)));
}
const toLocal = (pt, center, { radii, angle }) => {
  const dx = pt[0] - center[0];
  const dy = pt[1] - center[1];
  const a = rad(-angle);
  const x = dx * Math.cos(a) - dy * Math.sin(a);
  const y = dx * Math.sin(a) + dy * Math.cos(a);
  const v = [x / radii[0], y / radii[1]];
  const l = Math.hypot(...v);
  return l > 0.82 ? [(v[0] * 0.82) / l, (v[1] * 0.82) / l] : v;
};

/**
 * A rounded piece: the ellipsoid with semi-axes a, b, c along the frame's u, v and w, or with
 * half: true only its w side (a dome standing on the frame).
 * look: { colors: [light, dark], gloss, shine (size), shadow: false | {...}, rimLight, matte,
 *         decorate(api) => svg clipped to the outline }
 */
export function blob(origin, fr, [a, b, c], look, { half = false } = {}) {
  const axes = [scale(fr.u, a), scale(fr.v, b), scale(fr.w, c)];
  const samples = [];
  const rings = 18;
  for (let j = 0; j <= rings; j++) {
    const lat = half ? (Math.PI / 2) * (j / rings) : -Math.PI / 2 + (Math.PI * j) / rings;
    for (let i = 0; i < 64; i++) {
      const lon = (2 * Math.PI * i) / 64;
      const P = add(fr.origin, scale(axes[0], Math.cos(lat) * Math.cos(lon)), scale(axes[1], Math.cos(lat) * Math.sin(lon)), scale(axes[2], Math.sin(lat)));
      samples.push(project(origin, P));
    }
  }
  const outline = hull(samples);
  const d = pathOf(outline);
  const center = project(origin, fr.origin);
  const ellipse = screenEllipse(axes);
  const lit = project(origin, add(fr.origin, pointFacing(axes, LIGHT_W)));
  const shine = project(origin, add(fr.origin, pointFacing(axes, HALF_W)));
  const fill = radial({ center, radii: ellipse.radii, angle: ellipse.angle, focus: toLocal(lit, center, ellipse) }, [
    [0, tone(look.colors, 1)],
    [0.45, tone(look.colors, 0.82)],
    [0.8, tone(look.colors, 0.42)],
    [0.95, tone(look.colors, look.matte ? 0.22 : 0.16)],
    [1, tone(look.colors, look.rimLight ?? 0.3)],
  ]);
  let svg = '';
  const box = bounds(outline);
  const size = Math.max(box[2] - box[0], box[3] - box[1]);
  if (look.shadow !== false) svg += softShadow(d, box, { blur: clamp(size * 0.05, 1.5, 6), ...look.shadow });
  svg += `<path d="${d}" fill="${fill}"/>`;
  if (look.decorate) svg += `<g clip-path="${clipTo(d)}">${look.decorate({ outline, center, ellipse, fr, origin, box })}</g>`;
  if (look.gloss) {
    const [ra, rb] = ellipse.radii;
    const s = look.shine ?? 0.22;
    const g = [ra * s, rb * s * 0.7];
    const r = Math.max(...g);
    svg += `<ellipse cx="${n(shine[0])}" cy="${n(shine[1])}" rx="${n(g[0])}" ry="${n(g[1])}" transform="rotate(${n(ellipse.angle - 20)} ${n(shine[0])} ${n(shine[1])})" fill="#FFFFFF" fill-opacity="${look.gloss}" filter="${blur(clamp(Math.min(ra, rb) * s * 0.35, 0.4, 4), [shine[0] - r, shine[1] - r, shine[0] + r, shine[1] + r])}"/>`;
  }
  return { depth: nearness(fr.origin), svg, outline, d, box };
}

/**
 * The rounded underside of a flat-topped piece (a halved egg or avocado): its outline shrinking
 * as it bulges depth below the frame. Returns the screen outline; draw the cut face over it.
 */
export function underside(origin, fr, outline, depth) {
  const samples = [];
  for (let j = 0; j <= 12; j++) {
    const lat = (Math.PI / 2) * (j / 12);
    const s = Math.cos(lat);
    for (const [p, q] of outline) samples.push(project(origin, fr.at(p * s, q * s, -depth * Math.sin(lat))));
  }
  return hull(samples);
}

/** Draw pieces back to front. */
export const inOrder = (pieces) =>
  pieces
    .filter(Boolean)
    .sort((a, b) => a.depth - b.depth)
    .map((p) => p.svg)
    .join('\n');

// ---------- heaps of food over an opening ----------
/** A dome over an opening of world radius rx, rising to height (world units) at its centre. */
export function heap(rx, height) {
  const A = rx;
  const H = height;
  const y = (X, Z) => H * Math.sqrt(Math.max(0, 1 - (X * X + Z * Z) / (A * A)));
  const normal = (X, Z) => norm([X / (A * A), Math.max(y(X, Z), 0.5) / (H * H), Z / (A * A)]);
  // Seen from the camera, the dome's top edge over X = x is the point at Z = zTop(1 - x²/A²).
  const m = (A * SIN_E) / (H * COS_E);
  const zTop = (k) => -A * m * Math.sqrt(k / (1 + m * m));
  const drop = (X, Z) => Z * SIN_E - y(X, Z) * COS_E;

  /** The surface point seen at a screen point, or undefined where the heap is not. */
  function hit(origin, sx, sy) {
    const X = sx - origin[0];
    const k = 1 - (X * X) / (A * A);
    if (k <= 0) return undefined;
    const ty = sy - origin[1];
    const zMax = A * Math.sqrt(k);
    if (ty > drop(X, zMax) || ty < drop(X, zTop(k))) return undefined;
    let lo = zTop(k);
    let hi = zMax;
    for (let i = 0; i < 28; i++) {
      const mid = (lo + hi) / 2;
      if (drop(X, mid) < ty) lo = mid;
      else hi = mid;
    }
    const Z = (lo + hi) / 2;
    const point = [X, y(X, Z), Z];
    return { point, normal: normal(X, Z), screen: [sx, sy], depth: nearness(point), rise: point[1] / H };
  }

  return {
    rx,
    height,
    y,
    normal,
    hit,
    /** The surface point over (X, Z), raised along its normal. */
    at: (X, Z, lift = 0) => add([X, y(X, Z), Z], scale(normal(X, Z), lift)),
    /** Random visible points, evenly spread on screen and sorted back to front. */
    scatter(origin, rand, count) {
      const top = origin[1] + drop(0, zTop(1));
      const points = [];
      for (let tries = 0; points.length < count && tries < count * 40; tries++) {
        const p = hit(origin, rand.range(origin[0] - A, origin[0] + A), rand.range(top, origin[1] + A * SIN_E));
        if (p) points.push(p);
      }
      return points.sort((a, b) => a.depth - b.depth);
    },
    /** The heap's screen outline: its top edge, then the front of the opening. */
    outline(origin, steps = 72) {
      const top = [];
      const bottom = [];
      for (let i = 0; i <= steps; i++) {
        const X = -A + (2 * A * i) / steps;
        const k = Math.max(0, 1 - (X * X) / (A * A));
        top.push([origin[0] + X, origin[1] + drop(X, zTop(k))]);
        bottom.push([origin[0] + X, origin[1] + A * Math.sqrt(k) * SIN_E]);
      }
      return `M${pts([...top, ...bottom.reverse()])}Z`;
    },
  };
}

// ---------- templates ----------
/** The vessel template with the drawing in its contents group. */
export function inTemplate(vessel, description, contents) {
  let svg = fs.readFileSync(path.join(TEMPLATES, vessel.template), 'utf8');
  svg = svg.replace(/<!--[\s\S]*?-->\n/, () => `<!-- ${description}. Drawn by scripts/blog-art in _templates/${vessel.template}. -->\n`);
  svg = svg.replace(/<g id="contents">[\s\S]*?<\/g>\n {2}<\/defs>/, () => `<g id="contents">\n${defsSvg()}\n${contents}\n    </g>\n  </defs>`);
  return svg;
}
