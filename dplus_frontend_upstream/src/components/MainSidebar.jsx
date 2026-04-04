// import React, { useState } from 'react';

// import * as Unicons from '@iconscout/react-unicons';
// import MenuItem from './MenuItem';
// import { Sidebar_content } from '../utils/sidebar_values';

// const Sidebar = ({ sidebarOpen, setsidebarOpenn }) => {


//     // localStorag

//     let permission=JSON.parse(localStorage.getItem("permission")) || {}
//     let user=JSON.parse(localStorage.getItem("user"))
//     let rolename=user?.rolename



//     // const nestSidebar = (itm) => {
//     //     return <li>

//     //         <div class="flex">
//     //             <a href={itm.link} class="flex-80 items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
//     //                 {itm.icon}
//     //                 <span class="ms-3">{itm.name}</span>
//     //             </a>
//     //         </div>


//     //         {
//     //             itm.subMenu ?
//     //                 <>
//     //                     <span class="text-sm rotate-180" id="arrow">
//     //                         <i class="bi bi-chevron-down"></i>
//     //                     </span>
//     //                     <ul class="space-y-2 font-medium">
//     //                         {
//     //                             itm?.subMenu.map((itm) => {
//     //                                 return nestSidebar(itm)
//     //                             })
//     //                         }
//     //                     </ul>
//     //                 </> : <></>
//     //         }

//     //     </li>
//     // }


//     let Roles = Sidebar_content

//     console.log('open', open)

//     return <>

//         {/* 
//         <div style={{backgroundImage:"linear-gradient(to right, #101c4c, #1b0027)"}} class={`flex justify-between h-16 ml-0 px-3 py-4 overflow-y-auto duration-150 bg-topbarLine dark:bg-topbarLine ${sidebarOpen ? 'sm:ml-64' : 'sm:ml-24'}`}>
//             <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" onClick={() => {console.log('sdfjhkhkjshd')
//             setsidebarOpenn(prev => !prev)}} aria-controls="default-sidebar" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
//                 <span class="sr-only">Open sidebar</span>
//                 <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                     <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
//                 </svg>
//             </button>
//             <div className='w-20 pt-2 flex dark:text-white'><span className='text-white pr-1'>Logout</span><Unicons.UilSignout /></div>
//         </div> */}

//          {/* <Unicons.UilArrowCircleLeft size="36" style={{ color: "white" }} /> */}

//         <div className={`${!sidebarOpen && 'w-0 md:w-24'} z-[2000] bg-gray-200 bg-primaryLine dark:bg-primaryLine duration-950 transition-all from-white to-black  fixed top-0 left-0 bottom-0 md:static text-white`}>
//             <button onClick={() => { setsidebarOpenn(prev => !prev) }} className={`absolute top-4 right-4 md:hidden border-[1.5px] rounded-full`}>
               
//                 <Unicons.UilArrowLeft size="28" style={{ color: "white" }} />
//             </button>
//             <h2 class="text-xl font-semibold mb-4"></h2>
//             <img className="mx-auto h-[10vh] w-auto mb-4" src="/logo.png" alt="Datayog" />
//             <ul className='space-y-2 h-[84vh] overflow-y-scroll font-medium'>
//                 {
//                     Roles["all_routes"].map((itm) => {
//                         return <MenuItem sidebarOpen={sidebarOpen} itm={itm} value={6} size={0} checkp={true} permission={permission}  parenting={itm.link} />
//                     })
//                 }
//                 {
//                     [...rolename=="Admin"?Roles[rolename]:[]].map((itm) => {
//                         return <MenuItem sidebarOpen={sidebarOpen} itm={itm} value={6} size={0} checkp={false} permission={{}}  parenting={itm.link} />
//                     })
//                 }

//             </ul>
//         </div>


//         {/* <aside id="default-sidebar" className={`${sidebarOpen ? 'w-64 left-64' : 'w-24 left-24'} duration-650 transition-all from-white to-black fixed top-0 z-40 h-screen -translate-x-full sm:translate-x-0" aria-label="Sidebar`}>
//             <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-primaryLine ">
//                 <div>
//                     <img className="mx-auto h-20 w-auto mb-4" src="/logo.png" alt="Datayog" />
//                 </div>
//                 <ul class="space-y-2 font-medium"> */}

//         {/* {
//                         Roles["Administrator"].map((itm) => {
//                             return nestSidebar(itm)
//                         })
//                     } */}
//         {/* 
//                     {
//                         Roles["Administrator"].map((itm) => {
//                             return <li><MenuItem sidebarOpen={sidebarOpen} itm={itm} value={6} size={0} /></li>
//                         })
//                     }




