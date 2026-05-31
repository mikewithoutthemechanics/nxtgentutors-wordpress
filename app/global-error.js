'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#000', color: '#fff' }}>
          <h2>Critical System Error</h2>
          <p>A fatal error prevented the application from loading.</p>
          <button onClick={() => reset()}>Restart Application</button>
        </div>
      </body>
    </html>
  );
}
