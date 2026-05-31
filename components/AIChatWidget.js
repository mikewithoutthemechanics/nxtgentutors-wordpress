'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI study assistant powered by NextGen Tutors. Ask me anything about Maths, Science, English, or any subject — I'm here to help you succeed!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('General');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].filter((m) => m.role !== 'system'),
          subject,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || 'Sorry, I could not process that.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    }
    setLoading(false);
  };

  const subjects = ['General', 'Mathematics', 'Physics', 'Chemistry', 'English', 'Biology', 'Accounting'];

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        className="ai-chat-trigger"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Tutor Chat"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="ai-chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="ai-chat-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>AI Study Assistant</h3>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Powered by Groq &bull; Always ready to help</span>
              </div>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {subjects.map((s) => (
                  <option key={s} value={s} style={{ background: '#1a1a2e' }}>{s}</option>
                ))}
              </select>
            </div>

            <div className="ai-chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`ai-chat-msg ai-chat-msg--${msg.role}`}>
                  {msg.role === 'assistant' && <div className="ai-chat-avatar">AI</div>}
                  <div className="ai-chat-bubble">{msg.content}</div>
                </div>
              ))}
              {loading && (
                <div className="ai-chat-msg ai-chat-msg--assistant">
                  <div className="ai-chat-avatar">AI</div>
                  <div className="ai-chat-bubble ai-chat-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form
              className="ai-chat-input-bar"
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
