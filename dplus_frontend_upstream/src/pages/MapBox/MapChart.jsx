// import React, { useEffect } from 'react';
// import LineChart from '../../components/Charts/LineChart';
// import LiningChart from '../../components/Charts/LineChart';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import MapActions from '../../store/actions/map-actions';
// // import Table from '../../components/Table';
// // import DPAOneRow from '../../components/DPAOneRow';
// // import nokiaPrePostActions from '../../store/actions/nokiaPrePost-actions';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { useForm } from 'react-hook-form';
// // import AutoSuggestion from '../../components/FormElements/AutoSuggestion';
// // import SelectDropDown from '../../components/FormElements/SelectDropDown';
// // import DatePicking from '../../components/FormElements/DatePicking';
// // import WebsocketActions from '../../store/actions/websocket-actions';
// // import { WebSocketUrls } from '../../utils/url';
// // import SiteAnalyticsCard from '../../components/SiteAnalyticsCard';
// // import { cn } from '../../utils/common';

// import { useLocation } from "react-router-dom";  // correction here


// const MapChart = () => {

//     const dispatch = useDispatch()

//     const queryParameters = new URLSearchParams(window.location.search)
//     // const Cell_name = queryParameters.get("Cell_name")
//     const location = useLocation(); // correction here
//     const Cell_name = location.state?.Cell_name || queryParameters.get("Cell_name"); // correction here

//     console.log(Cell_name, "Cell_nameCell_nameCell_name")

//     const navigate = useNavigate()

//     // const {
//     //     register,
//     //     handleSubmit,
//     //     watch,
//     //     reset,
//     //     setValue,
//     //     getValues,
//     //     formState: { errors },
//     // } = useForm()

//     // let AllDataShowing = useSelector((state) => {
//     //     return state?.nokiaPrePost?.networkAnalyticsPro
//     // })



//     // let DataSorter = useSelector((state) => {
//     //     return state?.nokiaPrePost?.networkAnalyticsProSorter
//     // })


//     let marketChartList = useSelector((state) => {
//         return state?.map?.markerChartList
//     })


//     console.log(marketChartList, "marketChartList")

//     const goToMap = () => {
//         navigate("/map-box/carrier-layer")
//     }


//     let colorList = [
//         "#ff0000",
//         "#00ff00",
//         "#0000ff",
//         "#ff00ff",
//         "#40E0D0",
//         "#FF7F50",
//         "#008080",
//         "#000080",
//         "#ff00ff",
//         "#00ffff",
//         "#0000ff",
//         "#00ff00",
//         "#ff0000",
//     ]


//     // let common_socket = useSelector((state) => {
//     //     return state?.websocket?.socket_setup
//     // })


//     // let dataCols = {
//     //     "5G PM KPI Check": ["KPI", "Pre", "Post", "Delta"],
//     //     "4G PM KPI Check": ["KPI", "Pre", "Post", "Delta"],
//     //     "3G PM KPI Check": ["KPI", "Pre", "Post", "Delta"],
//     //     "2G PM KPI Check": ["KPI", "Pre", "Post", "Delta"],
//     //     "5G PCI Check": ["Site ID", "Issue", "<1 KM", "1-5 KM", ">5KM"],
//     //     "4G PCI Check": ["Site ID", "Issue", "<1 KM", "1-5 KM", ">5KM"],
//     //     "3G PSC Check": ["Site ID", "Issue", "<1 KM", "1-5 KM", ">5KM"],
//     //     "2G BCCH Check": ["Site ID", "Issue", "<1 KM", "1-5 KM", ">5KM"]
//     // }







//     // for (let key in AllDataShowing) {

//     //     // console.log(key, AllDataShowing[key], "keykeykeykey")

//     //     let dataInner = AllDataShowing[key]
//     //     // for (let innerkey in dataInner) {
//     //     //     console.log(innerkey, dataInner[innerkey], "keykeykeykey")
//     //     // }
//     //     // if (AllDataShowing.hasOwnProperty(key)) {
//     //     //     console.log(`${key}: ${AllDataShowing[key]}`,"AllDataShowing");
//     //     // }
//     // }


//     // useEffect(() => {
//     //     if (Cell_name) {
//     //         let data={
//     //             "Cell_name":Cell_name
//     //         }
//     //         dispatch(MapActions.getMarkerChart(data, () => {
//     //             setModalOpen(false)
//     //         }))
//     //     }
//     //     // dispatch(nokiaPrePostActions.getnetworkanalyticspro())
//     // }, [])

//     useEffect(() => {
//   console.log("Cell_name from URL:", Cell_name);

//   if (!Cell_name) {
//     console.warn("No Cell_name found in URL");
//     return;
//   }

//   const data = { Cell_name };

//   console.log("Dispatching API with:", data);

//   dispatch(
//     MapActions.getMarkerChart(data, () => {
//       console.log("getMarkerChart callback fired");
//     })
//   );

