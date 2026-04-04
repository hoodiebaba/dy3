import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { RotateCcw, X } from "lucide-react";

const DEFAULT_WIDTH = 220;
const MIN_W = 160;
const MIN_H = 100;

/** Body text on white legend panel */
const LEGEND_TEXT = "#111827";
const LEGEND_TEXT_MUTED = "#64748b";

/**
 * Themed legend panel: dark gradient header (white title), white body, close + reset, resize, z-order hooks.
 * Content scales with panel width (default 220px = scale 1).
 */
const LegendBoxV2 = ({
  layer,
  thematic,
  onClose,
  zIndex = 10090,
  onBringToFront,
  onSendBackward,
}) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  /** null = height follows content (default); number = user-resized */
  const [height, setHeight] = useState(null);
  /** SE corner: light fill while pressed / dragging so resize is obvious */
  const [seHandleActive, setSeHandleActive] = useState(false);

  const dragging = useRef(false);
  const resizing = useRef(null); // 'se' | 'e' | 's'
  const offset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const rootRef = useRef(null);

  /** Typography + swatches scale with window width (corner / edge resize). */
  const scale = useMemo(
    () => Math.min(1.55, Math.max(0.52, width / DEFAULT_WIDTH)),
    [width],
  );
  const sz = useCallback((px) => Math.max(1, Math.round(px * scale)), [scale]);

  const onDragMouseDown = (e) => {
    if (e.button !== 0) return;
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onResizeMouseDown = (e, mode) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.button !== 0) return;
    resizing.current = mode;
    const el = rootRef.current;
    const rect = el?.getBoundingClientRect();
    const h0 = height ?? (rect ? rect.height : 200);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      w: width,
      h: h0,
    };
    if (height == null && rect) setHeight(Math.max(MIN_H, Math.round(rect.height)));
    if (mode === "se") setSeHandleActive(true);
  };

  const onMouseMove = useCallback((e) => {
    if (dragging.current) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
      return;
    }
    const mode = resizing.current;
    if (!mode) return;
    const dx = e.clientX - resizeStart.current.x;
    const dy = e.clientY - resizeStart.current.y;
    const { w, h } = resizeStart.current;
    if (mode === "e" || mode === "se") {
      setWidth(Math.max(MIN_W, Math.round(w + dx)));
    }
    if (mode === "s" || mode === "se") {
      setHeight(Math.max(MIN_H, Math.round(h + dy)));
    }
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    resizing.current = null;
    setSeHandleActive(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const resetSize = () => {
    setWidth(DEFAULT_WIDTH);
    setHeight(null);
  };

  const titleText = thematic?.type === "Boundary" ? "Boundary Legend" : `${layer} — ${thematic?.type}`;

  const onHeaderDoubleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onBringToFront?.();
  };

  const onHeaderContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSendBackward?.();
  };

  const onRootKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      onBringToFront?.();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onSendBackward?.();
    }
  };

  if (!thematic) return null;

  const { type, colors, kpiConfig } = thematic;

  const iconPx = Math.max(11, Math.round(12 * scale));
  /** Close (X) ~10% larger than reset for visibility */
  const closeIconPx = Math.max(12, Math.round(iconPx * 1.1));
  const btnPx = Math.max(22, Math.round(26 * scale));

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      role="dialog"
      aria-label={titleText}
      className="absolute flex flex-col overflow-hidden rounded-[14px] border border-[#27365C] bg-white shadow-[0_20px_40px_rgba(3,8,24,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]/40"
      style={{
        top: position.y,
        left: position.x,
        width,
        height: height ?? "auto",
        maxHeight: height != null ? undefined : "min(70vh,520px)",
        zIndex,
      }}
      onMouseDown={() => rootRef.current?.focus({ preventScroll: true })}
      onKeyDown={onRootKeyDown}
    >
      {/* Header — title bar + compact actions */}
      <div
        className="flex shrink-0 cursor-move select-none items-center gap-2 border-b border-[#27365C]/90 bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] pl-3 pr-2"
        style={{ paddingTop: sz(7), paddingBottom: sz(7) }}
        onMouseDown={onDragMouseDown}
        onDoubleClick={onHeaderDoubleClick}
        onContextMenu={onHeaderContextMenu}
      >
        <span
          className="min-w-0 flex-1 truncate font-semibold tracking-[0.02em] text-white"
          style={{ fontSize: sz(13), lineHeight: 1.25 }}
        >
          {titleText}
        </span>
        <div className="flex shrink-0 items-center gap-px">
          <button
            type="button"
            aria-label="Reset legend size"
            onClick={(e) => {
              e.stopPropagation();
              resetSize();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="inline-flex shrink-0 items-center justify-center rounded-full border-0 bg-[rgba(13,24,49,0.92)] p-0 text-[#ffffff] transition-colors hover:bg-[rgba(242,101,34,0.22)] hover:text-[#F26522] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]/45"
            style={{ width: btnPx, height: btnPx }}
          >
            <RotateCcw size={iconPx} strokeWidth={2.25} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Close legend"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="inline-flex shrink-0 items-center justify-center rounded-full border-0 bg-[rgba(13,24,49,0.92)] p-0 text-[#F26522] transition-colors hover:bg-[rgba(239,68,68,0.22)] hover:text-[#dc2626] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]/40"
            style={{ width: btnPx, height: btnPx }}
          >
            <X size={closeIconPx} strokeWidth={2.5} aria-hidden />
          </button>
        </div>
      </div>

      {thematic.type === "KPIs" && thematic.kpiConfig && (
        <div
          className="shrink-0 border-b border-gray-200 bg-white px-3"
          style={{
            paddingTop: sz(6),
            paddingBottom: sz(6),
            fontSize: sz(12),
            color: LEGEND_TEXT_MUTED,
          }}
        >
          KPI:{" "}
          <span style={{ color: LEGEND_TEXT, fontWeight: 600 }}>{thematic.kpiConfig.kpi}</span>
        </div>
      )}

      <div
        className={
          height != null
            ? "flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-white"
            : "flex max-h-[min(70vh,520px)] flex-col overflow-x-hidden overflow-y-auto bg-white"
        }
        style={{ padding: sz(10), gap: sz(6) }}
      >
        {type === "KPIs" && kpiConfig?.ranges && (
          <div className="flex flex-col" style={{ gap: sz(6) }}>
            {kpiConfig.ranges.map((range, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2"
                style={{ fontSize: sz(12) }}
              >
                <div className="flex min-w-0 items-center" style={{ gap: sz(8) }}>
                  <div
                    className="shrink-0 rounded border border-gray-300"
                    style={{
                      width: sz(14),
                      height: sz(14),
                      background: range.color,
                    }}
                  />
                  <span className="truncate" style={{ color: LEGEND_TEXT, fontWeight: 500 }}>
                    {range.label}
                  </span>
                </div>
                <span className="shrink-0 tabular-nums" style={{ fontSize: sz(11), color: LEGEND_TEXT_MUTED }}>
                  {range.min} – {range.max}
                </span>
              </div>
            ))}
          </div>
        )}

        {type !== "KPIs" && (
          <div className="flex flex-col" style={{ gap: sz(6) }}>
            {Object.entries(colors || {}).map(([key, color]) => (
              <div
                key={key}
                className="flex items-start"
                style={{ gap: sz(10), fontSize: sz(12) }}
              >
                <div
                  className="mt-0.5 shrink-0 rounded border border-gray-300"
                  style={{
                    width: sz(14),
                    height: sz(14),
                    background: color,
                  }}
                />
                <span className="min-w-0 break-words leading-snug" style={{ color: LEGEND_TEXT, fontWeight: 500 }}>
                  {key}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resize: right edge, bottom edge, SE corner */}
      <div
        className="absolute bottom-8 right-0 top-9 z-[2] w-2 cursor-ew-resize"
        onMouseDown={(e) => onResizeMouseDown(e, "e")}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 right-3 z-[2] h-2 cursor-ns-resize"
        onMouseDown={(e) => onResizeMouseDown(e, "s")}
        aria-hidden
      />
      {/* SE grip: square L-corner (horizontal + vertical segments), not a ring */}
      <div
        className={`absolute bottom-0 right-0 z-[3] h-4 w-4 cursor-nwse-resize border-b border-r border-[#F26522] transition-colors active:bg-[rgba(242,101,34,0.38)] ${
          seHandleActive
            ? "bg-[rgba(242,101,34,0.34)]"
            : "bg-transparent hover:bg-[rgba(242,101,34,0.14)]"
        }`}
        onMouseDown={(e) => onResizeMouseDown(e, "se")}
        aria-hidden
      />
    </div>
  );
};

export default LegendBoxV2;
