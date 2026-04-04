
import React, { useState, useRef, useEffect } from "react";

const LegendBox = ({ layer, thematic, onClose  }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y
    });
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  if (!thematic) return null;

  const { type, colors, kpiConfig } = thematic;

  return (
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: 220,
        background: "#ffffff",
        border: "1px solid #d1d5db",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 9999
      }}
    >
      {/* HEADER (drag handle) */}
     <div
      onMouseDown={onMouseDown}
      style={{
        padding: "8px 10px",
        cursor: "move",
        background: "#1f2937",
        color: "#fff",
        fontWeight: "600",
        fontSize: 13,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      {/* LEFT: TITLE */}
      <span>{type === "Boundary" ? "Boundary Legend" : `${layer} - ${type}`}</span>


      {/* RIGHT: CLOSE BUTTON */}
      <span
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
        }}
        style={{
          cursor: "pointer",
          fontSize: 14,
          color: "#60a5fa",        // blue-ish
          opacity: 0.6,            // subtle
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = 1;
          e.currentTarget.style.color = "#3b82f6"; // stronger blue
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = 0.6;
          e.currentTarget.style.color = "#60a5fa";
        }}
      >
        ✕
      </span>
    </div>

      {/* KPI INFO */}
     {thematic.type === "KPIs" && thematic.kpiConfig && (
      <div style={{
        padding: "6px 10px",
        fontSize: 12,
        color: "#374151"
      }}>
        KPI: {thematic.kpiConfig.kpi}
      </div>
    )}

      {/* TABLE */}
      <div style={{ padding: 8 }}>
        {/* KPI LEGEND (SPECIAL CASE) */}
        {type === "KPIs" && kpiConfig?.ranges && (
          kpiConfig.ranges.map((range, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6
              }}
            >
              {/* LEFT: color + label */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    background: range.color,
                    border: "1px solid #999",
                    borderRadius: 3
                  }}
                />
                <span style={{ fontSize: 12 }}>
                  {range.label}
                </span>
              </div>

              {/* RIGHT: range values */}
              <span style={{ fontSize: 11, color: "#6b7280" }}>
                {range.min} to {range.max}
              </span>
            </div>
          ))
        )}

        {/* NORMAL THEMATICS */}
        {type !== "KPIs" && Object.entries(colors || {}).map(([key, color]) => (
          <div key={key} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
            <div
              style={{
                width: 14,
                height: 14,
                background: color,
                border: "1px solid #999",
                borderRadius: 3
              }}
            />
            <span style={{ fontSize: 12 }}>{key}</span>
          </div>
        ))}

      </div>
    </div>
  );
};

export default LegendBox;