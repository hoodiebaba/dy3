import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Map, ChevronDown } from "lucide-react";
import MapActions from "../../store/actions/map-actions";
import AuthActions from "../../store/actions/auth-actions";
import { TELECOM_MAP_STYLE_OPTIONS } from "./Utils/telecomMapStyleOptions";
import { GIS_TOOLBAR_OUTER_CLASS, GIS_TOOLBAR_STRIP_ROW_CLASS } from "./Utils/telecomGisToolbarStyles";

/**
 * Second row below `TelecomMapGisToolbar` — same strip styling; map basemap picker.
 */
const TelecomMapGisSecondaryStrip = () => {
  const dispatch = useDispatch();
  const config = useSelector((state) => state.map.config);
  const [mapStyleOpen, setMapStyleOpen] = useState(false);

  const currentLabel =
    TELECOM_MAP_STYLE_OPTIONS.find((o) => o.value === config.mapView)?.label ?? "Map style";

  useEffect(() => {
    const close = () => setMapStyleOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div
      className={GIS_TOOLBAR_OUTER_CLASS}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className={GIS_TOOLBAR_STRIP_ROW_CLASS}>
        <div className="relative min-w-0 flex-1 sm:max-w-[320px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMapStyleOpen((v) => !v);
            }}
            className="inline-flex h-8 w-full max-w-full items-center justify-between gap-2 rounded-lg bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] px-3 text-xs font-semibold tracking-[0.04em] text-white transition hover:text-[#F26522]"
          >
            <span className="inline-flex min-w-0 items-center gap-2">
              <Map className="h-3.5 w-3.5 shrink-0 text-[#F26522]" aria-hidden />
              <span className="truncate">Map style</span>
              <span className="truncate text-white/70">· {currentLabel}</span>
            </span>
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${mapStyleOpen ? "rotate-180" : ""}`} aria-hidden />
          </button>

          {mapStyleOpen ? (
            <div
              className="absolute left-0 top-full z-[10060] mt-2 w-full min-w-[260px] max-w-[min(100%,320px)] rounded-[22px] border border-[#27365C] bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] p-2 text-white shadow-[0_20px_40px_rgba(3,8,24,0.42)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-h-64 overflow-y-auto">
                {TELECOM_MAP_STYLE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(MapActions.setMapConfig({ mapView: option.value }));
                      dispatch(AuthActions.setupConf(true, { mapView: option.value }));
                      setMapStyleOpen(false);
                    }}
                    className={`flex w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-[linear-gradient(180deg,#0F203D_0%,#0D1B36_100%)] ${
                      config.mapView === option.value ? "text-[#F26522]" : "text-white/90"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TelecomMapGisSecondaryStrip;
