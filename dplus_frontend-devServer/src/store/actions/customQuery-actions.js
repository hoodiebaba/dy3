
import Button from "../../components/Button"
import Api from "../../utils/api"
import { Urls } from "../../utils/url"
import { ALERTS } from "../reducers/component-reducer"
import { DATABASE_LIST, DBO_LIST, DB_CONFIG_LIST, GENERATED_SQL_QUERY, RUN_QUERY, SAVED_QUERY_LIST, TABLES_LIST, USERS_LIST } from "../reducers/customQuery-reducer"
import CommonActions from "./common-actions"
// import Notify from "./notify-actions"


const CustomQueryActions = {

    getDatabaseList: (reset=true,args="") => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            const res = await Api.get({ url: `${Urls.querybuilder_getDatabase}${args!=""?"?"+args:""}`})
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            const dataAll = res.data.data
            dispatch(DATABASE_LIST({dataAll,reset}))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    getUserList: (reset=true,args="") => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            const res = await Api.get({ url: `${Urls.querybuilder_userList}${args!=""?"?"+args:""}`})
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            const dataAll = res.data.data
            dispatch(USERS_LIST({dataAll,reset}))
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
                const dataAll = res.data.data
                dispatch(GENERATED_SQL_QUERY({}))
                dispatch(TABLES_LIST(dataAll,reset))
            } else if (res?.status == 400) {
                const dataAll = res.data.data
                dispatch(TABLES_LIST({}))
                dispatch(GENERATED_SQL_QUERY(dataAll))
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
    getdboList: (reset, data, cb) => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            
            const res = await Api.get({ url: Urls.querybuilder_getdbo + "/" + data })
            if (res?.status == 200) {
                const dataAll = res.data.data
                dispatch(DBO_LIST({dataAll,reset}))
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
    postSqlQueryCreator: (reset, data, cb = () => { }) => async (dispatch, _) => {
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
            if (res?.status !== 201 && res?.status !== 200) return
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    testDBConfig: (reset, data, cb, uniqueId) => async (dispatch, _) => {
        try {

            const res = await Api.post({ data: data, url: Urls.querybuilder_testDBConfig })
            const dtaa = res.data
            let msgdata = {
                show: true,
                icon: dtaa.icon,
                buttons: [],
                text: dtaa.msg,
                type: 1
            }
            dispatch(ALERTS(msgdata))
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
                        icon: 'success',
                        buttons: [

                        ],
                        text: dtaa.msg,
                        type: 1
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

            const res = await Api.get({ url: `${Urls.querybuilder_DBConfig}${args!=""?"?"+args:""}`})
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            const dataAll = res.data.data
            dispatch(DB_CONFIG_LIST({dataAll,reset}))
            // cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    getSavedQuery: (reset=true,args="") => async (dispatch, _) => {
        try {
            console.log("")
            

            const res = await Api.get({ url: `${Urls.querybuilder_getSavedQuery}${args!=""?"?"+args:""}`})
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            const dataAll = res.data.data
            dispatch(SAVED_QUERY_LIST({dataAll,reset}))
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


export default CustomQueryActions;