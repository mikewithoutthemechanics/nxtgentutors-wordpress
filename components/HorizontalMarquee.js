'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HorizontalMarquee({ items, speed = 40, direction = 'left' }) {
  const trackRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;

    gsap.set(track, { x: direction === 'left' ? 0 : -totalWidth });

    gsap.to(track, {
      x: direction === 'left' ? -totalWidth : 0,
      duration: speed,
      ease: 'none',
      repeat: -1,
    });
  }, [speed, direction]);

  // Duplicate items for seamless loop
  const allItems = [...items, ...items];

  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: '48px',
          whiteSpace: 'nowrap',
          willChange: 'transform',
        }}
      >
        {allItems.map((item, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              padding: '24px 48px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span style={{ fontSize: '2rem' }}>{item.icon}</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
