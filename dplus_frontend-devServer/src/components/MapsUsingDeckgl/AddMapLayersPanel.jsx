// import React, { useState, useMemo, useEffect, useRef  } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import MapActions from "../../store/actions/map-actions";
// import AuthActions from "../../store/actions/auth-actions";
// import { UilAngleDown, UilAngleUp } from '@iconscout/react-unicons';

// import CellThematicsPanel from "./CellThematicsPanel";
// import ColorPicker from "./ColorPicker";
// import RangeFilter from "./RangeFilter";
// import OpacitySlider from "./OpacitySlider";
// import { KPI_RANGE_DEFAULTS, getDriveTestColor, deepCopyRanges  } from "./Utils/colorEngine";

// const AddMapLayersPanel = ({ onClose }) => {

//   const driveThematicOptions = [
//     "RSSI",
//     "RSRP",
//     "DL Thrp",
//     "Frequency",
//   ];

//   const dispatch = useDispatch();

//     const containerRef = useRef(null);
//     const boundaryGroups = useSelector(state => state.map.boundaryGroups || []);
//     const rfPredictionFilters = useSelector(state => state.map.rfPredictionFilters || []);
//     const driveTestData = useSelector(state => state.map.driveTestData || []);

//   /* ---------------- UI STATE ONLY ---------------- */
//     const rawCells = useSelector(state => state.map.rawCells || []);
//     const layerVisibility = useSelector(state => state.map.layerVisibility);
//     // const [selectedLayers, setSelectedLayers] = useState(() => ({
//     //     CELL: layerVisibility?.CELLS || false,
//     //     BOUNDARY: layerVisibility?.BOUNDARY || false,
//     //     RF: layerVisibility?.RF || false,
//     //     DRIVE_TEST: layerVisibility?.DRIVE_TEST || false
//     // }));
//     // // initialize from Redux
//     // const reduxBoundaries = useSelector(state => state.map.selectedBoundaries || {});
//     // const [selectedBoundaries, setSelectedBoundaries] = useState(reduxBoundaries);
//     const selectedBoundaries = useSelector(state => state.map.selectedBoundaries || {});

//     // NOT committed to Redux until Apply is clicked
//     // This prevents any layer from rendering before Apply
//         const [pendingVisibility, setPendingVisibility] = useState({
//             CELLS: false,
//             RF: false,
//             DRIVE_TEST: false,
//             ...boundaryGroups.reduce((acc, g) => ({ ...acc, [g.shapegroup]: false }), {})
//         });
//         const [pendingBoundaries, setPendingBoundaries] = useState({});

//        // WITH THIS — sync whenever layerVisibility changes from Redux
//         // but only if panel is not "dirty" (user hasn't touched it yet)
//         useEffect(() => {
//             setPendingVisibility({
//                 CELLS: layerVisibility.CELLS || false,
//                 RF: layerVisibility.RF || false,
//                 DRIVE_TEST: layerVisibility.DRIVE_TEST || false,
//                 ...boundaryGroups.reduce((acc, g) => ({
//                     ...acc,
//                     [g.shapegroup]: layerVisibility[g.shapegroup] || false
//                 }), {})
//             });
//             setPendingBoundaries({ 
//                 ...selectedBoundaries,
// // restore drive sessions from driveTestFilters
//         DRIVE_TEST: driveTestFilters?.sessions || []
//             });
//         }, [layerVisibility, selectedBoundaries]); // ← sync whenever Redux updates

//     const [expandedLayer, setExpandedLayer] = useState(null);
//     const [cellThematicsConfig, setCellThematicsConfig] = useState(null);

//     // state initializations for Drive Test Layer
//     const driveTestFilters = useSelector(state => state.map.driveTestFilters);
//     // const [driveThematic, setDriveThematic] = useState(
//     //     driveTestFilters?.thematic || "RSSI"
//     // );
//     const [startDateTime, setStartDateTime] = useState(
//         driveTestFilters?.startDateTime || ""
//     );
//     const [endDateTime, setEndDateTime] = useState(
//         driveTestFilters?.endDateTime || ""
//     );
//     const [ranges, setRanges] = useState(
//         driveTestFilters?.ranges?.length
//             ? driveTestFilters.ranges.map(r => ({ ...r }))
//             :  deepCopyRanges(KPI_RANGE_DEFAULTS["RSSI"])
//     );
//     const [selectedThematic, setSelectedThematic] = useState(
//         driveTestFilters?.thematic || "RSSI"
//     );
//     const [thematicMode, setThematicMode] = useState(
//         driveTestFilters?.thematicMode || "Default"
//     );
//     // const [selectedDriveSessions, setSelectedDriveSessions] = useState(
//     //     driveTestFilters?.sessions || []
//     // );
//     const sessionIds = [
//         ...new Set(driveTestData.map(d => d.session_id))
//     ];

//   /* ---------------- RF ---------------- */

//   const [rfParameter, setRfParameter] = useState("RSRP");
//   const [rfRangeColors, setRfRangeColors] = useState({});

//   const rfParameterOptions = useMemo(() => {
//     return [...new Set(
//       rfPredictionFilters.map(p => p.parameter_name)
//     )];
//   }, [rfPredictionFilters]);

//   const rfRanges = [
//     ...new Set(
//       rfPredictionFilters
//         .filter(f => f.parameter_name === rfParameter)
//         .map(f => f.range_label)
//     )
//   ];

//     const rfRegions = useMemo(() => (
//         [...new Set(rfPredictionFilters.map(item => item.name))]
//     ), [rfPredictionFilters]);

//     /* ---------------- HOOKs ---------------- */

//   /* ---------------- LOGIC (UNCHANGED) ---------------- */

// //   const toggleParentLayerSelection = (group) => {

// //     const newValue = !selectedLayers[group];

// //     setSelectedLayers(prev => ({
// //       ...prev,
// //       [group]: newValue
// //     }));

// //     if (group === "DRIVE_TEST") {
// //       setSelectedDriveSessions(newValue ? sessionIds : []);
// //     }

// //     if (group === "CELL") {

// //         // expand panel
// //         setExpandedLayer("CELL");

// //         // ✅ APPLY DEFAULT THEMATIC
// //         setCellThematicsConfig({
// //             type: "Band",
// //             colors: {},
// //             opacity: 1,
// //             scale: 1
// //         });

// //         return;
// //     }

// //     if (group === "RF") {
// //       setSelectedBoundaries(prev => ({
// //         ...prev,
// //         RF: newValue ? rfRegions : []
// //       }));
// //     } else {
// //       const groupObj = boundaryGroups.find(g => g.shapegroup === group);

// //       setSelectedBoundaries(prev => ({
// //         ...prev,
// //         [group]: newValue ? groupObj?.shapenames || [] : []
// //       }));
// //     }

// //     if (newValue) setExpandedLayer(group);
// //   };

// //     const toggleParentLayerSelection = (group) => {
// //         const newValue = !selectedLayers[group];

// //         setSelectedLayers(prev => ({ ...prev, [group]: newValue }));

// //         if (group === "DRIVE_TEST") {
// //             setSelectedDriveSessions(newValue ? sessionIds : []);
// //             if (newValue) setExpandedLayer(group);
// //             return;
// //         }

// //         if (group === "CELL") {
// //             if (newValue) {
// //             setExpandedLayer("CELL");
// //             setCellThematicsConfig({ type: "Band", colors: {}, opacity: 1, scale: 1 });
// //             }
// //             return;  // ✅ return HERE is fine — CELL has no boundary children
// //         }

// //         if (group === "RF") {
// //             setSelectedBoundaries(prev => ({
// //             ...prev,
// //             RF: newValue ? rfRegions : []
// //             }));
// //         } else {
// //             const groupObj = boundaryGroups.find(g => g.shapegroup === group);
// //             setSelectedBoundaries(prev => ({
// //             ...prev,
// //             [group]: newValue ? groupObj?.shapenames || [] : []
// //             }));
// //         }

// //         if (newValue) setExpandedLayer(group);
// // };

// // const toggleParentLayerSelection = (group) => {

// //     if (group === "CELL") {
// //         const newValue = !layerVisibility.CELLS;
// //         dispatch(MapActions.setLayerVisibility("CELLS", newValue));
// //         if (newValue) {
// //             setExpandedLayer("CELL");
// //             setCellThematicsConfig({ type: "Band", colors: {}, opacity: 1, scale: 1 });
// //         }
// //         return;
// //     }

// //     if (group === "DRIVE_TEST") {
// //         const newValue = !layerVisibility.DRIVE_TEST;
// //         dispatch(MapActions.setLayerVisibility("DRIVE_TEST", newValue));
// //         setSelectedDriveSessions(newValue ? sessionIds : []);
// //         if (newValue) setExpandedLayer(group);
// //         return;
// //     }

// //     if (group === "RF") {
// //         const newValue = !layerVisibility.RF;
// //         dispatch(MapActions.setLayerVisibility("RF", newValue));
// //         // select/deselect all RF regions in Redux boundaries
// //         dispatch(MapActions.setSelectedBoundaries({
// //             ...selectedBoundaries,
// //             RF: newValue ? rfRegions : []
// //         }));
// //         if (newValue) setExpandedLayer(group);
// //         return;
// //     }

// //     // Boundary groups (KEN etc.)
// //     const newValue = !layerVisibility[group];
// //     dispatch(MapActions.setLayerVisibility(group, newValue));
// //     const groupObj = boundaryGroups.find(g => g.shapegroup === group);
// //     dispatch(MapActions.setSelectedBoundaries({
// //         ...selectedBoundaries,
// //         [group]: newValue ? groupObj?.shapenames || [] : []
// //     }));
// //     if (newValue) setExpandedLayer(group);
// // };

// const toggleParentLayerSelection = (group) => {

//     if (group === "CELL") {
//         const newValue = !pendingVisibility.CELLS;
//         setPendingVisibility(prev => ({ ...prev, CELLS: newValue }));
//         if (newValue) {
//             setExpandedLayer("CELL");
//             setCellThematicsConfig({ type: "Band", colors: {}, opacity: 1, scale: 1 });
//         }
//         return;
//     }

//     if (group === "DRIVE_TEST") {
//         const newValue = !pendingVisibility.DRIVE_TEST;
//         setPendingVisibility(prev => ({ ...prev, DRIVE_TEST: newValue }));
//         setSelectedDriveSessions(newValue ? sessionIds : []);
//         if (newValue) setExpandedLayer(group);
//         return;
//     }

//     if (group === "RF") {
//         const newValue = !pendingVisibility.RF;
//         setPendingVisibility(prev => ({ ...prev, RF: newValue }));
//         setPendingBoundaries(prev => ({
//             ...prev,
//             RF: newValue ? rfRegions : []
//         }));
//         if (newValue) setExpandedLayer(group);
//         return;
//     }

//     // boundary groups (KEN etc)
//     const newValue = !pendingVisibility[group];
//     setPendingVisibility(prev => ({ ...prev, [group]: newValue }));
//     const groupObj = boundaryGroups.find(g => g.shapegroup === group);
//     setPendingBoundaries(prev => ({
//         ...prev,
//         [group]: newValue ? groupObj?.shapenames || [] : []
//     }));
//     if (newValue) setExpandedLayer(group);
// };


// const toggleChildLayerSelection = (group, name) => {

//     const existing = pendingBoundaries[group] || [];
//     const updated = existing.includes(name)
//         ? existing.filter(n => n !== name)
//         : [...existing, name];

//     setPendingBoundaries(prev => ({ ...prev, [group]: updated }));

