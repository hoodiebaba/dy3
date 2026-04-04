import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import ReactDOMServer from 'react-dom/server';
import L, { Point, DivIcon } from 'leaflet'
import "../src/App.css"

import Modal from "../src/Modal"

const CustomMarker = ({ itm }) => {
    const [isPopupVisible, setPopupVisible] = useState(false);

    const handleMarkerClick = () => {
        setPopupVisible(!isPopupVisible);
    };

    const handleSelect = (e) => {
        e.stopPropagation()
        console.log("called",e)
        // console.log("e.currentTarget.id",e.currentTarget)
    }

    console.log(itm,"itmitmitmitm")

//     html: `<div style="margin: 5px;transform:rotate(180deg);">

//     <div style="position: relative;position: relative;display: flex;justify-content: center;align-items: center; ">
//       <div style="position: absolute;" class="mark" >
//                 <div class="inneragain" style="z-index:${itm.orderRing};height:${itm.length * 2}px;width:${itm.length * 2}px;-webkit-transform: rotateZ(${itm.Azimuth}deg)">
//                     <div class="inner" style="height:${itm.length}px;width:${itm.length}px;background-color:${itm.color}"></div>
//                 </div>
//             </div>
//     </div>

//     <script>
//         function hello() {
//             console.log("asdfghjk")
//         }
//     </script>
// </div>`
    const icon = L.divIcon({
        className: 'inner',
        attribution: `<div></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        html: ""
    });


    React.useEffect(() => {

        setTimeout(() => {
            console.log("searching for element")
            const eleRefs = document.getElementsByClassName("mark")
            console.log("eleRefs => ",eleRefs)
            if (Array.isArray(Array.from(eleRefs))) {
                Array.from(eleRefs)?.forEach((el) => {
                    console.log("element => ", el)
                    if(el){
                        el.addEventListener("click",handleSelect)
                    }
                })
            }
            else {
                console.log("no element")
            }

        }, 4000);

    }, [])

    return (
        <Marker position={[itm.LATITUDE, itm.LONGITUDE]} icon={icon}>
            {isPopupVisible && (
                <Modal>
                    <div className="popup">
                        <h3>Popup Content</h3>
                        {/* Additional content */}
                    </div>
                </Modal>
            )}
        </Marker>
    );
};

export default CustomMarker

// const CustomMarkerInter = ({ itm, isPopupVisible, setPopupVisible }) => {


//     const toggleVisibility = () => {
//         console.log("dasdsads")
//         setPopupVisible(!isPopupVisible);
//     };
//     // return <div
//     //     className="custom-marker-inter"
//     //     ref={(el) => {

//     //         if (el) {
//     //             el.addEventListener("click", toggleVisibility);
//     //         }
//     //     }}
//     //     style={{ margin: "5px", transform: "rotate(180deg)" }}
//     // >
//     //     {/* Your existing content */}
//     // </div>
//     return <div style={{ margin: "5px", transform: "rotate(180deg)" }} >

//         <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
//             <div style={{ position: "absolute" }}>
//                 <div class="inneragain" ref={(el) => {

//                     console.log("elll")
//                     if (el) {
//                         el.addEventListener("click", toggleVisibility);
//                     }
//                 }} style={{ zIndex: itm.orderRing, height: `${itm.length * 2}px`, width: `${itm.length * 2}px`, "-webkit-transform": `rotateZ(${itm.Azimuth}deg)` }}>
//                     <div class="inner" style={{ height: `${itm.length}px`, width: `${itm.length}px`, backgroundColor: `${itm.color}` }}></div>
//                 </div>
//             </div>
//         </div>
//     </div>
// }
// const CustomMarker = ({ itm }) => {

//     const [isPopupVisible, setPopupVisible] = useState(false);
//     console.log(isPopupVisible, "isPopupVisible")

//     const icon = L.divIcon({
//         className: 'custom-icon',
//         html: ReactDOMServer.renderToString(<CustomMarkerInter itm={itm} setPopupVisible={setPopupVisible} isPopupVisible={isPopupVisible} />)
//     });
//     return (

//         <Marker position={[itm.LATITUDE, itm.LONGITUDE]} icon={icon}>
//             {/* <Popup>
//                 {itm.LATITUDE}
//                 {itm.LONGITUDE}
//                 {itm.Azimuth}
//             </Popup> */}

//             {isPopupVisible && (
//                 <Modal>
//                     <div className="popup">
//                         <h3>Popup Content</h3>
//                         {/* Add additional content here */}
//                     </div>
//                 </Modal>
//             )}
//         </Marker>
//     );
// };

// export default CustomMarker;
