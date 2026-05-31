'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Background3D from '@/components/Background3D';
import { motion } from 'framer-motion';

const Whiteboard = dynamic(() => import('@/components/CollabWhiteboard'), { ssr: false });

export default function AIEduStudio() {
  const [mode, setMode] = useState('whiteboard'); // whiteboard | questions | notes
  const containerRef = useRef(null);

  return (
    <main className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Background3D />
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      <Navbar />

      <section style={{ flex: 1, padding: '140px 24px 60px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '8px' }}>AI Edu Studio</h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '720px', marginBottom: '24px' }}>
              Explore concepts visually, generate guided questions, and build shared study notes with AI assistance.
              Designed for tutors and students to make lessons interactive.
            </p>
          </motion.div>

          <motion.div
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {['whiteboard', 'questions', 'notes'].map((item) => (
              <button
                key={item}
                onClick={() => setMode(item)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: mode === item ? '1px solid var(--ngt-accent)' : '1px solid var(--ngt-border)',
                  background: mode === item ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                  color: 'white',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {item}
              </button>
            ))}
          </motion.div>

          <motion.div
            className="glass"
            style={{ padding: '24px', minHeight: '520px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {mode === 'whiteboard' && <Whiteboard />}

            {mode === 'questions' && (
              <div>
                <h2 style={{ marginBottom: '12px' }}>AI Generated Questions</h2>
                <p style={{ color: 'var(--text-muted)' }}>
                  Coming next: topic-based question bank with difficulty levels and worked solutions.
                </p>
              </div>
            )}

            {mode === 'notes' && (
              <div>
                <h2 style={{ marginBottom: '12px' }}>Live Study Notes</h2>
                <p style={{ color: 'var(--text-muted)' }}>
                  Coming next: tutor-guided notes with auto-summaries and exportable lesson packs.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
