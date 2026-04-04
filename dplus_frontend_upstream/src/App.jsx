// import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import Login from './pages/Login'

// import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
// import Dashboard from './pages/Dashboard'
// import Layout from './pages/Layout'
// import DataPlusAnalytics from './pages/DataPlusAnalytics'
// import LaverView from './pages/LaverView'
// import RunQuery from './pages/CustomQuery/RunQuery'
// import CommonForm from './components/CommonForm'
// import DBConfig from './pages/CustomQuery/DBConfig'
// import Modal from './components/Modal'
// import TopBar from './components/TopBar'
// import BIDashboard from './pages/InsightsEngine/BIDashboard'
// import QueryBuilderComponent from './pages/CustomQuery/QueryBuilder'
// import { PowerBIEmbed } from 'powerbi-client-react'
// import { Sidebar_content } from './utils/sidebar_values'
// import Navigation from './Navigation'
// import SweetAlerts from './components/SweetAlerts'
// import { useSelector } from 'react-redux'
// import Loaders from './components/Loaders'
// import Sidebar from './components/Sidebar'
// import WebSocketClient from './components/WebSocketClient'
// import Home from './pages/Home'

// import ProtectedRoute from "./ProtectedRoute";

// function App() {
//     const [count, setCount] = useState(0)
//     const navigate = useNavigate()

//     const [sidebarOpen, setsidebarOpenn] = useState(true)
//     const [sidebarOpn, setSidebarOpen] = useState(false);


//     const [sidebarPos, setSidebarPos] = useState("v")
//     // if(1==1){
//     //     setSidebarPos("h")
//     // }else{
//     //     setSidebarPos("v")
//     // }

//     // let checkAuth = localStorage.getItem("auth")

//     // if (checkAuth == undefined || checkAuth == false) {
//     //     localStorage.setItem("auth", false)
//     //     navigate("/login")
//     // }

// useEffect(() => {
//     const checkAuth = localStorage.getItem("auth");

//     if (!checkAuth || checkAuth === "false") {
//         localStorage.setItem("auth", "false");
//         navigate("/login");
//     }
// }, [navigate]);


//     // let checkAuth = useSelector((state) => {
//     //     let interdata=state?.auth?.authenticated
//     //     return interdata
//     // })

//     let locdata = useLocation()


//     // console.log(locdata, "locdatalocdata")

//     return (
//         <main className='flex h-screen overflow-y-scroll bg-gray-200'>
//         {/* <main className='relative flex h-screen overflow-hidden bg-gray-200'> */}

//             {
//                 locdata.pathname != "/login" && <WebSocketClient />
//             }
//             {/* 

//             <div class="flex">

//                 <div class="w-1/4 bg-gray-200 p-4">
//                     <h2 class="text-xl font-semibold mb-4">Sidebar</h2>
//                     <ul>
//                         <li><a href="#" class="text-blue-500 hover:underline">Link 1</a></li>
//                         <li><a href="#" class="text-blue-500 hover:underline">Link 2</a></li>
//                         <li><a href="#" class="text-blue-500 hover:underline">Link 3</a></li>
//                     </ul>
//                 </div>

//                 <div class="flex-1 bg-white p-4">
//                     <h1 class="text-2xl font-semibold mb-4">Main Content</h1>
//                     <p>This is the main content of your page.</p>
//                 </div>

//             </div> */}

//             {/* <div class="flex"> */}

//             {/* <div class="flex flex-1"> */}


//             {/* <Layout sidebarOpen={sidebarOpen} child={<QueryBuilderComponent />} />  */}

//             <Routes>
//                  {/* Public Route */}
//                 <Route path='/login' element={<Login />} />

//                  {/* Protected Routes */}
//                 <Route
//                     path="/*"
//                     element={
//                     <ProtectedRoute>
//                         <div className="flex flex-1 flex-col">
//                                 <TopBar sidebarOpen={sidebarOpen} sidebarPos={sidebarPos} setSidebarPos={setSidebarPos} setsidebarOpenn={setsidebarOpenn} />
//                         <div className="flex flex-1">
//                                 <Sidebar sidebarPos={sidebarPos} setSidebarPos={setSidebarPos} sidebarOpen={sidebarOpen} setsidebarOpenn={setsidebarOpenn} />
//                                 <Navigation sidebarPos={sidebarPos} setSidebarPos={setSidebarPos} sidebarOpen={sidebarOpen} />
//                         </div>
//                         </div>
//                     </ProtectedRoute>
//                     }
//                 />
//             </Routes>
//             {/* {
//                 locdata.pathname != "/login" ?
//                     <div className={`flex flex-1 ${sidebarPos == "h" ? "flex-row" : "flex-col"}`}>

