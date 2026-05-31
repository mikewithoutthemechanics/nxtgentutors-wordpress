'use client';

import { Toaster } from 'react-hot-toast';

export default function NotificationProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgba(17,17,17,0.95)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '14px 20px',
          fontSize: '0.9rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px -8px rgba(0,0,0,0.5)',
        },
        success: {
          iconTheme: { primary: '#10b981', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#f43f5e', secondary: '#fff' },
        },
      }}
    />
  );
}
