import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { ShirtStyle } from '../types';

/** Procedural T-shirt geometry (metres). Front faces +Z, wearer's left is +X. */

export interface ShirtDims {
  chestHalf: number;
  hemHalf: number;
  shoulderHalf: number;
  shoulderDrop: number;
  depthChest: number;
  depthHem: number;
  length: number;
  /** Extra drop for the front-middle print so it clears the placket. */
  frontPrintDrop: number;
  neckHalf: number;
  neckDrop: number;
  sleeveLength: number;
  sleeveAngle: number;
  sleeveStartX: number;
  sleeveStartDrop: number;
  sleeveRadiusStart: { z: number; w: number };
  sleeveRadiusEnd: { z: number; w: number };
}

const REGULAR: ShirtDims = {
  chestHalf: 0.262,
  hemHalf: 0.255,
  shoulderHalf: 0.225,
  shoulderDrop: 0.045,
  depthChest: 0.112,
  depthHem: 0.105,
  length: 0.7,
  frontPrintDrop: 0,
  neckHalf: 0.095,
  neckDrop: 0.07,
  sleeveLength: 0.2,
  sleeveAngle: THREE.MathUtils.degToRad(35),
  sleeveStartX: 0.2,
  sleeveStartDrop: 0.125,
  sleeveRadiusStart: { z: 0.085, w: 0.085 },
  sleeveRadiusEnd: { z: 0.075, w: 0.085 },
};

const BASE_DIMS: Record<ShirtStyle, ShirtDims> = {
  regular: REGULAR,
  collar: { ...REGULAR, neckHalf: 0.1, neckDrop: 0.045, length: 0.72, frontPrintDrop: 0.06 },
  oversize: {
    ...REGULAR,
    chestHalf: 0.335,
    hemHalf: 0.335,
    shoulderHalf: 0.3,
    shoulderDrop: 0.085,
    depthChest: 0.13,
    depthHem: 0.125,
    length: 0.76,
    neckHalf: 0.105,
    sleeveLength: 0.27,
    sleeveAngle: THREE.MathUtils.degToRad(42),
    sleeveStartX: 0.27,
    sleeveStartDrop: 0.17,
    sleeveRadiusStart: { z: 0.1, w: 0.1 },
    sleeveRadiusEnd: { z: 0.11, w: 0.125 },
  },
};

/** Vertical shift so the shirt is centred on the origin. */
const Y_OFFSET = -0.36;

export function shirtDims(style: ShirtStyle, scale: number): ShirtDims {
  const d = BASE_DIMS[style];
  const w = scale;
  const h = Math.pow(scale, 0.6);
  return {
    ...d,
    chestHalf: d.chestHalf * w,
    hemHalf: d.hemHalf * w,
    shoulderHalf: d.shoulderHalf * w,
    depthChest: d.depthChest * w,
    depthHem: d.depthHem * w,
    length: d.length * h,
    sleeveLength: d.sleeveLength * w,
    sleeveStartX: d.sleeveStartX * w,
  };
}

/** World-space Y of the shoulder line (neck edge). */
export const shoulderY = (d: ShirtDims) => d.length + Y_OFFSET;

const SEGMENTS = 72;
const RINGS = 56;
const SUPER_EXP = 2.6;

function superEllipse(theta: number, hw: number, hd: number): [number, number] {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const p = 2 / SUPER_EXP;
  return [hw * Math.sign(c) * Math.abs(c) ** p, hd * Math.sign(s) * Math.abs(s) ** p];
}

function finishGeometry(positions: number[], uvs: number[], index: number[]) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

