import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Building2,
  MapPinned,
  Filter,
  Layers3,
  Search,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import MapActions from "../../store/actions/map-actions";
import LeftFilters from "./LeftFilters";
import AddMapLayersPanel from "./AddMapLayersPanel";
import { GIS_TOOLBAR_OUTER_CLASS, GIS_TOOLBAR_STRIP_ROW_CLASS } from "./Utils/telecomGisToolbarStyles";

/** Suggestions list only after this many typed characters (no default full list). */
const MIN_SEARCH_CHARS = 5;

/**
 * Top GIS strip (Datayog-style layout).
 * Search behaviour aligned with github `RightFilters.jsx` (sarfraz-raja/dplus_frontend).
 */
const TelecomMapGisToolbar = () => {
  const dispatch = useDispatch();
  const rawCells = useSelector((state) => state.map.rawCells || []);
  const saveMapFilters = useSelector((state) => state.auth?.commonConfig?.saveMapFilters);

  const [filterOpen, setFilterOpen] = useState(false);
  const [layerOpen, setLayerOpen] = useState(false);
  /** Suggestions + “Selected” chips while picking (before / between applies). */
  const [searchOpen, setSearchOpen] = useState(false);
  /** Last apply result: summary dropdown only after Search is used. */
  const [appliedSummary, setAppliedSummary] = useState(null);
  /** Chevron panel for applied summary (site / cell / not found + site cells list). */
  const [summaryPanelOpen, setSummaryPanelOpen] = useState(false);

  const [siteSearch, setSiteSearch] = useState("");
  const [searchMode, setSearchMode] = useState("site");
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  const hasAppliedFilters = Boolean(
    saveMapFilters && saveMapFilters !== "{}" && saveMapFilters !== "null",
  );
  const filterActive = filterOpen || hasAppliedFilters;
  const layerActive = layerOpen;
  const hasValue = Boolean(siteSearch.trim() || selectedSite || selectedCell);
  const showClear = hasValue || appliedSummary !== null;
  const searchButtonActive = hasValue;
  const showSummaryChevron = appliedSummary !== null;

  const selectedCount = (selectedSite ? 1 : 0) + (selectedCell ? 1 : 0);

  const toolbarRootRef = useRef(null);

  const cellsForAppliedSite = useMemo(() => {
    if (!appliedSummary || appliedSummary.kind !== "site") return [];
    return rawCells
      .filter((c) => c.site_name === appliedSummary.siteName)
      .sort((a, b) => String(a.cell_id ?? "").localeCompare(String(b.cell_id ?? "")));
  }, [rawCells, appliedSummary]);

  const handleResetSearch = useCallback(() => {
    setSelectedSite(null);
    setSelectedCell(null);
    setSiteSearch("");
    setAppliedSummary(null);
    setSummaryPanelOpen(false);
    setSearchOpen(false);
    dispatch(MapActions.setHighlightedCell(null));
    dispatch(MapActions.setSelectedCell(null));
  }, [dispatch]);

  const siteList = useMemo(() => [...new Set(rawCells.map((c) => c.site_name))], [rawCells]);

  const queryOk = siteSearch.trim().length >= MIN_SEARCH_CHARS;

  const filteredSites = useMemo(() => {
    const q = siteSearch.trim();
    if (q.length < MIN_SEARCH_CHARS) return [];
    return siteList.filter((site) => site?.toLowerCase().includes(q.toLowerCase()));
  }, [siteList, siteSearch]);

  const filteredCells = useMemo(() => {
    const q = siteSearch.trim();
    if (q.length < MIN_SEARCH_CHARS) return [];
    return rawCells
      .filter(
        (cell) =>
          (!selectedSite || cell.site_name === selectedSite) &&
          cell.cell_id?.toLowerCase().includes(q.toLowerCase()),
      )
      .slice(0, 50);
  }, [rawCells, selectedSite, siteSearch]);

  const showResults =
    queryOk && (searchMode === "site" ? filteredSites.length > 0 : filteredCells.length > 0);

  const hasSelection = Boolean(selectedSite || selectedCell);

  /** Picker: suggestions and/or chips while editing; not the post-apply summary panel. */
  const showPickerPanel = searchOpen && (showResults || hasSelection);

  useEffect(() => {
    const onDocClick = (e) => {
      if (toolbarRootRef.current?.contains(e.target)) return;
      setFilterOpen(false);
      setLayerOpen(false);
      setSearchOpen(false);
      setSummaryPanelOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    const qOk = siteSearch.trim().length >= MIN_SEARCH_CHARS;
    const hasList =
      qOk && (searchMode === "site" ? filteredSites.length > 0 : filteredCells.length > 0);
    const hasSel = Boolean(selectedSite || selectedCell);
    if (searchOpen && !hasList && !hasSel) {
      setSearchOpen(false);
    }
  }, [
    searchOpen,
    siteSearch,
    searchMode,
    filteredSites.length,
    filteredCells.length,
    selectedSite,
    selectedCell,
  ]);

  const SearchModeIcon = searchMode === "site" ? Building2 : MapPinned;

  const inputPlaceholder =
    selectedSite || selectedCell ? "Filter further…" : `Search ${searchMode}…`;

  const findCellFromQuery = useCallback(() => {
    const q = siteSearch.trim();
    if (q.length < MIN_SEARCH_CHARS) return null;
    const pool = rawCells.filter((c) => !selectedSite || c.site_name === selectedSite);
    const exact = pool.find((c) => c.cell_id?.toLowerCase() === q.toLowerCase());
    if (exact) return exact;
    const matches = pool.filter((c) => c.cell_id?.toLowerCase().includes(q.toLowerCase()));
    return matches.length === 1 ? matches[0] : null;
  }, [rawCells, selectedSite, siteSearch]);

  const zoomToCell = useCallback(
    (cell) => {
      dispatch(MapActions.setHighlightedCell(cell.cell_id));
      dispatch(MapActions.setSelectedCell(cell));
      setSelectedCell(cell);
      setSelectedSite(cell.site_name ?? null);
      setSearchMode("cell");
      dispatch(
        MapActions.setViewState({
          longitude: Number(cell.longitude),
          latitude: Number(cell.latitude),
          zoom: 20,
          transitionDuration: 1200,
        }),
      );
      setAppliedSummary({ kind: "cell", cell });
    },
    [dispatch],
  );

  /** Mirrors upstream RightFilters Apply & Zoom; sets appliedSummary / not-found. */
  const applySearchZoom = useCallback(() => {
    setFilterOpen(false);
    setLayerOpen(false);
    setSummaryPanelOpen(false);

    if (searchMode === "site") {
      if (!selectedSite) {
        if (queryOk && filteredSites.length === 0) {
          setAppliedSummary({ kind: "not_found", searchMode: "site", query: siteSearch.trim() });
          dispatch(MapActions.setHighlightedCell(null));
          setSummaryPanelOpen(true);
        }
        setSearchOpen(false);
        return;
      }
      const target = rawCells.find((c) => c.site_name === selectedSite);
      if (!target) {
        setAppliedSummary({ kind: "not_found", searchMode: "site", query: selectedSite });
        dispatch(MapActions.setHighlightedCell(null));
        setSummaryPanelOpen(true);
        setSearchOpen(false);
        return;
      }
      dispatch(MapActions.setHighlightedCell(target.cell_id));
      dispatch(MapActions.setSelectedCell(null));
      setSelectedCell(null);
      dispatch(
        MapActions.setViewState({
          longitude: Number(target.longitude),
          latitude: Number(target.latitude),
          zoom: 14,
          transitionDuration: 1200,
        }),
      );
      setAppliedSummary({ kind: "site", siteName: selectedSite });
      setSearchOpen(false);
      return;
    }

    /* cell */
    const cell = selectedCell || findCellFromQuery();
    if (!cell) {
      setAppliedSummary({
        kind: "not_found",
        searchMode: "cell",
        query: siteSearch.trim(),
      });
      dispatch(MapActions.setHighlightedCell(null));
      setSearchOpen(false);
      setSummaryPanelOpen(true);
      return;
    }
    setSelectedCell(cell);
    dispatch(MapActions.setHighlightedCell(cell.cell_id));
    dispatch(MapActions.setSelectedCell(cell));
    dispatch(
      MapActions.setViewState({
        longitude: Number(cell.longitude),
        latitude: Number(cell.latitude),
        zoom: 20,
        transitionDuration: 1200,
      }),
    );
    setAppliedSummary({ kind: "cell", cell });
    setSearchOpen(false);
  }, [
    dispatch,
    findCellFromQuery,
    filteredSites.length,
    queryOk,
    rawCells,
    searchMode,
    selectedCell,
    selectedSite,
    siteSearch,
  ]);

  const onSummaryChevronClick = (e) => {
    e.stopPropagation();
    if (!showSummaryChevron) return;
    setSummaryPanelOpen((o) => !o);
    setFilterOpen(false);
    setLayerOpen(false);
    setSearchOpen(false);
  };

  return (
    <div
      ref={toolbarRootRef}
      className={GIS_TOOLBAR_OUTER_CLASS}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className={GIS_TOOLBAR_STRIP_ROW_CLASS}>
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSearchMode((prev) => (prev === "site" ? "cell" : "site"));
              setSearchOpen(true);
              setFilterOpen(false);
              setLayerOpen(false);
            }}
            className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] px-1.5 text-[10px] font-semibold tracking-[0.04em] text-white transition-colors hover:text-[#F26522]"
          >
            <SearchModeIcon className="h-2.5 w-2.5 text-[#F26522]" aria-hidden />
            <span className="capitalize">{searchMode}</span>
            <ChevronDown className="h-2.5 w-2.5 opacity-80" aria-hidden />
          </button>

          <button
            type="button"
            title="Filters"
            onClick={(e) => {
              e.stopPropagation();
              setFilterOpen((v) => !v);
              setLayerOpen(false);
              setSearchOpen(false);
              setSummaryPanelOpen(false);
            }}
            className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors ${
              filterActive
                ? "border-[#F26522]/45 bg-[rgba(31,21,26,0.96)] text-[#F26522]"
                : "border-[#27365C] bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] text-white/75 hover:border-[#F26522]/40 hover:text-[#F26522]"
            }`}
          >
            <Filter className="h-3.5 w-3.5" aria-hidden />
          </button>

          <button
            type="button"
            title="Layers"
            onClick={(e) => {
              e.stopPropagation();
              setLayerOpen((v) => !v);
              setFilterOpen(false);
              setSearchOpen(false);
              setSummaryPanelOpen(false);
            }}
            className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors ${
              layerActive
                ? "border-[#F26522]/45 bg-[rgba(31,21,26,0.96)] text-[#F26522]"
                : "border-[#27365C] bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] text-white/75 hover:border-[#F26522]/40 hover:text-[#F26522]"
            }`}
          >
            <Layers3 className="h-3.5 w-3.5" aria-hidden />
          </button>

          <div className="flex min-h-7 min-w-0 flex-1 basis-0 items-center">
            <input
              type="text"
              value={siteSearch}
              onFocus={(e) => {
                e.stopPropagation();
                setSearchOpen(true);
                setFilterOpen(false);
                setLayerOpen(false);
                setSummaryPanelOpen(false);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSearchOpen(true);
                setFilterOpen(false);
                setLayerOpen(false);
                setSummaryPanelOpen(false);
              }}
              onChange={(e) => {
                e.stopPropagation();
                setSiteSearch(e.target.value);
                setSearchOpen(true);
                setFilterOpen(false);
                setLayerOpen(false);
                setSummaryPanelOpen(false);
              }}
              placeholder={inputPlaceholder}
              className="box-border h-7 w-full min-w-0 border-0 bg-transparent px-0.5 py-0 font-mono text-[11px] font-medium leading-7 text-[#ffffff] outline-none placeholder:font-sans placeholder:text-[10px] placeholder:leading-7 placeholder:text-white/38"
            />
          </div>
        </div>

        {/* Order: summary dropdown → clear → search (desktop + mobile) */}
        <div className="flex shrink-0 items-center gap-1">
          <div className="relative h-7 w-7 shrink-0">
            <button
              type="button"
              title={summaryPanelOpen ? "Hide last search" : "Last search"}
              tabIndex={showSummaryChevron ? 0 : -1}
              onClick={onSummaryChevronClick}
              className={`absolute inset-0 inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#F26522] bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] text-[#ffffff] shadow-sm transition-colors hover:border-[#F26522] hover:bg-[rgba(31,21,26,0.96)] ${
                !showSummaryChevron ? "invisible pointer-events-none" : ""
              }`}
            >
              {summaryPanelOpen ? (
                <ChevronUp className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} aria-hidden />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} aria-hidden />
              )}
            </button>
          </div>
          <div className="relative h-7 w-7 shrink-0">
            <button
              type="button"
              title="Reset search"
              tabIndex={showClear ? 0 : -1}
              onClick={(e) => {
                e.stopPropagation();
                if (!showClear) return;
                handleResetSearch();
              }}
              className={`absolute inset-0 inline-flex h-7 w-7 items-center justify-center rounded-md text-red-400 transition-colors hover:bg-white/5 hover:text-red-300 ${
                !showClear ? "invisible pointer-events-none" : ""
              }`}
            >
              <X className="h-3 w-3" strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        </div>

        <button
          type="button"
          title="Apply & zoom"
          onClick={(e) => {
            e.stopPropagation();
            applySearchZoom();
          }}
          className={`ml-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors ${
            searchButtonActive
              ? "border-[#F26522]/45 bg-[rgba(31,21,26,0.96)] text-[#F26522]"
              : "border-[#27365C] bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] text-white hover:border-[#F26522]/40 hover:text-[#F26522]"
          }`}
        >
          <Search className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      {filterOpen && (
        <div className="absolute left-0 top-full z-[10060] mt-2 w-full min-w-0">
          <LeftFilters mode="floating" onClose={() => setFilterOpen(false)} />
        </div>
      )}

      {layerOpen && (
        <div className="absolute left-0 top-full z-[10061] mt-2 w-full min-w-0">
          <AddMapLayersPanel mode="floating" onClose={() => setLayerOpen(false)} />
        </div>
      )}

      {showPickerPanel ? (
        <div className="absolute left-0 top-full z-[10055] mt-1.5 flex w-full flex-col gap-1.5">
          {hasSelection && (
            <div className="rounded-lg border border-[#F26522] bg-[linear-gradient(180deg,#070d18_0%,#0B1730_100%)] p-2 text-[#ffffff] shadow-[0_12px_28px_rgba(3,8,24,0.5)]">
              <div className="mb-1.5 flex items-center justify-between border-b border-[#F26522]/35 pb-1">
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#ffffff]">
                  Selected
                </span>
                <span className="tabular-nums text-[10px] font-semibold text-[#ffffff]/80">{selectedCount}</span>
              </div>
              <div className="flex flex-col gap-1">
                {selectedSite && (
                  <div className="flex items-center gap-1.5 rounded-md border border-[#F26522]/50 bg-[rgba(61,35,24,0.45)] px-2 py-1">
                    <span className="shrink-0 rounded bg-[#3d2318] px-1 py-px text-[8px] font-bold uppercase tracking-wide text-[#ffffff]">
                      Site
                    </span>
                    <span className="min-w-0 flex-1 truncate font-mono text-[10px] font-semibold leading-tight text-[#ffffff]">
                      {selectedSite}
                    </span>
                    <button
                      type="button"
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#4a2a22] text-white transition-colors hover:bg-[#5c342a]"
                      title="Remove site"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSite(null);
                        setSelectedCell(null);
                      }}
                    >
                      <X className="h-2.5 w-2.5" strokeWidth={2.5} aria-hidden />
                    </button>
                  </div>
                )}
                {selectedCell && (
                  <div className="flex items-center gap-1.5 rounded-md border border-[#F26522]/50 bg-[rgba(61,35,24,0.45)] px-2 py-1">
                    <span className="shrink-0 rounded bg-[#3d2318] px-1 py-px text-[8px] font-bold uppercase tracking-wide text-[#ffffff]">
                      Cell
                    </span>
                    <span className="min-w-0 flex-1 truncate font-mono text-[10px] font-semibold leading-tight text-[#ffffff]">
                      {selectedCell.cell_id}
                    </span>
                    <button
                      type="button"
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#4a2a22] text-white transition-colors hover:bg-[#5c342a]"
                      title="Remove cell"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCell(null);
                      }}
                    >
                      <X className="h-2.5 w-2.5" strokeWidth={2.5} aria-hidden />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {showResults ? (
            <div className="w-full rounded-xl border border-[#F26522] bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] p-1.5 text-[#ffffff] shadow-[0_12px_28px_rgba(3,8,24,0.38)]">
              <div className="max-h-44 overflow-y-auto">
                {searchMode === "site" &&
                  filteredSites.map((site, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedCell) return;
                        setSelectedSite(site);
                        setSiteSearch("");
                      }}
                      disabled={Boolean(selectedCell)}
                      className={`flex w-full rounded-md px-2 py-1 text-left text-[11px] font-medium leading-snug text-[#ffffff] transition-colors hover:bg-[linear-gradient(180deg,#0F203D_0%,#0D1B36_100%)] ${
                        selectedCell ? "cursor-not-allowed opacity-40" : ""
                      }`}
                    >
                      {site}
                    </button>
                  ))}
                {searchMode === "cell" &&
                  filteredCells.map((cell, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCell(cell);
                        setSiteSearch("");
                      }}
                      className="flex w-full flex-col rounded-md px-2 py-1 text-left transition-colors hover:bg-[linear-gradient(180deg,#0F203D_0%,#0D1B36_100%)]"
                    >
                      <span className="font-mono text-[11px] font-semibold leading-tight text-[#ffffff]">
                        {cell.cell_id}
                      </span>
                      <span className="text-[10px] leading-tight text-[#ffffff]/75">({cell.site_name})</span>
                    </button>
                  ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {summaryPanelOpen && appliedSummary ? (
        <div className="absolute left-0 top-full z-[10056] mt-1.5 w-full min-w-0 rounded-lg border border-[#F26522] bg-[linear-gradient(180deg,#070d18_0%,#0B1730_100%)] p-2 text-[#ffffff] shadow-[0_12px_28px_rgba(3,8,24,0.5)]">
          {appliedSummary.kind === "not_found" && (
            <div className="px-1 py-2">
              <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#F26522]">Not found</div>
              <p className="mt-1 font-mono text-[11px] text-white/90">
                No matching {appliedSummary.searchMode} for{" "}
                <span className="text-[#F26522]">{appliedSummary.query || "—"}</span>
              </p>
            </div>
          )}
          {appliedSummary.kind === "site" && (
            <>
              <div className="mb-2 border-b border-[#F26522]/35 pb-1.5">
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#ffffff]">Applied site</span>
                <p className="mt-0.5 truncate font-mono text-[11px] font-semibold text-[#F26522]">
                  {appliedSummary.siteName}
                </p>
                <p className="mt-1 text-[9px] text-white/65">Tap a cell to zoom</p>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {cellsForAppliedSite.length === 0 ? (
                  <p className="py-2 text-[10px] text-white/60">No cells for this site.</p>
                ) : (
                  cellsForAppliedSite.map((cell) => (
                    <button
                      key={cell.cell_id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        zoomToCell(cell);
                      }}
                      className="flex w-full flex-col rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[linear-gradient(180deg,#0F203D_0%,#0D1B36_100%)]"
                    >
                      <span className="font-mono text-[11px] font-semibold text-[#ffffff]">{cell.cell_id}</span>
                      <span className="text-[10px] text-white/65">{cell.site_name}</span>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
          {appliedSummary.kind === "cell" && (
            <div className="px-1 py-1">
              <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#ffffff]">Applied cell</span>
              <p className="mt-1 font-mono text-[12px] font-semibold text-[#F26522]">{appliedSummary.cell.cell_id}</p>
              <p className="mt-0.5 text-[10px] text-white/75">({appliedSummary.cell.site_name})</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default TelecomMapGisToolbar;
