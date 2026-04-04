// import React, { useEffect, useRef, useState, useMemo } from 'react';
// import ReactMapGL, { Layer, Source } from 'react-map-gl';
// import mapboxgl from 'mapbox-gl';
// import { useDispatch, useSelector } from 'react-redux';
// import MapActions from '../../store/actions/map-actions';
// import MapFilters from '../../components/MapComponents/MapFilters';
// import ComponentSidebar from '../../components/ComponentSidebar';
// import Dragger from '../../components/Dragger';
// import * as Unicons from '@iconscout/react-unicons';
// import { ALERTS } from '../../store/reducers/component-reducer';
// import { useNavigate } from 'react-router-dom';
// import { MARKER_CHART_LIST } from '../../store/reducers/map-reducer';
// import Modal from '../../components/Modal';
// import MapChart from './MapChart';
// import AutoSuggestion from '../../components/FormElements/AutoSuggestion';
// import { useForm } from 'react-hook-form';
// import { Tooltip } from 'recharts';
// import CustomTooltip from '../../components/CustomTooltip';
// import CommonActions from '../../store/actions/common-actions';
// // import state from 'sweetalert/typings/modules/state';
// // import Signal from "react-lucide/dist/icons/signal";
// import SupersetDashboard from '../SuperSet/SupersetDashboard';

// // mapboxgl.accessToken =  import.meta.env.VITE_MAPBOX_TOKEN;
// mapboxgl.accessToken ="";
// const MapBoxView = () => {
//     // Calculate the coordinates of the triangle vertices
//     const mapContainer = useRef(null);
//     const [smap, setMap] = useState(null);
//     const [oneLoad, setOneLoad] = useState(true);
//     const [MoneLoad, setMOneLoad] = useState(true);
//     const [eLoad, seteLoad] = useState([]);
//     const [oneCtr, setOneCtr] = useState(0);
//     const [lnglng, setLng] = useState(0);
//     const [latlat, setLat] = useState(0);
//     // const [zoomzoom, setZoom] = useState(0);
//     let zoomzoom = 0

//     const svgRef = useRef(null);

//     const [map, setsMap] = useState(null);
//     const [valueShower, setValueShower] = useState({});
//     const [ShowDragger, setShowDragger] = useState(false);
//     const [mapview, setmapview] = useState('mapbox://styles/mapbox/streets-v11')

//     // const [slider, setSlider] = useState(1)

//     const navigate = useNavigate()

//     // console.log(lnglng, latlat, zoomzoom, "lng,lat,zoomlng,lat,zoom")

//     let slider = useSelector((state) => {
//         return state?.auth?.commonConfig?.mapScale || 20
//     })


//     const [sidebarOpen, setSidebarOpen] = useState(false);
//     const [modalOpen, setModalOpen] = useState(false);
//     const [dataValue, setDataValue] = useState({});
//     const [gopen, SetgOpen] = useState([])
//     const [mapSiteList, SetmapSiteList] = useState([])
//     const [mapSiteData, SetmapSiteData] = useState([])

//     const dispatch = useDispatch()

//     const DASHBOARD_UUID = "0ccb9f27-ef5c-47bb-8c86-5126f34bad2f";
//     const FILTER_Id = "NATIVE_FILTER-Frwtlbdl8UhCOYVoGiXp9";

//     const [supersetUrl, setSupersetUrl] = useState(null); //url method of embedding
//     const [isSupersetModalOpen, setIsSupersetModalOpen] = useState(false);

//     const [supersetUuid, setSupersetUuid] = useState(null); //sdk method of embedding
//     const [supersetFliterId, setsupersetFliterId] = useState(false);
//     const [filterValue, setFilterValue] = useState(null);

//     // svgRef

//     const handleRightClick = (event, data, types) => {
//         console.log(types,data, "typesetypestypes")

//            if (types === "openCellDashboardInNewTab") {
//             // const url = buildSupersetCellDashboardUrl(data?.Cell_name);
//             // if (url) {
//             //     window.open(url, "_blank", "noopener,noreferrer");
//             // }
//             // const DASHBOARD_UUID = "b5259bc2-8f63-4097-ab6e-5fb3cdece14f";
//             // const DASHBOARD_UUID= "0ccb9f27-ef5c-47bb-8c86-5126f34bad2f";
//             // window.open(`/Filtered-cell-dashboard/${DASHBOARD_UUID}?cell=${data?.Cell_name}`, "_blank");
//             window.open(
//             `/Filtered-cell-dashboard/${DASHBOARD_UUID}?cell=${data?.Cell_name}&filterId=${FILTER_Id}`,
//             "_blank"
//             );
//             return;
//         }

//         if (types == "moveToChartWindow") {
//             moveToChartWindow(data, "two")
//         }

//         if (types == "moveToSiteAnalyticsWindow") {
//             moveToSiteAnalyticsWindow(data, "two")
//         }

//         if (types == "moveToCellAnalyticsWindow") {
//             moveToCellAnalyticsWindow(data, "two")
//         }

//         if (types == "moveToSiteProrulesWindow") {
//             moveToSiteProrulesWindow(data, "two")
//         }

//         if (types == "moveToCellProrulesWindow") {
//             moveToCellProrulesWindow(data, "two")
//         }

//         event.preventDefault();
//         // alert("event", "dsadasdasdsa")
//         console.log(event, "handleRightClickhandleRightClick")
//     }

//     const generateCoordinates = (x, y, Dir, antBW, c_length, s_height) => {
//         const newCoordinates = [];

//         // Initial coordinate
//         newCoordinates.push([x, y]);

//         // Calculate and push remaining coordinates
//         for (let j = 10; j >= 1; j--) {
//             const x1 = x + (Math.sin((Dir - antBW / 2 + (antBW / 10) * j) * 0.01745329252) / (69.093 / c_length) / ((110 - slider) * 100));
//             // console.log(`${x}  (Math.sin((${Dir} - ${antBW} / 2 + (${antBW} / 10) * ${j}) * 0.01745329252) / (69.093 / ${c_length}) / 5)`,"sincostan")
//             const y1 = y + (Math.cos((Dir - antBW / 2 + (antBW / 10) * j) * 0.01745329252) / (69.093 / c_length) / ((110 - slider) * 100));

//             // const x1 = x + (Math.sin((Dir - antBW / 2 + (antBW / 10) * j) * 0.01745329252) / (69.093 / c_length) / 1000);
//             // // console.log(`${x}  (Math.sin((${Dir} - ${antBW} / 2 + (${antBW} / 10) * ${j}) * 0.01745329252) / (69.093 / ${c_length}) / 5)`,"sincostan")
//             // const y1 = y + (Math.cos((Dir - antBW / 2 + (antBW / 10) * j) * 0.01745329252) / (69.093 / c_length) / 1000);
//             newCoordinates.push([x1, y1, s_height]);
//         }

//         newCoordinates.push([x, y]);
//         return newCoordinates;
//     };
//     // function calculateEndPoint(startPoint, angle, distance) {
//     //     var lat1 = startPoint[1] * Math.PI / 180;
//     //     var lon1 = startPoint[0] * Math.PI / 180;
//     //     var bearing = angle * Math.PI / 180;
//     //     var R = 6371; // Earth's radius in km
//     //     var lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance / R) + Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearing));
//     //     var lon2 = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(distance / R) * Math.cos(lat1), Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2));
//     //     lat2 = lat2 * 180 / Math.PI;
//     //     lon2 = lon2 * 180 / Math.PI;
//     //     return [lon2, lat2];

//     // }

//     useSelector((state) => {



//         // console.log(state?.map?.get_all_filter?.d1.map((iewqw) => {
//         //     console.log(iewqw.child.map((wqew) => {
//         //         console.log(wqew, "wqewwqewwqewwqewwqewwqew")
//         //     }), "iewqwiewqwiewqwiewqw")
//         // }), "dasdasdasdasdasda")

//         if (state?.map?.get_all_filter?.d1 && MoneLoad) {
//             if (state?.auth?.commonConfig?.saveMapFilters) {

//                 let finewl_ar = Object.entries(JSON.parse(state?.auth?.commonConfig?.saveMapFilters)).map((irewerwe) => {
//                     // console.log(irewerwe, "irewerweirewerweirewerwe")

//                     return irewerwe[0]
//                 })

//                 let innd = 0

//                 let qiew = []

//                 state?.map?.get_all_filter?.d1.map((iewqw) => {

//                     iewqw.child.map((wqew) => {
//                         innd += 1

//                         if (finewl_ar.indexOf(wqew.name) != -1) {
//                             qiew.push("ind_" + innd.toString())
//                         }
//                         // console.log(finewl_ar.indexOf(wqew.name), innd, "wqewwqewwqewwqewwqewwqew")
//                     })
//                 })

//                 SetgOpen(qiew)
//                 setMOneLoad(false)
//                 // console.log({ ...JSON.parse(state?.auth?.commonConfig?.saveMapFilters) }, "saveMapFilterssaveMapFilters")
//                 setDataValue({ ...JSON.parse(state?.auth?.commonConfig?.saveMapFilters) })
//                 setmapview(state?.auth?.commonConfig?.mapView)
//             }
//         }

//     })

//     console.log(dataValue, "dsadadasdasdsadsadasdas")
//     let userLatLong = useSelector((state) => {

//         if (state?.auth?.commonConfig?.saveLatLong) {

//             let dae = JSON.parse(state?.auth?.commonConfig?.saveLatLong)
//             return {
//                 center: [dae.lng, dae.lat],
//                 zoom: dae.zoom
//             }

//         } else {
//             return {
//                 center: [36.817223, -1.286389],
//                 zoom: 15
//             }
//         }
//         let allmarkerList = state?.auth?.commonConfig?.saveLatLong ? JSON.parse(state?.auth?.commonConfig?.saveLatLong) : {
//             center: [36.817223, -1.286389],
//             zoom: 15
//         }
//         return allmarkerList
//     })

//     let userOldFilters = useSelector((state) => {

//         if (state?.auth?.commonConfig?.saveMapFilters) {

//             let dae = JSON.parse(state?.auth?.commonConfig?.saveMapFilters)
//             return dae

//         } else {
//             return []
//         }
//     })


//     console.log(userOldFilters, "userOldFiltersuserOldFiltersuserOldFilters", userLatLong, "userLatLonguserLatLonguserLatLonguserLatLong")


//     // let listOfSiteId = useSelector((state) => {

//     //     let allmarkerList = state?.map?.markerList?.data || []
//     //     return allmarkerList.map((oneVal, index) => {
//     //         return {
//     //             label: oneVal.Site_Name,
//     //             value: index
//     //         }
//     //     })
//     // })
//     const markerList = useSelector(state => state?.map?.markerList?.data)

// const listOfSiteId = useMemo(() => {
//    if (!markerList) return []
//    return markerList.map((oneVal, index) => ({
//       label: oneVal.Site_Name,
//       value: index
//    }))
// }, [markerList])


//     let listofallmarkerList = useSelector((state) => {

//         return state?.map?.markerList?.data
//         return allmarkerList.map((oneVal, index) => {
//             return {
//                 label: oneVal.Site_Name,
//                 value: index
//             }
//         })
//     })