// }, [Cell_name]);

// useEffect(() => {
//   console.log("Redux markerChartList UPDATED:", marketChartList);
// }, [marketChartList]);



//     // let idSelector = [
//     //     { label: "Select Site ID", name: "frequency", value: "Select", type: "text", option: [{ "label": "Hourly", "value": "Hourly" }, { "label": "Daily", "value": "Daily" }], props: "", required: true, },
//     //     { label: "Pre Date", name: "startAt", type: "datetime", formattype: "date", format: "yyyy-MM-dd", formatop: "yyyy-MM-DD", required: true },
//     //     { label: "Post Date", name: "startAt", type: "datetime", formattype: "date", format: "yyyy-MM-dd", formatop: "yyyy-MM-DD", required: true }
//     // ]
//     return <>
//         <div className='p-2'>
//             {/* <div className=' bg-secLine text-white text-2xl text-center'><h1>Site Analytics</h1></div> */}
//             {/* <div className=' text-black text-2xl text-center flex flex-col sm:flex-row'>
//                 <h1>{marketChartList?.name} </h1>
//             </div> */}

//             <div className='w-full bg-primaryLine text-white text-xl flex justify-between mb-2'>
//                 {/* <span className="cursor-pointer" onClick={() => { goToMap() }}>Click to go</span> */}
//                 <h1>{marketChartList?.name} </h1>
//             </div>

//             {/* <div className={`grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 grid col-span-12 rounded-md gap-4 ${Cell_name? "h-[10vh]" : ""}`}> */}
//                 {/* { */}
//                 {/* ["", "", "", "","", "", "", "","", "", "", "" ].map((itm) => {
//                         return <div className='m-0.5 mt-4 bg-white rounded-sm hover:shadow-2xl shadow-slate-400 shadow-xl'>
//                             <LiningChart width={360} height={200}/>
//                         </div>
//                     }) */}
//                 {/* } */}
//                 {/* {
//                     marketChartList?.value ? Object.entries(marketChartList?.value).map((itm, index) => {
//                         console.log(itm, "marketChartListmarketChartList")
//                         return  <div className='m-0.5 mt-4 bg-white rounded-sm hover:shadow-2xl shadow-slate-400 shadow-xl'>
//                             <LiningChart data={itm[1]} labels={[{ name: "value", color: colorList[index] }]} heading={itm[0]} />
//                         </div>
//                     }) 
                    
//                     : <div>
//                         Please Select Site From Map <br />
//                     </div>
//                 } */}



//             {/* </div> */}
// <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">

//   {Object.entries(marketChartList?.value || {}).map(
//     ([kpiName, rows], index) => {

//       console.log("KPI:", kpiName);
//       console.log("Rows:", rows);

//       const chartData = rows
//       .filter(r => Number.isFinite(r.value)) // ✅ drop NaN / Infinity
//       .map(r => ({
//         x: r.starttime,
//         y: r.value
//       }));

//       console.log("ChartData:", chartData);
//                 console.log("KPI DEBUG", {
//   kpiName,
//   rawRows: rows,
//   cleanedRows: chartData
// });


//       return (
//         <div
//           key={kpiName}
//           className="bg-white rounded shadow-xl p-2"
//         >
//           <LiningChart
//             data={chartData}
//             labels={[{ name: kpiName, color: colorList[index] }]}
//             heading={kpiName}
//           />
//         </div>
//       );
//     }
//   )}

// </div>


//         </div>
//     </>
// };

// export default MapChart;


//  Map charts manually coded - old code, tied to "click to open chart" button in index.jsx
import React from "react";
import { useSelector } from "react-redux";
import LiningChart from "../../components/Charts/LineChart";

const MapChart = () => {
  const marketChartList = useSelector(
    (state) => state?.map?.markerChartList
  );

  const colorList = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ff00ff",
    "#40E0D0",
    "#FF7F50",
    "#008080",
    "#000080",
  ];

  if (!marketChartList || !marketChartList.value) {
    return <div className="p-4">No chart data</div>;
  }

  return (
    <div className="p-2">
      <div className="w-full bg-primaryLine text-white text-xl mb-2">
        <h1>{marketChartList.name}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Object.entries(marketChartList.value).map(
          ([kpiName, rows], index) => {
            const chartData = rows
            //   .map(r => ({
            //     x: r.starttime,
            //     y: r.value,
            //   })
            // );
.map(r => ({
    x: r.starttime,
    y: r.value === null ? null : Number(r.value),
  }))
  .filter(r => r.y !== null && !Number.isNaN(r.y));

            if (!chartData.length) return null;

            return (
              <div
                key={kpiName}
                className="bg-white rounded shadow-xl p-2"
              >
                <LiningChart
                  data={chartData}
                  labels={[{ name: kpiName, color: colorList[index % colorList.length] }]}
                  heading={kpiName}
                />
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default MapChart;

