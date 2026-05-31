'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Tutors', href: '/tutors' },
  { label: 'AR Lab', href: '/ar-lab' },
  { label: 'Study Planner', href: '/study-planner' },
  { label: 'Log in', href: '/login' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      style={{
        background: scrolled ? 'rgba(10,10,10,0.7)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--ngt-border)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
      }}
    >
      <div className="container nav-container" style={{ padding: '0 40px' }}>
        <Link href="/" className="logo" style={{ fontSize: '1.6rem' }}>
          <motion.div 
            className="logo-dot"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          NextGen<span style={{ color: 'var(--ngt-accent)' }}>Tutors</span>
        </Link>

        {/* Desktop nav */}
        <div className="nav-links nav-links--desktop">
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} href={item.href} className="nav-link" style={{ position: 'relative' }}>
              {item.label}
            </Link>
          ))}
          <Link href="/register" className="ngt-btn ngt-btn--solid" style={{ padding: '12px 28px', fontSize: '0.9rem' }}>
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <span style={{ display: 'block', width: '24px', height: '2px', background: 'white', transition: 'all 0.3s', transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ display: 'block', width: '24px', height: '2px', background: 'white', transition: 'all 0.3s', opacity: mobileOpen ? 0 : 1, margin: '6px 0' }} />
          <span style={{ display: 'block', width: '24px', height: '2px', background: 'white', transition: 'all 0.3s', transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="nav-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {NAV_ITEMS.map((item) => (
              <Link key={item.label} href={item.href} className="nav-mobile-link" onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/register" className="ngt-btn ngt-btn--solid" style={{ padding: '14px', textAlign: 'center', width: '100%', display: 'block' }} onClick={() => setMobileOpen(false)}>
              Get Started
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
