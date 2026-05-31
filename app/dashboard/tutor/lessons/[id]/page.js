'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Background3D from '@/components/Background3D';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const JitsiMeeting = dynamic(() => import('@/components/JitsiMeeting'), { ssr: false });
const CollabWhiteboard = dynamic(() => import('@/components/CollabWhiteboard'), { ssr: false });

export default function TutorLessonViewer() {
  const pathname = usePathname();
  const lessonId = pathname.split('/').pop();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLesson({
        id: lessonId,
        title: 'Advanced Mechanics - Forces & Motion',
        student: 'Jason L.',
        duration: '60 mins',
        materials: ['Forces_Worksheet.pdf', 'Mechanics_Notes.pptx'],
      });
      setLoading(false);
    }, 800);
  }, [lessonId]);

  if (loading) return <div className="loading-overlay">Loading Lesson...</div>;

  return (
    <main className="app-container">
      <Background3D />
      <Navbar />

      <section style={{ paddingTop: '120px', paddingBottom: '60px' }}>
        <div className="container">
          <motion.div
            className="glass"
            style={{ padding: '32px', borderRadius: '24px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="badge">Tutor Session</span>
                <h1 style={{ fontSize: '2rem', marginTop: '12px' }}>{lesson.title}</h1>
                <p style={{ color: 'var(--text-muted)' }}>Student: {lesson.student} &bull; ID: {lesson.id}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="ngt-btn ngt-btn--ghost"
                  style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                  onClick={() => setShowWhiteboard(!showWhiteboard)}
                >
                  {showWhiteboard ? 'Hide Whiteboard' : 'Whiteboard'}
                </button>
                <Link href="/study-planner" className="ngt-btn ngt-btn--ghost" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>Study Planner</Link>
                <button className="btn btn-primary">End Session</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: showWhiteboard ? '1fr 1fr' : '2fr 1fr', gap: '24px' }}>
              <div style={{ minHeight: '400px' }}>
                <JitsiMeeting
                  roomName={`lesson-${lessonId}`}
                  displayName="Tutor"
                />
              </div>

              {showWhiteboard ? (
                <div style={{ minHeight: '400px' }}>
                  <CollabWhiteboard />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '16px' }}>Lesson Materials</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {lesson.materials.map((file, i) => (
                        <div key={i} className="glass" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.9rem' }}>{file}</span>
                          <button style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer' }}>Download</button>
                        </div>
                      ))}
                      <button className="btn btn-outline" style={{ width: '100%', marginTop: '8px' }}>+ Upload Material</button>
                    </div>
                  </div>

                  <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '16px' }}>Quick Tools</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Link href="/whiteboard" className="glass" style={{ padding: '12px', display: 'block', color: 'white', textDecoration: 'none' }}>Full Whiteboard</Link>
                      <Link href="/study-planner" className="glass" style={{ padding: '12px', display: 'block', color: 'white', textDecoration: 'none' }}>Study Planner</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
