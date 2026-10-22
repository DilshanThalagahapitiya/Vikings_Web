import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three/addons/controls/OrbitControls.js';

export interface ViewRequest {
  /** Azimuth in radians: 0 = front, PI = back. */
  angle: number;
  /** Changes on every request so repeating the same view still animates. */
  nonce: number;
}

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** Smoothly orbits the camera to the requested view. */
export function CameraRig({ view }: { view: ViewRequest }) {
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;
  const camera = useThree((s) => s.camera);
  const goal = useRef<number | null>(null);

  useEffect(() => {
    goal.current = view.angle;
  }, [view]);

  useFrame((_, delta) => {
    if (goal.current === null) return;
    const { x, y, z } = camera.position;
    const radius = Math.hypot(x, z);
    const current = Math.atan2(x, z);
    const diff = wrap(goal.current - current);
    if (Math.abs(diff) < 0.004) {
      goal.current = null;
      return;
    }
    const next = current + diff * Math.min(1, delta * 7);
    camera.position.set(Math.sin(next) * radius, y, Math.cos(next) * radius);
    controls?.update();
  });

  return null;
}
