// import { WebMercatorViewport } from "@deck.gl/core"
// import Api from "../../utils/api"
// import { Urls } from "../../utils/url"
// import { SET_AUTHENTICATED, SET_COMMON_CONFIG, SET_TOKEN, SET_USER } from "../reducers/auth-reducer"
// import { ALERTS } from "../reducers/component-reducer"
// import { deepCopyRanges, KPI_RANGE_DEFAULTS } from "../../components/MapsUsingDeckgl/Utils/colorEngine";
// import { 
//     // OLD TELECOM REDUCER IMPORTS
//     GET_ALL_FILTER, 
//     MARKER_CHART_LIST, 
//     MARKER_LIST, 
//     TECH_WITH_BAND,

//     // NEW TELECOM REDUCER IMPORTS
//     SET_RAW_CELLS,
//     SET_VIEW_STATE,
//     SET_FILTERS,
//     SET_SYNC_ENABLED,
//     SET_SELECTED_CELL,
//     SET_MAP_CONFIG,
//     SET_TELECOM_FILTER_META,
//     SET_TELECOM_TECH_META,
//      // Adding map layers as boundaries, related imports
//     SET_BOUNDARY_GROUPS,
//     SET_BOUNDARY_GEOJSON,
//     CLEAR_BOUNDARY_GEOJSON,
//     SET_SELECTED_BOUNDARIES,
//     SET_HIGHLIGHTED_CELL,

//     SET_ACTIVE_THEMATIC,
//     SET_DRIVE_TEST_DATA,
//     SET_DRIVE_TEST_FILTERS,
//     SET_ACTIVE_DRIVE_SESSIONS,

//     SET_RF_PREDICTION_FILTERS,
//     SET_RF_PREDICTION_GEOJSON,
//     SET_RF_PREDICTION_SELECTION,

//     CLEAR_RF_PREDICTION_GEOJSON,
//     SET_LAYER_OPACITY,
//     RESET_LAYER_OPACITY,
//     SET_LAYER_VISIBILITY,
//     RESET_LAYER_VISIBILITY,

// } from "../reducers/map-reducer"

// const MapActions = {
//     /* ============================================================
//        OLD EXISTING LOGIC (UNCHANGED)
//     ============================================================ */

//     postApiCaller: (urls, data, cb= () => {}) => async (dispatch, _) => {
//         try {
//             console.log("CommonPostActions.postApiCaller")
//             const res = await Api.post({ url: urls, data })
//             if (res?.status !== 201 && res?.status !== 200) return

//             cb()
//         } catch (error) {
//             console.log(error, "amit errorerror 37")

//             // dispatch(Notify.error('something went wrong! please try again after a while'))
//         }
//     },
//     logoutCaller: (cb = () => { }) => async (dispatch, _) => {
//         try {
//             // console.log("CommonPostActions.postApiCaller")
//             // const res = await Api.post({ url: urls, data })
//             // if (res?.status !== 201 && res?.status !== 200) return

//             localStorage.setItem("auth", false)
//             localStorage.removeItem("token")
//             localStorage.removeItem("user")

//             dispatch(SET_TOKEN(""))
//             dispatch(SET_USER(JSON.stringify({})))
//             dispatch(SET_AUTHENTICATED(false))


//             cb()


//             // let msgdata = {
//             //     show: true,
//             //     icon: 'error',
//             //     buttons: [
//             //     ],
//             //     text: "Your Session is Expired"
//             // }
//             // dispatch(ALERTS(msgdata))
//         } catch (error) {
//             console.log(error, "amit errorerror 37")

//             // dispatch(Notify.error('something went wrong! please try again after a while'))
//         }
//     },
//     getMarkerList: (data, cb= () => {}, reset = true) => async (dispatch, _) => {
//         try {   
//             console.log("CommonPostActions.postApiCaller")
//             const res = await Api.post({ url: Urls.map_getmarker, data: data })
//             if (res?.status !== 201 && res?.status !== 200) return
//             let dataAll = res.data
//             dispatch(MARKER_LIST({ dataAll, reset }))
//             cb()
//         } catch (error) {
//             console.log(error, "amit errorerror 37")

//             // dispatch(Notify.error('something went wrong! please try again after a while'))
//         }
//     },
//     saveCurrentMapLatLong: (data, cb= () => {}, reset = true) => async (dispatch, _) => {
//         try {
//             console.log("CommonPostActions.postApiCaller")
//             const res = await Api.post({ url: Urls.map_savelatlong, data: data, inst:0})
//             if (res?.status !== 201 && res?.status !== 200) return
//             let dataAll = res.data.data
//             localStorage.setItem('config', JSON.stringify(dataAll))
//             dispatch(SET_COMMON_CONFIG(dataAll))
//             cb()
//         } catch (error) {
//             console.log(error, "amit errorerror 37")

//             // dispatch(Notify.error('something went wrong! please try again after a while'))
//         }
//     },
// //     getMarkerChart: (data, cb = () => {}, reset = true) => async (dispatch, _) => {
// //         try {
// //             console.log("CommonPostActions.postApiCaller")
// //             const res = await Api.post({ url: Urls.map_getChart, data: data })
// //             // let dataAll = res.data.data;
// //             // ///////////////////////////////
// //             // if (res?.status !== 201 && res?.status !== 200) {

// //             //     let msgdata = {
// //             //         show: true,
// //             //         icon: res.data.icon,
// //             //         buttons: [],
// //             //         text: res.data.msg,
// //             //         type: 1
// //             //     }
// //             //     dispatch(ALERTS(msgdata))
// //             //     cb()
// //             //     dispatch(MARKER_CHART_LIST({ parsed.data, reset }))
// //             // } else {
// //             //     dispatch(MARKER_CHART_LIST({ parsed.data, reset }))
// //             // }

// //  if (res?.status !== 200 && res?.status !== 201) {
// //       dispatch(
// //         ALERTS({
// //           show: true,
// //           icon: res?.data?.icon,
// //           buttons: [],
// //           text: res?.data?.msg || "Failed to fetch chart data",
// //           type: 1,
// //         })
// //       );
// //       cb();
// //       return;
// //     }

// //     // ✅ SAFELY PARSE BACKEND RESPONSE
// //     const parsedResponse =
// //       typeof res.data === "string" ? JSON.parse(res.data) : res.data;

// //     const dataAll = parsedResponse?.data || {};

// //     // ✅ UPDATE REDUX
// //     dispatch(MARKER_CHART_LIST({ dataAll, reset }));

// //     cb();

