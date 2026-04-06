import React from "react";
import { Layers3 } from "lucide-react";
import { TELECOM_MAP_STYLE_OPTIONS } from "./Utils/telecomMapStyleOptions";

/** Datayog `gis-engine/page.js` — `RightSideBtnClass` */
export const TELECOM_GIS_NAV_BTN_CLASS =
  "flex h-[46px] w-[46px] items-center justify-center rounded-[16px] border border-[#27365C] bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] text-white shadow-[0_18px_36px_rgba(3,8,24,0.42)] transition-all duration-200 hover:border-[#F26522]/40 hover:bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] hover:text-[#F26522] focus:outline-none";

const LIGHT_MAP_STYLES = new Set(["outdoors", "voyager", "osm", "light"]);

/**
 * Datayog `MapStyleRightControl` — Layers + thumbnails.
 * Small screens: 3×2 grid in-flow to the left of Layers; bottom thumbnail row aligns with the Layers button (`items-end`).
 * md+: thumbnails `absolute right-full top-1/2 -translate-y-1/2` beside the button.
 */
export function TelecomMapStyleRightControl({
  mapStyleKeyForUi,
  onSelectMapStyle,
  mapStylePickerOpen,
  setMapStylePickerOpen,
  stripDomId = "telecom-map-style-strip",
}) {
  const isCurrentMapLight = LIGHT_MAP_STYLES.has(mapStyleKeyForUi);

  return (
    <div
      className={`relative max-md:flex max-md:flex-row-reverse max-md:items-end max-md:gap-2 max-md:justify-end ${
        mapStylePickerOpen ? "z-[10055]" : ""
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        title="Map Style"
        aria-expanded={mapStylePickerOpen}
        aria-controls={stripDomId}
        onClick={() => setMapStylePickerOpen((o) => !o)}
        className={`shrink-0 ${TELECOM_GIS_NAV_BTN_CLASS} ${
          mapStylePickerOpen ? "border-[#F26522]/45 bg-[rgba(18,28,58,0.96)] text-[#F26522]" : ""
        }`}
      >
        <Layers3 className="h-5 w-5" aria-hidden />
      </button>

      {mapStylePickerOpen ? (
        <div
          id={stripDomId}
          className="relative z-[10051] max-w-[min(calc(100vw-6.5rem),15.5rem)] translate-y-0 md:absolute md:right-full md:top-1/2 md:mr-3 md:max-w-[calc(100vw-5rem)] md:-translate-y-1/2 lg:max-w-none"
          role="group"
          aria-label="Map style options"
        >
          <div
            className="grid grid-cols-3 gap-x-2 gap-y-7 sm:gap-x-2.5 md:flex md:items-center md:gap-3 md:gap-y-0"
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
                className="group relative mx-auto flex w-full min-w-0 max-w-[52px] flex-col items-center gap-0.5 md:mx-0 md:h-[46px] md:w-[46px] md:max-w-none md:justify-center md:gap-0"
              >
                <span
                  className={`pointer-events-none w-full min-h-[1.125rem] text-center text-[8px] font-semibold leading-tight tracking-[0.08em] transition-colors duration-200 max-md:line-clamp-2 md:absolute md:-top-4 md:left-1/2 md:min-h-0 md:w-auto md:-translate-x-1/2 md:whitespace-nowrap md:text-[9px] ${labelClass}`}
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
        </div>
      ) : null}
    </div>
  );
}
