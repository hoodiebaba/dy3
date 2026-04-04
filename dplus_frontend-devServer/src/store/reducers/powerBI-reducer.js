import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    powerBiReportConf: {}
}

const powerBI = createSlice({
    name: "powerBI",
    initialState,
    reducers: {
        POWERBI_REPORT_CONF: (state, { payload }) => {
            state.powerBiReportConf = payload
        },
        RESET_STATE: (state) => {
            state.powerBiReportConf = {};
        }
    }
})

export const { POWERBI_REPORT_CONF, RESET_STATE } = powerBI.actions
export default powerBI.reducer