/** Builds a closed-around tube from ring generator; averages seam normals. */
function ringTube(
  rings: number,
  ringPoint: (ring: number, seg: number) => THREE.Vector3,
  uvRepeat: [number, number] = [6, 4],
) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const index: number[] = [];
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s <= SEGMENTS; s++) {
      const p = ringPoint(r, s % SEGMENTS);
      positions.push(p.x, p.y, p.z);
      uvs.push((s / SEGMENTS) * uvRepeat[0], (r / (rings - 1)) * uvRepeat[1]);
    }
  }
  const stride = SEGMENTS + 1;
  for (let r = 0; r < rings - 1; r++) {
    for (let s = 0; s < SEGMENTS; s++) {
      const a = r * stride + s;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      index.push(a, b, c, b, d, c);
    }
  }
  const g = finishGeometry(positions, uvs, index);
  const n = g.getAttribute('normal') as THREE.BufferAttribute;
  for (let r = 0; r < rings; r++) {
    const first = r * stride;
    const last = first + SEGMENTS;
    const v = new THREE.Vector3(
      n.getX(first) + n.getX(last),
      n.getY(first) + n.getY(last),
      n.getZ(first) + n.getZ(last),
    ).normalize();
    n.setXYZ(first, v.x, v.y, v.z);
    n.setXYZ(last, v.x, v.y, v.z);
  }
  return g;
}

function ruledSurface(a: THREE.Vector3[], b: THREE.Vector3[]) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const index: number[] = [];
  a.forEach((p, i) => {
    positions.push(p.x, p.y, p.z, b[i].x, b[i].y, b[i].z);
    const u = i / (a.length - 1);
    uvs.push(u, 0, u, 1);
  });
  for (let i = 0; i < a.length - 1; i++) {
    const k = i * 2;
    index.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
  }
  return finishGeometry(positions, uvs, index);
}

export interface ShirtGeometries {
  dims: ShirtDims;
  body: THREE.BufferGeometry;
  sleeves: THREE.BufferGeometry[];
  /** Neck rib (crew) – always present. */
  neck: THREE.BufferGeometry;
  /** Polo collar flaps, band, placket – collar style only. */
  collar?: THREE.BufferGeometry;
  buttons?: THREE.Vector3[];
}

