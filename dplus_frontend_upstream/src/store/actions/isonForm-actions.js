
import Button from "../../components/Button"
import Api from "../../utils/api"
import { Urls } from "../../utils/url"
import { ALERTS } from "../reducers/component-reducer"
import { CONFIGURE_ALERT_LIST, DB_CONFIG_LIST, GENERATED_SQL_QUERY, RUN_QUERY, SAVED_QUERY_LIST, TABLES_LIST, USERS_LIST } from "../reducers/alertConfiguration-reducer"
import CommonActions from "./common-actions"
import { MTANDAO_COMPLAINTS_LIST } from "../reducers/mtandaoComplaints-reducer"
import { GET_ISON_FORM } from "../reducers/isonForm-reducer"
// import Notify from "./notify-actions"


const isonFormActions = {
    postSubmit: (url, data, cb) => async (dispatch, _) => {
        try {
            const res = await Api.post({ url: url, data: data , contentType:"multipart/form-data"})
            console.log(res, "res?.statusres?.status")

            const dtaa = res.data
            if (res?.status !== 201 && res?.status !== 200){
                let msgdata = {
                    show: true,
                    icon: 'error',
                    buttons: [

                    ],
                    type:1,
                    text: dtaa.msg
                }
                dispatch(ALERTS(msgdata))
            }else{
                cb()
            }
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },
    getIsonFormList: () => async (dispatch, _) => {
        try {
            const res = await Api.get({ url: Urls.isonForm })
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            const dataAll = res.data.data
            dispatch(GET_ISON_FORM(dataAll))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    resetTablesList: () => async (dispatch, _) => {
        dispatch(TABLES_LIST({}))
    }
}


export default isonFormActions;