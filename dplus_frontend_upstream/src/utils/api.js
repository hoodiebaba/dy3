import axios from "axios";
import { baseUrl } from "./url";
import { useDispatch } from "react-redux";
import store from "../store";
import ComponentActions from "../store/actions/component-actions";
import CommonActions from "../store/actions/common-actions";


const instance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "timeout": 1000
    }
});

const instancenoload = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "timeout": 1000
    }
});

const axiosInstanceblobFile = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    responseType: 'blob',
    headers: {
        "Content-Type": "application/json",
        "timeout": 1000
    }
});


instance.interceptors.request.use((request) => {
    request.headers['Authorization'] = "Bearer " + localStorage.getItem("token")

    store.dispatch(ComponentActions.loaders(true))
    return request
}, (error) => {
    // store.dispatch(ComponentActions.loaders(false))
    console.error(error.message, 'hgfhjdhgf')
})

instance.interceptors.response.use((response) => {
    store.dispatch(ComponentActions.loaders(false))
    console.log(response, "responseresponseresponse")
    return response
}, (error) => {
    store.dispatch(ComponentActions.loaders(false))
    console.error(error?.response, 'hgfhjdhgf')
    if (error?.response?.status==401) {
        store.dispatch(CommonActions.logoutCaller(()=>{
            window.location.href = '/login';
        }))
    }
    return error?.response
})


instancenoload.interceptors.request.use((request) => {
    request.headers['Authorization'] = "Bearer " + localStorage.getItem("token")

    // store.dispatch(ComponentActions.loaders(true))
    return request
}, (error) => {
    // store.dispatch(ComponentActions.loaders(false))
    console.error(error.message, 'hgfhjdhgf')
})

instancenoload.interceptors.response.use((response) => {
    // store.dispatch(ComponentActions.loaders(false))
    console.log(response, "responseresponseresponse")
    return response
}, (error) => {
    // store.dispatch(ComponentActions.loaders(false))
    console.error(error?.response, 'hgfhjdhgf')
    if (error?.response?.status==401) {
        store.dispatch(CommonActions.logoutCaller(()=>{
            window.location.href = '/login';
        }))
    }
    return error?.response
})




axiosInstanceblobFile.interceptors.request.use((request) => {
    request.headers['Authorization'] = "Bearer " + localStorage.getItem("token")
    return request
}, (error) => {
    console.error(error.message, 'hgfhjdhgf')
    // store.dispatch(Notify.loading(false))
    // store.dispatch(Notify.error(error.message))
})


axiosInstanceblobFile.interceptors.response.use((response) => {
    store.dispatch(ComponentActions.loaders(false))
    return response
}, (error) => {

    store.dispatch(ComponentActions.loaders(false))
    if (error?.response?.status==401) {
        store.dispatch(CommonActions.logoutCaller(()=>{
            window.location.href = '/login';
        }))
    }
    // store.dispatch(ComponentActions.loaders(false))
    
    return error?.response 
})


let which={
    1:instance,
    0:instancenoload
}



const Api = {
    get: ({ url, contentType = "application/json", show = 1,inst=1 }) => {
        return which[inst]({
            method: "GET",
            url,
            headers: {
                'Content-Type': contentType
            }
        })
    },
    post: ({ data, url, contentType = "application/json", show = 1, upload = false, cb = () => { },inst=1 }) => {
        console.log(data, url)
        return which[inst]({
            method: "POST",
            data,
            url,
            headers: {
                'Content-Type': contentType
            }
        }).then(res => {
            console.log(res)
            // store.dispatch(Notify.progress(null));
            cb();
            console.log("yyyyyyyyy", res, typeof res);
            console.log("yyyyyyyyyy res.data", res.data, typeof res.data);
            return res;
        }).catch(err => {
            console.log(err)
            // store.dispatch(Notify.progress(null));
            return err.response
        })
    },
    delete: ({ data, url, contentType = "application/json", show = 1,inst=1 }) => {
        return which[inst]({
            method: "DELETE",
            data,
            url,
            headers: {
                'Content-Type': contentType
            }
        })
    },
    patch: ({ data, url, contentType = "application/json", show = 1, upload = false, cb = () => { },inst=1 }) => {
        return which[inst]({
            method: "PATCH",
            data,
            url,
            headers: {
                'Content-Type': contentType
            },
            ...(upload && {
                onUploadProgress: e => {
                    store.dispatch(Notify.progress((parseInt((e.loaded * 100) / e.total))));
                }
            })
        }).then(res => {
            // store.dispatch(Notify.progress(null));
            cb();
            return res;
        }).catch(err => {
            // store.dispatch(Notify.progress(null));
            return
        })
    },
    put: ({ data, url, contentType = "application/json", show = 1,inst=1 }) => {
        return which[inst]({
            method: "PUT",
            data,
            url,
            headers: {
                'Content-Type': contentType
            }
        })
    },
    blobFile: ({ url, method, data, contentType = "application/json", show = 1,inst=1 }) => {
        return axiosInstanceblobFile({
            method: method,
            url,
            data,
            responseType: 'blob',
            headers: {
                'Content-Type': contentType
            }
        })
    }
}


export default Api;