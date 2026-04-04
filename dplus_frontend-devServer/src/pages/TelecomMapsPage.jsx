// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import TelecomMapsContainer from "../components/MapsUsingDeckgl/TelecomMapsContainer";
// import TelecomFiltersPanel from "../components/MapsUsingDeckgl/TelecomFiltersPanel";
// import TelecomGlobalFilters from "../components/MapsUsingDeckgl/TelecomGlobalFilters ";

// import MapActions from "../store/actions/map-actions";

// const TelecomMapsPage = () => {

//   const dispatch = useDispatch();

//   const rawCells = useSelector(state => state.map.rawCells);

//   /* ============================================================
//      🔹 Fetch Telecom Data On Page Load
//   ============================================================ */

//   useEffect(() => {

//     // If data already loaded, do not refetch
//     if (rawCells.length > 0) return;

//     // dispatch(MapActions.getTelecomCells());
//     // dispatch(MapActions.getMarkerList({}, () => {}, true));
//     dispatch({
//       type: "mapQuery/SET_RAW_CELLS",
//       payload: [
//         {
//           cell_id: "TestCell_1",
//           site_name: "TestSite",
//           technology: "4G",
//           operator: "Telkom",
//           latitude: -26.26,
//           longitude: -53.43,
//           azimuth: 120,
//           beam_width: 60,
//           radius_m: 500,
//           status: "active"
//         }
//       ]
//     });

//   }, [dispatch, rawCells.length]);

//   /* ============================================================
//      🔹 Page Layout
//   ============================================================ */

//   return (
//     <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>

//       {/* Maps Container */}
//       <div style={{ flex: 1 }}>
//         {/* <TelecomFiltersPanel /> */}
//         <TelecomGlobalFilters />
//         <TelecomMapsContainer />
//       </div>

//     </div>
//   );
// };

// export default TelecomMapsPage;

import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import TelecomMap from "../components/MapsUsingDeckgl/TelecomMap";
import TelecomMapGisToolbar from "../components/MapsUsingDeckgl/TelecomMapGisToolbar";
import MapActions from "../store/actions/map-actions";

const TelecomMapsPage = () => {
  const dispatch = useDispatch();
  const gisFullscreenRootRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          dispatch(MapActions.getBoundaryGroups()),
          dispatch(MapActions.getRfPredictionFilters()),
          dispatch(MapActions.getUserMapSetup()),
          dispatch(MapActions.getMultiVendorCells({})),
          dispatch(MapActions.getSites()),
        ]);
      } catch (e) {
        if (import.meta.env.DEV) console.warn("GIS init", e?.message ?? e);
      }
    };
    init();
  }, [dispatch]);

// const [kenyaGeoJson, setKenyaGeoJson] = useState(null);

// useEffect(() => {
//   fetch('/kenya.geojson')
//     .then(res => res.json())
//     .then(data => {
//       const key = Object.keys(data)[0];
//       const raw = data[key][0].geojson;
//       const parsed = JSON.parse(raw);
//       console.log("GeoJSON loaded:", parsed.type, parsed.features?.length, "features");
//       setKenyaGeoJson(parsed);
//     })
//     .catch(err => console.error('Failed to load kenya.geojson:', err));
// }, []);

  return (

    // 🔥 Full 2x2 Grid with individual filters (Can be enabled later)
    // <div className="w-full h-screen flex flex-col">
    //   <TelecomGlobalFilters />
    //   <div className="flex-1">
    //     <TelecomMapsContainer />
    //   </div>
    // </div>

    <div
      ref={gisFullscreenRootRef}
      className="relative h-full min-h-0 w-full flex-1 overflow-hidden"
    >
      <div className="absolute inset-0 min-h-0">
        <TelecomMap operator="Huawei" fullscreenRootRef={gisFullscreenRootRef} />
      </div>
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex justify-start px-3 pt-2">
        <div className="pointer-events-auto">
          <TelecomMapGisToolbar />
        </div>
      </div>
    </div>

  );
};

export default TelecomMapsPage;