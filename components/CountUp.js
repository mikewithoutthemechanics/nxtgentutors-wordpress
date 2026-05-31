'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CountUp({ end, suffix = '', prefix = '', duration = 2 }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const numericEnd = parseInt(end.toString().replace(/[^0-9]/g, ''), 10) || 0;

    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 85%',
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        const obj = { val: 0 };
        gsap.to(obj, {
          val: numericEnd,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            setDisplay(Math.floor(obj.val).toLocaleString());
          },
        });
      },
    });
  }, [end, duration]);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}
