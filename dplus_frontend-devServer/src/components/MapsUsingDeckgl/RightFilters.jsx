import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapActions from "../../store/actions/map-actions";
import * as Unicons from "@iconscout/react-unicons";
import DropdownButton from "./DropdownButton";
import AddMapLayersPanel from "./AddMapLayersPanel";
import AuthActions from "../../store/actions/auth-actions";
import { TELECOM_MAP_STYLE_OPTIONS } from "./Utils/telecomMapStyleOptions";

const RightFilters = () => {
  const dispatch = useDispatch();

  const rawCells = useSelector((state) => state.map.rawCells || []);
  const config = useSelector((state) => state.map.config);

  const [openDropdown, setOpenDropdown] = useState(null);

  const [siteSearch, setSiteSearch] = useState("");
  const [searchMode, setSearchMode] = useState("site");
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    const handleOutsideClick = () => {
      setOpenDropdown(null);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleResetSearch = () => {
    setSelectedSite(null);
    setSelectedCell(null);
    setSiteSearch("");
    dispatch(MapActions.setHighlightedCell(null));
    dispatch(MapActions.setSelectedCell(null));
  };

  const siteList = useMemo(() => [...new Set(rawCells.map((c) => c.site_name))], [rawCells]);

  const filteredSites = useMemo(
    () => siteList.filter((site) => site?.toLowerCase().includes(siteSearch.toLowerCase())),
    [siteList, siteSearch]
  );

  const filteredCells = useMemo(
    () =>
      rawCells
        .filter(
          (cell) =>
            (!selectedSite || cell.site_name === selectedSite) &&
            cell.cell_id?.toLowerCase().includes(siteSearch.toLowerCase())
        )
        .slice(0, 50),
    [rawCells, selectedSite, siteSearch]
  );

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown("layers");
          }}
          className="flex min-w-[120px] w-full items-center justify-center rounded-lg border border-[#2c4a85] bg-[#162a52] px-4 py-2 text-sm text-white transition hover:bg-[#1e3a70] md:w-auto"
        >
          Add MapLayer <span className="ml-1 text-xs opacity-90">∨</span>
        </button>
        <div style={{ display: openDropdown === "layers" ? "block" : "none" }}>
          <AddMapLayersPanel onClose={() => setOpenDropdown(null)} />
        </div>
      </div>

      <DropdownButton
        id="mapStyle"
        label="Map Style"
        openDropdown={openDropdown}
        toggleDropdown={toggleDropdown}
      >
        <div className="absolute right-0 z-50 mt-3 w-[280px] rounded-xl bg-white p-4 text-black shadow-xl">
          {TELECOM_MAP_STYLE_OPTIONS.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                dispatch(MapActions.setMapConfig({ mapView: option.value }));
                dispatch(AuthActions.setupConf(true, { mapView: option.value }));
                setOpenDropdown(null);
              }}
              className={`cursor-pointer rounded px-2 py-1 text-sm ${
                config.mapView === option.value ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      </DropdownButton>

      <DropdownButton id="site" label="Search" openDropdown={openDropdown} toggleDropdown={toggleDropdown}>
        <div className="absolute right-0 z-50 mt-3 w-[280px] max-w-[90vw] rounded-xl bg-white p-5 text-black shadow-2xl sm:w-[320px]">
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setSearchMode("site")}
              className={`rounded-md px-3 py-1 text-sm ${searchMode === "site" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Site
            </button>
            <button
              type="button"
              onClick={() => setSearchMode("cell")}
              className={`rounded-md px-3 py-1 text-sm ${searchMode === "cell" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Cell
            </button>
          </div>

          <div className="relative mb-3">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Unicons.UilSearch size={16} />
            </span>
            <input
              type="text"
              value={siteSearch}
              onChange={(e) => setSiteSearch(e.target.value)}
              placeholder={selectedSite || selectedCell ? `Filter further...` : `Search ${searchMode}...`}
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {(selectedSite || selectedCell) && (
            <div className="mb-3 flex flex-col gap-1">
              {selectedSite && (
                <div className="flex w-full items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs text-blue-700">
                  <Unicons.UilLocationPoint size={13} className="shrink-0 text-blue-400" />
                  <span className="flex-1 truncate font-medium">{selectedSite}</span>
                  <Unicons.UilTimes
                    size={12}
                    className="shrink-0 cursor-pointer hover:text-blue-900"
                    onClick={() => {
                      setSelectedSite(null);
                      setSelectedCell(null);
                    }}
                  />
                </div>
              )}
              {selectedCell && (
                <div className="flex w-full items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs text-green-700">
                  <Unicons.UilSignal size={13} className="shrink-0 text-green-400" />
                  <span className="flex-1 truncate font-medium">{selectedCell.cell_id}</span>
                  <Unicons.UilTimes
                    size={12}
                    className="shrink-0 cursor-pointer hover:text-green-900"
                    onClick={() => setSelectedCell(null)}
                  />
                </div>
              )}
            </div>
          )}

          <div className="max-h-48 overflow-y-auto rounded-md border">
            {searchMode === "site" &&
              filteredSites.map((site, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (selectedCell) return;
                    setSelectedSite(site);
                    setSiteSearch("");
                  }}
                  className={`cursor-pointer px-3 py-2 text-sm ${selectedCell ? "cursor-not-allowed opacity-40" : "hover:bg-gray-100"}`}
                >
                  {site}
                </div>
              ))}
            {searchMode === "cell" &&
              filteredCells.map((cell, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedCell(cell);
                    setSiteSearch("");
                  }}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                >
                  {cell.cell_id}
                  <span className="ml-2 text-xs text-gray-500">({cell.site_name})</span>
                </div>
              ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                let target = null;
                if (searchMode === "site" && selectedSite) {
                  target = rawCells.find((c) => c.site_name === selectedSite);
                }
                if (searchMode === "cell" && selectedCell) {
                  target = selectedCell;
                }
                if (target) {
                  dispatch(MapActions.setHighlightedCell(target.cell_id));
                  if (searchMode === "cell") {
                    dispatch(MapActions.setSelectedCell(selectedCell));
                  }
                  dispatch(
                    MapActions.setViewState({
                      longitude: Number(target.longitude),
                      latitude: Number(target.latitude),
                      zoom: searchMode === "cell" ? 20 : 14,
                      transitionDuration: 1200,
                    })
                  );
                }
                setOpenDropdown(null);
              }}
              className="flex-1 rounded-lg bg-blue-600 py-2 text-sm text-white hover:bg-blue-700"
            >
              Apply & Zoom
            </button>
            <button
              type="button"
              onClick={handleResetSearch}
              className="flex-1 rounded-lg bg-gray-500 py-2 text-sm text-white hover:bg-gray-600"
            >
              Reset Search
            </button>
          </div>
        </div>
      </DropdownButton>
    </div>
  );
};

export default RightFilters;
