'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import * as random from 'maath/random/dist/maath-random.esm';

function Stars() {
  const ref = useRef();
  const { pointer } = useThree();
  const [sphere] = useMemo(() => [random.inSphere(new Float32Array(5000), { radius: 1.5 })], []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
      const { x = 0, y = 0 } = pointer || {};
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x * 0.1, 0.1);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, y * 0.1, 0.1);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function Background3D() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 50%, #0d0d1a 0%, #050505 100%)' }}>
      <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: false, alpha: true }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
      </Canvas>
    </div>
  );
}
