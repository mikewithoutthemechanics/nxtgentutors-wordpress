'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const [badges, setBadges] = useState([
    { id: 'first-session', name: 'First Session', desc: 'Completed your first session.', icon: '🚀', unlocked: true },
    { id: 'reviewer', name: 'Reviewer', desc: 'Left your first review.', icon: '⭐', unlocked: true },
    { id: 'streak-3', name: '3-Day Streak', desc: 'Studied 3 days in a row.', icon: '🔥', unlocked: false },
    { id: 'planner', name: 'Planner', desc: 'Generated your first study plan.', icon: '🗓️', unlocked: false },
  ]);
  const [teams, setTeams] = useState([
    { name: 'Alpha', points: 128 },
    { name: 'Nova', points: 114 },
    { name: 'Sigma', points: 101 },
  ]);

  return (
    <main className="ngt-main" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <section style={{ flex: 1, paddingTop: '120px', paddingBottom: '40px' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '4px' }}>Achievements & Leaderboard</motion.h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '18px' }}>Track progress, unlock badges, and see team rankings.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            {badges.map((b) => (
              <div key={b.id} style={{ padding: '18px', borderRadius: '14px', background: b.unlocked ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${b.unlocked ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)'}`, opacity: b.unlocked ? 1 : 0.65 }}>
                <div style={{ fontSize: '2rem' }}>{b.icon}</div>
                <div style={{ fontWeight: 700, marginTop: '6px' }}>{b.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>{b.desc}</div>
                <div style={{ marginTop: '8px', fontSize: '0.72rem', color: b.unlocked ? '#4ade80' : 'rgba(255,255,255,0.35)' }}>{b.unlocked ? 'Unlocked' : 'Locked'}</div>
              </div>
            ))}
          </div>
          <div className="glass" style={{ padding: '22px' }}>
            <h2 style={{ marginBottom: '10px' }}>Team Leaderboard</h2>
            {teams.map((t, i) => (
              <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div><span style={{ color: 'rgba(255,255,255,0.45)', marginRight: '10px' }}>#{i + 1}</span> {t.name}</div>
                <div style={{ color: '#60a5fa' }}>{t.points} pts</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
