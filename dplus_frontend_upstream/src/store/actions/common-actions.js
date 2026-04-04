import Api from "../../utils/api"
import { SET_AUTHENTICATED, SET_PAGE_NAME, SET_TOKEN, SET_USER } from "../reducers/auth-reducer"
import { ALERTS } from "../reducers/component-reducer"

const CommonActions = {
    postApiCaller: (urls, data, cb) => async (dispatch, _) => {
        try {
            console.log("CommonPostActions.postApiCaller")
            const res = await Api.post({ url: urls, data })
            if (res?.status !== 201 && res?.status !== 200) return

            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    setLastName: (reset,name) => async (dispatch, _) => {
        dispatch(SET_PAGE_NAME(name))
    },
    logoutCaller: (cb=()=>{}) => async (dispatch, _) => {
        try {
            // console.log("CommonPostActions.postApiCaller")
            // const res = await Api.post({ url: urls, data })
            // if (res?.status !== 201 && res?.status !== 200) return

            localStorage.setItem("auth", false)
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("pageName")
            

            dispatch(SET_TOKEN(""))
            dispatch(SET_USER(JSON.stringify({})))
            dispatch(SET_AUTHENTICATED(false))


            cb()


            // let msgdata = {
            //     show: true,
            //     icon: 'error',
            //     buttons: [
            //     ],
            //     text: "Your Session is Expired"
            // }
            // dispatch(ALERTS(msgdata))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    getApiCaller: (urls, cb) => async (dispatch, _) => {
        try {
            console.log("CommonPostActions.postApiCaller")
            const res = await Api.get({ url: urls })
            if (res?.status !== 201 && res?.status !== 200) return

            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    deleteApiCaller: (urls, cb) => async (dispatch, _) => {
        try {
            console.log("CommonPostActions.postApiCaller")
            const res = await Api.delete({ url: urls })

            if (![200, 201, 204].includes(res?.status)) return;
           // if (res?.status !== 201 && res?.status !== 200) return

            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    commondownload: (urls, filename, method = "GET", data = {}, cb) => async (dispatch, _) => {
        // (reqUrl, data).then((response) => {

        const res = await Api.blobFile({ url: urls, method: method, data: data })

        console.log(urls, "filenamefilenamefilenamefilenamefilenamefilename")

        filename = filename?filename:urls.split("/").pop()
        console.log(filename, "filenamefilenamefilenamefilenamefilenamefilename")


        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filename}`);
        document.body.appendChild(link);
        link.click();
    }
}


export default CommonActions;