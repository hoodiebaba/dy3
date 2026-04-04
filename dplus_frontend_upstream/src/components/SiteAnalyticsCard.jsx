import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from './Table';
import { useForm } from 'react-hook-form';
import nokiaPrePostActions from '../store/actions/nokiaPrePost-actions';
import DPAOneRow from './DPAOneRow';
import WebsocketActions from '../store/actions/websocket-actions';
import { WebSocketUrls } from '../utils/url';

const SiteAnalyticsCard = ({ AllDataShowing, innerkey, ckey, fetchBackend = false, headers, variables, headerName,ckeyr }) => {





    console.log(ckey, AllDataShowing, "AllDataShowing, innerkey, key AllDataShowing, innerkey, key", variables["color"], variables["value"])

    const dispatch = useDispatch()

    let idSelector = [
        { label: "Select Site ID", name: "frequency", value: "Select", type: "text", option: [{ "label": "Hourly", "value": "Hourly" }, { "label": "Daily", "value": "Daily" }], props: "", required: true, },
        { label: "Pre Date", name: "startAt", type: "datetime", formattype: "date", format: "yyyy-MM-dd", formatop: "yyyy-MM-DD", required: true },
        { label: "Post Date", name: "startAt", type: "datetime", formattype: "date", format: "yyyy-MM-dd", formatop: "yyyy-MM-DD", required: true }
    ]
    let lastValue = 0;
    return <>

        <div className='w-full bg-secLine text-white rounded-t-sm text-center shadow-md shadow-slate-400'>{headerName}</div>

        {/* [["Voice Accessibility Succcess Rate", 10, 10, 10], ["Voice Accessibility Succcess Rate", 10, 10, 10]]} */}
        <div className='border-[0.5px] border-t-0 rounded-b-sm border-black'>

            {

                variables["header"].map((itts, index) => {

                    let ctt = 0;
                    return <Table classes={"m-0.1"} commonCols={true} headers={variables["header"][index]} columns={
                        // Object.keys(AllDataShowing[ckey][innerkey]).map((lowerinnerkey, index) => {

                        Object.keys(AllDataShowing[ckey]).map((lowerinnerkey, indexing) => {


                            

                            // console.log("common_socketcommon_socket","index",Object.keys(AllDataShowing[ckey]).length,index,variables["header"].length,ctt)
                            // console.log("cttcttcttlastValue", index, indexing, lastValue, Object.keys(AllDataShowing[ckey]).length / variables["header"].length, ctt)
                            if (1==1) {
                                dispatch(WebsocketActions.send_to_socket(WebSocketUrls.siteAnalytics, AllDataShowing[ckey][lowerinnerkey]))
                            }
                            // if(ctt>)

                            console.log(indexing,lastValue,ctt,Object.keys(AllDataShowing[ckey]).length/variables["header"].length,"indexing , lastValue")
                            
                            if (indexing >= lastValue && ctt < Object.keys(AllDataShowing[ckey]).length / variables["header"].length) {
                                lastValue = lastValue + 1
                                ctt = ctt + 1
                                return <DPAOneRow ckeyr={ckeyr} name={AllDataShowing[ckey][lowerinnerkey]["KPI_Name"]} id={AllDataShowing[ckey][lowerinnerkey]["Code"] + "_" + AllDataShowing[ckey][lowerinnerkey]["id"]} variables={variables} />
                            }


                            // if (variables["header"].length == 2) {

                            //     if (index == 0 && indexing < 3) {
                            //         lastValue = lastValue + 1
                            //         ctt = ctt + 1
                            //         return <DPAOneRow name={AllDataShowing[ckey][lowerinnerkey]["KPI_Name"]} id={AllDataShowing[ckey][lowerinnerkey]["Code"] + "_" + AllDataShowing[ckey][lowerinnerkey]["id"]} variables={variables} />
                            //     }

                            //     if (index == 1 && indexing > 2 && indexing < 6) {
                            //         lastValue = lastValue + 1
                            //         ctt = ctt + 1
                            //         return <DPAOneRow name={AllDataShowing[ckey][lowerinnerkey]["KPI_Name"]} id={AllDataShowing[ckey][lowerinnerkey]["Code"] + "_" + AllDataShowing[ckey][lowerinnerkey]["id"]} variables={variables} />
                            //     }

                            // } else {
                            //     return <DPAOneRow name={AllDataShowing[ckey][lowerinnerkey]["KPI_Name"]} id={AllDataShowing[ckey][lowerinnerkey]["Code"] + "_" + AllDataShowing[ckey][lowerinnerkey]["id"]} variables={variables} />
                            // }


                            // return <DPAOneRow name={AllDataShowing[ckey][innerkey][lowerinnerkey]["KPI_Name"]} id={AllDataShowing[ckey][innerkey][lowerinnerkey]["Code"] + "_" + AllDataShowing[ckey][innerkey][lowerinnerkey]["id"]} />
                        })
                    } />
                })
            }



        </div>



    </>
};

export default SiteAnalyticsCard;
