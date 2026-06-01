'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const pages = [
  {
    title: 'AI Matching',
    tag: 'Intelligence',
    body: 'Our algorithm finds your ideal tutor based on learning style, goals, and schedule — not just availability.',
    accent: '#818cf8',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
  },
  {
    title: 'Live Sessions',
    tag: 'Experience',
    body: 'HD video, screen sharing, and a shared whiteboard — private tutoring redefined for the digital era.',
    accent: '#60a5fa',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  },
  {
    title: 'Smart Notes',
    tag: 'Technology',
    body: 'AI generates structured revision notes from every session automatically. Study smarter, not longer.',
    accent: '#4ade80',
    gradient: 'linear-gradient(135deg, #1b2a1b 0%, #14532d 100%)',
  },
  {
    title: 'Progress Analytics',
    tag: 'Insights',
    body: 'Real-time dashboards for students and parents tracking every milestone and improvement curve.',
    accent: '#fb923c',
    gradient: 'linear-gradient(135deg, #2a1a1a 0%, #431407 100%)',
  },
  {
    title: 'Session Replays',
    tag: 'Learning',
    body: 'Every lesson is stored in a personal library for unlimited playback and revision when it matters.',
    accent: '#e879f9',
    gradient: 'linear-gradient(135deg, #2a1a2a 0%, #4a1942 100%)',
  },
];

export default function FeatureMagazine() {
  const [page, setPage] = useState(0);
  const current = pages[page];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px 60px' }}>
      <div style={{ position: 'relative', aspectRatio: '16 / 9', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ rotateY: -28, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 28, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22, mass: 0.8 }}
            style={{ position: 'absolute', inset: 0, background: current.gradient, padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backfaceVisibility: 'hidden', perspective: '1200px' }}
          >
            <div>
              <span style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, color: current.accent, background: `${current.accent}22`, border: `1px solid ${current.accent}44`, marginBottom: '18px' }}>{current.tag}</span>
              <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em' }}>{current.title}</h3>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.72)', maxWidth: '520px', lineHeight: 1.55, fontSize: '1.05rem' }}>{current.body}</p>
          </motion.div>
        </AnimatePresence>

        <div style={{ position: 'absolute', right: '14px', bottom: '14px', display: 'flex', gap: '10px' }}>
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>← Prev</button>
          <button onClick={() => setPage((p) => Math.min(pages.length - 1, p + 1))} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>Next →</button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '18px' }}>
        {pages.map((item, idx) => (
          <button key={item.title} onClick={() => setPage(idx)} style={{ width: idx === page ? '28px' : '10px', height: '10px', borderRadius: '999px', background: idx === page ? item.accent : 'rgba(255,255,255,0.18)', border: 'none' }} />
        ))}
      </div>
    </div>
  );
}