//     // update parent checkbox
//     const totalChildren = group === "RF"
//         ? rfRegions.length
//         : boundaryGroups.find(g => g.shapegroup === group)?.shapenames?.length || 0;

//     const newParentValue = updated.length === totalChildren;
//     console.log(`group: ${group}, updated: ${updated.length}, total: ${totalChildren}, parent: ${newParentValue}`);

//     setPendingVisibility(prev => ({
//         ...prev,
//         [group]: updated.length === totalChildren
//     }));
// };

// // const toggleChildLayerSelection = (group, name) => {

// //     const existing = selectedBoundaries[group] || [];
// //     const updated = existing.includes(name)
// //         ? existing.filter(n => n !== name)
// //         : [...existing, name];

// //     // update Redux boundaries
// //     dispatch(MapActions.setSelectedBoundaries({
// //         ...selectedBoundaries,
// //         [group]: updated
// //     }));

// //     // update parent checkbox — true only if all children selected
// //     let totalChildren = 0;
// //     if (group === "RF") {
// //         totalChildren = rfRegions.length;
// //     } else {
// //         const groupObj = boundaryGroups.find(g => g.shapegroup === group);
// //         totalChildren = groupObj?.shapenames?.length || 0;
// //     }
// //     dispatch(MapActions.setLayerVisibility(group, updated.length === totalChildren));
// // };

//     // const toggleChildLayerSelection = (group, name) => {

//     //     setSelectedBoundaries(prev => {

//     //     const existing = prev[group] || [];

//     //     let updated;

//     //     if (existing.includes(name)) {
//     //         updated = existing.filter(n => n !== name);
//     //     } else {
//     //         updated = [...existing, name];
//     //     }

//     //     // find total children count
//     //     let totalChildren = 0;

//     //     if (group === "RF") {
//     //         totalChildren = rfRegions.length;
//     //     } else {
//     //         const groupObj = boundaryGroups.find(
//     //         g => g.shapegroup === group
//     //         );
//     //         totalChildren = groupObj?.shapenames?.length || 0;
//     //     }

//     //     // update parent checkbox state
//     //     setSelectedLayers(prevLayers => ({
//     //         ...prevLayers,
//     //         [group]: updated.length === totalChildren
//     //     }));

//     //     return {
//     //         ...prev,
//     //         [group]: updated
//     //     };

//     //     });

//     // };

//   const toggleDriveSession = (session) => {
//      setSelectedDriveSessions(prev => {
//         const updated = prev.includes(session)
//             ? prev.filter(s => s !== session)
//             : [...prev, session];

//         // update parent checkbox — true only if all sessions selected
//         setPendingVisibility(p => ({
//             ...p,
//             DRIVE_TEST: updated.length === sessionIds.length
//         }));

//         return updated;
//     });
//   };  

//   /* ---------------- APPLY ---------------- */
// //   const applySelectedMapLayers = () => {

// //     dispatch(MapActions.setLayerVisibility("CELLS", selectedLayers["CELL"] || false));
// //     dispatch(MapActions.setLayerVisibility("BOUNDARY", !!selectedLayers["BOUNDARY"] ));
// //     dispatch(MapActions.setLayerVisibility("RF", !!selectedLayers["RF"]));
// //     dispatch(MapActions.setLayerVisibility("DRIVE_TEST", !!selectedLayers["DRIVE_TEST"]));

// //     // After dispatching setLayerVisibility calls, add:
// //     dispatch(AuthActions.setupConf(true, {
// //         saveLayerVisibility: JSON.stringify({
// //             CELLS: selectedLayers["CELL"] || false,
// //             BOUNDARY: !!selectedLayers["BOUNDARY"],
// //             RF: !!selectedLayers["RF"],
// //             DRIVE_TEST: !!selectedLayers["DRIVE_TEST"]
// //         }),
// //         saveBoundaries: JSON.stringify(selectedBoundaries),
// //         saveRfParameter: rfParameter,
// //     }));

// //     // clear existing layers first
// //     dispatch(MapActions.clearBoundaryLayer());
// //     dispatch(MapActions.clearRfPredictionLayer());

// //     // if (!boundaryGroups.length && !rfRegionsSelected.length) {
// //     //     onClose();
// //     //     return;
// //     // }

// //     // Boundary layer
// //     boundaryGroups.forEach(group => {
// //       const parentSelected = selectedLayers[group.shapegroup];
// //       const children = selectedBoundaries[group.shapegroup] || [];

// //       if (parentSelected) {

// //         dispatch(
// //           MapActions.getBoundaryGeoJson(
// //             group.shapegroup,
// //             group.shapetypes[0],
// //             []
// //           )
// //         );

// //       }
// //       else if (children.length > 0) {

// //         dispatch(
// //           MapActions.getBoundaryGeoJson(
// //             group.shapegroup,
// //             group.shapetypes[0],
// //             children
// //           )
// //         );

// //       }
// //     });

// //     //  RF PRedictions Layer
// //     const rfRegionsSelected = selectedBoundaries["RF"] || [];
// //     rfRegionsSelected.forEach(region => {

// //       dispatch(
// //         MapActions.getRfPredictionLayer(
// //           region,
// //           rfParameter
// //         )
// //       );

// //     });

// //     // Drive test layer
// //     if (selectedLayers["DRIVE_TEST"]) {
// //           dispatch(
// //               MapActions.setDriveTestFilters({
// //               sessions: selectedDriveSessions,
// //               startDateTime,
// //               endDateTime,
// //               thematic: driveThematic,
// //               ranges,
// //               })
// //           );
// //           dispatch(
// //               MapActions.setActiveDriveSessions(selectedDriveSessions)
// //           );
// //           dispatch(
// //               MapActions.getDriveTestData({
// //               sessions: selectedDriveSessions,
// //               startDateTime,
// //               endDateTime
// //               })
// //           );
// //       }

// //     // CELL THEMATICS LAyer
// //     // if (selectedLayers["CELL"] && cellThematicsConfig) {
// //     if (cellThematicsConfig) {
// //       dispatch(MapActions.setActiveThematic(cellThematicsConfig));

// //       dispatch(AuthActions.setupConf(true, {
// //           saveThematics: JSON.stringify(cellThematicsConfig)
// //         }));
// //     }

// //     if (cellThematicsConfig?.scale !== undefined ) {
// //       dispatch(
// //         MapActions.setMapConfig({
// //           mapScale: cellThematicsConfig.scale
// //         })
// //       );
// //     }

// //     onClose();

// //   };
//     // const applySelectedMapLayers = () => {

//     //     dispatch(MapActions.setLayerVisibility("CELLS", selectedLayers["CELL"] || false));
//     //     dispatch(MapActions.setLayerVisibility("BOUNDARY", !!selectedLayers["BOUNDARY"]));
//     //     dispatch(MapActions.setLayerVisibility("RF", !!selectedLayers["RF"]));
//     //     dispatch(MapActions.setLayerVisibility("DRIVE_TEST", !!selectedLayers["DRIVE_TEST"]));

//     //     dispatch(MapActions.clearBoundaryLayer());
//     //     dispatch(MapActions.clearRfPredictionLayer());

//     //     boundaryGroups.forEach(group => {
//     //         const parentSelected = selectedLayers[group.shapegroup];
//     //         const children = selectedBoundaries[group.shapegroup] || [];
//     //         if (parentSelected) {
//     //             dispatch(MapActions.getBoundaryGeoJson(group.shapegroup, group.shapetypes[0], []));
//     //         } else if (children.length > 0) {
//     //             dispatch(MapActions.getBoundaryGeoJson(group.shapegroup, group.shapetypes[0], children));
//     //         }
//     //     });

//     //     const rfRegionsSelected = selectedBoundaries["RF"] || [];
//     //     rfRegionsSelected.forEach(region => {
//     //     dispatch(MapActions.getRfPredictionLayer(region, rfParameter));
//     //     });

//     //     if (selectedLayers["DRIVE_TEST"]) {
//     //         dispatch(MapActions.setDriveTestFilters({
//     //             sessions: selectedDriveSessions,
//     //             startDateTime,
//     //             endDateTime,
//     //             thematic: selectedThematic,   // ← was driveThematic
//     //             thematicMode,   
//     //             ranges,
//     //         }));
//     //         dispatch(MapActions.setActiveDriveSessions(selectedDriveSessions));
//     //         dispatch(MapActions.getDriveTestData({
//     //             sessions: selectedDriveSessions,
//     //             startDateTime,
//     //             endDateTime
//     //         }));
//     //     }

//     //     if (cellThematicsConfig) {
//     //         dispatch(MapActions.setActiveThematic(cellThematicsConfig));
//     //     }

//     //     if (cellThematicsConfig?.scale !== undefined) {
//     //         dispatch(MapActions.setMapConfig({ mapScale: cellThematicsConfig.scale }));
//     //     }

//     //     // ✅ Single setupConf call with everything
//     //     dispatch(AuthActions.setupConf(true, {
//     //         saveLayerVisibility: JSON.stringify({
//     //             CELLS: selectedLayers["CELL"] || false,
//     //             BOUNDARY: !!selectedLayers["BOUNDARY"],
//     //             RF: !!selectedLayers["RF"],
//     //             DRIVE_TEST: !!selectedLayers["DRIVE_TEST"]
//     //         }),
//     //         saveBoundaries: JSON.stringify(selectedBoundaries),
//     //         saveRfParameter: rfParameter,
//     //         ...(cellThematicsConfig && {
//     //             saveThematics: JSON.stringify(cellThematicsConfig)
//     //         }),
//     //         ...(cellThematicsConfig?.scale !== undefined && {
//     //             mapScale: cellThematicsConfig.scale
//     //         }),
//     //         saveDriveTestFilters: JSON.stringify({
//     //             sessions: selectedDriveSessions,
//     //             startDateTime,
//     //             endDateTime,
//     //             thematic: selectedThematic,
//     //             thematicMode,
//     //             ranges,
//     //         }),
//     //     }));

//     //     dispatch(MapActions.setSelectedBoundaries(selectedBoundaries));
//     //     dispatch(MapActions.setRfParameter(rfParameter));

//     //     onClose();
//     // };

// //     const applySelectedMapLayers = () => {

// //     // layerVisibility already up to date in Redux from toggles
// //     // just trigger API calls + save to backend

// //     dispatch(MapActions.clearBoundaryLayer());
// //     dispatch(MapActions.clearRfPredictionLayer());

// //     boundaryGroups.forEach(group => {
// //         const parentSelected = layerVisibility[group.shapegroup];
// //         const children = selectedBoundaries[group.shapegroup] || [];
// //         if (parentSelected) {
// //             dispatch(MapActions.getBoundaryGeoJson(group.shapegroup, group.shapetypes[0], []));
// //         } else if (children.length > 0) {
// //             dispatch(MapActions.getBoundaryGeoJson(group.shapegroup, group.shapetypes[0], children));
// //         }
// //     });

// //     const rfRegionsSelected = selectedBoundaries["RF"] || [];
// //     rfRegionsSelected.forEach(region => {
// //         dispatch(MapActions.getRfPredictionLayer(region, rfParameter));
// //     });

// //     if (layerVisibility.DRIVE_TEST) {
// //         dispatch(MapActions.setDriveTestFilters({
// //             sessions: selectedDriveSessions,
// //             startDateTime,
// //             endDateTime,
// //             thematic: selectedThematic,
// //             thematicMode,
// //             ranges,
// //         }));
// //         dispatch(MapActions.setActiveDriveSessions(selectedDriveSessions));
// //         dispatch(MapActions.getDriveTestData({
// //             sessions: selectedDriveSessions,
// //             startDateTime,
// //             endDateTime
// //         }));
// //     }

