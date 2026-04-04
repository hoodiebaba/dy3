import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    popmenu: "",
    alerts:{},
    loader:false,
    table_pagination:""
}

const component = createSlice({
    name: "component",
    initialState,
    reducers: {
        POP_MENU: (state, { payload }) => {
            console.log(state.popmenu,payload,"payloadpayloadpayload")
            state.popmenu = state.popmenu!=payload?payload:""
        },
        TABLE_PAGINATON: (state, { payload }) => {
            state.table_pagination=payload
        },
        ALERTS:(state, { payload }) => {
            state.alerts=payload
        },
        LOADERS:(state, { payload }) => {
            state.loader=payload
        },
        RESET_STATE: (state) => {
            state.alerts={};
            state.powerBiReportConf = {};
        }
    }
})

export const { POP_MENU,ALERTS, TABLE_PAGINATON,LOADERS, RESET_STATE } = component.actions
export default component.reducer
