'use client';

import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment, Float, MeshDistortMaterial, Edges } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

function Atom({ position = [0, 0, 0], color = '#6366f1', scale = 1 }) {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.5} roughness={0.2} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[i * (Math.PI / 3), 0, 0]}>
          <torusGeometry args={[1.2, 0.02, 16, 100]} />
          <meshStandardMaterial color={color} transparent opacity={0.6} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2;
        return (
          <Float key={`e-${i}`} speed={3 + i} floatIntensity={0.5}>
            <mesh position={[Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function DNAHelix({ position = [0, 0, 0] }) {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  const pairs = 20;
  const nodes = [];
  for (let i = 0; i < pairs; i++) {
    const t = i / pairs;
    const y = (t - 0.5) * 6;
    const angle = t * Math.PI * 4;
    const r = 0.8;
    nodes.push(
      <group key={i} position={[0, y, 0]}>
        <mesh position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[-Math.cos(angle) * r, 0, -Math.sin(angle) * r]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.3} />
        </mesh>
        {i % 3 === 0 && (
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, r * 2, 8]} />
            <meshStandardMaterial color="#22d3ee" transparent opacity={0.5} />
          </mesh>
        )}
      </group>
    );
  }

  return <group ref={groupRef} position={position}>{nodes}</group>;
}

function GeometricShapes({ position = [0, 0, 0] }) {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
  });

  return (
    <group ref={groupRef} position={position}>
      <Float speed={2} floatIntensity={0.3}>
        <mesh position={[-1.5, 0.5, 0]}>
          <dodecahedronGeometry args={[0.6]} />
          <MeshDistortMaterial color="#a855f7" speed={2} distort={0.15} metalness={0.4} roughness={0.3} />
          <Edges color="#c084fc" />
        </mesh>
      </Float>
      <Float speed={1.5} floatIntensity={0.4}>
        <mesh position={[1.5, -0.3, 0]}>
          <icosahedronGeometry args={[0.7]} />
          <meshStandardMaterial color="#6366f1" wireframe transparent opacity={0.8} />
        </mesh>
      </Float>
      <Float speed={2.5} floatIntensity={0.2}>
        <mesh position={[0, 1, 1]}>
          <octahedronGeometry args={[0.5]} />
          <meshStandardMaterial color="#22d3ee" metalness={0.6} roughness={0.2} />
          <Edges color="#67e8f9" />
        </mesh>
      </Float>
      <Float speed={1} floatIntensity={0.5}>
        <mesh position={[0, -1, -0.5]}>
          <torusKnotGeometry args={[0.4, 0.12, 100, 16]} />
          <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.15} metalness={0.3} roughness={0.4} />
        </mesh>
      </Float>
    </group>
  );
}

function SolarSystem({ position = [0, 0, 0] }) {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  const planets = [
    { dist: 1.2, size: 0.12, color: '#f59e0b', speed: 3 },
    { dist: 1.8, size: 0.18, color: '#6366f1', speed: 2 },
    { dist: 2.4, size: 0.22, color: '#22d3ee', speed: 1.5 },
    { dist: 3.0, size: 0.15, color: '#f43f5e', speed: 1 },
  ];

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} />
      </mesh>
      <pointLight color="#f59e0b" intensity={2} distance={8} />
      {planets.map((p, i) => (
        <PlanetOrbit key={i} {...p} index={i} />
      ))}
    </group>
  );
}

function PlanetOrbit({ dist, size, color, speed, index }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + index * 1.5;
      ref.current.position.x = Math.cos(t) * dist;
      ref.current.position.z = Math.sin(t) * dist;
    }
  });

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[dist, 0.005, 8, 100]} />
        <meshBasicMaterial color="rgba(255,255,255,0.1)" transparent opacity={0.15} />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  );
}

function SceneLabel({ text, position }) {
  return (
    <Text position={position} fontSize={0.25} color="white" anchorX="center" anchorY="middle" font="/fonts/inter.woff" outlineWidth={0.01} outlineColor="#000000">
      {text}
    </Text>
  );
}

const MODELS = {
  atom: { label: 'Atomic Structure', subject: 'Chemistry', Component: Atom, description: 'Explore the Bohr model of an atom with electron orbits, nucleus, and energy levels.' },
  dna: { label: 'DNA Double Helix', subject: 'Biology', Component: DNAHelix, description: 'Visualize the iconic double helix structure of DNA with base pairs and sugar-phosphate backbone.' },
  geometry: { label: '3D Geometry', subject: 'Mathematics', Component: GeometricShapes, description: 'Interact with dodecahedrons, icosahedrons, octahedrons, and torus knots in 3D space.' },
  solar: { label: 'Solar System', subject: 'Physics', Component: SolarSystem, description: 'Watch planets orbit the sun with accurate relative distances and orbital speeds.' },
};

export default function ARSubjectLab() {
  const [activeModel, setActiveModel] = useState('atom');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const model = MODELS[activeModel];
  const ActiveComponent = model.Component;

  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div ref={containerRef} className="ar-lab-container">
      <div className="ar-lab-sidebar">
        <h2 className="ar-lab-title">AR Subject Lab</h2>
        <p className="ar-lab-desc">Explore 3D models of scientific concepts. Rotate, zoom, and interact to deepen your understanding.</p>

        <div className="ar-lab-models">
          {Object.entries(MODELS).map(([key, m]) => (
            <button
              key={key}
              className={`ar-lab-model-btn ${activeModel === key ? 'active' : ''}`}
              onClick={() => setActiveModel(key)}
            >
              <span className="ar-lab-model-subject">{m.subject}</span>
              <span className="ar-lab-model-label">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="ar-lab-info">
          <h3>{model.label}</h3>
          <p>{model.description}</p>
        </div>

        <div className="ar-lab-controls">
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Drag to rotate &bull; Scroll to zoom &bull; Pinch on mobile</span>
          <button className="ngt-btn ngt-btn--ghost" style={{ padding: '10px 20px', fontSize: '0.85rem', marginTop: '12px' }} onClick={toggleFullscreen}>
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>

      <div className="ar-lab-canvas">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ background: 'transparent' }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, -5, -5]} intensity={0.4} color="#6366f1" />
          <Suspense fallback={null}>
            <AnimatePresence>
              <ActiveComponent key={activeModel} />
            </AnimatePresence>
            <Environment preset="night" />
          </Suspense>
          <OrbitControls enableDamping dampingFactor={0.05} maxDistance={10} minDistance={2} />
        </Canvas>
      </div>
    </div>
  );
}