// //         } catch (error) {
// //             console.log(error, "amit errorerror 37")
// //    dispatch(
// //       ALERTS({
// //         show: true,
// //         icon: "error",
// //         buttons: [],
// //         text: "Something went wrong while loading chart data",
// //         type: 1,
// //       })
// //     );
// //             // dispatch(Notify.error('something went wrong! please try again after a while'))
// //         }
// //     },
//     ////// correction here
    
//     getMarkerChart: (data, cb = () => {}, reset = true) => async (dispatch, _) => {
//         try {
//             console.log("CommonPostActions.postApiCaller");

//             const res = await Api.post({
//             url: Urls.map_getChart,
//             data: data,
//             });

//             if (res?.status !== 200 && res?.status !== 201) {
//             let msgdata = {
//                 show: true,
//                 icon: res?.data?.icon,
//                 buttons: [],
//                 text: res?.data?.msg,
//                 type: 1,
//             };
//             dispatch(ALERTS(msgdata));
//             cb();
//             return;
//             }

//             // ✅ THIS IS THE KEY LINE — 
//             dispatch(
//                 MARKER_CHART_LIST({
//                 dataAll: res.data.data,
//                 reset,
//                 })
//             );

//             cb();
//         } catch (error) {
//             console.log(error, "getMarkerChart error");
//         }
//     },

//     postTechWithBand: (data, cb = () => {}, reset = true) => async (dispatch, _) => {
//         try {
//             console.log("CommonPostActions.postApiCaller")
//             const res = await Api.post({ url: Urls.techwithband, data: data })
//             if (res?.status !== 201 && res?.status !== 200) return
//             let dataAll = res.data
//             dispatch(MARKER_LIST({ dataAll, reset }))
//             cb()
//         } catch (error) {
//             console.log(error, "amit errorerror 37")

//             // dispatch(Notify.error('something went wrong! please try again after a while'))
//         }
//     },
//     getTechWithBand: (reset = true, args = "") => async (dispatch, _) => {
//         try {
//             console.log("AuthActions.signin")
//             const res = await Api.get({ url: `${Urls.techwithband}${args != "" ? "?" + args : ""}`, inst: 0 })
//             if (res?.status !== 200) return
//             console.log(res.data, "res.data")
//             const dataAll = res.data.data
//             dispatch(TECH_WITH_BAND({ dataAll, reset }))
//         } catch (error) {
//             console.log(error, "amit errorerror 37")

//             // dispatch(Notify.error('something went wrong! please try again after a while'))
//         }
//     },
//     getAllFilterList: (reset = true, args = "") => async (dispatch, _) => {
//         try {
//             console.log("AuthActions.signin")
//             const res = await Api.get({ url: `${Urls.getAllFilterList}${args != "" ? "?" + args : ""}`, inst: 0 })
//             if (res?.status !== 200) return
//             console.log(res.data, "allres.data")
//             const dataAll = res.data.data
//             console.log(dataAll, "gggggggggsasaSsA")
//             dispatch(GET_ALL_FILTER({ dataAll, reset }))
//         } catch (error) {
//             console.log(error, "amit errorerror 37")

//             // dispatch(Notify.error('something went wrong! please try again after a while'))
//         }
//     },
//     deleteApiCaller: (urls, cb= () => {}) => async (dispatch, _) => {
//         try {
//             console.log("CommonPostActions.postApiCaller")
//             const res = await Api.delete({ url: urls })
//             if (res?.status !== 201 && res?.status !== 200) return

//             cb()
//         } catch (error) {
//             console.log(error, "amit errorerror 37")

//             // dispatch(Notify.error('something went wrong! please try again after a while'))
//         }
//     },
//     commondownload: (urls, filename, method = "GET", data = {}, cb) => async (dispatch, _) => {
//         // (reqUrl, data).then((response) => {

//         const res = await Api.blobFile({ url: urls, method: method, data: data })

//         console.log(res, "resresresres")

//         filename = urls.split("/").pop()


//         const url = window.URL.createObjectURL(new Blob([res.data]));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', `${filename}`);
//         document.body.appendChild(link);
//         link.click();
//     },


//      /* ============================================================
//        NEW TELECOM MAP LOGIC
//     ============================================================ */

//     /**
//      * Fetch Telecom Cells from Backend
//      * This replaces old markerList usage for deck.gl maps
//      */

//     getMultiVendorCells: (filters = {}) => async (dispatch) => {

//         try {
//             const res = await Api.post({
//                 url: Urls.multiVendor,
//                 data:  {
//                     dataValue: filters
//                 }
//             });
            
//             const apiData = res?.data?.data || [];
//             // const adapted = res.data.data.map(item => ({
//             const adapted = apiData.map(item => ({
//                 cell_id: item.cell_name,
//                 site_name: item.site_name,
//                 technology: item.technology,
//                 operator: item.vendor,
//                 region: item.region,
//                 band: item.band,
//                 latitude: item.latitude,
//                 longitude: item.longitude,
//                 azimuth: item.azimuth,
//                 beam_width: item.beamwidth,
//                 radius_m: item.length,
//                 status: "active",
//                 color: item.color
//             }));

//             // console.log("ADAPTED FIRST CELL:", adapted[0]);
//             dispatch(SET_RAW_CELLS(adapted));

//         } catch (err) {
//             console.log("multiVendor error", err);
//             // dispatch(SET_RAW_CELLS([]));
//         }
//     },

//     /* ============================================================
//     TELECOM FILTER METADATA (ISOLATED FROM OLD MAP)
//     ============================================================ */
//     getTelecomFilterMeta: () => async (dispatch) => {
//     try {
//         const res = await Api.get({
//         url: Urls.getAllFilterList,
//         inst: 0
//         });

//         if (res?.status !== 200) return;

//         dispatch(SET_TELECOM_FILTER_META(res.data.data));

//     } catch (err) {
//         console.log("telecom filter meta error", err);
//     }
//     },

//     getTelecomTechMeta: () => async (dispatch) => {
//     try {
//         const res = await Api.get({
//         url: Urls.techwithband,
//         inst: 0
//         });

//         if (res?.status !== 200) return;

//         dispatch(SET_TELECOM_TECH_META(res.data.data));

//     } catch (err) {
//         console.log("telecom tech meta error", err);
//     }
//     },

//     getUserMapSetup: () => async (dispatch, getState) => {
//         try {
//             const res = await Api.get({
//             url: Urls.setupConf,
//             inst: 0
//             });

//             if (res?.status !== 200) return;
//             const data = res?.data?.data || {};

//             /* ---------------- PARSE LAT LONG ---------------- */
//             let viewState = null;
//             if (data.saveLatLong) {
//                 const parsed = JSON.parse(data.saveLatLong);

//                 viewState = {
//                     longitude: Number(parsed.lng),
//                     latitude: Number(parsed.lat),
//                     zoom: Number(parsed.zoom),
//                     pitch: 0,
//                     bearing: 0
//                 };
//             }

