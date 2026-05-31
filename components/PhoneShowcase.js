'use client';

import { useRef, useState, useMemo, Suspense, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { Html, useGLTF, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const features = [
  {
    tag: "Core Feature",
    title: "AI-Powered Tutor Matching",
    desc: "Our algorithm analyses your learning style, academic goals, and schedule to match you with the perfect tutor.",
    color: "#6366f1",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
  },
  {
    tag: "Analytics",
    title: "Progress Dashboard",
    desc: "Track marks, attendance, and growth with real-time analytics visible to students and parents alike.",
    color: "#a855f7",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  },
  {
    tag: "Payments",
    title: "Secure Checkout",
    desc: "PayFast-integrated transactions with automated tutor payouts and full billing history.",
    color: "#ec4899",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80"
  },
  {
    tag: "Learning",
    title: "Session Recordings",
    desc: "Every lesson is recorded and stored in your personal LMS for unlimited revision access.",
    color: "#06b6d4",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
  },
  {
    tag: "Platform",
    title: "Learn From Any Device",
    desc: "High-performance video sessions optimised for South African bandwidth. Classroom adapts to you.",
    color: "#10b981",
    image: "https://images.unsplash.com/photo-1512428559083-a4979b20916e?auto=format&fit=crop&w=800&q=80"
  }
];

function Model({ scrollProgress, activeIndex, onIndexChange, ...props }) {
  const group = useRef();
  // Use the local asset we just downloaded
  const modelPath = '/iphone.glb';
  const { scene } = useGLTF(modelPath);
  
  const rotationY = useTransform(scrollProgress, [0, 1], [-Math.PI * 0.1, Math.PI * 0.1]);
  const rotationX = useTransform(scrollProgress, [0, 1], [0.1, -0.1]);
  const scale = useTransform(scrollProgress, [0, 0.2, 0.8, 1], [1.2, 1.5, 1.5, 1.2]);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = rotationY.get();
      group.current.rotation.x = rotationX.get();
      group.current.scale.setScalar(scale.get());
    }
    
    const progress = scrollProgress.get();
    const newIndex = Math.min(
      Math.floor(progress * features.length),
      features.length - 1
    );
    if (newIndex !== activeIndex) {
      onIndexChange(newIndex);
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* Rendering the loaded scene primitive */}
      <primitive object={scene} scale={20} position={[0, -3, 0]} />
      
      {/* Absolute positioned screen overlay for the HTML content */}
      {/* We'll place it slightly in front of where the phone screen usually is */}
      <mesh position={[0, 0, 0.2]}>
         <planeGeometry args={[2.8, 5.8]} />
         <meshStandardMaterial transparent opacity={0} />
         <Html
          transform
          distanceFactor={1.1}
          position={[0, 0, 0.05]}
          style={{
            width: '300px',
            height: '620px',
            background: '#000',
            borderRadius: '40px',
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', background: '#0a0a0a' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ width: '100%', height: '100%' }}
              >
                <div style={{ width: '100%', height: '40%', position: 'relative', overflow: 'hidden' }}>
                   <img 
                    src={features[activeIndex].image} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', background: `linear-gradient(to top, #0a0a0a, transparent)` }} />
                </div>
                
                <div style={{ padding: '32px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      fontSize: '10px', 
                      color: features[activeIndex].color, 
                      fontWeight: '800', 
                      textTransform: 'uppercase', 
                      letterSpacing: '2px',
                      marginBottom: '16px'
                    }}
                  >
                    {features[activeIndex].tag}
                  </motion.span>
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ fontSize: '22px', color: 'white', marginBottom: '16px', lineHeight: 1.2, fontWeight: 800 }}
                  >
                    {features[activeIndex].title}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}
                  >
                    {features[activeIndex].desc}
                  </motion.p>
                </div>

                <div style={{ position: 'absolute', bottom: '30px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  {features.map((_, i) => (
                    <div key={i} style={{ width: i === activeIndex ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === activeIndex ? features[activeIndex].color : 'rgba(255,255,255,0.2)', transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)' }} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Html>
      </mesh>
    </group>
  );
}

// Simple Error Boundary for 3D content
class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div style={{ color: 'white', textAlign: 'center', background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p>3D Model could not be loaded.</p>
            <button onClick={() => window.location.reload()} style={{ color: 'var(--ngt-accent)', background: 'none', border: '1px solid var(--ngt-accent)', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
              Retry
            </button>
          </div>
        </Html>
      );
    }
    return this.props.children;
  }
}

export default function PhoneShowcase() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section ref={containerRef} style={{ height: '500vh', position: 'relative', background: '#050505' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        
        {/* Left Side: Dynamic Text */}
        <div style={{ flex: 1, padding: '0 10%', zIndex: 10, pointerEvents: 'none' }}>
          <div style={{ maxWidth: '450px' }}>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              style={{ color: 'var(--ngt-accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.8rem', marginBottom: '20px', display: 'block' }}
            >
              Excellence Driven
            </motion.span>
            <motion.h2 
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '32px', color: 'white' }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              Built for <span style={{ color: 'var(--ngt-accent)' }}>serious</span> students.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ color: 'var(--ngt-text-secondary)', fontSize: '1.25rem', lineHeight: 1.6, fontWeight: 400 }}
            >
              Every feature is designed to maximise your academic potential through intelligent technology and high-performance engineering.
            </motion.p>
          </div>
        </div>

        {/* Center: 3D Phone */}
        <div style={{ flex: 1.5, height: '100%', position: 'relative' }}>
          <Canvas shadows camera={{ position: [0, 0, 15], fov: 35 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#6366f1" />
            <Suspense fallback={
              <Html center>
                <div style={{ 
                  color: 'white', 
                  whiteSpace: 'nowrap', 
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.2em',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px'
                }}>
                  <div className="loader-ring" style={{ width: '40px', height: '40px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--ngt-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Initializing 3D Core
                </div>
                <style>{`
                  @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
              </Html>
            }>
              <SceneErrorBoundary>
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                  <Model scrollProgress={scrollYProgress} activeIndex={activeIndex} onIndexChange={setActiveIndex} />
                </Float>
              </SceneErrorBoundary>
              <Environment preset="city" />
              <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
            </Suspense>
          </Canvas>
        </div>

        {/* Right Side: Step Counter */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', padding: '0 10%', zIndex: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <motion.div 
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ position: 'relative', zIndex: 1 }}
            >
               <span style={{ fontSize: '0.8rem', fontWeight: 800, color: features[activeIndex].color, textTransform: 'uppercase', letterSpacing: '0.25em' }}>
                 {features[activeIndex].tag}
               </span>
               <div style={{ fontSize: '6rem', fontWeight: 900, color: 'white', opacity: 0.05, lineHeight: 1, marginTop: '10px' }}>
                 0{activeIndex + 1}
               </div>
               <div style={{ width: '240px', height: '2px', background: 'rgba(255,255,255,0.05)', marginTop: '24px', overflow: 'hidden', marginLeft: 'auto' }}>
                 <motion.div 
                   style={{ height: '100%', background: features[activeIndex].color }}
                   animate={{ width: `${((activeIndex + 1) / features.length) * 100}%` }}
                   transition={{ type: 'spring', damping: 20 }}
                 />
               </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