//     let allmarker = useSelector((state) => {
//         let allmarkerList = state?.map?.markerList?.data

//         if (smap != null && allmarkerList && allmarkerList.length > 0 && oneLoad) {
//             console.log(allmarkerList, "allmarkerListallmarkerList82")
//             // console.log(allmarkerList, "allmarkerListallmarkerList84")


//             // const existingSource = smap.getSource('triangles');
//             // if (existingSource) {
//             //     smap.removeSource('triangles');
//             // }

//             // const existingLayer = smap.getLayer('triangles-fill');
//             // if (existingLayer) {
//             //     smap.removeLayer('triangles-fill');
//             // }

//             let ArraytrianglesGeoJSON = []


//             let mapArrList = []
//             let mapArrListFilter = []
//             allmarkerList.forEach((itm, index) => {
//                 // Assuming generateCoordinates function returns the coordinates for a triangle
//                 const coordinates = generateCoordinates(itm.LONGITUDE, itm.LATITUDE, itm.Azimuth, itm.length, itm.length, itm.orderRing);

//                 if (mapArrListFilter.indexOf(itm.Site_Name) == -1) {
//                     mapArrList.push({
//                         label: itm.Site_Name,
//                         value: index
//                     })
//                     mapArrListFilter.push(itm.Site_Name)
//                 }



//                 ArraytrianglesGeoJSON.push({
//                     'type': 'Feature',
//                     'geometry': {
//                         'type': 'Polygon',
//                         'coordinates': [coordinates]
//                     },
//                     'properties': {
//                         'color': itm?.color, // Red
//                         'markerData': itm, // Attach marker data to properties
//                         // 'name': 'nit'
//                     }
//                 });
//             });

//             // console.log(itm.color,'allcolros')

//             const trianglesGeoJSON = {
//                 'type': 'FeatureCollection',
//                 'features': ArraytrianglesGeoJSON
//             };

//             const trianglesSourceExists = smap.getSource('triangles');
//             if (!trianglesSourceExists) {


//                 smap.addSource('triangles', {
//                     'type': 'geojson',
//                     'data': trianglesGeoJSON
//                 });

//                 smap.addLayer({
//                     'id': 'triangles-fill',
//                     'type': 'line',
//                     'source': 'triangles',
//                     'layout': {},
//                     'paint': {
//                         // 'fill-color': "blue",
//                         'line-color': ['get', 'color'], // Use the color from the feature properties
//                         'line-opacity': 1,
//                         'line-width': 5
//                     }
//                 });
//             } else {
//                 // Update the existing source data
//                 smap.getSource('triangles').setData(trianglesGeoJSON);
//             }

//             // Handle click events on polygons
//             smap.on('click', 'triangles-fill', (e) => {
//                 const clickedFeature = e.features[0];

//                 // console.log("dasdasadasdasdsa", clickedFeature.properties.name)
//                 const jmarkerData = clickedFeature.properties.markerData;

//                 // Display alert with marker data

//                 const markerData = JSON.parse(jmarkerData)


//                 setValueShower(markerData)
//                 setShowDragger(true)

//                 // alert(`Cell Name: ${markerData.Cell_name}, Azimuth: ${markerData.Azimuth}`);
//             });

//             // Change the cursor to a pointer when hovering over the polygons
//             smap.on('mouseenter', 'triangles-fill', () => {
//                 smap.getCanvas().style.cursor = 'pointer';
//             });

//             // Change it back to the default cursor when it leaves
//             smap.on('mouseleave', 'triangles-fill', () => {
//                 smap.getCanvas().style.cursor = '';
//             });

//             SetmapSiteList(mapArrList)
//             SetmapSiteData(allmarkerList)


//             setOneLoad(false)

//             // setOneCtr(prev=>prev+1)
//         }
//     })


// //     const moveToChartWindow = (data, from) => {
// // // 1️⃣ clear previous chart data
// //         dispatch(MARKER_CHART_LIST({ dataAll: {}, reset: true }))
// //         console.log(data, "dasdasdasmoveToChartWindow")


// //         dispatch(MapActions.getMarkerChart(data, () => {
// //             setModalOpen(false)
// //         }))
// //         if (from == "one") {
// //             setModalOpen(true)
// //         } else {
// //             // navigate("/mapChart")
// //             dispatch(CommonActions.setLastName(true, "MAP Chart"))
// //             const newWin = window.open("/mapChart?Cell_name=" + data?.Cell_name, "_blank", "noopener,noreferrer")
// //             if (newWin) {
// //                 newWin.opener = null
// //             }

// //         }


// //     }

//     const moveToChartWindow = (data, from) => {
//     // 1️⃣ clear previous chart data
//     dispatch(MARKER_CHART_LIST({ dataAll: {}, reset: true }));

//     // 2️⃣ open modal
//     setModalOpen(true);

//     // 3️⃣ fetch chart data
//     dispatch(
//         MapActions.getMarkerChart(
//         data,   // ⚠️ FULL data object, NOT only Cell_name
//         () => {} // no modal close here
//         )
//     );
//     };


//     const moveToSiteAnalyticsWindow = (data, from) => {
// //         dispatch(CommonActions.setLastName(true, "Site Analytics"))
//         if (from == "one") {
//             navigate("/dataplus-analytics-pro/site-analytics?uniqueId=" + data.Physical_id)
//         } else {
//             const newWin = window.open("/dataplus-analytics-pro/site-analytics?uniqueId=" + data.Physical_id, "_blank", "noopener,noreferrer")
//             if (newWin) {
//                 newWin.opener = null
//             }
//         }
//     }

//     const moveToCellAnalyticsWindow = (data, from) => {
// 
//         dispatch(CommonActions.setLastName(true, "Cell Analytics"))


//         if (from == "one") {
//             navigate("/dataplus-analytics-pro/cell-analytics?uniqueId=" + data.Cell_name)
//         } else {
//             const newWin = window.open("/dataplus-analytics-pro/cell-analytics?uniqueId=" + data.Cell_name, "_blank", "noopener,noreferrer")
//             if (newWin) {
//                 newWin.opener = null
//             }
//         }
//     }

//     const moveToSiteProrulesWindow = (data, from) => {
// //         dispatch(CommonActions.setLastName(true, "Site Pro Rules"))

//         if (from == "one") {
//             navigate("/dataplus-analytics-pro/site-pro-rules?uniqueId=" + data.Physical_id)
//         } else {
//             const newWin = window.open("/dataplus-analytics-pro/site-pro-rules?uniqueId=" + data.Physical_id, "_blank", "noopener,noreferrer")
//             if (newWin) {
//                 newWin.opener = null
//             }
//         }
//     }

//     const moveToCellProrulesWindow = (data, from) => {
// 
//         dispatch(CommonActions.setLastName(true, "Cell Pro Rules"))

//         if (from == "one") {
//             navigate("/dataplus-analytics-pro/cell-pro-rules?uniqueId=" + data.Cell_name)
//         } else {
//             const newWin = window.open("/dataplus-analytics-pro/cell-pro-rules?uniqueId=" + data.Cell_name, "_blank", "noopener,noreferrer")
//             if (newWin) {
//                 newWin.opener = null
//             }
//         }


//     }
//     const copyToClipboarding = (data) => {

//         const finalData = Object.entries(data).map((itm) => {
//             // console.log(itm, "fsadasdsadas")
//             return `${itm[0]}: ${itm[1]}`
//         }).join("; ")

//         // console.log(finalData, "finalDatafinalData")


//         navigator.clipboard.writeText(finalData)

//         let msgdata = {
//             show: true,
//             icon: 'info',
//             buttons: [],
//             type: 1,
//             text: "Text copied Successfully"
//         }
//         dispatch(ALERTS(msgdata))

//     }



//     useEffect(() => {
//         let data = {
//             lat: 1.2921,
//             lng: 36.8219,
//             radius: 15,
//             dataValue: userOldFilters
//         }

//         dispatch(MapActions.getTechWithBand())
//         dispatch(MapActions.getAllFilterList())
//         dispatch(MapActions.getMarkerList(data, () => { }))

//         var map = new mapboxgl.Map({
//             container: 'map',
//             style: mapview,
//             center: userLatLong.center,
//             zoom: userLatLong.zoom
//         });

//         map.removeControl(map._controls[0]);

//         // alert()


//         // Add triangle source and layer
//         map.on('load', function () {

//             setMap(map)
//         });

//         map.on('move', () => {
//             setLng(map.getCenter().lng);
//             setLat(map.getCenter().lat);

//             // console.log(zoomzoom != +map.getZoom().toFixed(0), zoomzoom, +map.getZoom().toFixed(0), "zoomzoomzoomzoom")
//             if (zoomzoom != +map.getZoom().toFixed(0)) {
//                 zoomzoom = +map.getZoom().toFixed(0)
//                 let mappingdata = {
//                     zoom: zoomzoom,
//                     lat: map.getCenter().lat,
//                     lng: map.getCenter().lng
//                 }
//                 dispatch(MapActions.saveCurrentMapLatLong({ "saveLatLong": JSON.stringify(mappingdata) }))
//             }
//         });

//         return () => map.remove(); // Clean up on unmount
//     }, [oneCtr]);
//     // return <div id="map" className='w-full h-full'></div>


//     // console.log("dsdadadasdasoneLoadoneLoad", oneCtr, oneLoad)
//     // console.log(mapview, "mapviewmapview")
//     const handleKeyPress = (event) => {
//         console.log(event.key, "event.keyevent.keyevent.key")
//         if (event.key === 'Enter') {

//             event.target.blur();
//             //     // Call your function here
//             //     alert(":ertyui")
//         }
//     };

//     const buildSupersetCellDashboardUrl = (cellName, { standalone = true } = {}) => {
//         if (!cellName) return null;

//         const BASE = "http://192.168.0.100:8088";
//         const DASHBOARD_ID = 11 ;  //URL method will use this ID to fetch the dashboard and render it
//         const FILTER_ID = "NATIVE_FILTER-Frwtlbdl8UhCOYVoGiXp9";
        
//          // Escape single quotes safely
//           const FILTER_Name = cellName.replace(/'/g, "\\'");

//           let url =
//             `${BASE}/superset/dashboard/${DASHBOARD_ID}/` +
//             `?native_filters=(` +
//             `${FILTER_ID}:(` +
//                 `filterState:(value:!('${FILTER_Name}')),` +
//                 `extraFormData:(filters:!((col:cell_name,op:IN,val:!('${FILTER_Name}'))))` +
//             `)` +
//             `)`;

//           if (standalone) {
//                 url += "&standalone=2";
//          }

//         return url;
//     };

//     // using url method to embed dashboard
//     // const handleLeftClick = (data) => {
//     //     const url = buildSupersetCellDashboardUrl(data?.Cell_name, {
//     //         standalone: true,
//     //     });

//     //     if (!url) return;

//     //     setSupersetUrl(url);
//     //     setIsSupersetModalOpen(true);
//     // };

