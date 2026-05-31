'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function JitsiMeeting({ roomName, displayName = 'NextGen User', onClose }) {
  const containerRef = useRef(null);
  const apiRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const domain = process.env.NEXT_PUBLIC_JITSI_DOMAIN || 'meet.jit.si';
    const cleanRoom = `NextGenTutors-${(roomName || 'session').replace(/\s+/g, '-')}`;

    const script = document.createElement('script');
    script.src = `https://${domain}/external_api.js`;
    script.async = true;
    script.onload = () => {
      if (!containerRef.current) return;
      apiRef.current = new window.JitsiMeetExternalAPI(domain, {
        roomName: cleanRoom,
        parentNode: containerRef.current,
        width: '100%',
        height: '100%',
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          prejoinConfig: { enabled: false },
          toolbarButtons: [
            'microphone', 'camera', 'desktop', 'fullscreen', 'chat',
            'recording', 'raisehand', 'tileview', 'hangup',
          ],
          enableWelcomePage: false,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: '#0a0a0a',
          TOOLBAR_ALWAYS_VISIBLE: true,
          MOBILE_APP_PROMO: false,
        },
        userInfo: {
          displayName,
        },
      });

      apiRef.current.addListener('videoConferenceJoined', () => setLoaded(true));
      apiRef.current.addListener('readyToClose', () => onClose?.());
    };

    document.body.appendChild(script);

    return () => {
      apiRef.current?.dispose();
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [roomName, displayName, onClose]);

  return (
    <div className="jitsi-wrapper">
      {!loaded && (
        <motion.div
          className="jitsi-loading"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--ngt-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '16px' }}>Connecting to video session...</p>
        </motion.div>
      )}
      <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '500px' }} />
    </div>
  );
}
