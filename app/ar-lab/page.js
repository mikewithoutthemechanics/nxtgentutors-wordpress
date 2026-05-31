'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const ARSubjectLab = dynamic(() => import('@/components/ARSubjectLab'), { ssr: false });

export default function ARLabPage() {
  return (
    <main className="ngt-main" style={{ minHeight: '100vh' }}>
      <Navbar />

      <section style={{ paddingTop: '100px', paddingBottom: '40px' }}>
        <div className="container" style={{ maxWidth: '1400px' }}>
          <motion.div
            style={{ textAlign: 'center', marginBottom: '40px' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#a855f7',
              background: 'rgba(168,85,247,0.12)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              Exclusive Feature
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
              AR Subject <span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Laboratory</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Explore 3D scientific models in augmented reality. Rotate, zoom, and interact with atoms, DNA, geometry, and more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ARSubjectLab />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
