import React from 'react';
import { moreinfo } from '../utils/commonFunnction';

const Moreinfo = ({ value, msg, child, ctt = 32 }) => {

    return <>
        <div class="">
            <div class="group flex flex-col relative items-center w-max">
                
                {console.log(child,"childchildchildchildchild")}
                {child}
                <span
                    class="pointer-events-none w-max absolute -top-8 bg-gray-500 rounded-lg p-2 opacity-0 transition-opacity group-hover:opacity-100"
                >
                    {msg}
                </span>
            </div>
        </div>
        <p data-tooltip-target="tooltip-hover"></p>
    </>

}

export default Moreinfo