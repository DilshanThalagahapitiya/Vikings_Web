import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { CameraRig, type ViewRequest } from './CameraRig';
import { ShirtModel } from './ShirtModel';

type ShirtProps = Parameters<typeof ShirtModel>[0];

interface Props extends ShirtProps {
  view: ViewRequest;
  autoRotate?: boolean;
}

/** Reusable 3D stage: lights, orbit controls, shadow and the shirt. */
export function ShirtCanvas({ view, autoRotate = false, ...shirt }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0.08, 1.9], fov: 34 }}
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
    >
      <ambientLight intensity={1.4} />
      <hemisphereLight args={['#ffffff', '#9ca3af', 0.7]} />
      <directionalLight position={[1.5, 2.5, 3]} intensity={1.6} />
      <directionalLight position={[-2, 1, -3]} intensity={1.8} />
      <Suspense fallback={null}>
        <ShirtModel {...shirt} />
      </Suspense>
      <ContactShadows position={[0, -0.4, 0]} opacity={0.35} scale={2} blur={2.6} far={0.8} />
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={0.7}
        maxDistance={2.6}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.75}
        autoRotate={autoRotate}
        autoRotateSpeed={2.5}
      />
      <CameraRig view={view} />
    </Canvas>
  );
}
