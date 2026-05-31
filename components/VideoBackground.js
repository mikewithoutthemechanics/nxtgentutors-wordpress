'use client';

export default function VideoBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -2, overflow: 'hidden', background: '#030014' }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          opacity: 0.6,
          filter: 'contrast(1.2) brightness(0.8) saturate(0.8)'
        }}
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-student-sitting-in-a-library-reading-a-book-4424-large.mp4" type="video/mp4" />
      </video>
      
      {/* Artistic Overlays */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        background: 'linear-gradient(to bottom, rgba(3, 0, 20, 0.4), rgba(3, 0, 20, 0.95))',
        mixBlendMode: 'multiply'
      }}></div>
      
      {/* Texture Overlay */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-linen-2.png")',
        opacity: 0.1,
        pointerEvents: 'none'
      }}></div>
    </div>
  );
}
