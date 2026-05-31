'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import CardCarousel from '@/components/CardCarousel';
import MagneticButton from '@/components/MagneticButton';
import TextReveal from '@/components/TextReveal';
import CountUp from '@/components/CountUp';
import HorizontalMarquee from '@/components/HorizontalMarquee';
import ParallaxImage from '@/components/ParallaxImage';
import AnimatedSection from '@/components/AnimatedSection';
import { motion, useScroll, useTransform } from 'framer-motion';
import PhoneShowcase from '@/components/PhoneShowcase';
import Link from 'next/link';

const subjects = [
  { icon: '', text: 'Mathematics' }, { icon: '', text: 'Physical Sciences' },
  { icon: '', text: 'English Literature' }, { icon: '', text: 'Computer Science' },
  { icon: '', text: 'Life Sciences' }, { icon: '', text: 'Accounting' },
  { icon: '', text: 'Geography' }, { icon: '', text: 'Advanced Physics' },
  { icon: '', text: 'Engineering' }, { icon: '', text: 'Business Studies' },
];

const testimonials = [
  { name: 'Lerato M.', role: 'Matric Student', text: 'My maths marks went from 48% to 87% in two terms. The AI-powered study notes after each session changed everything for me.' },
  { name: 'James P.', role: 'Grade 11', text: 'The online sessions feel like being in a real classroom. Screen sharing and the recorded playback feature are game changers.' },
  { name: 'Naledi K.', role: 'University Student', text: 'I use NextGen for my first-year engineering modules. The tutor matching algorithm paired me perfectly.' },
  { name: 'David R.', role: 'Parent', text: 'Both my children improved dramatically. The parent dashboard keeps me informed on every session and milestone.' },
];

const steps = [
  { num: '01', title: 'Browse & Match', desc: 'Search verified tutors by subject, level, and availability. Our AI matching engine analyses learning style to find your ideal educator.' },
  { num: '02', title: 'Book Instantly', desc: 'Select a time slot that works for you. Real-time calendar sync means zero waiting and zero back-and-forth emails.' },
  { num: '03', title: 'Learn & Grow', desc: 'Join immersive 1-on-1 video sessions with screen sharing, AI-generated study notes, and full recordings delivered after every lesson.' },
];

