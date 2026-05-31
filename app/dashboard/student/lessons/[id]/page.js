'use client';

import { use } from 'react';
import Navbar from '@/components/Navbar';
import Background3D from '@/components/Background3D';
import { motion } from 'framer-motion';

export default function LessonViewer({ params }) {
  const lessonId = use(params).id;

  return (
    <main className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Background3D />
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
      </div>

      <Navbar />

      <section style={{ flex: 1, padding: '140px 24px 60px' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '2rem', margin: 0 }}>MasterStudy <span className="text-gradient">Lesson Viewer</span></h1>
              <a href="/dashboard/student" className="btn btn-outline" style={{ padding: '8px 16px' }}>&larr; Back to Dashboard</a>
            </div>

            {/* Embedded Video Player container */}
            <div className="glass" style={{ width: '100%', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', background: 'rgba(0,0,0,0.5)', overflow: 'hidden', borderRadius: '12px' }}>
              <p style={{ color: 'var(--text-muted)' }}>Lesson video {lessonId} will load here securely via MasterStudy API.</p>
              {/* Actual integration would embed iframe or video player here securely pulling from WP API */}
            </div>

            <div className="glass" style={{ padding: '32px' }}>
              <h3 style={{ marginBottom: '16px' }}>Lesson Materials</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>📄</span>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>Session Worksheet</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PDF • 2.4 MB</span>
                  </div>
                  <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Download</button>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
