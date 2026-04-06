import React from "react";
import { ChevronDown, Check, X } from "lucide-react";
import DatetimeLocalWithPicker from "./DatetimeLocalWithPicker";
import CellThematicsPanel from "./CellThematicsPanel";
import ColorPicker from "./ColorPicker";
import RangeFilter from "./RangeFilter";
import OpacitySlider from "./OpacitySlider";
import SiteThematicsPanel from "./SiteThematicsPanel";
import { KPI_RANGE_DEFAULTS, deepCopyRanges } from "./Utils/colorEngine";

const dy3LayerCb =
  "h-3 w-3 shrink-0 appearance-none rounded-[3px] border border-white/30 bg-transparent checked:border-[#F26522] checked:bg-[#F26522]";

/** Dark-theme overrides for legacy light panels inside the floating shell (Custom range / KPI labels must stay readable). */
const floatingInner =
  "sidebar-scroll min-h-0 flex-1 overflow-y-auto px-2 py-1.5 [&_input[type=checkbox]]:border-white/30 [&_input[type=range]]:accent-[#F26522] [&_select]:rounded [&_select]:border [&_select]:border-white/25 [&_select]:bg-[#0a1428] [&_select]:px-2 [&_select]:py-1 [&_select]:text-xs [&_select]:text-white [&_input[type=datetime-local]]:rounded [&_input[type=datetime-local]]:border [&_input[type=datetime-local]]:border-white/25 [&_input[type=datetime-local]]:bg-[#0a1428] [&_input[type=datetime-local]]:text-xs [&_input[type=datetime-local]]:text-white [&_input[type=number]]:border [&_input[type=number]]:border-white/25 [&_input[type=number]]:bg-white [&_input[type=number]]:max-w-[4.25rem] [&_input[type=number]]:px-1 [&_input[type=number]]:py-1 [&_input[type=number]]:text-xs [&_input[type=number]]:text-neutral-900 [&_input[type=number]]:rounded [&_.text-gray-500]:!text-[#e2e8f0] [&_.text-gray-600]:!text-[#f1f5f9] [&_.text-gray-400]:!text-[#cbd5e1] [&_.text-gray-300]:!text-[#e2e8f0] [&_label]:text-white/90 [&_.border-gray-300]:border-white/25 [&_.bg-white]:bg-white/15 [&_.border.rounded.p-2]:border-white/15 [&_.border.rounded.p-3]:border-white/15 [&_.bg-blue-600]:bg-[#F26522] [&_.border-blue-600]:border-[#F26522] [&_.text-white]:text-white [&_.text-blue-600]:!text-sky-300 [&_.text-red-500]:!text-red-400";

const SECTION_TITLE = {
  SITE: "Sites",
  CELL: "Cells",
  BOUNDARY: "Boundaries",
  RF: "RF predictions",
  DRIVE_TEST: "Drive test",
};

/**
 * Datayog-style two-column layers UI (matches `LeftFilters` floating filter shell).
 * State and apply/clear logic live in `AddMapLayersPanel`.
 */
