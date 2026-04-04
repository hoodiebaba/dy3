import React from "react";
import { Layers3 } from "lucide-react";
import { TELECOM_MAP_STYLE_OPTIONS } from "./Utils/telecomMapStyleOptions";

/** Datayog `gis-engine/page.js` — `RightSideBtnClass` */
export const TELECOM_GIS_NAV_BTN_CLASS =
  "flex h-[46px] w-[46px] items-center justify-center rounded-[16px] border border-[#27365C] bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] text-white shadow-[0_18px_36px_rgba(3,8,24,0.42)] transition-all duration-200 hover:border-[#F26522]/40 hover:bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] hover:text-[#F26522] focus:outline-none";

const LIGHT_MAP_STYLES = new Set(["outdoors", "voyager", "osm", "light"]);

/**
 * Datayog `MapStyleRightControl` — Layers button + thumbnails `absolute right-full top-1/2 -translate-y-1/2`.
 */
export function TelecomMapStyleRightControl({
  mapStyleKeyForUi,
  onSelectMapStyle,
  mapStylePickerOpen,
  setMapStylePickerOpen,
}) {
  const isCurrentMapLight = LIGHT_MAP_STYLES.has(mapStyleKeyForUi);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        title="Map Style"
        aria-expanded={mapStylePickerOpen}
        aria-controls="telecom-map-style-strip"
        onClick={() => setMapStylePickerOpen((o) => !o)}
        className={`${TELECOM_GIS_NAV_BTN_CLASS} ${
          mapStylePickerOpen ? "border-[#F26522]/45 bg-[rgba(18,28,58,0.96)] text-[#F26522]" : ""
        }`}
      >
        <Layers3 className="h-5 w-5" aria-hidden />
      </button>

      {mapStylePickerOpen ? (
        <div
          id="telecom-map-style-strip"
          className="absolute right-full top-1/2 z-[10051] mr-3 flex -translate-y-1/2 items-center gap-3"
          role="group"
          aria-label="Map style options"
        >
          {TELECOM_MAP_STYLE_OPTIONS.map((opt) => {
            const active = mapStyleKeyForUi === opt.value;
            const text = opt.pickerLabel ?? opt.label;
            const ps = opt.previewStyle;
            const labelClass = active
              ? "font-bold text-[#F26522]"
              : isCurrentMapLight
                ? "font-bold text-[#0f172a] group-hover:text-[#F26522]"
                : "font-bold text-white group-hover:text-[#F26522]";
            return (
              <div
                key={opt.value}
                className="group relative flex h-[46px] w-[46px] shrink-0 items-center justify-center"
              >
                <span
                  className={`pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold tracking-[0.08em] transition-colors duration-200 ${labelClass}`}
                >
                  {text}
                </span>
                <button
                  type="button"
                  title={text}
                  onClick={() => onSelectMapStyle(opt.value)}
                  className={`group relative flex h-[46px] w-[46px] items-center justify-center overflow-hidden rounded-[16px] border bg-[rgba(8,18,36,0.94)] text-white transition-all duration-200 focus:outline-none ${
                    active
                      ? "border-[#F26522]/55 text-[#F26522]"
                      : "border-[#27365C] text-white/82 hover:border-[#F26522]/45 hover:text-[#F26522]"
                  }`}
                >
                  <span
                    className="absolute inset-[1px] rounded-[14px]"
                    style={
                      ps
                        ? {
                            backgroundColor: ps.backgroundColor,
                            backgroundImage: ps.backgroundImage,
                          }
                        : undefined
                    }
                  />
                </button>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
