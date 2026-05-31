'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import * as random from 'maath/random/dist/maath-random.esm';

function FloatingOrbs() {
  return (
    <group>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 32, 32]} position={[-3, 2, -5]}>
          <MeshDistortMaterial
            color="#6366f1"
            speed={2}
            distort={0.4}
            radius={1}
          />
        </Sphere>
      </Float>
      <Float speed={2} rotationIntensity={2} floatIntensity={4}>
        <Sphere args={[1.5, 32, 32]} position={[4, -2, -6]}>
          <MeshDistortMaterial
            color="#a855f7"
            speed={1.5}
            distort={0.5}
            radius={1}
          />
        </Sphere>
      </Float>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[0.8, 32, 32]} position={[0, -3, -4]}>
          <MeshDistortMaterial
            color="#ec4899"
            speed={3}
            distort={0.3}
            radius={1}
          />
        </Sphere>
      </Float>
    </group>
  );
}

function StarField(props) {
  const ref = useRef();
  const [sphere] = useMemo(() => [random.inSphere(new Float32Array(5000), { radius: 1.5 })], []);
  
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function AdvancedBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, background: '#030014', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <FloatingOrbs />
        <StarField />
      </Canvas>
    </div>
  );
}