// //     if (cellThematicsConfig) {
// //         dispatch(MapActions.setActiveThematic(cellThematicsConfig));
// //     }
// //     if (cellThematicsConfig?.scale !== undefined) {
// //         dispatch(MapActions.setMapConfig({ mapScale: cellThematicsConfig.scale }));
// //     }

// //     // fit to data
// //     // if (layerVisibility.CELLS && rawCells.length > 0) {
// //     //     const points = rawCells.map(c => [Number(c.longitude), Number(c.latitude)]);
// //     //     dispatch(MapActions.fitToBounds(points));
// //     // } else if (layerVisibility.DRIVE_TEST && driveTestData.length > 0) {
// //     //     const filtered = driveTestData.filter(d => selectedDriveSessions.includes(d.session_id));
// //     //     const points = filtered.map(d => [Number(d.longitude), Number(d.latitude)]);
// //     //     dispatch(MapActions.fitToBounds(points));
// //     // }

// //     dispatch(AuthActions.setupConf(true, {
// //         saveLayerVisibility: JSON.stringify({
// //             CELLS: layerVisibility.CELLS,
// //             BOUNDARY: layerVisibility.BOUNDARY,
// //             RF: layerVisibility.RF,
// //             DRIVE_TEST: layerVisibility.DRIVE_TEST
// //         }),
// //         saveBoundaries: JSON.stringify(selectedBoundaries),
// //         saveRfParameter: rfParameter,
// //         ...(cellThematicsConfig && {
// //             saveThematics: JSON.stringify(cellThematicsConfig)
// //         }),
// //         ...(cellThematicsConfig?.scale !== undefined && {
// //             mapScale: cellThematicsConfig.scale
// //         }),
// //         saveDriveTestFilters: JSON.stringify({
// //             sessions: selectedDriveSessions,
// //             startDateTime,
// //             endDateTime,
// //             thematic: selectedThematic,
// //             thematicMode,
// //             ranges,
// //         }),
// //     }));

// //     dispatch(MapActions.setRfParameter(rfParameter));
// //     onClose();
// // };
// // const clearAllMapLayers = () => {

// //     setExpandedLayer(null);

// //     dispatch(MapActions.clearBoundaryLayer());
// //     dispatch(MapActions.clearRfPredictionLayer());

// //     setSelectedDriveSessions([]);
// //     dispatch(MapActions.setActiveDriveSessions([]));
// //     dispatch(MapActions.resetLayerOpacity());

// //     dispatch(MapActions.setActiveThematic({ type: "Band", colors: {}, opacity: 1 }));
// //     dispatch(MapActions.setMapConfig({ mapScale: 1 }));
// //     dispatch(MapActions.resetLayerVisibility());
// //     dispatch(MapActions.setRfParameter("RSRP"));
// //     dispatch(MapActions.setSelectedBoundaries({}));

// //     dispatch(MapActions.setDriveTestFilters({
// //         sessions: [],
// //         startDateTime: "",
// //         endDateTime: "",
// //         thematic: "RSSI",
// //         thematicMode: "Default",
// //         ranges: deepCopyRanges(KPI_RANGE_DEFAULTS["RSSI"]),
// //     }));

// //     setSelectedThematic("RSSI");
// //     setThematicMode("Default");
// //     setRanges(deepCopyRanges(KPI_RANGE_DEFAULTS["RSSI"]));
// //     setStartDateTime("");
// //     setEndDateTime("");

// //     dispatch(AuthActions.setupConf(true, {
// //         saveLayerVisibility: JSON.stringify({
// //             CELLS: false, BOUNDARY: false, RF: false, DRIVE_TEST: false
// //         }),
// //         saveBoundaries: JSON.stringify({}),
// //         saveDriveTestFilters: JSON.stringify({
// //             sessions: [], startDateTime: "", endDateTime: "",
// //             thematic: "RSSI", thematicMode: "Default",
// //             ranges: deepCopyRanges(KPI_RANGE_DEFAULTS["RSSI"]),
// //         }),
// //         saveThematics: JSON.stringify({ type: "Band", colors: {}, opacity: 1 }),
// //         mapScale: 1,
// //     }));

// //     onClose();
// // };

// const applySelectedMapLayers = () => {

//     console.log("pendingBoundaries at Apply:", pendingBoundaries);
// console.log("pendingVisibility at Apply:", pendingVisibility);

//     // commit pending visibility → Redux → map renders
//     dispatch(MapActions.setLayerVisibility("CELLS", pendingVisibility.CELLS || false));
//     dispatch(MapActions.setLayerVisibility("RF", pendingVisibility.RF || false));
//     dispatch(MapActions.setLayerVisibility("DRIVE_TEST", pendingVisibility.DRIVE_TEST || false));
//     boundaryGroups.forEach(group => {
//         dispatch(MapActions.setLayerVisibility(group.shapegroup, pendingVisibility[group.shapegroup] || false));
//     });

//     // commit pending boundaries → Redux
//     dispatch(MapActions.setSelectedBoundaries(pendingBoundaries));

//     // set BOUNDARY meta-flag
//     const anyBoundarySelected = boundaryGroups.some(g =>
//         (pendingBoundaries[g.shapegroup] || []).length > 0
//     );
//     dispatch(MapActions.setLayerVisibility("BOUNDARY", anyBoundarySelected));

//     // fetch boundary geojson for selected groups
//     dispatch(MapActions.clearBoundaryLayer());
//     boundaryGroups.forEach(group => {
//         const children = pendingBoundaries[group.shapegroup] || [];
//         if (pendingVisibility[group.shapegroup] || children.length > 0) {
//             dispatch(MapActions.getBoundaryGeoJson(
//                 group.shapegroup,
//                 group.shapetypes[0],
//                 pendingVisibility[group.shapegroup] ? [] : children
//             ));
//         }
//     });

//     // fetch RF geojson
//     dispatch(MapActions.clearRfPredictionLayer());
//     const rfSelected = pendingBoundaries["RF"] || [];
//     rfSelected.forEach(region => {
//         dispatch(MapActions.getRfPredictionLayer(region, rfParameter));
//     });

//     // drive test — always re-fetch (filter-dependent)
//     if (pendingVisibility.DRIVE_TEST || selectedDriveSessions.length > 0) {        dispatch(MapActions.setDriveTestFilters({
//             sessions: selectedDriveSessions,
//             startDateTime,
//             endDateTime,
//             thematic: selectedThematic,
//             thematicMode,
//             ranges,
//         }));
//         dispatch(MapActions.setActiveDriveSessions(selectedDriveSessions));
//         dispatch(MapActions.getDriveTestData({
//             sessions: selectedDriveSessions,
//             startDateTime,
//             endDateTime
//         }));
//     } else {
//         dispatch(MapActions.setActiveDriveSessions([]));
//     }

//     // cell thematics
//     if (cellThematicsConfig) {
//         dispatch(MapActions.setActiveThematic(cellThematicsConfig));
//     }
//     if (cellThematicsConfig?.scale !== undefined) {
//         dispatch(MapActions.setMapConfig({ mapScale: cellThematicsConfig.scale }));
//     }

//     // save to backend
//     dispatch(AuthActions.setupConf(true, {
//         saveLayerVisibility: JSON.stringify({
//             CELLS: pendingVisibility.CELLS || false,
//             BOUNDARY: anyBoundarySelected,
//             RF: pendingVisibility.RF || false,
//             DRIVE_TEST: selectedDriveSessions.length > 0
//         }),
//         // saveBoundaries: JSON.stringify(pendingBoundaries),
//         saveBoundaries: JSON.stringify(
//             Object.fromEntries(
//                 Object.entries(pendingBoundaries).map(([group, names]) => {
//                     const groupObj = boundaryGroups.find(g => g.shapegroup === group);
//                     const allSelected = names.length === groupObj?.shapenames?.length;
//                     // if all children selected, save "ALL" instead of 47 names
//                     return [group, allSelected ? "ALL" : names];
//                 })
//             )
//         ),
//         saveRfParameter: rfParameter,
//         ...(cellThematicsConfig && {
//             saveThematics: JSON.stringify(cellThematicsConfig)
//         }),
//         ...(cellThematicsConfig?.scale !== undefined && {
//             mapScale: cellThematicsConfig.scale
//         }),
//         saveDriveTestFilters: JSON.stringify({
//             sessions: selectedDriveSessions,
//             startDateTime,
//             endDateTime,
//             thematic: selectedThematic,
//             thematicMode,
//             // ranges,
//         }),
//     }));

//     onClose();
// };

// const clearAllMapLayers = () => {

//     // reset pending state
//     setPendingVisibility({
//         CELLS: false,
//         RF: false,
//         DRIVE_TEST: false,
//         ...boundaryGroups.reduce((acc, g) => ({ ...acc, [g.shapegroup]: false }), {})
//     });
//     setPendingBoundaries({});
//     setExpandedLayer(null);

//     // clear Redux + map
//     dispatch(MapActions.clearBoundaryLayer());
//     dispatch(MapActions.clearRfPredictionLayer());
//     dispatch(MapActions.setActiveDriveSessions([]));
//     dispatch(MapActions.resetLayerOpacity());
//     dispatch(MapActions.setActiveThematic({ type: "Band", colors: {}, opacity: 1 }));
//     dispatch(MapActions.setMapConfig({ mapScale: 1 }));
//     dispatch(MapActions.resetLayerVisibility());
//     dispatch(MapActions.setRfParameter("RSRP"));
//     dispatch(MapActions.setSelectedBoundaries({}));
//     dispatch(MapActions.setDriveTestFilters({
//         sessions: [],
//         startDateTime: "",
//         endDateTime: "",
//         thematic: "RSSI",
//         thematicMode: "Default",
//         ranges: deepCopyRanges(KPI_RANGE_DEFAULTS["RSSI"]),
//     }));

//     // reset local drive test state
//     setSelectedThematic("RSSI");
//     setThematicMode("Default");
//     setRanges(deepCopyRanges(KPI_RANGE_DEFAULTS["RSSI"]));
//     setStartDateTime("");
//     setEndDateTime("");
//     setSelectedDriveSessions([]);

//     // save cleared state to backend
//     dispatch(AuthActions.setupConf(true, {
//         saveLayerVisibility: JSON.stringify({
//             CELLS: false, BOUNDARY: false, RF: false, DRIVE_TEST: false
//         }),
//         saveBoundaries: JSON.stringify({}),
//         saveDriveTestFilters: JSON.stringify({
//             sessions: [], startDateTime: "", endDateTime: "",
//             thematic: "RSSI", thematicMode: "Default",
//             // ranges: deepCopyRanges(KPI_RANGE_DEFAULTS["RSSI"]),
//         }),
//         saveThematics: JSON.stringify({ type: "Band", colors: {}, opacity: 1 }),
//         mapScale: 1,
//     }));

//     onClose();
// };

// const updateRfRangeColor = (range, color) => {
//     setRfRangeColors(prev => ({
//       ...prev,
//       [range]: color
//     }));
//   };

//     // useEffect(() => {
//     //     setSelectedLayers({
//     //         CELL: layerVisibility?.CELLS || false,
//     //         BOUNDARY: layerVisibility?.BOUNDARY || false,
//     //         RF: layerVisibility?.RF || false,
//     //         DRIVE_TEST: layerVisibility?.DRIVE_TEST || false
//     //     });
//     // }, [layerVisibility]);
    
