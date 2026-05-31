'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Background3D from '@/components/Background3D';
import { motion } from 'framer-motion';

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function TutorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard?role=tutor');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to fetch tutor dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Background3D />
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
        </motion.div>
      </main>
    );
  }

  const stats = data?.stats || {};
  const nextSession = data?.nextSession || null;

  return (
    <main className="app-container">
      <Background3D />
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <Navbar />

      <section className="hero" style={{ minHeight: 'auto', paddingTop: '140px' }}>
        <div className="container">
          <motion.div 
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="hero-title" style={{ fontSize: '2.5rem', margin: 0 }}>
              Tutor <span className="text-gradient">Dashboard</span>
            </h1>
            <div className="badge">Status: Verified</div>
          </motion.div>

          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} whileHover={{ y: -5, scale: 1.02 }} className="glass" style={{ padding: '24px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Monthly Earnings</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.earnings || 'R0'}</h2>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ y: -5, scale: 1.02 }} className="glass" style={{ padding: '24px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Sessions Completed</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.sessionsCompleted || 0}</h2>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ y: -5, scale: 1.02 }} className="glass" style={{ padding: '24px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Average Rating</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.avgRating || 0}/5.0</h2>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ y: -5, scale: 1.02 }} className="glass" style={{ padding: '24px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Active Students</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.activeStudents || 0}</h2>
            </motion.div>
          </motion.div>

          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="glass" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0 }}>Upcoming Schedule</h3>
                <button className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>View Calendar</button>
              </div>
              {nextSession ? (
                <motion.div 
                  className="glass" 
                  style={{ padding: '24px', background: 'rgba(79, 70, 229, 0.1)', border: '1px solid var(--primary)', marginBottom: '16px' }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{nextSession.subject}</h4>
                      <p style={{ color: 'var(--text-muted)' }}>With Student {nextSession.student} • {nextSession.time}</p>
                    </div>
                    <a href={nextSession.joinUrl} className="btn btn-primary">Start Session</a>
                  </div>
                </motion.div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No sessions scheduled for today.</p>
              )}
            </div>

            <div className="glass" style={{ padding: '32px' }}>
              <h3 style={{ marginBottom: '24px' }}>Recent Feedback</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
                  <div style={{ color: '#FBBF24', fontSize: '0.9rem', marginBottom: '4px' }}>⭐⭐⭐⭐⭐</div>
                  <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>"Excellent tutor, explained algebra perfectly!"</p>
                </div>
                <div>
                  <div style={{ color: '#FBBF24', fontSize: '0.9rem', marginBottom: '4px' }}>⭐⭐⭐⭐⭐</div>
                  <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>"Very patient and knowledgeable."</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