//     // using SDK method to embed dashboard 
//     const handleLeftClick = (data) => {
//         // const DASHBOARD_UUID = "b5259bc2-8f63-4097-ab6e-5fb3cdece14f";
//         // const DASHBOARD_UUID= "0ccb9f27-ef5c-47bb-8c86-5126f34bad2f";
//         // const FILTER_Id = "NATIVE_FILTER-Frwtlbdl8UhCOYVoGiXp9";
//         // setsupersetFliterId(FILTER_Id + ":'" + data?.Cell_name + "'");
//         setSupersetUuid(DASHBOARD_UUID);
//         setsupersetFliterId(FILTER_Id);
//         setFilterValue(data?.Cell_name);
//         setIsSupersetModalOpen(true);
//     };


//     const {
//         register,
//         handleSubmit,
//         watch,
//         reset,
//         setValue,
//         getValues,
//         formState: { errors },
//     } = useForm()
//     let idSelector = [
//         {
//             label: "Select Site ID", name: "fr_phy_id", value: "Select", type: "text", datalist: "listData", option: mapSiteList, props: {
//                 onBlur: (e) => {

//                     let getFilteredData = mapSiteData.filter(itewq => itewq.Site_Name === e.target.value)
//                     if (getFilteredData.length > 0) {

//                         // console.log(getFilteredData[0].LATITUDE,getFilteredData[0].LONGITUDE,"LONGITUDELATITUDEdfghjkl;dsvadhjksal;")
//                         const center = [getFilteredData[0].LONGITUDE, getFilteredData[0].LATITUDE];
//                         smap.flyTo({ center, zoom: 18 });

//                     }
//                     // console.log(listofallmarkerList,getFilteredData,"dfghjkl;dsvadhjksal;")
//                 },
//                 onKeyDown: handleKeyPress
//             }, required: true,
//         },
//         { label: "Pre Date", name: "fr_pre_date", type: "datetime", formattype: "date", format: "yyyy-MM-dd", formatop: "yyyy-MM-DD", required: true },
//         { label: "Post Date", name: "fr_post_date", type: "datetime", formattype: "date", format: "yyyy-MM-dd", formatop: "yyyy-MM-DD", required: true }
//     ]
//     return (
//         <>

//             <div className="relative left-0 right-0 top-0 bottom-0 h-[100%] w-full flex flex-row justify-between">

//                 {/* SEARCH BAR */}
//                 <div className='absolute top-[10px] left-[10px] z-[1000] '>
//                     <div className='flex relative sm:w-[380px] w-[260px]'>
//                         {/* <label className="block text-sm font-medium text-black whitespace-nowrap dark:text-black  py-2 pl-1 w-48">{idSelector[0]["label"]}</label> */}

//                         <div onKeyDown={handleKeyPress} className='w-full' action='#'>
//                             <AutoSuggestion itm={idSelector[0]} errors={errors} handleSubmit={handleSubmit} setValue={setValue} getValues={getValues} register={register} />
//                         </div>
//                         <svg className='absolute bottom-0 right-0' viewBox="0 -0.5 25 25" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
//                             <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
//                             <g id="SVGRepo_iconCarrier">
//                                 <path fillRule="evenodd" clipRule="evenodd" d="M5.5 11.9999C5.50034 9.13745 7.52262 6.67387 10.3301 6.11575C13.1376 5.55763 15.9484 7.06041 17.0435 9.70506C18.1386 12.3497 17.2131 15.3997 14.833 16.9897C12.4528 18.5798 9.28087 18.2671 7.257 16.2429C6.13183 15.1175 5.49981 13.5912 5.5 11.9999Z" stroke="#14113c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
//                                 <path fillRule="evenodd" clipRule="evenodd" d="M11.5 14.9999L13.268 13.2429C13.7367 12.7781 14.0003 12.1454 14.0003 11.4854C14.0003 10.8253 13.7367 10.1926 13.268 9.72786C12.2894 8.75673 10.7106 8.75673 9.73199 9.72786C9.26328 10.1926 8.99963 10.8253 8.99963 11.4854C8.99963 12.1454 9.26328 12.7781 9.73199 13.2429L11.5 14.9999Z" stroke="#14113c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
//                                 <path d="M15.972 15.9999L19.5 18.9999" stroke="#14113c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
//                             </g>
//                         </svg>
//                     </div>
//                 </div>



//                 <div id="map" ref={mapContainer} className='w-full h-full'>

//                     {
//                         ShowDragger ? <div >
//                             <Dragger
//                                 mapH={smap && smap.getCanvas() && smap.getCanvas().style.height}
//                                 mapW={smap && smap.getCanvas() && smap.getCanvas().style.width}
//                                 >
//                                     <div className='bg-white w-auto h-auto absolute bottom-2' >
//                                         <div className='flex bg-primaryLine h-10 right justify-end items-center'>
//                                             <CustomTooltip text={"Click to copy."}>
//                                                 <div className='cursor-pointer' onClick={() => {copyToClipboarding(valueShower)}}>
//                                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
//                                                         <path fillRule="evenodd" d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 0 1-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0 1 13.5 1.5H15a3 3 0 0 1 2.663 1.618ZM12 4.5A1.5 1.5 0 0 1 13.5 3H15a1.5 1.5 0 0 1 1.5 1.5H12Z" clipRule="evenodd" />
//                                                         <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 0 1 9 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0 1 16.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625v-12Z" />
//                                                         <path d="M10.5 10.5a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963 5.23 5.23 0 0 0-3.434-1.279h-1.875a.375.375 0 0 1-.375-.375V10.5Z" />
//                                                     </svg>
//                                                 </div>
//                                             </CustomTooltip>

//                                             <CustomTooltip text={"Click to go Site Analytics"}>
//                                                 <div className='cursor-pointer' 
//                                                     onContextMenu={(e) => { handleRightClick(e, valueShower, "moveToSiteAnalyticsWindow") }} onClick={() => {
//                                                     moveToSiteAnalyticsWindow(valueShower, "one")
//                                                 }}>
//                                                     {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-6">
//                                                         <path 
//                                                             fillRule="evenodd" 
//                                                             d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z" 
//                                                             clipRule="evenodd" 
//                                                         />
//                                                     </svg> */}

//                                                      <svg
//                                                         xmlns="http://www.w3.org/2000/svg"
//                                                         viewBox="0 0 24 24"
//                                                         className="w-8 h-8 text-white"
//                                                         fill="currentColor"
//                                                         >
//                                                         {/* Antenna dot */}
//                                                         <circle cx="12" cy="10" r="1.6" /> 

//                                                         {/* Antenna mast */}
//                                                         <path d="M11 12h2l1.6 8h-5.2L11 12z" /> 

//                                                         {/* Signal waves */}
//                                                         <path d="M7.8 9.5a5 5 0 0 0 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//                                                         <path d="M5.5 8a8 8 0 0 0 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//                                                         <path d="M16.2 9.5a5 5 0 0 1 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//                                                         <path d="M18.5 8a8 8 0 0 1 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//                                                     </svg> 
                                                    
//                                                 </div>
//                                             </CustomTooltip>

//                                             <CustomTooltip text={"Click to go Cell Analytics"}>
//                                                 <div className='cursor-pointer'
//                                                     onContextMenu={(e) => { handleRightClick(e, valueShower, "moveToCellAnalyticsWindow") }} onClick={() => {
//                                                     moveToCellAnalyticsWindow(valueShower, "one")
//                                                 }}>
//                                                     {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-6">
//                                                         <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
//                                                     </svg> */}
//                                                     {/* <Unicons.UisCell size={32} /> */}
//                                                    <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     viewBox="0 0 24 24"
//                                                     fill="none"
//                                                     className="w-8 h-8 text-white"
//                                                     >
//                                                     {/* Outlined signal fan */}
//                                                     <path
//                                                         d="M12 6C8.6 6 5.4 7.5 3 9.9L12 19l9-9.1C18.6 7.5 15.4 6 12 6Z"
//                                                         stroke="currentColor"
//                                                         strokeWidth="2"
//                                                         strokeLinejoin="round"
//                                                     />
//                                                     </svg>


//                                                 </div>
//                                             </CustomTooltip>

//                                             <CustomTooltip text={"Click to go Site Pro rules"}>
//                                                 <div className='cursor-pointer' 
//                                                     onContextMenu={(e) => { handleRightClick(e, valueShower, "moveToSiteProrulesWindow") }} onClick={() => {
//                                                     moveToSiteProrulesWindow(valueShower, "one")
//                                                 }}>
//                                                     {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
//                                                         <path d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 0 1-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 0 1 6.126 3.537ZM8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 0 1 0 .75l-1.732 3c-.229.397-.76.5-1.067.161A5.23 5.23 0 0 1 6.75 12a5.23 5.23 0 0 1 1.37-3.536ZM10.878 17.13c-.447-.098-.623-.608-.394-1.004l1.733-3.002a.75.75 0 0 1 .65-.375h3.465c.457 0 .81.407.672.842a5.252 5.252 0 0 1-6.126 3.539Z" />
//                                                         <path fillRule="evenodd" d="M21 12.75a.75.75 0 1 0 0-1.5h-.783a8.22 8.22 0 0 0-.237-1.357l.734-.267a.75.75 0 1 0-.513-1.41l-.735.268a8.24 8.24 0 0 0-.689-1.192l.6-.503a.75.75 0 1 0-.964-1.149l-.6.504a8.3 8.3 0 0 0-1.054-.885l.391-.678a.75.75 0 1 0-1.299-.75l-.39.676a8.188 8.188 0 0 0-1.295-.47l.136-.77a.75.75 0 0 0-1.477-.26l-.136.77a8.36 8.36 0 0 0-1.377 0l-.136-.77a.75.75 0 1 0-1.477.26l.136.77c-.448.121-.88.28-1.294.47l-.39-.676a.75.75 0 0 0-1.3.75l.392.678a8.29 8.29 0 0 0-1.054.885l-.6-.504a.75.75 0 1 0-.965 1.149l.6.503a8.243 8.243 0 0 0-.689 1.192L3.8 8.216a.75.75 0 1 0-.513 1.41l.735.267a8.222 8.222 0 0 0-.238 1.356h-.783a.75.75 0 0 0 0 1.5h.783c.042.464.122.917.238 1.356l-.735.268a.75.75 0 0 0 .513 1.41l.735-.268c.197.417.428.816.69 1.191l-.6.504a.75.75 0 0 0 .963 1.15l.601-.505c.326.323.679.62 1.054.885l-.392.68a.75.75 0 0 0 1.3.75l.39-.679c.414.192.847.35 1.294.471l-.136.77a.75.75 0 0 0 1.477.261l.137-.772a8.332 8.332 0 0 0 1.376 0l.136.772a.75.75 0 1 0 1.477-.26l-.136-.771a8.19 8.19 0 0 0 1.294-.47l.391.677a.75.75 0 0 0 1.3-.75l-.393-.679a8.29 8.29 0 0 0 1.054-.885l.601.504a.75.75 0 0 0 .964-1.15l-.6-.503c.261-.375.492-.774.69-1.191l.735.267a.75.75 0 1 0 .512-1.41l-.734-.267c.115-.439.195-.892.237-1.356h.784Zm-2.657-3.06a6.744 6.744 0 0 0-1.19-2.053 6.784 6.784 0 0 0-1.82-1.51A6.705 6.705 0 0 0 12 5.25a6.8 6.8 0 0 0-1.225.11 6.7 6.7 0 0 0-2.15.793 6.784 6.784 0 0 0-2.952 3.489.76.76 0 0 1-.036.098A6.74 6.74 0 0 0 5.251 12a6.74 6.74 0 0 0 3.366 5.842l.009.005a6.704 6.704 0 0 0 2.18.798l.022.003a6.792 6.792 0 0 0 2.368-.004 6.704 6.704 0 0 0 2.205-.811 6.785 6.785 0 0 0 1.762-1.484l.009-.01.009-.01a6.743 6.743 0 0 0 1.18-2.066c.253-.707.39-1.469.39-2.263a6.74 6.74 0 0 0-.408-2.309Z" clipRule="evenodd" />
//                                                     </svg> */}
//                                                    <svg
//                                                         xmlns="http://www.w3.org/2000/svg"
//                                                         viewBox="0 0 24 24"
//                                                         className="w-8 h-8 text-white"
//                                                         fill="currentColor"
//                                                         >
//                                                         {/* Antenna dot */}
//                                                         <circle cx="12" cy="10" r="1.6" /> 

