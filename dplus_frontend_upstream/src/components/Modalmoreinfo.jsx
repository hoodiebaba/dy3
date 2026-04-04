import React from 'react';
import { moreinfo } from '../utils/commonFunnction';

const Modalmoreinfo = ({ value, setModalBody, setOpenModal,ctt=32 }) => {


    if (value?.length > ctt) {
        return <>
            <div class="">
                <div class="group flex flex-col relative items-center w-max">
                    <p className='cursor-pointer ' onClick={()=>{
                        setOpenModal(true)
                        setModalBody(<p className='p-3 overflow-scroll'>{value}</p>)
                    }}>{moreinfo(value, ctt) + "..."}</p>
                    <span
                        class="pointer-events-none w-max absolute -top-8 bg-gray-500 rounded-lg p-2 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                        {"Click Here for more info"}
                    </span>
                </div>
            </div>
            <p data-tooltip-target="tooltip-hover"></p>
        </>
    } else {
        return <p>{value}</p>
    }

}

export default Modalmoreinfo