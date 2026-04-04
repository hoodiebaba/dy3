import React, { useMemo, useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { WebMercatorViewport } from "@deck.gl/core";
import { PolygonLayer, ScatterplotLayer, GeoJsonLayer, LineLayer, TextLayer  } from "@deck.gl/layers";
import { CompassWidget, ZoomWidget, FullscreenWidget } from '@deck.gl/widgets';
import '@deck.gl/widgets/stylesheet.css';

import CellInfoPopup from './CellInfoPopup'; 
import CellProRulesModal from './CellProRulesModal';
import * as Unicons from "@iconscout/react-unicons";
import MapActions from "../../store/actions/map-actions";
import generateSectorPolygon from "./Utils/GenerateSectorPolygon";
// import {CompassWidget} from '@deck.gl/widgets';
// import generateCoordinates from  "./Utils/GenerateCoordinates";
// import { NavigationControl, FullscreenControl, ScaleControl } from "react-map-gl";
// import mapboxgl from "mapbox-gl";

// ADD to existing imports
import { useNavigate } from 'react-router-dom';
import CommonActions from '../../store/actions/common-actions';
import { ALERTS } from '../../store/reducers/component-reducer';
import { FIXED_COLORS, getDriveTestColor } from "./Utils/colorEngine";
import LegendBox from "./LegendBox";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MAP_STYLES = {
  // outdoors: {
  //   tiles: ['https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}@2x.png'],
  //   attribution: '© Stadia Maps © OpenStreetMap'
  // },
  outdoors: {
    tiles: ['https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'], // ← use voyager as fallback
    attribution: '© CARTO © OpenStreetMap'
  },
  voyager: {
    tiles: ['https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'],  // ← @2x
    attribution: '© CARTO © OpenStreetMap'
  },
  light: {
    tiles: ['https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png'],
    attribution: '© CARTO © OpenStreetMap'
  },
  dark: {
    tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'],
    attribution: '© CARTO © OpenStreetMap'
  },
  osm: {
    // OSM doesn't support @2x, but this is already decent quality
    tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
    attribution: '© OpenStreetMap Contributors'
  },
  satellite: {
    tiles: [`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`],
    attribution: '© Mapbox'
  },

};

const getMapStyle = (styleKey) => {
  const style = MAP_STYLES[styleKey] || MAP_STYLES.voyager;
  return {
    version: 8,
    sources: {
      basemap: {
        type: 'raster',
        tiles: style.tiles,
        tileSize: 256,        // ← change from 256 to 512 for @2x tiles
        attribution: style.attribution
      }
    },
    layers: [{ id: 'basemap-layer', type: 'raster', source: 'basemap' }]
  };
};

// const MAP_STYLES = {
//   streets:   `https://api.mapbox.com/styles/v1/mapbox/streets-v12/style.json?access_token=${MAPBOX_TOKEN}`,
//   light:     `https://api.mapbox.com/styles/v1/mapbox/light-v11/style.json?access_token=${MAPBOX_TOKEN}`,
//   dark:      `https://api.mapbox.com/styles/v1/mapbox/dark-v11/style.json?access_token=${MAPBOX_TOKEN}`,
//   satellite: `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/style.json?access_token=${MAPBOX_TOKEN}`,
//   outdoors:  `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/style.json?access_token=${MAPBOX_TOKEN}`,
// };

// const getMapStyle = (styleKey) => 
//   MAP_STYLES[styleKey] || MAP_STYLES.streets;

const hexToRgba = (hex, opacity = 1) => {

  if (!hex) return [0,150,255,255];

  const bigint = parseInt(hex.replace("#", ""), 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  const a = Math.round(opacity * 255);

  return [r,g,b,a];

};

const haversineKm = ([lng1, lat1], [lng2, lat2]) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
              Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
              Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

const TelecomMap = ({ operator, geojsonLayer = null }) => {

  const dispatch = useDispatch();
  const deckRef = useRef(null);
  // const debounceRef = useRef(null); //to not send viewport data to backend on every minor change, but only after user stops interacting for 500ms
  const mapContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);

  useLayoutEffect(() => {
    if (!mapContainerRef.current) return;
    setContainerWidth(mapContainerRef.current.offsetWidth);
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(mapContainerRef.current);
    return () => ro.disconnect();
  }, []);

  const navigate = useNavigate();

  /* ============================================================
     🔹 REDUX STATE
  ============================================================ */

  const rawCells = useSelector(state => state.map.rawCells);
  const filters = useSelector(state => state.map.filters);
  const viewState = useSelector(state => state.map.viewState);
  const syncEnabled = useSelector(state => state.map.syncEnabled);
  const config = useSelector(state => state.map.config);

  const selectedCell = useSelector(state => state.map.selectedCell);
  const boundaryGeoJson = useSelector(state => state.map.boundaryGeoJson);
  const activeThematic = useSelector(state => state.map.activeThematic);
  const highlightedCell = useSelector(state => state.map.highlightedCell);

  const [showCellProRulesModal, setShowCellProRulesModal] = useState(false);
  const [cellProRulesCell, setCellProRulesCell] = useState(null);

  const driveTestData = useSelector(state => state.map.driveTestData);
  const driveTestFilters = useSelector(state => state.map.driveTestFilters);
  const activeDriveSessions = useSelector(state => state.map.activeDriveSessions);

  const rfPredictionGeoJson = useSelector(state => state.map.rfPredictionGeoJson);
  const rfColorConfig = useSelector(state => state.map.rfColorConfig || []);
  const layerOpacity = useSelector(state => state.map.layerOpacity);
  const layerVisibility = useSelector(state => state.map.layerVisibility);

  const rawSites = useSelector(state => state.map.rawSites);
  const activeSiteThematic = useSelector(state => state.map.activeSiteThematic);
  const selectedTaCells = useSelector(state => state.map.selectedTaCells || []);

  const rulerMode = useSelector(state => state.map.rulerMode);

  const [localViewState, setLocalViewState] = useState(viewState);
  const [rulerHover, setRulerHover] = useState(null);
  const [contextMenu, setContextMenu] = useState(null); // { x, y, cell }
  const [hoveringRulerDot, setHoveringRulerDot] = useState(false);
  const [isDraggingRulerDot, setIsDraggingRulerDot] = useState(false);
  const [rulerSegments, setRulerSegments] = useState([]); // [{id, a:[lng,lat], b:[lng,lat]|null}]
  const draggingRulerRef = useRef(null); // {segId, endpoint:'a'|'b'} — ref avoids stale closures

  const layerLegends = useSelector(state => state.map.layerLegends);
  const boundaryGroups = useSelector(state => state.map.boundaryGroups || []);
  const boundaryColors = useSelector(state => state.map.boundaryColors || {});

  const driveTestThematic = driveTestFilters
    ? {
        type: "KPIs",
        kpiConfig: {
          kpi: driveTestFilters.thematic,
          ranges: driveTestFilters.ranges
        }
      }
    : null;
    
const selectedBoundaries = useSelector(state => state.map.selectedBoundaries || {});

const rfLegendThematic = useMemo(() => {
    if (!rfColorConfig.length) return null;
    const activeParam = config.rfParameter || "RSRP";
    const filtered = rfColorConfig
        .filter(c => c.parameter_name === activeParam)
        .sort((a, b) => a.display_order - b.display_order);
    if (!filtered.length) return null;
    const colors = Object.fromEntries(filtered.map(c => [c.range_label, c.color_hex]));
    return { type: activeParam, colors };
}, [rfColorConfig, config.rfParameter]);

const boundaryLegendThematic = useMemo(() => {
    // Build colors object: one entry per group that has selections
    const colors = {};
    boundaryGroups.forEach(group => {
        const selections = selectedBoundaries[group.shapegroup];
        const hasSelections = Array.isArray(selections) && selections.length > 0;
        if (hasSelections) {
            colors[group.shapegroup] = boundaryColors[group.shapegroup] || "#000000";
        }
    });
    if (Object.keys(colors).length === 0) return null;
    return { type: "Boundary", colors };
}, [boundaryGroups, selectedBoundaries, boundaryColors]);


  const activeViewState =
  (syncEnabled ? viewState : localViewState) || {
     longitude: 37.9062,
    latitude: 0.0236,
    zoom: 6,
    pitch: 0,
    bearing: 0
  };

  const currentZoom = activeViewState?.zoom ?? 6;

  const THEMATIC_FIELD_MAP = {
    Technology: "technology",
    Band: "band",
    Region: "region"
  };

  useEffect(() => {
  if (!activeThematic?.colors || Object.keys(activeThematic.colors).length === 0) {
    dispatch(MapActions.setActiveThematic({
      type: "Technology",
      colors: FIXED_COLORS.Technology,
      opacity: 0.9
    }));
  }
}, []); // ← run only once on mount, not on every activeThematic change


  /* ============================================================
     🔹 LOCAL VIEW STATE (used only if sync disabled)
  ============================================================ */

  useEffect(() => {
  // Only fit on initial load
    if (rawCells.length > 0 && viewState.zoom === 6) {
      fitToData();
    }
  }, [rawCells]);

  useEffect(() => {
    if (!syncEnabled && viewState) {
      setLocalViewState(viewState);
    }
  }, [syncEnabled, viewState]);


  useEffect(() => {
    dispatch(MapActions.getDriveTestData());
  }, []);

  // Close context menu on any click outside (without blocking map scroll/zoom)
  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [contextMenu]);

/* ============================================================
     🔹 APPLY GLOBAL FILTERS
  ============================================================ */

  const globallyFiltered = useMemo(() => {
    return rawCells.filter(cell => {

    // REGION MULTISELECT
    if (
        filters.regions.length > 0 &&
        !filters.regions.includes(cell.region)
    ) return false;

    // TECHNOLOGY MULTISELECT
    if (
        filters.technologies.length > 0 &&
        !filters.technologies.includes(cell.technology)
        ) return false;

      return true;
    });
  }, [rawCells, filters.regions, filters.technologies]);

  /* ============================================================
     🔹 APPLY OPERATOR FILTER (PROP-BASED) 
  ============================================================ */
  // const operatorFiltered = useMemo(() => {
  //   return globallyFiltered.filter(
  //     cell => cell.operator === operator
  //   );
  // }, [globallyFiltered, operator]);
 
  // const operatorFiltered = globallyFiltered;

   const operatorFiltered = rawCells;  //cell dataset

   /* ============================================================
   🔹 SITE AGGREGATION (1 marker per site)  -> siet datacet
============================================================ */
  const siteAggregated = useMemo(() => {

    const siteMap = {};

    operatorFiltered.forEach(cell => {

      if (!siteMap[cell.site_name]) {
        siteMap[cell.site_name] = {
          site_name: cell.site_name,
          latitude: Number(cell.latitude),
          longitude: Number(cell.longitude),
          cell_count: 1
        };
      } else {
        siteMap[cell.site_name].cell_count += 1;
      }

    });
    return Object.values(siteMap);

  }, [operatorFiltered]);

   /* ============================================================
   🔹 GENERATE COORDINATES FOR DRAWING
============================================================ */
const generateCoordinates = (x, y, Dir, antBW, c_length, scale = 20) => {
    const coords = [];
    coords.push([x, y]);

    // original denominator (110 - scale) * 100 inverts at scale > 110 (mapScale > 5.5)
    // replaced with linear growth: same output at mapScale=1, keeps growing beyond 5.5
    const factor = c_length / (69.093 * 9000) * (scale / 20);

    for (let j = 10; j >= 1; j--) {
        const angle = (Dir - antBW / 2 + (antBW / 10) * j) * 0.01745329252;

        const x1 = x + Math.sin(angle) * factor;
        const y1 = y + Math.cos(angle) * factor;

        coords.push([x1, y1]);
    }

    coords.push([x, y]);
    return coords;
};

// Generates an annular sector polygon (donut wedge) in geographic coordinates.
// innerMeters=0 produces a full sector (pie slice); innerMeters>0 excludes the inner portion.
const DEG_TO_RAD = Math.PI / 180;
const METERS_PER_DEG = 111320;
const generateAnnularSector = (lng, lat, azimuth, beamWidthDeg, innerMeters, outerMeters, steps = 30) => {
    const lngScale = Math.cos(lat * DEG_TO_RAD);
    const coords = [];

    // inner arc: left → right (collapses to center point when innerMeters = 0)
    for (let j = 0; j <= steps; j++) {
        const angle = (azimuth - beamWidthDeg / 2 + (beamWidthDeg / steps) * j) * DEG_TO_RAD;
        if (innerMeters === 0) {
            coords.push([lng, lat]);
        } else {
            coords.push([
                lng + Math.sin(angle) * innerMeters / (METERS_PER_DEG * lngScale),
                lat + Math.cos(angle) * innerMeters / METERS_PER_DEG,
            ]);
        }
    }

    // outer arc: right → left
    for (let j = steps; j >= 0; j--) {
        const angle = (azimuth - beamWidthDeg / 2 + (beamWidthDeg / steps) * j) * DEG_TO_RAD;
        coords.push([
            lng + Math.sin(angle) * outerMeters / (METERS_PER_DEG * lngScale),
            lat + Math.cos(angle) * outerMeters / METERS_PER_DEG,
        ]);
    }

    coords.push(coords[0]); // close polygon
    return coords;
};
  /* ============================================================
     🔹 MARKER LAYER (deck.gl) for CELLS
  ============================================================ */
  const markerLayer = useMemo(() => {
    // console.log(
    //   "MARKER DATA:",
    //   currentZoom < 9 ? "SITES" : "CELLS",
    //   currentZoom < 9 ? siteAggregated.length : operatorFiltered.length
    // );
    // console.log("MAP SCALE IN MAP:", config.mapScale);

    if (!layerVisibility.CELLS) return null; 

    if (!operatorFiltered || operatorFiltered.length === 0) return null;
    const mapScale = config.mapScale || 1;

    return new ScatterplotLayer({
      id: `marker-layer-${operator}`,
      data: (currentZoom < 10 ? siteAggregated : operatorFiltered)
              .filter(d => !isNaN(Number(d.longitude)) && !isNaN(Number(d.latitude))),
      pickable: true,
      getPosition: d => {
        const lng = Number(d.longitude);
        const lat = Number(d.latitude);
        if (isNaN(lng) || isNaN(lat)) return null;
        return [lng, lat];
      },
      getRadius: d => {
        // Site markers (zoomed out)
        if (currentZoom < 10) {
          return 200 + (d.cell_count || 1) * 20;
        }
        // Cell markers (mid zoom)
        if (currentZoom < 12) {
          return 120;
        }
        // When sectors appear
        return 60;
      },
      radiusScale: config.mapScale,
      // getFillColor: [255, 0, 0, 200],
      getFillColor: d => {
        const opacity =
          (layerOpacity.CELLS ?? 1) *
          (activeThematic?.opacity ?? 1);

        // highlight selected
        if (selectedCell && d.cell_id === selectedCell.cell_id) {
          return [255, 255, 0, 255];
        }

        // DEFAULT thematic
        if (activeThematic?.type === "Default") {
          const hex =
            activeThematic.colors?.[d.band] ||
            activeThematic.colors?.[d.technology] ||
            activeThematic.colors?.[d.region];

          if (hex) return hexToRgba(hex, opacity);
        }

        // Generic thematics
        const field = THEMATIC_FIELD_MAP[activeThematic?.type];

        if (field) {
          const hex = activeThematic.colors?.[d[field]];
          if (hex) return hexToRgba(hex, opacity);
        }

        // fallback
        return hexToRgba("#ff0000", opacity);
      },
      getLineColor: [0, 0, 0],
      getLineWidth: 1,
      updateTriggers: {
        getFillColor: [
          activeThematic?.type,
          activeThematic?.colors,
          activeThematic?.opacity, 
          layerOpacity.CELLS,  
        ]
      },
      visible: layerVisibility.CELLS && currentZoom < 12, // markers visible below zoom 12
      // visible: currentZoom < 9 || selectedCell !== null, // show markers only at low zooms
      onClick: info => {
        if (info.object) {
          // dispatch(MapActions.setSelectedCell({
          //   ...info.object,
          //   _lng: info.object.longitude,
          //   _lat: info.object.latitude
          // }));
          if (currentZoom < 10) {
            dispatch(MapActions.setViewState({
              longitude: info.object.longitude,
              latitude: info.object.latitude,
              zoom: 13,
              transitionDuration: 800
            }));

          } else {
              dispatch(MapActions.setSelectedCell({
                ...info.object,
                _lng: info.object.longitude,
                _lat: info.object.latitude
              }));
          }
        }
      },

    });
  }, [operatorFiltered, 
      operator, 
      dispatch, 
      currentZoom, 
      selectedCell, 
      siteAggregated, 
      config.mapScale, 
      layerVisibility.CELLS,

      activeThematic?.type,
      activeThematic?.colors,
      activeThematic?.opacity, 
      layerOpacity.CELLS
    ]);

  /* ============================================================
     🔹 SECTOR LAYER (deck.gl) for CELLS
  ============================================================ */
  const sortedCells = useMemo(() => {

    if (!operatorFiltered) return [];
    const order = { "2G":1,"3G":2,"4G":3,"5G":4 };
    return [...operatorFiltered].sort(
      (a,b) => (order[a.technology]||0)-(order[b.technology]||0)
    );
  }, [operatorFiltered]);
  
  // derived here so handleMapContextMenu and ruler layers can both use it
  const activeSegment = rulerSegments.find(s => s.b === null) ?? null;

  // Native contextmenu on the map wrapper → pickMultipleObjects → show cell context menu
  const handleMapContextMenu = useCallback((e) => {
    e.preventDefault();

    // If ruler mode is active and we have a pending point A, right-click cancels it
    if (rulerMode && activeSegment) {
      setRulerSegments(prev => prev.filter(s => s.b !== null));
      setRulerHover(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hits = deckRef.current?.pickMultipleObjects({ x, y, radius: 5 });
    if (!hits?.length) return;

    // prefer a real cell sector; if not found, accept a TA sector (knows its cellId)
    const sectorHit = hits.find(h => h.layer?.id?.startsWith('sector-layer-'));
    if (sectorHit?.object) {
      setContextMenu({ x, y, cell: sectorHit.object });
      return;
    }
    const taHit = hits.find(h => h.layer?.id === 'ta-sector-layer-fill');
    if (taHit?.object?.cellId) {
      const cell = operatorFiltered.find(c => c.cell_id === taHit.object.cellId);
      if (cell) setContextMenu({ x, y, cell });
    }
  }, [operatorFiltered, rulerMode, activeSegment]);

  const sectorLayer = useMemo(() => {

    if (!layerVisibility.CELLS) return null;
    if (!sortedCells.length) return null; 

    return new PolygonLayer({
      id: `sector-layer-${operator}`,
      data: selectedCell ? sortedCells.filter(d => d.cell_id !== selectedCell.cell_id) : sortedCells,

      pickable: true,
      stroked: true,
      filled: false,

        // getPolygon: d =>
        //     generateSectorPolygon(
        //     d.latitude,
        //     d.longitude,
        //     d.azimuth,
        //     d.beam_width || 60,
        //     d.radius_m || 500,
        //     config.mapScale
        //     ),

        getPolygon: d => {
          // boost radius at zoom 12–13 so sectors aren't tiny at the scatterplot→sector transition
          const zoomBoost = currentZoom <= 12 ? 6 : currentZoom <= 13 ? 3 : 1;

          return generateCoordinates(
            d.longitude,
            d.latitude,
            d.azimuth,
            d.radius_m,
            d.radius_m * zoomBoost,
            config.mapScale * 20,
          );
        },

        // getFillColor: d => {
        //   if (selectedCell && d.cell_id === selectedCell.cell_id) {
        //     return [255, 255, 0, 220]; // bright yellow highlight
        //   }
        //   if (d.status === "down") return [255, 0, 0, 180];
        //   return [0, 150, 255, 160];
        // },
        // getFillColor: d => {
        //   if (selectedCell && d.cell_id === selectedCell.cell_id) {
        //     return [255,255,0,220];
        //   }

        //   if (activeThematic?.type === "Technology") {
        //     const hex = activeThematic.colors?.[d.technology];
        //     if (hex) return hexToRgba(hex, activeThematic?.opacity ?? 0.9);
        //   }

        //   if (activeThematic?.type === "Default") {
        //     const hex = activeThematic.colors?.[d.band] ||
        //                 activeThematic.colors?.[d.technology] ||
        //                 activeThematic.colors?.[d.region];

        //     if (hex) return hexToRgba(hex, activeThematic?.opacity ?? 0.9);
        //   }

        //   if (activeThematic?.type === "Band") {
        //     const hex = activeThematic.colors?.[d.band];
        //     if (hex) return hexToRgba(hex, activeThematic?.opacity ?? 0.9);
        //   }

        //   if (activeThematic?.type === "Region") {
        //     const hex = activeThematic.colors?.[d.region];
        //     if (hex) return hexToRgba(hex, activeThematic?.opacity ?? 0.9);
        //   }

        //   if (d.status === "down") return [255,0,0,180];

        //   return [0,150,255,160];
        // },

        updateTriggers: {
          getPolygon: config.mapScale,
          getLineColor: [
            selectedCell,
            activeThematic?.type,
            activeThematic?.colors,
            activeThematic?.opacity,
            layerOpacity.CELLS,
          ],
        },

        getLineColor: d => {

          // highlight selected cell
          if (selectedCell && d.cell_id === selectedCell.cell_id) {
            return [255,255,0,255];
          }

          const opacity =
            (layerOpacity.CELLS ?? 1) *
            (activeThematic?.opacity ?? 1);

          // DEFAULT thematic (special logic)
          if (activeThematic?.type === "Default") {

            const hex =
              activeThematic.colors?.[d.band] ||
              activeThematic.colors?.[d.technology] ||
              activeThematic.colors?.[d.region];

            if (hex) return hexToRgba(hex, opacity);

          }
          
          // Generic thematics
          const field = THEMATIC_FIELD_MAP[activeThematic?.type];

          if (field) {
            const hex = activeThematic.colors?.[d[field]];
            if (hex) return hexToRgba(hex, opacity);
          }

          // Cell down fallback
          if (d.status === "down") return [255,0,0,255];

          // Default fallback
          return [0,150,255,255]; // fallback color instead of black
        },
        getLineWidth: 5,
        lineWidthUnits: "pixels",
        lineJointRounded: true,
        lineCapRounded: true,

        visible: layerVisibility.CELLS && currentZoom >= 12, // show sectors only at higher zooms

        onClick: (info, event) => {
            if (event?.srcEvent?.button === 2) return; // ignore right-click
            if (info.object) {
                dispatch(MapActions.setSelectedCell({
                ...info.object,
                _lng: info.coordinate[0],
                _lat: info.coordinate[1]
                }));
            }
        },

    });

  },
      [operatorFiltered,
      sortedCells,
      operator,
      config.mapScale,
      dispatch,
      currentZoom,
      selectedCell,
      activeThematic?.type,
      activeThematic?.colors,
      activeThematic?.opacity,
      layerOpacity.CELLS,
      layerVisibility.CELLS,
    ]);

const siteLayer = useMemo(() => {
    if (!layerVisibility.SITES) return null;
    if (!rawSites || rawSites.length === 0) return null;

    return new ScatterplotLayer({
        id: `site-layer-${operator}`,
        data: rawSites.filter(
            d => !isNaN(Number(d.longitude)) && !isNaN(Number(d.latitude))
        ),
        pickable: true,
        getPosition: d => [Number(d.longitude), Number(d.latitude)],
        radiusUnits: "pixels",
        getRadius: 6,
        radiusScale: config.mapScale / 2,
        getFillColor: d => {
            if (selectedCell && d.site_name === selectedCell.site_name)
                return [255, 255, 0, 255];

            const opacity = activeSiteThematic?.opacity ?? 1;

            const field = THEMATIC_FIELD_MAP[activeSiteThematic?.type];
            if (field) {
                const hex = activeSiteThematic.colors?.[d[field]];
                if (hex) return hexToRgba(hex, opacity);
            }

            if (d.status === "Deactivated") return [255, 0, 0, 180];
            return [255, 140, 0, 220];
        },
        getLineColor: [255, 255, 255, 200],
        getLineWidth: 1,
        lineWidthUnits: "pixels",
        updateTriggers: {
            getFillColor: [
                selectedCell,
                activeSiteThematic?.type,
                activeSiteThematic?.colors,
                activeSiteThematic?.opacity,
            ]
        },
        onClick: info => {
            if (info.object) {
                dispatch(MapActions.setViewState({
                    longitude: Number(info.object.longitude),
                    latitude: Number(info.object.latitude),
                    zoom: 14,
                    transitionDuration: 800
                }));
            }
        }
    });
}, [
    rawSites,
    operator,
    dispatch,
    selectedCell,
    layerVisibility.SITES,
    config.mapScale,
    activeSiteThematic?.type,
    activeSiteThematic?.colors,
    activeSiteThematic?.opacity,
]);
  /* ============================================================
     🔹 Highlight LAYER (deck.gl) - highlighting cell/site
  ============================================================ */

  // Highlights the site location with a dot — used when searching by site
  const siteHighlightLayer = useMemo(() => {

    if (!highlightedCell || !operatorFiltered) return null;
    if (selectedCell) return null; // cell sector highlight takes over

    return new ScatterplotLayer({
      id: "site-highlight",

      data: operatorFiltered.filter(
        d => d.cell_id === highlightedCell &&
          !isNaN(Number(d.longitude)) &&
          !isNaN(Number(d.latitude))
      ),

      pickable: false,

      getPosition: d => [Number(d.longitude), Number(d.latitude)],

      getFillColor: [255, 215, 0, 255],

      getRadius: 14,
      radiusUnits: "pixels",
    });
  }, [operatorFiltered, highlightedCell, selectedCell]);

  // Selected cell rendered as its own top-most layer so it's never hidden by other sectors
  const selectedCellLayer = useMemo(() => {
    if (!selectedCell || !layerVisibility.CELLS || currentZoom < 12) return null;

    const zoomBoost = currentZoom <= 12 ? 6 : currentZoom <= 13 ? 3 : 1;

    return new PolygonLayer({
      id: "selected-cell-sector",
      data: [selectedCell],
      pickable: false,
      stroked: true,
      filled: false,
      getPolygon: d => generateCoordinates(
        d.longitude,
        d.latitude,
        d.azimuth,
        d.radius_m,
        d.radius_m * zoomBoost,
        config.mapScale * 20,
      ),
      getLineColor: [255, 215, 0, 255],
      getLineWidth: 8,
      lineWidthUnits: "pixels",
      lineJointRounded: true,
      lineCapRounded: true,
    });
  }, [selectedCell, config.mapScale, currentZoom, layerVisibility.CELLS]);

  /* ============================================================
     🔹 TA SECTOR LAYER (deck.gl) — annular sectors per distance band
  ============================================================ */
  const taSectorLayer = useMemo(() => {

    if (!selectedTaCells?.length) return null;

    // HSL → RGB helper
    const hslToRgb = (h, s, l) => {
      s /= 100; l /= 100;
      const k = n => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
    };

    const perRingCount = s => (s.total_samples || 0) * (s['Share in range %'] || 0) / 100;

    // Build slices per cell; each cell gets a distinct hue band
    const cellCount = selectedTaCells.length;
    const allSlices = [];
    selectedTaCells.forEach(({ cellId, taData, cellCoords }, cellIndex) => {
      const sorted = [...taData].sort((a, b) => a.distance - b.distance);
      const n = sorted.length;
      sorted.forEach((row, i) => {
        allSlices.push({
          ...row,
          // Pin to the cell's known coordinates so the TA rings always appear on the correct cell
          latitude:  cellCoords?.lat      ?? row.latitude,
          longitude: cellCoords?.lng      ?? row.longitude,
          azimuth:   cellCoords?.azimuth  ?? row.azimuth,
          length:    cellCoords?.beamWidth ?? row.length,
          cellId,
          innerMeters: i === 0 ? 0 : sorted[i - 1].distance,
          outerMeters: row.distance,
          ringIndex: i,
          ringCount: n,
          cellIndex,
          cellCount,
        });
      });
    });

    // scale so the tallest ring across all cells = ~3000m
    // const maxSamples = Math.max(...allSlices.map(perRingCount), 1);
    // const elevationScale = 3000 / maxSamples;

    // zoom-aware height scaling
    const zoomFactor = Math.pow(2, Math.max(0, 14 - currentZoom)); // grows as you zoom out

    const MIN_HEIGHT = 10;   // smallest ring is always visible (meters)
    const MAX_HEIGHT = 600; // tallest ring caps here (meters)

    // normalisaton using (Logarithmic )
    const logVal = d => Math.log(perRingCount(d) + 1);
    const maxLogVal = Math.max(...allSlices.map(logVal), 1);

    // normalisaton using (cube root)
    const cbrtVal = d => Math.cbrt(perRingCount(d));
    const maxCbrtVal = Math.max(...allSlices.map(cbrtVal), 1);

    // Square root
    const sqrtVal = d => Math.sqrt(perRingCount(d));
    const maxSqrtVal = Math.max(...allSlices.map(sqrtVal), 1);

    // Min-Max with power cap
    const rawVal = d => perRingCount(d);
    const maxRawVal = Math.max(...allSlices.map(rawVal), 1);

    const sharedProps = {
      data: allSlices,
      getPolygon: d => generateAnnularSector(
        d.longitude, d.latitude,
        d.azimuth, d.length,
        d.innerMeters, d.outerMeters,
      ),
      // getElevation: d => perRingCount(d) * elevationScale,
      // getElevation: d => MIN_HEIGHT + (logVal(d) / maxLogVal) * (MAX_HEIGHT - MIN_HEIGHT),
      // getElevation: d => {
      //   const raw = perRingCount(d);
      //   const height = MIN_HEIGHT + (logVal(d) / maxLogVal) * (MAX_HEIGHT - MIN_HEIGHT);
      //   console.log(`[TA] cell=${d.cellId} dist=${d.distance}m raw=${raw.toFixed(0)} → height=${height.toFixed(0)}m`);
      //   return height;
      // },
      // getElevation: d => MIN_HEIGHT + (cbrtVal(d) / maxCbrtVal) * (MAX_HEIGHT - MIN_HEIGHT),
      // getElevation: d => MIN_HEIGHT + (sqrtVal(d) / maxSqrtVal) * (MAX_HEIGHT - MIN_HEIGHT),
      getElevation: d => Math.pow(rawVal(d) / maxRawVal, 0.3) * MAX_HEIGHT,

      extruded: true,
      updateTriggers: {
        getPolygon: selectedTaCells,
        getFillColor: selectedTaCells,
        getLineColor: selectedTaCells,
        getElevation: selectedTaCells,
      },
    };

    // Layer 1: solid fill (semi-transparent so rings are distinguishable)
    const fillLayer = new PolygonLayer({
      ...sharedProps,
      id: 'ta-sector-layer-fill',
      pickable: true,
      filled: true,
      stroked: false,
      wireframe: false,
      getFillColor: d => {
        // golden angle (137.508°) guarantees adjacent rings are always maximally far apart in hue
        const hue = (d.ringIndex * 137.508 + d.cellIndex * 47) % 360;
        return [...hslToRgb(hue, 80, 48), 150];
      },
      material: { ambient: 0.35, diffuse: 0.6, shininess: 32 },
      onClick: (info, event) => {
        if (event?.srcEvent?.button === 2) return;
        const hits = deckRef.current?.pickMultipleObjects({
          x: info.pixel[0], y: info.pixel[1], radius: 2,
        });
        const sectorHit = hits?.find(h => h.layer?.id?.startsWith('sector-layer-'));
        if (sectorHit?.object) {
          dispatch(MapActions.setSelectedCell({
            ...sectorHit.object,
            _lng: info.coordinate[0],
            _lat: info.coordinate[1],
          }));
        }
      },
    });

    return [fillLayer];
  }, [selectedTaCells, dispatch]);

  /* ============================================================
     🔹 GEO Json LAYER (deck.gl)
  ============================================================ */
  // Testing from frontend file load
    // const customGeoJsonLayer = useMemo(() => {
    //   if (!geojsonLayer) return null;
    //   return new GeoJsonLayer({
    //     id: 'custom-geojson-layer',
    //     data: geojsonLayer,
    //     filled: true,
    //     stroked: true,
    //     getFillColor: [0, 229, 160, 60],      // moderate teal fill
    //     getLineColor: [10, 40, 30, 220],      // dark near-black green borders 
    //     lineWidthUnits: 'pixels',
    //     pickable: true,
    //   });
    // }, [geojsonLayer]);
  
  const customGeoJsonLayer = useMemo(() => {
    if (!boundaryGeoJson) return null;

    return new GeoJsonLayer({
      id: `boundary-layer-${Object.keys(boundaryColors).length}`,
      data: boundaryGeoJson,
      dataComparator: () => false,
      filled: false,
      stroked: true,
      getFillColor: [0,0,0,0],
      getLineColor: feature => {
        // Get the group name from the feature properties
        const groupName = feature.properties?.shapegroup;
        // Look up the color for this group
        const hex = boundaryColors[groupName] || "#000000";

        const [r,g,b] = hexToRgba(hex);
        return [r, g, b, 200];
      },
      lineWidthUnits: 'pixels',
      lineWidthMinPixels: 2,
      pickable: true,
      opacity: layerOpacity.BOUNDARY,
      updateTriggers: {
        getLineColor: [boundaryColors],
        getFillColor: [boundaryColors, layerOpacity.BOUNDARY]
      }
    });
  }, [boundaryGeoJson, boundaryColors, layerOpacity.BOUNDARY]);

  const rfPredictionLayer = useMemo(() => {
    if (!rfPredictionGeoJson) return null;

    const activeParam = config.rfParameter || "RSRP";

    return new GeoJsonLayer({
      id: "rf-prediction-layer",
      data: rfPredictionGeoJson,
      filled: true,
      stroked: false,
      getFillColor: feature => {
        const range = feature.properties.range;
        const entry = rfColorConfig.find(
          c => c.parameter_name === activeParam && c.range_label === range
        );
        if (entry) return hexToRgba(entry.color_hex, layerOpacity.RF);
        return [200, 200, 200, Math.round(layerOpacity.RF * 255)];
      },
      pickable: true,
      opacity: layerOpacity.RF,
      updateTriggers: {
        getFillColor: [rfColorConfig, config.rfParameter, layerOpacity.RF],
      },
    });
  }, [rfPredictionGeoJson, rfColorConfig, config.rfParameter, layerOpacity.RF]);

  /* ============================================================
     🔹 RF Drive TEST LAYER (deck.gl)
  ============================================================ */
  const drivetestLayer = useMemo(() => {

    if (!activeDriveSessions.length) return null;
    const filtered = driveTestData.filter(
      d => activeDriveSessions.includes(d.session_id)
    );

    if (!filtered.length) return null;
    // if (!driveTestData || driveTestData.length === 0) return null;

    return new ScatterplotLayer({
      id: "drivetest-layer",
      data: filtered,
      pickable: true,
      opacity: layerOpacity.DRIVE_TEST,

      getPosition: d => [
        Number(d.longitude),
        Number(d.latitude)
      ],

      // radiusUnits: "meters",
      // getRadius: 20,

      radiusUnits: "pixels",
      getRadius: 5,
      radiusMinPixels: 3,
      radiusScale: config.mapScale / 2,

      getFillColor: d => {
        const quality = getSignalQuality(d.rssi);
        return quality.colorRGB;
      },
      updateTriggers: {
        getFillColor: [driveTestFilters?.thematic, driveTestFilters?.thematicMode, driveTestFilters?.ranges]
      }
      // opacity: 0.9
    });

  }, [driveTestData, activeDriveSessions, driveTestFilters, config.mapScale]);

  // for hover values(color of string), dot colors
  const getSignalQuality = (rssi) => {
      const { color, label } = getDriveTestColor(
          rssi,
          driveTestFilters?.thematic || "RSSI",
          driveTestFilters?.thematicMode || "Default",
          driveTestFilters?.ranges || []
      );
      return {
          label,
          colorText: color,
          colorRGB: hexToRgba(color).slice(0, 3)
      };
  };

  /* ============================================================
     🔹 Ruler — independent line segments
  ============================================================ */
  // Lines for all completed segments
  const rulerLineLayer = useMemo(() => {
    const complete = rulerSegments.filter(s => s.b !== null);
    if (!rulerMode || complete.length === 0) return null;
    return new LineLayer({
      id: "ruler-line",
      data: complete,
      getSourcePosition: d => d.a,
      getTargetPosition: d => d.b,
      getColor: [20, 20, 20, 220],
      getWidth: 2,
      widthUnits: "pixels",
    });
  }, [rulerMode, rulerSegments]);

  // Preview line from active segment's A to cursor
  const rulerPreviewLayer = useMemo(() => {
    if (!rulerMode || !activeSegment || !rulerHover) return null;
    return new LineLayer({
      id: "ruler-preview",
      data: [{ from: activeSegment.a, to: rulerHover }],
      getSourcePosition: d => d.from,
      getTargetPosition: d => d.to,
      getColor: [20, 20, 20, 100],
      getWidth: 1.5,
      widthUnits: "pixels",
    });
  }, [rulerMode, activeSegment, rulerHover]);

  // All endpoint dots + hover preview dot; dots are draggable and clickable (snap)
  const rulerDotsLayer = useMemo(() => {
    if (!rulerMode || rulerSegments.length === 0) return null;

    const dots = [];
    rulerSegments.forEach(seg => {
      const isPendingA = !seg.b; // this is the A of the in-progress segment
      dots.push({ position: seg.a, segId: seg.id, endpoint: 'a', preview: false, pendingA: isPendingA });
      if (seg.b) dots.push({ position: seg.b, segId: seg.id, endpoint: 'b', preview: false, pendingA: false });
    });
    if (rulerHover && activeSegment) {
      dots.push({ position: rulerHover, segId: null, endpoint: null, preview: true, pendingA: false });
    }

    return new ScatterplotLayer({
      id: "ruler-dots",
      data: dots,
      getPosition: d => d.position,
      // amber = pending A (click to cancel), grey = hover preview, white = confirmed
      getFillColor: d => d.preview ? [200, 200, 200, 180] : d.pendingA ? [251, 191, 36, 255] : [255, 255, 255, 255],
      getLineColor: d => d.pendingA ? [180, 120, 0, 255] : [20, 20, 20, 255],
      getRadius: d => d.preview ? 5 : d.pendingA ? 14 : 8,
      radiusUnits: "pixels",
      stroked: true,
      lineWidthUnits: "pixels",
      getLineWidth: 2,
      pickable: true,

      updateTriggers: { getFillColor: rulerSegments, getLineColor: rulerSegments },

      onHover: (info) => {
        const obj = info.object;
        setHoveringRulerDot(!!obj && !obj.preview);
      },
      onClick: (info, event) => {
        if (!info.object || info.object.preview) return;
        if (event?.rightButton) return; // right-click handled by contextmenu
        // snap to this dot — start or complete a segment
        const snapPos = info.object.position;
        setRulerSegments(prev => {
          const active = prev.find(s => s.b === null);
          if (active) return prev.map(s => s.id === active.id ? { ...s, b: snapPos } : s);
          return [...prev, { id: Date.now(), a: snapPos, b: null }];
        });
        setRulerHover(null);
      },
      onDragStart: (info) => {
        if (!info.object || info.object.preview) return;
        draggingRulerRef.current = { segId: info.object.segId, endpoint: info.object.endpoint };
        setIsDraggingRulerDot(true);
      },
      onDrag: (info) => {
        if (!draggingRulerRef.current || !info.coordinate) return;
        const { segId, endpoint } = draggingRulerRef.current;
        setRulerSegments(prev => prev.map(s => s.id === segId ? { ...s, [endpoint]: info.coordinate } : s));
      },
      onDragEnd: () => {
        draggingRulerRef.current = null;
        setIsDraggingRulerDot(false);
      },
    });
  }, [rulerMode, rulerSegments, rulerHover, activeSegment]);


  // Distance label per completed segment + hover preview label
  const rulerLabelLayer = useMemo(() => {
    if (!rulerMode || rulerSegments.length === 0) return null;

    const fmtDist = (a, b) => {
      const d = haversineKm(a, b);
      return d >= 1 ? `${d.toFixed(2)} km` : `${(d * 1000).toFixed(0)} m`;
    };
    const midPt = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

    const labels = rulerSegments
      .filter(s => s.b !== null)
      .map(s => ({ position: midPt(s.a, s.b), text: fmtDist(s.a, s.b) }));

    if (activeSegment && rulerHover) {
      labels.push({ position: midPt(activeSegment.a, rulerHover), text: fmtDist(activeSegment.a, rulerHover) });
    }
    if (labels.length === 0) return null;

    return new TextLayer({
      id: "ruler-label",
      data: labels,
      getPosition: d => d.position,
      getText: d => d.text,
      getSize: 13,
      getColor: [20, 20, 20, 255],
      getBackgroundColor: [255, 255, 255, 220],
      background: true,
      backgroundPadding: [6, 3, 6, 3],
      getBorderColor: [20, 20, 20, 180],
      getBorderWidth: 1,
      fontWeight: 600,
      getTextAnchor: "middle",
      getAlignmentBaseline: "center",
      pickable: false,
      fontFamily: "sans-serif",
    });
  }, [rulerMode, rulerSegments, rulerHover, activeSegment]);


  
  /* ============================================================
     🔹 ALL LAyers Dispatching logic
  ============================================================ */
  const layers = useMemo(() => {
    const baseLayers = [];
    if (layerVisibility.CELLS) {
      if (currentZoom < 12 && markerLayer) baseLayers.push(markerLayer); // site markers (<10) + cell dots (10-12)
      if (currentZoom >= 12 && sectorLayer) baseLayers.push(sectorLayer); // cell sectors

      if (siteHighlightLayer) baseLayers.push(siteHighlightLayer);
      if (taSectorLayer) baseLayers.push(...taSectorLayer);
    }

    if (siteLayer) baseLayers.push(siteLayer);
    if (rulerLineLayer) baseLayers.push(rulerLineLayer);
    if (rulerPreviewLayer) baseLayers.push(rulerPreviewLayer);
    if (rulerDotsLayer) baseLayers.push(rulerDotsLayer);
    if (rulerLabelLayer) baseLayers.push(rulerLabelLayer);

     // NON-CELL layers
    if (customGeoJsonLayer) baseLayers.push(customGeoJsonLayer); // kenya and other boundaries (when selected)
    if (rfPredictionLayer) baseLayers.push(rfPredictionLayer); // RF PRediction Layer (when selected)
    if (drivetestLayer) baseLayers.push(drivetestLayer); // RF drive test layer (when selected)

    if (selectedCellLayer) baseLayers.push(selectedCellLayer); // always on top

    return baseLayers;
  }, [ currentZoom, markerLayer, sectorLayer, siteHighlightLayer, taSectorLayer,
      customGeoJsonLayer, rfPredictionLayer, drivetestLayer,
      layerVisibility.CELLS, siteLayer, rulerLineLayer,
      rulerPreviewLayer, rulerDotsLayer, rulerLabelLayer, selectedCellLayer]);

  /* ============================================================
     🔹 VIEW STATE HANDLER (SYNC LOGIC)
  ============================================================ */

  const handleViewStateChange = ({ viewState }) => {

    const cleanedViewState = {
      longitude: viewState.longitude,
      latitude: viewState.latitude,
      zoom: viewState.zoom,
      pitch: viewState.pitch,
      bearing: viewState.bearing
    };

    //   const cleanViewState = (vs) => {
    //   const { longitude, latitude, zoom, pitch, bearing } = vs;
    //   return { longitude, latitude, zoom, pitch, bearing };
    // };
    if (syncEnabled) {
      dispatch(MapActions.setViewState(cleanedViewState));
    } else {
      setLocalViewState(cleanedViewState);
    }
  };

/* ============================================================
     🔹 Go back to you dataset prefered location
  ============================================================ */

  const fitToData = () => {
    if (!rawCells || rawCells.length === 0) return;

    const bounds = rawCells.map(d => [
      Number(d.longitude),
      Number(d.latitude)
    ]);

    const viewport = new WebMercatorViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });

    let { longitude, latitude, zoom } =
      viewport.fitBounds(bounds, { padding: 40 });

    // 🔥 Prevent extreme zoom
    zoom = Math.min(zoom, 13);

    const newView = {
      longitude,
      latitude,
      zoom,
      pitch: 0,
      bearing: 0
    };

    dispatch(MapActions.setViewState(newView));

  };

  /* ============================================================
     🔹 Styling of popup dragger with cell details
  ============================================================ */
    // const cellStyle = {
    //     border: "1px solid #d1d5db",
    //     padding: "4px",
    //     fontWeight: "600",
    //     background: "#f9fafb"
    // };

    // const valueStyle = {
    //     border: "1px solid #d1d5db",
    //     padding: "4px"
    // };


  /* ============================================================
     🔹 Draggable pop functions 
  ============================================================ */
  const copyToClipboarding = (data) => {
    const finalData = Object.entries(data)
        .map((itm) => `${itm[0]}: ${itm[1]}`)
        .join('; ');
    navigator.clipboard.writeText(finalData);
    dispatch(ALERTS({
        show: true,
        icon: 'info',
        buttons: [],
        type: 1,
        text: 'Text copied Successfully'
    }));
  };

  const moveToSiteAnalyticsWindow = (data, from) => {
      dispatch(CommonActions.setLastName(true, 'Site Analytics'));
      if (from === 'one') {
          navigate('/dataplus-analytics-pro/site-analytics?uniqueId=' + data.Physical_id);
      } else {
          const newWin = window.open('/dataplus-analytics-pro/site-analytics?uniqueId=' + data.Physical_id, '_blank', 'noopener,noreferrer');
          if (newWin) newWin.opener = null;
      }
  };

  const moveToCellAnalyticsWindow = (data, from) => {
      dispatch(CommonActions.setLastName(true, 'Cell Analytics'));
      if (from === 'one') {
          navigate('/dataplus-analytics-pro/cell-analytics?uniqueId=' + data.Cell_name);
      } else {
          const newWin = window.open('/dataplus-analytics-pro/cell-analytics?uniqueId=' + data.Cell_name, '_blank', 'noopener,noreferrer');
          if (newWin) newWin.opener = null;
      }
  };

  const moveToSiteProrulesWindow = (data, from) => {
      dispatch(CommonActions.setLastName(true, 'Site Pro Rules'));
      if (from === 'one') {
          navigate('/dataplus-analytics-pro/site-pro-rules?uniqueId=' + data.Physical_id);
      } else {
          const newWin = window.open('/dataplus-analytics-pro/site-pro-rules?uniqueId=' + data.Physical_id, '_blank', 'noopener,noreferrer');
          if (newWin) newWin.opener = null;
      }
  };

  const moveToCellProrulesWindow = (data, from) => {
      dispatch(CommonActions.setLastName(true, 'Cell Pro Rules'));
      if (from === 'one') {
          navigate('/dataplus-analytics-pro/cell-pro-rules?uniqueId=' + data.Cell_name);
      } else {
          const newWin = window.open('/dataplus-analytics-pro/cell-pro-rules?uniqueId=' + data.Cell_name, '_blank', 'noopener,noreferrer');
          if (newWin) newWin.opener = null;
      }
  };

  const openCellProRulesModal = (data) => {
      setCellProRulesCell(data);
      setShowCellProRulesModal(true);
  };

  // Keep Cell Pro Rules in sync when user selects a different cell
  useEffect(() => {
      if (showCellProRulesModal && selectedCell) {
          setCellProRulesCell(selectedCell);
      }
  }, [selectedCell]);

  // Handle Closing of Legends
  const handleLegendClose = (layer) => {
    dispatch(MapActions.setLayerLegend(layer, false));
  };
  /* ============================================================
     🔹 RENDER
  ============================================================ */
  return (
    <div ref={mapContainerRef} className="relative w-full h-full overflow-hidden" onContextMenu={handleMapContextMenu}>
      {/* <button
        onClick={fitToData}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          background: "white",
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          cursor: "pointer"
        }}
      >
        📍
      </button> */}
      <DeckGL
        ref={deckRef}
        viewState={{ ...activeViewState }}
        controller={{ dragPan: !isDraggingRulerDot, dragRotate: !isDraggingRulerDot, doubleClickZoom: !rulerMode }}
        // getMapboxApiAccessToken={() => MAPBOX_TOKEN}
        // layers={[
        //   ...(currentZoom < 9
        //     ? (markerLayer ? [markerLayer] : [])
        //     : (sectorLayer ? [sectorLayer] : [])),
        //       customGeoJsonLayer,
        // ].filter(Boolean)}
        // layers={[
        //   markerLayer,
        //   sectorLayer,
        //   customGeoJsonLayer
        // ].filter(Boolean)}
        layers={layers}
        onViewStateChange={handleViewStateChange}
        className="absolute w-full h-full"
        widgets={[
          new ZoomWidget({ 
            placement: 'bottom-right',
            style: {  marginRight: '12px', marginBottom: '50px' }
          }),
          new FullscreenWidget({ 
            placement: 'bottom-right',
            style: {  marginRight: '12px', marginBottom: '120px' }
          }),
          new CompassWidget({ 
            placement: 'bottom-right',
            style: { marginRight: '12px', marginBottom: '148px' },
            viewId: 'default'
          }),
        ]}
        //  Tooltip on layers
        getTooltip={({ object, layer }) => {
          if (!object || !layer?.id) return null;

          // TA Sector Layer
          // if (layer.id === 'ta-sector-layer') {
          //   return {
          //     html: `
          //       <div style="font-size:12px; max-width: 220px;">
          //         <div style="font-weight:700; margin-bottom:4px; color:#60a5fa;">${object.cellId || ''}</div>
          //         <div><b>Distance:</b> ${object.distance?.toFixed(0) || 0} m</div>
          //         <div><b>Frequency Reports:</b> ${object['Freq of reports']?.toLocaleString() || 0}</div>
          //         <div><b>Share in Range:</b> ${object['Share in range %']?.toFixed(2) || 0}%</div>
          //       </div>
          //     `
          //   };
          // }
          if (layer.id === 'ta-sector-layer-fill') {
  return {
    html: `
      <div style="font-size:12px; min-width:210px; font-family:sans-serif;">
        <div style="font-weight:700; margin-bottom:8px; color:#60a5fa; font-size:13px; border-bottom:1px solid #2c4a85; padding-bottom:5px;">
          ${object.cell_name || object.cellId || ''}
        </div>
        <div style="display:flex; justify-content:space-between; gap:12px; margin-bottom:4px;">
          <span style="color:#9ca3af;">Distance</span>
          <span style="font-weight:600;">${(object.distance ?? 0).toFixed(0)} m</span>
        </div>
        <div style="display:flex; justify-content:space-between; gap:12px; margin-bottom:4px;">
          <span style="color:#9ca3af;">Freq of Reports</span>
          <span style="font-weight:600;">${(object['Freq of reports'] ?? 0).toLocaleString()}</span>
        </div>
        <div style="display:flex; justify-content:space-between; gap:12px; margin-bottom:4px;">
          <span style="color:#9ca3af;">Total Samples</span>
          <span style="font-weight:600;">${(object.total_samples ?? 0).toLocaleString()}</span>
        </div>
        <div style="display:flex; justify-content:space-between; gap:12px;">
          <span style="color:#9ca3af;">Share in Range</span>
          <span style="font-weight:600; color:#34d399;">${(object['Share in range %'] ?? 0).toFixed(2)}%</span>
        </div>
      </div>
    `
  };
}

          // Drive Test Layer
          if (layer.id === "drivetest-layer") {
            const signal = getSignalQuality(object.rssi);
            return {
              html: `
                <div style="font-size:12px">
                  <div>
                    <b>Signal:</b>
                    <span style="
                      font-weight:bold;
                      color:${signal.colorText};
                    ">
                      ${signal.label}
                    </span>
                  </div>
                  <div><b>RSSI:</b> ${object.rssi} dBm</div>
                  <div><b>Latitude:</b> ${object.latitude}</div>
                  <div><b>Longitude:</b> ${object.longitude}</div>
                  <div><b>Session:</b> ${object.session_id}</div>
                </div>
              `
            };
          }

          return null;
        }}

        // Ruler — hover preview and per-segment click
        onHover={({ coordinate }) => {
          if (rulerMode && activeSegment && coordinate && draggingRulerRef.current === null) {
              setRulerHover(coordinate);
          }
        }}
        onClick={({ coordinate, layer, object }, event) => {
          if (!rulerMode || !coordinate) return;
          if (event?.rightButton) return; // right-click is handled by contextmenu → cancel
          // real endpoint dots handle themselves; preview dot (follows cursor) must fall through to place B
          if (layer?.id === 'ruler-dots' && !object?.preview) return;
          setRulerSegments(prev => {
            const active = prev.find(s => s.b === null);
            if (active) return prev.map(s => s.id === active.id ? { ...s, b: coordinate } : s);
            return [...prev, { id: Date.now(), a: coordinate, b: null }];
          });
          setRulerHover(null);
        }}
        getCursor={({ isDragging }) => {
            if (draggingRulerRef.current !== null) return "crosshair";
            if (rulerMode && hoveringRulerDot) return "crosshair";
            if (rulerMode) return "crosshair";
            return isDragging ? "crosshair" : "crosshair";
            // if (draggingRulerRef.current !== null) return "grabbing";
            // if (rulerMode && hoveringRulerDot) return "grab";
            // if (rulerMode) return "crosshair";
            // return isDragging ? "grabbing" : "grab";
        }}
      >
       {/* <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          // mapStyle={config.mapView}
          mapStyle={config.mapView || "mapbox://styles/mapbox/streets-v11"}
          style={{ pointerEvents: "auto" }}
          //  mapStyle="mapbox://styles/mapbox/light-v10"
        >
          {/* <NavigationControl position="top-right" />
          <FullscreenControl position="top-right" />
          <ScaleControl position="bottom-right" unit="metric" /> */}
        {/* </Map>  */}
        {/* <Map
          mapStyle={{
            version: 8,
            sources: {
              "basemap": {
                type: "raster",
                tiles: [
                  `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`
                ],
                tileSize: 256,
                attribution: "© Mapbox © OpenStreetMap"
              }
            },
            layers: [{ id: "basemap-layer", type: "raster", source: "basemap" }]
          }}
          style={{ pointerEvents: "auto" }}
        /> */}

          <Map
              mapStyle={getMapStyle(config.mapView || "voyager")}
              className="pointer-events-auto"
            // language="en"
          />
        </DeckGL>

        {/* ✅ LEGENDs */}
        {layerLegends.SITES && (
          <LegendBox
            layer="SITES"
            thematic={activeSiteThematic}
            onClose={() => handleLegendClose("SITES")}
            initialX={containerWidth - 250}
            initialY={80}
          />
        )}

        {layerLegends?.CELLS && (
          <LegendBox
            layer="CELLS"
            thematic={activeThematic}
            onClose={() => handleLegendClose("CELLS")}
            initialX={containerWidth - 250}
            initialY={260}
          />
        )}

        {layerLegends?.DRIVE_TEST && driveTestThematic && (
          <LegendBox
            layer="DRIVE TEST"
            thematic={driveTestThematic}
            onClose={() => handleLegendClose("DRIVE_TEST")}
            initialX={containerWidth - 250}
            initialY={440}
          />
        )}

        {layerLegends?.BOUNDARY && boundaryLegendThematic && (
          <LegendBox
            layer="BOUNDARY"
            thematic={boundaryLegendThematic}
            onClose={() => handleLegendClose("BOUNDARY")}
            initialX={containerWidth - 500}
            initialY={80}
          />
        )}

        {layerLegends?.RF && rfLegendThematic && (
          <LegendBox
            layer="RF"
            thematic={rfLegendThematic}
            onClose={() => handleLegendClose("RF")}
            initialX={containerWidth - 500}
            initialY={260}
          />
        )}

        {/* Cell info popup */}
        {selectedCell && selectedCell.operator === operator && (
          <CellInfoPopup
            data={{
                cell_name:  selectedCell.cell_id,
                site_name:  selectedCell.site_name,
                technology: selectedCell.technology,
                operator:   selectedCell.operator,
                region:     selectedCell.region,
                band:       selectedCell.band,
                latitude:   selectedCell.latitude,
                longitude:  selectedCell.longitude,
                azimuth:    selectedCell.azimuth,
            }}
            mapH="100%"
            mapW="100%"
            onClose={() => { dispatch(MapActions.setSelectedCell(null)); setShowCellProRulesModal(false); }}
            onCopy={copyToClipboarding}
            onSiteAnalytics={(d, mode) => moveToSiteAnalyticsWindow(d, mode === 'newTab' ? 'two' : 'one')}
            onCellAnalytics={(d, mode) => moveToCellAnalyticsWindow(d, mode === 'newTab' ? 'two' : 'one')}
            onSiteProRules={(d, mode) => moveToSiteProrulesWindow(d, mode === 'newTab' ? 'two' : 'one')}
            onCellProRules={(d, mode) => {
                if (mode === 'newTab') {
                    moveToCellProrulesWindow(d, 'two');
                } else {
                    openCellProRulesModal(d);
                }
            }}
            onChartClick={(d) => {
                // wire Superset modal here when ready
            }}
            onChartRightClick={(d) => {
                window.open(`/Filtered-cell-dashboard/${DASHBOARD_UUID}?cell=${d.Cell_name}&filterId=${FILTER_Id}`, '_blank');
            }}
            />
        )}

        {showCellProRulesModal && (
          <CellProRulesModal
            isOpen={showCellProRulesModal}
            setIsOpen={setShowCellProRulesModal}
            cellId={cellProRulesCell?.cell_id || cellProRulesCell?.Cell_name}
            cellName={cellProRulesCell?.Cell_name || cellProRulesCell?.cell_name}
          />
        )}

      <div className="absolute bottom-[270px] right-3 z-10 flex flex-col rounded-md overflow-hidden shadow-md border border-black/15">
          {/* Fit to data */}
          <button
            title="Fit to data"
            onClick={fitToData}
            className="w-8 h-8 bg-white border-b border-black/10 flex items-center justify-center p-0 cursor-pointer hover:bg-gray-100"
          >
            📍
          </button>

          {/* Ruler */}
          <button
            title={rulerMode ? "Clear ruler" : "Measure distance"}
            onClick={() => {
              if (rulerMode) {
                setRulerSegments([]);
                setRulerHover(null);
              }
              dispatch(MapActions.setRulerMode(!rulerMode));
            }}
            className={`w-8 h-8 flex items-center justify-center p-0 cursor-pointer ${rulerMode ? "bg-[#1a1a1a]" : "bg-white hover:bg-gray-100"}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={rulerMode ? "#facc15" : "#333"}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="10" rx="1"/>
              <line x1="6"  y1="7"  x2="6"  y2="11"/>
              <line x1="10" y1="7"  x2="10" y2="13"/>
              <line x1="14" y1="7"  x2="14" y2="11"/>
              <line x1="18" y1="7"  x2="18" y2="11"/>
            </svg>
          </button>
        </div>

        {/* ── Context Menu (right-click on cell sector) ── */}
        {contextMenu && (
            <>
                {/* backdrop – click outside closes menu */}
                <div
                    className="absolute inset-0 z-[19]"
                    onMouseDown={() => setContextMenu(null)}
                />
                <div
                    onMouseDown={e => e.stopPropagation()}
                    className="absolute z-[20] min-w-[210px] rounded-xl overflow-hidden shadow-2xl border border-[#2c4a85]"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                    {/* ── Header ── */}
                    <div className="bg-[#162a52] px-3 py-2 flex items-center gap-2">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            className="shrink-0">
                            <circle cx="12" cy="10" r="3"/>
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                        </svg>
                        <span className="text-white text-[13px] font-semibold tracking-wide truncate max-w-[160px]">
                            {contextMenu.cell?.cell_id}
                        </span>
                    </div>

                    {/* ── Body ── */}
                    <div className="bg-white/95 px-3 pt-3 pb-3 flex flex-col gap-3">
                        {/* TA Rings toggle */}
                        <label
                            className="flex items-center gap-2.5 cursor-pointer select-none"
                            onClick={e => e.stopPropagation()}
                        >
                            <input
                                type="checkbox"
                                checked={selectedTaCells.some(c => c.cellId === contextMenu.cell.cell_id)}
                                onChange={e => {
                                    if (e.target.checked) {
                                        dispatch(MapActions.fetchTaSectors(
                                            contextMenu.cell.cell_id,
                                            contextMenu.cell.cell_id,
                                            {
                                                lat: Number(contextMenu.cell.latitude),
                                                lng: Number(contextMenu.cell.longitude),
                                                azimuth: Number(contextMenu.cell.azimuth),
                                                beamWidth: Number(contextMenu.cell.radius_m) || 60,
                                            }
                                        ));
                                    } else {
                                        dispatch(MapActions.setTaSectorData(contextMenu.cell.cell_id, null));
                                    }
                                }}
                                className="w-4 h-4 shrink-0 cursor-pointer accent-[#162a52]"
                            />
                            <span className="text-[13px] font-medium text-gray-800">TA Rings</span>
                        </label>

                        {/* Dismiss button */}
                        <button
                            onClick={() => setContextMenu(null)}
                            className="w-full py-1.5 text-[13px] font-medium text-white bg-[#162a52] hover:bg-[#1e3a70] border border-[#2c4a85] rounded-lg cursor-pointer transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </>
        )}

    </div>
  );
};

export default TelecomMap;