//             /* ---------------- PARSE FILTERS ---------------- */

//             const filters = data.saveMapFilters
//             ? JSON.parse(data.saveMapFilters)
//             : {};

//             /* ---------------- PARSE THEMATICS ---------------- */

//             const thematics = data.saveThematics
//             ? JSON.parse(data.saveThematics)
//             : { type: "Default", colors: {} };

//             /* ---------------- MAP CONFIG ---------------- */

//             const config = {
//                 mapScale: Number(data.mapScale) || 1,
//                 mapView: data.mapView || "mapbox://styles/mapbox/streets-v11"
//             };

//             /* ---------------- DISPATCH ---------------- */

//             if (viewState) dispatch(SET_VIEW_STATE(viewState));

//             dispatch(SET_FILTERS(filters));
//             dispatch(SET_MAP_CONFIG(config));
//             dispatch(SET_ACTIVE_THEMATIC(thematics));

//             // LayerVisibilty settings
//             const layerVisibility = data.saveLayerVisibility
//                 ? JSON.parse(data.saveLayerVisibility)
//                 : null;

//             if (layerVisibility) {
//                 dispatch(SET_LAYER_VISIBILITY({ layer: "CELLS", value: layerVisibility.CELLS }));
//                 dispatch(SET_LAYER_VISIBILITY({ layer: "BOUNDARY", value: layerVisibility.BOUNDARY }));
//                 dispatch(SET_LAYER_VISIBILITY({ layer: "RF", value: layerVisibility.RF }));
//                 dispatch(SET_LAYER_VISIBILITY({ layer: "DRIVE_TEST", value: layerVisibility.DRIVE_TEST }));
//             } else {
//                 // Explicitly reset to false if nothing saved
//                 dispatch(SET_LAYER_VISIBILITY({ layer: "CELLS", value: false }));
//                 dispatch(SET_LAYER_VISIBILITY({ layer: "BOUNDARY", value: false }));
//                 dispatch(SET_LAYER_VISIBILITY({ layer: "RF", value: false }));
//                 dispatch(SET_LAYER_VISIBILITY({ layer: "DRIVE_TEST", value: false }));
//             }

//             const savedBoundaries = data.saveBoundaries
//                 ? JSON.parse(data.saveBoundaries)
//                 : {};

//             const savedDriveTestFilters = data.saveDriveTestFilters
//                 ? JSON.parse(data.saveDriveTestFilters)
//                 : null;

//             // convert "ALL" back to full arrays before storing in Redux
//             const normalizedBoundaries = Object.fromEntries(
//                 Object.entries(savedBoundaries).map(([group, value]) => {
//                     if (value === "ALL") {
//                         const groupObj = boundaryGroups.find(g => g.shapegroup === group);
//                         return [group, groupObj?.shapenames || []];
//                     }
//                     return [group, value];
//                 })
//             );

//             dispatch(SET_SELECTED_BOUNDARIES({
//                 ...normalizedBoundaries,
//                 RF: rfToRestore,
//                 DRIVE_TEST: savedDriveTestFilters?.sessions || []
//             }));
//             boundaryGroups.forEach(group => {
//                 const saved = savedBoundaries[group.shapegroup];
//                 if (!saved) return;

//                 // "ALL" means all children were selected
//                 const children = saved === "ALL" ? group.shapenames : saved;

//                 dispatch(SET_LAYER_VISIBILITY({ 
//                     layer: group.shapegroup, 
//                     value: saved === "ALL"
//                 }));

//                 if (children.length > 0) {
//                     dispatch(MapActions.getBoundaryGeoJson(
//                         group.shapegroup,
//                         group.shapetypes[0],
//                         children
//                     ));
//                 }
//             });

//             const savedRfParameter = data.saveRfParameter || "RSRP";
//             // const rfRegions = savedBoundaries["RF"] || [];
//             // rfRegions.forEach(region => {
//             //     dispatch(MapActions.getRfPredictionLayer(region, savedRfParameter));
//             // });

//             const savedRfRegions = data.saveRfRegions
//                 ? JSON.parse(data.saveRfRegions)
//                 : [];

//             const rfToRestore = savedRfRegions === "ALL"
//                 ? getState().map.rfPredictionFilters.map(f => f.name) // all regions
//                 : savedRfRegions;

//             rfToRestore.forEach(region => {
//                 dispatch(MapActions.getRfPredictionLayer(region, savedRfParameter));
//             });

//             if (rfToRestore.length > 0) {
//                 dispatch(SET_LAYER_VISIBILITY({ layer: "RF", value: true }));
//             }

//             // Restore Drive Test filters
            
//             // if (savedDriveTestFilters) {
//             //     dispatch(SET_DRIVE_TEST_FILTERS(savedDriveTestFilters));
//             //     dispatch(SET_ACTIVE_DRIVE_SESSIONS(savedDriveTestFilters.sessions || []));
//             // }
//             if (savedDriveTestFilters) {
//                 dispatch(SET_DRIVE_TEST_FILTERS({
//                     ...savedDriveTestFilters,
//                     // restore default ranges based on saved thematic (ranges not saved to backend)
//                     ranges: deepCopyRanges(KPI_RANGE_DEFAULTS[savedDriveTestFilters.thematic || "RSSI"])
//                 }));
//                 const sessions = savedDriveTestFilters.sessions || [];
//                 dispatch(SET_ACTIVE_DRIVE_SESSIONS(sessions));

//                 // re-fetch drive test data so it renders on map after reload
//                 if (sessions.length > 0) {
//                     dispatch(MapActions.getDriveTestData());
//                 }
//             }

//         } catch (err) {
//             console.log("setup config error", err);
//         }
//     },
//  /* ============================================================
//     ADD MAP LAYER
//     ============================================================ */

//     // Fetch boundary groups for map overlay (isolated from old map logic)
//     getBoundaryGroups: () => async (dispatch) => {
//         try {

//             const res = await Api.get({
//             url: Urls.boundary_groups,
//             inst: 0
//             });

//             if (res?.status !== 200) return;

//             const groups = res?.data?.data || [];
//             dispatch(SET_BOUNDARY_GROUPS(groups));;

//         } catch (err) {
//             console.log("boundary groups error", err);
//         }
//     },

//     // Fetch GeoJSON for a specific boundary group (isolated from old map logic)
//     getBoundaryGeoJson: (country, level, names=[]) => async (dispatch) => {
//         try {

//             const query = `?country=${country}&level=${level}`;
    
//             const res = await Api.get({
//             url: `${Urls.boundaries}${query}`,
//             inst: 0
//             }); 

//             if (res?.status !== 200) return;

//             let geojson = res.data.data;

