import axios from "axios";
import { baseUrl, isReadOnlyFrontendMode } from "./url";
import store from "../store";
import ComponentActions from "../store/actions/component-actions";
import CommonActions from "../store/actions/common-actions";
import { ALERTS } from "../store/reducers/component-reducer";

const SAFE_MODE_MESSAGE = "Frontend read-only test mode is enabled. Save/update requests are blocked locally so the server DB is not impacted.";
const BLOCKED_WRITE_PATH_PREFIXES = [
    "/setupConf",
    "/admin/users",
    "/admin/roles",
    "/querybuilder/DBConfig",
    "/querybuilder/saveQuery",
    "/alertConfiguration/configureAlert",
    "/alertConfiguration/schedulerAlert",
    "/mtandaoComplaints",
    "/isonForm",
    "/nokiaprepost",
    "/proRules",
    "/BulkUpload/PrePost",
    "/cxix_scripting/dbUpdate",
    "/cxix_scripting_form",
    "/cxix_audit_form",
    "/discussions/topic",
    "/discussions/message",
    "/tickets/create",
    "/tickets/update",
    "/tickets/message",
];

const showSafeModeAlert = () => {
    store.dispatch(ALERTS({
        show: true,
        icon: "info",
        text: SAFE_MODE_MESSAGE,
        type: 1,
    }));
};

/** Avoid logging full axios response bodies (may contain tokens / PII). */
const logApiError = (error, phase) => {
    if (!import.meta.env.DEV) return;
    const status = error?.response?.status;
    const url = error?.config?.url;
    console.warn(`[api${phase ? `:${phase}` : ""}]`, status ?? "no-status", url ?? "", error?.message ?? error);
};

const normalizePath = (url = "") => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
        try {
            return new URL(url).pathname;
        } catch (_) {
            return url;
        }
    }
    return url;
};

/** Avoid 401 interceptor → `logoutCaller` → `POST /logout` → 401 loop. */
const isLogoutRequest = (config) => normalizePath(config?.url || "") === "/logout";

const shouldBlockMutation = (method, url) => {
    if (!isReadOnlyFrontendMode) return false;
    const lowerMethod = String(method).toLowerCase();
    if (!["post", "put", "patch", "delete"].includes(lowerMethod)) return false;
    const normalizedPath = normalizePath(url);
    if (normalizedPath === "/login" || normalizedPath === "/logout") return false;
    return BLOCKED_WRITE_PATH_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix));
};

const buildBlockedResponse = (url, method) => Promise.resolve({
    status: 423,
    data: {
        msg: SAFE_MODE_MESSAGE,
        blocked: true,
        url,
        method: String(method).toUpperCase(),
    },
});

const guardedRequest = (method, options, runner) => {
    if (shouldBlockMutation(method, options?.url)) {
        showSafeModeAlert();
        return buildBlockedResponse(options?.url, method);
    }
    return runner();
};

const instance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        timeout: 1000,
    },
});

const instancenoload = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        timeout: 1000,
    },
});

const axiosInstanceblobFile = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    responseType: "blob",
    headers: {
        "Content-Type": "application/json",
        timeout: 1000,
    },
});

instance.interceptors.request.use((request) => {
    request.headers.Authorization = "Bearer " + localStorage.getItem("token");
    store.dispatch(ComponentActions.loaders(true));
    return request;
}, (error) => {
    logApiError(error, "request");
});

instance.interceptors.response.use((response) => {
    store.dispatch(ComponentActions.loaders(false));
    return response;
}, (error) => {
    store.dispatch(ComponentActions.loaders(false));
    logApiError(error, "response");
    if (error?.response?.status == 401 && !isLogoutRequest(error?.config)) {
        store.dispatch(CommonActions.logoutCaller(() => {
            window.location.href = "/login";
        }));
    }
    return error?.response;
});

instancenoload.interceptors.request.use((request) => {
    request.headers.Authorization = "Bearer " + localStorage.getItem("token");
    return request;
}, (error) => {
    logApiError(error, "request-noload");
});

instancenoload.interceptors.response.use((response) => {
    return response;
}, (error) => {
    logApiError(error, "response-noload");
    if (error?.response?.status == 401 && !isLogoutRequest(error?.config)) {
        store.dispatch(CommonActions.logoutCaller(() => {
            window.location.href = "/login";
        }));
    }
    return error?.response;
});

axiosInstanceblobFile.interceptors.request.use((request) => {
    request.headers.Authorization = "Bearer " + localStorage.getItem("token");
    return request;
}, (error) => {
    logApiError(error, "request-blob");
});

axiosInstanceblobFile.interceptors.response.use((response) => {
    store.dispatch(ComponentActions.loaders(false));
    return response;
}, (error) => {
    store.dispatch(ComponentActions.loaders(false));
    if (error?.response?.status == 401 && !isLogoutRequest(error?.config)) {
        store.dispatch(CommonActions.logoutCaller(() => {
            window.location.href = "/login";
        }));
    }
    return error?.response;
});

const which = {
    1: instance,
    0: instancenoload,
};

const Api = {
    get: ({ url, contentType = "application/json", inst = 1 }) => {
        return which[inst]({
            method: "GET",
            url,
            headers: {
                "Content-Type": contentType,
            },
        });
    },
    post: ({ data, url, contentType = "application/json", cb = () => {}, inst = 1 }) => {
        return guardedRequest("post", { url }, () => which[inst]({
            method: "POST",
            data,
            url,
            headers: {
                "Content-Type": contentType,
            },
        }).then((res) => {
            cb();
            return res;
        }).catch((err) => err?.response));
    },
    delete: ({ data, url, contentType = "application/json", inst = 1 }) => {
        return guardedRequest("delete", { url }, () => which[inst]({
            method: "DELETE",
            data,
            url,
            headers: {
                "Content-Type": contentType,
            },
        }));
    },
    patch: ({ data, url, contentType = "application/json", cb = () => {}, inst = 1 }) => {
        return guardedRequest("patch", { url }, () => which[inst]({
            method: "PATCH",
            data,
            url,
            headers: {
                "Content-Type": contentType,
            },
        }).then((res) => {
            cb();
            return res;
        }).catch((err) => err?.response));
    },
    put: ({ data, url, contentType = "application/json", inst = 1 }) => {
        return guardedRequest("put", { url }, () => which[inst]({
            method: "PUT",
            data,
            url,
            headers: {
                "Content-Type": contentType,
            },
        }));
    },
    blobFile: ({ url, method, data, contentType = "application/json" }) => {
        return guardedRequest(method, { url }, () => axiosInstanceblobFile({
            method,
            url,
            data,
            responseType: "blob",
            headers: {
                "Content-Type": contentType,
            },
        }));
    },
};

export default Api;