//     useEffect(() => {
//         // reset to Default mode and load new defaults when thematic changes
//         setThematicMode("Default");
//         setRanges(deepCopyRanges(KPI_RANGE_DEFAULTS[selectedThematic]));
//     }, [selectedThematic]);

//   /* ---------------- UI (UNCHANGED) ---------------- */

//   return (
//     <>
//     <div 
//         ref={containerRef}
//          onClick={(e) => e.stopPropagation()} 
//         className="absolute right-0 sm:right-0 sm:left-auto top-full mt-2 bg-white text-black p-4 rounded-xl shadow-xl z-50 w-[280px] sm:w-[320px] max-w-[90vw] max-h-[70vh] overflow-y-auto">
//             <div className="flex gap-3 mb-2 ml-auto flex-shrink-0">
//                 <button
//                     onClick={() => {
//                         applySelectedMapLayers();
//                     }}
//                     className="flex-1 bg-blue-600 text-white py-1 rounded"
//                 >
//                     Apply
//                 </button>

//                 <button
//                     onClick={() => {
//                         clearAllMapLayers();
//                     }}                    
//                     className="flex-1 bg-gray-400 text-white py-1 rounded"
//                 >
//                     Clear
//                 </button>

//             </div>

//             {/* CELLs */}
//             <div className="border rounded p-2 mb-2">
//                 <div
//                 onClick={() =>
//                     setExpandedLayer(
//                     expandedLayer === "CELL"
//                         ? null
//                         : "CELL"
//                     )
//                 }
//                 className="flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded p-1"
//                 >

//                 <div className="flex items-center gap-2">
//                     <input
//                     type="checkbox"
//                     // checked={layerVisibility.CELL || false}
//                     // checked={layerVisibility.CELLS}
//                     // onClick={(e) => e.stopPropagation()}
//                     // onChange={() => toggleParentLayerSelection("CELL")}
//                     // onChange={() => {
//                     //   dispatch(
//                     //     // console.log("MapActions keys:", Object.keys(MapActions)),
//                     //     MapActions.setLayerVisibility(
//                     //         "CELLS"
//                     //     )
//                     //   );
//                     //   // toggleParentLayerSelection("CELL");
//                     // }}

//                     checked={pendingVisibility.CELLS || false}
//                     // onChange={() => {
//                     //     setSelectedLayers(prev => ({
//                     //     ...prev,
//                     //     // CELL: !layerVisibility.CELLS
//                     //     CELL: !prev["CELL"]
//                     //     }));
//                     // }}
//                     onChange={() => toggleParentLayerSelection("CELL")}
//                     />

//                     <span className="font-medium">
//                     Cells
//                     </span>
//                 </div>

//                 <span className="text-xl select-none">
//                     {expandedLayer === "CELL"
//                     ? <UilAngleUp size={22}/>
//                     : <UilAngleDown size={22}/>
//                     }
//                 </span>

//                 </div>

//                 {expandedLayer === "CELL" && (

//                 <div className="mt-3 border rounded p-3 space-y-3">
//                     <CellThematicsPanel setCellThematicsConfig={setCellThematicsConfig} />
//                 </div>
//                 )}
//             </div>

//             {/* Kenya Boundary LAYER GROUPS */}
//             {boundaryGroups.map((group, index) => (

//                 <div key={index} className="border rounded p-2 mb-2">

//                     <div
//                     onClick={() =>
//                         setExpandedLayer(
//                         expandedLayer === group.shapegroup
//                             ? null
//                             : group.shapegroup
//                         )
//                     }
//                     className="flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded p-1"
//                     >

//                     {/* LEFT SIDE */}

//                     <div className="flex items-center gap-2">

//                         <input
//                         type="checkbox"
//                         checked={pendingVisibility[group.shapegroup] || false}
//                         onClick={(e) => e.stopPropagation()}
//                         onChange={() => toggleParentLayerSelection(group.shapegroup)}
//                         />

//                         <span className="font-medium">
//                         {group.shapegroup} boundaries
//                         </span>

//                     </div>

//                     {/* DROPDOWN ARROW */}

//                     <span className="text-xl select-none">
//                         {expandedLayer === group.shapegroup 
//                         ? <UilAngleUp size={22} />
//                         : <UilAngleDown size={22} />
//                         }
//                     </span>

//                     </div>

//                     {/* CHILD LIST */}

//                     {expandedLayer === group.shapegroup && (

//                     <div className="mt-2 border rounded p-2">
//                     <OpacitySlider layer="BOUNDARY" />

//                     <span className="text-xs font-semibold text-gray-500">
//                         Select Layers
//                     </span>
//                     <div className="mt-2 max-h-[200px] overflow-y-auto border rounded p-2">

//                         {group.shapenames.map((name, idx) => (

//                         <label
//                             key={idx}
//                             className="flex items-center gap-2 text-sm mb-1 cursor-pointer"
//                         >

//                             <input
//                             type="checkbox"
//                             checked={
//                                 pendingBoundaries[group.shapegroup]?.includes(name) || false
//                             }
//                             onChange={() =>
//                                 toggleChildLayerSelection(group.shapegroup, name)
//                             }
//                             />

//                             {name}

//                         </label>

//                         ))}

//                     </div>

//                     </div>

//                     )}

//                 </div>

//             ))}

//             {/* RF PREDICTIONS */}
//             <div className="border rounded p-2 mb-2">

//                 <div
//                     onClick={() =>
//                     setExpandedLayer(
//                         expandedLayer === "RF"
//                         ? null
//                         : "RF"
//                     )
//                     }
//                     className="flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded p-1"
//                 >

//                     <div className="flex items-center gap-2">

//                     <input
//                         type="checkbox"
//                         checked={pendingVisibility.RF || false}
//                         onClick={(e) => e.stopPropagation()}
//                         onChange={() => toggleParentLayerSelection("RF")}
//                     />

//                     <span className="font-medium">
//                         RF Predictions
//                     </span>

//                     </div>

//                     <span className="text-xl select-none">
//                     {expandedLayer === "RF"
//                         ? <UilAngleUp size={22}/>
//                         : <UilAngleDown size={22}/>
//                     }
//                     </span>

//                 </div>

//                 {expandedLayer === "RF" && (
//                 <div>
//                 <div className="mt-2 border rounded p-2">
//                     <OpacitySlider layer="RF" />

//                         <span className="text-xs font-semibold text-gray-500">
//                         Select Layers
//                     </span>
//                     <div className="mt-2 max-h-[200px] overflow-y-auto border rounded p-2">

//                         {rfRegions.map((name, idx) => (

//                             <label
//                             key={idx}
//                             className="flex items-center gap-2 text-sm mb-1 cursor-pointer"
//                             >

//                             <input
//                                 type="checkbox"
//                                 checked={
//                                 pendingBoundaries["RF"]?.includes(name) || false
//                                 }
//                                 onChange={() =>
//                                 toggleChildLayerSelection("RF", name)
//                                 }
//                             />

//                             {name}

//                             </label>

//                         ))}
//                     </div >

//                     {/* THEMATIC */}
//                     <div className="mt-3">

//                         <div className="text-xs font-semibold text-gray-500 mb-1">
//                         Apply Thematic by
//                         </div>

//                         <select
//                         value={rfParameter}
//                         onChange={(e) => setRfParameter(e.target.value)}
//                         className="w-full border rounded px-2 py-1 text-sm"
//                         >

//                         {rfParameterOptions.map(opt => (
//                             <option key={opt}>{opt}</option>
//                         ))}

//                         </select>

//                     </div>

//                     {/* RANGE & COLORS */}
//                     <div className="mt-3">
//                         <div className="text-xs font-semibold text-gray-500 mb-1">
//                         Range & Colors
//                         </div>

//                         <div className="space-y-2">

//                         {rfRanges.map(range => (

//                             <div
//                             key={range}
//                             className="flex items-center justify-between border rounded px-2 py-1"
//                             >

//                             <span className="text-sm">
//                                 {range}
//                             </span>

//                             <ColorPicker
//                                 value={rfRangeColors[range] || "#ff0000"}
//                                 onChange={(color) =>
//                                 updateRfRangeColor(range, color)
//                                 }
//                             />

//                             </div>

//                         ))}

//                         </div>
//                     </div>

//                     </div>
//                 </div>
//                 )}

//             </div>

//             {/* DRIVE TEST LAYER */}
//             <div className="border rounded p-2 mb-2">

//                 <div
//                     onClick={() =>
//                     setExpandedLayer(
//                         expandedLayer === "DRIVE_TEST"
//                         ? null
//                         : "DRIVE_TEST"
//                     )
//                     }
//                     className="flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded p-1"
//                 >

//                     <div className="flex items-center gap-2">

//                     <input
//                         type="checkbox"
//                         checked={pendingVisibility.DRIVE_TEST || false}
//                         onClick={(e) => e.stopPropagation()}
//                         onChange={() => toggleParentLayerSelection("DRIVE_TEST")}
//                     />

//                     <span className="font-medium">
//                         Drive Test Layers
//                     </span>

//                     </div>

//                     <span className="text-xl select-none">
//                     {expandedLayer === "DRIVE_TEST"
//                         ? <UilAngleUp size={22}/>
//                         : <UilAngleDown size={22}/>
//                     }
//                     </span>

//                 </div>

//                 {expandedLayer === "DRIVE_TEST" && (
//                 <div className="mt-2 border rounded p-2">
//                     <OpacitySlider layer="DRIVE_TEST" />

//                         {/* Sessions */}
//                     <div>
//                         {/* <label className="flex items-center gap-2 mb-2 text-sm">
//                         <input
//                             type="checkbox"
//                             checked={selectedDriveSessions.length === sessionIds.length}
//                             onChange={selectAllSessions}
//                         />
//                         Select All Sessions
//                         </label> */}

//                         <span className="text-xs font-semibold text-gray-500">
//                         Select Layers
//                         </span>

//                         <div className="max-h-[160px] overflow-y-auto border rounded p-2">
//                         {sessionIds.map((session) => (
//                             <label
//                             key={session}
//                             className="flex items-center gap-2 text-sm  mb-1"
//                             >
//                             <input
//                                 type="checkbox"
//                                 checked={selectedDriveSessions.includes(session)}
//                                 onChange={() => toggleDriveSession(session)}
//                             />
//                             {session}
//                             </label>
//                         ))}
//                         </div>
//                     </div>

//                     <div className="mt-3 space-y-3">

//                     {/* Date */}
//                         <span className="text-xs font-semibold text-gray-500">
//                         Select Start/End DateTime
//                         </span>
//                     <div className="grid grid-cols-2 gap-2">
//                         <input
//                         type="datetime-local"
//                         value={startDateTime}
//                         onChange={(e) => setStartDateTime(e.target.value)}
//                         className="border rounded px-2 py-1 text-xs"
//                         />

//                         <input
//                         type="datetime-local"
//                         value={endDateTime}
//                         onChange={(e) => setEndDateTime(e.target.value)}
//                         className="border rounded px-2 py-1 text-xs"
//                         />
//                     </div>

