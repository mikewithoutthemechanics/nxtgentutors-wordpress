'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import Link from 'next/link';

const JitsiMeeting = dynamic(() => import('@/components/JitsiMeeting'), { ssr: false });
const CollabWhiteboard = dynamic(() => import('@/components/CollabWhiteboard'), { ssr: false });

export default function VideoSessionPage() {
  const [inSession, setInSession] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  const startSession = (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    setInSession(true);
  };

  if (inSession) {
    return (
      <main className="ngt-main" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          padding: '12px 24px',
          background: 'rgba(10,10,10,0.95)',
          borderBottom: '1px solid var(--ngt-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              NextGen<span style={{ color: 'var(--ngt-accent)' }}>Tutors</span>
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Live Session: {roomName}</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="ngt-btn ngt-btn--ghost"
              style={{ padding: '8px 20px', fontSize: '0.85rem' }}
              onClick={() => setShowWhiteboard(!showWhiteboard)}
            >
              {showWhiteboard ? 'Hide Whiteboard' : 'Open Whiteboard'}
            </button>
            <Link href="/study-planner" className="ngt-btn ngt-btn--ghost" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
              Study Planner
            </Link>
            <button
              className="ngt-btn ngt-btn--solid"
              style={{ padding: '8px 20px', fontSize: '0.85rem', background: '#f43f5e', color: 'white' }}
              onClick={() => setInSession(false)}
            >
              End Session
            </button>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <div style={{ flex: showWhiteboard ? '1' : '1', minHeight: '500px' }}>
            <JitsiMeeting
              roomName={roomName}
              displayName={displayName || 'NextGen User'}
              onClose={() => setInSession(false)}
            />
          </div>
          {showWhiteboard && (
            <motion.div
              style={{ width: '50%', borderLeft: '1px solid var(--ngt-border)', minHeight: '500px' }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '50%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
            >
              <CollabWhiteboard />
            </motion.div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="ngt-main" style={{ minHeight: '100vh' }}>
      <Navbar />

      <section style={{ paddingTop: '160px', paddingBottom: '80px' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <motion.div
            style={{ textAlign: 'center', marginBottom: '48px' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Video <span style={{ color: 'var(--ngt-accent)' }}>Session</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem' }}>
              Join or create a live tutoring session with HD video, screen sharing, and an integrated whiteboard.
            </p>
          </motion.div>

          <motion.form
            onSubmit={startSession}
            style={{
              padding: '40px',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Session Room Name</label>
              <input
                required
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g. maths-grade12-calculus"
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '1rem', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Your Display Name</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. David M."
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '1rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px', borderRadius: '12px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>🎥</span>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>HD Video</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>🖥️</span>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>Screen Share</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>✏️</span>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>Whiteboard</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>🔴</span>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>Recording</p>
              </div>
            </div>

            <button type="submit" className="ngt-btn ngt-btn--solid" style={{ padding: '16px', fontSize: '1.05rem', fontWeight: 700 }}>
              Join Session
            </button>
          </motion.form>
        </div>
      </section>
    </main>
  );
}
