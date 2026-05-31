'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const cards = [
  {
    title: 'AI-Powered Matching',
    desc: 'Our algorithm finds your ideal tutor based on learning style, goals, and schedule.',
    label: 'Intelligence',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    accent: '#818cf8',
  },
  {
    title: 'Live 1-on-1 Sessions',
    desc: 'HD video, screen sharing, and a shared whiteboard — private tutoring redefined.',
    label: 'Experience',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    accent: '#60a5fa',
  },
  {
    title: 'Smart Study Notes',
    desc: 'AI generates structured revision notes from every session automatically.',
    label: 'Technology',
    gradient: 'linear-gradient(135deg, #1b2a1b 0%, #14532d 100%)',
    accent: '#4ade80',
  },
  {
    title: 'Progress Analytics',
    desc: 'Real-time dashboards for students and parents tracking every milestone.',
    label: 'Insights',
    gradient: 'linear-gradient(135deg, #2a1a1a 0%, #431407 100%)',
    accent: '#fb923c',
  },
  {
    title: 'Session Recordings',
    desc: 'Every lesson stored in your personal LMS for unlimited playback and revision.',
    label: 'Learning',
    gradient: 'linear-gradient(135deg, #2a1a2a 0%, #4a1942 100%)',
    accent: '#e879f9',
  },
];

export default function CardCarousel() {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  // Auto-advance
  useEffect(() => {
    if (isHovered) return;
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % cards.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [isHovered]);

  const getCardStyle = (index) => {
    const diff = index - active;
    const wrappedDiff = ((diff + cards.length) % cards.length);
    
    // Position cards in a fan layout
    if (wrappedDiff === 0) {
      return { x: 0, rotateY: 0, scale: 1, z: 50, opacity: 1, filter: 'brightness(1)' };
    } else if (wrappedDiff === 1) {
      return { x: 320, rotateY: -25, scale: 0.85, z: 0, opacity: 0.7, filter: 'brightness(0.6)' };
    } else if (wrappedDiff === cards.length - 1) {
      return { x: -320, rotateY: 25, scale: 0.85, z: 0, opacity: 0.7, filter: 'brightness(0.6)' };
    } else if (wrappedDiff === 2) {
      return { x: 560, rotateY: -35, scale: 0.7, z: -50, opacity: 0.3, filter: 'brightness(0.4)' };
    } else {
      return { x: -560, rotateY: 35, scale: 0.7, z: -50, opacity: 0.3, filter: 'brightness(0.4)' };
    }
  };

  return (
    <div
      className="ngt-carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="ngt-carousel__stage">
        {cards.map((card, i) => {
          const style = getCardStyle(i);
          return (
            <motion.div
              key={i}
              className="ngt-carousel__card"
              style={{
                background: card.gradient,
                position: 'absolute',
                cursor: 'pointer',
              }}
              animate={{
                x: style.x,
                rotateY: style.rotateY,
                scale: style.scale,
                zIndex: style.z,
                opacity: style.opacity,
                filter: style.filter,
              }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setActive(i)}
              whileHover={i === active ? { y: -8, transition: { duration: 0.25 } } : {}}
            >
              <span className="ngt-carousel__label" style={{ color: card.accent, background: `${card.accent}15`, borderColor: `${card.accent}30` }}>
                {card.label}
              </span>
              <h3 className="ngt-carousel__card-title">{card.title}</h3>
              <p className="ngt-carousel__card-desc">{card.desc}</p>
              <div className="ngt-carousel__card-line" style={{ background: `linear-gradient(90deg, transparent, ${card.accent}40, transparent)` }} />
            </motion.div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="ngt-carousel__dots">
        {cards.map((_, i) => (
          <button
            key={i}
            className={`ngt-carousel__dot ${i === active ? 'ngt-carousel__dot--active' : ''}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}
