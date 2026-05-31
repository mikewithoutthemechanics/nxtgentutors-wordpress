'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function TextReveal({ children, tag = 'h2', className = '', style = {} }) {
  const textRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = textRef.current;
    if (!el) return;

    const text = el.textContent;
    el.innerHTML = '';

    // Split into words, then each word into chars
    const words = text.split(' ');
    words.forEach((word, wi) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.overflow = 'hidden';

      const chars = word.split('');
      chars.forEach((char) => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.style.display = 'inline-block';
        charSpan.style.transform = 'translateY(120%)';
        charSpan.style.opacity = '0';
        charSpan.className = 'reveal-char';
        wordSpan.appendChild(charSpan);
      });

      el.appendChild(wordSpan);

      // Add space between words
      if (wi < words.length - 1) {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;';
        space.style.display = 'inline-block';
        el.appendChild(space);
      }
    });

    const allChars = el.querySelectorAll('.reveal-char');

    gsap.to(allChars, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power4.out',
      stagger: 0.02,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
  }, []);

  const Tag = tag;

  return (
    <Tag ref={textRef} className={className} style={{ overflow: 'hidden', ...style }}>
      {children}
    </Tag>
  );
}
