import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authenticated: Boolean(JSON.parse(localStorage.getItem('authenticated'))),
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    pageName:localStorage.getItem('pageName') || "",
    permission: localStorage.getItem('permission') || null,
    commonConfig: JSON.parse(localStorage.getItem('config')) ?  JSON.parse(localStorage.getItem('config')) : { "mapView": "mapbox://styles/mapbox/standard", "mapScale": "10" }
}

const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        SET_USER: (state, { payload }) => {
            state.user = payload
        },
        SET_TOKEN: (state, { payload }) => {
            state.token = payload
        },
        SET_PAGE_NAME: (state, { payload }) => {
            localStorage.setItem('pageName',payload)
            state.pageName = payload
        },
        SET_AUTHENTICATED: (state, { payload }) => {
            state.authenticated = payload
        },
        SET_COMMON_CONFIG: (state, { payload }) => {




            if (payload.mapView == undefined || payload.mapScale == undefined) {
                state.commonConfig = {
                    ...state.commonConfig,
                    "mapView": "mapbox://styles/mapbox/standard",
                    "mapScale": "10",
                    ...payload
                }
            } else {
                state.commonConfig = {
                    ...state.commonConfig,
                    ...payload
                }

            }


        },
        SET_PERMISSION: (state, { payload }) => {
            state.permission = payload
        },
        RESET_STATE: (state) => {
            state.authenticated = false;
            state.user = null;
            state.token = null;
            state.permission = null;
            state.pageName = "";

        }
    }
})

export const { SET_USER, SET_TOKEN, SET_AUTHENTICATED, SET_PAGE_NAME, SET_PERMISSION, SET_COMMON_CONFIG, RESET_STATE } = auth.actions
export default auth.reducer