export default function Home() {
  const [stats, setStats] = useState({ tutors: '500+', rating: '4.9/5', sessions: '10k+' });
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) { console.warn('Using fallback stats'); }
    }
    fetchStats();
  }, []);

  return (
    <main className="ngt-main">
      <Navbar />

      {/* HERO — Full-bleed video with overlay */}
      <section ref={heroRef} className="ngt-hero">
        <motion.div className="ngt-hero__video-wrap" style={{ scale: heroScale }}>
          <video autoPlay loop muted playsInline className="ngt-hero__video">
            <source src="https://videos.pexels.com/video-files/5198167/5198167-hd_1920_1080_25fps.mp4" type="video/mp4" />
          </video>
          {/* Fallback if video doesn't load */}
          <div className="ngt-hero__fallback" />
          <div className="ngt-hero__overlay" />
        </motion.div>

        <motion.div className="ngt-hero__content" style={{ opacity: heroOpacity }}>
          <motion.span className="ngt-hero__tag" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            AI-Enhanced Private Tutoring
          </motion.span>

          <motion.h1 className="ngt-hero__title" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            The Smartest Way<br />to Learn, Privately.
          </motion.h1>

          <motion.p className="ngt-hero__desc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}>
            One-on-one sessions with South Africa's top-rated educators. AI-powered matching, real-time analytics, and session recordings that make every lesson count.
          </motion.p>

          <motion.div className="ngt-hero__actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1 }}>
            <MagneticButton>
              <Link href="/tutors" className="ngt-btn ngt-btn--solid">Find a Tutor</Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="/register" className="ngt-btn ngt-btn--ghost">Apply as Tutor</Link>
            </MagneticButton>
          </motion.div>

          <motion.div className="ngt-hero__metrics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.3 }}>
            <div className="ngt-metric">
              <span className="ngt-metric__val"><CountUp end={500} suffix="+" /></span>
              <span className="ngt-metric__label">Verified Tutors</span>
            </div>
            <div className="ngt-metric__divider" />
            <div className="ngt-metric">
              <span className="ngt-metric__val">4.9</span>
              <span className="ngt-metric__label">Average Rating</span>
            </div>
            <div className="ngt-metric__divider" />
            <div className="ngt-metric">
              <span className="ngt-metric__val"><CountUp end={10000} suffix="+" /></span>
              <span className="ngt-metric__label">Sessions Completed</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="ngt-hero__scroll" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
          <span>Scroll</span>
          <div className="ngt-hero__scroll-line" />
        </motion.div>
      </section>

      {/* MARQUEE — Subject strip */}
      <section className="ngt-marquee-section">
        <HorizontalMarquee items={subjects} speed={50} direction="left" />
      </section>

      {/* 3D CARD CAROUSEL BANNER */}
      <section className="ngt-section">
        <div className="container">
          <TextReveal tag="h2" className="ngt-section__title">
            What makes us different
          </TextReveal>
          <p className="ngt-section__sub">Five pillars of AI-enhanced private tutoring that set NextGen apart.</p>
        </div>
        <CardCarousel />
      </section>

      {/* HOW IT WORKS */}
      <section className="ngt-section">
        <div className="container">
          <TextReveal tag="h2" className="ngt-section__title">
            Three steps to better grades
          </TextReveal>
          <p className="ngt-section__sub">Our AI-enhanced platform gets you learning in minutes, not days.</p>

          <div className="ngt-steps">
            {steps.map((step, i) => (
              <AnimatedSection key={i} animation="fade-up" delay={i * 0.12}>
                <div className="ngt-step">
                  <span className="ngt-step__num">{step.num}</span>
                  <h3 className="ngt-step__title">{step.title}</h3>
                  <p className="ngt-step__desc">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES — 3D iPhone Showcase */}
      <PhoneShowcase />

      {/* RESULTS SHOWCASE */}
      <section className="ngt-section">
        <div className="container">
          <div className="ngt-showcase">
            <div className="ngt-showcase__text">
              <TextReveal tag="h2" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                The platform that delivers measurable results
              </TextReveal>
              <AnimatedSection animation="fade-up" delay={0.2}>
                <p className="ngt-showcase__desc">
                  Our tutors have collectively helped students improve by an average of 23% per subject. From Matric to university-level, our verified educators deliver real academic transformation backed by data.
                </p>
              </AnimatedSection>
              <AnimatedSection animation="fade-up" delay={0.35}>
                <div className="ngt-showcase__stats">
                  <div className="ngt-showcase__stat">
                    <span className="ngt-showcase__stat-num"><CountUp end={23} suffix="%" /></span>
                    <span className="ngt-showcase__stat-label">Average Mark Improvement</span>
                  </div>
                  <div className="ngt-showcase__stat">
                    <span className="ngt-showcase__stat-num"><CountUp end={98} suffix="%" /></span>
                    <span className="ngt-showcase__stat-label">Student Satisfaction</span>
                  </div>
                </div>
              </AnimatedSection>
            </div>
            <AnimatedSection animation="fade-up" delay={0.25}>
              <ParallaxImage
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Students collaborating on a project"
                speed={0.15}
                style={{ height: '480px' }}
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="ngt-section ngt-section--alt">
        <div className="container">
          <TextReveal tag="h2" className="ngt-section__title">
            What our students say
          </TextReveal>
          <p className="ngt-section__sub">Real feedback from students and parents who've experienced the platform.</p>

          <div className="ngt-testimonials">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} animation="fade-up" delay={i * 0.08}>
                <motion.div className="ngt-testimonial" whileHover={{ y: -6, transition: { duration: 0.25 } }}>
                  <p className="ngt-testimonial__text">"{t.text}"</p>
                  <div className="ngt-testimonial__author">
                    <div className="ngt-testimonial__avatar">{t.name.charAt(0)}</div>
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.role}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ngt-section" style={{ textAlign: 'center' }}>
        <div className="container">
          <AnimatedSection animation="fade-up">
            <div className="ngt-cta-block">
              <h2 className="ngt-cta-block__title">Ready to improve your grades?</h2>
              <p className="ngt-cta-block__desc">Join thousands of students already learning with South Africa's most trusted AI-enhanced tutoring platform.</p>
              <div className="ngt-hero__actions" style={{ justifyContent: 'center', marginTop: '40px' }}>
                <MagneticButton>
                  <Link href="/tutors" className="ngt-btn ngt-btn--solid" style={{ fontSize: '1.15rem', padding: '20px 52px' }}>Get Started Free</Link>
                </MagneticButton>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ngt-footer">
        <div className="container">
          <div className="ngt-footer__grid">
            <div>
              <h4 className="ngt-footer__brand">NextGen Tutors</h4>
              <p className="ngt-footer__about">AI-enhanced private tutoring for South African students. Verified educators, real-time analytics, and measurable results since 2024.</p>
            </div>
            <div>
              <h5 className="ngt-footer__heading">Platform</h5>
              <Link href="/tutors" className="ngt-footer__link">Find a Tutor</Link>
              <Link href="/register" className="ngt-footer__link">Become a Tutor</Link>
              <Link href="/login" className="ngt-footer__link">Student Login</Link>
            </div>
            <div>
              <h5 className="ngt-footer__heading">Features</h5>
              
              <Link href="/study-planner" className="ngt-footer__link">AI Study Planner</Link>
              <Link href="/video-session" className="ngt-footer__link">Video Sessions</Link>
              <Link href="/whiteboard" className="ngt-footer__link">Whiteboard</Link>
            </div>
            <div>
              <h5 className="ngt-footer__heading">Company</h5>
              <span className="ngt-footer__link">About Us</span>
              <span className="ngt-footer__link">Contact</span>
              <span className="ngt-footer__link">Privacy Policy</span>
            </div>
          </div>
          <div className="ngt-footer__bottom">
            <p>&copy; 2025 NextGen Tutors. All rights reserved. Powered by open-source technology.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
