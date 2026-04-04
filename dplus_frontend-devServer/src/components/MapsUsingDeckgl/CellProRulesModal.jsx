import { useRef, useState, useEffect } from 'react';
import CellProRulesModalContent from './CellProRulesModalContent';

const CellProRulesModal = ({ isOpen, setIsOpen, cellId, cellName }) => {
  const [position, setPosition] = useState({
    x: Math.max(0, (window.innerWidth - 580) / 2),
    y: 80,
  });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        width: 580,
        minWidth: 480,
        minHeight: 400,
        height: '60vh',
        maxHeight: '90vh',
        background: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        resize: 'both',
      }}
    >
      {/* Drag handle header */}
      <div
        onMouseDown={onMouseDown}
        style={{
          padding: '12px 16px',
          cursor: 'move',
          background: '#1f2937',
          color: '#fff',
          fontWeight: '600',
          fontSize: 15,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        <span>Cell Pro Rules</span>
        <span
          onClick={() => setIsOpen(false)}
          style={{
            cursor: 'pointer',
            fontSize: 16,
            color: '#93c5fd',
            lineHeight: 1,
            padding: '0 2px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#93c5fd')}
        >
          ✕
        </span>
      </div>

      {/* Scrollable content */}
      <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, padding: '12px 16px' }}>
        <CellProRulesModalContent cellId={cellId} cellName={cellName} />
      </div>
    </div>
  );
};

export default CellProRulesModal;
