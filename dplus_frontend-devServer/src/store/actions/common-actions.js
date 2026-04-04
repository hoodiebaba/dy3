import Api from "../../utils/api"
import { Urls } from "../../utils/url"
import { SET_AUTHENTICATED, SET_PAGE_NAME, SET_SIDEBAR_MENU, SET_TOKEN, SET_USER } from "../reducers/auth-reducer"

const CommonActions = {
    postApiCaller: (urls, data, cb) => async (dispatch, _) => {
        try {
            const res = await Api.post({ url: urls, data })
            if (res?.status !== 201 && res?.status !== 200) return

            cb()
        } catch {
            /* UI callbacks handle failure; avoid logging full error objects in production */
        }
    },
    setLastName: (reset,name) => async (dispatch, _) => {
        dispatch(SET_PAGE_NAME(name))
    },
    /** @returns {Promise<{ serverLogoutOk: boolean }>} */
    logoutCaller: (cb = () => {}) => async (dispatch, _) => {
        let serverLogoutOk = false
        try {
            const res = await Api.post({ url: Urls.logout, data: {}, inst: 0 })
            serverLogoutOk = Boolean(res && res.status >= 200 && res.status < 300)
        } catch {
            /* Network / server error — still clear client session */
        }
        localStorage.setItem("auth", false)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("pageName")

        dispatch(SET_SIDEBAR_MENU(null))
        dispatch(SET_TOKEN(""))
        dispatch(SET_USER(null))
        dispatch(SET_AUTHENTICATED(false))

        cb()
        return { serverLogoutOk }
    },
    getApiCaller: (urls, cb) => async (dispatch, _) => {
        try {
            const res = await Api.get({ url: urls })
            if (res?.status !== 201 && res?.status !== 200) return

            cb()
        } catch {
            /* see postApiCaller */
        }
    },
    deleteApiCaller: (urls, cb) => async (dispatch, _) => {
        try {
            const res = await Api.delete({ url: urls })

            if (![200, 201, 204].includes(res?.status)) return;
           // if (res?.status !== 201 && res?.status !== 200) return

            cb()
        } catch {
            /* see postApiCaller */
        }
    },
    commondownload: (urls, filename, method = "GET", data = {}, cb) => async (dispatch, _) => {
        // (reqUrl, data).then((response) => {

        const res = await Api.blobFile({ url: urls, method: method, data: data })

        filename = filename?filename:urls.split("/").pop()

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filename}`);
        document.body.appendChild(link);
        link.click();
    }
}


export default CommonActions;