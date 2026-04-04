// // import React, { useState } from 'react';

// // import * as Unicons from '@iconscout/react-unicons';
// // import { UilExpandArrows } from '@iconscout/react-unicons'
// // import MenuItem from './MenuItem';
// // import { useLocation, useNavigate } from 'react-router-dom';
// // import { useDispatch, useSelector } from 'react-redux';
// // import CommonActions from '../store/actions/common-actions';

// // const TopBar = ({ sidebarOpen, setsidebarOpenn, sidebarPos, setSidebarPos }) => {

// //     const dispatch = useDispatch()

// //     // localStorag

// //     let nameing=useSelector((state)=>{
// //         return state.auth.pageName
// //     })

// //     const { state } = useLocation()
// //     const name = state?.name
// //     const navigate = useNavigate()
// //     console.log(useLocation(), "userloc")

// //     const calllogout = () => {
// //         // localStorage.setItem("auth",false)
// //         // localStorage.removeItem("token")
// //         // localStorage.removeItem("user")
// //         // navigate("/login")


// //         dispatch(CommonActions.logoutCaller(() => {
// //             navigate("/login")
// //         }))
// //     }



// //     return <>
// //         <div className='h-[9vh]'>
// //             <div style={{ backgroundImage: "linear-gradient(to right, #101c4c, #1b0027)" }} className="flex justify-between ml-0 overflow-y-auto duration-150 bg-topbarLine dark:bg-topbarLine h-full">
// //                 <div className=' h-full'>
// //                     <img className="mx-auto h-full w-auto py-2" src="/logo.png" alt="Datayog" onClick={() => {
// //                         // if (sidebarPos == "h") {
// //                         //     setSidebarPos("v")
// //                         // } else {
// //                         //     setSidebarPos("h")
// //                         // }

// //                         navigate("/")
// //                     }} />
// //                 </div>
// //                 <div style={{ backgroundImage: "linear-gradient(to right, #101c4c, #1b0027)" }} className="flex justify-between ml-0 px-3 py-4 overflow-y-auto duration-150 bg-transparent w-full dark:bg-topbarLine h-full">
// //                     {/* <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" onClick={() => {
// //                 console.log('sdfjhkhkjshd')
// //                 setsidebarOpenn(prev => !prev)
// //             }} aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
// //                 <span className="sr-only">Open sidebar</span>
// //                 <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
// //                     <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
// //                 </svg>
// //             </button> */}

// //                     <div className='flex space-x-4 items-center'>


// //                         {/* <button onClick={() => { setsidebarOpenn(prev => !prev) }} className={` ${sidebarOpen && 'rotate-180'}`}> */}
// //                         {/* <Unicons.UilArrowCircleLeft size="36" style={{ color: "white" }} /> */}
// //                         {/* <Unicons.UilExpandArrows size="24" style={{ color: "white" }} /> */}
// //                         {/* </button> */}
// //                         <button onClick={() => { setsidebarOpenn(prev => !prev) }} className={`border-[1.5px] rounded-full ${sidebarOpen && 'rotate-180'}`}>
// //                             {/* <Unicons.UilArrowCircleLeft size="36" style={{ color: "white" }} /> */}
// //                             <Unicons.UilArrowRight size="24" className={"text-white"}/>
// //                         </button>
// //                         <h1 className='font-semibold text-white text-xs sm:text-lg '>{name || nameing}</h1>
// //                     </div>

// //                     <div onClick={() => { calllogout() }} className='dark:text-white flex space-x-1 cursor-pointer items-center'>
// //                         <span className='text-white pr-1 hidden sm:block'>Logout</span>
// //                         <Unicons.UilSignout  className={"text-white"}/></div>
// //                 </div>
// //             </div>
// //         </div>
// //     </>
// // }



// // export default TopBar

// import React, { useState } from 'react';

// import * as Unicons from '@iconscout/react-unicons';
// import { UilExpandArrows } from '@iconscout/react-unicons'
// import MenuItem from './MenuItem';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import CommonActions from '../store/actions/common-actions';

// const TopBar = ({ sidebarOpen, setsidebarOpenn, sidebarPos, setSidebarPos }) => {

//     const dispatch = useDispatch()

//     // localStorag

//     let nameing=useSelector((state)=>{
//         return state.auth.pageName
//     })

//     const { state } = useLocation()
//     const name = state?.name
//     const navigate = useNavigate()
//     console.log(useLocation(), "userloc")

//     const calllogout = () => {
//         // localStorage.setItem("auth",false)
//         // localStorage.removeItem("token")
//         // localStorage.removeItem("user")
//         // navigate("/login")


//         dispatch(CommonActions.logoutCaller(() => {
//             navigate("/login")
//         }))
//     }



//     return <>
//         <div className='h-[9vh]'>
//             <div style={{ backgroundImage: "linear-gradient(to right, #101c4c, #1b0027)" }} class="flex justify-between ml-0 overflow-y-auto duration-150 bg-topbarLine dark:bg-topbarLine h-full">
//                 <div className=' h-full'>
//                     <img className="mx-auto h-full w-auto py-2" src="/logo.png" alt="Datayog" onClick={() => {
//                         // if (sidebarPos == "h") {
//                         //     setSidebarPos("v")
//                         // } else {
//                         //     setSidebarPos("h")
//                         // }