const AddMapLayersPanelFloatingLayout = ({
  activeLayerSection,
  toggleFloatingSection,
  clearActiveLayerSectionDraft,
  applySelectedMapLayers,
  pendingVisibility,
  setPendingVisibility,
  setActiveLayerSection,
  pendingLegends,
  setPendingLegends,
  setSiteThematicsConfig,
  setCellThematicsConfig,
  boundaryGroups,
  anyBoundarySelected,
  allBoundariesSelected,
  expandedBoundaryGroup,
  setExpandedBoundaryGroup,
  pendingBoundarySelections,
  setPendingBoundarySelections,
  toggleBoundaryChild,
  toggleParentLayerSelection,
  pendingOpacity,
  setPendingOpacity,
  boundaryColors,
  setBoundaryColors,
  rfRegions,
  pendingRfRegions,
  setPendingRfRegions,
  toggleRfRegion,
  rfParameter,
  setRfParameter,
  rfParameterOptions,
  rfColorConfig,
  sessionIds,
  selectedDriveSessions,
  setSelectedDriveSessions,
  toggleDriveSession,
  startDateTime,
  setStartDateTime,
  endDateTime,
  setEndDateTime,
  selectedThematic,
  setSelectedThematic,
  thematicMode,
  setThematicMode,
  ranges,
  setRanges,
  driveThematicOptions,
}) => {
  const railCard =
    "group rounded-xl border border-[#27365C] bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] px-2 py-1 text-white shadow-[0_8px_20px_rgba(3,8,24,0.35)]";

  const chevronBtn = (active) =>
    `inline-flex h-6 w-6 shrink-0 items-center justify-center self-center rounded-md border transition-all duration-200 ${
      active
        ? "border-[#F26522]/35 bg-[rgba(43,19,37,0.88)] text-[#F26522]"
        : "border-white/10 text-white/45 hover:border-[#F26522]/35 hover:bg-white/5 hover:text-[#F26522]"
    }`;

  return (
    <div className="relative w-full min-w-0 text-white">
      <div className="flex w-full min-w-0 items-start gap-2">
        <div className="flex w-[min(42vw,172px)] shrink-0 flex-col gap-1 overflow-visible pr-0.5 py-0.5">
          {/* Sites */}
          <div className={railCard}>
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <span className="inline-flex h-3.5 shrink-0 items-center justify-center self-center">
                  <input
                    type="checkbox"
                    checked={pendingVisibility.SITES || false}
                    onChange={() => {
                      const newVal = !pendingVisibility.SITES;
                      setPendingVisibility((prev) => ({ ...prev, SITES: newVal }));
                      if (newVal) setActiveLayerSection("SITE");
                    }}
                    className={`${dy3LayerCb} m-0 align-middle`}
                  />
                </span>
                <button
                  type="button"
                  onClick={() => toggleFloatingSection("SITE")}
                  className="flex min-w-0 flex-1 items-center py-0 text-left"
                >
                  <span
                    className={`truncate text-[9px] font-bold uppercase leading-[1.1] tracking-[0.12em] ${
                      activeLayerSection === "SITE" ? "text-[#F26522]" : "text-white"
                    }`}
                  >
                    Sites
                  </span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => toggleFloatingSection("SITE")}
                aria-label={activeLayerSection === "SITE" ? "Collapse sites" : "Expand sites"}
                className={chevronBtn(activeLayerSection === "SITE")}
              >
                <ChevronDown
                  className={`h-3 w-3 shrink-0 rotate-[-90deg] transition-all duration-300 ${
                    activeLayerSection === "SITE" ? "text-[#F26522]" : "text-inherit"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Cells */}
          <div className={railCard}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="inline-flex h-3.5 shrink-0 items-center justify-center self-center">
                  <input
                    type="checkbox"
                    checked={pendingVisibility.CELLS || false}
                    onChange={() => {
                      const newValue = !pendingVisibility.CELLS;
                      setPendingVisibility((prev) => ({ ...prev, CELLS: newValue }));
                      if (newValue) {
                        setCellThematicsConfig({ type: "Band", colors: {}, opacity: 1, scale: 1 });
                        setActiveLayerSection("CELL");
                      }
                    }}
                    className={`${dy3LayerCb} m-0 align-middle`}
                  />
                </span>
                <button
                  type="button"
                  onClick={() => toggleFloatingSection("CELL")}
                  className="flex min-w-0 flex-1 items-center py-0 text-left"
                >
                  <span
                    className={`truncate text-[9px] font-bold uppercase leading-[1.1] tracking-[0.12em] ${
                      activeLayerSection === "CELL" ? "text-[#F26522]" : "text-white"
                    }`}
                  >
                    Cells
                  </span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => toggleFloatingSection("CELL")}
                aria-label={activeLayerSection === "CELL" ? "Collapse cells" : "Expand cells"}
                className={chevronBtn(activeLayerSection === "CELL")}
              >
                <ChevronDown
                  className={`h-3 w-3 shrink-0 rotate-[-90deg] transition-all duration-300 ${
                    activeLayerSection === "CELL" ? "text-[#F26522]" : "text-inherit"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Boundaries */}
          {boundaryGroups.length > 0 ? (
            <div className={railCard}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="inline-flex h-3.5 shrink-0 items-center justify-center self-center">
                    <input
                      type="checkbox"
                      ref={(el) => {
                        if (el) el.indeterminate = anyBoundarySelected && !allBoundariesSelected;
                      }}
                      checked={allBoundariesSelected && boundaryGroups.length > 0}
                      onChange={() => {
                        if (anyBoundarySelected) {
                          const cleared = {};
                          boundaryGroups.forEach((g) => {
                            cleared[g.shapegroup] = [];
                          });
                          setPendingBoundarySelections((prev) => ({ ...prev, ...cleared }));
                          boundaryGroups.forEach((g) => {
                            setPendingVisibility((prev) => ({ ...prev, [g.shapegroup]: false }));
                          });
                        } else {
                          const all = {};
                          boundaryGroups.forEach((g) => {
                            all[g.shapegroup] = g.shapenames || [];
                          });
                          setPendingBoundarySelections((prev) => ({ ...prev, ...all }));
                          boundaryGroups.forEach((g) => {
                            setPendingVisibility((prev) => ({ ...prev, [g.shapegroup]: true }));
                          });
                          setActiveLayerSection("BOUNDARY");
                        }
                      }}
                      className={`${dy3LayerCb} m-0 align-middle`}
                    />
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleFloatingSection("BOUNDARY")}
                    className="flex min-w-0 flex-1 items-center py-0 text-left"
                  >
                    <span
                      className={`truncate text-[9px] font-bold uppercase leading-[1.1] tracking-[0.12em] ${
                        activeLayerSection === "BOUNDARY" ? "text-[#F26522]" : "text-white"
                      }`}
                    >
                      Boundaries
                    </span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFloatingSection("BOUNDARY")}
                  aria-label={activeLayerSection === "BOUNDARY" ? "Collapse boundaries" : "Expand boundaries"}
                  className={chevronBtn(activeLayerSection === "BOUNDARY")}
                >
                  <ChevronDown
                    className={`h-3 w-3 shrink-0 rotate-[-90deg] transition-all duration-300 ${
                      activeLayerSection === "BOUNDARY" ? "text-[#F26522]" : "text-inherit"
                    }`}
                  />
                </button>
              </div>
            </div>
          ) : null}

          {/* RF */}
          <div className={railCard}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="inline-flex h-3.5 shrink-0 items-center justify-center self-center">
                  <input
                    type="checkbox"
                    checked={pendingVisibility.RF || false}
                    onChange={() => {
                      const newValue = !pendingVisibility.RF;
                      setPendingVisibility((prev) => ({ ...prev, RF: newValue }));
                      setPendingRfRegions(newValue ? rfRegions : []);
                      if (newValue) setActiveLayerSection("RF");
                    }}
                    className={`${dy3LayerCb} m-0 align-middle`}
                  />
                </span>
                <button
                  type="button"
                  onClick={() => toggleFloatingSection("RF")}
                  className="flex min-w-0 flex-1 items-center py-0 text-left"
                >
                  <span
                    className={`truncate text-[9px] font-bold uppercase leading-[1.1] tracking-[0.12em] ${
                      activeLayerSection === "RF" ? "text-[#F26522]" : "text-white"
                    }`}
                  >
                    RF predictions
                  </span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => toggleFloatingSection("RF")}
                aria-label={activeLayerSection === "RF" ? "Collapse RF" : "Expand RF"}
                className={chevronBtn(activeLayerSection === "RF")}
              >
                <ChevronDown
                  className={`h-3 w-3 shrink-0 rotate-[-90deg] transition-all duration-300 ${
                    activeLayerSection === "RF" ? "text-[#F26522]" : "text-inherit"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Drive test */}
          <div className={railCard}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="inline-flex h-3.5 shrink-0 items-center justify-center self-center">
                  <input
                    type="checkbox"
                    checked={pendingVisibility.DRIVE_TEST || false}
                    onChange={() => {
                      const newValue = !pendingVisibility.DRIVE_TEST;
                      setPendingVisibility((prev) => ({ ...prev, DRIVE_TEST: newValue }));
                      setSelectedDriveSessions(newValue ? sessionIds : []);
                      if (newValue) setActiveLayerSection("DRIVE_TEST");
                    }}
                    className={`${dy3LayerCb} m-0 align-middle`}
                  />
                </span>
                <button
                  type="button"
                  onClick={() => toggleFloatingSection("DRIVE_TEST")}
                  className="flex min-w-0 flex-1 items-center py-0 text-left"
                >
                  <span
                    className={`truncate text-[9px] font-bold uppercase leading-[1.1] tracking-[0.12em] ${
                      activeLayerSection === "DRIVE_TEST" ? "text-[#F26522]" : "text-white"
                    }`}
                  >
                    Drive test
                  </span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => toggleFloatingSection("DRIVE_TEST")}
                aria-label={activeLayerSection === "DRIVE_TEST" ? "Collapse drive test" : "Expand drive test"}
                className={chevronBtn(activeLayerSection === "DRIVE_TEST")}
              >
                <ChevronDown
                  className={`h-3 w-3 shrink-0 rotate-[-90deg] transition-all duration-300 ${
                    activeLayerSection === "DRIVE_TEST" ? "text-[#F26522]" : "text-inherit"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right detail — only after a left category is opened (chevron / row) */}
        {activeLayerSection ? (
          <div className="min-w-0 flex-1">
            <div className="flex max-h-[min(56vh,200px)] w-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#27365C] bg-[linear-gradient(180deg,#0C1931_0%,#0B1730_100%)] shadow-[0_16px_32px_rgba(3,8,24,0.4)]">
              <div className="flex h-7 shrink-0 items-center justify-between gap-2 border-b border-[#27365C]/90 px-2">
                <div className="min-w-0 truncate text-[9px] font-bold uppercase leading-[1.1] tracking-[0.14em] text-[#F26522]">
                  {SECTION_TITLE[activeLayerSection]} layers
                </div>
                <div className="flex shrink-0 items-center gap-px">
                  <button
                    type="button"
                    title="Apply layers"
                    onClick={applySelectedMapLayers}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-0 bg-[rgba(13,24,49,0.92)] p-0 text-[#ffffff] transition-colors hover:bg-[rgba(34,197,94,0.22)] hover:text-[#4ade80] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/45"
                  >
                    <Check className="h-[11px] w-[11px]" strokeWidth={2.5} aria-hidden />
                  </button>
                  <button
                    type="button"
                    title="Revert this section to last applied"
                    onClick={clearActiveLayerSectionDraft}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-0 bg-[rgba(13,24,49,0.92)] p-0 text-[#F26522] transition-colors hover:bg-[rgba(239,68,68,0.22)] hover:text-[#dc2626] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]/40"
                  >
                    <X className="h-[11px] w-[11px]" strokeWidth={2.5} aria-hidden />
                  </button>
                </div>
              </div>

              {activeLayerSection === "SITE" ? (
                <div className={floatingInner}>
                  <SiteThematicsPanel
                    setSiteThematicsConfig={setSiteThematicsConfig}
                    tempLegend={pendingLegends.SITES}
                    setTempLegend={(val) => setPendingLegends((prev) => ({ ...prev, SITES: val }))}
                    datetimeVariant="dark"
                  />
                </div>
              ) : null}

              {activeLayerSection === "CELL" ? (
                <div className={floatingInner}>
                  <CellThematicsPanel
                    setCellThematicsConfig={setCellThematicsConfig}
                    tempLegend={pendingLegends.CELLS}
                    setTempLegend={(val) => setPendingLegends((prev) => ({ ...prev, CELLS: val }))}
                    datetimeVariant="dark"
                  />
                </div>
              ) : null}

              {activeLayerSection === "BOUNDARY" ? (
                <div className={floatingInner}>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 pt-1">
                    <span className="text-xs font-semibold text-gray-500">Show legend</span>
                    <input
                      type="checkbox"
                      checked={!!pendingLegends.BOUNDARY}
                      onChange={(e) =>
                        setPendingLegends((prev) => ({
                          ...prev,
                          BOUNDARY: e.target.checked,
                        }))
                      }
                    />
                  </div>
                  <OpacitySlider
                    value={pendingOpacity.BOUNDARY}
                    onChange={(val) => setPendingOpacity((prev) => ({ ...prev, BOUNDARY: val }))}
                  />
                  {boundaryGroups.map((group, index) => (
                    <div key={index} className="mb-2 rounded border border-white/10 p-2">
                      <div className="flex items-center justify-between rounded p-1 hover:bg-white/[0.04]">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={pendingVisibility[group.shapegroup] || false}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => toggleParentLayerSelection(group.shapegroup)}
                          />
                          <span className="text-sm font-medium">{group.shapegroup}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedBoundaryGroup(
                              expandedBoundaryGroup === group.shapegroup ? null : group.shapegroup
                            )
                          }
                          className="text-white/70"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandedBoundaryGroup === group.shapegroup ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                      {expandedBoundaryGroup === group.shapegroup ? (
                        <div className="mt-2 p-1">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500">Line color</span>
                            <ColorPicker
                              value={boundaryColors[group.shapegroup] || "#000000"}
                              onChange={(color) =>
                                setBoundaryColors((prev) => ({
                                  ...prev,
                                  [group.shapegroup]: color,
                                }))
                              }
                            />
                          </div>
                          <div className="mt-2 max-h-[160px] overflow-y-auto rounded border border-white/10 p-2">
                            {group.shapenames.map((name, idx) => (
                              <label key={idx} className="mb-1 flex cursor-pointer items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={pendingBoundarySelections[group.shapegroup]?.includes(name) || false}
                                  onChange={() => toggleBoundaryChild(group.shapegroup, name)}
                                />
                                {name}
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              {activeLayerSection === "RF" ? (
                <div className={floatingInner}>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 pt-1">
                    <span className="text-xs font-semibold text-gray-500">Show legend</span>
                    <input
                      type="checkbox"
                      checked={!!pendingLegends.RF}
                      onChange={(e) =>
                        setPendingLegends((prev) => ({
                          ...prev,
                          RF: e.target.checked,
                        }))
                      }
                    />
                  </div>
                  <OpacitySlider
                    value={pendingOpacity.RF}
                    onChange={(val) => setPendingOpacity((prev) => ({ ...prev, RF: val }))}
                  />
                  <span className="text-xs font-semibold text-gray-500">Select layers</span>
                  <div className="mt-2 max-h-[140px] overflow-y-auto rounded border border-white/10 p-2">
                    {rfRegions.map((name, idx) => (
                      <label key={idx} className="mb-1 flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={pendingRfRegions.includes(name)}
                          onChange={() => toggleRfRegion(name)}
                        />
                        {name}
                      </label>
                    ))}
                  </div>
                  <div className="mt-2">
                    <div className="mb-1 text-xs font-semibold text-gray-500">Apply thematic by</div>
                    <select
                      value={rfParameter}
                      onChange={(e) => setRfParameter(e.target.value)}
                      className="w-full rounded border px-2 py-1 text-sm"
                    >
                      {rfParameterOptions.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-2">
                    <div className="mb-1 text-xs font-semibold text-gray-500">Range & colors</div>
                    <div className="space-y-2">
                      {rfColorConfig
                        .filter((c) => c.parameter_name === rfParameter)
                        .sort((a, b) => a.display_order - b.display_order)
                        .map((entry) => (
                          <div
                            key={entry.range_label}
                            className="flex items-center justify-between rounded border border-white/10 px-2 py-1"
                          >
                            <span className="text-sm">{entry.range_label}</span>
                            <div
                              className="h-5 w-5 flex-shrink-0 rounded border border-white/20"
                              style={{ backgroundColor: entry.color_hex }}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {activeLayerSection === "DRIVE_TEST" ? (
                <div className={floatingInner}>
                  <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2 pt-1">
                    <span className="text-xs font-semibold text-gray-500">Show legend</span>
                    <input
                      type="checkbox"
                      checked={!!pendingLegends.DRIVE_TEST}
                      onChange={(e) =>
                        setPendingLegends((prev) => ({
                          ...prev,
                          DRIVE_TEST: e.target.checked,
                        }))
                      }
                    />
                  </div>
                  <OpacitySlider
                    value={pendingOpacity.DRIVE_TEST}
                    onChange={(val) => setPendingOpacity((prev) => ({ ...prev, DRIVE_TEST: val }))}
                  />
                  <span className="text-xs font-semibold text-gray-500">Select layers</span>
                  <div className="max-h-[120px] overflow-y-auto rounded border border-white/10 p-2">
                    {sessionIds.map((session) => (
                      <label key={session} className="mb-1 flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedDriveSessions.includes(session)}
                          onChange={() => toggleDriveSession(session)}
                        />
                        {session}
                      </label>
                    ))}
                  </div>
                  <div className="mt-2 space-y-2">
                    <span className="text-xs font-semibold text-gray-500">Date &amp; time</span>
                    <div className="flex min-w-0 flex-col gap-2">
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-[10px] font-semibold text-gray-500">Start</span>
                        <DatetimeLocalWithPicker
                          variant="dark"
                          value={startDateTime}
                          onChange={(e) => setStartDateTime(e.target.value)}
                          inputClassName="w-full min-w-0"
                          aria-label="Drive test start date and time"
                        />
                      </div>
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-[10px] font-semibold text-gray-500">End</span>
                        <DatetimeLocalWithPicker
                          variant="dark"
                          value={endDateTime}
                          onChange={(e) => setEndDateTime(e.target.value)}
                          inputClassName="w-full min-w-0"
                          aria-label="Drive test end date and time"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="mb-1 block text-xs font-semibold text-gray-500">Thematic</span>
                      <select
                        value={selectedThematic}
                        onChange={(e) => {
                          const v = e.target.value;
                          setSelectedThematic(v);
                          if (thematicMode === "Default") {
                            setRanges(deepCopyRanges(KPI_RANGE_DEFAULTS[v] || []));
                          }
                        }}
                        className="w-full rounded border px-2 py-1 text-sm"
                      >
                        {driveThematicOptions.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="text-xs font-semibold text-gray-500">Mode</div>
                    <div className="mb-2 flex gap-2">
                      {["Default", "Custom"].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setThematicMode(m);
                            if (m === "Default") {
                              setRanges(deepCopyRanges(KPI_RANGE_DEFAULTS[selectedThematic]));
                            }
                          }}
                          className={`flex-1 rounded border px-3 py-1 text-sm ${
                            thematicMode === m
                              ? "border-[#F26522] bg-[#F26522] text-white"
                              : "border-white/25 bg-white/[0.04] text-white/80"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                    {thematicMode === "Default" ? (
                      <div className="mb-2 rounded border border-white/10 p-2">
                        <div className="mb-2 text-xs font-semibold text-gray-500">Preview</div>
                        <div className="space-y-1">
                          {(KPI_RANGE_DEFAULTS[selectedThematic] || []).map((range, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <div
                                className="h-3 w-3 flex-shrink-0 rounded-sm"
                                style={{ backgroundColor: range.color }}
                              />
                              <span className="text-gray-600">{range.label}</span>
                              <span className="ml-auto text-gray-400">
                                {range.max} to {range.min}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {thematicMode === "Custom" ? <RangeFilter value={ranges} onChange={setRanges} /> : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AddMapLayersPanelFloatingLayout;
