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

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TelecomMapsContainer from "../components/MapsUsingDeckgl/TelecomMapsContainer";
import TelecomMap from "../components/MapsUsingDeckgl/TelecomMap";
import MapActions from "../store/actions/map-actions";

import LeftFilters from "../components/MapsUsingDeckgl/LeftFilters";
import RightFilters from "../components/MapsUsingDeckgl/RightFilters";

const TelecomMapsPage = () => {

  const dispatch = useDispatch();
  const rawCells = useSelector(state => state.map.rawCells);

useEffect(() => {
     const init = async () => {
        await dispatch(MapActions.getBoundaryGroups());
        await dispatch(MapActions.getRfPredictionFilters()); // ← wait for RF filters first
        dispatch(MapActions.getUserMapSetup());              // ← now rfPredictionFilters is populated
    };
    init();

    dispatch(MapActions.getMultiVendorCells({}));
    dispatch(MapActions.getSites());
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

    // 🔥 For testing single map with filters
    <div className="w-full h-full flex flex-col">
      <div className="relative flex items-center gap-2 p-1 bg-[#0b1c38]">
        <LeftFilters />
        <RightFilters />
    </div>

      <div className="flex-1 min-h-0">
        {/* <TelecomMap operator="Huawei"  geojsonLayer={kenyaGeoJson} /> */}
                <TelecomMap operator="Huawei" />
      </div>
    </div>

  );
};

export default TelecomMapsPage;