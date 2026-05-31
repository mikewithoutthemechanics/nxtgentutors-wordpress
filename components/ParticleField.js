'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function Stars() {
  const ref = useRef();
  const [positions] = useMemo(() => {
    const pos = random.inSphere(new Float32Array(8000), { radius: 1.8 });
    return [pos];
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 15;
    ref.current.rotation.y -= delta / 20;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#c4b5fd"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

function FloatingOrb({ position, color, speed, distort }) {
  const ref = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.5;
    ref.current.position.x = position[0] + Math.cos(t * 0.7) * 0.3;
    ref.current.rotation.x = t * 0.4;
    ref.current.rotation.z = t * 0.2;
  });

  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[distort, 1]} />
      <meshStandardMaterial
        color={color}
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

export default function ParticleField() {
  return (
    <div
      id="particle-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <Stars />
        <FloatingOrb position={[-2.5, 1.5, -3]} color="#6366f1" speed={0.5} distort={1.2} />
        <FloatingOrb position={[3, -1, -4]} color="#a855f7" speed={0.3} distort={1.8} />
        <FloatingOrb position={[0, -2.5, -5]} color="#ec4899" speed={0.4} distort={0.9} />
      </Canvas>
    </div>
  );
}
