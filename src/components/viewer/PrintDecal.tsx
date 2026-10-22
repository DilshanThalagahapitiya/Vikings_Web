import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import { PRINT_BOX, type PlacementConfig } from '../../config/placements';
import type { PrintSize } from '../../types';
import { shoulderY, type ShirtDims } from '../../lib/shirtGeometry';

interface Props {
  body: THREE.Mesh;
  dims: ShirtDims;
  placement: PlacementConfig;
  printSize: PrintSize;
  imageUrl: string;
}

const REFERENCE_CHEST_HALF = 0.262;
const ray = new THREE.Raycaster();

/** A design projected onto the front or back panel of the shirt body. */
export function PrintDecal({ body, dims, placement, printSize, imageUrl }: Props) {
  const texture = useTexture(imageUrl, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
  });

  const geometry = useMemo(() => {
    const image = texture.image as { width: number; height: number };
    const aspect = image.width / image.height;
    const k = dims.chestHalf / REFERENCE_CHEST_HALF;
    const maxW = PRINT_BOX[printSize].width * k;
    const maxH = PRINT_BOX[printSize].height * k;
    const width = aspect >= maxW / maxH ? maxW : maxH * aspect;
    const height = width / aspect;

    const dir = placement.side === 'front' ? 1 : -1;
    const x = placement.anchor.x * k;
    const extraDrop = placement.id === 'front-middle' ? dims.frontPrintDrop : 0;
    const y = shoulderY(dims) - placement.anchor.drop * k - extraDrop;

    body.updateMatrixWorld(true);
    ray.set(new THREE.Vector3(x, y, dir * 2), new THREE.Vector3(0, 0, -dir));
    const hit = ray.intersectObject(body)[0];
    if (!hit) return null;

    const orientation = new THREE.Euler(0, dir > 0 ? 0 : Math.PI, 0);
    return new DecalGeometry(body, hit.point, orientation, new THREE.Vector3(width, height, 0.14));
  }, [texture, body, dims, placement, printSize]);

  if (!geometry) return null;
  return (
    <mesh geometry={geometry} renderOrder={2}>
      <meshStandardMaterial
        map={texture}
        transparent
        roughness={0.6}
        metalness={0}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
