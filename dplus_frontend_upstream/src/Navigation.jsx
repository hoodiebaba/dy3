
import React from 'react';
import { Sidebar_content } from './utils/sidebar_values';
import { Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import BIDashboard from './pages/InsightsEngine/BIDashboard';


const Navigation = ({ sidebarOpen,sidebarPos, setSidebarPos }) => {


    let permission=JSON.parse(localStorage.getItem("permission"))
    let user=JSON.parse(localStorage.getItem("user"))
    let rolename=user?.rolename
    const RouteCreator = (itm) => {

        // { console.log("RouteCreatoritmitmitm 16", itm.subMenu) }

        if (itm.subMenu.length > 0) {
            // console.log(itm.subMenu,"RouteCreatoritmitmitm 19")
            return itm.subMenu.map((oneItm) => {
                return RouteCreator(oneItm)
            })

        } else {

            if (itm.component) {
                // console.log(itm.link, itm.component, "RouteCreatoritmitmitm 26")
                return <Route key={itm.link} path={itm.link} element={<Layout sidebarOpen={sidebarOpen} child={itm.component}  sidebarPos={sidebarPos} setSidebarPos={setSidebarPos} />} />
            }else{
                return <Route key={""} path={""} element={<Layout sidebarOpen={sidebarOpen} child={""}  sidebarPos={sidebarPos} setSidebarPos={setSidebarPos} />} />
            }
        }

    }
    return <Routes>
        {
            [...Sidebar_content["all_routes"], ...Sidebar_content["GlobalUrl"],...rolename=="Admin"?Sidebar_content[rolename]:[]].map((itm) => {

                // console.log("RouteCreatorRouteCreator", RouteCreator(itm))
                return RouteCreator(itm)
            })
        }
{/* 
        {
            console.log("dsdsadadaas",
                [...Sidebar_content["all_routes"], ...Sidebar_content["GlobalUrl"]].map((itm) => {

                    console.log("RouteCreatorRouteCreator", RouteCreator(itm))
                    return RouteCreator(itm)
                })
                
            )
        } */}
    </Routes>

};

export default Navigation;
