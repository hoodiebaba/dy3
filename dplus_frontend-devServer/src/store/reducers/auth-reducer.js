import { createSlice } from "@reduxjs/toolkit";

const safeParse = (value, fallback = null) => {
    if (value == null) return fallback
    try {
        return JSON.parse(value)
    } catch (_) {
        return fallback
    }
}

const parsedConfig = safeParse(localStorage.getItem('config'), null)

const readStoredSidebarMenu = () => {
    try {
        const raw = sessionStorage.getItem("dy3_sidebar_menu");
        if (!raw) return null;
        const p = JSON.parse(raw);
        return Array.isArray(p) && p.length ? p : null;
    } catch {
        return null;
    }
};

const initialState = {
    authenticated: Boolean(safeParse(localStorage.getItem('authenticated'), false)),
    user: safeParse(localStorage.getItem('user'), null),
    token: localStorage.getItem('token') || null,
    pageName:localStorage.getItem('pageName') || "",
    permission: localStorage.getItem('permission') || null,
    commonConfig: parsedConfig ? parsedConfig : { "mapView": "mapbox://styles/mapbox/standard", "mapScale": "10" },
    /** Raw `menu` array from `GET /me` — drives Sidebar when present */
    sidebarMenu: readStoredSidebarMenu(),
}

const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        SET_USER: (state, { payload }) => {
            if (payload == null || payload === "") {
                state.user = null
                return
            }
            if (typeof payload === "string") {
                state.user = safeParse(payload, null)
                return
            }
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
        SET_SIDEBAR_MENU: (state, { payload }) => {
            state.sidebarMenu = payload;
            try {
                if (Array.isArray(payload) && payload.length) {
                    sessionStorage.setItem("dy3_sidebar_menu", JSON.stringify(payload));
                } else {
                    sessionStorage.removeItem("dy3_sidebar_menu");
                }
            } catch {
                /* ignore quota / private mode */
            }
        },
        RESET_STATE: (state) => {
            state.authenticated = false;
            state.user = null;
            state.token = null;
            state.permission = null;
            state.pageName = "";
            state.sidebarMenu = null;
            try {
                sessionStorage.removeItem("dy3_sidebar_menu");
            } catch {
                /* ignore */
            }
        }
    }
})

export const { SET_USER, SET_TOKEN, SET_AUTHENTICATED, SET_PAGE_NAME, SET_PERMISSION, SET_COMMON_CONFIG, SET_SIDEBAR_MENU, RESET_STATE } = auth.actions
export default auth.reducer
