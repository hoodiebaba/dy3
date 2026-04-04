
import Button from "../../components/Button"
import Api from "../../utils/api"
import { Urls } from "../../utils/url"
import { ALERTS } from "../reducers/component-reducer"
import { CONFIGURE_ALERT_LIST, DB_CONFIG_LIST, GENERATED_SQL_QUERY, RUN_QUERY, SAVED_QUERY_LIST, SCHEDULER_ALERT_LIST, TABLES_LIST, USERS_LIST } from "../reducers/alertConfiguration-reducer"
import CommonActions from "./common-actions"
// import Notify from "./notify-actions"


const AlertConfigurationActions = {
    alertConfigurationList: (reset=true,args="") => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            const res = await Api.get({ url: `${Urls.alertConfiguration_configureAlert}${args!=""?"?"+args:""}`})
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            const dataAll = res.data.data
            dispatch(CONFIGURE_ALERT_LIST({dataAll,reset}))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    alertSchedulerList: (reset=true,args="") => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            const res = await Api.get({ url: `${Urls.alertConfiguration_schedulerAlert}${args!=""?"?"+args:""}`})
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            const dataAll = res.data.data
            
            dispatch(SCHEDULER_ALERT_LIST({dataAll,reset}))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    pAlertConfig: (reset, data, cb, uniqueId) => async (dispatch, _) => {
        try {
            let res = null;
            if(uniqueId==null){
                res = await Api.post({ data: data, url: Urls.alertConfiguration_configureAlert })
            }else{
                res = await Api.put({ data: data, url: Urls.alertConfiguration_configureAlert + "/" + uniqueId })
            }

            console.log(res,"res?.statusres?.status")
            if (res?.status !== 201 && res?.status !== 200) return
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },
    pAlertScheduler: (reset, data, cb, uniqueId) => async (dispatch, _) => {
        try {
            let res = null;
            if(uniqueId==null){
                res = await Api.post({ data: data, url: Urls.alertConfiguration_schedulerAlert })
            }else{
                res = await Api.put({ data: data, url: Urls.alertConfiguration_schedulerAlert + "/" + uniqueId })
            }

            console.log(res,"res?.statusres?.status")
            if (res?.status !== 201 && res?.status !== 200) return
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },
    patchAlertConfig: (reset, data, cb, uniqueId) => async (dispatch, _) => {
        try {
            const res = await Api.patch({ data: data, url: Urls.alertConfiguration_configureAlert + "/" + uniqueId })
            if (res?.status !== 200) return
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },
    patchAlertScheduler: (reset, data, cb, uniqueId) => async (dispatch, _) => {
        try {
            const res = await Api.patch({ data: data, url: Urls.alertConfiguration_schedulerAlert + "/" + uniqueId })
            if (res?.status !== 200) return
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },

    getUserList: (reset=true,args="") => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            const res = await Api.get({ url: Urls.querybuilder_userList })
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            const dataAll = res.data.data
            dispatch(USERS_LIST(dataAll))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    getTablesList: (reset, data, cb) => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            if (reset) {
                dispatch(TABLES_LIST({}))
            }
            const res = await Api.get({ url: Urls.querybuilder_getTables + "/" + data })
            if (res?.status == 200) {
                const dtaa = res.data.data
                dispatch(GENERATED_SQL_QUERY({}))
                dispatch(TABLES_LIST(dtaa))
            } else if (res?.status == 400) {
                const dtaa = res.data.data
                dispatch(TABLES_LIST({}))
                dispatch(GENERATED_SQL_QUERY(dtaa))
            } else {
                return
            }
            // console.log(res.data, "res.data")
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    postSqlQueryCreator: (reset, data) => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            if (reset) {
                dispatch(GENERATED_SQL_QUERY({}))
            }
            const res = await Api.post({ data: data, url: Urls.querybuilder_sqlQueryGenerator })
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            const dtaa = res.data.data
            dispatch(GENERATED_SQL_QUERY(dtaa))
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    postDBConfig: (reset, data, cb, uniqueId) => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin", uniqueId)
            // if(reset){
            //     dispatch(GENERATED_SQL_QUERY({}))
            // }
            const res = await Api.post({ data: data, url: uniqueId == null ? Urls.querybuilder_DBConfig : Urls.querybuilder_DBConfig + "/" + uniqueId })
            if (res?.status !== 201) return
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    postRunQuery: (reset, data, cb, urlinnng) => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            if (reset) {
                dispatch(RUN_QUERY({}))
            }
            const res = await Api.post({ data: data, url: urlinnng })
            console.log(res, "postRunQuery")
            if (res?.status === 201 || res?.status === 200) {
                const dtaa = res.data
                console.log(dtaa.type == "File", dtaa.type == "Data", "dtaadtaa")
                if (dtaa.type == "Data") {
                    dispatch(RUN_QUERY(dtaa))
                }
                if (dtaa.type == "File") {
                    cb()
                    dispatch(CommonActions.commondownload(dtaa.data))
                    let msgdata = {
                        show: true,
                        icon: 'info',
                        buttons: [

                        ],
                        text: dtaa.msg
                    }
                    dispatch(ALERTS(msgdata))
                }

            } else if (res?.status === 400) {
                cb()
                const dtaa = res.data
                let msgdata = {
                    show: true,
                    icon: 'error',
                    buttons: [
                    ],
                    text: dtaa.msg
                }
                dispatch(ALERTS(msgdata))
                console.log("dsadsadasdasdasdsada", msgdata)
            } else {
                return
            }
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    getDBConfig: (reset=true,args="") => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            if (reset) {
                dispatch(DB_CONFIG_LIST([]))
            }
            const res = await Api.get({ url: Urls.querybuilder_DBConfig })
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            const dtaa = res.data.data
            dispatch(DB_CONFIG_LIST(dtaa))
            // cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    getSavedQuery: (reset=true,args="") => async (dispatch, _) => {
        try {
            console.log("")
            if (reset) {
                dispatch(SAVED_QUERY_LIST([]))
            }
            const res = await Api.get({ url: Urls.querybuilder_getSavedQuery })
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            const dtaa = res.data.data
            dispatch(SAVED_QUERY_LIST(dtaa))
            // cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    postpowerBItokenCreator: (reset, data) => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            if (reset) {
                dispatch(GENERATED_SQL_QUERY({}))
            }
            const res = await Api.post({ data: data, url: Urls.querybuilder_sqlQueryGenerator })
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            const dtaa = res.data.data
            dispatch(GENERATED_SQL_QUERY(dtaa))
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    resetTablesList: () => async (dispatch, _) => {
        dispatch(TABLES_LIST({}))
    }
}


export default AlertConfigurationActions;