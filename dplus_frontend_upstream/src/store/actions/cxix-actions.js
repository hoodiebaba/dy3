
import Button from "../../components/Button"
import Api from "../../utils/api"
import { Urls } from "../../utils/url"
import { ALERTS } from "../reducers/component-reducer"
import CommonActions from "./common-actions"
import { MTANDAO_COMPLAINTS_LIST } from "../reducers/mtandaoComplaints-reducer"
import { GET_ISON_FORM } from "../reducers/isonForm-reducer"
import { CXIX_SCRIPTING_DATA_LIST, CXIX_SCRIPTING_FORM, CXIX_SCRIPTING_LIST, DB_UPDATE_LIST } from "../reducers/cxix-reducer"
import { SET_PAGE_NAME } from "../reducers/auth-reducer"
// import Notify from "./notify-actions"


const cxixActions = {
    // postSubmit: (url, data, cb) => async (dispatch, _) => {
    //     try {
    //         const res = await Api.post({ url: url, data: data , contentType:"multipart/form-data"})
    //         console.log(res, "res?.statusres?.status")

    //         const dtaa = res.data
    //         let msgdata = {
    //             show: true,
    //             icon: dtaa.icon,
    //             buttons: [

    //             ],
    //             type:1,
    //             text: dtaa.msg
    //         }
    //         dispatch(ALERTS(msgdata))
    //         if (res?.status !== 201 && res?.status !== 200){
    //             return 
    //         }
    //         cb()
    //     } catch (error) {
    //         console.log(error, "amit errorerror 37")
    //     }
    // },
    get_cxix_scripting_list: (reset = true, args = "") => async (dispatch, _) => {
        try {
            const res = await Api.get({ url: `${Urls.cxix_scripting}${args != "" ? "?" + args : ""}` })
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            let dataAll = []
            dataAll = res.data.data
            dispatch(CXIX_SCRIPTING_LIST({ dataAll, reset }))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    
    get_cxix_audit_list: (reset = true, args = "") => async (dispatch, _) => {
        try {
            const res = await Api.get({ url: `${Urls.cxix_audit}${args != "" ? "?" + args : ""}` })
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            let dataAll = []
            dataAll = res.data.data
            dispatch(CXIX_SCRIPTING_LIST({ dataAll, reset }))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    get_cxix_scripting_form: (uid, reset = true, args = "") => async (dispatch, _) => {
        try {
            const res = await Api.get({ url: `${Urls.cxix_scripting_form}/${uid}${args != "" ? "?" + args : ""}` })
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            let dataAll = []
            dataAll = res.data.data
            dispatch(CXIX_SCRIPTING_FORM({ dataAll, reset }))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },

    get_cxix_audit_form: (uid, reset = true, args = "") => async (dispatch, _) => {
        try {
            const res = await Api.get({ url: `${Urls.cxix_audit_form}/${uid}${args != "" ? "?" + args : ""}` })
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            let dataAll = []
            dataAll = res.data.data
            dispatch(CXIX_SCRIPTING_FORM({ dataAll, reset }))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },

    
    
    get_cxix_scripting_data_list: (uid="", reset = true, args = "") => async (dispatch, _) => {
        try {
            const res = await Api.get({ url: `${Urls.cxix_scripting_getdata}${uid!=""?"/"+uid:""}${args != "" ? "?" + args : ""}` })
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            let dataAll = []
            dataAll = res.data.data
            dispatch(SET_PAGE_NAME(res.data.name))
            dispatch(CXIX_SCRIPTING_DATA_LIST({ dataAll, reset }))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },

    get_cxix_audit_data_list: (uid="", reset = true, args = "") => async (dispatch, _) => {
        try {
            const res = await Api.get({ url: `${Urls.cxix_audit_getdata}${uid!=""?"/"+uid:""}${args != "" ? "?" + args : ""}` })
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            let dataAll = []
            dataAll = res.data.data
            dispatch(SET_PAGE_NAME(res.data.name))
            dispatch(CXIX_SCRIPTING_DATA_LIST({ dataAll, reset }))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    get_dbUpdateList: (reset = true, args = "") => async (dispatch, _) => {
        try {
            const res = await Api.get({ url: `${Urls.dbUpdate}${args != "" ? "?" + args : ""}` })
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            let dataAll = []
            dataAll = res.data.data
            dispatch(DB_UPDATE_LIST({ dataAll, reset }))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    post_dbUpdateList: (reset, data, cb) => async (dispatch, _) => {
        try {
            let res = await Api.post({ data: data, url: Urls.dbUpdate,contentType:"multipart/form-data"})
            if (res?.status !== 201 && res?.status !== 200) return
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },



    
    post_cxix_scripting_form: (reset,uid, data, cb) => async (dispatch, _) => {
        try {
            let res = await Api.post({ data: data, url: Urls.cxix_scripting_form+"/"+uid,contentType:"multipart/form-data"})


            if (res?.status !== 201 && res?.status !== 200) return
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },

    post_cxix_audit_form: (reset,uid, data, cb) => async (dispatch, _) => {
        try {
            let res = await Api.post({ data: data, url: Urls.cxix_audit_form+"/"+uid,contentType:"multipart/form-data"})


            if (res?.status !== 201 && res?.status !== 200) return
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },
    // getuniquephysicalid: (reset=true,args="") => async (dispatch, _) => {
    //     try {
    //         console.log("AuthActions.signin")
    //         const res = await Api.get({ url: `${Urls.uniquePhysicalId}${args!=""?"?"+args:""}`})
    //         if (res?.status !== 200) return
    //         console.log(res.data, "res.data")
    //         let dataAll=[]
    //         dataAll = res.data.data
    //         dispatch(GET_UNIQUE_PHYSICAL_ID({dataAll,reset}))
    //     } catch (error) {
    //         console.log(error, "amit errorerror 37")

    //         // dispatch(Notify.error('something went wrong! please try again after a while'))
    //     }
    // },


    // getProRules: (reset=true,args="") => async (dispatch, _) => {
    //     try {
    //         console.log("AuthActions.signin")
    //         const res = await Api.get({ url: `${Urls.proRules}${args!=""?"?"+args:""}`})
    //         if (res?.status !== 200) return
    //         console.log(res.data, "res.data")
    //         let dataAll=[]
    //         dataAll = res.data.data
    //         dispatch(GET_NOKIA_PRE_POST({dataAll,reset}))
    //     } catch (error) {
    //         console.log(error, "amit errorerror 37")

    //         // dispatch(Notify.error('something went wrong! please try again after a while'))
    //     }
    // },
    // postDataProRules: (reset, data, cb, uniqueId) => async (dispatch, _) => {
    //     try {
    //         console.log("AuthActions.signin", uniqueId)
    //         let res
    //         if(uniqueId==null){
    //             res = await Api.post({ data: data, url: Urls.proRules })
    //         }else{
    //             res = await Api.put({ data: data, url: Urls.proRules + "/" + uniqueId })
    //         }
    //         if (res?.status !== 201 && res?.status !== 200) return
    //         cb()
    //     } catch (error) {
    //         console.log(error, "amit errorerror 37")
    //     }
    // },

    // getnetworkanalyticspro: (reset=true,args="",cb=()=>{}) => async (dispatch, _) => {
    //     try {
    //         console.log("AuthActions.signin")
    //         const res = await Api.get({ url: `${Urls.networkAnalyticsPro}${args!=""?"?"+args:""}`})
    //         if (res?.status !== 200) return
    //         console.log(res.data, "res.data")
    //         let dataAll=[]
    //         dataAll = res.data.data
    //         let dataSorter=res.data.sorter
    //         let showCols=res.data.showCols

    //         console.log(dataSorter,"dataSorterdataSorter")
    //         dispatch(GET_NETWORK_ANALYTICS_PRO({dataAll,reset}))
    //         dispatch(GET_NETWORK_ANALYTICS_PRO_SORTER({dataSorter,reset}))
    //         dispatch(GET_NETWORK_ANALYTICS_SHOW_COLS({showCols,reset}))

    //         cb()


    //     } catch (error) {
    //         console.log(error, "amit errorerror 37")

    //         // dispatch(Notify.error('something went wrong! please try again after a while'))
    //     }
    // },
    // postData: (reset, data, cb, uniqueId) => async (dispatch, _) => {
    //     try {
    //         console.log("AuthActions.signin", uniqueId)
    //         let res
    //         if(uniqueId==null){
    //             res = await Api.post({ data: data, url: Urls.nokiaprepost })
    //         }else{
    //             res = await Api.put({ data: data, url: Urls.nokiaprepost + "/" + uniqueId })
    //         }
    //         if (res?.status !== 201 && res?.status !== 200) return
    //         cb()
    //     } catch (error) {
    //         console.log(error, "amit errorerror 37")
    //     }
    // },
    // resetTablesList: () => async (dispatch, _) => {
    //     dispatch(TABLES_LIST({}))
    // }
}


export default cxixActions;