//             // filter by shapename
//             if (names.length > 0) {
//             geojson.features = geojson.features.filter(
//                 f => names.includes(f.properties.name)
//             );
//             }

//             dispatch(
//             SET_BOUNDARY_GEOJSON(geojson)
//             );

//         } catch (err) {
//             console.log("boundary geojson error", err);
//         }
//     },

//     // RF Test drive data plotting
//     // getDriveTestData: () => async (dispatch) => {

//     //     try {

//     //         const res = await Api.get({
//     //         url: Urls.drive_test,
//     //         inst: 0
//     //         });

//     //         if (res?.status !== 200) return;

//     //         const raw = res?.data?.data?.[0];

//     //                 console.log("Drive test data", raw);

//     //         if (!raw) {
//     //         dispatch(SET_DRIVE_TEST_DATA([]));
//     //         return;
//     //         }

//     //         const { lat = [], lon = [], rssi = [], session_id } = raw;

//     //         const points = lat.map((latVal, i) => ({
//     //         latitude: Number(latVal),
//     //         longitude: Number(lon[i]),
//     //         rssi: Number(rssi[i]),
//     //         session_id
//     //         }));

//     //         dispatch(SET_DRIVE_TEST_DATA(points));

//     //     } catch (err) {

//     //         console.log("drive test data error", err);

//     //     }

//     //     },

//     getDriveTestData: () => async (dispatch) => {
//         try {

//             const res = await Api.get({
//             url: Urls.drive_test,
//             inst: 0
//             });

//             if (res?.status !== 200) return;

//             const sessions = res?.data?.data || [];

//             const allPoints = [];

//             sessions.forEach(session => {

//             const {
//                 lat = [],
//                 lon = [],
//                 rssi = [],
//                 session_id
//             } = session;

//             lat.forEach((latVal, i) => {

//                 allPoints.push({
//                 latitude: Number(latVal),
//                 longitude: Number(lon[i]),
//                 rssi: Number(rssi[i]),
//                 session_id
//                 });

//             });

//             });

//             dispatch(SET_DRIVE_TEST_DATA(allPoints));

//         } catch (err) {

//             console.log("drive test data error", err);

//         }
//     },

//         // RF Predictions geojson colored data plotting
//     getRfPredictionFilters: () => async (dispatch) => {
//     try {

//         const res = await Api.get({
//         url: Urls.rf_prediction_filters,
//         inst: 0
//         });

//     console.log("RF FILTERS API RESPONSE", res.data.data)

//         if (res?.status !== 200) return;

//         dispatch(
//         SET_RF_PREDICTION_FILTERS(res.data.data)
//         );

//     } catch (err) {

//         console.log("RF filters error", err);

//     }

//     },

//     getRfPredictionLayer:
//     (region, parameter, range_label) => async (dispatch) => {

//         console.log("Fetching RF layer for", region)
//     try {

//         const query =
//         `?region=${encodeURIComponent(region)}&parameter=${parameter}`;
//         //   `?region=${encodeURIComponent(region)}&parameter=${parameter}&range_label=${encodeURIComponent(range_label)}`;

//         const res = await Api.get({
//         url: `${Urls.rf_prediction_data}${query}`,
//         inst: 0
//         });
//         console.log("FULL RESPONSE RF Prediction", res);
//         console.log("FULL RESPONSE DATA", res.data);

//         if (res?.status !== 200) return;

//         dispatch(
//         SET_RF_PREDICTION_GEOJSON(res.data.data)
//         );

//     } catch (err) {

//         console.log("RF prediction error", err);

//     }

//     },

//     // fitToBounds: (points) => (dispatch) => {
//     //     if (!points || points.length === 0) return;

//     //     const viewport = new WebMercatorViewport({
//     //         width: window.innerWidth,
//     //         height: window.innerHeight
//     //     });

//     //     let { longitude, latitude, zoom } = viewport.fitBounds(points, { padding: 60 });
//     //     zoom = Math.min(zoom, 13);

//     //     dispatch(SET_VIEW_STATE({
//     //         longitude,
//     //         latitude,
//     //         zoom,
//     //         pitch: 0,
//     //         bearing: 0
//     //     }));
//     // },
// // getRfPredictionLayer:
// // (region, parameter, range_label) => async (dispatch) => {

// //   try {

// //     const res = await Api.get({
// //       url:
// //         `${Urls.rf_prediction_data}?region=${encodeURIComponent(region)}`
// //         + `&parameter=${parameter}`
// //         + `&range_label=${encodeURIComponent(range_label)}`,
// //       inst: 0
// //     });

// //     if (res?.status !== 200) return;

// //     dispatch(
// //       SET_RF_PREDICTION_GEOJSON(res.data.data)
// //     );

// //   } catch (err) {

// //     console.log("RF prediction fetch error", err);

// //   }

// // },

//     //  Update Map View State (for sync behavior)
//     setViewState: (viewState) => (dispatch) => {
//         dispatch(SET_VIEW_STATE(viewState))
//     },

//     //  Update Filters
//     setFilters: (filters) => (dispatch) => {
//         dispatch(SET_FILTERS(filters))
//     },

//     // Enable / Disable Sync
//     setSyncEnabled: (value) => (dispatch) => {
//         dispatch(SET_SYNC_ENABLED(value))
//     },

//     // Set Selected Cell (for popup/modal)
//     setSelectedCell: (cell) => (dispatch) => {
//         dispatch(SET_SELECTED_CELL(cell))
//     },

//     // Update Map Configuration (scale/style)
//     setMapConfig: (config) => (dispatch) => {
//         dispatch(SET_MAP_CONFIG(config))
//     },

//     // geojson layer related actions
//     clearBoundaryLayer: () => (dispatch) => {
//         dispatch(CLEAR_BOUNDARY_GEOJSON());
//     },

//     setSelectedBoundaries: (boundaries) => (dispatch) => {
//         dispatch(SET_SELECTED_BOUNDARIES(boundaries));
//     },

//     // search apply & zoom
//     setHighlightedCell: (cellId) => (dispatch) => {
//         dispatch(SET_HIGHLIGHTED_CELL(cellId));
//     },

//     setActiveThematic: (payload) => (dispatch) => {
//         dispatch(SET_ACTIVE_THEMATIC(payload));
//     },

//     setActiveDriveSessions: (sessions) => (dispatch) => {
//         dispatch( SET_ACTIVE_DRIVE_SESSIONS(sessions));
//     },

//     setDriveTestFilters: (filters) => (dispatch) => {
//         dispatch(
//             SET_DRIVE_TEST_FILTERS(filters)
//         );
//     },

//     setRfParameter: (param) => (dispatch) => {
//         dispatch(SET_MAP_CONFIG({ rfParameter: param }));
//     },