//                                                         {/* Antenna mast */}
//                                                         <path d="M11 12h2l1.6 8h-5.2L11 12z" />

//                                                         {/* Signal waves */}
//                                                         <path d="M7.8 9.5a5 5 0 0 0 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//                                                         <path d="M5.5 8a8 8 0 0 0 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//                                                         <path d="M16.2 9.5a5 5 0 0 1 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//                                                         <path d="M18.5 8a8 8 0 0 1 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

//                                                             {/* + badge */}
//                                                             <path
//                                                                 d="M20.2 2v4.2M18.2 4.1h4"
//                                                                 stroke="currentColor"
//                                                                 strokeWidth="2"
//                                                                 strokeLinecap="round"
//                                                             />
//                                                         </svg> 


//                                                 </div>
//                                             </CustomTooltip>

//                                             <CustomTooltip text={"Click to go Cell Pro rules"}>
//                                                 <div className='cursor-pointer'
//                                                     onContextMenu={(e) => { handleRightClick(e, valueShower, "moveToCellProrulesWindow") }} onClick={() => {
//                                                     moveToCellProrulesWindow(valueShower, "one")
//                                                 }}>
//                                                     {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
//                                                         <path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
//                                                         <path fillRule="evenodd" d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375V4.125A3.375 3.375 0 0 0 15.375.75h-6.75ZM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0 1 7.5 19.875V4.125Z" clipRule="evenodd" />
//                                                     </svg> */}
                                                     
//                                                     <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     viewBox="0 0 24 24"
//                                                     fill="none"
//                                                     className="w-8 h-8 text-white"
//                                                     >
//                                                     {/* Outlined cell sector (pie) */}
//                                                     <path
//                                                         d="M12 6C8.6 6 5.4 7.5 3 9.9L12 19l9-9.1C18.6 7.5 15.4 6 12 6Z"
//                                                         stroke="currentColor"
//                                                         strokeWidth="2"
//                                                         strokeLinejoin="round"
//                                                     />

//                                                     {/* + icon — right & slightly DOWN, touching pie */}
//                                                     <path
//                                                         d="M20.2 2v4.2M18.2 4.1h4"
//                                                         stroke="currentColor"
//                                                         strokeWidth="2"
//                                                         strokeLinecap="round"
//                                                         fill="currentColor" 
//                                                     />

//                                                     </svg>

//                                                 </div>
//                                             </CustomTooltip>

//                                             <CustomTooltip text={"Click to open chart"}>
//                                                 <div ref={svgRef} className='cursor-pointer' 
//                                                     // onContextMenu={(e) => { handleRightClick(e, valueShower, "moveToChartWindow") }} 
//                                                     // onClick={() => { moveToChartWindow(valueShower, "one")}}
//                                                      onClick={() => handleLeftClick(valueShower)}
//                                                     onContextMenu={(e) =>
//                                                         handleRightClick(e, valueShower, "openCellDashboardInNewTab")
//                                                     }
//                                                 >
//                                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
//                                                         <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z" clipRule="evenodd" />
//                                                         <path fillRule="evenodd" d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z" clipRule="evenodd" />
//                                                     </svg>
//                                                 </div>
//                                             </CustomTooltip>
                                            
//                                             <CustomTooltip text={"Close"}>
//                                                 <div
//                                                     className='cursor-pointer'
//                                                     onClick={() => {
//                                                         setValueShower({})
//                                                         setShowDragger(false)
//                                                     }}>

//                                                     <span className="close-icon">
//                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
//                                                             <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
//                                                         </svg>
//                                                     </span>
//                                                 </div>
//                                             </CustomTooltip>
//                                         </div>
//                                         <div className='cursor-move'>
//                                             <table>
//                                                 <tbody>
//                                                 {
//                                                     Object.entries(valueShower).map((itm) => {
//                                                        const rowKey = itm[0].toLowerCase().replace(/\s/g, '');

//                                                         // {console.log(rowKey, "fsadasdsadas")  }
//                                                         return <tr key={`${rowKey}`} className='border-2 border-black'>
//                                                             <td key={`td-1-${rowKey}`} className='border-2 border-black'>{itm[0]}</td>
//                                                             <td key={`td-2-${rowKey}`} className='border-2 border-black'>{itm[1]}</td>
//                                                         </tr>
//                                                     })
//                                                 }
//                                                 </tbody>
//                                             </table>

//                                         </div>
//                                     </div>
//                                 </Dragger>
//                         </div> : <>

//                         </>}

//                 </div>

//                 {/* <div className='bg-gray-400 absolute bottom-2' >
//                                 <div className='h-6 bg-white'>

//                                     <div className='flex w-full justify-end'>
//                                         <div className='flex '>
//                                         </div>
//                                         <div className='flex '>


//                                             <span>
//                                                 <svg xmlns="http://www.w3.org/2000/svg" onclick="copyToClipboard(event)" width="16" height="16"
//                                                     fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
//                                                     <path
//                                                         d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
//                                                     <path
//                                                         d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
//                                                 </svg>
//                                             </span>
//                                             <span>
//                                                 <svg width="22px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                                     <path d="M21.6702 6.9499C21.0302 4.7799 19.2202 2.9699 17.0502 2.3299C15.4002 1.8499 14.2602 1.8899 13.4702 2.4799C12.5202 3.1899 12.4102 4.4699 12.4102 5.3799V7.8699C12.4102 10.3299 13.5302 11.5799 15.7302 11.5799H18.6002C19.5002 11.5799 20.7902 11.4699 21.5002 10.5199C22.1102 9.7399 22.1602 8.5999 21.6702 6.9499Z" fill="#292D32" />
//                                                     <path opacity="0.4" d="M18.9094 13.3597C18.6494 13.0597 18.2694 12.8897 17.8794 12.8897H14.2994C12.5394 12.8897 11.1094 11.4597 11.1094 9.69966V6.11966C11.1094 5.72966 10.9394 5.34966 10.6394 5.08966C10.3494 4.82966 9.94941 4.70966 9.56941 4.75966C7.21941 5.05966 5.05941 6.34966 3.64941 8.28966C2.22941 10.2397 1.70941 12.6197 2.15941 14.9997C2.80941 18.4397 5.55941 21.1897 9.00941 21.8397C9.55941 21.9497 10.1094 21.9997 10.6594 21.9997C12.4694 21.9997 14.2194 21.4397 15.7094 20.3497C17.6494 18.9397 18.9394 16.7797 19.2394 14.4297C19.2894 14.0397 19.1694 13.6497 18.9094 13.3597Z" fill="#292D32" />
//                                                 </svg>
//                                             </span>
//                                             <span>
//                                                 <div
//                                                     onclick="hideValueShower()">

//                                                     <span className="close-icon">
//                                                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22px" height="18px">
//                                                             <linearGradient id="hbE9Evnj3wAjjA2RX0We2a" x1="7.534" x2="27.557" y1="7.534" y2="27.557" gradientUnits="userSpaceOnUse">
//                                                                 <stop offset="0" stop-color="#f44f5a" />
//                                                                 <stop offset=".443" stop-color="#ee3d4a" /><stop offset="1" stop-color="#e52030" />
//                                                             </linearGradient>
//                                                             <path fill="url(#hbE9Evnj3wAjjA2RX0We2a)" d="M42.42,12.401c0.774-0.774,0.774-2.028,0-2.802L38.401,5.58c-0.774-0.774-2.028-0.774-2.802,0	L24,17.179L12.401,5.58c-0.774-0.774-2.028-0.774-2.802,0L5.58,9.599c-0.774,0.774-0.774,2.028,0,2.802L17.179,24L5.58,35.599	c-0.774,0.774-0.774,2.028,0,2.802l4.019,4.019c0.774,0.774,2.028,0.774,2.802,0L42.42,12.401z" /><linearGradient id="hbE9Evnj3wAjjA2RX0We2b" x1="27.373" x2="40.507" y1="27.373" y2="40.507" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#a8142e" /><stop offset=".179" stop-color="#ba1632" /><stop offset=".243" stop-color="#c21734" /></linearGradient><path fill="url(#hbE9Evnj3wAjjA2RX0We2b)" d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z" /></svg>
//                                                     </span>
//                                                 </div>
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className='p-4 w-96'>
//                                     <table border={1}>
//                                         {
//                                             Object.entries(valueShower).map((itm) => {
//                                                 console.log(itm, "fsadasdsadas")
//                                                 return <tr className='border-2 border-black'>
//                                                     <td className='border-2 border-black'>{itm[0]}</td>
//                                                     <td className='border-2 border-black'>{itm[1]}</td>
//                                                 </tr>
//                                             })
//                                         }
//                                     </table>
//                                 </div>
//                             </div> */}
//                 <div className='flex flex-col relative '>
//                     {/* rotate-90 */}
//                     <div className='flex absolute top-0 right-0 bg-primaryLine h-full'>
//                         <span className='bg-white rounded-full h-6 m-2' onClick={() => setSidebarOpen(prev => !prev)}>
//                             <Unicons.UilArrowLeft size="24" className={"text-black"} />
//                         </span>
//                         {/* <div className='h-10 flex absolute right-0 cursor-pointer align-middle w-16 ml-4' onClick={() => setSidebarOpen(prev => !prev)}>
//                             <i className="fa fa-filter w-10 h-full pt-[4px] pl-2 text-white" aria-hidden="true"></i>
//                             <p className=' text-white'>Filter</p>
//                         </div>
//                         <div className='h-10 flex absolute right-4 cursor-pointer align-middle w-16 ml-4' onClick={() => setSidebarOpen(prev => !prev)}>
//                             <i className="fa fa-filter w-10 h-full pt-[4px] pl-2 text-white" aria-hidden="true"></i>
//                             <p className=' text-white'>Slider</p>
//                         </div>
//                         <div className='h-10 flex absolute right-8 cursor-pointer align-middle w-16 ml-4' onClick={() => setSidebarOpen(prev => !prev)}>
//                             <i className="fa fa-filter w-10 h-full pt-[4px] pl-2 text-white" aria-hidden="true"></i>
//                             <p className=' text-white'>Map View</p>
//                         </div> */}
//                     </div>
//                 </div>
//                 <div className={`absolute h-[100%] right-8 z-[10000] flex flex-row ${sidebarOpen ? "w-[20vw]" : "w-0"}`}>
//                     {/* <div className="w-64">
//                         <input type="range" min="0" max="100" value="50" class="slider w-full bg-blue-500"/>
//                     </div> */}
//                     {/* <input type='text'/> */}
//                     <ComponentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} children={
//                         <MapFilters smap={smap} dataValue={dataValue} setDataValue={setDataValue} map={map} slider={slider} setOneLoad={setOneLoad} setOneCtr={setOneCtr} eLoad={eLoad} SetgOpen={SetgOpen} gopen={gopen} />
//                     }></ComponentSidebar>
//                 </div>
//             </div>

