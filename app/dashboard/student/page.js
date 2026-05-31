'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Background3D from '@/components/Background3D';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ProgressCharts = dynamic(() => import('@/components/ProgressCharts'), { ssr: false });

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard?role=student');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to fetch student dashboard:', err);
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
        <div className="blob blob-3"></div>
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
              Welcome Back, <span className="text-gradient">Student</span>
            </h1>
            <div className="badge">Status: Active</div>
          </motion.div>

          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} whileHover={{ y: -5, scale: 1.02 }} className="glass" style={{ padding: '24px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Upcoming Sessions</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.upcomingSessions || 0}</h2>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ y: -5, scale: 1.02 }} className="glass" style={{ padding: '24px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Hours</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.totalHours || 0}</h2>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ y: -5, scale: 1.02 }} className="glass" style={{ padding: '24px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Credits</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.credits || 'R0'}</h2>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ y: -5, scale: 1.02 }} className="glass" style={{ padding: '24px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Achievements</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.achievements || 0}</h2>
            </motion.div>
          </motion.div>

          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="glass" style={{ padding: '32px' }}>
              <h3 style={{ marginBottom: '24px' }}>Next Session</h3>
              {nextSession ? (
                <motion.div 
                  className="glass" 
                  style={{ padding: '24px', background: 'rgba(79, 70, 229, 0.1)', border: '1px solid var(--primary)' }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{nextSession.subject}</h4>
                      <p style={{ color: 'var(--text-muted)' }}>With {nextSession.tutor} • {nextSession.time}</p>
                    </div>
                    <a href={nextSession.joinUrl} className="btn btn-secondary">Join Session</a>
                  </div>
                </motion.div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No upcoming sessions scheduled.</p>
              )}
            </div>

            <div className="glass" style={{ padding: '32px' }}>
              <h3 style={{ marginBottom: '24px' }}>Recent Badges</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {(data?.badges || []).map((badge, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ rotate: 15, scale: 1.1 }} 
                    style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', cursor: 'pointer' }}
                  >
                    {badge}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '32px', marginBottom: '32px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/study-planner" className="glass" style={{ padding: '20px', textAlign: 'center', display: 'block', textDecoration: 'none', color: 'white', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.2)', transition: 'all 0.3s' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>🔬</span>
              <strong>Study Planner</strong>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Explore 3D models</p>
            </Link>
            <Link href="/study-planner" className="glass" style={{ padding: '20px', textAlign: 'center', display: 'block', textDecoration: 'none', color: 'white', borderRadius: '16px', border: '1px solid rgba(34,211,238,0.2)', transition: 'all 0.3s' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>📋</span>
              <strong>Study Planner</strong>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>AI-generated plans</p>
            </Link>
            <Link href="/video-session" className="glass" style={{ padding: '20px', textAlign: 'center', display: 'block', textDecoration: 'none', color: 'white', borderRadius: '16px', border: '1px solid rgba(168,85,247,0.2)', transition: 'all 0.3s' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>🎥</span>
              <strong>Video Session</strong>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Join live lesson</p>
            </Link>
            <Link href="/whiteboard" className="glass" style={{ padding: '20px', textAlign: 'center', display: 'block', textDecoration: 'none', color: 'white', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.2)', transition: 'all 0.3s' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>✏️</span>
              <strong>Whiteboard</strong>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Draw & collaborate</p>
            </Link>
          </motion.div>

          {/* Progress Charts */}
          <motion.div
            style={{ marginTop: '16px' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Progress Analytics</h2>
            <ProgressCharts />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
