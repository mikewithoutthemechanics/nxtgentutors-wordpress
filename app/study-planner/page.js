'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudyPlannerPage() {
  const [subject, setSubject] = useState('Mathematics');
  const [level, setLevel] = useState('Grade 12');
  const [weakAreas, setWeakAreas] = useState('');
  const [hours, setHours] = useState(5);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, level, weakAreas, hoursPerWeek: hours }),
      });
      const data = await res.json();
      setPlan(data.plan);
    } catch {
      alert('Failed to generate study plan. Please try again.');
    }
    setLoading(false);
  };

  const subjects = ['Mathematics', 'Physical Sciences', 'Chemistry', 'English', 'Life Sciences', 'Accounting', 'Computer Science', 'Geography'];
  const levels = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'University Year 1', 'University Year 2'];
  const weekColors = ['#6366f1', '#a855f7', '#22d3ee', '#10b981'];

  return (
    <main className="ngt-main" style={{ minHeight: '100vh' }}>
      <Navbar />

      <section style={{ paddingTop: '120px', paddingBottom: '60px' }}>
        <div className="container">
          <motion.div
            style={{ textAlign: 'center', marginBottom: '48px' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#22d3ee', background: 'rgba(34,211,238,0.1)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>AI-Powered</span>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Smart Study <span style={{ color: 'var(--ngt-accent)' }}>Planner</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '600px', margin: '0 auto' }}>
              Our AI analyses your subject, level, and weak areas to create a personalized 4-week study plan aligned to the South African CAPS curriculum.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: plan ? '380px 1fr' : '1fr', gap: '32px', maxWidth: plan ? '1200px' : '500px', margin: '0 auto' }}>
            <motion.form
              onSubmit={generatePlan}
              style={{ padding: '32px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Subject</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none' }}>
                  {subjects.map((s) => <option key={s} value={s} style={{ background: '#111' }}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Level</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none' }}>
                  {levels.map((l) => <option key={l} value={l} style={{ background: '#111' }}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Weak Areas (optional)</label>
                <textarea value={weakAreas} onChange={(e) => setWeakAreas(e.target.value)} placeholder="e.g. Integration, probability, geometry proofs..." rows={3} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none', resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Hours per Week: {hours}</label>
                <input type="range" min={2} max={20} value={hours} onChange={(e) => setHours(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
              <button type="submit" disabled={loading} className="ngt-btn ngt-btn--solid" style={{ padding: '14px', fontSize: '1rem', fontWeight: 700 }}>
                {loading ? 'Generating Plan...' : 'Generate Study Plan'}
              </button>
            </motion.form>

            <AnimatePresence>
              {plan && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                >
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Your Personalized Plan</h2>
                  {(plan.weeks || []).map((week, wi) => (
                    <motion.div
                      key={wi}
                      style={{ padding: '24px', borderRadius: '16px', border: `1px solid ${weekColors[wi % weekColors.length]}33`, background: `${weekColors[wi % weekColors.length]}08` }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: wi * 0.1 }}
                    >
                      <h3 style={{ color: weekColors[wi % weekColors.length], marginBottom: '16px', fontSize: '1.1rem' }}>
                        Week {week.week || wi + 1}: {week.title || `Week ${wi + 1}`}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {(week.days || []).map((day, di) => (
                          <div key={di} style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{day.day}</strong>
                            <ul style={{ margin: '8px 0 0', padding: '0 0 0 16px', listStyle: 'disc' }}>
                              {(day.tasks || []).map((task, ti) => (
                                <li key={ti} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginBottom: '4px' }}>{task}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                  {plan.note && <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>{plan.note}</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