//         <Modal
//             size="full"
//             modalHead="Cell Dashboard"
//             isOpen={isSupersetModalOpen}
//             setIsOpen={setIsSupersetModalOpen}
//             >
//             {/* {supersetUrl && (
//                 <iframe
//                 src={supersetUrl}
//                 title="Superset Dashboard"
//                 className="w-full h-[calc(100vh-3rem)] border-none"
//                 />
//             )} */}

//             {supersetUuid && (
//                 <SupersetDashboard 
//                     dashboardUuid={supersetUuid} 
//                     filterId={supersetFliterId} 
//                     filterValue={filterValue} 
//                 />
//             )}

//             </Modal>

//             <Modal size={"full"} children={<MapChart />} isOpen={modalOpen} setIsOpen={setModalOpen} />
//         </>
//     );
// };

// export default MapBoxView;


import React, { useEffect, useRef, useState } from 'react';
// import ReactMapGL, { Layer, Source } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { useDispatch, useSelector } from 'react-redux';
import MapActions from '../../store/actions/map-actions';
import MapFilters from '../../components/MapComponents/MapFilters';
import ComponentSidebar from '../../components/ComponentSidebar';
import Dragger from '../../components/Dragger';
import * as Unicons from '@iconscout/react-unicons';
import { ALERTS } from '../../store/reducers/component-reducer';
import { useNavigate } from 'react-router-dom';
import { MARKER_CHART_LIST } from '../../store/reducers/map-reducer';
import Modal from '../../components/Modal';
import MapChart from './MapChart';
import AutoSuggestion from '../../components/FormElements/AutoSuggestion';
import { useForm } from 'react-hook-form';
import { Tooltip } from 'recharts';
import CustomTooltip from '../../components/CustomTooltip';
import CommonActions from '../../store/actions/common-actions';
// import state from 'sweetalert/typings/modules/state';
// import Signal from "react-lucide/dist/icons/signal";
import SupersetDashboard from '../SuperSet/SupersetDashboard';

mapboxgl.accessToken =  "pk.eyJ1Ijoic2FyZnJhenJhamEiLCJhIjoiY21sNjkxNzl3MDNydjNocXhwZTY3ZmdzMCJ9.gs-RAIXJTV-TFUvl__vcLg";

const MapBoxView = () => {
    // Calculate the coordinates of the triangle vertices
    const mapContainer = useRef(null);
    const [smap, setMap] = useState(null);
    const [oneLoad, setOneLoad] = useState(true);
    const [MoneLoad, setMOneLoad] = useState(true);
    const [eLoad, seteLoad] = useState([]);
    const [oneCtr, setOneCtr] = useState(0);
    const [lnglng, setLng] = useState(0);
    const [latlat, setLat] = useState(0);
    // const [zoomzoom, setZoom] = useState(0);
    let zoomzoom = 0

    const svgRef = useRef(null);

    const [map, setsMap] = useState(null);
    const [valueShower, setValueShower] = useState({});
    const [ShowDragger, setShowDragger] = useState(false);
    const [mapview, setmapview] = useState('mapbox://styles/mapbox/streets-v11')

    // const [slider, setSlider] = useState(1)

    const navigate = useNavigate()

    // console.log(lnglng, latlat, zoomzoom, "lng,lat,zoomlng,lat,zoom")

    let slider = useSelector((state) => {
        return state?.auth?.commonConfig?.mapScale || 20
    })


    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [dataValue, setDataValue] = useState({});
    const [gopen, SetgOpen] = useState([])
    const [mapSiteList, SetmapSiteList] = useState([])
    const [mapSiteData, SetmapSiteData] = useState([])

    const dispatch = useDispatch()

    const DASHBOARD_UUID = "0ccb9f27-ef5c-47bb-8c86-5126f34bad2f";
    const FILTER_Id = "NATIVE_FILTER-Frwtlbdl8UhCOYVoGiXp9";

    const [supersetUrl, setSupersetUrl] = useState(null); //url method of embedding
    const [isSupersetModalOpen, setIsSupersetModalOpen] = useState(false);

    const [supersetUuid, setSupersetUuid] = useState(null); //sdk method of embedding
    const [supersetFliterId, setsupersetFliterId] = useState(false);
    const [filterValue, setFilterValue] = useState(null);

    // svgRef

    const handleRightClick = (event, data, types) => {
           if (types === "openCellDashboardInNewTab") {
            // const url = buildSupersetCellDashboardUrl(data?.Cell_name);
            // if (url) {
            //     window.open(url, "_blank", "noopener,noreferrer");
            // }
            // const DASHBOARD_UUID = "b5259bc2-8f63-4097-ab6e-5fb3cdece14f";
            // const DASHBOARD_UUID= "0ccb9f27-ef5c-47bb-8c86-5126f34bad2f";
            // window.open(`/Filtered-cell-dashboard/${DASHBOARD_UUID}?cell=${data?.Cell_name}`, "_blank");
            window.open(
            `/Filtered-cell-dashboard/${DASHBOARD_UUID}?cell=${data?.Cell_name}&filterId=${FILTER_Id}`,
            "_blank"
            );
            return;
        }

        if (types == "moveToChartWindow") {
            moveToChartWindow(data, "two")
        }

        if (types == "moveToSiteAnalyticsWindow") {
            moveToSiteAnalyticsWindow(data, "two")
        }

        if (types == "moveToCellAnalyticsWindow") {
            moveToCellAnalyticsWindow(data, "two")
        }

        if (types == "moveToSiteProrulesWindow") {
            moveToSiteProrulesWindow(data, "two")
        }

        if (types == "moveToCellProrulesWindow") {
            moveToCellProrulesWindow(data, "two")
        }

        event.preventDefault();
        // alert("event", "dsadasdasdsa")
    }

    const generateCoordinates = (x, y, Dir, antBW, c_length, s_height) => {
        const newCoordinates = [];

        // Initial coordinate
        newCoordinates.push([x, y]);

        // Calculate and push remaining coordinates
        for (let j = 10; j >= 1; j--) {
            const x1 = x + (Math.sin((Dir - antBW / 2 + (antBW / 10) * j) * 0.01745329252) / (69.093 / c_length) / ((110 - slider) * 100));
            // console.log(`${x}  (Math.sin((${Dir} - ${antBW} / 2 + (${antBW} / 10) * ${j}) * 0.01745329252) / (69.093 / ${c_length}) / 5)`,"sincostan")
            const y1 = y + (Math.cos((Dir - antBW / 2 + (antBW / 10) * j) * 0.01745329252) / (69.093 / c_length) / ((110 - slider) * 100));

            // const x1 = x + (Math.sin((Dir - antBW / 2 + (antBW / 10) * j) * 0.01745329252) / (69.093 / c_length) / 1000);
            // // console.log(`${x}  (Math.sin((${Dir} - ${antBW} / 2 + (${antBW} / 10) * ${j}) * 0.01745329252) / (69.093 / ${c_length}) / 5)`,"sincostan")
            // const y1 = y + (Math.cos((Dir - antBW / 2 + (antBW / 10) * j) * 0.01745329252) / (69.093 / c_length) / 1000);
            newCoordinates.push([x1, y1, s_height]);
        }

        newCoordinates.push([x, y]);
        return newCoordinates;
    };
    // function calculateEndPoint(startPoint, angle, distance) {
    //     var lat1 = startPoint[1] * Math.PI / 180;
    //     var lon1 = startPoint[0] * Math.PI / 180;
    //     var bearing = angle * Math.PI / 180;
    //     var R = 6371; // Earth's radius in km
    //     var lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance / R) + Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearing));
    //     var lon2 = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(distance / R) * Math.cos(lat1), Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2));
    //     lat2 = lat2 * 180 / Math.PI;
    //     lon2 = lon2 * 180 / Math.PI;
    //     return [lon2, lat2];

    // }

    useSelector((state) => {



        // console.log(state?.map?.get_all_filter?.d1.map((iewqw) => {
        //     console.log(iewqw.child.map((wqew) => {
        //         console.log(wqew, "wqewwqewwqewwqewwqewwqew")
        //     }), "iewqwiewqwiewqwiewqw")
        // }), "dasdasdasdasdasda")

        if (state?.map?.get_all_filter?.d1 && MoneLoad) {
            if (state?.auth?.commonConfig?.saveMapFilters) {

                let finewl_ar = Object.entries(JSON.parse(state?.auth?.commonConfig?.saveMapFilters)).map((irewerwe) => {
                    // console.log(irewerwe, "irewerweirewerweirewerwe")

                    return irewerwe[0]
                })

                let innd = 0

                let qiew = []

                state?.map?.get_all_filter?.d1.map((iewqw) => {

                    iewqw.child.map((wqew) => {
                        innd += 1

                        if (finewl_ar.indexOf(wqew.name) != -1) {
                            qiew.push("ind_" + innd.toString())
                        }
                        // console.log(finewl_ar.indexOf(wqew.name), innd, "wqewwqewwqewwqewwqewwqew")
                    })
                })

                SetgOpen(qiew)
                setMOneLoad(false)
                // console.log({ ...JSON.parse(state?.auth?.commonConfig?.saveMapFilters) }, "saveMapFilterssaveMapFilters")
                setDataValue({ ...JSON.parse(state?.auth?.commonConfig?.saveMapFilters) })
                setmapview(state?.auth?.commonConfig?.mapView)
            }
        }

    })

    // console.log(dataValue, "dsadadasdasdsadsadasdas")
    let userLatLong = useSelector((state) => {

        if (state?.auth?.commonConfig?.saveLatLong) {

            let dae = JSON.parse(state?.auth?.commonConfig?.saveLatLong)
            return {
                center: [dae.lng, dae.lat],
                zoom: dae.zoom
            }

        } else {
            return {
                center: [36.817223, -1.286389],
                zoom: 15
            }
        }
        let allmarkerList = state?.auth?.commonConfig?.saveLatLong ? JSON.parse(state?.auth?.commonConfig?.saveLatLong) : {
            center: [36.817223, -1.286389],
            zoom: 15
        }
        return allmarkerList
    })

    let userOldFilters = useSelector((state) => {

        if (state?.auth?.commonConfig?.saveMapFilters) {

            let dae = JSON.parse(state?.auth?.commonConfig?.saveMapFilters)
            return dae

        } else {
            return []
        }
    })

    // console.log(userOldFilters, "userOldFiltersuserOldFiltersuserOldFilters", userLatLong, "userLatLonguserLatLonguserLatLonguserLatLong")


    // let listOfSiteId = useSelector((state) => {

    //     let allmarkerList = state?.map?.markerList?.data || []
    //     return allmarkerList.map((oneVal, index) => {
    //         return {
    //             label: oneVal.Site_Name,
    //             value: index
    //         }
    //     })
    // })

    // let listofallmarkerList = useSelector((state) => {

    //     return state?.map?.markerList?.data
    //     return allmarkerList.map((oneVal, index) => {
    //         return {
    //             label: oneVal.Site_Name,
    //             value: index
    //         }
    //     })
    // })
    let allmarker = useSelector((state) => {
        let allmarkerList = state?.map?.markerList?.data

        if (smap != null && allmarkerList && allmarkerList.length > 0 && oneLoad) {
            // console.log(allmarkerList, "allmarkerListallmarkerList84")

            // const existingSource = smap.getSource('triangles');
            // if (existingSource) {
            //     smap.removeSource('triangles');
            // }

            // const existingLayer = smap.getLayer('triangles-fill');
            // if (existingLayer) {
            //     smap.removeLayer('triangles-fill');
            // }

            let ArraytrianglesGeoJSON = []

            let mapArrList = []
            let mapArrListFilter = []
            allmarkerList.forEach((itm, index) => {
                // Assuming generateCoordinates function returns the coordinates for a triangle
                const coordinates = generateCoordinates(itm.LONGITUDE, itm.LATITUDE, itm.Azimuth, itm.length, itm.length, itm.orderRing);

                if (mapArrListFilter.indexOf(itm.Site_Name) == -1) {
                    mapArrList.push({
                        label: itm.Site_Name,
                        value: index
                    })
                    mapArrListFilter.push(itm.Site_Name)
                }

                ArraytrianglesGeoJSON.push({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [coordinates]
                    },
                    'properties': {
                        'color': itm?.color, // Red
                        // 'markerData': itm, // Attach marker data to properties
                        'markerData': {
                            Cell_name: itm.Cell_name,
                            Site_Name: itm.Site_Name,
                            Technology: itm.Technology,
                            Azimuth: itm.Azimuth,
                            Band: itm.BAND,
                            Latitude: itm.LATITUDE,
                            Longitude: itm.LONGITUDE,
                            Node_name: itm.Node_name,
                            Physical_id: itm.Physical_id,
                            Region: itm.Region,
                        }
                        // 'name': 'nit'
                    }
                });
            });

            // console.log(itm.color,'allcolros')

            const trianglesGeoJSON = {
                'type': 'FeatureCollection',
                'features': ArraytrianglesGeoJSON
            };

            const trianglesSourceExists = smap.getSource('triangles');
            if (!trianglesSourceExists) {


                smap.addSource('triangles', {
                    'type': 'geojson',
                    'data': trianglesGeoJSON
                });

                smap.addLayer({
                    'id': 'triangles-fill',
                    'type': 'line',
                    'source': 'triangles',
                    'layout': {},
                    'paint': {
                        // 'fill-color': "blue",
                        'line-color': ['get', 'color'], // Use the color from the feature properties
                        'line-opacity': 1,
                        'line-width': 5
                    }
                });
            } else {
                // Update the existing source data
                smap.getSource('triangles').setData(trianglesGeoJSON);
            }

            // Handle click events on polygons
            smap.on('click', 'triangles-fill', (e) => {
                const clickedFeature = e.features[0];

                // console.log("dasdasadasdasdsa", clickedFeature.properties.name)
                const jmarkerData = clickedFeature.properties.markerData;

                // Display alert with marker data

                const markerData = 
                    // JSON.parse(jmarkerData)
                     typeof jmarkerData === "string"  //safer option to save from crashing if data is already an object/if mapbox doesn't auto-stringifies the data
                        ? JSON.parse(jmarkerData)
                        : jmarkerData;


                setValueShower(markerData)
                setShowDragger(true)

                // alert(`Cell Name: ${markerData.Cell_name}, Azimuth: ${markerData.Azimuth}`);
            });

            // Change the cursor to a pointer when hovering over the polygons
            smap.on('mouseenter', 'triangles-fill', () => {
                smap.getCanvas().style.cursor = 'pointer';
            });

            // Change it back to the default cursor when it leaves
            smap.on('mouseleave', 'triangles-fill', () => {
                smap.getCanvas().style.cursor = '';
            });

            SetmapSiteList(mapArrList)
            SetmapSiteData(allmarkerList)


            setOneLoad(false)

            // setOneCtr(prev=>prev+1)
        }
    })


