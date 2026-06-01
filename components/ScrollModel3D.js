'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

function ScrollDrivenModel() {
  const meshRef = useRef(null);
  const groupRef = useRef(null);
  const { size, viewport } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;
    const scrollProgress = Math.min(Math.max(state.viewportHeight ? 0 : 0, 1), 1);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, scrollProgress * Math.PI * 2, 0.1);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, scrollProgress * 0.9, 0.1);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, Math.sin(scrollProgress * Math.PI) * 0.2, 0.1);
  });

  const isMobile = size.width < 768;

  const model = useMemo(() => {
    const group = new THREE.Group();
    const baseMat = new THREE.MeshStandardMaterial({ color: '#818cf8', metalness: 0.25, roughness: 0.35 });
    const accentMat = new THREE.MeshStandardMaterial({ color: '#22d3ee', metalness: 0.2, roughness: 0.4 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.14, 1.05, 2, 1, 2), baseMat);
    base.position.y = -0.3;
    base.castShadow = false;
    group.add(base);

    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, 1.0), accentMat);
    spine.position.set(0, 0.05, 0);
    spine.castShadow = false;
    group.add(spine);

    const pageLeft = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.9), new THREE.MeshStandardMaterial({ color: '#eef2ff', metalness: 0.05, roughness: 0.9 }));
    pageLeft.rotation.y = -0.25;
    pageLeft.position.set(-0.22, 0.05, 0.02);
    pageLeft.castShadow = false;
    group.add(pageLeft);

    const pageRight = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.9), new THREE.MeshStandardMaterial({ color: '#eef2ff', metalness: 0.05, roughness: 0.9 }));
    pageRight.rotation.y = 0.25;
    pageRight.position.set(0.22, 0.05, 0.02);
    pageRight.castShadow = false;
    group.add(pageRight);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.04, 16, 40), accentMat);
    ring.position.y = 0.42;
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = false;
    group.add(ring);

    group.position.set(0, -0.05, 0);
    return group;
  }, []);

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={model} ref={meshRef} />
    </group>
  );
}

export default function ScrollModel3D() {
  const containerStyle = {
    position: 'sticky',
    top: '110px',
    height: '520px',
    width: '100%',
  };

  return (
    <div style={containerStyle}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[2, 2, 2]} intensity={2} />
        <ScrollDrivenModel />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}
