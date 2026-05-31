'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CountUp({ end, suffix = '', prefix = '', duration = 2 }) {
  const [display, setDisplay] = useState(() => {
    const numericEnd = parseInt(String(end).replace(/[^0-9]/g, ''), 10);
    const safeEnd = Number.isFinite(numericEnd) ? numericEnd : 0;
    return '0';
  });
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  const animate = useCallback((targetVal) => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: targetVal,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplay(Math.floor(obj.val).toLocaleString());
      },
      onComplete: () => {
        setDisplay(targetVal.toLocaleString());
      },
    });
  }, [duration]);

  useEffect(() => {
    const numericEnd = parseInt(String(end).replace(/[^0-9]/g, ''), 10);
    const targetVal = Number.isFinite(numericEnd) && numericEnd > 0 ? numericEnd : 0;

    if (!ref.current) return;

    const ctx = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 85%',
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        animate(targetVal);
      },
    });

    const timeout = setTimeout(() => {
      if (!hasAnimated.current && targetVal > 0) {
        hasAnimated.current = true;
        animate(targetVal);
      }
    }, 400);

    return () => {
      clearTimeout(timeout);
      ctx.kill();
    };
  }, [end, duration, animate]);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}
