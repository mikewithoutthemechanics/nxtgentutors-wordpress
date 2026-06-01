'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Background3D from '@/components/Background3D';
import { motion } from 'framer-motion';
import ScrollModel3D from '@/components/ScrollModel3D';

const Whiteboard = dynamic(() => import('@/components/CollabWhiteboard'), { ssr: false });

export default function AIEduStudio() {
  const [mode, setMode] = useState('whiteboard');
  const [aiMode, setAiMode] = useState(false);
  const [subject, setSubject] = useState('Mathematics');

  const modes = [
    { id: 'whiteboard', label: 'Whiteboard' },
    { id: 'questions', label: 'Practice Questions' },
    { id: 'notes', label: 'Study Notes' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'quiz', label: 'Quick Quiz' },
    { id: 'mathlab', label: 'Math Lab' },
  ];

  return (
    <main className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Background3D />
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      <Navbar />

      <section style={{ flex: 1, padding: '140px 24px 60px' }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '8px' }}>AI Edu Studio</h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '720px', marginBottom: '24px' }}>
              Explore concepts visually, generate guided questions, and build shared study notes with AI assistance.
              Designed for tutors and students to make lessons interactive.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(320px, 0.65fr)', gap: '28px', alignItems: 'start' }}>
            <div>
              <motion.div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                {modes.map((item) => (
                  <button key={item.id} onClick={() => setMode(item.id)} style={{ padding: '10px 18px', borderRadius: '12px', border: mode === item.id ? '1px solid var(--ngt-accent)' : '1px solid var(--ngt-border)', background: mode === item.id ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)', color: 'white', cursor: 'pointer', textTransform: 'capitalize' }}>
                    {item.label}
                  </button>
                ))}
                {mode === 'whiteboard' && (
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '0.85rem', marginLeft: '6px' }}>
                    <input type="checkbox" checked={aiMode} onChange={(e) => setAiMode(e.target.checked)} />
                    AI Mode
                  </label>
                )}
                {aiMode && mode === 'whiteboard' && (
                  <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ marginLeft: '10px', padding: '8px 10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ngt-border)', color: 'white' }}>
                    {['Mathematics', 'Physical Sciences', 'Chemistry', 'Biology', 'English', 'Accounting', 'Geography'].map((s) => (
                      <option key={s} value={s} style={{ background: '#111' }}>{s}</option>
                    ))}
                  </select>
                )}
              </motion.div>

              <motion.div className="glass" style={{ padding: '24px', minHeight: '520px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                {mode === 'whiteboard' && <Whiteboard aiMode={aiMode} subject={subject} />}
                {mode === 'questions' && <PracticeQuestions />}
                {mode === 'notes' && <StudyNotes />}
                {mode === 'flashcards' && <Flashcards />}
                {mode === 'quiz' && <QuickQuiz />}
                {mode === 'mathlab' && <MathLab />}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <ScrollModel3D />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

function PracticeQuestions() {
  const [topic, setTopic] = useState('Quadratic equations');
  const [level, setLevel] = useState('Grade 12');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: 'Mathematics', messages: [{ role: 'user', content: `Generate 3 Grade 12 math practice questions about ${topic}. Include worked solutions and short explanations.` }] }),
      });
      const data = await res.json();
      setQuestions([data.reply || 'No questions generated yet.']);
    } catch (e) {
      setQuestions(['AI questions unavailable right now.']);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Practice Generator</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>Generate topic questions with solutions.</p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ngt-border)', color: 'white' }} />
        <select value={level} onChange={(e) => setLevel(e.target.value)} style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ngt-border)', color: 'white' }}>
          {['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'University Year 1'].map((l) => (
            <option key={l} value={l} style={{ background: '#111' }}>{l}</option>
          ))}
        </select>
        <button onClick={generate} className="ngt-btn ngt-btn--solid" disabled={loading}>{loading ? 'Generating...' : 'Generate'}</button>
      </div>
      <div className="glass" style={{ padding: '20px', whiteSpace: 'pre-wrap' }}>{questions[0]}</div>
    </div>
  );
}

