'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ParallaxImage({ src, alt, speed = 0.3, style = {} }) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(imgRef.current, {
      y: () => speed * 200,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, [speed]);

  return (
    <div
      ref={containerRef}
      style={{
        overflow: 'hidden',
        borderRadius: '24px',
        position: 'relative',
        ...style,
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '130%',
          objectFit: 'cover',
          display: 'block',
          transform: `translateY(-${speed * 100}px)`,
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(3,0,20,0.6) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