//                         <TopBar sidebarOpen={sidebarOpen} sidebarPos={sidebarPos} setSidebarPos={setSidebarPos} setsidebarOpenn={setsidebarOpenn} />
//                         <div className={`flex 91vh relative flex-1 ${sidebarPos == "h" ? "flex-row" : "flex-row"}`}>
//                             <Sidebar sidebarPos={sidebarPos} setSidebarPos={setSidebarPos} sidebarOpen={sidebarOpen} setsidebarOpenn={setsidebarOpenn} /> */}
//                                 {/* CONTENT AREA ONLY */}
//                                     {/* <div className="relative flex-1 overflow-auto"> */}
//                                         {/* <Navigation sidebarPos={sidebarPos} setSidebarPos={setSidebarPos} sidebarOpen={sidebarOpen} /> */}
//                                     {/* </div> */}
//                         {/* </div>

//                     </div>
//                     : <></>
//             } */}

//             {/* <div className='flex-1'>
//                     <BIDashboard />
//                 </div> */}
//             {/* </div> */}

//             {/* <div class="flex-1 bg-white p-4"> */}

//             {/* <Layout child={<DBConfig />} /> */}

//             {/* </div> */}

//             {/* </div> */}
//             {/* <div className='grid grid-cols-12'>
//                 <div className='bg-red-900 col-span-2'>
                    
//                 </div>
//                 <div className='bg-blue-900 col-span-10'>
//                     hiii
//                 </div>

//             </div> */}


//             {/* <Modal size={"xl"} children={<>Hello</>} isOpen={sidebarOpen} setIsOpen={setsidebarOpenn}/> */}
//             {/* <Layout child={<RunQuery />}/> */}
//             {/* <CommonForm/> */}
//             {/* <Routes>
//                 <Route path='/login' element={<Login />} />



//                 <Route path='/' element={1==2} >

//                     <Route path='/' element={<Layout child={<DataPlusAnalytics />} />} />
//                     <Route path='/dataPlusAnaltyics' element={<Layout child={<DataPlusAnalytics />} />} />
//                     <Route path='/laverView' element={<Layout child={<LaverView />} />} />
//                     <Route path='/custom_query/run_query' element={<Layout child={<RunQuery />} />} />
//                 </Route>

//             </Routes> */}


//             {/* <QueryBuilderComponent/> */}

//             <Loaders />

//             <SweetAlerts />

//         </main >


//         // <div className="min-h-screen min-w-screen">
//         // <div>

//         //     {/* <Login/> */}
//         // </div>
//     )
// }

// export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Layout from './pages/Layout'
import DataPlusAnalytics from './pages/DataPlusAnalytics'
import LaverView from './pages/LaverView'
import RunQuery from './pages/CustomQuery/RunQuery'
import CommonForm from './components/CommonForm'
import DBConfig from './pages/CustomQuery/DBConfig'
import Modal from './components/Modal'
import TopBar from './components/TopBar'
import BIDashboard from './pages/InsightsEngine/BIDashboard'
import QueryBuilderComponent from './pages/CustomQuery/QueryBuilder'
import { PowerBIEmbed } from 'powerbi-client-react'
import { Sidebar_content } from './utils/sidebar_values'
import Navigation from './Navigation'
import SweetAlerts from './components/SweetAlerts'
import { useSelector } from 'react-redux'
import Loaders from './components/Loaders'
import Sidebar from './components/Sidebar'
import WebSocketClient from './components/WebSocketClient'