//     clearRfPredictionLayer: () => (dispatch) => {
//         dispatch(CLEAR_RF_PREDICTION_GEOJSON());
//     },

//     setLayerOpacity: (layer, value) => (dispatch) => {
//         dispatch(SET_LAYER_OPACITY({layer,value}));
//     },

//     resetLayerOpacity: () => (dispatch) => {
//         dispatch(RESET_LAYER_OPACITY());
//     },

//     setLayerVisibility: (layer, value) => (dispatch) => {
//         dispatch(SET_LAYER_VISIBILITY({ layer, value }));
//     },

//     resetLayerVisibility: () => (dispatch) => {
//         dispatch(RESET_LAYER_VISIBILITY());
//     },
// }

// export default MapActions;


import { WebMercatorViewport } from "@deck.gl/core"
import Api from "../../utils/api"
import { Urls } from "../../utils/url"
import { SET_AUTHENTICATED, SET_COMMON_CONFIG, SET_TOKEN, SET_USER } from "../reducers/auth-reducer"
import { ALERTS } from "../reducers/component-reducer"
import { deepCopyRanges, KPI_RANGE_DEFAULTS, generatePaletteColors, COLOR_SCHEMES, FIXED_COLORS } from "../../components/MapsUsingDeckgl/Utils/colorEngine";
import { 
    // OLD TELECOM REDUCER IMPORTS
    GET_ALL_FILTER, 
    MARKER_CHART_LIST, 
    MARKER_LIST, 
    TECH_WITH_BAND,

    // NEW TELECOM REDUCER IMPORTS
    SET_RAW_CELLS,
    SET_VIEW_STATE,
    SET_FILTERS,
    SET_SYNC_ENABLED,
    SET_SELECTED_CELL,
    SET_MAP_CONFIG,
    SET_TELECOM_FILTER_META,
    SET_TELECOM_TECH_META,
    SET_BOUNDARY_GROUPS,
    SET_BOUNDARY_GEOJSON,
    CLEAR_BOUNDARY_GEOJSON,
    CLEAR_BOUNDARY_GROUP,

    SET_SELECTED_BOUNDARIES,
    SET_HIGHLIGHTED_CELL,

    SET_ACTIVE_THEMATIC, //cell
    SET_ACTIVE_SITE_THEMATIC,  //site
    SET_DRIVE_TEST_DATA,
    SET_DRIVE_TEST_FILTERS,
    SET_ACTIVE_DRIVE_SESSIONS,

    SET_RF_PREDICTION_FILTERS,
    SET_RF_COLOR_CONFIG,
    SET_RF_PREDICTION_GEOJSON,
    SET_RF_PREDICTION_SELECTION,

    CLEAR_RF_PREDICTION_GEOJSON,
    CLEAR_RF_PREDICTION_REGION,

    SET_LAYER_OPACITY,
    RESET_LAYER_OPACITY,
    SET_LAYER_VISIBILITY,
    RESET_LAYER_VISIBILITY,
    SET_RAW_SITES,
    SET_RULER_MODE,
    SET_RULER_POINTS,
    SET_LAYER_LEGEND,
    SET_BOUNDARY_COLORS,
    SET_TA_SECTOR_DATA,

} from "../reducers/map-reducer"

