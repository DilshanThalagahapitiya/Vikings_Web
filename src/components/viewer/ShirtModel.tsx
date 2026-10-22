import { Suspense, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { PLACEMENT_BY_ID } from '../../config/placements';
import { SIZE_SCALE } from '../../config/app';
import { buildShirt } from '../../lib/shirtGeometry';
import type { PlacementId, ShirtStyle } from '../../types';
import { getFabricBump } from './fabricTexture';
import { PrintDecal } from './PrintDecal';

export interface ShirtPrint {
  placement: PlacementId;
  imageUrl: string;
}

interface Props {
  style: ShirtStyle;
  size: string;
  color: string;
  trimColor?: string;
  prints: ShirtPrint[];
}

export const sizeScale = (size: string) => SIZE_SCALE[size.toLowerCase()] ?? 1;

/** Procedural 3D T-shirt (regular / oversize / collar) with printed designs. */
export function ShirtModel({ style, size, color, trimColor, prints }: Props) {
  const geo = useMemo(() => buildShirt(style, sizeScale(size)), [style, size]);
  const [body, setBody] = useState<THREE.Mesh | null>(null);

  useEffect(
    () => () => {
      geo.body.dispose();
      geo.neck.dispose();
      geo.collar?.dispose();
      geo.sleeves.forEach((s) => s.dispose());
    },
    [geo],
  );

  const bump = useMemo(() => getFabricBump(), []);
  const trim = trimColor ?? color;

  const fabric = (
    <meshStandardMaterial
      color={color}
      roughness={0.92}
      bumpMap={bump}
      bumpScale={0.6}
      side={THREE.DoubleSide}
    />
  );

  return (
    <group>
      <mesh ref={setBody} geometry={geo.body} castShadow>
        {fabric}
      </mesh>
      {geo.sleeves.map((g, i) => (
        <mesh key={i} geometry={g} castShadow>
          {fabric}
        </mesh>
      ))}
      <mesh geometry={geo.neck}>
        <meshStandardMaterial color={trim} roughness={0.95} />
      </mesh>
      {geo.collar && (
        <mesh geometry={geo.collar}>
          <meshStandardMaterial color={trim} roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
      )}
      {geo.buttons?.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.008, 16, 16]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.3} />
        </mesh>
      ))}
      {body &&
        prints.map((p) => (
          <Suspense key={`${p.placement}-${style}-${size}`} fallback={null}>
            <PrintDecal
              body={body}
              dims={geo.dims}
              placement={PLACEMENT_BY_ID[p.placement]}
              imageUrl={p.imageUrl}
            />
          </Suspense>
        ))}
    </group>
  );
}
