
import React, { useState } from 'react';
import { UilInfoCircle } from '@iconscout/react-unicons'
import Modal from './Modal';
import { useSelector } from 'react-redux';
import Table from './Table';
import TableJson from './TableJson';
import { twMerge } from 'tailwind-merge';
import { cn } from '../utils/common';


const DPAOneRow = ({ ckeyr,name, id , fetchBackend, variables}) => {

    
    const [openModal, setOpenModal] = useState(false)

    
    let widthsetter=["CM Checks","RSI/PCI/PSC/BCCH"]

    console.log(ckeyr,"ckeyr,widthsetterm")

    let data_from_socket = useSelector((state) => {
        // console.log(state, "statedsadsadsadsadasdsada")
        let interdata = state?.websocket?.data_from_socket
        return interdata
    })


    // console.log(name, data_from_socket[id]?.["columns"],variables,variables["color"],variables["value"], "name,id data_from_socketname,id data_from_socket")

    // let value=`${data_from_socket[id] === undefined && fetchBackend ? "bg-white" : data_from_socket?.[id]?.["data"][0]?.["Pre_Value_Colour"]?.toLowerCase()}`



    // let newVal=`bg-${value}-600`

    // return [<td>1</td>,<td>1</td>,<td>1</td>,<td>1</td>]

    // let finalArr=[
    //     <td className={cn(`${data_from_socket[id] === undefined && fetchBackend ? "bg-white" : "bg-"+data_from_socket?.[id]?.["data"][0]?.["Post_Value_Colour"]?.toLowerCase()}-200`)}>{data_from_socket[id] == undefined && fetchBackend ? "..." : data_from_socket?.[id]?.["data"][0]?.["PostValueAvg"]?.toFixed(2)}</td>,<td className={cn(`${data_from_socket[id] === undefined && fetchBackend ? "bg-white" : "bg-"+data_from_socket?.[id]?.["data"][0]?.["Delta_Colour"]?.toLowerCase()}-200`)}>{data_from_socket[id] == undefined && fetchBackend ? "..." : data_from_socket?.[id]?.["data"][0]?.["DeltaAvg"]?.toFixed(2)}</td>,
    //     <td className={cn(`${data_from_socket[id] === undefined && fetchBackend ? "bg-white" : "bg-"+data_from_socket?.[id]?.["data"][0]?.["Post_Value_Colour"]?.toLowerCase()}-200`)}>{data_from_socket[id] == undefined && fetchBackend ? "..." : data_from_socket?.[id]?.["data"][0]?.["PostValueAvg"]?.toFixed(2)}</td>,<td className={cn(`${data_from_socket[id] === undefined && fetchBackend ? "bg-white" : "bg-"+data_from_socket?.[id]?.["data"][0]?.["Delta_Colour"]?.toLowerCase()}-200`)}>{data_from_socket[id] == undefined && fetchBackend ? "..." : data_from_socket?.[id]?.["data"][0]?.["DeltaAvg"]?.toFixed(2)}</td>
    // ]

    let finalArr = variables["value"].map((itm,index)=>{

        // console.log("index","index",index)
        if(index==0){
            return <td className={`"border-[1px] border-gray-400 " ${widthsetter.indexOf(ckeyr)!=-1?" w-[160px] ":" w-[140px] "}`}><>

            <div className='flex justify-between relative' onClick={() => {
                if (data_from_socket[id] != undefined) {
                    setOpenModal(true)
                }
            }}>
                {
                    // data_from_socket[id]==undefined
                    // fivedotloader bg-secLine
                    data_from_socket[id] == undefined && fetchBackend ? <div className=''>Processing</div> : <>
                        <h1 className='cursor-pointer text-xs'>{name}</h1>
                        <UilInfoCircle size="20" className={"text-[#11223a] shadow-none shadow-slate-400 rounded-full"} />
                        
                        </>
                }
    
            </div>
    
    
    
            <Modal modalHead={name} children={<>
                {
                    data_from_socket[id] != undefined?<>
                    <div className='overflow-scroll'><TableJson headers={data_from_socket[id]["columns"]} columns={data_from_socket[id]["data"]}/></div>
                    </>:<></>
                }
            </>} setIsOpen={setOpenModal} isOpen={openModal} size={"full"} closeButton={false}/>
    
    
        </></td>
        }else{
            // console.log(variables["color"][index],variables["value"][index],"valuevariables[color]")
            return <td style={{backgroundColor:data_from_socket?.[id]?.["data"][0]?.[variables["color"][index]]?.toLowerCase()}} className={cn(`${data_from_socket[id] === undefined && fetchBackend ? "bg-white" : "bg-"+data_from_socket?.[id]?.["data"][0]?.[variables["color"][index]]?.toLowerCase()}-200`," border-[1px] border-gray-400")}>{data_from_socket[id] == undefined && fetchBackend ? "..." : data_from_socket?.[id]?.["data"][0]?.[variables["value"][index]]?.toFixed(2)}</td>
        }
        // console.log(variables["color"][index],"variables[color]")
        return "asd"
        
    })
    console.log(finalArr,"finalArrfinalArr")

    return finalArr

    // <td className={cn(`${data_from_socket[id] === undefined && fetchBackend ? "bg-white" : "bg-"+data_from_socket?.[id]?.["data"][0]?.["Post_Value_Colour"]?.toLowerCase()}-200`)}>{data_from_socket[id] == undefined && fetchBackend ? "..." : data_from_socket?.[id]?.["data"][0]?.["PostValueAvg"]?.toFixed(2)}</td>,<td className={cn(`${data_from_socket[id] === undefined && fetchBackend ? "bg-white" : "bg-"+data_from_socket?.[id]?.["data"][0]?.["Delta_Colour"]?.toLowerCase()}-200`)}>{data_from_socket[id] == undefined && fetchBackend ? "..." : data_from_socket?.[id]?.["data"][0]?.["DeltaAvg"]?.toFixed(2)}</td>]
};

export default DPAOneRow;
