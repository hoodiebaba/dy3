import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, X, ChevronDown, Check } from "lucide-react";
import MapActions from "../../store/actions/map-actions";
import AuthActions from "../../store/actions/auth-actions";

const cbClass =
  "h-3.5 w-3.5 shrink-0 rounded border border-gray-400 bg-transparent text-[#F26522] accent-[#F26522] focus:ring-1 focus:ring-[#F26522]/40";

/** Datayog `gis-engine/page.js` — filter checkbox */
const dy3FilterCbClass =
  "h-4 w-4 appearance-none rounded-[4px] border border-white/30 bg-transparent checked:border-[#F26522] checked:bg-[#F26522]";

/** Compact — matches GIS toolbar / search strip scale */
const dy3FilterCbCompact =
  "h-3 w-3 shrink-0 appearance-none rounded-[3px] border border-white/30 bg-transparent checked:border-[#F26522] checked:bg-[#F26522]";

const flattenRegionBands = (group) => {
  const rows = [];
  for (const tb of group?.child || []) {
    for (const col of tb.columnName || []) {
      rows.push({ parent: tb.name, name: col.name });
    }
  }
  return rows;
};

/** True when meta looks like 2G/3G/… band tree; false ⇒ use flat region-style checklist */
const groupUsesTechnologyBands = (group) => {
  const children = group?.child || [];
  if (!children.length) return false;
  return children.some((tb) => {
    const raw = String(tb.name || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");
    return (
      /^[2345]g$/.test(raw) ||
      raw.includes("lte") ||
      raw.includes("gsm") ||
      raw === "nr" ||
      raw.includes("umts")
    );
  });
};

const getSectionChildNames = (group) => (group?.child || []).map((c) => c.name);

const allSelectedInSection = (group, selected) => {
  const children = group?.child || [];
  if (!children.length) return false;
  return children.every((tb) => {
    const opts = tb.columnName?.map((b) => b.name) || [];
    const sel = selected[tb.name] || [];
    return opts.length > 0 && opts.every((o) => sel.includes(o));
  });
};

const LeftFilters = ({ mode = "toolbar", onClose }) => {
  const dispatch = useDispatch();

  const allFilters = useSelector((state) => state.map.telecomFilterMeta);
  const mapConfig = useSelector((state) => state.map.config);
  const activeThematic = useSelector((state) => state.map.activeThematic);
  const saveMapFilters = useSelector((state) => state.auth?.commonConfig?.saveMapFilters);

  const [selected, setSelected] = useState({});
  const [showLeftFilters, setShowLeftFilters] = useState(false);
  const [openTech, setOpenTech] = useState({});
  const [openGroup, setOpenGroup] = useState({});
  const [siteSearch, setSiteSearch] = useState("");
  /** Floating UI: which `d1` group.parent is open on the right (stable vs slugKey collisions) */
  const [activeSectionParent, setActiveSectionParent] = useState(null);

  const d1 = allFilters?.d1 || [];

  const activeGroup = useMemo(() => {
    if (!d1.length || !activeSectionParent) return null;
    return d1.find((g) => g.parent === activeSectionParent) ?? null;
  }, [d1, activeSectionParent]);

  /** Restore draft from last applied filters whenever floating panel is shown / saved config updates */
  useEffect(() => {
    if (mode !== "floating") return;
    try {
      if (!saveMapFilters || saveMapFilters === "{}" || saveMapFilters === "null") {
        setSelected({});
        setSiteSearch("");
        return;
      }
      const parsed = JSON.parse(saveMapFilters);
      if (!parsed || typeof parsed !== "object") {
        setSelected({});
        setSiteSearch("");
        return;
      }
      const next = { ...parsed };
      const site = next.site_name;
      delete next.site_name;
      setSelected(next);
      if (Array.isArray(site) && site[0]) setSiteSearch(String(site[0]));
      else setSiteSearch("");
    } catch {
      setSelected({});
      setSiteSearch("");
    }
  }, [mode, saveMapFilters]);

  const toggleTech = (name) => {
    setOpenTech((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  /** At most one technology row expanded (2G / 3G / …) */
  const toggleTechExclusive = useCallback((blockName, siblingNames) => {
    setOpenTech((prev) => {
      const next = {};
      siblingNames.forEach((n) => {
        next[n] = false;
      });
      const wasOpen = Boolean(prev[blockName]);
      if (!wasOpen) next[blockName] = true;
      return next;
    });
  }, []);

  const toggleGroup = (name) => {
    setOpenGroup((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleCheck = (parent, value) => {
    setSelected((prev) => {
      const existing = prev[parent] || [];
      if (existing.includes(value)) {
        return { ...prev, [parent]: existing.filter((v) => v !== value) };
      }
      return { ...prev, [parent]: [...existing, value] };
    });
  };

  const handleSubmit = useCallback(() => {
    const payload = { ...selected };

    if (siteSearch.trim()) {
      payload.site_name = [siteSearch.trim()];
    }

    dispatch(MapActions.getMultiVendorCells(payload));

    dispatch(
      AuthActions.setupConf(true, {
        mapScale: mapConfig.mapScale,
        mapView: mapConfig.mapView,
        saveMapFilters: JSON.stringify(payload),
        saveThematics: JSON.stringify(activeThematic),
      })
    );

    setShowLeftFilters(false);
    if (mode === "floating") onClose?.();
  }, [selected, siteSearch, dispatch, mapConfig, activeThematic, mode, onClose]);

  const clearGlobalFilters = useCallback(() => {
    setSelected({});
    setSiteSearch("");
    dispatch(MapActions.getMultiVendorCells({}));
  }, [dispatch]);

  const toggleAllInSection = useCallback((group) => {
    setSelected((prev) => {
      const allOn = allSelectedInSection(group, prev);
      const next = { ...prev };
      for (const techBlock of group.child || []) {
        const allBands = techBlock.columnName?.map((b) => b.name) || [];
        next[techBlock.name] = allOn ? [] : allBands;
      }
      return next;
    });
    setActiveSectionParent(group.parent);
  }, []);

  const clearActiveSectionDraft = useCallback(() => {
    if (!activeGroup) return;
    const names = getSectionChildNames(activeGroup);
    setSelected((prev) => {
      const next = { ...prev };
      names.forEach((n) => {
        delete next[n];
      });
      return next;
    });
  }, [activeGroup]);

  useEffect(() => {
    if (allFilters?.d1) {
      const initial = {};
      allFilters.d1.forEach((g) => {
        initial[g.parent] = true;
      });
      setOpenGroup(initial);
    }
  }, [allFilters]);

  const filterBody = (
    <>
      <div className="mb-4 flex gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 rounded bg-blue-600 py-2 text-sm text-white hover:bg-blue-700"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={() => {
            clearGlobalFilters();
            setShowLeftFilters(false);
            if (mode === "floating") onClose?.();
          }}
          className="flex-1 rounded bg-gray-400 py-2 text-sm text-white hover:bg-gray-500"
        >
          Clear
        </button>
      </div>

      {d1.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-2 rounded border p-2">
          <div
            className="flex cursor-pointer items-center justify-between rounded p-1 hover:bg-gray-100"
            onClick={() => toggleGroup(group.parent)}
            onKeyDown={(e) => e.key === "Enter" && toggleGroup(group.parent)}
            role="button"
            tabIndex={0}
          >
            <span className="font-medium">{group.parent}</span>
            <span className="select-none text-sm">{openGroup[group.parent] ? "▲" : "▼"}</span>
          </div>

          {openGroup[group.parent] && (
            <div className="mt-2 rounded border p-2">
              {group.child?.map((techBlock, techIndex) => {
                const isTechSelected =
                  selected[techBlock.name]?.length === techBlock.columnName?.length;

                return (
                  <div key={techIndex} className="mb-3">
                    <div
                      className="flex cursor-pointer items-center justify-between rounded p-1 hover:bg-gray-100"
                      onClick={() => toggleTech(techBlock.name)}
                      onKeyDown={(e) => e.key === "Enter" && toggleTech(techBlock.name)}
                      role="button"
                      tabIndex={0}
                    >
                      <label
                        className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-400"
                          checked={isTechSelected}
                          onChange={() => {
                            const allBands = techBlock.columnName.map((b) => b.name);
                            setSelected((prev) => ({
                              ...prev,
                              [techBlock.name]: isTechSelected ? [] : allBands,
                            }));
                          }}
                        />
                        {techBlock.name}
                      </label>
                      <span className="select-none text-xs">{openTech[techBlock.name] ? "▲" : "▼"}</span>
                    </div>

                    {openTech[techBlock.name] && (
                      <div className="mt-2 max-h-[200px] overflow-y-auto rounded border p-2">
                        {techBlock.columnName?.map((band, bandIndex) => (
                          <label key={bandIndex} className="mb-1 flex cursor-pointer items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              className="rounded border-gray-400"
                              checked={selected[techBlock.name]?.includes(band.name) || false}
                              onChange={() => handleCheck(techBlock.name, band.name)}
                            />
                            {band.name}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </>
  );

  /* ---------- Datayog-style floating (new toolbar only) ---------- */
  if (mode === "floating") {
    const toggleFilterSection = (parentLabel) => {
      setActiveSectionParent((cur) => (cur === parentLabel ? null : parentLabel));
    };

    const regionRows = activeGroup ? flattenRegionBands(activeGroup) : [];
    const useFlatRegionLayout = activeGroup && !groupUsesTechnologyBands(activeGroup);

    return (
      <div onClick={(e) => e.stopPropagation()} className="relative w-full min-w-0 text-white">
        {/*
          Datayog `app/(portal)/gis-engine/page.js` (SearchPanel) — filterOpen block,
          classes copied verbatim; data from dy3 `telecomFilterMeta.d1` + Redux `selected`.
          Full toolbar width: right query panel aligns with search strip (same as search dropdown `w-full`).
        */}
        <div className="flex w-full min-w-0 items-start gap-2">
          <div className="flex w-[min(42vw,172px)] shrink-0 flex-col gap-1 overflow-visible pr-0.5 py-0.5">
            {d1.map((group) => {
              const active = activeSectionParent === group.parent;
              const allOn = allSelectedInSection(group, selected);
              return (
                <div
                  key={group.parent}
                  className="group rounded-xl border border-[#27365C] bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] px-2 py-1 text-white shadow-[0_8px_20px_rgba(3,8,24,0.35)]"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex min-w-0 flex-1 items-center gap-1.5">
                      <span className="inline-flex h-3.5 shrink-0 items-center justify-center self-center">
                        <input
                          type="checkbox"
                          checked={allOn}
                          onChange={() => toggleAllInSection(group)}
                          onClick={(e) => e.stopPropagation()}
                          className={`${dy3FilterCbCompact} m-0 align-middle`}
                        />
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFilterSection(group.parent)}
                        className="flex min-w-0 flex-1 items-center py-0 text-left"
                      >
                        <span
                          className={`truncate text-[9px] font-bold uppercase leading-[1.1] tracking-[0.12em] ${
                            active ? "text-[#F26522]" : "text-white"
                          }`}
                        >
                          {group.parent}
                        </span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFilterSection(group.parent)}
                      aria-label={active ? `Collapse ${group.parent}` : `Expand ${group.parent}`}
                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center self-center rounded-md border transition-all duration-200 ${
                        active
                          ? "border-[#F26522]/35 bg-[rgba(43,19,37,0.88)] text-[#F26522]"
                          : "border-white/10 text-white/45 hover:border-[#F26522]/35 hover:bg-white/5 hover:text-[#F26522]"
                      }`}
                    >
                      <ChevronDown
                        className={`h-3 w-3 shrink-0 rotate-[-90deg] transition-all duration-300 ${
                          active ? "text-[#F26522]" : "text-inherit"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
            {!d1.length ? (
              <div className="px-1 py-2 text-[11px] text-white/45">No filter groups</div>
            ) : null}
          </div>

          {activeGroup ? (
            <div className="min-w-0 flex-1 text-white">
              {/* Same gradient/border language as `GIS_TOOLBAR_STRIP_ROW` — fills to toolbar right (search aligned) */}
              <div className="flex max-h-[min(56vh,200px)] w-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#27365C] bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] shadow-[0_16px_32px_rgba(3,8,24,0.4)]">
                <div className="flex h-7 shrink-0 items-center justify-between gap-2 border-b border-[#27365C]/90 px-2">
                  <div className="min-w-0 truncate text-[9px] font-bold uppercase leading-[1.1] tracking-[0.14em] text-[#F26522]">
                    {activeGroup.parent} Query
                  </div>
                  {/* LegendBoxV2-style: dark circular hit target, tinted bg on hover */}
                  <div className="flex shrink-0 items-center gap-px">
                    <button
                      type="button"
                      title="Apply filters"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleSubmit();
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-0 bg-[rgba(13,24,49,0.92)] p-0 text-[#ffffff] transition-colors hover:bg-[rgba(34,197,94,0.22)] hover:text-[#4ade80] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/45"
                    >
                      <Check className="h-[11px] w-[11px]" strokeWidth={2.5} aria-hidden />
                    </button>
                    <button
                      type="button"
                      title={`Clear ${activeGroup.parent} selection`}
                      onClick={(e) => {
                        e.stopPropagation();
                        clearActiveSectionDraft();
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-0 bg-[rgba(13,24,49,0.92)] p-0 text-[#F26522] transition-colors hover:bg-[rgba(239,68,68,0.22)] hover:text-[#dc2626] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]/40"
                    >
                      <X className="h-[11px] w-[11px]" strokeWidth={2.5} aria-hidden />
                    </button>
                  </div>
                </div>

                <div className="sidebar-scroll min-h-0 flex-1 overflow-y-auto px-2 py-1">
                  {useFlatRegionLayout ? (
                    <div>
                      {regionRows.length ? (
                        <div className="ml-1 border-l border-white/10 pl-2">
                          {regionRows.map((row) => {
                            const isSelected = selected[row.parent]?.includes(row.name) || false;
                            return (
                              <label
                                key={`${row.parent}-${row.name}`}
                                className="flex cursor-pointer items-center gap-2 py-0.5 text-[11px] text-white/78 transition hover:text-white"
                              >
                                <span className="inline-flex h-3.5 shrink-0 items-center justify-center">
                                  <input
                                    type="checkbox"
                                    className={`${dy3FilterCbCompact} m-0 align-middle`}
                                    checked={isSelected}
                                    onChange={() => handleCheck(row.parent, row.name)}
                                  />
                                </span>
                                <span className="truncate leading-[1.1]">{row.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="px-1 py-1.5 text-[11px] font-medium text-white/40">No options available</div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {activeGroup.child?.length ? (
                        activeGroup.child.map((techBlock) => {
                          const selectedValues = selected[techBlock.name] || [];
                          const isGroupOpen = Boolean(openTech[techBlock.name]);
                          const opts = techBlock.columnName?.map((b) => b.name) || [];
                          const isGroupSelected =
                            opts.length > 0 && opts.every((option) => selectedValues.includes(option));
                          const siblingNames = (activeGroup.child || []).map((c) => c.name);
                          return (
                            <div key={techBlock.name} className="last:pb-0">
                              <div className="flex items-center justify-between gap-1.5 py-0.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelected((prev) => ({
                                      ...prev,
                                      [techBlock.name]: isGroupSelected ? [] : opts,
                                    }));
                                  }}
                                  className="group flex min-w-0 flex-1 items-center gap-2 text-left"
                                >
                                  <span className="inline-flex h-3.5 shrink-0 items-center justify-center self-center">
                                    <input
                                      type="checkbox"
                                      readOnly
                                      className={`pointer-events-none m-0 align-middle ${dy3FilterCbCompact}`}
                                      checked={isGroupSelected}
                                    />
                                  </span>
                                  <span
                                    className={`truncate text-[11px] font-semibold leading-[1.1] transition-colors ${
                                      isGroupOpen ? "text-[#F26522]" : "text-white group-hover:text-[#F26522]"
                                    }`}
                                  >
                                    {techBlock.name}
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleTechExclusive(techBlock.name, siblingNames)}
                                  aria-label={isGroupOpen ? `Collapse ${techBlock.name}` : `Expand ${techBlock.name}`}
                                  className={`inline-flex h-6 w-6 shrink-0 items-center justify-center self-center rounded-md transition ${
                                    isGroupOpen
                                      ? "text-[#F26522] hover:bg-[#F26522]/10"
                                      : "text-white/70 hover:bg-white/5 hover:text-[#F26522]"
                                  }`}
                                >
                                  <ChevronDown
                                    className={`h-3 w-3 transition-transform duration-200 ${
                                      isGroupOpen ? "rotate-180 text-[#F26522]" : "text-white/75"
                                    }`}
                                  />
                                </button>
                              </div>

                              {isGroupOpen ? (
                                <div className="ml-1 mt-0.5 border-l border-white/10 pl-2">
                                  {opts.map((option) => {
                                    const isSelected = selectedValues.includes(option);
                                    return (
                                      <label
                                        key={`${techBlock.name}-${option}`}
                                        className="flex cursor-pointer items-center gap-2 py-0.5 text-[10px] text-white/75 transition hover:text-white"
                                      >
                                        <span className="inline-flex h-3.5 shrink-0 items-center justify-center">
                                          <input
                                            type="checkbox"
                                            className={`${dy3FilterCbCompact} m-0 align-middle`}
                                            checked={isSelected}
                                            onChange={() => handleCheck(techBlock.name, option)}
                                          />
                                        </span>
                                        <span className="truncate leading-[1.1]">{option}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              ) : null}
                            </div>
                          );
                        })
                      ) : (
                        <div className="px-1 py-1.5 text-[11px] font-medium text-white/40">No options available</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowLeftFilters((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-lg border border-[#2c4a85] bg-[#162a52] px-4 py-2 text-sm text-white hover:bg-[#1e3a70]"
      >
        <Menu className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
        Filters
      </button>

      {showLeftFilters && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 top-full z-50 mt-2 max-h-[70vh] w-[280px] max-w-[90vw] overflow-y-auto rounded-xl bg-white p-4 text-black shadow-xl sm:w-[320px]"
          style={{ fontFamily: '"Aptos", "Aptos Display", "Segoe UI", Arial, sans-serif' }}
        >
          {filterBody}
        </div>
      )}
    </div>
  );
};

export default LeftFilters;
