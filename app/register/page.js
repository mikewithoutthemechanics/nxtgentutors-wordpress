'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import AdvancedBackground from '@/components/AdvancedBackground';
import { motion, AnimatePresence } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function Register() {
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to /api/auth
    setTimeout(() => {
      setLoading(false);
      window.location.href = role === 'student' ? '/dashboard/student' : '/dashboard/tutor';
    }, 1500);
  };

  return (
    <main className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'white' }}>
      <AdvancedBackground />
      
      <Navbar />

      <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '140px 24px 60px', position: 'relative', zIndex: 1 }}>
        <motion.div 
          className="glass"
          style={{ 
            width: '100%', 
            maxWidth: '540px', 
            padding: '48px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            background: 'rgba(10, 10, 20, 0.4)',
            backdropFilter: 'blur(20px)'
          }}
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '12px', background: 'linear-gradient(135deg, #fff 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Join NextGen
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1rem' }}>Elevate your learning experience today</p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button 
              onClick={() => setRole('student')}
              style={{ 
                flex: 1, 
                padding: '12px', 
                borderRadius: '12px', 
                border: 'none', 
                background: role === 'student' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                color: role === 'student' ? 'white' : 'rgba(255,255,255,0.5)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: role === 'student' ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid transparent'
              }}
            >Student</button>
            <button 
              onClick={() => setRole('tutor')}
              style={{ 
                flex: 1, 
                padding: '12px', 
                borderRadius: '12px', 
                border: 'none', 
                background: role === 'tutor' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                color: role === 'tutor' ? 'white' : 'rgba(255,255,255,0.5)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: role === 'tutor' ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid transparent'
              }}
            >Tutor</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>First Name</label>
                <input required type="text" placeholder="John" style={{ width: '100%', padding: '14px', color: 'white', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', outline: 'none' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Name</label>
                <input required type="text" placeholder="Doe" style={{ width: '100%', padding: '14px', color: 'white', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', outline: 'none' }} />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
              <input required type="email" placeholder="you@example.com" style={{ width: '100%', padding: '14px', color: 'white', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', outline: 'none' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              <input required type="password" placeholder="••••••••" style={{ width: '100%', padding: '14px', color: 'white', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', outline: 'none' }} />
            </div>

            <AnimatePresence>
              {role === 'tutor' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identification Document (PDF/JPG)</label>
                    <input required type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ width: '100%', padding: '12px', color: 'rgba(255,255,255,0.5)', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Academic Qualifications / CV</label>
                    <input required type="file" accept=".pdf,.doc,.docx" style={{ width: '100%', padding: '12px', color: 'rgba(255,255,255,0.5)', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', outline: 'none' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading} 
              style={{ 
                width: '100%', 
                padding: '16px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', 
                color: 'white', 
                fontWeight: '700', 
                fontSize: '1.1rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 10px 20px -5px rgba(236, 72, 153, 0.3)',
                marginTop: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 15px 25px -5px rgba(236, 72, 153, 0.4)')}
              onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 10px 20px -5px rgba(236, 72, 153, 0.3)')}
            >
              {loading ? 'Creating Account...' : 'Get Started'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '1rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '32px' }}>
            Already have an account? <a href="/login" style={{ color: 'white', fontWeight: '700', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Sign in here</a>
          </p>
        </motion.div>
      </section>
    </main>
  );
}
