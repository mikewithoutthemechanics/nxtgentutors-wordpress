'use client';

import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { motion } from 'framer-motion';

const monthlyProgress = [
  { month: 'Jan', maths: 52, science: 58, english: 65 },
  { month: 'Feb', maths: 58, science: 60, english: 67 },
  { month: 'Mar', maths: 63, science: 65, english: 70 },
  { month: 'Apr', maths: 68, science: 70, english: 73 },
  { month: 'May', maths: 75, science: 74, english: 78 },
  { month: 'Jun', maths: 80, science: 78, english: 80 },
  { month: 'Jul', maths: 82, science: 82, english: 83 },
  { month: 'Aug', maths: 87, science: 85, english: 85 },
];

const sessionData = [
  { week: 'W1', sessions: 2, hours: 2 },
  { week: 'W2', sessions: 3, hours: 3 },
  { week: 'W3', sessions: 2, hours: 2 },
  { week: 'W4', sessions: 4, hours: 4 },
  { week: 'W5', sessions: 3, hours: 3 },
  { week: 'W6', sessions: 5, hours: 5 },
  { week: 'W7', sessions: 4, hours: 4.5 },
  { week: 'W8', sessions: 5, hours: 5.5 },
];

const skillsData = [
  { skill: 'Algebra', score: 85 },
  { skill: 'Calculus', score: 72 },
  { skill: 'Geometry', score: 90 },
  { skill: 'Statistics', score: 78 },
  { skill: 'Trigonometry', score: 68 },
  { skill: 'Number Theory', score: 82 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', backdropFilter: 'blur(10px)' }}>
      <p style={{ fontWeight: 600, marginBottom: '8px', color: 'white' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: '0.85rem', margin: '2px 0' }}>
          {p.name}: <strong>{p.value}%</strong>
        </p>
      ))}
    </div>
  );
};

export default function ProgressCharts() {
  const [activeChart, setActiveChart] = useState('progress');
  const charts = [
    { id: 'progress', label: 'Mark Progress' },
    { id: 'sessions', label: 'Session Activity' },
    { id: 'skills', label: 'Skill Radar' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', gap: '8px', padding: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', width: 'fit-content' }}>
        {charts.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveChart(c.id)}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              background: activeChart === c.id ? 'var(--ngt-accent)' : 'transparent',
              color: activeChart === c.id ? 'white' : 'rgba(255,255,255,0.5)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeChart}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
      >
        {activeChart === 'progress' && (
          <>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px' }}>Academic Progress Over Time</h3>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={monthlyProgress}>
                <defs>
                  <linearGradient id="colorMaths" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorScience" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEnglish" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} domain={[40, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="maths" name="Mathematics" stroke="#6366f1" fill="url(#colorMaths)" strokeWidth={2} />
                <Area type="monotone" dataKey="science" name="Science" stroke="#22d3ee" fill="url(#colorScience)" strokeWidth={2} />
                <Area type="monotone" dataKey="english" name="English" stroke="#a855f7" fill="url(#colorEnglish)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </>
        )}

        {activeChart === 'sessions' && (
          <>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px' }}>Weekly Session Activity</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sessions" name="Sessions" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="hours" name="Hours" fill="#22d3ee" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {activeChart === 'skills' && (
          <>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px' }}>Skill Proficiency Radar</h3>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={skillsData} cx="50%" cy="50%" outerRadius="80%">
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="skill" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Radar name="Proficiency" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </>
        )}
      </motion.div>
    </div>
  );
}
