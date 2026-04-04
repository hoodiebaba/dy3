import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import L from 'leaflet';
// import * as L from "leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import 'leaflet-routing-machine';
import MapActions from '../../store/actions/map-actions';
import pin from '../../assets/pin.png';
import CommonForm from '../CommonForm';
import { useForm } from 'react-hook-form';
import MovableDiv from '../MovableDiv';
import ComponentSidebar from '../ComponentSidebar.jsx'
import '@fortawesome/fontawesome-free/css/all.css';
import MapFilters from './MapFilters.jsx';
// import { useDispatch, useSelector } from 'react-redux';
// imp ort MapActions from '../../store/actions/map-actions';
// 

// import './Map.css';

const LeafletMap = () => {

    const dispatch = useDispatch()
    const [map, setMap] = useState(null);
    const [change, setchange] = useState(true);
    const [markers, setMarkers] = useState([]);
    const [ValueShower, setValueShower] = useState("");
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dataValue, setDataValue] = useState([]);

    

    // const [dropdownOptions, setDropdownOptions] = useState([]);


    let techWithBandList = useSelector((state) => {
        // console.log(state, "state state")
        let interdata = state?.map?.tech_with_band
        return interdata
    })


    // console.log(dataValue,'topdatavalue')

    const createMarkerElement = (data,index) => {
        // console.log(data, "datadatadatadata");
        const markerDiv = document.createElement('div');


        if (data.length > 0) {
            let dataNew = "";
            const azimuth = parseFloat(data[0].Azimuth) || 0;
            
            let allmarkstr = data.map((itm, index) => {
                // console.log(itm, "itm.Azimuth");
                // console.log(index,'siteid')
                return `<div class="inner" onclick=setValueShower('${JSON.stringify(itm)}') style="z-index:${itm.orderRing};height:${itm.length}px;width:${itm.length}px;background-color:${itm.color};-webkit-transform: rotateZ(${itm.Azimuth}deg)"></div>`;
            }).join("");
           
            const cellNames = data.map((itm) => itm.Cell_name).join(", ")
            
            // console.log(data, 'allcells')
            
            dataNew = `
            
            <div style="margin: 5px;transform:rotate(180deg);">
            
            
                <div style="display: flex;justify-content: center;">
                    ${allmarkstr}   
                </div>
                </div>`;
            
            markerDiv.innerHTML = dataNew;
        }
         else {
            markerDiv.innerHTML = '<i class="fa fa-map-marker-alt"></i>';
        }

        return markerDiv
        return `<div class="length-info" style="text-align: center;margin-left: 400%; font-weight: bold; color: blue;"><h1 style="z-index: 100;margin-left: -40px;background-color:#f00;"> ${data[0]['Node_Name']}</h1></div> ${markerDiv}`;
    };


    let allmarker = useSelector((state) => {
        // console.log(state, map, change, "mapInstance state state")


        if (map != null && state?.map?.markerList?.data) {

            map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });

            let allmarkerList = state?.map?.markerList?.data
            let allmarkertype = state?.map?.markerList?.type
            // console.log(Object.keys(allmarkerList), "allmarkerallmarkerallmarker")
            let listmarker = Object.keys(allmarkerList)

            listmarker.map((itm) => {
                // console.log(allmarkerList[itm], itm, "itmitmitmitm")

                let data = allmarkerList[itm]
                // console.log(allmarkertype, "allmarkertypeallmarkertype")
                if (allmarkertype == "U") {
                    const markerElement = createMarkerElement(data);
                    const marker = L.marker(itm.split("_"), {
                        icon: L.divIcon({ html: markerElement.outerHTML }),
                    }).addTo(map);

                    // L.circle([itm.split("_")], 10).addTo(map);
                } else {
                    // console.log("called...")
                    // const markerElement = createMarkerElement(data);

                    // const customIcon = L.icon({
                    //     iconUrl: pin,
                    //     iconSize: [32, 32],
                    //     iconAnchor: [16, 32],
                    //     popupAnchor: [0, -32],
                    // });

                    // const marker = L.marker(itm.split("_"), {
                    //     icon: customIcon,
                    //     iconCreateFunction: function (oldIcon, newLatLng, options) {
                    //         const icon = customIcon.createIcon();
                    //         const imageElement = icon.querySelector('img');

                    //         imageElement.addEventListener('error', function () {
                    //             alert('Failed to load custom icon: ./pin.png');
                    //         });

                    //         return icon;
                    //     },
                    // }).addTo(map);

                    const circleMarker = L.circleMarker(itm.split("_"), {
                        radius: 1, // Adjust the radius of the circle marker as needed
                        fillColor: 'red', // Set the fill color of the circle marker
                        color: 'red', // Set the border color of the circle marker
                        weight: 1, // Set the border weight of the circle marker
                        opacity: 1, // Set the opacity of the circle marker
                        fillOpacity: 1, // Set the fill opacity of the circle marker
                    }).addTo(map);


                }

            })

        }
        return state?.map?.markerList
    })


    const fetchMarkerData = async () => {
        let data = {
            ...map.getCenter(),
            radius: map.getZoom()
        }
        dispatch(MapActions.getMarkerList(data, () => { }))

    };


    useEffect(() => {


        // console.log(map, "useEffect mapInstance")

        // console.log("map calledingfsdfsss,",dataValue,"datavalue")
        // dispatch(MapActions.getTechWithBand())
        if (!map) {

            // alert("if")  
            let mapInstance = L.map('map').setView([-0.7514060139656067, 34.97570037841797], 12)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',

            }).addTo(mapInstance);




            // mapInstance.on('zoomend', () => {
            //     // console.log('apiheat', mapInstance.getCenter(), mapInstance.getZoom());
            //     const data = {
            //         ...mapInstance.getCenter(),
            //         radius: mapInstance.getZoom(),
            //         dataValue:dataValue
            //     }

            //     if(mapInstance.getZoom()==13){

            //         dispatch(MapActions.getMarkerList(data, () => { }))
            //         setchange(prev => !prev)

            //     }
            // });

            // mapInstance.on('dragend', () => {
            //     // console.log('apiheat', mapInstance.getCenter(), mapInstance.getZoom());
            //     let data = {
            //         ...mapInstance.getCenter(),
            //         radius: mapInstance.getZoom(),
            //         dataValue:dataValue
            //     }


            //     dispatch(MapActions.getMarkerList(data, () => { }))
            //     setchange(prev => !prev)
            // });
            setMap(mapInstance)
            
            // alert("hello")
            let data = {
                ...mapInstance.getCenter(),
                radius: mapInstance.getZoom(),
                dataValue:dataValue
            }
            dispatch(MapActions.getMarkerList(data, () => { }))
        }else{
            // alert("else")


            // console.log(map,map,"calwerrererererererererererere")

            // map.off('zoomend', ()=>{
            //     console.log(map,map,"calwerrererererererererererere")
            // });
            map.on('zoomend', () => {
                // console.log('apiheat', mapInstance.getCenter(), mapInstance.getZoom());
                const data = {
                    ...map.getCenter(),
                    radius: map.getZoom(),
                    dataValue:dataValue
                }
                dispatch(MapActions.getMarkerList(data, () => { }))
                setchange(prev => !prev)
            });

            // alert("zoomoff")

            
            map.on('dragend', () => {
                // console.log('apiheat', mapInstance.getCenter(), mapInstance.getZoom());
                let data = {
                    ...map.getCenter(),
                    radius: map.getZoom(),
                    dataValue:dataValue
                }


                dispatch(MapActions.getMarkerList(data, () => { }))
                setchange(prev => !prev)
            });
        }




        return () => {
            // Clean up code if needed
        };
    }, [dataValue]);

    // console.log(ValueShower, "ValueShowerValueShowerValueShower")

    const generatePopupContent = (data) => {
        let popupContent = '<div class="custom-popup-content" style="height:200px; width: fix; overflow: scroll;">';
        popupContent += '<table style="border-collapse: collapse; width: 100%;">';
        popupContent += '<tr style="border-bottom: 1px solid #ddd;"><th style="border: 1px solid #ddd; padding: 8px;">Cell Name</th><th style="border: 1px solid #ddd; padding: 8px;">Band</th><th style="border: 1px solid #ddd; padding: 8px;">Azimuth</th></tr>';

        data.forEach((item) => {
            popupContent += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="border: 1px solid #ddd; padding: 8px; ">${item.Cell_name}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.BAND}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.Azimuth}</td>
        </tr>
      `;
        });

        popupContent += '</table>';
        popupContent += '</div>';
        return popupContent;
    };

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()

    // console.log(techWithBandList, 'dataatat')
    // console.log(techWithBandList['2G'], '2G options');


    ;
    return (

        <div class="relative left-0 right-0 top-0 bottom-0 h-full w-full flex flex-row justify-between">
            <div id="map" className={`h-full ${sidebarOpen ? "w-[96%]" : "w-[96%]"}`}></div>
            <div className='rotate-90 mt-4 h-10 flex absolute right-0 cursor-pointer align-middle w-[4vw]' onClick={() => setSidebarOpen(prev => !prev)}>
                <i className="fa fa-filter w-10 h-10 pt-[3px]" aria-hidden="true" ></i>

                <p className='ml-3'>Filter</p>
            </div>
            <div className='rotate-90 mt-4 h-10 flex absolute right-0 cursor-pointer align-middle w-[4vw]' onClick={() => setSidebarOpen(prev => !prev)}>
                <i className="fa fa-filter w-10 h-10 pt-[3px]" aria-hidden="true" ></i>

                <p className='ml-3'>Range</p>
            </div>
            <div className={`absolute h-[90vh] right-8 z-[10000] flex flex-row ${sidebarOpen ? "w-[20vw]" : "w-0"}`}>
                <ComponentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} children={<MapFilters dataValue={dataValue} setDataValue={setDataValue} map={map}/>}>
                </ComponentSidebar>
            </div>

        </div>
    );
};

export default LeafletMap;