const FLASHCARDS = [
  { front: 'What is a variable?', back: 'A symbol that represents a number.' },
  { front: 'Define photosynthesis', back: 'Process plants use to convert light into food.' },
  { front: 'Formula for area of a circle', back: 'A = πr²' },
];

function Flashcards() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = FLASHCARDS[index % FLASHCARDS.length];

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '12px' }}>Flashcards</h2>
      <motion.div className="glass" onClick={() => setFlipped((f) => !f)} whileHover={{ scale: 1.02 }} style={{ padding: '28px', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', perspective: '800px' }}>
        <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.35 }} style={{ position: 'relative', width: '100%' }}>
          <div style={{ backfaceVisibility: 'hidden' }}>{card.front}</div>
          <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{card.back}</div>
        </motion.div>
      </motion.div>
      <div style={{ marginTop: '18px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button className="ngt-btn ngt-btn--ghost" onClick={() => { setIndex((i) => i - 1); setFlipped(false); }}>Previous</button>
        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{index + 1}/{FLASHCARDS.length}</span>
        <button className="ngt-btn ngt-btn--solid" onClick={() => { setIndex((i) => i + 1); setFlipped(false); }}>Next</button>
      </div>
    </div>
  );
}

function QuickQuiz() {
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setFeedback('');
    setAnswer('');
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: 'General', messages: [{ role: 'user', content: 'Create one fun quick quiz question suitable for a South African Grade 10-12 student. Include 4 options and indicate the correct answer.' }] }),
      });
      const data = await res.json();
      setQuestions([data.reply || 'Quiz unavailable.']);
    } catch {}
    setLoading(false);
  };

  const submit = async () => {
    if (!answer.trim() || !questions[0]) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: 'General', messages: [{ role: 'user', content: questions[0] }, { role: 'user', content: `I answered: ${answer}. Tell me if it's correct and explain why in 1 sentence.` }] }),
      });
      const data = await res.json();
      setFeedback(data.reply || 'No feedback.');
    } catch {}
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Quick Quiz</h2>
      <button className="ngt-btn ngt-btn--solid" onClick={generate} disabled={loading}>{loading ? 'Loading...' : 'New Question'}</button>
      {questions[0] && (
        <div className="glass" style={{ padding: '20px', marginTop: '14px' }}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{questions[0]}</p>
          <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer" style={{ width: '100%', marginTop: '12px', padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ngt-border)', color: 'white' }} />
          <button className="ngt-btn ngt-btn--solid" style={{ marginTop: '10px' }} onClick={submit} disabled={loading}>Submit</button>
          {feedback && <p style={{ marginTop: '10px', color: '#fbbf24' }}>{feedback}</p>}
        </div>
      )}
    </div>
  );
}

function MathLab() {
  const [problem, setProblem] = useState('Solve for x: 2x + 5 = 17');
  const [solution, setSolution] = useState('');

  const solve = async () => {
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: 'Mathematics', messages: [{ role: 'user', content: `Show step-by-step working for: ${problem}` }] }),
      });
      const data = await res.json();
      setSolution(data.reply || 'Solution unavailable.');
    } catch {}
  };

  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Math Lab</h2>
      <textarea value={problem} onChange={(e) => setProblem(e.target.value)} rows={3} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ngt-border)', color: 'white' }} />
      <button className="ngt-btn ngt-btn--solid" style={{ marginTop: '10px' }} onClick={solve}>Solve</button>
      {solution && <div className="glass" style={{ padding: '20px', marginTop: '14px', whiteSpace: 'pre-wrap' }}>{solution}</div>}
    </div>
  );
}

function StudyNotes() {
  return (
    <div>
      <h2 style={{ marginBottom: '12px' }}>Study Notes</h2>
      <p style={{ color: 'var(--text-muted)' }}>AI-assisted notes available now: ask the study assistant to summarize any topic and save it here.</p>
    </div>
  );
}
