// import React, { useState, useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useLocation } from 'react-router-dom'
// import { useForm } from 'react-hook-form';
// import CommonForm from '../CommonForm'
// import MapActions from '../../store/actions/map-actions'
// import QueryItem from '../../pages/CustomQuery/QueryItem';
// import CustomDropdown from '../CustomDropdown';
// import FilterQueryItem from '../../pages/CustomQuery/FilterQueryItem';
// import { MARKER_LIST } from '../../store/reducers/map-reducer';


// const MapFilters = ({ sidebarOpen, children, dataValue, setDataValue, map, smap, slider,setOneLoad,setOneCtr,eLoad,SetgOpen,gopen }) => {

//     let filterVisiblity = useSelector((state) => {
//         return state.component.popmenu
//     })

//     const location = useLocation()
//     const dispatch = useDispatch()

//     // console.log(location.pathname,dataValue,eLoad, filterVisiblity, 'navigatedataValue')


//     const [upmanagingFilter, setupManagingFilter] = useState([])
//     const [filtering, setFiltering] = useState("")
//     const [onetime, setonetime] = useState(true)
//     // const [gopen, SetgOpen] = useState(eLoad)


//     useSelector((state) => {
//         if (onetime && state?.map?.get_all_filter?.d1) {
//             console.log(state.map.get_all_filter, 'allllll')
//             setupManagingFilter(state?.map?.get_all_filter?.d1)
//             setonetime(false)
//         }
//     })



//     let techWithBandList = useSelector((state) => {
//         // console.log(state, "state state")
//         let interdata = state?.map?.tech_with_band
//         // console.log(interdata, "tec")
//         // console.log(state.map,'test')
//         return interdata
//     })

//     let getAllFilterList = useSelector((state) => {
//         // console.log(state, "state state main")
//         let interdata = state?.map?.get_all_filter
//         // console.log(interdata, "alllll")
//         // console.log(state.map, 'test')
//         return interdata
//     })
//     let selectAllFilterList = useSelector((state) => {
//         // console.log(state, "state state")
//         let interdata = state?.map?.tech_with_band
//         // console.log(interdata, "tec")
//         // console.log(state.map, 'test')
//         return interdata
//     })

//     useEffect(() => {


//     }, [dataValue]);

//     const {
//         register,
//         handleSubmit,
//         watch,
//         setValue,
//         getValues,
//         formState: { errors },
//     } = useForm()


//     const onTableViewSubmit = (data) => {
//         // console.log(data, "datadata onTableViewSubmit")

        
//         data["dataValue"] = dataValue



//         // map.on('dragend', () => {
//         //     // console.log('apiheat', mapInstance.getCenter(), mapInstance.getZoom());
//         //     let data = {
//         //         ...map.getCenter(),
//         //         radius: map.getZoom(),
//         //         dataValue: dataValue
//         //     }

//         //     console.log(data, "dsadsadadadadadasdas")


//         //     // setchange(prev => !prev)
//         // });
//         // dispatch(CustomQueryActions.postSqlQueryCreator(true, data))

//         // dispatch(AuthActions.signIn(data, () => {
//         //     navigate('/authenticate')
//         // }))



//         let dataing = {
//             // ...map.getCenter(),
//             // radius: map.getZoom(),
//             dataValue: dataValue
//         }

//         let dataAll={
//             data:[],
//             type:"U"
//         }
        
//         dispatch(MARKER_LIST({ dataAll , reset:true }))

//         dispatch(MapActions.getMarkerList(dataing, () => {
//             setOneLoad(true)
//             // setOneCtr(prev=>prev+1)
//             dispatch(MapActions.saveCurrentMapLatLong({ "saveMapFilters": JSON.stringify(dataValue) }))
//         }))
//     }





//     const onClearFilter = () => {

//         setDataValue([])

//         SetgOpen([])

//         let dataing = {
//             // ...map.getCenter(),
//             // radius: map.getZoom(),
//             dataValue: []
//         }
//         dispatch(MARKER_LIST({ dataAll , reset:true }))

//         dispatch(MapActions.getMarkerList(dataing, () => {
//             setOneLoad(true)
//             // setOneCtr(prev=>prev+1)
//             dispatch(MapActions.saveCurrentMapLatLong({ "saveMapFilters": JSON.stringify(dataValue) }))
//         }))
//         // dispatch(MapActions.getMarkerList(dataing, () => { }))
//     }
//     function test() {
//         alert('test')
//     }

