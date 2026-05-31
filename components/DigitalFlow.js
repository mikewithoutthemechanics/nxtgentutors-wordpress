'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import * as random from 'maath/random/dist/maath-random.esm';

function WaveScene() {
  const ref = useRef();
  const [sphere] = useMemo(() => [random.inSphere(new Float32Array(5000), { radius: 1.5 })], []);
  
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#818cf8"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[2, 1, -2]}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial color="#6366f1" speed={2} distort={0.3} radius={1} />
        </mesh>
      </Float>
      <Float speed={3} rotationIntensity={2} floatIntensity={4}>
        <mesh position={[-3, -2, -3]}>
          <icosahedronGeometry args={[1.5, 1]} />
          <MeshDistortMaterial color="#a855f7" speed={1.5} distort={0.5} radius={1} />
        </mesh>
      </Float>
    </group>
  );
}

export default function DigitalFlow() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <WaveScene />
      </Canvas>
    </div>
  );
}
