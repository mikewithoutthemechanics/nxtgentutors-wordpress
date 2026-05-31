'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#ffffff', '#6366f1', '#f43f5e', '#22d3ee', '#f59e0b', '#10b981', '#a855f7'];
const TOOLS = [
  { id: 'pen', label: 'Pen', icon: 'M2 2l20 20M15 2l7 7-10 10-7-7L15 2z' },
  { id: 'line', label: 'Line', icon: 'M5 12h14' },
  { id: 'rect', label: 'Rectangle', icon: 'M3 3h18v18H3z' },
  { id: 'circle', label: 'Circle', icon: 'M12 2a10 10 0 100 20 10 10 0 000-20z' },
  { id: 'text', label: 'Text', icon: 'M4 7V4h16v3M9 20h6M12 4v16' },
  { id: 'eraser', label: 'Eraser', icon: 'M20 20H7l-4-4 10-10 11 1-13 13z' },
];

export default function CollabWhiteboard() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(3);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [textInput, setTextInput] = useState('');
  const [textPos, setTextPos] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    ctxRef.current = ctx;
    saveState();
  }, []);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL();
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      next.push(data);
      return next;
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const restoreState = useCallback((index) => {
    if (index < 0 || index >= history.length) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
    };
    img.src = history[index];
    setHistoryIndex(index);
  }, [history]);

  const undo = () => restoreState(historyIndex - 1);
  const redo = () => restoreState(historyIndex + 1);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    saveState();
  };

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e) => {
    const pos = getPos(e);
    const ctx = ctxRef.current;

    if (tool === 'text') {
      setTextPos(pos);
      return;
    }

    setDrawing(true);
    setStartPos(pos);

    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.strokeStyle = tool === 'eraser' ? '#0a0a0a' : color;
      ctx.lineWidth = tool === 'eraser' ? lineWidth * 4 : lineWidth;
    }
  };

  const draw = (e) => {
    if (!drawing) return;
    const pos = getPos(e);
    const ctx = ctxRef.current;

    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e) => {
    if (!drawing) return;
    setDrawing(false);
    const ctx = ctxRef.current;
    const pos = e.changedTouches ? { x: e.changedTouches[0].clientX - canvasRef.current.getBoundingClientRect().left, y: e.changedTouches[0].clientY - canvasRef.current.getBoundingClientRect().top } : getPos(e);

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    if (tool === 'line' && startPos) {
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'rect' && startPos) {
      ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
    } else if (tool === 'circle' && startPos) {
      const rx = Math.abs(pos.x - startPos.x) / 2;
      const ry = Math.abs(pos.y - startPos.y) / 2;
      const cx = startPos.x + (pos.x - startPos.x) / 2;
      const cy = startPos.y + (pos.y - startPos.y) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    saveState();
  };

  const placeText = () => {
    if (!textPos || !textInput.trim()) return;
    const ctx = ctxRef.current;
    ctx.fillStyle = color;
    ctx.font = `${lineWidth * 6}px Inter, sans-serif`;
    ctx.fillText(textInput, textPos.x, textPos.y);
    setTextInput('');
    setTextPos(null);
    saveState();
  };

  return (
    <div className="wb-container">
      <div className="wb-toolbar">
        <div className="wb-tools">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              className={`wb-tool-btn ${tool === t.id ? 'active' : ''}`}
              onClick={() => setTool(t.id)}
              title={t.label}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={t.icon} /></svg>
            </button>
          ))}
        </div>

        <div className="wb-separator" />

        <div className="wb-colors">
          {COLORS.map((c) => (
            <button
              key={c}
              className={`wb-color-btn ${color === c ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>

        <div className="wb-separator" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Size</span>
          <input
            type="range"
            min="1"
            max="12"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            style={{ width: '80px' }}
          />
        </div>

        <div className="wb-separator" />

        <div className="wb-actions">
          <button className="wb-action-btn" onClick={undo} title="Undo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
          </button>
          <button className="wb-action-btn" onClick={redo} title="Redo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.13-9.36L23 10" /></svg>
          </button>
          <button className="wb-action-btn" onClick={clearCanvas} title="Clear">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
          </button>
        </div>
      </div>

      {textPos && (
        <div className="wb-text-overlay" style={{ left: textPos.x, top: textPos.y + 60 }}>
          <input
            autoFocus
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && placeText()}
            placeholder="Type text..."
            style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.8)', border: '1px solid var(--ngt-accent)', borderRadius: '8px', color: 'white', fontSize: '0.9rem', outline: 'none', width: '200px' }}
          />
          <button onClick={placeText} className="ngt-btn ngt-btn--solid" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Place</button>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="wb-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
}