//                         navigate("/")
//                     }} />
//                 </div>
//                 <div style={{ backgroundImage: "linear-gradient(to right, #101c4c, #1b0027)" }} class="flex justify-between ml-0 px-3 py-4 overflow-y-auto duration-150 bg-transparent w-full dark:bg-topbarLine h-full">
//                     {/* <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" onClick={() => {
//                 console.log('sdfjhkhkjshd')
//                 setsidebarOpenn(prev => !prev)
//             }} aria-controls="default-sidebar" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
//                 <span class="sr-only">Open sidebar</span>
//                 <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                     <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
//                 </svg>
//             </button> */}

//                     <div className='flex space-x-4 items-center'>


//                         {/* <button onClick={() => { setsidebarOpenn(prev => !prev) }} className={` ${sidebarOpen && 'rotate-180'}`}> */}
//                         {/* <Unicons.UilArrowCircleLeft size="36" style={{ color: "white" }} /> */}
//                         {/* <Unicons.UilExpandArrows size="24" style={{ color: "white" }} /> */}
//                         {/* </button> */}
//                         <button onClick={() => { setsidebarOpenn(prev => !prev) }} className={`border-[1.5px] rounded-full ${sidebarOpen && 'rotate-180'}`}>
//                             {/* <Unicons.UilArrowCircleLeft size="36" style={{ color: "white" }} /> */}
//                             <Unicons.UilArrowRight size="24" class={"text-white"}/>
//                         </button>
//                         <h1 className='font-semibold text-white text-xs sm:text-lg '>{name || nameing}</h1>
//                     </div>

//                     <div onClick={() => { calllogout() }} className='dark:text-white flex space-x-1 cursor-pointer items-center'>
//                         <span className='text-white pr-1 hidden sm:block'>Logout</span>
//                         <Unicons.UilSignout  class={"text-white"}/></div>
//                 </div>
//             </div>
//         </div>
//     </>
// }



// export default TopBar


import React, { useState } from 'react';

import * as Unicons from '@iconscout/react-unicons';
import { UilExpandArrows } from '@iconscout/react-unicons'
import MenuItem from './MenuItem';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CommonActions from '../store/actions/common-actions';

const TopBar = ({ sidebarOpen, setsidebarOpenn, sidebarPos, setSidebarPos }) => {

    const dispatch = useDispatch()

    // localStorag

    let nameing=useSelector((state)=>{
        return state.auth.pageName
    })

    const { state } = useLocation()
    const name = state?.name
    const navigate = useNavigate()
    console.log(useLocation(), "userloc")

    const calllogout = () => {
        // localStorage.setItem("auth",false)
        // localStorage.removeItem("token")
        // localStorage.removeItem("user")
        // navigate("/login")


        dispatch(CommonActions.logoutCaller(() => {
            navigate("/login")
        }))
    }



    return <>
        <div className='h-[6vh]'>
            <div style={{ backgroundImage: "linear-gradient(to right, #101c4c, #1b0027)" }} class="flex justify-between ml-0 overflow-y-auto duration-150 bg-topbarLine dark:bg-topbarLine h-full">
                <div className=' h-full'>
                    <img className="mx-auto h-full w-auto py-2" src="/logo.png" alt="Datayog" onClick={() => {
                        // if (sidebarPos == "h") {
                        //     setSidebarPos("v")
                        // } else {
                        //     setSidebarPos("h")
                        // }

                        navigate("/")
                    }} />
                </div>
                <div style={{ backgroundImage: "linear-gradient(to right, #101c4c, #1b0027)" }} class="flex justify-between ml-0 px-3 py-4 overflow-y-auto duration-150 bg-transparent w-full dark:bg-topbarLine h-full">
                    {/* <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" onClick={() => {
                console.log('sdfjhkhkjshd')
                setsidebarOpenn(prev => !prev)
            }} aria-controls="default-sidebar" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span class="sr-only">Open sidebar</span>
                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button> */}

                    <div className='flex space-x-4 items-center'>


                        {/* <button onClick={() => { setsidebarOpenn(prev => !prev) }} className={` ${sidebarOpen && 'rotate-180'}`}> */}
                        {/* <Unicons.UilArrowCircleLeft size="36" style={{ color: "white" }} /> */}
                        {/* <Unicons.UilExpandArrows size="24" style={{ color: "white" }} /> */}
                        {/* </button> */}
                        <button onClick={() => { setsidebarOpenn(prev => !prev) }} className={`border-[1.5px] rounded-full ${sidebarOpen && 'rotate-180'}`}>
                            {/* <Unicons.UilArrowCircleLeft size="36" style={{ color: "white" }} /> */}
                            <Unicons.UilArrowRight size="24" class={"text-white"}/>
                        </button>
                        <h1 className='font-semibold text-white text-xs sm:text-lg '>{name || nameing}</h1>
                    </div>

                    <div onClick={() => { calllogout() }} className='dark:text-white flex space-x-1 cursor-pointer items-center'>
                        <span className='text-white pr-1 hidden sm:block'>Logout</span>
                        <Unicons.UilSignout  class={"text-white"}/></div>
                </div>
            </div>
        </div>
    </>
}



export default TopBar