//                 </ul>
//             </div>
//         </aside> */}
//     </>
// }



// export default Sidebar
import React, { useState } from 'react';

import * as Unicons from '@iconscout/react-unicons';
import MenuItem from './MenuItem';
import { Sidebar_content } from '../utils/sidebar_values';

const Sidebar = ({ sidebarOpen, setsidebarOpenn }) => {


    // localStorag

    let permission=JSON.parse(localStorage.getItem("permission")) || {}
    let user=JSON.parse(localStorage.getItem("user"))
    let rolename=user?.rolename

console.log("FULL SIDEBAR CONFIG:", Sidebar_content.all_routes);

    // const nestSidebar = (itm) => {
    //     return <li>

    //         <div class="flex">
    //             <a href={itm.link} class="flex-80 items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
    //                 {itm.icon}
    //                 <span class="ms-3">{itm.name}</span>
    //             </a>
    //         </div>


    //         {
    //             itm.subMenu ?
    //                 <>
    //                     <span class="text-sm rotate-180" id="arrow">
    //                         <i class="bi bi-chevron-down"></i>
    //                     </span>
    //                     <ul class="space-y-2 font-medium">
    //                         {
    //                             itm?.subMenu.map((itm) => {
    //                                 return nestSidebar(itm)
    //                             })
    //                         }
    //                     </ul>
    //                 </> : <></>
    //         }

    //     </li>
    // }


    let Roles = Sidebar_content

    console.log('open', open)

    return <>

        {/* 
        <div style={{backgroundImage:"linear-gradient(to right, #101c4c, #1b0027)"}} class={`flex justify-between h-16 ml-0 px-3 py-4 overflow-y-auto duration-150 bg-topbarLine dark:bg-topbarLine ${sidebarOpen ? 'sm:ml-64' : 'sm:ml-24'}`}>
            <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" onClick={() => {console.log('sdfjhkhkjshd')
            setsidebarOpenn(prev => !prev)}} aria-controls="default-sidebar" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span class="sr-only">Open sidebar</span>
                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>
            <div className='w-20 pt-2 flex dark:text-white'><span className='text-white pr-1'>Logout</span><Unicons.UilSignout /></div>
        </div> */}

         {/* <Unicons.UilArrowCircleLeft size="36" style={{ color: "white" }} /> */}

        <div className={`${!sidebarOpen && 'w-0 md:w-24'} z-[2000] bg-gray-200 bg-primaryLine dark:bg-primaryLine duration-950 transition-all from-white to-black  fixed top-0 left-0 bottom-0 md:static text-white`}>
            <button onClick={() => { setsidebarOpenn(prev => !prev) }} className={`absolute top-4 right-4 md:hidden border-[1.5px] rounded-full`}>
               
                <Unicons.UilArrowLeft size="28" style={{ color: "white" }} />
            </button>
            <h2 class="text-xl font-semibold mb-4"></h2>
            <img className="mx-auto h-[10vh] w-auto mb-4" src="/logo.png" alt="Datayog" />
            <ul className='space-y-2 h-[84vh] overflow-y-scroll font-medium'>
                {
                    Roles["all_routes"].map((itm) => {
                        return <li><MenuItem sidebarOpen={sidebarOpen} itm={itm} value={6} size={0} checkp={true} permission={permission}  parenting={itm.link}/></li>
                    })
                }
                {
                    [...rolename=="Admin"?Roles[rolename]:[]].map((itm) => {
                        return <li><MenuItem sidebarOpen={sidebarOpen} itm={itm} value={6} size={0} checkp={false} permission={{}}  parenting={itm.link}/></li>
                    })
                }

            </ul>
        </div>


        {/* <aside id="default-sidebar" className={`${sidebarOpen ? 'w-64 left-64' : 'w-24 left-24'} duration-650 transition-all from-white to-black fixed top-0 z-40 h-screen -translate-x-full sm:translate-x-0" aria-label="Sidebar`}>
            <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-primaryLine ">
                <div>
                    <img className="mx-auto h-20 w-auto mb-4" src="/logo.png" alt="Datayog" />
                </div>
                <ul class="space-y-2 font-medium"> */}

        {/* {
                        Roles["Administrator"].map((itm) => {
                            return nestSidebar(itm)
                        })
                    } */}
        {/* 
                    {
                        Roles["Administrator"].map((itm) => {
                            return <li><MenuItem sidebarOpen={sidebarOpen} itm={itm} value={6} size={0} /></li>
                        })
                    }




                </ul>
            </div>
        </aside> */}
    </>
}



export default Sidebar