function App() {
    const [count, setCount] = useState(0)
    const navigate = useNavigate()

    const [sidebarOpen, setsidebarOpenn] = useState(true)
    const [sidebarOpn, setSidebarOpen] = useState(false);


    const [sidebarPos, setSidebarPos] = useState("v")
    // if(1==1){
    //     setSidebarPos("h")
    // }else{
    //     setSidebarPos("v")
    // }

    let checkAuth = localStorage.getItem("auth")

    if (checkAuth == undefined || checkAuth == false) {
        localStorage.setItem("auth", false)
        navigate("/login")
    }



    // let checkAuth = useSelector((state) => {
    //     let interdata=state?.auth?.authenticated
    //     return interdata
    // })

    let locdata = useLocation()


    // console.log(locdata, "locdatalocdata")

    return (
        <main className='flex h-screen overflow-hidden bg-gray-200'>
{/* <main className='relative flex h-screen overflow-hidden bg-gray-200'> */}

            {
                locdata.pathname != "/login" && <WebSocketClient />
            }
            {/* 

            <div class="flex">

                <div class="w-1/4 bg-gray-200 p-4">
                    <h2 class="text-xl font-semibold mb-4">Sidebar</h2>
                    <ul>
                        <li><a href="#" class="text-blue-500 hover:underline">Link 1</a></li>
                        <li><a href="#" class="text-blue-500 hover:underline">Link 2</a></li>
                        <li><a href="#" class="text-blue-500 hover:underline">Link 3</a></li>
                    </ul>
                </div>

                <div class="flex-1 bg-white p-4">
                    <h1 class="text-2xl font-semibold mb-4">Main Content</h1>
                    <p>This is the main content of your page.</p>
                </div>

            </div> */}

            {/* <div class="flex"> */}

            {/* <div class="flex flex-1"> */}


            {/* <Layout sidebarOpen={sidebarOpen} child={<QueryBuilderComponent />} />  */}

            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/' elemsent={<h1>Hello</h1>} />
            </Routes>
            {
                locdata.pathname != "/login" ?
                    <div className={`flex flex-1 ${sidebarPos == "h" ? "flex-row" : "flex-col"}`}>

                        <TopBar sidebarOpen={sidebarOpen} sidebarPos={sidebarPos} setSidebarPos={setSidebarPos} setsidebarOpenn={setsidebarOpenn} />
                        <div className={`flex 91vh relative flex-1 ${sidebarPos == "h" ? "flex-row" : "flex-row"}`}>
                            <Sidebar sidebarPos={sidebarPos} setSidebarPos={setSidebarPos} sidebarOpen={sidebarOpen} setsidebarOpenn={setsidebarOpenn} />
                                {/* CONTENT AREA ONLY */}
                                    {/* <div className="relative flex-1 overflow-auto"> */}
                                        <Navigation sidebarPos={sidebarPos} setSidebarPos={setSidebarPos} sidebarOpen={sidebarOpen} />
                                    {/* </div> */}
                        </div>

                    </div>
                    : <></>
            }

            {/* <div className='flex-1'>
                    <BIDashboard />
                </div> */}
            {/* </div> */}

            {/* <div class="flex-1 bg-white p-4"> */}

            {/* <Layout child={<DBConfig />} /> */}

            {/* </div> */}

            {/* </div> */}
            {/* <div className='grid grid-cols-12'>
                <div className='bg-red-900 col-span-2'>
                    
                </div>
                <div className='bg-blue-900 col-span-10'>
                    hiii
                </div>

            </div> */}


            {/* <Modal size={"xl"} children={<>Hello</>} isOpen={sidebarOpen} setIsOpen={setsidebarOpenn}/> */}
            {/* <Layout child={<RunQuery />}/> */}
            {/* <CommonForm/> */}
            {/* <Routes>
                <Route path='/login' element={<Login />} />



                <Route path='/' element={1==2} >

                    <Route path='/' element={<Layout child={<DataPlusAnalytics />} />} />
                    <Route path='/dataPlusAnaltyics' element={<Layout child={<DataPlusAnalytics />} />} />
                    <Route path='/laverView' element={<Layout child={<LaverView />} />} />
                    <Route path='/custom_query/run_query' element={<Layout child={<RunQuery />} />} />
                </Route>

            </Routes> */}


            {/* <QueryBuilderComponent/> */}

            <Loaders />

            <SweetAlerts />

        </main >


        // <div className="min-h-screen min-w-screen">
        // <div>

        //     {/* <Login/> */}
        // </div>
    )
}

export default App

