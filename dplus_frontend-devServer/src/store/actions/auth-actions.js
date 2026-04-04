import Api from "../../utils/api"
import { Urls } from "../../utils/url"
import {
    SET_AUTHENTICATED,
    SET_COMMON_CONFIG,
    SET_PERMISSION,
    SET_SIDEBAR_MENU,
    SET_TOKEN,
    SET_USER,
} from "../reducers/auth-reducer"
import CommonActions from "./common-actions"
import { isReadOnlyFrontendMode } from "../../utils/url"

/** Single user-facing message for login failures (no raw API dump in UI). */
const loginErrorMessage = (res) => {
    if (!res || res.status == null) {
        return "Unable to reach the server. Check your connection and try again."
    }
    const raw =
        res?.data?.msg ??
        res?.data?.message ??
        res?.data?.error ??
        (typeof res?.data === "string" ? res.data : null)
    if (raw && String(raw).trim()) return String(raw).trim()
    const s = res.status
    if (s === 400 || s === 401) return "Invalid username or password."
    if (s === 403) return "Access denied."
    if (s === 429) return "Too many attempts. Please try again later."
    if (s >= 500) return "Server error. Please try again later."
    return "Sign-in failed. Please try again."
}

/** Load role-based menu + profile fields from Flask `GET /me` (see dplus-apis.postman_collection). */
const fetchMe = () => async (dispatch) => {
    try {
        if (!localStorage.getItem("token")) {
            dispatch(SET_SIDEBAR_MENU(null))
            return { ok: false }
        }
        const res = await Api.get({ url: Urls.me, inst: 0 })
        if (res?.status !== 200 || !res?.data) {
            return { ok: false }
        }

        const { menu, user: meUser } = res.data
        if (Array.isArray(menu) && menu.length > 0) {
            dispatch(SET_SIDEBAR_MENU(menu))
        } else {
            dispatch(SET_SIDEBAR_MENU(null))
        }

        if (meUser && typeof meUser === "object") {
            try {
                const raw = localStorage.getItem("user")
                const u = raw ? JSON.parse(raw) : {}
                const merged = { ...u, ...meUser }
                localStorage.setItem("user", JSON.stringify(merged))
                dispatch(SET_USER(merged))
            } catch {
                /* ignore */
            }
        }
        return { ok: true }
    } catch {
        dispatch(SET_SIDEBAR_MENU(null))
        return { ok: false }
    }
}

/** Large base64 avatars can exceed gateway limits — skip in PATCH, still kept in localStorage from Profile. */
const MAX_AVATAR_PATCH_LENGTH = 80_000

/**
 * Try PATCH `/me` so profile changes can persist server-side when the API supports it.
 * @returns {Promise<{ serverSynced: boolean }>}
 */
const saveProfile = (mergedUser) => async (dispatch) => {
    if (isReadOnlyFrontendMode || !localStorage.getItem("token")) {
        return { serverSynced: false }
    }
    const body = {
        name: mergedUser?.name,
        fullName: mergedUser?.fullName,
        username: mergedUser?.username,
        email: mergedUser?.email,
        phone: mergedUser?.phone,
        title: mergedUser?.title,
    }
    const av = mergedUser?.avatar
    if (av && String(av).length <= MAX_AVATAR_PATCH_LENGTH) {
        body.avatar = av
    }
    try {
        const res = await Api.patch({ url: Urls.me, data: body, inst: 0 })
        if (res?.status >= 200 && res?.status < 300) {
            await dispatch(fetchMe())
            return { serverSynced: true }
        }
    } catch {
        /* fall through */
    }
    return { serverSynced: false }
}

const AuthActions = {
    fetchMe,
    saveProfile,
    /** @returns {Promise<{ ok: boolean, message?: string }>} */
    signIn: (data, cb) => async (dispatch, _) => {
        try {
            /* inst:0 — avoid global full-screen loader; Login page has its own loading state */
            const res = await Api.post({ url: Urls.login, data, inst: 0 })

            if (!res || res.status == null) {
                return { ok: false, message: loginErrorMessage(null) }
            }

            if (res.status !== 200) {
                return { ok: false, message: loginErrorMessage(res) }
            }

            const user = res.data
            if (!user?.idToken) {
                return { ok: false, message: "Invalid response from server. Please contact support." }
            }

            let dataFiw = user.confdata
            if (dataFiw?.mapScale == undefined) {
                dataFiw = {
                    ...dataFiw,
                    mapScale: "10",
                }
            }
            if (dataFiw?.mapView == undefined) {
                dataFiw = {
                    ...dataFiw,
                    mapView: "mapbox://styles/mapbox/standard",
                }
            }
            const serializedPermission =
                typeof user.permission === "string"
                    ? user.permission
                    : JSON.stringify(user.permission ?? null)

            localStorage.setItem("user", JSON.stringify(user))
            localStorage.setItem("token", user.idToken)
            localStorage.setItem("permission", serializedPermission)
            localStorage.setItem("auth", true)
            localStorage.setItem("config", JSON.stringify(dataFiw))
            dispatch(SET_TOKEN(user.idToken))
            dispatch(SET_PERMISSION(serializedPermission))
            dispatch(SET_USER(user))
            dispatch(SET_AUTHENTICATED(true))
            dispatch(SET_COMMON_CONFIG(dataFiw))

            dispatch(CommonActions.setLastName(true, ""))
            await dispatch(fetchMe())
            cb()
            return { ok: true }
        } catch (error) {
            if (import.meta.env.DEV) console.warn("[auth] signIn", error?.message)
            return { ok: false, message: "Something went wrong. Please try again." }
        }
    },
    setupConf: (reset, data, cb) => async (dispatch, _) => {
        try {
            let res = await Api.post({ data: data, url: Urls.setupConf })
            if (res?.status !== 201 && res?.status !== 200) return

            localStorage.setItem("config", JSON.stringify(res?.data?.data))
            dispatch(SET_COMMON_CONFIG(res?.data?.data))
            cb()
        } catch (error) {
            if (import.meta.env.DEV) console.warn("[auth] setupConf", error?.message)
        }
    },
}

export default AuthActions
