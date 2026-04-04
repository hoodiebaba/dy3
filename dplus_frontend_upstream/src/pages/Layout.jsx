import React, { useEffect, useState } from 'react';
import * as Unicons from '@iconscout/react-unicons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Layout = ({ child,sidebarPos, setSidebarPos,sidebarOpen }) => {

    // const [sidebarOpen, setsidebarOpenn] = useState(true)


    // SELECT dbConfig.*,'**********' AS A ,'**********' AS B,'**********' AS C,'**********' AS D,'**********' AS E,'**********' AS F,'**********' AS G FROM dbConfig;
    const navigate = useNavigate()
    const [Width, setWidth] = useState(window.innerWidth)

    const handleResize = () => {
        console.log(window, "windowwindow");
        // setWidth(window.innerWidth, "windowwindow");
        setWidth(window.innerWidth);
        console.log(window.innerHeight, "windowwindow");
    };


    // console.log(Boolean(checkauth), "checkAuthcheckAuth")

    // if(checkAuth==false){
    //     navigate("/login")
    // }

    let checkAuth = localStorage.getItem("auth")

    console.log(checkAuth, "statestatestatestate")

    // let checkauth;
    // useEffect(() => {
    //     if (checkAuth == "false") {
    //            navigate('/login')
    //     }

    //     window.addEventListener('resize', handleResize);
    // }, [checkAuth])


    // 1️⃣ Auth check (runs only when auth changes)
useEffect(() => {
  if (checkAuth === "false") {
    navigate('/login');
  }
}, [checkAuth, navigate]);


// 2️⃣ Window resize listener (runs ONCE)
useEffect(() => {
  window.addEventListener('resize', handleResize);

  // cleanup (CRITICAL)
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

    return <>

        {/* <Sidebar sidebarOpen={sidebarOpen} setsidebarOpenn={setsidebarOpenn}/> */}
        {/* <div style={{width:Width}} className={`flex-1 h-full bg-white p-2 overflow-y-scroll`}> */}
        <div  className={`flex-1 bg-white p-0 overflow-y-scroll relative  ${sidebarPos=="v"?"h-72vh":"h-[70vh]"} ${!sidebarOpen ? 'w-[100vw]': 'w-80 md:w-[66vw] lg:w-[70vw] xl:w-[78vw]'}`}>
            {/* <div class="flex-1 bg-white p-4"> */}
            {child}
        </div>



    </>
};

export default Layout;