//                     {/* Thematic */}
//                     {/* Apply Thematic By */}
//                     <div className="mb-3">
//                         <span className="text-xs font-semibold text-gray-500 block mb-1">
//                             Apply Thematic by
//                         </span>
//                         <select
//                             value={selectedThematic}
//                             onChange={(e) => {
//                                 setSelectedThematic(e.target.value);
//                                 if (thematicMode === "Default") {
//                                     setRanges(deepCopyRanges(KPI_RANGE_DEFAULTS[e.target.value] || []));  // ← fixed
//                                 }
//                             }}
//                             className="w-full border rounded px-2 py-1 text-sm"
//                         >
//                             {driveThematicOptions.map(opt => (
//                                 <option key={opt}>{opt}</option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Mode Toggle */}
//                     <div className="text-xs font-semibold text-gray-500 mb-2">
//                         Mode
//                     </div>
//                     <div className="flex gap-2 mb-3">
//                         {["Default", "Custom"].map(mode => (
//                             <button
//                                 key={mode}
//                                 onClick={() => {
//                                     setThematicMode(mode);
//                                     if (mode === "Default") {
//                                         setRanges(deepCopyRanges(KPI_RANGE_DEFAULTS[selectedThematic]));
//                                     }
//                                 }}
//                                 className={`flex-1 px-3 py-1 rounded text-sm border ${
//                                     thematicMode === mode
//                                         ? "bg-blue-600 text-white border-blue-600"
//                                         : "bg-white text-gray-600 border-gray-300"
//                                 }`}
//                             >
//                                 {mode}
//                             </button>
//                         ))}
//                     </div>

//                     {/* Default Preview */}
//                     {thematicMode === "Default" && (
//                         <div className="border rounded p-2 mb-3">
//                             <div className="text-xs font-semibold text-gray-500 mb-2">
//                                 Preview
//                             </div>
//                             <div className="space-y-1">
//                                 {(KPI_RANGE_DEFAULTS[selectedThematic] || []).map((range, i) => (
//                                     <div key={i} className="flex items-center gap-2 text-xs">
//                                         <div
//                                             className="w-3 h-3 rounded-sm flex-shrink-0"
//                                             style={{ backgroundColor: range.color }}
//                                         />
//                                         <span className="text-gray-600">{range.label}</span>
//                                         <span className="text-gray-400 ml-auto">
//                                             {range.max} to {range.min}  {/* ← swap min/max for signal display */}
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Custom Range Filter */}
//                     {thematicMode === "Custom" && (
//                         <RangeFilter
//                             value={ranges}
//                             onChange={setRanges}
//                         />
//                     )}
                
//                     </div>

//                 </div>

//                 )}

//             </div>
//         </div>
//     </>
//   );
// };

// export default AddMapLayersPanel;
import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapActions from "../../store/actions/map-actions";
import AuthActions from "../../store/actions/auth-actions";
import { UilAngleDown, UilAngleUp } from '@iconscout/react-unicons';

import CellThematicsPanel from "./CellThematicsPanel";
import ColorPicker from "./ColorPicker";
import RangeFilter from "./RangeFilter";
import OpacitySlider from "./OpacitySlider";
import SiteThematicsPanel from "./SiteThematicsPanel";
import { KPI_RANGE_DEFAULTS, deepCopyRanges } from "./Utils/colorEngine";
import AddMapLayersPanelFloatingLayout from "./AddMapLayersPanelFloatingLayout";