//     let view = [
//         {
//             label: "standard",
//             value: "mapbox://styles/mapbox/standard",
//         },
//         {
//             label: "streets",
//             value: "mapbox://styles/mapbox/streets-v11",
//         },
//         {
//             label: "outdoors",
//             value: "mapbox://styles/mapbox/outdoors-v11",
//         },
//         {
//             label: "light",
//             value: "mapbox://styles/mapbox/light-v10",
//         },
//         {
//             label: "dark",
//             value: "mapbox://styles/mapbox/dark-v10",
//         },
//         {
//             label: "light",
//             value: "mapbox://styles/mapbox/light-v10",
//         },
//         {
//             label: "satellite",
//             value: "mapbox://styles/mapbox/satellite-v9",
//         },
//         {
//             label: "satellite streets",
//             value: "mapbox://styles/mapbox/satellite-streets-v11",
//         },
//         {
//             label: "navigation day",
//             value: "mapbox://styles/mapbox/navigation-day-v1",
//         },
//         {
//             label: "navigation night",
//             value: "mapbox://styles/mapbox/navigation-night-v1",
//         }
//     ]
//     // console.log("===upmanagingFilter===upmanagingFilter=", slider, upmanagingFilter)
//     return (

//         <div className=' overflow-y-scroll h-full bg-transparent '>

//             {
//                 upmanagingFilter?.map((its) => {
//                     {/* console.log(its, "dsajdgksahdjsadhjksa") */ }

//                     return <>
//                         <CustomDropdown its={its.parent} children={
//                             its?.child?.map((itm) => {
//                                 return <><FilterQueryItem filtering={filtering} SetgOpen={SetgOpen} gopen={gopen} setDataValue={setDataValue} dataValue={dataValue} itm={itm} value={20} size={1} classname='text-black' /></>
//                             })
//                         } />
//                     </>
//                 })

//             }

//             {/* <div className='flex flex-col'>

//                 <CustomDropdown its={"Map View"} children={
//                     <select onChange={
//                         (e) => { smap.setStyle(e.target.value) }
//                     }>
//                         {
//                             view.map((itm) => {
//                                 return <option value={itm.value}>{itm.label}</option>
//                             })
//                         }
//                     </select>

//                 } />



//             </div> */}

//             {/* <div className=' m-2 '>
//                 <input
//                     type='range'
//                     value={slider}
//                     min={1}
//                     max={99}
//                     onChange={(e)=>{setSlider(e.target.value)}}
//                     className={'w-full slider rounded-full bg-gray-300 focus:outline-none'}
//                 ></input>
//             </div> */}

//             <div className="flex items-center justify-evenly absolute bottom-0">
//                 <button
//                     className="bg-secLine text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-12"
//                     onClick={() => { onClearFilter() }} >
//                     Clear
//                 </button>
//                 <button
//                     className="bg-primaryLine text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-12"
//                     onClick={(handleSubmit(onTableViewSubmit))} >
//                     Apply
//                 </button>
//             </div>


//         </div>
//     );
// };

// export default MapFilters;
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import CommonForm from '../CommonForm'
import MapActions from '../../store/actions/map-actions'
import QueryItem from '../../pages/CustomQuery/QueryItem';
import CustomDropdown from '../CustomDropdown';
import FilterQueryItem from '../../pages/CustomQuery/FilterQueryItem';
import { MARKER_LIST } from '../../store/reducers/map-reducer';


