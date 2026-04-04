import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    socket_setup: null,
    data_from_socket:{}
}

const component = createSlice({
    name: "websocket",
    initialState,
    reducers: {
        SETUP_SOCKET: (state, { payload }) => {

            console.log("socket_setup", payload, "payload")
            state.socket_setup = payload
        },
        DATA_FROM_SOCKET: (state, { payload }) => {

            console.log("socket_setup", payload, "ho gya hai payload")
            // state.data_from_socket = payload
            state.data_from_socket = {
                ...state.data_from_socket,
                [payload.name]:payload.value
            }
        },
        CLEAR_DATA_FROM_SOCKET: (state, { payload }) => {

            console.log("CLEAR_DATA_FROM_SOCKET", payload, "ho gya hai  payload")
            // const { [payload]: _, ...rest } = state.data_from_socket;
            state.data_from_socket = {}

            // state.data_from_socket={
            //     ...state.data_from_socket
            // }
            // delete state.data_from_socket[payload.name]
            // state.data_from_socket = {
            //     ...state.data_from_socket,
            //     [payload.name]:payload.value
            // }

            // state.data_from_socket = payload
            // state.data_from_socket = {
            //     ...state.data_from_socket,
            //     [payload.name]:payload.value
            // }
        },
        RESET_STATE: (state) => {
            state.alerts = {};
            state.powerBiReportConf = {};
        }
    }
})

export const { SETUP_SOCKET,DATA_FROM_SOCKET,CLEAR_DATA_FROM_SOCKET } = component.actions
export default component.reducer
