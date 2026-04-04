
import Button from "../../components/Button"
import Api from "../../utils/api"
import { Urls } from "../../utils/url"
import { ALERTS } from "../reducers/component-reducer"
import CommonActions from "./common-actions"
import { MTANDAO_COMPLAINTS_LIST } from "../reducers/mtandaoComplaints-reducer"
import { GET_ISON_FORM } from "../reducers/isonForm-reducer"
import { GET_CELL_PRO_RULES_OUTPUT, GET_NETWORK_ANALYTICS_PRO, GET_NETWORK_ANALYTICS_PRO_SORTER, GET_NETWORK_ANALYTICS_SHOW_COLS, GET_NOKIA_PRE_POST, GET_PRO_RULES, GET_PRO_RULES_OUTPUT, GET_UNIQUE_CELL_ID, GET_UNIQUE_CELL_NAME, GET_UNIQUE_PHYSICAL_ID } from "../reducers/nokiaPrePost-reducer"
import WebsocketActions from "./websocket-actions"
// import Notify from "./notify-actions"


const nokiaPrePostActions = {
    postSubmit: (url, data, cb) => async (dispatch, _) => {
        try {
            const res = await Api.post({ url: url, data: data , contentType:"multipart/form-data"})
            console.log(res, "res?.statusres?.status")

            const dtaa = res.data
            let msgdata = {
                show: true,
                icon: dtaa.icon,
                buttons: [

                ],
                type:1,
                text: dtaa.msg
            }
            dispatch(ALERTS(msgdata))
            if (res?.status !== 201 && res?.status !== 200){
                return 
            }
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },
    getnokiaprepost: (reset=true,args="") => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            const res = await Api.get({ url: `${Urls.nokiaprepost}${args!=""?"?"+args:""}`})
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            let dataAll=[]
            dataAll = res.data.data
            dispatch(GET_NOKIA_PRE_POST({dataAll,reset}))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    getuniquephysicalid: (reset=true,args="") => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            const res = await Api.get({ url: `${Urls.uniquePhysicalId}${args!=""?"?"+args:""}`})
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            let dataAll=[]
            dataAll = res.data.data
            dispatch(GET_UNIQUE_PHYSICAL_ID({dataAll,reset}))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },


    getuniquecellid: (reset=true,args="") => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            const res = await Api.get({ url: `${Urls.uniquecellid}${args!=""?"?"+args:""}`})
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            let dataAll=[]
            dataAll = res.data.data
            dispatch(GET_UNIQUE_CELL_ID({dataAll,reset}))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },


    getuniquecellname: (reset=true,args="") => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            const res = await Api.get({ url: `${Urls.uniquecellname}${args!=""?"?"+args:""}`})
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            let dataAll=[]
            dataAll = res.data.data
            dispatch(GET_UNIQUE_CELL_NAME({dataAll,reset}))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },

    
    getProRules: (reset=true,args="") => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            const res = await Api.get({ url: `${Urls.proRules}${args!=""?"?"+args:""}`})
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            let dataAll=[]
            dataAll = res.data.data
            dispatch(GET_PRO_RULES({dataAll,reset}))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    ProRulesOutput: (data,reset=true,cb,args="") => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            // const res = await Api.get({ url: `${Urls.proRulesOutput}${args!=""?"?"+args:""}`})
            
            const res = await Api.post({ data: data, url: Urls.proRulesOutput })
            if (res?.status !== 200) return
            dispatch(WebsocketActions.clear_data_from_socket())
            console.log(res.data, "res.data")
            let dataAll=[]
            dataAll = res.data.data
            dispatch(GET_PRO_RULES_OUTPUT({dataAll,reset}))

            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    CellProRulesOutput: (data,reset=true,cb,args="") => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            // const res = await Api.get({ url: `${Urls.proRulesOutput}${args!=""?"?"+args:""}`})
            
            const res = await Api.post({ data: data, url: Urls.cellProRulesOutput })
            if (res?.status !== 200) return
            
            dispatch(WebsocketActions.clear_data_from_socket())
            console.log(res.data, "res.data")
            let dataAll=[]
            dataAll = res.data.data
            dispatch(GET_CELL_PRO_RULES_OUTPUT({dataAll,reset}))

            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },

    

    
    postDataProRules: (reset, data, cb, uniqueId) => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin", uniqueId)
            let res
            if(uniqueId==null){
                res = await Api.post({ data: data, url: Urls.proRules })
            }else{
                res = await Api.put({ data: data, url: Urls.proRules + "/" + uniqueId })
            }
            if (res?.status !== 201 && res?.status !== 200) return
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },

    getnetworkanalyticspro: (reset=true,args="",cb=()=>{}) => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            const res = await Api.get({ url: `${Urls.sitenetworkAnalyticsPro}${args!=""?"?"+args:""}`})
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            let dataAll=[]
            dataAll = res.data.data
            let dataSorter=res.data.sorter
            let showCols=res.data.showCols

            console.log(dataSorter,"dataSorterdataSorter")
            dispatch(GET_NETWORK_ANALYTICS_PRO({dataAll,reset}))
            dispatch(GET_NETWORK_ANALYTICS_PRO_SORTER({dataSorter,reset}))
            dispatch(GET_NETWORK_ANALYTICS_SHOW_COLS({showCols,reset}))

            cb()
            
            
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },

    getcellnetworkanalyticspro: (reset=true,args="",cb=()=>{}) => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            const res = await Api.get({ url: `${Urls.cellnetworkAnalyticsPro}${args!=""?"?"+args:""}`})
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            let dataAll=[]
            dataAll = res.data.data
            let dataSorter=res.data.sorter
            let showCols=res.data.showCols

            console.log(dataSorter,"dataSorterdataSorter")
            dispatch(GET_NETWORK_ANALYTICS_PRO({dataAll,reset}))
            dispatch(GET_NETWORK_ANALYTICS_PRO_SORTER({dataSorter,reset}))
            dispatch(GET_NETWORK_ANALYTICS_SHOW_COLS({showCols,reset}))

            cb()
            
            
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    postData: (reset, data, cb, uniqueId) => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin", uniqueId)
            let res
            if(uniqueId==null){
                res = await Api.post({ data: data, url: Urls.nokiaprepost })
            }else{
                res = await Api.put({ data: data, url: Urls.nokiaprepost + "/" + uniqueId })
            }
            if (res?.status !== 201 && res?.status !== 200) return
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },
    resetTablesList: () => async (dispatch, _) => {
        dispatch(TABLES_LIST({}))
    }
}


export default nokiaPrePostActions;