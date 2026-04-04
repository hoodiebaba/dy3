import { configureStore } from "@reduxjs/toolkit";
import auth from "./reducers/auth-reducer"
import customQuery from "./reducers/customQuery-reducer"
import powerBI from "./reducers/powerBI-reducer"
import component from "./reducers/component-reducer"
import alertConfiguration from "./reducers/alertConfiguration-reducer"
import mtandaoComplaints from "./reducers/mtandaoComplaints-reducer"
import isonForm from "./reducers/isonForm-reducer"
import adminManagement from "./reducers/adminManagement-reducer"
import nokiaPrePost from "./reducers/nokiaPrePost-reducer"
import websocket from "./reducers/websocket-reducer"
import map from "./reducers/map-reducer"
import cxix from "./reducers/cxix-reducer"
import discussion from "./reducers/discussion-reducer"


const store = configureStore({
    reducer: {
        auth,
        customQuery,
        powerBI,
        component,
        alertConfiguration,
        mtandaoComplaints,
        isonForm,
        adminManagement,
        nokiaPrePost,
        websocket,
        map,
        cxix,
        discussion, 

    },
    devTools: true
})


export default store