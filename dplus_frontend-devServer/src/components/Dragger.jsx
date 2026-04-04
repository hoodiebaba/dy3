import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';

/**
 * Draggable panel. Drag only starts when mousedown happens on an element with
 * `data-drag-handle` (avoids stealing clicks on buttons / toolbars).
 * Move/up listen on `window` so dragging still works when the cursor leaves the panel.
 *
 * `mapContainerHeight` — when set (px), initial `top` is chosen so the panel sits near the
 * bottom of the map (cell info popup). Ignores string `mapH` like "100%".
 */
const Dragger = ({ children, mapH: _mapH, mapW: _mapW, mapContainerHeight }) => {
  const [position, setPosition] = useState({ x: 8, y: 100 });
  const positionRef = useRef(position);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  /** ~max card height: orange header + table maxHeight 320 + borders */
  const EST_POPUP_PX = 400;

  useLayoutEffect(() => {
    const h = mapContainerHeight;
    if (typeof h !== 'number' || !Number.isFinite(h) || h < 120) return;
    setPosition((p) => ({
      ...p,
      y: Math.max(8, h - EST_POPUP_PX - 8),
    }));
  }, [mapContainerHeight]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    if (!e.target.closest('[data-drag-handle]')) return;
    dragging.current = true;
    const pos = positionRef.current;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  };

  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return (
    <div className="">
      <div
        className="draggable"
        style={{ position: 'absolute', left: position.x, top: position.y }}
        onMouseDown={handleMouseDown}
      >
        {children}
      </div>
    </div>
  );
};

export default Dragger;
