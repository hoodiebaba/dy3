
import React from 'react';
import { Sidebar_content } from './utils/sidebar_values';
import { Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import BIDashboard from './pages/InsightsEngine/BIDashboard';
import Profile from './pages/Profile';

const safeParse = (value) => {
    if (!value) return null
    try {
        return JSON.parse(value)
    } catch (_) {
        return value
    }
}

const Navigation = ({ sidebarOpen,sidebarPos, setSidebarPos }) => {


    let permission=safeParse(localStorage.getItem("permission"))
    let user=safeParse(localStorage.getItem("user"))
    let rolename=user?.rolename

    const routeItems = [
        ...(Sidebar_content["all_routes"] || []),
        ...(Sidebar_content["GlobalUrl"] || []),
        ...(rolename === "Admin" ? (Sidebar_content[rolename] || []) : []),
    ]

    const RouteCreator = (itm) => {
        if (!itm) return []

        if (Array.isArray(itm.subMenu) && itm.subMenu.length > 0) {
            return itm.subMenu.flatMap((oneItm) => RouteCreator(oneItm))
        }

        if (!itm.component || !itm.link) {
            return []
        }

        return [
            <Route
                key={itm.link}
                path={itm.link}
                element={<Layout sidebarOpen={sidebarOpen} child={itm.component} sidebarPos={sidebarPos} setSidebarPos={setSidebarPos} />}
            />
        ]
    }

    return (
        <Routes>
            <Route path="/profile" element={<Layout sidebarOpen={sidebarOpen} child={<Profile />} sidebarPos={sidebarPos} setSidebarPos={setSidebarPos} />} />
            {routeItems.flatMap((itm) => RouteCreator(itm))}
        </Routes>
    )

};

export default Navigation;
