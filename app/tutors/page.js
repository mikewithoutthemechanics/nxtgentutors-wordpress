'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Background3D from '@/components/Background3D';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 200 }
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export default function TutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('All Subjects');

  useEffect(() => {
    async function fetchTutors() {
      setLoading(true);
      try {
        const url = subject === 'All Subjects' ? '/api/tutors' : `/api/tutors?subject=${encodeURIComponent(subject)}`;
        const res = await fetch(url);
        const data = await res.json();
        setTutors(data);
      } catch (err) {
        console.error('Failed to fetch tutors:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTutors();
  }, [subject]);

  return (
    <main className="app-container" style={{ minHeight: '100vh', position: 'relative' }}>
      <Background3D />
      
      <Navbar />

      <section className="hero" style={{ minHeight: 'auto', paddingTop: '160px', paddingBottom: '80px' }}>
        <div className="container">
          <motion.div 
            className="section-header" 
            style={{ textAlign: 'center', marginBottom: '60px' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span 
              style={{ 
                color: 'var(--ngt-accent)', 
                fontSize: '0.8rem', 
                fontWeight: '700', 
                textTransform: 'uppercase', 
                letterSpacing: '0.2em',
                marginBottom: '16px',
                display: 'block'
              }}
            >
              Expert Learning
            </motion.span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '20px', letterSpacing: '-0.04em' }}>
              Find Your Perfect <span style={{ color: 'var(--ngt-accent)', position: 'relative' }}>
                Tutor
                <motion.span 
                  style={{ position: 'absolute', bottom: '0', left: 0, width: '100%', height: '4px', background: 'var(--ngt-accent)', borderRadius: '2px' }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>
            </h1>
            <p className="section-desc" style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--ngt-text-secondary)', fontSize: '1.1rem' }}>
              Browse through our verified experts and start your learning journey with South Africa's top-rated educators.
            </p>
          </motion.div>

          {/* Filters Bar */}
          <motion.div 
            className="ngt-cta-block" 
            style={{ padding: '32px', marginBottom: '60px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-end', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div style={{ flex: '1', minWidth: '240px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--ngt-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Subject</label>
              <select 
                style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', border: '1px solid var(--ngt-border)', color: 'white', background: 'rgba(255,255,255,0.05)', outline: 'none', cursor: 'pointer' }}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option style={{ background: '#111' }}>All Subjects</option>
                <option style={{ background: '#111' }}>Mathematics</option>
                <option style={{ background: '#111' }}>Physics</option>
                <option style={{ background: '#111' }}>English</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="btn btn-outline" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>Advanced Filters</div>
            </div>
          </motion.div>

          {/* Tutor Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <div style={{ width: '48px', height: '48px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--ngt-accent)', borderRadius: '50%', margin: '0 auto' }}></div>
              </motion.div>
              <p style={{ marginTop: '20px', color: 'var(--ngt-text-tertiary)', fontSize: '0.9rem' }}>Finding the best matches...</p>
            </div>
          ) : (
            <motion.div 
              className="ngt-bento"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {tutors.map((tutor) => (
                  <motion.div 
                    key={tutor.id} 
                    className="ngt-testimonial" 
                    style={{ padding: '0', overflow: 'hidden', height: 'auto', border: '1px solid var(--ngt-border)' }}
                    variants={cardVariants}
                    layout
                    whileHover={{ y: -8, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)', borderColor: 'var(--ngt-accent)' }}
                  >
                    <div style={{ position: 'relative', height: '240px' }}>
                      <img 
                        src={tutor.image} 
                        alt={tutor.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.3)' }}>
                        ⭐ {tutor.rating} ({tutor.reviews})
                      </div>
                    </div>

                    <div style={{ padding: '28px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: '0', fontSize: '1.4rem', fontWeight: '800' }}>{tutor.name}</h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--ngt-text-tertiary)', fontWeight: '600' }}>{tutor.sessions} sessions</div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                        {tutor.subjects.map(s => (
                          <span key={s} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(99,102,241,0.1)', color: 'var(--ngt-accent)', fontWeight: '700' }}>
                            {s}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', color: 'var(--ngt-text-tertiary)', fontSize: '0.85rem' }}>
                        <span>📍 {tutor.province}</span>
                        <span>•</span>
                        <span>🎓 {tutor.grade}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--ngt-border)' }}>
                        <div>
                          <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white' }}>R{tutor.rate}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--ngt-text-tertiary)' }}>/hr</span>
                        </div>
                        <Link href={`/booking/${tutor.id}`} className="ngt-btn ngt-btn--solid" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
