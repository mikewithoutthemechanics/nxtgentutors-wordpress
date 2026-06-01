'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function MessagesPage() {
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Dr. Sarah K.', lastMessage: 'See you tomorrow at 14:00!', time: '14:22' },
    { id: 2, name: 'David M.', lastMessage: 'Great session today.', time: '11:05' },
    { id: 3, name: 'Naledi K.', lastMessage: 'Can we reschedule?', time: 'Yesterday' },
  ]);
  const [active, setActive] = useState(null);
  const [draft, setDraft] = useState('');

  return (
    <main className="ngt-main" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <section style={{ flex: 1, paddingTop: '120px', paddingBottom: '40px' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '4px' }}>Messages</motion.h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '18px' }}>Chat between learners and tutors.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', overflow: 'hidden', minHeight: '520px' }}>
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              {conversations.map((c) => (
                <button key={c.id} onClick={() => setActive(c.id)} style={{ width: '100%', textAlign: 'left', padding: '16px 18px', background: active === c.id ? 'rgba(99,102,241,0.08)' : 'transparent', border: 'none', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '4px' }}>{c.lastMessage}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: '6px' }}>{c.time}</div>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '18px' }}>
              <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 'auto' }}>Select a conversation to view the thread.</div>
              {active ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', alignSelf: 'flex-start' }}>Hey, do we have time on Thursday?</div>
                  <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', alignSelf: 'flex-end' }}>Thursday works. After 4pm?</div>
                  <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', alignSelf: 'flex-start' }}>Perfect, booked.</div>
                  <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder="Type a message..." style={{ marginTop: '8px', padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }} />
                  <div>
                    <button className="ngt-btn ngt-btn--solid" style={{ marginTop: '8px' }}>Send</button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
