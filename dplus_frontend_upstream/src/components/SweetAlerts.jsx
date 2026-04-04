// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import SweetAlert2 from 'react-sweetalert2';
// import Modal from './Modal';
// import { ALERTS } from '../store/reducers/component-reducer';

// import { UilExclamationTriangle, UilInfoCircle } from '@iconscout/react-unicons'
// import Button from './Button';
// import swal from 'sweetalert';
// export const SweetAlerts = () => {

//     const dispatch = useDispatch()
//     // let swAlerts = useSelector((state) => {
//     //     console.log(state, "statedsadsadsadsadasdsada")
//     //     let interdata = state?.component?.alerts
//     //     interdata = {
//     //         ...interdata,
//     //         buttons: interdata?.buttons?.length > 0 ? interdata?.buttons : [
//     //             <Button classes='w-15 bg-green-500' onClick={() => {
//     //                 dispatch(ALERTS({ show: false }))
//     //             }} name={"OK"} />]
//     //     }
//     //     // console.log(interdata.buttons, "interdatainterdatadsadassadsadas")
//     //     return interdata
//     // })

//     // ----------------------------------------
//     const swAlerts = useSelector(state => state.component.alerts);

//     const finalButtons =  swAlerts?.buttons?.length > 0
//             ? swAlerts.buttons
//             : [
//                 <Button
//                     key="default-ok"
//                     classes="w-15 bg-green-500"
//                     onClick={() => dispatch(ALERTS({ show: false }))}
//                     name="OK"
//                 />
//             ];

//     useEffect(() => {
//         if (swAlerts?.type === 1 && swAlerts?.show) {
//             swal({
//             title: swAlerts?.head,
//             text: swAlerts?.text,
//             icon: swAlerts?.icon,
//             button: 'OK',
//         });
//             dispatch(ALERTS({ show: false }));
//         }
//     }, [swAlerts, dispatch]);

//     // ----------------------------------------

//     const [swalProps, setSwalProps] = useState({
//         show: true,
//         title: 'Example',
//         text: 'Hello World',
//     });

//     const icons = {
//         warning: <UilExclamationTriangle size="52" className={"hello"} />,
//         error: <UilExclamationTriangle size="52" className={"hello"} />,
//         info: <UilInfoCircle size="52" className={"hello"} />,
//         success: <UilInfoCircle size="52" className={"hello"} />
//     }

//     const showAlert = () => {
//         swal({
//             title: swAlerts?.head,
//             text: swAlerts?.text,
//             icon: swAlerts?.icon,
//             button: 'OK',
//         });

//         dispatch(ALERTS({ show: false }))

//     };


//     // let msgdata={
//     //     show: true,
//     //     icon:'error',
//     //     text: res?.data?.msg,
//     // }
//     // dispatch(ALERTS(msgdata))

//     return <>
//         {/* <SweetAlert2 {...swAlerts} /> */}

//         {
//             swAlerts?.type == 1 ? <>{showAlert()}</> : <>
//                 <Modal size={"modal"} isOpen={swAlerts?.show} setIsOpen={() => {
//                     dispatch(ALERTS({ show: false }))
//                 }} children={<div className='flex h-full flex-col px-2 items-center'>



//                     {icons[swAlerts?.icon]}
//                     <h1>{swAlerts?.text}</h1>
//                     <div className='mt-2  flex justify-evenly w-48'>
//                         {swAlerts?.buttons?.map((itms) => {
//                             return itms
//                         })}
//                     </div>
//                 </div>} />
//             </>

//         }



//     </>
// }


// export default SweetAlerts;

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SweetAlert2 from 'react-sweetalert2';
import Modal from './Modal';
import { ALERTS } from '../store/reducers/component-reducer';

import { UilExclamationTriangle, UilInfoCircle } from '@iconscout/react-unicons'
import Button from './Button';
import swal from 'sweetalert';
export const SweetAlerts = () => {

    const dispatch = useDispatch()
    let swAlerts = useSelector((state) => {
        console.log(state, "statedsadsadsadsadasdsada")
        let interdata = state?.component?.alerts
        interdata = {
            ...interdata,
            buttons: interdata?.buttons?.length > 0 ? interdata?.buttons : [
                <Button classes='w-15 bg-green-500' onClick={() => {
                    dispatch(ALERTS({ show: false }))
                }} name={"OK"} />]
        }
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
        info: <UilInfoCircle size="52" className={"hello"} />,
        success: <UilInfoCircle size="52" className={"hello"} />
    }

    const showAlert = () => {
        swal({
            title: swAlerts?.head,
            text: swAlerts?.text,
            icon: swAlerts?.icon,
            button: 'OK',
        });

        dispatch(ALERTS({ show: false }))

    };


    // let msgdata={
    //     show: true,
    //     icon:'error',
    //     text: res?.data?.msg,
    // }
    // dispatch(ALERTS(msgdata))

    return <>
        {/* <SweetAlert2 {...swAlerts} /> */}

        {
            swAlerts?.type == 1 ? <>{showAlert()}</> : <>
                <Modal size={"modal"} isOpen={swAlerts?.show} setIsOpen={() => {
                    dispatch(ALERTS({ show: false }))
                }} children={<div className='flex h-full flex-col px-2 items-center'>



                    {icons[swAlerts?.icon]}
                    <h1>{swAlerts?.text}</h1>
                    <div className='mt-2  flex justify-evenly w-48'>
                        {swAlerts?.buttons?.map((itms) => {
                            return itms
                        })}
                    </div>
                </div>} />
            </>

        }



    </>
}


export default SweetAlerts;

