'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, MeshDistortMaterial, Line, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function HieroglyphicSymbols() {
  const symbols = ['𓀀', '𓀁', '𓀂', '𓀃', '𓀄', '𓀅', '𓀆', '𓀇', '𓀈', '𓀉'];
  return (
    <group>
      {symbols.map((sym, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2}>
          <Text
            position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, -5]}
            fontSize={0.8}
            color="#6366f1"
            opacity={0.3}
            transparent
          >
            {sym}
          </Text>
        </Float>
      ))}
    </group>
  );
}

function DeterministicNode({ position, color, label }) {
  return (
    <group position={position}>
      <mesh>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={color} wireframe />
      </mesh>
      <Text position={[0, -0.8, 0]} fontSize={0.3} color="white">{label}</Text>
    </group>
  );
}

function MoneyFlow() {
  const points = useMemo(() => [
    new THREE.Vector3(-4, 2, -2), // Treasury
    new THREE.Vector3(-2, 0, -1),
    new THREE.Vector3(0, -2, 0),
    new THREE.Vector3(2, 0, 1),
    new THREE.Vector3(4, 2, 2)  // "Where it went"
  ], []);

  const lineRef = useRef();

  useFrame((state) => {
    lineRef.current.material.dashOffset -= 0.01;
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color="#ec4899"
      lineWidth={2}
      dashed
      dashScale={50}
      dashSize={1}
      dashGap={0.5}
    />
  );
}

function TreasuryArchitecture() {
  return (
    <group>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[0, 0, -2]}>
          <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
          <MeshDistortMaterial
            color="#a855f7"
            speed={2}
            distort={0.4}
            wireframe
          />
        </mesh>
      </Float>

      <DeterministicNode position={[-4, 2, -2]} color="#6366f1" label="Treasury SA" />
      <DeterministicNode position={[4, 2, 2]} color="#f43f5e" label="Offshore Accounts" />
      
      <MoneyFlow />
      <HieroglyphicSymbols />
      <Sparkles count={100} scale={10} size={2} speed={0.5} color="#6366f1" />
    </group>
  );
}

export default function TreasuryScene() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <TreasuryArchitecture />
      </Canvas>
    </div>
  );
}
