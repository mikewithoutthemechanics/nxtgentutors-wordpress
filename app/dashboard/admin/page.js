'use client';

import { useState, useEffect } from 'react';
import Background3D from '@/components/Background3D';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard?role=admin');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to fetch admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
        </motion.div>
      </main>
    );
  }

  const stats = data?.stats || {};
  const systemHealth = data?.systemHealth || {};

  return (
    <main className="app-container">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-3"></div>
      </div>

      <Navbar />

      <section className="hero" style={{ minHeight: 'auto', paddingTop: '140px', paddingBottom: '60px' }}>
        <div className="container">
          <motion.div 
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="hero-title" style={{ fontSize: '2.5rem', margin: 0 }}>
              System <span className="text-gradient">Admin</span>
            </h1>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn btn-danger">Process Payouts</button>
              <button className="btn btn-secondary">System Settings</button>
            </div>
          </motion.div>

          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} whileHover={{ y: -5, scale: 1.02 }} className="glass" style={{ padding: '24px', borderTop: '4px solid var(--primary)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Monthly Revenue</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.monthlyRevenue || 'R0'}</h2>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ y: -5, scale: 1.02 }} className="glass" style={{ padding: '24px', borderTop: '4px solid var(--secondary)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Active Users</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.activeUsers || 0}</h2>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ y: -5, scale: 1.02 }} className="glass" style={{ padding: '24px', borderTop: '4px solid #F59E0B' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Avg Satisfaction</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.avgSatisfaction || '0%'}</h2>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ y: -5, scale: 1.02 }} className="glass" style={{ padding: '24px', borderTop: '4px solid #10B981' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Active Tutors</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.activeTutors || 0}</h2>
            </motion.div>
          </motion.div>

          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="glass" style={{ padding: '32px' }}>
              <h3 style={{ marginBottom: '24px' }}>System Health: <span style={{ color: systemHealth.status === 'Optimal' ? '#10B981' : '#F59E0B' }}>{systemHealth.status || 'Unknown'}</span></h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div className="glass" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '8px' }}>Pending Verification</span>
                    <h4 style={{ margin: '4px 0' }}>Tutor Applications</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{systemHealth.pendingVerifications || 0} applications waiting for review.</p>
                  </div>
                  <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>Review All</button>
                </div>
                
                <div className="glass" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '8px' }}>Disputes</span>
                    <h4 style={{ margin: '4px 0' }}>Active Disputes</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{systemHealth.activeDisputes || 0} open disputes.</p>
                  </div>
                  <button className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>View Details</button>
                </div>
              </div>
            </div>

            <div className="glass" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0 }}>Automation & Workflow Configuration</h3>
                <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>Save Changes</button>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Manage the core triggers and automated workflows for student and tutor journeys.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div className="glass" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Pre-Session Reminders</h4>
                    <label className="switch" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                      <span style={{ marginLeft: '8px', fontSize: '0.85rem' }}>Active</span>
                    </label>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trigger: 24h before session.<br/>Action: Sends SMS & Email calendar invite to Parent and Student.</p>
                </div>

                <div className="glass" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Post-Session Feedback</h4>
                    <label className="switch" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                      <span style={{ marginLeft: '8px', fontSize: '0.85rem' }}>Active</span>
                    </label>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trigger: 2h after session ends.<br/>Action: Emails student requesting a 1-5 star rating & review.</p>
                </div>

                <div className="glass" style={{ padding: '20px', borderLeft: '4px solid var(--secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Tutor Performance Alert</h4>
                    <label className="switch" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--secondary)' }} />
                      <span style={{ marginLeft: '8px', fontSize: '0.85rem' }}>Active</span>
                    </label>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trigger: Average rating drops &lt; 4.0.<br/>Action: Sends warning email to tutor and flags for admin review.</p>
                </div>

                <div className="glass" style={{ padding: '20px', borderLeft: '4px solid #10B981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Milestone Badge Allocation</h4>
                    <label className="switch" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#10B981' }} />
                      <span style={{ marginLeft: '8px', fontSize: '0.85rem' }}>Active</span>
                    </label>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trigger: Tutor reaches 50+ reviews or Student reaches 25 sessions.<br/>Action: Auto-awards 'Popular' or 'Scholar' badges.</p>
                </div>

                <div className="glass" style={{ padding: '20px', borderLeft: '4px solid #F59E0B' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Automated Payouts</h4>
                    <label className="switch" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#F59E0B' }} />
                      <span style={{ marginLeft: '8px', fontSize: '0.85rem' }}>Active</span>
                    </label>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trigger: 1st of every month at 2:00 AM.<br/>Action: Calculates net earnings (fees & penalties) and queues EFT.</p>
                </div>

                <div className="glass" style={{ padding: '20px', borderLeft: '4px solid #F59E0B' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Parent Re-engagement</h4>
                    <label className="switch" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#F59E0B' }} />
                      <span style={{ marginLeft: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Inactive</span>
                    </label>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trigger: No bookings in 60 days.<br/>Action: FluentCRM sends "We miss you" email with a 15% discount code.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
