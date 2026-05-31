'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import AdvancedBackground from '@/components/AdvancedBackground';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        const role = data.user?.role;
        // In a real app, we'd save the token and user data in context or localStorage
        if (role === 'administrator') {
          window.location.href = '/dashboard/admin';
        } else if (role === 'tutor') {
          window.location.href = '/dashboard/tutor';
        } else {
          window.location.href = '/dashboard/student';
        }
      } else {
        alert(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      alert('Error during login. System may be offline.');
    }
    setLoading(false);
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
            maxWidth: '440px', 
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
              Welcome Back
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1rem' }}>Enter your credentials to access your portal</p>
          </div>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@admin.com" 
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  color: 'white', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '12px', 
                  outline: 'none',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease',
                }} 
                onFocus={(e) => e.target.style.borderColor = 'rgba(168, 85, 247, 0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  color: 'white', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '12px', 
                  outline: 'none',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease',
                }} 
                onFocus={(e) => e.target.style.borderColor = 'rgba(168, 85, 247, 0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px', borderRadius: '4px', accentColor: '#a855f7' }} />
                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Keep me signed in</span>
              </label>
              <a href="#" style={{ color: '#a855f7', fontWeight: '500', textDecoration: 'none' }}>Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn" 
              style={{ 
                width: '100%', 
                padding: '16px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
                color: 'white', 
                fontWeight: '700', 
                fontSize: '1.1rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 10px 20px -5px rgba(168, 85, 247, 0.4)',
                marginTop: '12px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 15px 25px -5px rgba(168, 85, 247, 0.5)')}
              onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 10px 20px -5px rgba(168, 85, 247, 0.4)')}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '1rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '32px' }}>
            New to NextGen? <a href="/register" style={{ color: 'white', fontWeight: '700', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Create an account</a>
          </p>
        </motion.div>
      </section>
    </main>
  );
}
