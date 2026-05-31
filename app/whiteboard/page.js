'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const CollabWhiteboard = dynamic(() => import('@/components/CollabWhiteboard'), { ssr: false });

export default function WhiteboardPage() {
  return (
    <main className="ngt-main" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <section style={{ flex: 1, paddingTop: '80px', paddingBottom: '20px', display: 'flex', flexDirection: 'column' }}>
        <div className="container" style={{ maxWidth: '1400px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <motion.div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                Interactive <span style={{ color: 'var(--ngt-accent)' }}>Whiteboard</span>
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Draw, annotate, and collaborate in real-time during lessons</p>
            </div>
          </motion.div>

          <motion.div
            style={{ flex: 1, minHeight: 0 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CollabWhiteboard />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