const AddMapLayersPanel = ({ onClose, mode = "toolbar" }) => {

    const driveThematicOptions = ["RSSI", "RSRP", "DL Thrp", "Frequency"];

    const dispatch = useDispatch();
    const containerRef = useRef(null);

    // ── REDUX SELECTORS ───────────────────────────────────────────
    const boundaryGroups      = useSelector(state => state.map.boundaryGroups || []);
    const selectedBoundaries  = useSelector(state => state.map.selectedBoundaries || {});
    const [expandedBoundaryGroup, setExpandedBoundaryGroup] = useState(null);
    const reduxBoundaryColors = useSelector(state => state.map.boundaryColors || {});
    const [boundaryColors, setBoundaryColors] = useState(reduxBoundaryColors);

    // helper
    // const getBoundaryColor = (group) => boundaryColors[group] || "#000000";
    // const setBoundaryGroupColor = (group, color) => {
    //     setBoundaryColors(prev => ({ ...prev, [group]: color }));
    // };

    const rfPredictionFilters = useSelector(state => state.map.rfPredictionFilters || []);
    const rfColorConfig       = useSelector(state => state.map.rfColorConfig || []);

    const driveTestData       = useSelector(state => state.map.driveTestData || []);
    const driveTestFilters    = useSelector(state => state.map.driveTestFilters);

    const rawCells            = useSelector(state => state.map.rawCells || []);

    const layerVisibility     = useSelector(state => state.map.layerVisibility);
    const layerOpacity        = useSelector(state => state.map.layerOpacity);
    const mapConfig           = useSelector(state => state.map.config);

    // ── PENDING OPACITY (not applied until Apply is clicked) ──────
    const [pendingOpacity, setPendingOpacity] = useState({
        BOUNDARY:   layerOpacity?.BOUNDARY   ?? 1,
        RF:         layerOpacity?.RF         ?? 1,
        DRIVE_TEST: layerOpacity?.DRIVE_TEST ?? 1,
    });
    const layerLegends = useSelector(state => state.map.layerLegends);
    

    // ── RF ────────────────────────────────────────────────────────
    const rfRegions = useMemo(() => (
        [...new Set(rfPredictionFilters.map(item => item.name))]
    ), [rfPredictionFilters]);

    const rfParameterOptions = useMemo(() => (
        [...new Set(rfPredictionFilters.map(p => p.parameter_name))]
    ), [rfPredictionFilters]);

    const [rfParameter, setRfParameter] = useState(mapConfig?.rfParameter || "RSRP");

    const sessionIds = [...new Set(driveTestData.map(d => d.session_id))];

    // ── PENDING STATE ─────────────────────────────────────────────
    const [pendingVisibility, setPendingVisibility] = useState({
        CELLS: false,
        SITES: false,   
        RF: false,
        DRIVE_TEST: false,
        ...boundaryGroups.reduce((acc, g) => ({ ...acc, [g.shapegroup]: false }), {})
    });

    // For Kenya/Admin boundaries only
    const [pendingBoundarySelections, setPendingBoundarySelections] = useState({});

    // For RF regions only  
    const [pendingRfRegions, setPendingRfRegions] = useState([]);

    const [selectedDriveSessions, setSelectedDriveSessions] = useState(
        driveTestFilters?.sessions || []
    );

    const [pendingLegends, setPendingLegends] = useState({
        SITES: false,
        CELLS: false,
        BOUNDARY: false,
        RF: false,
        DRIVE_TEST: false,
    });
    
    // computed — true if ANY boundary group has children selected
    const anyBoundarySelected = boundaryGroups.some(g => 
        (pendingBoundarySelections[g.shapegroup] || []).length > 0
    );

    // indeterminate — some but not all groups fully selected
    const allBoundariesSelected = boundaryGroups.every(g =>
        (pendingBoundarySelections[g.shapegroup] || []).length === g.shapenames?.length
    );


    // ── DRIVE TEST LOCAL STATE ────────────────────────────────────
    const [startDateTime, setStartDateTime] = useState(driveTestFilters?.startDateTime || "");
    const [endDateTime, setEndDateTime]     = useState(driveTestFilters?.endDateTime || "");
    const [ranges, setRanges]               = useState(
        driveTestFilters?.ranges?.length
            ? driveTestFilters.ranges.map(r => ({ ...r }))
            : deepCopyRanges(KPI_RANGE_DEFAULTS["RSSI"])
    );
    const [selectedThematic, setSelectedThematic] = useState(driveTestFilters?.thematic || "RSSI");
    const [thematicMode, setThematicMode]         = useState(driveTestFilters?.thematicMode || "Default");

    const [expandedLayer, setExpandedLayer]         = useState(null);
    /** Datayog-style floating layers: which category fills the right column */
    const [activeLayerSection, setActiveLayerSection] = useState(null);

    // Add a combined setter
    const setExpanded = (layer) => {
        setExpandedLayer(layer);
        if (layer !== "BOUNDARY") setExpandedBoundaryGroup(null);
    };
    const [cellThematicsConfig, setCellThematicsConfig] = useState(null);

    const [siteThematicsConfig, setSiteThematicsConfig] = useState(null);

    // ── SYNC PENDING FROM REDUX ───────────────────────────────────
   useEffect(() => {
    setPendingVisibility({
        CELLS: layerVisibility.CELLS || false,
        SITES: layerVisibility.SITES || false,
        RF: layerVisibility.RF || false,
        DRIVE_TEST: layerVisibility.DRIVE_TEST || false,
        ...boundaryGroups.reduce((acc, g) => ({
            ...acc,
            [g.shapegroup]: layerVisibility[g.shapegroup] || false
        }), {})
    });

    // ── BOUNDARY selections — normalize "ALL" → full array
    const normalizedBoundary = {};
    boundaryGroups.forEach(g => {
        const val = selectedBoundaries[g.shapegroup];
        if (val === "ALL") normalizedBoundary[g.shapegroup] = [...(g.shapenames || [])];
        else if (Array.isArray(val)) normalizedBoundary[g.shapegroup] = val;
        else normalizedBoundary[g.shapegroup] = [];
    });
    setPendingBoundarySelections(normalizedBoundary);

    // ── RF regions — normalize "ALL" → full array
    const rfVal = selectedBoundaries["RF"];
    const normalizedRf = rfVal === "ALL"
        ? [...rfRegions]
        : Array.isArray(rfVal) ? rfVal : [];
    setPendingRfRegions(normalizedRf);

    setSelectedDriveSessions(driveTestFilters?.sessions || []);
    setRfParameter(mapConfig?.rfParameter || "RSRP");
    setPendingOpacity({
        BOUNDARY:   layerOpacity?.BOUNDARY   ?? 1,
        RF:         layerOpacity?.RF         ?? 1,
        DRIVE_TEST: layerOpacity?.DRIVE_TEST ?? 1,
    });
}, [layerVisibility, selectedBoundaries, driveTestFilters, mapConfig?.rfParameter, layerOpacity]);

    useEffect(() => {
        setThematicMode("Default");
        setRanges(deepCopyRanges(KPI_RANGE_DEFAULTS[selectedThematic]));
    }, [selectedThematic]);

    useEffect(() => {
        setPendingLegends({
            SITES: layerLegends?.SITES || false,
            CELLS: layerLegends?.CELLS || false,
            BOUNDARY:   layerLegends?.BOUNDARY   || false,
            RF:         layerLegends?.RF          || false,
            DRIVE_TEST: layerLegends?.DRIVE_TEST || false,
        });
    }, [layerLegends]);

    // SYNC Redux colors to local state when they change
    useEffect(() => {
        setBoundaryColors(reduxBoundaryColors);
    }, [reduxBoundaryColors]);

    // ── TOGGLE HANDLERS ───────────────────────────────────────────

    const toggleParentLayerSelection = (group) => {

        if (group === "CELL") {
            const newValue = !pendingVisibility.CELLS;
            setPendingVisibility(prev => ({ ...prev, CELLS: newValue }));
            if (newValue) {
                setExpanded("CELL");
                setCellThematicsConfig({ type: "Band", colors: {}, opacity: 1, scale: 1 });
            }
            return;
        }

        if (group === "DRIVE_TEST") {
            const newValue = !pendingVisibility.DRIVE_TEST;
            setPendingVisibility(prev => ({ ...prev, DRIVE_TEST: newValue }));
            setSelectedDriveSessions(newValue ? sessionIds : []);
            if (newValue) setExpanded(group);
            return;
        }

        // boundary groups (KEN etc)
        const newValue = !pendingVisibility[group];
        setPendingVisibility(prev => ({ ...prev, [group]: newValue }));
        const groupObj = boundaryGroups.find(g => g.shapegroup === group);
        setPendingBoundarySelections(prev => ({
            ...prev,
            [group]: newValue ? groupObj?.shapenames || [] : []
        }));
        if (newValue) {
            setExpandedLayer("BOUNDARY");              // keep BOUNDARY section open
            setExpandedBoundaryGroup(group);           // open this specific sub-group
        }
    };

    // NEW — dedicated RF parent toggle
    const toggleRfLayer = () => {
        const newValue = !pendingVisibility.RF;
        setPendingVisibility(prev => ({ ...prev, RF: newValue }));
        setPendingRfRegions(newValue ? rfRegions : []);
        if (newValue) setExpanded("RF");
    };
    
    const toggleBoundaryChild = (shapegroup, name) => {
        const existing = pendingBoundarySelections[shapegroup] || [];
        const updated = existing.includes(name)
            ? existing.filter(n => n !== name)
            : [...existing, name];

        setPendingBoundarySelections(prev => ({ ...prev, [shapegroup]: updated }));

        const totalChildren = boundaryGroups.find(g => g.shapegroup === shapegroup)?.shapenames?.length || 0;
        setPendingVisibility(prev => ({
            ...prev,
            [shapegroup]: updated.length === totalChildren
        }));
    };

    const toggleRfRegion = (name) => {
        const updated = pendingRfRegions.includes(name)
            ? pendingRfRegions.filter(n => n !== name)
            : [...pendingRfRegions, name];

        setPendingRfRegions(updated);
        setPendingVisibility(prev => ({
            ...prev,
            RF: updated.length === rfRegions.length
        }));
    };

    const toggleDriveSession = (session) => {
        setSelectedDriveSessions(prev => {
            const updated = prev.includes(session)
                ? prev.filter(s => s !== session)
                : [...prev, session];

            setPendingVisibility(p => ({
                ...p,
                DRIVE_TEST: updated.length === sessionIds.length
            }));

            return updated;
        });
    };

    // ── APPLY ─────────────────────────────────────────────────────
   const applySelectedMapLayers = () => {

        // ── COMMIT BOUNDARIES TO REDUX ────────────────────────────
    const cleanBoundaries = {};
    boundaryGroups.forEach(group => {
        const children = pendingBoundarySelections[group.shapegroup] || [];
        if (children.length > 0) cleanBoundaries[group.shapegroup] = children;
    });
    if (pendingRfRegions.length > 0) cleanBoundaries["RF"] = pendingRfRegions;
    if (selectedDriveSessions.length > 0) cleanBoundaries["DRIVE_TEST"] = selectedDriveSessions;
    dispatch(MapActions.setSelectedBoundaries(cleanBoundaries));

    // ── BOUNDARY ──────────────────────────────────────────────
    const anyBoundarySelected = boundaryGroups.some(g =>
        (pendingBoundarySelections[g.shapegroup] || []).length > 0
    );

    dispatch(MapActions.setBoundaryColors(boundaryColors));

    boundaryGroups.forEach(group => {
        const children = pendingBoundarySelections[group.shapegroup] || [];
        dispatch(MapActions.setLayerVisibility(group.shapegroup, children.length > 0));
    });
    dispatch(MapActions.setLayerVisibility("BOUNDARY", anyBoundarySelected));

    // fetch boundary geojson — only re-fetch if selection changed
    boundaryGroups.forEach(group => {
        const children = pendingBoundarySelections[group.shapegroup] || [];
        const prevChildren = Array.isArray(selectedBoundaries[group.shapegroup])
            ? selectedBoundaries[group.shapegroup]
            : selectedBoundaries[group.shapegroup] === "ALL"
                ? group.shapenames
                : [];

        const changed = JSON.stringify([...children].sort()) !== JSON.stringify([...prevChildren].sort());

        if (children.length > 0 && changed) {
            dispatch(MapActions.getBoundaryGeoJson(
                group.shapegroup,
                group.shapetypes[0],
                children.length === group.shapenames?.length ? [] : children
            ));
        } else if (children.length === 0 && prevChildren.length > 0) {
            dispatch(MapActions.clearBoundaryGroup(group.shapegroup));
        }
    });

    // ── RF ────────────────────────────────────────────────────
    dispatch(MapActions.setLayerVisibility("RF", pendingRfRegions.length > 0));
    const prevRfRegions = Array.isArray(selectedBoundaries["RF"])
        ? selectedBoundaries["RF"]
        : selectedBoundaries["RF"] === "ALL"
            ? rfRegions
            : [];

   const rfAdded   = pendingRfRegions.filter(r => !prevRfRegions.includes(r));
    const rfRemoved = prevRfRegions.filter(r => !pendingRfRegions.includes(r));

    rfRemoved.forEach(region => {
        dispatch(MapActions.clearRfPredictionRegion(region));
    });
    rfAdded.forEach(region => {
        dispatch(MapActions.getRfPredictionLayer(region, rfParameter));
    });

    // ── CELLS / SITES / BOUNDARIES/ DRIVE TEST /────────────────────────────
    dispatch(MapActions.setLayerVisibility("CELLS", pendingVisibility.CELLS || false));
    dispatch(MapActions.setLayerVisibility("SITES", pendingVisibility.SITES || false));
    dispatch(MapActions.setLayerVisibility("DRIVE_TEST", selectedDriveSessions.length > 0));
    
    dispatch(MapActions.setLayerLegend("SITES", pendingLegends.SITES));
    dispatch(MapActions.setLayerLegend("CELLS", pendingLegends.CELLS));
    dispatch(MapActions.setLayerLegend("BOUNDARY", pendingLegends.BOUNDARY));
    dispatch(MapActions.setLayerLegend("RF", pendingLegends.RF));
    dispatch(MapActions.setLayerLegend("DRIVE_TEST", pendingLegends.DRIVE_TEST));

    // ── DRIVE TEST ────────────────────────────────────────────
    if (selectedDriveSessions.length > 0) {
        dispatch(MapActions.setDriveTestFilters({
            sessions: selectedDriveSessions,
            startDateTime, endDateTime,
            thematic: selectedThematic, thematicMode, ranges,
        }));
        dispatch(MapActions.setActiveDriveSessions(selectedDriveSessions));
        dispatch(MapActions.getDriveTestData());
    } else {
        dispatch(MapActions.setActiveDriveSessions([]));
    }

    // ── CELL / SITE THEMATICS ─────────────────────────────────
    if (cellThematicsConfig) dispatch(MapActions.setActiveThematic(cellThematicsConfig));
    if (cellThematicsConfig?.scale !== undefined)
        dispatch(MapActions.setMapConfig({ mapScale: cellThematicsConfig.scale }));
    if (siteThematicsConfig) dispatch(MapActions.setActiveSiteThematic(siteThematicsConfig));
    if (siteThematicsConfig?.scale !== undefined)
        dispatch(MapActions.setMapConfig({ mapScale: siteThematicsConfig.scale }));

    // ── COMMIT OPACITY TO REDUX ───────────────────────────────────
    dispatch(MapActions.setLayerOpacity("BOUNDARY",   pendingOpacity.BOUNDARY));
    dispatch(MapActions.setLayerOpacity("RF",         pendingOpacity.RF));
    dispatch(MapActions.setLayerOpacity("DRIVE_TEST", pendingOpacity.DRIVE_TEST));

    // ── COMMIT RF PARAMETER TO REDUX ──────────────────────────────
    dispatch(MapActions.setRfParameter(rfParameter));

    // ── SAVE TO BACKEND ───────────────────────────────────────
    dispatch(AuthActions.setupConf(true, {
        saveLayerVisibility: JSON.stringify({
            CELLS: pendingVisibility.CELLS || false,
            SITES: pendingVisibility.SITES || false,
            BOUNDARY: anyBoundarySelected,
            RF: pendingRfRegions.length > 0,
            DRIVE_TEST: selectedDriveSessions.length > 0
        }),
        saveBoundaries: JSON.stringify(
            Object.fromEntries(
                boundaryGroups.map(group => {
                    const names = pendingBoundarySelections[group.shapegroup] || [];
                    return [group.shapegroup, names.length === group.shapenames?.length ? "ALL" : names];
                })
            )
        ),
        saveRfRegions: JSON.stringify(
            pendingRfRegions.length === rfRegions.length ? "ALL" : pendingRfRegions
        ),
        saveRfParameter: rfParameter,
        ...(cellThematicsConfig && { saveThematics: JSON.stringify(cellThematicsConfig) }),
        ...(cellThematicsConfig?.scale !== undefined && { mapScale: cellThematicsConfig.scale }),
        saveLayerOpacity: JSON.stringify(pendingOpacity),
        ...(siteThematicsConfig && { saveSiteThematics: JSON.stringify(siteThematicsConfig) }),
        saveDriveTestFilters: JSON.stringify({
            sessions: selectedDriveSessions,
            startDateTime, endDateTime,
            thematic: selectedThematic, thematicMode,
        }),
        saveLayerLegends: JSON.stringify(pendingLegends),
        saveBoundaryColors: JSON.stringify(boundaryColors),
    }));

    onClose();
};

    // ── CLEAR ─────────────────────────────────────────────────────
    const clearAllMapLayers = () => {

        setPendingVisibility({
            CELLS: false,
             SITES: false,  
            RF: false,
            DRIVE_TEST: false,
            ...boundaryGroups.reduce((acc, g) => ({ ...acc, [g.shapegroup]: false }), {})
        });
        setPendingBoundarySelections({});
        setPendingRfRegions([]);

        setExpanded(null);
        setPendingLegends({ SITES: false, CELLS: false, BOUNDARY: false, RF: false, DRIVE_TEST: false });
        
        setSelectedDriveSessions([]);
        setSelectedThematic("RSSI");
        setThematicMode("Default");
        setRanges(deepCopyRanges(KPI_RANGE_DEFAULTS["RSSI"]));
        setStartDateTime("");
        setEndDateTime("");

        setPendingOpacity({ BOUNDARY: 1, RF: 1, DRIVE_TEST: 1 });
        dispatch(MapActions.clearBoundaryLayer());
        dispatch(MapActions.clearRfPredictionLayer());
        dispatch(MapActions.setActiveDriveSessions([]));
        dispatch(MapActions.resetLayerOpacity());
        dispatch(MapActions.setActiveThematic({ type: "Band", colors: {}, opacity: 1 }));
        dispatch(MapActions.setActiveSiteThematic({ type: "Technology", colors: {} }));
        dispatch(MapActions.setMapConfig({ mapScale: 1 }));
        dispatch(MapActions.resetLayerVisibility());
        dispatch(MapActions.setRfParameter("RSRP"));
        dispatch(MapActions.setSelectedBoundaries({}));
        dispatch(MapActions.setDriveTestFilters({
            sessions: [],
            startDateTime: "",
            endDateTime: "",
            thematic: "RSSI",
            thematicMode: "Default",
            ranges: deepCopyRanges(KPI_RANGE_DEFAULTS["RSSI"]),
        }));
        dispatch(MapActions.setLayerLegend("SITES", false));
        dispatch(MapActions.setLayerLegend("CELLS", false));
        dispatch(MapActions.setLayerLegend("BOUNDARY", false));
        dispatch(MapActions.setLayerLegend("RF", false));
        dispatch(MapActions.setLayerLegend("DRIVE_TEST", false));

        setBoundaryColors({});
        dispatch(MapActions.setBoundaryColors({}));

        dispatch(AuthActions.setupConf(true, {
            saveLayerVisibility: JSON.stringify({
                CELLS: false, BOUNDARY: false, RF: false, DRIVE_TEST: false
            }),
            saveBoundaries: JSON.stringify({ RF: [] }),
            saveRfRegions: JSON.stringify([]), 
            saveDriveTestFilters: JSON.stringify({
                sessions: [], startDateTime: "", endDateTime: "",
                thematic: "RSSI", thematicMode: "Default",
            }),
            saveThematics: JSON.stringify({ type: "Band", colors: {}, opacity: 1 }),
            saveSiteThematics: JSON.stringify({ type: "Technology", colors: {} }),
            mapScale: 1,
            saveLayerLegends: JSON.stringify(pendingLegends),
            saveBoundaryColors: JSON.stringify({}),

        }));

        onClose();
    };

    const toggleFloatingSection = useCallback((key) => {
        setActiveLayerSection((cur) => (cur === key ? null : key));
    }, []);

    const clearActiveLayerSectionDraft = useCallback(() => {
        if (!activeLayerSection) return;
        if (activeLayerSection === "SITE") {
            setPendingVisibility((prev) => ({ ...prev, SITES: layerVisibility.SITES || false }));
            setPendingLegends((prev) => ({ ...prev, SITES: layerLegends?.SITES || false }));
            setSiteThematicsConfig(null);
            return;
        }
        if (activeLayerSection === "CELL") {
            setPendingVisibility((prev) => ({ ...prev, CELLS: layerVisibility.CELLS || false }));
            setPendingLegends((prev) => ({ ...prev, CELLS: layerLegends?.CELLS || false }));
            setCellThematicsConfig(null);
            return;
        }
        if (activeLayerSection === "BOUNDARY") {
            const normalizedBoundary = {};
            boundaryGroups.forEach((g) => {
                const val = selectedBoundaries[g.shapegroup];
                if (val === "ALL") normalizedBoundary[g.shapegroup] = [...(g.shapenames || [])];
                else if (Array.isArray(val)) normalizedBoundary[g.shapegroup] = val;
                else normalizedBoundary[g.shapegroup] = [];
            });
            setPendingBoundarySelections(normalizedBoundary);
            setPendingVisibility((prev) => {
                const next = { ...prev };
                boundaryGroups.forEach((g) => {
                    next[g.shapegroup] = layerVisibility[g.shapegroup] || false;
                });
                return next;
            });
            setPendingLegends((prev) => ({ ...prev, BOUNDARY: layerLegends?.BOUNDARY || false }));
            setPendingOpacity((prev) => ({ ...prev, BOUNDARY: layerOpacity?.BOUNDARY ?? 1 }));
            setBoundaryColors(reduxBoundaryColors);
            setExpandedBoundaryGroup(null);
            return;
        }
        if (activeLayerSection === "RF") {
            const rfVal = selectedBoundaries["RF"];
            const normalizedRf = rfVal === "ALL" ? [...rfRegions] : Array.isArray(rfVal) ? rfVal : [];
            setPendingRfRegions(normalizedRf);
            setPendingVisibility((prev) => ({ ...prev, RF: layerVisibility.RF || false }));
            setPendingLegends((prev) => ({ ...prev, RF: layerLegends?.RF || false }));
            setPendingOpacity((prev) => ({ ...prev, RF: layerOpacity?.RF ?? 1 }));
            setRfParameter(mapConfig?.rfParameter || "RSRP");
            return;
        }
        if (activeLayerSection === "DRIVE_TEST") {
            setPendingVisibility((prev) => ({ ...prev, DRIVE_TEST: layerVisibility.DRIVE_TEST || false }));
            setSelectedDriveSessions(driveTestFilters?.sessions || []);
            setStartDateTime(driveTestFilters?.startDateTime || "");
            setEndDateTime(driveTestFilters?.endDateTime || "");
            const th = driveTestFilters?.thematic || "RSSI";
            setSelectedThematic(th);
            setThematicMode(driveTestFilters?.thematicMode || "Default");
            setRanges(
                driveTestFilters?.ranges?.length
                    ? driveTestFilters.ranges.map((r) => ({ ...r }))
                    : deepCopyRanges(KPI_RANGE_DEFAULTS[th] || KPI_RANGE_DEFAULTS["RSSI"])
            );
            setPendingLegends((prev) => ({ ...prev, DRIVE_TEST: layerLegends?.DRIVE_TEST || false }));
            setPendingOpacity((prev) => ({ ...prev, DRIVE_TEST: layerOpacity?.DRIVE_TEST ?? 1 }));
        }
    }, [
        activeLayerSection,
        layerVisibility,
        layerLegends,
        selectedBoundaries,
        boundaryGroups,
        reduxBoundaryColors,
        rfRegions,
        driveTestFilters,
        layerOpacity,
        mapConfig?.rfParameter,
    ]);


    // ── RENDER ────────────────────────────────────────────────────
    if (mode === "floating") {
        return (
            <div ref={containerRef} onClick={(e) => e.stopPropagation()}>
                <AddMapLayersPanelFloatingLayout
                    activeLayerSection={activeLayerSection}
                    setActiveLayerSection={setActiveLayerSection}
                    toggleFloatingSection={toggleFloatingSection}
                    clearActiveLayerSectionDraft={clearActiveLayerSectionDraft}
                    applySelectedMapLayers={applySelectedMapLayers}
                    pendingVisibility={pendingVisibility}
                    setPendingVisibility={setPendingVisibility}
                    pendingLegends={pendingLegends}
                    setPendingLegends={setPendingLegends}
                    setSiteThematicsConfig={setSiteThematicsConfig}
                    setCellThematicsConfig={setCellThematicsConfig}
                    boundaryGroups={boundaryGroups}
                    anyBoundarySelected={anyBoundarySelected}
                    allBoundariesSelected={allBoundariesSelected}
                    expandedBoundaryGroup={expandedBoundaryGroup}
                    setExpandedBoundaryGroup={setExpandedBoundaryGroup}
                    pendingBoundarySelections={pendingBoundarySelections}
                    setPendingBoundarySelections={setPendingBoundarySelections}
                    toggleBoundaryChild={toggleBoundaryChild}
                    toggleParentLayerSelection={toggleParentLayerSelection}
                    pendingOpacity={pendingOpacity}
                    setPendingOpacity={setPendingOpacity}
                    boundaryColors={boundaryColors}
                    setBoundaryColors={setBoundaryColors}
                    rfRegions={rfRegions}
                    pendingRfRegions={pendingRfRegions}
                    setPendingRfRegions={setPendingRfRegions}
                    toggleRfRegion={toggleRfRegion}
                    rfParameter={rfParameter}
                    setRfParameter={setRfParameter}
                    rfParameterOptions={rfParameterOptions}
                    rfColorConfig={rfColorConfig}
                    sessionIds={sessionIds}
                    selectedDriveSessions={selectedDriveSessions}
                    setSelectedDriveSessions={setSelectedDriveSessions}
                    toggleDriveSession={toggleDriveSession}
                    startDateTime={startDateTime}
                    setStartDateTime={setStartDateTime}
                    endDateTime={endDateTime}
                    setEndDateTime={setEndDateTime}
                    selectedThematic={selectedThematic}
                    setSelectedThematic={setSelectedThematic}
                    thematicMode={thematicMode}
                    setThematicMode={setThematicMode}
                    ranges={ranges}
                    setRanges={setRanges}
                    driveThematicOptions={driveThematicOptions}
                />
            </div>
        );
    }

    return (
        <>
        <div
            ref={containerRef}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 sm:right-0 sm:left-auto top-full mt-2 bg-white text-black p-4 rounded-xl shadow-xl z-50 w-[280px] sm:w-[320px] max-w-[90vw] max-h-[70vh] overflow-y-auto">

            {/* Apply / Clear */}
            <div className="flex gap-3 mb-2 ml-auto flex-shrink-0">
                <button onClick={applySelectedMapLayers} className="flex-1 bg-blue-600 text-white py-1 rounded">
                    Apply
                </button>
                <button onClick={clearAllMapLayers} className="flex-1 bg-gray-400 text-white py-1 rounded">
                    Clear
                </button>
            </div>

            {/* SITES */}
            <div className="border rounded p-2 mb-2">
                <div
                    onClick={() => setExpanded(expandedLayer === "SITE" ? null : "SITE")}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded p-1"
                >
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={pendingVisibility.SITES || false}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => {
                                const newVal = !pendingVisibility.SITES;
                                setPendingVisibility(prev => ({ ...prev, SITES: newVal }));
                                if (newVal) setExpanded("SITE");
                            }}
                        />
                        <span className="font-medium">Sites (Towers)</span>
                    </div>
                    <span className="text-xl select-none">
                        {expandedLayer === "SITE" ? <UilAngleUp size={22}/> : <UilAngleDown size={22}/>}
                    </span>
                </div>
                {expandedLayer === "SITE" && (
                    <div className="mt-3 border rounded p-3 space-y-3">
                    <SiteThematicsPanel
                        setSiteThematicsConfig={setSiteThematicsConfig}
                        tempLegend={pendingLegends.SITES}
                        setTempLegend={(val) =>
                            setPendingLegends(prev => ({ ...prev, SITES: val }))
                        }
                    />                    
                    </div>
                )}
            </div>

            {/* CELLS */}
            <div className="border rounded p-2 mb-2">
                <div
                    onClick={() => setExpanded(expandedLayer === "CELL" ? null : "CELL")}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded p-1"
                >
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={pendingVisibility.CELLS || false}
                            onChange={() => toggleParentLayerSelection("CELL")}
                        />
                        <span className="font-medium">Cells</span>
                    </div>
                    <span className="text-xl select-none">
                        {expandedLayer === "CELL" ? <UilAngleUp size={22}/> : <UilAngleDown size={22}/>}
                    </span>
                </div>
                {expandedLayer === "CELL" && (
                    <div className="mt-3 border rounded p-3 space-y-3">
                        <CellThematicsPanel 
                            setCellThematicsConfig={setCellThematicsConfig}
                            tempLegend={pendingLegends.CELLS}
                            setTempLegend={(val) =>
                                setPendingLegends(prev => ({ ...prev, CELLS: val }))
                            } 
                        />
                    </div>
                )}
            </div>

            {/* BOUNDARY GROUPS(KEN) */}
             {/* {boundaryGroups.map((group, index) => (
                <div key={index} className="border rounded p-2 mb-2">
                    <div
                        onClick={() => setExpanded(expandedLayer === group.shapegroup ? null : group.shapegroup)}
                        className="flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded p-1"
                    >
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={pendingVisibility[group.shapegroup] || false}
                                onClick={(e) => e.stopPropagation()}
                                onChange={() => toggleParentLayerSelection(group.shapegroup)}
                            />
                            <span className="font-medium">{group.shapegroup} boundaries</span>
                        </div>
                        <span className="text-xl select-none">
                            {expandedLayer === group.shapegroup ? <UilAngleUp size={22}/> : <UilAngleDown size={22}/>}
                        </span>
                    </div>
                    {expandedLayer === group.shapegroup && (
                        <div className="mt-2 border rounded p-2">

                            <OpacitySlider layer="BOUNDARY" />

                            
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-500">
                                    Line Color
                                </span>
                                <ColorPicker
                                    value={boundaryColor}
                                    onChange={(color) => setBoundaryColor(color)}
                                />
                            </div>

                            <span className="text-xs font-semibold text-gray-500">Select Layers</span>
                            <div className="mt-2 max-h-[200px] overflow-y-auto border rounded p-2">
                                {group.shapenames.map((name, idx) => (
                                    <label key={idx} className="flex items-center gap-2 text-sm mb-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={pendingBoundaries[group.shapegroup]?.includes(name) || false}
                                            onChange={() => toggleChildLayerSelection(group.shapegroup, name)}
                                        />
                                        {name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}  */}

            {/* BOUNDARIES — single parent with nested groups */}
{boundaryGroups.length > 0 && (
    <div className="border rounded p-2 mb-2">

        {/* Parent header */}
        <div
            onClick={() => setExpanded(expandedLayer === "BOUNDARY" ? null : "BOUNDARY")}
            className="flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded p-1"
        >
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    ref={el => {
                        if (el) {
                            el.indeterminate = anyBoundarySelected && !allBoundariesSelected;
                        }
                    }}
                    checked={allBoundariesSelected && boundaryGroups.length > 0}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => {
                        // if any selected → deselect all, else select all
                        if (anyBoundarySelected) {
                            const cleared = {};
                            boundaryGroups.forEach(g => { cleared[g.shapegroup] = []; });
                            setPendingBoundarySelections(prev => ({ ...prev, ...cleared }));
                            boundaryGroups.forEach(g => {
                                setPendingVisibility(prev => ({ ...prev, [g.shapegroup]: false }));
                            });
                        } else {
                            const all = {};
                            boundaryGroups.forEach(g => { all[g.shapegroup] = g.shapenames || []; });
                            setPendingBoundarySelections(prev => ({ ...prev, ...all }));
                            boundaryGroups.forEach(g => {
                                setPendingVisibility(prev => ({ ...prev, [g.shapegroup]: true }));
                            });
                            setExpanded("BOUNDARY");
                        }
                    }}
                />
                <span className="font-medium">Boundaries</span>
            </div>
            <span className="text-xl select-none">
                {expandedLayer === "BOUNDARY" ? <UilAngleUp size={22}/> : <UilAngleDown size={22}/>}
            </span>
        </div>

        {/* Expanded content */}
        {expandedLayer === "BOUNDARY" && (
            <div className="mt-2 border rounded p-2">

                {/* Show Legends — */}
                 <div className="flex items-center justify-between pt-3 mb-3 mt-3 border-b pb-3">
                    <span className="text-xs font-semibold text-gray-500">
                        Show Legend
                    </span>
                    <input
                        type="checkbox"
                        checked={!!pendingLegends.BOUNDARY}
                        onChange={(e) =>
                            setPendingLegends(prev => ({
                                ...prev,
                                BOUNDARY: e.target.checked
                            }))
                        }
                    />
                </div>

                {/* Opacity — shared for all boundary groups */}
                <OpacitySlider
                    value={pendingOpacity.BOUNDARY}
                    onChange={(val) => setPendingOpacity(prev => ({ ...prev, BOUNDARY: val }))}
                />
                
                {/* Each boundary group — independently expandable */}
                {boundaryGroups.map((group, index) => (
                    <div key={index} className="border rounded p-2 mb-2">

                        {/* Group header */}
                        <div
                            onClick={() => setExpandedBoundaryGroup(
                                expandedBoundaryGroup === group.shapegroup ? null : group.shapegroup
                            )}
                            className="flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded p-1"
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={pendingVisibility[group.shapegroup] || false}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={() => toggleParentLayerSelection(group.shapegroup)}
                                />
                                <span className="text-sm font-medium">{group.shapegroup}</span>
                            </div>
                            <span className="text-xl select-none">
                                {expandedBoundaryGroup === group.shapegroup
                                    ? <UilAngleUp size={18}/>
                                    : <UilAngleDown size={18}/>
                                }
                            </span>
                        </div>

                        
                        {expandedBoundaryGroup === group.shapegroup && (
                            <div className="mt-2 p-2">
                                {/* Per-group color */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-gray-500">Line Color</span>
                                   <ColorPicker
                                        value={boundaryColors[group.shapegroup] || "#000000"}
                                        // onChange={(color) =>
                                        //     setBoundaryColors(prev => ({
                                        //         ...prev,
                                        //         [group.shapegroup]: color
                                        //     }))
                                        // }

                                        onChange={(color) => {
    console.log("Updating color for group:", group.shapegroup, "to:", color);
    console.log("Previous boundaryColors:", boundaryColors);
    setBoundaryColors(prev => {
        const updated = {
            ...prev,
            [group.shapegroup]: color
        };
        console.log("Updated boundaryColors:", updated);
        return updated;
    });
}}
                                    />
                                </div>

                                {/* Children list */}
                                <div className="mt-2 max-h-[200px] overflow-y-auto border rounded p-2">
                                    {group.shapenames.map((name, idx) => (
                                        <label key={idx} className="flex items-center gap-2 text-sm mb-1 cursor-pointer">
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
                        )}

                    </div>
                ))}
            </div>
        )}
    </div>
)}

            {/* RF PREDICTIONS */}
            <div className="border rounded p-2 mb-2">
                <div
                    onClick={() => setExpanded(expandedLayer === "RF" ? null : "RF")}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded p-1"
                >
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={pendingVisibility.RF || false}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => toggleRfLayer()}
                        />
                        <span className="font-medium">RF Predictions</span>
                    </div>
                    <span className="text-xl select-none">
                        {expandedLayer === "RF" ? <UilAngleUp size={22}/> : <UilAngleDown size={22}/>}
                    </span>
                </div>
                {expandedLayer === "RF" && (
                    <div className="mt-2 border rounded p-2">
                        <div className="flex items-center justify-between pt-3 mb-3 mt-3 border-b pb-3">
                            <span className="text-xs font-semibold text-gray-500">Show Legend</span>
                            <input
                                type="checkbox"
                                checked={!!pendingLegends.RF}
                                onChange={(e) =>
                                    setPendingLegends(prev => ({ ...prev, RF: e.target.checked }))
                                }
                            />
                        </div>
                        <OpacitySlider
                            value={pendingOpacity.RF}
                            onChange={(val) => setPendingOpacity(prev => ({ ...prev, RF: val }))}
                        />
                        <span className="text-xs font-semibold text-gray-500">Select Layers</span>
                        <div className="mt-2 max-h-[200px] overflow-y-auto border rounded p-2">
                            {rfRegions.map((name, idx) => (
                                <label key={idx} className="flex items-center gap-2 text-sm mb-1 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={pendingRfRegions.includes(name)}
onChange={() => toggleRfRegion(name)}
                                    />
                                    {name}
                                </label>
                            ))}
                        </div>
                        <div className="mt-3">
                            <div className="text-xs font-semibold text-gray-500 mb-1">Apply Thematic by</div>
                            <select
                                value={rfParameter}
                                onChange={(e) => setRfParameter(e.target.value)}
                                className="w-full border rounded px-2 py-1 text-sm"
                            >
                                {rfParameterOptions.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="mt-3">
                            <div className="text-xs font-semibold text-gray-500 mb-1">Range & Colors</div>
                            <div className="space-y-2">
                                {rfColorConfig
                                    .filter(c => c.parameter_name === rfParameter)
                                    .sort((a, b) => a.display_order - b.display_order)
                                    .map(entry => (
                                        <div key={entry.range_label} className="flex items-center justify-between border rounded px-2 py-1">
                                            <span className="text-sm">{entry.range_label}</span>
                                            <div
                                                className="w-5 h-5 rounded border border-gray-300 flex-shrink-0"
                                                style={{ backgroundColor: entry.color_hex }}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* DRIVE TEST */}
            <div className="border rounded p-2 mb-2">
                <div
                    onClick={() => setExpanded(expandedLayer === "DRIVE_TEST" ? null : "DRIVE_TEST")}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded p-1"
                >
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={pendingVisibility.DRIVE_TEST || false}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => toggleParentLayerSelection("DRIVE_TEST")}
                        />
                        <span className="font-medium">Drive Test Layers</span>
                    </div>
                    <span className="text-xl select-none">
                        {expandedLayer === "DRIVE_TEST" ? <UilAngleUp size={22}/> : <UilAngleDown size={22}/>}
                    </span>
                </div>
                {expandedLayer === "DRIVE_TEST" && (
                    <div className="mt-2 border rounded p-2">

                        <div className="flex items-center justify-between mb-3 mt-3 border-b pb-3">
                            <span className="text-xs font-semibold text-gray-500">
                                Show Legend
                            </span>

                            <input
                                type="checkbox"
                                checked={!!pendingLegends.DRIVE_TEST}
                                onChange={(e) =>
                                setPendingLegends(prev => ({
                                    ...prev,
                                    DRIVE_TEST: e.target.checked
                                }))
                                }
                            />
                        </div>
                        

                        <OpacitySlider
                            value={pendingOpacity.DRIVE_TEST}
                            onChange={(val) => setPendingOpacity(prev => ({ ...prev, DRIVE_TEST: val }))}
                        />
                        <span className="text-xs font-semibold text-gray-500">Select Layers</span>
                        <div className="max-h-[160px] overflow-y-auto border rounded p-2">
                            {sessionIds.map((session) => (
                                <label key={session} className="flex items-center gap-2 text-sm mb-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedDriveSessions.includes(session)}
                                        onChange={() => toggleDriveSession(session)}
                                    />
                                    {session}
                                </label>
                            ))}
                        </div>
                        <div className="mt-3 space-y-3">
                            <span className="text-xs font-semibold text-gray-500">Select Start/End DateTime</span>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="datetime-local"
                                    value={startDateTime}
                                    onChange={(e) => setStartDateTime(e.target.value)}
                                    className="border rounded px-2 py-1 text-xs"
                                />
                                <input
                                    type="datetime-local"
                                    value={endDateTime}
                                    onChange={(e) => setEndDateTime(e.target.value)}
                                    className="border rounded px-2 py-1 text-xs"
                                />
                            </div>
                            <div className="mb-3">
                                <span className="text-xs font-semibold text-gray-500 block mb-1">Apply Thematic by</span>
                                <select
                                    value={selectedThematic}
                                    onChange={(e) => {
                                        setSelectedThematic(e.target.value);
                                        if (thematicMode === "Default") {
                                            setRanges(deepCopyRanges(KPI_RANGE_DEFAULTS[e.target.value] || []));
                                        }
                                    }}
                                    className="w-full border rounded px-2 py-1 text-sm"
                                >
                                    {driveThematicOptions.map(opt => <option key={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div className="text-xs font-semibold text-gray-500 mb-2">Mode</div>
                            <div className="flex gap-2 mb-3">
                                {["Default", "Custom"].map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => {
                                            setThematicMode(mode);
                                            if (mode === "Default") {
                                                setRanges(deepCopyRanges(KPI_RANGE_DEFAULTS[selectedThematic]));
                                            }
                                        }}
                                        className={`flex-1 px-3 py-1 rounded text-sm border ${
                                            thematicMode === mode
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-gray-600 border-gray-300"
                                        }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                            {thematicMode === "Default" && (
                                <div className="border rounded p-2 mb-3">
                                    <div className="text-xs font-semibold text-gray-500 mb-2">Preview</div>
                                    <div className="space-y-1">
                                        {(KPI_RANGE_DEFAULTS[selectedThematic] || []).map((range, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs">
                                                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: range.color }} />
                                                <span className="text-gray-600">{range.label}</span>
                                                <span className="text-gray-400 ml-auto">{range.max} to {range.min}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {thematicMode === "Custom" && (
                                <RangeFilter value={ranges} onChange={setRanges} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default AddMapLayersPanel;
