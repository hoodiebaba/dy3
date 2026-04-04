// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import SweetAlert2 from 'react-sweetalert2';
// import Modal from './Modal';
// import { ALERTS } from '../store/reducers/component-reducer';

// import { UilExclamationTriangle, UilInfoCircle } from '@iconscout/react-unicons'
// import Button from './Button';
// export const Loaders = () => {

//     const dispatch = useDispatch()
//     let swAlerts = useSelector((state) => {
//         // console.log(state, "statedsadsadsadsadasdsada")
//         let interdata = state?.component?.loader
//         // console.log(interdata.buttons, "interdatainterdatadsadassadsadas")
//         return interdata
//     })

//     const [swalProps, setSwalProps] = useState({
//         show: true,
//         title: 'Example',
//         text: 'Hello World',
//     });

//     const icons = {
//         warning: <UilExclamationTriangle size="52" className={"hello"} />,
//         error: <UilExclamationTriangle size="52" className={"hello"} />,
//         info: <UilInfoCircle size="52" className={"hello"} />
//     }

//     // let msgdata={
//     //     show: true,
//     //     icon:'error',
//     //     text: res?.data?.msg,
//     // }
//     // dispatch(ALERTS(msgdata))

//     // const loading = useSelector(state => state?.component?.loader);

//     // if (!loading) return null;

//     return <>
//         {/* <SweetAlert2 {...swAlerts} /> */}

//         {/* {
//             swAlerts ?
//                 <div className='h-full z-[100000] absolute w-full flex justify-center items-center bg-gray-700 bg-opacity-50'>

//                     <div class="loader"></div>
//                 </div>
//                 : <></>
//         } */}


//         {/* {
//             true ?
//                 <div className='h-full z-[100000] absolute w-full flex justify-center items-center bg-gray-700 bg-opacity-50'>

//                     <div class="loader"></div>
//                 </div>
//                 : <></>
//         } */}

//         {
//             swAlerts == true ?
//                 // <div className='h-full z-[100000] absolute w-full flex justify-center items-center bg-gray-700 bg-opacity-50'>
//                          <div className="absolute inset-0 z-[100000] flex items-center justify-center bg-gray-700 bg-opacity-50">

//                     <div class="loader">
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" preserveAspectRatio="xMidYMid" class="lds-infinity stroke-black">


//                             <path fill="none" d="M24.3,30C11.4,30,5,43.3,5,50s6.4,20,19.3,20c19.3,0,32.1-40,51.4-40 C88.6,30,95,43.3,95,50s-6.4,20-19.3,20C56.4,70,43.6,30,24.3,30z" className='stroke-pcolor' stroke="" strokeWidth="7"></path>
//                             <path fill="none" d="M24.3,30C11.4,30,5,43.3,5,50s6.4,20,19.3,20c19.3,0,32.1-40,51.4-40 C88.6,30,95,43.3,95,50s-6.4,20-19.3,20C56.4,70,43.6,30,24.3,30z" className='stroke-scolor' stroke="" strokeWidth="7" strokeDasharray="110 8 7 6 5 4 3 2 1 110">
//                                 <animate attributeName="stroke-dashoffset" calcMode="linear" values="0;256.6" keyTimes="0;1" dur="2.3" begin="0s" repeatCount="indefinite"></animate></path>
//                         </svg>
//                     </div>
//                 </div> : <></>
//         }


//         {/* <Modal size={"modal"} isOpen={swAlerts?.show} setIsOpen={() => {
//             dispatch(ALERTS({ show: false }))
//         }} children={<div className='flex flex-col px-2 items-center'>



//             {icons[swAlerts?.icon]}
//             <h1>{swAlerts?.text}</h1>
//             <div className='mt-2  flex justify-evenly w-48'>
//                 {swAlerts?.buttons?.map((itms) => {
//                     return itms
//                 })}
//             </div>



//         </div>} /> */}
//     </>
// }


// export default Loaders;

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SweetAlert2 from 'react-sweetalert2';
import Modal from './Modal';
import { ALERTS } from '../store/reducers/component-reducer';

import { UilExclamationTriangle, UilInfoCircle } from '@iconscout/react-unicons'
import Button from './Button';
export const Loaders = () => {

    const dispatch = useDispatch()
    let swAlerts = useSelector((state) => {
        // console.log(state, "statedsadsadsadsadasdsada")
        let interdata = state?.component?.loader
        // console.log(interdata.buttons, "interdatainterdatadsadassadsadas")
        return interdata
    })

    const [swalProps, setSwalProps] = useState({
        show: true,
        title: 'Example',
        text: 'Hello World',
    });

    const icons = {
        warning: <UilExclamationTriangle size="52" className={"hello"} />,
        error: <UilExclamationTriangle size="52" className={"hello"} />,
        info: <UilInfoCircle size="52" className={"hello"} />
    }

    // let msgdata={
    //     show: true,
    //     icon:'error',
    //     text: res?.data?.msg,
    // }
    // dispatch(ALERTS(msgdata))

    // const loading = useSelector(state => state?.component?.loader);

    // if (!loading) return null;

    return <>
        {/* <SweetAlert2 {...swAlerts} /> */}

        {/* {
            swAlerts ?
                <div className='h-full z-[100000] absolute w-full flex justify-center items-center bg-gray-700 bg-opacity-50'>

                    <div class="loader"></div>
                </div>
                : <></>
        } */}


        {/* {
            true ?
                <div className='h-full z-[100000] absolute w-full flex justify-center items-center bg-gray-700 bg-opacity-50'>

                    <div class="loader"></div>
                </div>
                : <></>
        } */}

        {
            swAlerts == true ?
                // <div className='h-full z-[100000] absolute w-full flex justify-center items-center bg-gray-700 bg-opacity-50'>
                         <div className="absolute inset-0 z-[100000] flex items-center justify-center bg-gray-700 bg-opacity-50">

                    <div class="loader">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" preserveAspectRatio="xMidYMid" class="lds-infinity stroke-black">


                            <path fill="none" d="M24.3,30C11.4,30,5,43.3,5,50s6.4,20,19.3,20c19.3,0,32.1-40,51.4-40 C88.6,30,95,43.3,95,50s-6.4,20-19.3,20C56.4,70,43.6,30,24.3,30z" className='stroke-pcolor' stroke="" strokeWidth="7"></path>
                            <path fill="none" d="M24.3,30C11.4,30,5,43.3,5,50s6.4,20,19.3,20c19.3,0,32.1-40,51.4-40 C88.6,30,95,43.3,95,50s-6.4,20-19.3,20C56.4,70,43.6,30,24.3,30z" className='stroke-scolor' stroke="" strokeWidth="7" strokeDasharray="110 8 7 6 5 4 3 2 1 110">
                                <animate attributeName="stroke-dashoffset" calcMode="linear" values="0;256.6" keyTimes="0;1" dur="2.3" begin="0s" repeatCount="indefinite"></animate></path>
                        </svg>
                    </div>
                </div> : <></>
        }


        {/* <Modal size={"modal"} isOpen={swAlerts?.show} setIsOpen={() => {
            dispatch(ALERTS({ show: false }))
        }} children={<div className='flex flex-col px-2 items-center'>



            {icons[swAlerts?.icon]}
            <h1>{swAlerts?.text}</h1>
            <div className='mt-2  flex justify-evenly w-48'>
                {swAlerts?.buttons?.map((itms) => {
                    return itms
                })}
            </div>



        </div>} /> */}
    </>
}


export default Loaders;