//     const moveToChartWindow = (data, from) => {
// // 1️⃣ clear previous chart data
//         dispatch(MARKER_CHART_LIST({ dataAll: {}, reset: true }))
//         console.log(data, "dasdasdasmoveToChartWindow")


//         dispatch(MapActions.getMarkerChart(data, () => {
//             setModalOpen(false)
//         }))
//         if (from == "one") {
//             setModalOpen(true)
//         } else {
//             // navigate("/mapChart")
//             dispatch(CommonActions.setLastName(true, "MAP Chart"))
//             const newWin = window.open("/mapChart?Cell_name=" + data?.Cell_name, "_blank", "noopener,noreferrer")
//             if (newWin) {
//                 newWin.opener = null
//             }

//         }


//     }

const moveToChartWindow = (data, from) => {
  // 1️⃣ clear previous chart data
  dispatch(MARKER_CHART_LIST({ dataAll: {}, reset: true }));

  // 2️⃣ open modal
  setModalOpen(true);

  // 3️⃣ fetch chart data
  dispatch(
    MapActions.getMarkerChart(
      data,   // ⚠️ FULL data object, NOT only Cell_name
      () => {} // no modal close here
    )
  );
};


    const moveToSiteAnalyticsWindow = (data, from) => {
        dispatch(CommonActions.setLastName(true, "Site Analytics"))
        if (from == "one") {
            navigate("/dataplus-analytics-pro/site-analytics?uniqueId=" + data.Physical_id)
        } else {
            const newWin = window.open("/dataplus-analytics-pro/site-analytics?uniqueId=" + data.Physical_id, "_blank", "noopener,noreferrer")
            if (newWin) {
                newWin.opener = null
            }
        }
    }

    const moveToCellAnalyticsWindow = (data, from) => {

        dispatch(CommonActions.setLastName(true, "Cell Analytics"))


        if (from == "one") {
            navigate("/dataplus-analytics-pro/cell-analytics?uniqueId=" + data.Cell_name)
        } else {
            const newWin = window.open("/dataplus-analytics-pro/cell-analytics?uniqueId=" + data.Cell_name, "_blank", "noopener,noreferrer")
            if (newWin) {
                newWin.opener = null
            }
        }
    }

    const moveToSiteProrulesWindow = (data, from) => {
        dispatch(CommonActions.setLastName(true, "Site Pro Rules"))

        if (from == "one") {
            navigate("/dataplus-analytics-pro/site-pro-rules?uniqueId=" + data.Physical_id)
        } else {
            const newWin = window.open("/dataplus-analytics-pro/site-pro-rules?uniqueId=" + data.Physical_id, "_blank", "noopener,noreferrer")
            if (newWin) {
                newWin.opener = null
            }
        }
    }

    const moveToCellProrulesWindow = (data, from) => {

        dispatch(CommonActions.setLastName(true, "Cell Pro Rules"))

        if (from == "one") {
            navigate("/dataplus-analytics-pro/cell-pro-rules?uniqueId=" + data.Cell_name)
        } else {
            const newWin = window.open("/dataplus-analytics-pro/cell-pro-rules?uniqueId=" + data.Cell_name, "_blank", "noopener,noreferrer")
            if (newWin) {
                newWin.opener = null
            }
        }


    }
    const copyToClipboarding = (data) => {

        const finalData = Object.entries(data).map((itm) => {
            // console.log(itm, "fsadasdsadas")
            return `${itm[0]}: ${itm[1]}`
        }).join("; ")

        // console.log(finalData, "finalDatafinalData")


        navigator.clipboard.writeText(finalData)

        let msgdata = {
            show: true,
            icon: 'info',
            buttons: [],
            type: 1,
            text: "Text copied Successfully"
        }
        dispatch(ALERTS(msgdata))

    }



    useEffect(() => {
        let data = {
            lat: 1.2921,
            lng: 36.8219,
            radius: 15,
            dataValue: userOldFilters
        }

        dispatch(MapActions.getTechWithBand())
        dispatch(MapActions.getAllFilterList())
        dispatch(MapActions.getMarkerList(data, () => { }))

        var map = new mapboxgl.Map({
            container: 'map',
            style: mapview,
            center: userLatLong.center,
            zoom: userLatLong.zoom
        });

        map.removeControl(map._controls[0]);

        // alert()


        // Add triangle source and layer
        map.on('load', function () {

            setMap(map)
        });

        map.on('move', () => {
            setLng(map.getCenter().lng);
            setLat(map.getCenter().lat);

            // console.log(zoomzoom != +map.getZoom().toFixed(0), zoomzoom, +map.getZoom().toFixed(0), "zoomzoomzoomzoom")
            if (zoomzoom != +map.getZoom().toFixed(0)) {
                zoomzoom = +map.getZoom().toFixed(0)
                let mappingdata = {
                    zoom: zoomzoom,
                    lat: map.getCenter().lat,
                    lng: map.getCenter().lng
                }
                dispatch(MapActions.saveCurrentMapLatLong({ "saveLatLong": JSON.stringify(mappingdata) }))
            }
        });

        return () => map.remove(); // Clean up on unmount
    }, [oneCtr]);
    // return <div id="map" className='w-full h-full'></div>


    // console.log("dsdadadasdasoneLoadoneLoad", oneCtr, oneLoad)
    // console.log(mapview, "mapviewmapview")
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {

            event.target.blur();
            //     // Call your function here
            //     alert(":ertyui")
        }
    };

    const buildSupersetCellDashboardUrl = (cellName, { standalone = true } = {}) => {
        if (!cellName) return null;

        const BASE = "http://192.168.0.100:8088";
        const DASHBOARD_ID = 11 ;  //URL method will use this ID to fetch the dashboard and render it
        const FILTER_ID = "NATIVE_FILTER-Frwtlbdl8UhCOYVoGiXp9";
        
         // Escape single quotes safely
          const FILTER_Name = cellName.replace(/'/g, "\\'");

          let url =
            `${BASE}/superset/dashboard/${DASHBOARD_ID}/` +
            `?native_filters=(` +
            `${FILTER_ID}:(` +
                `filterState:(value:!('${FILTER_Name}')),` +
                `extraFormData:(filters:!((col:cell_name,op:IN,val:!('${FILTER_Name}'))))` +
            `)` +
            `)`;

          if (standalone) {
                url += "&standalone=2";
         }

        return url;
    };

    // using url method to embed dashboard
    // const handleLeftClick = (data) => {
    //     const url = buildSupersetCellDashboardUrl(data?.Cell_name, {
    //         standalone: true,
    //     });

    //     if (!url) return;

    //     setSupersetUrl(url);
    //     setIsSupersetModalOpen(true);
    // };

    // using SDK method to embed dashboard 
    const handleLeftClick = (data) => {
        // const DASHBOARD_UUID = "b5259bc2-8f63-4097-ab6e-5fb3cdece14f";
        // const DASHBOARD_UUID= "0ccb9f27-ef5c-47bb-8c86-5126f34bad2f";
        // const FILTER_Id = "NATIVE_FILTER-Frwtlbdl8UhCOYVoGiXp9";
        // setsupersetFliterId(FILTER_Id + ":'" + data?.Cell_name + "'");
        setSupersetUuid(DASHBOARD_UUID);
        setsupersetFliterId(FILTER_Id);
        setFilterValue(data?.Cell_name);
        setIsSupersetModalOpen(true);
    };


    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()
    let idSelector = [
        {
            label: "Select Site ID", name: "fr_phy_id", value: "Select", type: "text", datalist: "listData", option: mapSiteList, props: {
                onBlur: (e) => {

                    let getFilteredData = mapSiteData.filter(itewq => itewq.Site_Name === e.target.value)
                    if (getFilteredData.length > 0) {

                        // console.log(getFilteredData[0].LATITUDE,getFilteredData[0].LONGITUDE,"LONGITUDELATITUDEdfghjkl;dsvadhjksal;")
                        const center = [getFilteredData[0].LONGITUDE, getFilteredData[0].LATITUDE];
                        smap.flyTo({ center, zoom: 18 });

                    }
                    // console.log(listofallmarkerList,getFilteredData,"dfghjkl;dsvadhjksal;")
                },
                onKeyDown: handleKeyPress
            }, required: true,
        },
        { label: "Pre Date", name: "fr_pre_date", type: "datetime", formattype: "date", format: "yyyy-MM-dd", formatop: "yyyy-MM-DD", required: true },
        { label: "Post Date", name: "fr_post_date", type: "datetime", formattype: "date", format: "yyyy-MM-dd", formatop: "yyyy-MM-DD", required: true }
    ]
    return (
        <>

            <div className="relative left-0 right-0 top-0 bottom-0 h-[100%] w-full flex flex-row justify-between">

                <div className='absolute top-[10px] left-[10px] z-[999]'>
                    <div className='flex relative sm:w-[380px] w-[260px]'>
                        {/* <label className="block text-sm font-medium text-black whitespace-nowrap dark:text-black  py-2 pl-1 w-48">{idSelector[0]["label"]}</label> */}

                        <div onKeyDown={handleKeyPress} className='w-full' action='#'>
                            <AutoSuggestion itm={idSelector[0]} errors={errors} handleSubmit={handleSubmit} setValue={setValue} getValues={getValues} register={register} />
                        </div>
                        <svg className='absolute bottom-0 right-0' viewBox="0 -0.5 25 25" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5.5 11.9999C5.50034 9.13745 7.52262 6.67387 10.3301 6.11575C13.1376 5.55763 15.9484 7.06041 17.0435 9.70506C18.1386 12.3497 17.2131 15.3997 14.833 16.9897C12.4528 18.5798 9.28087 18.2671 7.257 16.2429C6.13183 15.1175 5.49981 13.5912 5.5 11.9999Z" stroke="#14113c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.5 14.9999L13.268 13.2429C13.7367 12.7781 14.0003 12.1454 14.0003 11.4854C14.0003 10.8253 13.7367 10.1926 13.268 9.72786C12.2894 8.75673 10.7106 8.75673 9.73199 9.72786C9.26328 10.1926 8.99963 10.8253 8.99963 11.4854C8.99963 12.1454 9.26328 12.7781 9.73199 13.2429L11.5 14.9999Z" stroke="#14113c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M15.972 15.9999L19.5 18.9999" stroke="#14113c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </g>
                        </svg>
                    </div>
                </div>



                <div id="map" ref={mapContainer} className='w-full h-full'>

                    {
                        ShowDragger ? <div >
                            <Dragger
                                mapH={smap && smap.getCanvas() && smap.getCanvas().style.height}
                                mapW={smap && smap.getCanvas() && smap.getCanvas().style.width}
                                >
                                    <div className='bg-white w-auto h-auto absolute bottom-2' >
                                        <div className='flex bg-primaryLine h-10 right justify-end items-center'>
                                            <CustomTooltip text={"Click to copy."}>
                                                <div className='cursor-pointer' onClick={() => {copyToClipboarding(valueShower)}}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
                                                        <path fillRule="evenodd" d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 0 1-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0 1 13.5 1.5H15a3 3 0 0 1 2.663 1.618ZM12 4.5A1.5 1.5 0 0 1 13.5 3H15a1.5 1.5 0 0 1 1.5 1.5H12Z" clipRule="evenodd" />
                                                        <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 0 1 9 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0 1 16.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625v-12Z" />
                                                        <path d="M10.5 10.5a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963 5.23 5.23 0 0 0-3.434-1.279h-1.875a.375.375 0 0 1-.375-.375V10.5Z" />
                                                    </svg>
                                                </div>
                                            </CustomTooltip>

                                            <CustomTooltip text={"Click to go Site Analytics"}>
                                                <div className='cursor-pointer' 
                                                    onContextMenu={(e) => { handleRightClick(e, valueShower, "moveToSiteAnalyticsWindow") }} onClick={() => {
                                                    moveToSiteAnalyticsWindow(valueShower, "one")
                                                }}>
                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-6">
                                                        <path 
                                                            fillRule="evenodd" 
                                                            d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z" 
                                                            clipRule="evenodd" 
                                                        />
                                                    </svg> */}

                                                     <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        className="w-8 h-8 text-white"
                                                        fill="currentColor"
                                                        >
                                                        {/* Antenna dot */}
                                                        <circle cx="12" cy="10" r="1.6" /> 

                                                        {/* Antenna mast */}
                                                        <path d="M11 12h2l1.6 8h-5.2L11 12z" /> 

                                                        {/* Signal waves */}
                                                        <path d="M7.8 9.5a5 5 0 0 0 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                        <path d="M5.5 8a8 8 0 0 0 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                        <path d="M16.2 9.5a5 5 0 0 1 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                        <path d="M18.5 8a8 8 0 0 1 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                    </svg> 
                                                    
                                                </div>
                                            </CustomTooltip>

                                            <CustomTooltip text={"Click to go Cell Analytics"}>
                                                <div className='cursor-pointer'
                                                    onContextMenu={(e) => { handleRightClick(e, valueShower, "moveToCellAnalyticsWindow") }} onClick={() => {
                                                    moveToCellAnalyticsWindow(valueShower, "one")
                                                }}>
                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-6">
                                                        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
                                                    </svg> */}
                                                    {/* <Unicons.UisCell size={32} /> */}
                                                   <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    className="w-8 h-8 text-white"
                                                    >
                                                    {/* Outlined signal fan */}
                                                    <path
                                                        d="M12 6C8.6 6 5.4 7.5 3 9.9L12 19l9-9.1C18.6 7.5 15.4 6 12 6Z"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinejoin="round"
                                                    />
                                                    </svg>


                                                </div>
                                            </CustomTooltip>

                                            <CustomTooltip text={"Click to go Site Pro rules"}>
                                                <div className='cursor-pointer' 
                                                    onContextMenu={(e) => { handleRightClick(e, valueShower, "moveToSiteProrulesWindow") }} onClick={() => {
                                                    moveToSiteProrulesWindow(valueShower, "one")
                                                }}>
                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
                                                        <path d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 0 1-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 0 1 6.126 3.537ZM8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 0 1 0 .75l-1.732 3c-.229.397-.76.5-1.067.161A5.23 5.23 0 0 1 6.75 12a5.23 5.23 0 0 1 1.37-3.536ZM10.878 17.13c-.447-.098-.623-.608-.394-1.004l1.733-3.002a.75.75 0 0 1 .65-.375h3.465c.457 0 .81.407.672.842a5.252 5.252 0 0 1-6.126 3.539Z" />
                                                        <path fillRule="evenodd" d="M21 12.75a.75.75 0 1 0 0-1.5h-.783a8.22 8.22 0 0 0-.237-1.357l.734-.267a.75.75 0 1 0-.513-1.41l-.735.268a8.24 8.24 0 0 0-.689-1.192l.6-.503a.75.75 0 1 0-.964-1.149l-.6.504a8.3 8.3 0 0 0-1.054-.885l.391-.678a.75.75 0 1 0-1.299-.75l-.39.676a8.188 8.188 0 0 0-1.295-.47l.136-.77a.75.75 0 0 0-1.477-.26l-.136.77a8.36 8.36 0 0 0-1.377 0l-.136-.77a.75.75 0 1 0-1.477.26l.136.77c-.448.121-.88.28-1.294.47l-.39-.676a.75.75 0 0 0-1.3.75l.392.678a8.29 8.29 0 0 0-1.054.885l-.6-.504a.75.75 0 1 0-.965 1.149l.6.503a8.243 8.243 0 0 0-.689 1.192L3.8 8.216a.75.75 0 1 0-.513 1.41l.735.267a8.222 8.222 0 0 0-.238 1.356h-.783a.75.75 0 0 0 0 1.5h.783c.042.464.122.917.238 1.356l-.735.268a.75.75 0 0 0 .513 1.41l.735-.268c.197.417.428.816.69 1.191l-.6.504a.75.75 0 0 0 .963 1.15l.601-.505c.326.323.679.62 1.054.885l-.392.68a.75.75 0 0 0 1.3.75l.39-.679c.414.192.847.35 1.294.471l-.136.77a.75.75 0 0 0 1.477.261l.137-.772a8.332 8.332 0 0 0 1.376 0l.136.772a.75.75 0 1 0 1.477-.26l-.136-.771a8.19 8.19 0 0 0 1.294-.47l.391.677a.75.75 0 0 0 1.3-.75l-.393-.679a8.29 8.29 0 0 0 1.054-.885l.601.504a.75.75 0 0 0 .964-1.15l-.6-.503c.261-.375.492-.774.69-1.191l.735.267a.75.75 0 1 0 .512-1.41l-.734-.267c.115-.439.195-.892.237-1.356h.784Zm-2.657-3.06a6.744 6.744 0 0 0-1.19-2.053 6.784 6.784 0 0 0-1.82-1.51A6.705 6.705 0 0 0 12 5.25a6.8 6.8 0 0 0-1.225.11 6.7 6.7 0 0 0-2.15.793 6.784 6.784 0 0 0-2.952 3.489.76.76 0 0 1-.036.098A6.74 6.74 0 0 0 5.251 12a6.74 6.74 0 0 0 3.366 5.842l.009.005a6.704 6.704 0 0 0 2.18.798l.022.003a6.792 6.792 0 0 0 2.368-.004 6.704 6.704 0 0 0 2.205-.811 6.785 6.785 0 0 0 1.762-1.484l.009-.01.009-.01a6.743 6.743 0 0 0 1.18-2.066c.253-.707.39-1.469.39-2.263a6.74 6.74 0 0 0-.408-2.309Z" clipRule="evenodd" />
                                                    </svg> */}
                                                   <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        className="w-8 h-8 text-white"
                                                        fill="currentColor"
                                                        >
                                                        {/* Antenna dot */}
                                                        <circle cx="12" cy="10" r="1.6" /> 

                                                        {/* Antenna mast */}
                                                        <path d="M11 12h2l1.6 8h-5.2L11 12z" />

                                                        {/* Signal waves */}
                                                        <path d="M7.8 9.5a5 5 0 0 0 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                        <path d="M5.5 8a8 8 0 0 0 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                        <path d="M16.2 9.5a5 5 0 0 1 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                        <path d="M18.5 8a8 8 0 0 1 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

                                                            {/* + badge */}
                                                            <path
                                                                d="M20.2 2v4.2M18.2 4.1h4"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                            />
                                                        </svg> 


                                                </div>
                                            </CustomTooltip>

                                            <CustomTooltip text={"Click to go Cell Pro rules"}>
                                                <div className='cursor-pointer'
                                                    onContextMenu={(e) => { handleRightClick(e, valueShower, "moveToCellProrulesWindow") }} onClick={() => {
                                                    moveToCellProrulesWindow(valueShower, "one")
                                                }}>
                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
                                                        <path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
                                                        <path fillRule="evenodd" d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375V4.125A3.375 3.375 0 0 0 15.375.75h-6.75ZM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0 1 7.5 19.875V4.125Z" clipRule="evenodd" />
                                                    </svg> */}
                                                     
                                                    <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    className="w-8 h-8 text-white"
                                                    >
                                                    {/* Outlined cell sector (pie) */}
                                                    <path
                                                        d="M12 6C8.6 6 5.4 7.5 3 9.9L12 19l9-9.1C18.6 7.5 15.4 6 12 6Z"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinejoin="round"
                                                    />

                                                    {/* + icon — right & slightly DOWN, touching pie */}
                                                    <path
                                                        d="M20.2 2v4.2M18.2 4.1h4"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        fill="currentColor" 
                                                    />

                                                    </svg>

                                                </div>
                                            </CustomTooltip>

                                            <CustomTooltip text={"Click to open chart"}>
                                                <div ref={svgRef} className='cursor-pointer' 
                                                    // onContextMenu={(e) => { handleRightClick(e, valueShower, "moveToChartWindow") }} 
                                                    // onClick={() => { moveToChartWindow(valueShower, "one")}}
                                                     onClick={() => handleLeftClick(valueShower)}
                                                    onContextMenu={(e) =>
                                                        handleRightClick(e, valueShower, "openCellDashboardInNewTab")
                                                    }
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
                                                        <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z" clipRule="evenodd" />
                                                        <path fillRule="evenodd" d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </CustomTooltip>
                                            
                                            <CustomTooltip text={"Close"}>
                                                <div
                                                    className='cursor-pointer'
                                                    onClick={() => {
                                                        setValueShower({})
                                                        setShowDragger(false)
                                                    }}>

                                                    <span className="close-icon">
                                                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
                                                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </CustomTooltip>
                                        </div>
                                        <div className='cursor-move' data-drag-handle title="Drag to move">
                                            <table>
                                                <tbody>
                                                {
                                                    Object.entries(valueShower).map((itm) => {
                                                       const rowKey = itm[0].toLowerCase().replace(/\s/g, '');

                                                        // {console.log(rowKey, "fsadasdsadas")  }
                                                        return <tr key={`${rowKey}`} className='border-2 border-black'>
                                                            <td key={`td-1-${rowKey}`} className='border-2 border-black'>{itm[0]}</td>
                                                            <td key={`td-2-${rowKey}`} className='border-2 border-black'>{itm[1]}</td>
                                                        </tr>
                                                    })
                                                }
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                </Dragger>
                        </div> : <>

                        </>}

                </div>

                {/* <div className='bg-gray-400 absolute bottom-2' >
                                <div className='h-6 bg-white'>

                                    <div className='flex w-full justify-end'>
                                        <div className='flex '>
                                        </div>
                                        <div className='flex '>


                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" onclick="copyToClipboard(event)" width="16" height="16"
                                                    fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                                                    <path
                                                        d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                                                    <path
                                                        d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                                                </svg>
                                            </span>
                                            <span>
                                                <svg width="22px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M21.6702 6.9499C21.0302 4.7799 19.2202 2.9699 17.0502 2.3299C15.4002 1.8499 14.2602 1.8899 13.4702 2.4799C12.5202 3.1899 12.4102 4.4699 12.4102 5.3799V7.8699C12.4102 10.3299 13.5302 11.5799 15.7302 11.5799H18.6002C19.5002 11.5799 20.7902 11.4699 21.5002 10.5199C22.1102 9.7399 22.1602 8.5999 21.6702 6.9499Z" fill="#292D32" />
                                                    <path opacity="0.4" d="M18.9094 13.3597C18.6494 13.0597 18.2694 12.8897 17.8794 12.8897H14.2994C12.5394 12.8897 11.1094 11.4597 11.1094 9.69966V6.11966C11.1094 5.72966 10.9394 5.34966 10.6394 5.08966C10.3494 4.82966 9.94941 4.70966 9.56941 4.75966C7.21941 5.05966 5.05941 6.34966 3.64941 8.28966C2.22941 10.2397 1.70941 12.6197 2.15941 14.9997C2.80941 18.4397 5.55941 21.1897 9.00941 21.8397C9.55941 21.9497 10.1094 21.9997 10.6594 21.9997C12.4694 21.9997 14.2194 21.4397 15.7094 20.3497C17.6494 18.9397 18.9394 16.7797 19.2394 14.4297C19.2894 14.0397 19.1694 13.6497 18.9094 13.3597Z" fill="#292D32" />
                                                </svg>
                                            </span>
                                            <span>
                                                <div
                                                    onclick="hideValueShower()">

                                                    <span class="close-icon">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22px" height="18px">
                                                            <linearGradient id="hbE9Evnj3wAjjA2RX0We2a" x1="7.534" x2="27.557" y1="7.534" y2="27.557" gradientUnits="userSpaceOnUse">
                                                                <stop offset="0" stop-color="#f44f5a" />
                                                                <stop offset=".443" stop-color="#ee3d4a" /><stop offset="1" stop-color="#e52030" />
                                                            </linearGradient>
                                                            <path fill="url(#hbE9Evnj3wAjjA2RX0We2a)" d="M42.42,12.401c0.774-0.774,0.774-2.028,0-2.802L38.401,5.58c-0.774-0.774-2.028-0.774-2.802,0	L24,17.179L12.401,5.58c-0.774-0.774-2.028-0.774-2.802,0L5.58,9.599c-0.774,0.774-0.774,2.028,0,2.802L17.179,24L5.58,35.599	c-0.774,0.774-0.774,2.028,0,2.802l4.019,4.019c0.774,0.774,2.028,0.774,2.802,0L42.42,12.401z" /><linearGradient id="hbE9Evnj3wAjjA2RX0We2b" x1="27.373" x2="40.507" y1="27.373" y2="40.507" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#a8142e" /><stop offset=".179" stop-color="#ba1632" /><stop offset=".243" stop-color="#c21734" /></linearGradient><path fill="url(#hbE9Evnj3wAjjA2RX0We2b)" d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z" /></svg>
                                                    </span>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-4 w-96'>
                                    <table border={1}>
                                        {
                                            Object.entries(valueShower).map((itm) => {
                                                return <tr className='border-2 border-black'>
                                                    <td className='border-2 border-black'>{itm[0]}</td>
                                                    <td className='border-2 border-black'>{itm[1]}</td>
                                                </tr>
                                            })
                                        }
                                    </table>
                                </div>
                            </div> */}
                <div className='flex flex-col relative '>
                    {/* rotate-90 */}
                    <div className='flex absolute top-0 right-0 bg-primaryLine h-full'>
                        <span className='bg-white rounded-full h-6 m-2' onClick={() => setSidebarOpen(prev => !prev)}>
                            <Unicons.UilArrowLeft size="24" class={"text-black"} />
                        </span>
                        {/* <div className='h-10 flex absolute right-0 cursor-pointer align-middle w-16 ml-4' onClick={() => setSidebarOpen(prev => !prev)}>
                            <i className="fa fa-filter w-10 h-full pt-[4px] pl-2 text-white" aria-hidden="true"></i>
                            <p className=' text-white'>Filter</p>
                        </div>
                        <div className='h-10 flex absolute right-4 cursor-pointer align-middle w-16 ml-4' onClick={() => setSidebarOpen(prev => !prev)}>
                            <i className="fa fa-filter w-10 h-full pt-[4px] pl-2 text-white" aria-hidden="true"></i>
                            <p className=' text-white'>Slider</p>
                        </div>
                        <div className='h-10 flex absolute right-8 cursor-pointer align-middle w-16 ml-4' onClick={() => setSidebarOpen(prev => !prev)}>
                            <i className="fa fa-filter w-10 h-full pt-[4px] pl-2 text-white" aria-hidden="true"></i>
                            <p className=' text-white'>Map View</p>
                        </div> */}
                    </div>
                </div>
                <div className={`absolute h-[100%] right-8 z-[10000] flex flex-row ${sidebarOpen ? "w-[20vw]" : "w-0"}`}>
                    {/* <div class="w-64">
                        <input type="range" min="0" max="100" value="50" class="slider w-full bg-blue-500"/>
                    </div> */}
                    {/* <input type='text'/> */}
                    <ComponentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} children={
                        <MapFilters smap={smap} dataValue={dataValue} setDataValue={setDataValue} map={map} slider={slider} setOneLoad={setOneLoad} setOneCtr={setOneCtr} eLoad={eLoad} SetgOpen={SetgOpen} gopen={gopen} />
                    }></ComponentSidebar>
                </div>
            </div>

        {/* NEW code to show chart data on "click to open chart" button(right click and left click) */}
        <Modal
            size="full"
            modalHead="Cell Dashboard"
            isOpen={isSupersetModalOpen}
            setIsOpen={setIsSupersetModalOpen}
            >
            {/* {supersetUrl && (
                <iframe
                src={supersetUrl}
                title="Superset Dashboard"
                className="w-full h-[calc(100vh-3rem)] border-none"
                />
            )} */}

            {supersetUuid && (
                <SupersetDashboard 
                    dashboardUuid={supersetUuid} 
                    filterId={supersetFliterId} 
                    filterValue={filterValue} 
                />
            )}

            </Modal>

            {/* old code to show chart data on "click to open chart" button */}
            <Modal size={"full"} children={<MapChart />} isOpen={modalOpen} setIsOpen={setModalOpen} />
        </>
    );
};

export default MapBoxView;
