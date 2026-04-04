import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import Map from "react-map-gl";
import MapActions from "../../store/actions/map-actions"; // 

// 🔹 Mapbox token from Vite
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
// const MAPBOX_TOKEN = ""; 


const SyncedVendorMaps = () => {

  const dispatch = useDispatch();

  // 🔹 Get dataset from Redux (NOT local state anymore)
  const data = useSelector(
    (state) => state.map.supersetMapData || []
  );

  // 🔹 Shared view state (THIS syncs both maps)
  const [viewState, setViewState] = useState({
    longitude: 36.82,
    latitude: -1.29,
    zoom: 8,
    pitch: 0,
    bearing: 0,
  });

  // =====================================================
  // 🔹 Fetch Superset dataset once on mount
  // =====================================================
  useEffect(() => {
    dispatch(MapActions.getSupersetMapData());
  }, [dispatch]);

  // =====================================================
  // 🔹 Split dataset by vendor
  // =====================================================
const huaweiData = useMemo(
  () => data.filter(d => d.vendor?.toLowerCase() === "huawei"),
  [data]
);

const airtelData = useMemo(
  () => data.filter(d => d.vendor?.toLowerCase() === "airtel"),
  [data]
);

  // =====================================================
  // 🔹 Superset radius logic replication
  // =====================================================
  const getRadius = (value = 0) => {
    const scaled = value * 0.05;
    return Math.max(2, Math.min(20, scaled));
  };

  // =====================================================
  // 🔹 Create deck.gl layers (memoized)
  // =====================================================
  const huaweiLayer = useMemo(() =>
    new ScatterplotLayer({
      id: "huawei",
      data: huaweiData,
      getPosition: d => [d.longitude, d.latitude],
      getRadius: d => getRadius(d.dl_volume_daily),
      getFillColor: [0, 150, 255],
      pickable: true,
    }),
    [huaweiData]
  );

  const airtelLayer = useMemo(() =>
    new ScatterplotLayer({
      id: "airtel",
      data: airtelData,
      getPosition: d => [d.longitude, d.latitude],
      getRadius: d => getRadius(d.dl_volume_daily),
      getFillColor: [255, 0, 0],
      pickable: true,
    }),
    [airtelData]
  );

  console.log("MAPBOX TOKEN:", import.meta.env.VITE_MAPBOX_TOKEN);
console.log("Full Data:", data);
console.log("Huawei Data:", huaweiData);
console.log("Airtel Data:", airtelData);

  // =====================================================
  // 🔹 Render two synced maps
  // =====================================================
  return (
 <div
    style={{
      display: "flex",
      gap: "16px",
      padding: "16px",
      height: "calc(100vh - 120px)", // adjust based on header height
      boxSizing: "border-box",
    }}
  >
    {/* ================= LEFT CARD ================= */}
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Card Header */}
      <div
        style={{
          padding: "12px 16px",
          fontWeight: 600,
          borderBottom: "1px solid #eee",
        }}
      >
        Huawei
      </div>

      {/* Card Body (Map fills remaining height) */}
      <div style={{ flex: 1, position: "relative" }}>
        <DeckGL
          viewState={viewState}
          controller={true}
          layers={[huaweiLayer]}
          onViewStateChange={({ viewState }) => setViewState(viewState)}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        >
          <Map
            mapboxApiAccessToken={MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/light-v10"
          />
        </DeckGL>
      </div>
    </div>

    {/* ================= RIGHT CARD ================= */}
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Card Header */}
      <div
        style={{
          padding: "12px 16px",
          fontWeight: 600,
          borderBottom: "1px solid #eee",
        }}
      >
        Airtel
      </div>

      {/* Card Body */}
      <div style={{ flex: 1, position: "relative" }}>
        <DeckGL
          viewState={viewState}
          controller={true}
          layers={[airtelLayer]}
          onViewStateChange={({ viewState }) => setViewState(viewState)}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        >
          <Map
            mapboxApiAccessToken={MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/light-v10"
          />
        </DeckGL>
      </div>
    </div>
  </div>
  );
};

export default SyncedVendorMaps;