const MapFilters = ({ sidebarOpen, children, dataValue, setDataValue, map, smap, slider,setOneLoad,setOneCtr,eLoad,SetgOpen,gopen, customApply, customClear }) => {

    let filterVisiblity = useSelector((state) => {
        return state.component.popmenu
    })

    const location = useLocation()
    const dispatch = useDispatch()

    // console.log(location.pathname,dataValue,eLoad, filterVisiblity, 'navigatedataValue')


    const [upmanagingFilter, setupManagingFilter] = useState([])
    const [filtering, setFiltering] = useState("")
    const [onetime, setonetime] = useState(true)
    // const [gopen, SetgOpen] = useState(eLoad)


    useSelector((state) => {
        if (onetime && state?.map?.get_all_filter?.d1) {
            console.log(state.map.get_all_filter, 'allllll')
            setupManagingFilter(state?.map?.get_all_filter?.d1)
            setonetime(false)
        }
    })



    let techWithBandList = useSelector((state) => {
        // console.log(state, "state state")
        let interdata = state?.map?.tech_with_band
        // console.log(interdata, "tec")
        // console.log(state.map,'test')
        return interdata
    })

    let getAllFilterList = useSelector((state) => {
        // console.log(state, "state state main")
        let interdata = state?.map?.get_all_filter
        // console.log(interdata, "alllll")
        // console.log(state.map, 'test')
        return interdata
    })
    let selectAllFilterList = useSelector((state) => {
        // console.log(state, "state state")
        let interdata = state?.map?.tech_with_band
        // console.log(interdata, "tec")
        // console.log(state.map, 'test')
        return interdata
    })

    useEffect(() => {


    }, [dataValue]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()


    const onTableViewSubmit = (data) => {
        // console.log(data, "datadata onTableViewSubmit")

        // added for multi vendor custom apply
        if (customApply) {
            customApply();
            return;
        }

        //old common apply logic
        data["dataValue"] = dataValue

        // map.on('dragend', () => {
        //     // console.log('apiheat', mapInstance.getCenter(), mapInstance.getZoom());
        //     let data = {
        //         ...map.getCenter(),
        //         radius: map.getZoom(),
        //         dataValue: dataValue
        //     }

        //     console.log(data, "dsadsadadadadadasdas")


        //     // setchange(prev => !prev)
        // });
        // dispatch(CustomQueryActions.postSqlQueryCreator(true, data))

        // dispatch(AuthActions.signIn(data, () => {
        //     navigate('/authenticate')
        // }))

        let dataing = {
            // ...map.getCenter(),
            // radius: map.getZoom(),
            dataValue: dataValue
        }

        let dataAll={
            data:[],
            type:"U"
        }
        
        dispatch(MARKER_LIST({ dataAll , reset:true }))

        dispatch(MapActions.getMarkerList(dataing, () => {
            setOneLoad(true)
            // setOneCtr(prev=>prev+1)
            dispatch(MapActions.saveCurrentMapLatLong({ "saveMapFilters": JSON.stringify(dataValue) }))
        }))
    }

    const onClearFilter = () => {

        // multi vendor custom clear
         if (customClear) {
            customClear();
            return;
        }

        // old common clear logic
        setDataValue([])

        SetgOpen([])

        let dataing = {
            // ...map.getCenter(),
            // radius: map.getZoom(),
            dataValue: []
        }
        dispatch(MARKER_LIST({ dataAll , reset:true }))

        dispatch(MapActions.getMarkerList(dataing, () => {
            setOneLoad(true)
            // setOneCtr(prev=>prev+1)
            dispatch(MapActions.saveCurrentMapLatLong({ "saveMapFilters": JSON.stringify(dataValue) }))
        }))
        // dispatch(MapActions.getMarkerList(dataing, () => { }))
    }
    function test() {
        alert('test')
    }

    let view = [
        {
            label: "standard",
            value: "mapbox://styles/mapbox/standard",
        },
        {
            label: "streets",
            value: "mapbox://styles/mapbox/streets-v11",
        },
        {
            label: "outdoors",
            value: "mapbox://styles/mapbox/outdoors-v11",
        },
        {
            label: "light",
            value: "mapbox://styles/mapbox/light-v10",
        },
        {
            label: "dark",
            value: "mapbox://styles/mapbox/dark-v10",
        },
        {
            label: "light",
            value: "mapbox://styles/mapbox/light-v10",
        },
        {
            label: "satellite",
            value: "mapbox://styles/mapbox/satellite-v9",
        },
        {
            label: "satellite streets",
            value: "mapbox://styles/mapbox/satellite-streets-v11",
        },
        {
            label: "navigation day",
            value: "mapbox://styles/mapbox/navigation-day-v1",
        },
        {
            label: "navigation night",
            value: "mapbox://styles/mapbox/navigation-night-v1",
        }
    ]
    // console.log("===upmanagingFilter===upmanagingFilter=", slider, upmanagingFilter)
    return (

        <div className=' overflow-y-scroll h-full bg-transparent '>

            {
                upmanagingFilter?.map((its) => {
                    {/* console.log(its, "dsajdgksahdjsadhjksa") */ }

                    return <>
                        <CustomDropdown its={its.parent} children={
                            its?.child?.map((itm) => {
                                return <><FilterQueryItem filtering={filtering} SetgOpen={SetgOpen} gopen={gopen} setDataValue={setDataValue} dataValue={dataValue} itm={itm} value={20} size={1} classname='text-black' /></>
                            })
                        } />
                    </>
                })

            }
            {/* <div className='flex flex-col'>

                <CustomDropdown its={"Map View"} children={
                    <select onChange={
                        (e) => { smap.setStyle(e.target.value) }
                    }>
                        {
                            view.map((itm) => {
                                return <option value={itm.value}>{itm.label}</option>
                            })
                        }
                    </select>

                } />



            </div> */}

            {/* <div className=' m-2 '>
                <input
                    type='range'
                    value={slider}
                    min={1}
                    max={99}
                    onChange={(e)=>{setSlider(e.target.value)}}
                    className={'w-full slider rounded-full bg-gray-300 focus:outline-none'}
                ></input>
            </div> */}

            <div className="flex items-center justify-evenly absolute bottom-0">
                <button
                    className="bg-secLine text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-12"
                    onClick={() => { onClearFilter() }} >
                    Clear
                </button>
                <button
                    className="bg-primaryLine text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-12"
                    onClick={(handleSubmit(onTableViewSubmit))} >
                    Apply
                </button>
            </div>


        </div>
    );
};

export default MapFilters;