export function buildShirt(style: ShirtStyle, scale: number): ShirtGeometries {
  const d = shirtDims(style, scale);
  const L = d.length;

  const profile = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(d.hemHalf, 0, d.depthHem),
      new THREE.Vector3(d.hemHalf + (d.chestHalf - d.hemHalf) * 0.5, L * 0.3, (d.depthHem + d.depthChest) / 2),
      new THREE.Vector3(d.chestHalf, L - 0.24, d.depthChest),
      new THREE.Vector3(d.chestHalf * 0.955, L - 0.12, d.depthChest * 0.94),
      new THREE.Vector3(d.shoulderHalf, L - d.shoulderDrop, d.depthChest * 0.78),
      new THREE.Vector3((d.shoulderHalf + d.neckHalf) / 2, L - d.shoulderDrop * 0.3, d.depthChest * 0.72),
      new THREE.Vector3(d.neckHalf, L, d.depthChest * 0.7),
    ],
    false,
    'centripetal',
  );
  // Param by y: sample densely, then resample to evenly spaced rings.
  const samples = profile.getSpacedPoints(RINGS - 1);

  const topY = L;
  const neckBlend = 0.1;
  const neckRing: THREE.Vector3[] = [];
  const centreLine: THREE.Vector3[] = [];

  const body = ringTube(RINGS, (r, s) => {
    const { x: hw, y, z: hd } = samples[r];
    const [x, z] = superEllipse((s / SEGMENTS) * Math.PI * 2, hw, hd);
    let yy = y;
    const t = Math.max(0, (y - (topY - neckBlend)) / neckBlend);
    if (t > 0) {
      const f = z / hd;
      yy -= (z > 0 ? d.neckDrop : 0.012) * t * Math.abs(f) ** 1.5;
    }
    const v = new THREE.Vector3(x, yy + Y_OFFSET, z);
    if (r === RINGS - 1) neckRing[s] = v.clone();
    if (s === SEGMENTS / 4) centreLine.push(v.clone());
    return v;
  });
  neckRing.push(neckRing[0].clone());

  const sleeves = ([1, -1] as const).map((side) => {
    const start = new THREE.Vector3(side * d.sleeveStartX, L - d.sleeveStartDrop + Y_OFFSET, 0);
    const dir = new THREE.Vector3(side * Math.cos(d.sleeveAngle), -Math.sin(d.sleeveAngle), 0);
    const e1 = new THREE.Vector3(0, 0, 1);
    const e2 = new THREE.Vector3().crossVectors(dir, e1).normalize();
    const rings = 14;
    const sIn = -0.07;
    return ringTube(
      rings,
      (r, seg) => {
        const k = r / (rings - 1);
        const dist = sIn + (d.sleeveLength - sIn) * k;
        const kk = Math.max(0, dist) / d.sleeveLength;
        const rz = THREE.MathUtils.lerp(d.sleeveRadiusStart.z, d.sleeveRadiusEnd.z, kk);
        const rw = THREE.MathUtils.lerp(d.sleeveRadiusStart.w, d.sleeveRadiusEnd.w, kk);
        const phi = (seg / SEGMENTS) * Math.PI * 2;
        const [a, b] = superEllipse(phi, rz, rw);
        return start.clone().addScaledVector(dir, dist).addScaledVector(e1, a).addScaledVector(e2, b);
      },
      [4, 1.5],
    );
  });

  const neck = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(neckRing, true, 'centripetal'),
    SEGMENTS * 2,
    0.0085,
    8,
    true,
  );

  const result: ShirtGeometries = { dims: d, body, sleeves, neck };

  if (style === 'collar') {
    const ring = neckRing.slice(0, SEGMENTS);
    const parts: THREE.BufferGeometry[] = [];
    const bandTop = ring.map((p) => p.clone().add(new THREE.Vector3(0, 0.028, 0)).multiply(new THREE.Vector3(1.04, 1, 1.06)));
    const bandBottom = ring.map((p) => p.clone());
    parts.push(ruledSurface([...bandBottom, bandBottom[0]], [...bandTop, bandTop[0]]));

    // Two flaps folded over the chest, leaving a gap at the front centre for the placket.
    const gap = 0.07 * Math.PI;
    const ranges: [number, number][] = [
      [gap, Math.PI / 2 - gap],
      [Math.PI / 2 + gap, Math.PI - gap],
    ];
    for (const [t0, t1] of ranges) {
      const a: THREE.Vector3[] = [];
      const b: THREE.Vector3[] = [];
      const n = 14;
      for (let i = 0; i <= n; i++) {
        const theta = THREE.MathUtils.lerp(t0, t1, i / n);
        const idx = Math.round((theta / (Math.PI * 2)) * SEGMENTS) % SEGMENTS;
        const inner = bandTop[idx];
        const [fx, fz] = [Math.cos(theta), Math.sin(theta)];
        const reach = 0.07 + 0.03 * Math.sin((i / n) * Math.PI) ;
        a.push(inner.clone());
        b.push(inner.clone().add(new THREE.Vector3(fx * 0.045, -reach, fz * 0.065 + 0.02)));
      }
      parts.push(ruledSurface(a, b));
    }

    // Placket strip following the front-centre line of the body.
    const line = centreLine.filter((p) => p.y > topY + Y_OFFSET - 0.2);
    const edge = (x: number) => line.map((p) => new THREE.Vector3(x, p.y, p.z + 0.003));
    parts.push(ruledSurface(edge(-0.018), edge(0.018)));
    result.collar = mergeGeometries(parts, false)!;
    const at = (dy: number) => {
      const y = topY + Y_OFFSET - dy;
      const p = line.reduce((best, q) => (Math.abs(q.y - y) < Math.abs(best.y - y) ? q : best));
      return new THREE.Vector3(0, y, p.z + 0.008);
    };
    result.buttons = [0.075, 0.125].map(at);
  }

  return result;
}
