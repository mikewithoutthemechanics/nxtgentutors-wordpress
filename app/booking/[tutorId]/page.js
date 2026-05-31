'use client';

import { use, useState } from 'react';
import Navbar from '@/components/Navbar';
import Background3D from '@/components/Background3D';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function BookingPage({ params }) {
  const tutorId = use(params).tutorId;
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payfast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 475,
          itemName: 'Tutoring Session (1hr)',
          tutorId,
          sessionType: '1hr_session',
        }),
      });
      const data = await res.json();
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert('Checkout failed. Please try again.');
      }
    } catch {
      alert('Error initiating checkout.');
    }
    setLoading(false);
  };

  return (
    <main className="app-container" style={{ minHeight: '100vh' }}>
      <Background3D />
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <Navbar />

      <section style={{ paddingTop: '140px', paddingBottom: '60px' }}>
        <div className="container">
          <motion.div 
            style={{ marginBottom: '40px' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="hero-title" style={{ fontSize: '2.5rem', margin: 0 }}>
              Book <span className="text-gradient">Session</span>
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Schedule a lesson with your selected tutor.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            
            {/* Booking Form */}
            <motion.div 
              className="glass" 
              style={{ padding: '32px' }}
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <h3 style={{ marginBottom: '24px' }}>Session Details</h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Select Subject</label>
                  <select className="glass" style={{ width: '100%', padding: '12px', color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', outline: 'none' }}>
                    <option>Mathematics</option>
                    <option>Physics</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Date</label>
                    <input type="date" className="glass" style={{ width: '100%', padding: '12px', color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', outline: 'none' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Time</label>
                    <input type="time" className="glass" style={{ width: '100%', padding: '12px', color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', outline: 'none' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Notes for Tutor</label>
                  <textarea rows="4" placeholder="What would you like to focus on?" className="glass" style={{ width: '100%', padding: '12px', color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', outline: 'none' }}></textarea>
                </div>

                <button type="button" onClick={handleBooking} disabled={loading} className="btn btn-primary" style={{ marginTop: '8px' }}>
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </form>
            </motion.div>

            {/* Summary */}
            <motion.div 
              className="glass" 
              style={{ padding: '32px', height: 'fit-content' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 style={{ marginBottom: '24px' }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
                <span>Tutor Rate (1hr)</span>
                <span>R450.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
                <span>Platform Fee</span>
                <span>R25.00</span>
              </div>
              <div style={{ height: '1px', background: 'var(--glass-border)', margin: '16px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                <span>Total</span>
                <span className="text-gradient">R475.00</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '16px', textAlign: 'center' }}>Payments are processed securely via PayFast.</p>
            </motion.div>

          </div>
        </div>
      </section>
    </main>
  );
}
