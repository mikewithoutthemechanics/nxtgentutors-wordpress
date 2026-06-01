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
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/messages?conversationId=${active}`);
        const json = await res.json();
        if (!cancelled) setMessages(json.messages || []);
      } catch {}
    }
    load();
    return () => { cancelled = true; };
  }, [active]);

  const send = async () => {
    if (!active || !draft.trim()) return;
    const body = { senderId: 1, receiverId: active, body: draft.trim() };
    try {
      const res = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const json = await res.json();
      setMessages((prev) => [...prev, json.message || { ...body, id: `local_${Date.now()}`, created_at: new Date().toISOString() }]);
      setDraft('');
    } catch {}
  };

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
                <button key={c.id} onClick={() => { setActive(c.id); setMessages([]); }} style={{ width: '100%', textAlign: 'left', padding: '16px 18px', background: active === c.id ? 'rgba(99,102,241,0.08)' : 'transparent', border: 'none', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '4px' }}>{c.lastMessage}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: '6px' }}>{c.time}</div>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '18px' }}>
              {!active ? (
                <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 'auto' }}>Select a conversation to view the thread.</div>
              ) : (
                <>
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                    {messages.length === 0 && (
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>No messages yet. Start the conversation.</div>
                    )}
                    {messages.map((m) => (
                      <div key={m.id} style={{ padding: '10px 14px', borderRadius: '12px', background: (m.sender_id || m.senderId) === 1 ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.05)', alignSelf: (m.sender_id || m.senderId) === 1 ? 'flex-start' : 'flex-end', maxWidth: '75%' }}>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>{m.body || m.content || ''}</div>
                      </div>
                    ))}
                  </div>
                  <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder="Type a message..." style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', resize: 'vertical' }} />
                  <button className="ngt-btn ngt-btn--solid" style={{ marginTop: '8px', alignSelf: 'flex-end' }} onClick={send}>Send</button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
