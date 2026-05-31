'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry or Datadog
    console.error('Next.js Client Error Boundary Caught:', error);
    // if (window.Sentry) window.Sentry.captureException(error);
  }, [error]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0a0a', color: 'white', padding: '24px' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: '#ff4444' }}>Something went wrong!</h2>
      <p style={{ color: '#888', marginBottom: '24px', textAlign: 'center', maxWidth: '600px' }}>
        An unexpected error occurred in the application interface. Our team has been notified.
      </p>
      <button
        onClick={() => reset()}
        style={{ padding: '12px 24px', background: '#0066cc', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Try again
      </button>
    </div>
  );
}
