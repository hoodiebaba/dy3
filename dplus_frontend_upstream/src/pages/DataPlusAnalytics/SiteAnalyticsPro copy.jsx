import React, { useEffect } from 'react';
import Table from '../../components/Table';
import DPAOneRow from '../../components/DPAOneRow';
import nokiaPrePostActions from '../../store/actions/nokiaPrePost-actions';
import { useDispatch, useSelector } from 'react-redux';


const SiteAnalyticsPro = () => {

    const dispatch = useDispatch()



    let AllDataShowing = useSelector((state) => {
        return state?.nokiaPrePost?.networkAnalyticsPro
    })

    for (let key in AllDataShowing) {

        console.log(key, AllDataShowing[key], "keykeykeykey")

        let dataInner = AllDataShowing[key]
        for (let innerkey in dataInner) {
            console.log(innerkey, dataInner[innerkey], "keykeykeykey")
        }
        // if (AllDataShowing.hasOwnProperty(key)) {
        //     console.log(`${key}: ${AllDataShowing[key]}`,"AllDataShowing");
        // }
    }


    useEffect(() => {
        dispatch(nokiaPrePostActions.getnetworkanalyticspro())
    }, [])
    return <>
        <div className='p-2'>
            <div className='bg-blue-900 text-white text-2xl text-center'><h1>Site Analytics</h1></div>

            <div class="grid grid-cols-12 gap-2 bg-gray-200">

                {Object.keys(AllDataShowing).map((key) => (
                    <>
                        {/* <div className='bg-red-900' > */}
                        <div className='col-span-6 grid grid-cols-2 m-2 mt-4' >
                            {/* <div className=''> */}
                            {
                                // Object.keys(AllDataShowing[key]).map((innerkey) => {
                                ["5G","4G","3G","2G"].map((innerkey) => {
                                    return <>

                                        <div className='m-1'>
                                            <div className='w-full bg-blue-900 text-white text-center mt-4'>NR/{innerkey} {key}</div>

                                            {/* [["Voice Accessibility Succcess Rate", 10, 10, 10], ["Voice Accessibility Succcess Rate", 10, 10, 10]]} */}
                                            <Table headers={["KPI", "Pre", "Post", "Delta"]} columns={
                                                Object.keys(AllDataShowing[key][innerkey]).map((lowerinnerkey) => {
                                                    return [<DPAOneRow name={AllDataShowing[key][innerkey][lowerinnerkey]["KPI_Name"]}/>,10,10,10]
                                                })
                                            } />
                                        </div>
                                    </>
                                })
                            }


                        </div>
                        {/* </div> */}
                    </>
                ))
                }



                {/* <div className='col-span-6'>
                    <div className='grid grid-cols-2 mt-4'>
                        <div class="flex flex-row">

                            {
                                ["Cluster", "General", "Market", "Network"].map((itm) => {
                                    return <span className='border-gray-900 border-2 m-1 p-1'>{itm}</span>
                                })
                            }
                        </div>
                    </div>
                    <div className='col-span-3 bg-transparent'>
                        <div class="flex flex-row">
                            <input type="checkbox" />
                            <span>DA0019BA</span>
                        </div>
                    </div>
                    <div className='w-full bg-blue-900 text-white text-center mt-4'>View Health</div>
                    <div className='grid grid-cols-2 mt-4'>
                        <div class="m-2">Pre-Period</div>
                        <div class="m-2"><input type="date" /></div>
                        <div class="m-2">Post-Period</div>
                        <div class="m-2"><input type="date" /></div>
                    </div>
                    <div className='w-full bg-blue-900 text-white text-center mt-4'>Alarms</div>

                    <Table headers={["Alarm Name", "Type"]} columns={[["abcd", "ancd"], ["adsa", "dasdas"]]} />
                    <div className='w-full bg-orange-500 text-white text-center mt-10'>NOK</div>
                    <div className='w-full bg-blue-900 text-white text-center mt-4'>PM Check</div>
                    <Table headers={["Names", "Check"]} columns={[["abcd", "ancd"], ["adsa", "dasdas"], ["adsa", "dasdas"], ["adsa", "dasdas"], ["adsa", "dasdas"]]} />
                </div> */}
                {/*                 
                <div className='col-span-5 bg-transparent'>
                    <div className='w-full bg-blue-900 text-white text-center mt-10'>CM Quick Health Check</div>
                    <Table headers={["CM Param", "Check", "Remarks"]} columns={[["abcd", "ancd", "sadasda"], ["abcd", "ancd", "sadasda"], ["abcd", "ancd", "sadasda"], ["abcd", "ancd", "sadasda"], ["abcd", "ancd", "sadasda"], ["abcd", "ancd", "sadasda"], ["abcd", "ancd", "sadasda"], ["abcd", "ancd", "sadasda"], ["abcd", "ancd", "sadasda"], ["abcd", "ancd", "sadasda"], ["abcd", "ancd", "sadasda"], ["abcd", "ancd", "sadasda"], ["abcd", "ancd", "sadasda"]]} />
                    <div className='w-full bg-blue-900 text-white text-center mt-10'>SW Change Check ({"<"} 30 Days)</div>
                    <Table headers={["MRBTS", "Date", "Pre SW", "Post/Current SW"]} columns={[["12345", "abcd", "ancd", "sadasda"]]} />
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <div className='w-full bg-blue-900 text-white text-center mt-10'>NR PCI/RSI Conflict</div>
                            <Table headers={["Issue", "< 1 mile>", "1 - 5 mile", "5 > mile"]} columns={[["12345", "abcd", "ancd", "sadasda"]]} />
                            <div className='w-full bg-blue-900 text-white text-center mt-10'>Timing Advance Cell Over Shooters</div>
                            <div className='w-fulls text-black text-center mt-2'> 4 Over shooters </div>
                            <div className='w-full bg-orange-500 text-white text-center mt-2'>NOK</div>
                        </div>
                        <div>
                            <div className='w-full bg-blue-900 text-white text-center mt-10'>LTE PCI/RSI Conflict</div>
                            <Table headers={["RSI Conflict", "PCI Conflict", "PCI Confusion"]} columns={[["12345", "321", "123"]]} />
                            <div className='w-full bg-blue-900 text-white text-center mt-10'>HW Change Check ({"<"} 30 Days) </div>
                            <div className='w-fulls text-black text-center mt-2'> 0 Change </div>
                            <div className='w-full bg-green-500 text-white text-center mt-2'>NOK</div>
                        </div>
                    </div>
                </div>
                <div className='col-span-4 bg-transparent'>
                    <div className='w-full bg-blue-900 text-white text-center mt-10'>NR Basic KPI Check</div>
                    <Table headers={["KPI", "Pre", "Post", "Delta"]} columns={[["12345", "abcd", "ancd", "sadasda"], ["12345", "abcd", "ancd", "sadasda"], ["12345", "abcd", "ancd", "sadasda"]]} />
                    <div className='w-full bg-green-500 text-white text-center mt-2'>OK</div>
                    <div className='w-full bg-blue-900 text-white text-center mt-2'>LTE Basic KPI Check</div>
                    <Table headers={["KPI", "Pre", "Post", "Delta"]} columns={[["12345", "abcd", "ancd", "sadasda"], ["12345", "abcd", "ancd", "sadasda"], ["12345", "abcd", "ancd", "sadasda"]]} />
                    <div className='w-full bg-green-500 text-white text-center mt-2'>OK</div>
                    <div className='w-full bg-blue-900 text-white text-center mt-2'>LTE Traffic Imbalance</div>
                    <div className='w-fulls text-black text-center mt-2'> No Issue </div>
                    <div className='w-full bg-green-500 text-white text-center mt-2'>OK</div>
                    <div className='w-full bg-blue-900 text-white text-center mt-2'>LTE TA Check</div>
                    <div className='w-fulls text-black text-center mt-2'> 9 Cells Ctrs w/ {">"} 50% Change Pre/Post </div>
                    <div className='w-full bg-green-500 text-white text-center mt-2'>NOK</div>
                </div> */}
            </div>
        </div>
    </>
};

export default SiteAnalyticsPro;