const MapActions = {
    /* ============================================================
       OLD EXISTING LOGIC (UNCHANGED)
    ============================================================ */

    postApiCaller: (urls, data, cb= () => {}) => async (dispatch, _) => {
        try {
            console.log("CommonPostActions.postApiCaller")
            const res = await Api.post({ url: urls, data })
            if (res?.status !== 201 && res?.status !== 200) return
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },

    logoutCaller: (cb = () => { }) => async (dispatch, _) => {
        try {
            localStorage.setItem("auth", false)
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            dispatch(SET_TOKEN(""))
            dispatch(SET_USER(JSON.stringify({})))
            dispatch(SET_AUTHENTICATED(false))
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },

    getMarkerList: (data, cb= () => {}, reset = true) => async (dispatch, _) => {
        try {   
            console.log("CommonPostActions.postApiCaller")
            const res = await Api.post({ url: Urls.map_getmarker, data: data })
            if (res?.status !== 201 && res?.status !== 200) return
            let dataAll = res.data
            dispatch(MARKER_LIST({ dataAll, reset }))
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },

    saveCurrentMapLatLong: (data, cb= () => {}, reset = true) => async (dispatch, _) => {
        try {
            console.log("CommonPostActions.postApiCaller")
            const res = await Api.post({ url: Urls.map_savelatlong, data: data, inst:0})
            if (res?.status !== 201 && res?.status !== 200) return
            let dataAll = res.data.data
            localStorage.setItem('config', JSON.stringify(dataAll))
            dispatch(SET_COMMON_CONFIG(dataAll))
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },

    getMarkerChart: (data, cb = () => {}, reset = true) => async (dispatch, _) => {
        try {
            console.log("CommonPostActions.postApiCaller");
            const res = await Api.post({ url: Urls.map_getChart, data: data });
            if (res?.status !== 200 && res?.status !== 201) {
                let msgdata = { show: true, icon: res?.data?.icon, buttons: [], text: res?.data?.msg, type: 1 };
                dispatch(ALERTS(msgdata));
                cb();
                return;
            }
            dispatch(MARKER_CHART_LIST({ dataAll: res.data.data, reset }));
            cb();
        } catch (error) {
            console.log(error, "getMarkerChart error");
        }
    },

    postTechWithBand: (data, cb = () => {}, reset = true) => async (dispatch, _) => {
        try {
            const res = await Api.post({ url: Urls.techwithband, data: data })
            if (res?.status !== 201 && res?.status !== 200) return
            let dataAll = res.data
            dispatch(MARKER_LIST({ dataAll, reset }))
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },

    getTechWithBand: (reset = true, args = "") => async (dispatch, _) => {
        try {
            const res = await Api.get({ url: `${Urls.techwithband}${args != "" ? "?" + args : ""}`, inst: 0 })
            if (res?.status !== 200) return
            const dataAll = res.data.data
            dispatch(TECH_WITH_BAND({ dataAll, reset }))
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },

    getAllFilterList: (reset = true, args = "") => async (dispatch, _) => {
        try {
            const res = await Api.get({ url: `${Urls.getAllFilterList}${args != "" ? "?" + args : ""}`, inst: 0 })
            if (res?.status !== 200) return
            const dataAll = res.data.data
            dispatch(GET_ALL_FILTER({ dataAll, reset }))
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },

    deleteApiCaller: (urls, cb= () => {}) => async (dispatch, _) => {
        try {
            const res = await Api.delete({ url: urls })
            if (res?.status !== 201 && res?.status !== 200) return
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },

    commondownload: (urls, filename, method = "GET", data = {}, cb) => async (dispatch, _) => {
        const res = await Api.blobFile({ url: urls, method: method, data: data })
        filename = urls.split("/").pop()
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filename}`);
        document.body.appendChild(link);
        link.click();
    },

    /* ============================================================
       ADD MAP LAYER
    ============================================================ */

    // Cell Layer
    getMultiVendorCells: (filters = {}) => async (dispatch) => {
        try {
            const res = await Api.post({
                url: Urls.multiVendor,
                data: { dataValue: filters }
            });
            const apiData = res?.data?.data || [];
            const adapted = apiData.map(item => ({
                cell_id: item.cell_name,
                site_name: item.site_name,
                technology: item.technology,
                operator: item.vendor,
                region: item.region,
                band: item.band,
                latitude: item.latitude,
                longitude: item.longitude,
                azimuth: item.azimuth,
                beam_width: item.beamwidth,
                radius_m: item.length,
                status: "active",
                color: item.color
            }));
            dispatch(SET_RAW_CELLS(adapted));
        } catch (err) {
            console.log("multiVendor error", err);
        }
    },

    getTelecomFilterMeta: () => async (dispatch) => {
        try {
            const res = await Api.get({ url: Urls.getAllFilterList, inst: 0 });
            if (res?.status !== 200) return;
            dispatch(SET_TELECOM_FILTER_META(res.data.data));
        } catch (err) {
            console.log("telecom filter meta error", err);
        }
    },

    getTelecomTechMeta: () => async (dispatch) => {
        try {
            const res = await Api.get({ url: Urls.techwithband, inst: 0 });
            if (res?.status !== 200) return;
            dispatch(SET_TELECOM_TECH_META(res.data.data));
        } catch (err) {
            console.log("telecom tech meta error", err);
        }
    },

    // SITE Layer
    getSites: () => async (dispatch) => {
        try {
            const res = await Api.get({ url: Urls.towers, inst: 0 });

            console.log("GET sites raw res.data:", res.data);
console.log("res.data.data:", res.data.data);
console.log("res.data.data length:", res.data.data?.length);

            if (res?.status !== 200) return;
            const adapted = (res.data.data || []).map(item => ({
                tower_id:  item.tower_id,
                site_name: item.site_name,        // ← was item.atoll_site_name, use site_name to match rawCells
                latitude:  Number(item.latitude),
                longitude: Number(item.longitude),
                vendor:    item.vendor,
                region:    item.region,
                technology: item.technology,
                band:      item.band,
                status:    item.status,
            }));
            dispatch(SET_RAW_SITES(adapted));
        } catch (err) {
            console.log("sites error", err);
        }
    },

    // Boundary Layer(KEN)
    getBoundaryGroups: () => async (dispatch) => {
        try {
            const res = await Api.get({ url: Urls.boundary_groups, inst: 0 });
            if (res?.status !== 200) return;
            const groups = res?.data?.data || [];
            dispatch(SET_BOUNDARY_GROUPS(groups));
        } catch (err) {
            console.log("boundary groups error", err);
        }
    },

    getBoundaryGeoJson: (country, level, names=[]) => async (dispatch) => {
        try {
            const query = `?country=${country}&level=${level}`;
            const res = await Api.get({ url: `${Urls.boundaries}${query}`, inst: 0 }); 
            if (res?.status !== 200) return;
            let geojson = res.data.data;
            if (names.length > 0) {
                geojson.features = geojson.features.filter(
                    f => names.includes(f.properties.name)
                );
            }

            // tag each feature with the group name
            geojson.features = geojson.features.map(f => ({
                ...f,
                properties: { ...f.properties, shapegroup: country }
            }));
            dispatch(SET_BOUNDARY_GEOJSON(geojson));
        } catch (err) {
            console.log("boundary geojson error", err);
        }
    },

    // Drive Test Layer
    getDriveTestData: () => async (dispatch) => {
        try {
            const res = await Api.get({ url: Urls.drive_test, inst: 0 });
            if (res?.status !== 200) return;
            const sessions = res?.data?.data || [];
            const allPoints = [];
            sessions.forEach(session => {
                const { lat = [], lon = [], rssi = [], session_id } = session;
                lat.forEach((latVal, i) => {
                    allPoints.push({
                        latitude: Number(latVal),
                        longitude: Number(lon[i]),
                        rssi: Number(rssi[i]),
                        session_id
                    });
                });
            });
            dispatch(SET_DRIVE_TEST_DATA(allPoints));
        } catch (err) {
            console.log("drive test data error", err);
        }
    },

    // RF Prediction Layer
    getRfPredictionFilters: () => async (dispatch) => {
        try {
            const res = await Api.get({ url: Urls.rf_prediction_filters, inst: 0 });
            if (res?.status !== 200) return;
            dispatch(SET_RF_PREDICTION_FILTERS(res.data.data || []));
            dispatch(SET_RF_COLOR_CONFIG(res.data.rf_color_config || []));
        } catch (err) {
            console.log("RF filters error", err);
        }
    },

    getRfPredictionLayer: (region, parameter, range_label) => async (dispatch) => {
        console.log("Fetching RF layer for", region)
        try {
            const query = `?region=${encodeURIComponent(region)}&parameter=${parameter}`;
            const res = await Api.get({ url: `${Urls.rf_prediction_data}${query}`, inst: 0 });
            console.log("FULL RESPONSE RF Prediction", res);
            if (res?.status !== 200) return;
            dispatch(SET_RF_PREDICTION_GEOJSON(res.data.data));
        } catch (err) {
            console.log("RF prediction error", err);
        }
    },

    // Per user map configurations 
    getUserMapSetup: () => async (dispatch, getState) => {
        try {
            const [setupRes, techRes, filterRes] = await Promise.all([
                Api.get({ url: Urls.setupConf, inst: 0 }),
                Api.get({ url: Urls.techwithband, inst: 0 }),
                Api.get({ url: Urls.getAllFilterList, inst: 0 })
            ]);

            if (setupRes?.status !== 200) return;
            const data = setupRes?.data?.data || {};

            if (techRes?.status === 200) {
                dispatch(SET_TELECOM_TECH_META(techRes.data.data || []));
            }
            if (filterRes?.status === 200) {
                dispatch(SET_TELECOM_FILTER_META(filterRes.data.data));
            }

            const techMeta = techRes?.data?.data || [];

            /* ---------------- PARSE LAT LONG ---------------- */
            const KENYA_DEFAULT = {
                longitude: 37.9062,
                latitude: 0.0236,
                zoom: 6,
                pitch: 0,
                bearing: 0
            };

            // let viewState = KENYA_DEFAULT;
            // if (data.saveLatLong) {
            //     const parsed = JSON.parse(data.saveLatLong);
            //     const lat = Number(parsed.lat);
            //     const lng = Number(parsed.lng);
            //     const zoom = Number(parsed.zoom);
            //     // only restore if it looks like a valid Kenya-region coordinate
            //     if (!isNaN(lat) && !isNaN(lng) && zoom > 0) {
            //         viewState = { longitude: lng, latitude: lat, zoom, pitch: 0, bearing: 0 };
            //     }
            // }

            // ← ignore saveLatLong entirely, always start at Kenya
            const viewState = {
                longitude: 37.9062,
                latitude: 0.0236,
                zoom: 6,
                pitch: 0,
                bearing: 0
            };

            /* ---------------- PARSE FILTERS ---------------- */
            const filters = data.saveMapFilters ? JSON.parse(data.saveMapFilters) : {};

            /* ---------------- PARSE THEMATICS ---------------- */
            const thematics = data.saveThematics
                ? JSON.parse(data.saveThematics)
                : null;

            const hasColors = thematics?.colors && Object.keys(thematics.colors).length > 0;

            /* ---------------- MAP CONFIG ---------------- */
            // const config = {
            //     mapScale: Number(data.mapScale) || 1,
            //     mapView: data.mapView || "voyager"
            //     // mapView:  "voyager"  // ← hardcode, ignore saved valu
            // };

            // normalize old mapbox URLs to new short keys
            const rawMapView = data.mapView || "voyager";
            const mapViewNormalized = rawMapView.startsWith("mapbox://") ? "voyager" : rawMapView;

            const config = {
                mapScale: Number(data.mapScale) || 1,
                mapView: mapViewNormalized
            };

            /* ---------------- DISPATCH BASE CONFIG ---------------- */
            if (viewState) dispatch(SET_VIEW_STATE(viewState));
            dispatch(SET_FILTERS(filters));
            dispatch(SET_MAP_CONFIG(config));
            
            if (hasColors) {
                dispatch(SET_ACTIVE_THEMATIC(thematics));
            } else {
                const bandValues = [...new Set(techMeta.map(t => t.name))];
                const bandColors = generatePaletteColors(bandValues, COLOR_SCHEMES.Default);
                dispatch(SET_ACTIVE_THEMATIC({
                    type: "Band",
                    colors: bandColors,
                    opacity: 0.9
                }));
            }

            /* ---------------- RESTORE LAYER OPACITY ---------------- */
            const savedLayerOpacity = data.saveLayerOpacity
                ? JSON.parse(data.saveLayerOpacity)
                : null;

            if (savedLayerOpacity) {
                Object.entries(savedLayerOpacity).forEach(([layer, value]) => {
                    dispatch(SET_LAYER_OPACITY({ layer, value }));
                });
            }

            /* ---------------- LAYER VISIBILITY ---------------- */
            const layerVisibility = data.saveLayerVisibility
                ? JSON.parse(data.saveLayerVisibility)
                : null;

            if (layerVisibility) {
                dispatch(SET_LAYER_VISIBILITY({ layer: "CELLS", value: layerVisibility.CELLS }));
                dispatch(SET_LAYER_VISIBILITY({ layer: "SITES", value: layerVisibility.SITES }));
                dispatch(SET_LAYER_VISIBILITY({ layer: "BOUNDARY", value: layerVisibility.BOUNDARY }));
                dispatch(SET_LAYER_VISIBILITY({ layer: "RF", value: layerVisibility.RF }));
                dispatch(SET_LAYER_VISIBILITY({ layer: "DRIVE_TEST", value: layerVisibility.DRIVE_TEST }));
            } else {
                dispatch(SET_LAYER_VISIBILITY({ layer: "CELLS", value: false }));
                dispatch(SET_LAYER_VISIBILITY({ layer: "BOUNDARY", value: false }));
                dispatch(SET_LAYER_VISIBILITY({ layer: "RF", value: false }));
                dispatch(SET_LAYER_VISIBILITY({ layer: "DRIVE_TEST", value: false }));
            }

            /* ---------------- BOUNDARIES ---------------- */
            const savedBoundaries = data.saveBoundaries
                ? JSON.parse(data.saveBoundaries)
                : {};

            const savedDriveTestFilters = data.saveDriveTestFilters
                ? JSON.parse(data.saveDriveTestFilters)
                : null;

            const boundaryGroups = getState().map.boundaryGroups;
            const savedRfParameter = data.saveRfParameter || "RSRP";
            dispatch(SET_MAP_CONFIG({ rfParameter: savedRfParameter }));

            const savedBoundaryColors = data.saveBoundaryColors
                ? JSON.parse(data.saveBoundaryColors)
                : data.saveBoundaryColor
                    ? { [boundaryGroups[0]?.shapegroup]: data.saveBoundaryColor }
                    : {};

                dispatch(SET_BOUNDARY_COLORS(savedBoundaryColors));
            
            // RF is saved inside saveBoundaries["RF"]
          // ✅ RF is now saved in SEPARATE column (not inside saveBoundaries)
            const savedRfRegions = data.saveRfRegions
                ? JSON.parse(data.saveRfRegions)
                : [];
            const allRfRegions = [...new Set(getState().map.rfPredictionFilters.map(f => f.name))];
            const rfToRestore = savedRfRegions === "ALL"
                ? allRfRegions
                : (Array.isArray(savedRfRegions) ? savedRfRegions : []);

            // normalize boundaries — convert "ALL" string back to full arrays
           // ✅ saveBoundaries now ONLY has Kenya groups (RF removed from here)
            const normalizedBoundaries = Object.fromEntries(
                Object.entries(savedBoundaries)
                    .map(([group, value]) => {
                        if (value === "ALL") {
                            const groupObj = boundaryGroups.find(g => g.shapegroup === group);
                            return [group, groupObj?.shapenames || []];
                        }
                        return [group, value];
                    })
            );

            // store everything in selected Boundaries including RF and DRIVE_TEST
            dispatch(SET_SELECTED_BOUNDARIES({
                ...normalizedBoundaries,
                RF: rfToRestore, 
                DRIVE_TEST: savedDriveTestFilters?.sessions || [] //may need to be deleted
            }));

            // ✅ Store RF selection separately (you'll need to add this to Redux later)
            // For now, just restore the layers

            /* ---------------- RESTORE BOUNDARY LAYERS ---------------- */
            boundaryGroups.forEach(group => {
                const saved = savedBoundaries[group.shapegroup];
                if (!saved) return;

                const children = saved === "ALL" ? group.shapenames : saved;

                dispatch(SET_LAYER_VISIBILITY({
                    layer: group.shapegroup,
                    value: saved === "ALL"
                }));

                if (children.length > 0) {
                    dispatch(MapActions.getBoundaryGeoJson(
                        group.shapegroup,
                        group.shapetypes[0],
                        children
                    ));
                }
            });

            /* ---------------- RESTORE RF LAYER ---------------- */
            rfToRestore.forEach(region => {
                dispatch(MapActions.getRfPredictionLayer(region, savedRfParameter));
            });

            if (rfToRestore.length > 0) {
                dispatch(SET_LAYER_VISIBILITY({ layer: "RF", value: true }));
            }

            /* ---------------- RESTORE DRIVE TEST ---------------- */
            if (savedDriveTestFilters) {
                // dispatch(SET_DRIVE_TEST_FILTERS({
                //     ...savedDriveTestFilters,
                //     ranges: deepCopyRanges(KPI_RANGE_DEFAULTS[savedDriveTestFilters.thematic || "RSSI"])
                // }));
                dispatch(SET_DRIVE_TEST_FILTERS({
                    ...savedDriveTestFilters,
                    ranges: savedDriveTestFilters.ranges?.length
                        ? savedDriveTestFilters.ranges.map(r => ({ ...r }))
                        : deepCopyRanges(KPI_RANGE_DEFAULTS[savedDriveTestFilters.thematic || "RSSI"])
                }));
                const sessions = savedDriveTestFilters.sessions || [];
                dispatch(SET_ACTIVE_DRIVE_SESSIONS(sessions));
                if (sessions.length > 0) {
                    dispatch(MapActions.getDriveTestData());
                }
            }

              /* ---------------- RESTORE SITE THEMATICS ---------------- */
            const siteThematics = data.saveSiteThematics
                ? JSON.parse(data.saveSiteThematics)
                : { type: "Technology", colors: {} };

            dispatch(SET_ACTIVE_SITE_THEMATIC(siteThematics));

            /* ---------------- RESTORE LEGENDs ---------------- */
            const legends = data.saveLayerLegends
                ? JSON.parse(data.saveLayerLegends)
                : {};
            dispatch(MapActions.setLayerLegend("SITES", legends.SITES));
            dispatch(MapActions.setLayerLegend("CELLS", legends.CELLS));
            dispatch(MapActions.setLayerLegend("BOUNDARY", legends.BOUNDARY));
            dispatch(MapActions.setLayerLegend("RF", legends.RF));
            dispatch(MapActions.setLayerLegend("DRIVE_TEST", legends.DRIVE_TEST));
            
        } catch (err) {
            console.log("setup config error", err);
        }
    },

    setViewState: (viewState) => (dispatch) => {
        dispatch(SET_VIEW_STATE(viewState))
    },

    setFilters: (filters) => (dispatch) => {
        dispatch(SET_FILTERS(filters))
    },

    setSyncEnabled: (value) => (dispatch) => {
        dispatch(SET_SYNC_ENABLED(value))
    },

    setSelectedCell: (cell) => (dispatch) => {
        dispatch(SET_SELECTED_CELL(cell))
    },

    setMapConfig: (config) => (dispatch) => {
        dispatch(SET_MAP_CONFIG(config))
    },

    clearBoundaryLayer: () => (dispatch) => {
        dispatch(CLEAR_BOUNDARY_GEOJSON());
    },

    setSelectedBoundaries: (boundaries) => (dispatch) => {
        dispatch(SET_SELECTED_BOUNDARIES(boundaries));
    },

    setHighlightedCell: (cellId) => (dispatch) => {
        dispatch(SET_HIGHLIGHTED_CELL(cellId));
    },

    setActiveThematic: (payload) => (dispatch) => {
        dispatch(SET_ACTIVE_THEMATIC(payload));
    },

    setActiveSiteThematic: (payload) => (dispatch) => { //site thematics
        dispatch(SET_ACTIVE_SITE_THEMATIC(payload));
    },

    setActiveDriveSessions: (sessions) => (dispatch) => {
        dispatch(SET_ACTIVE_DRIVE_SESSIONS(sessions));
    },

    setDriveTestFilters: (filters) => (dispatch) => {
        dispatch(SET_DRIVE_TEST_FILTERS(filters));
    },

    setRfParameter: (param) => (dispatch) => {
        dispatch(SET_MAP_CONFIG({ rfParameter: param }));
    },

    clearRfPredictionLayer: () => (dispatch) => {
        dispatch(CLEAR_RF_PREDICTION_GEOJSON());
    },
    clearRfPredictionRegion: (regionName) => (dispatch) => {
        dispatch(CLEAR_RF_PREDICTION_REGION(regionName));
    },

    setLayerOpacity: (layer, value) => (dispatch) => {
        dispatch(SET_LAYER_OPACITY({layer, value}));
    },

    resetLayerOpacity: () => (dispatch) => {
        dispatch(RESET_LAYER_OPACITY());
    },

    setLayerVisibility: (layer, value) => (dispatch) => {
        dispatch(SET_LAYER_VISIBILITY({ layer, value }));
    },

    resetLayerVisibility: () => (dispatch) => {
        dispatch(RESET_LAYER_VISIBILITY());
    },
    setRulerMode: (val) => (dispatch) => {
        dispatch(SET_RULER_MODE(val));
    },
    setRulerPoints: (points) => (dispatch) => {
        dispatch(SET_RULER_POINTS(points));
    },
    setLayerLegend: (layer, value) => (dispatch) => {
        dispatch(SET_LAYER_LEGEND({ layer, value }));
    },
    setBoundaryColors: (colors) => (dispatch) => {
        dispatch(SET_BOUNDARY_COLORS(colors));
    },
    clearBoundaryGroup: (shapegroup) => (dispatch) => {
        dispatch(CLEAR_BOUNDARY_GROUP(shapegroup));
    },

    setTaSectorData: (cellId, taData) => (dispatch) => {
        // taData = null to remove; or array of rings to add
        dispatch(SET_TA_SECTOR_DATA({ cellId, taData }));
    },

    fetchTaSectors: (cellId, cellName, cellCoords) => async (dispatch) => {
        try {
            const url = `${Urls.gis_ta}?cell_name=${encodeURIComponent(cellName)}`;
            console.log("[TA] API call:", url);
            const res = await Api.get({ url, inst: 0 });
            console.log("[TA] API response:", res?.status, res?.data);
            if (res?.status !== 200) return;
            const data = res.data?.data || [];
            console.log("[TA] dispatching rows:", data.length);
            dispatch(SET_TA_SECTOR_DATA({ cellId, taData: data, cellCoords }));
        } catch (err) {
            console.log("[TA] fetchTaSectors error", err);
        }
    },

}

export default MapActions;
