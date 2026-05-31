'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AnimatedSection({ children, animation = 'fade-up', delay = 0 }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = sectionRef.current;
    
    let vars = {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      duration: 1,
      ease: 'power3.out',
      delay,
    };

    if (animation === 'fade-up') {
      vars = { ...vars, opacity: 0, y: 50 };
      gsap.from(el, vars);
    } else if (animation === 'fade-in') {
      vars = { ...vars, opacity: 0 };
      gsap.from(el, vars);
    } else if (animation === 'slide-left') {
      vars = { ...vars, opacity: 0, x: -100 };
      gsap.from(el, vars);
    } else if (animation === 'slide-right') {
      vars = { ...vars, opacity: 0, x: 100 };
      gsap.from(el, vars);
    } else if (animation === 'scale-up') {
      vars = { ...vars, opacity: 0, scale: 0.8 };
      gsap.from(el, vars);
    }

  }, [animation, delay]);

  return (
    <div ref={sectionRef} style={{ width: '100%' }}>
      {children}
    </div>
  );
}
