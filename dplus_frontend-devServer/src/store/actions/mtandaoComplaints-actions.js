
import Button from "../../components/Button"
import Api from "../../utils/api"
import { Urls } from "../../utils/url"
import { ALERTS } from "../reducers/component-reducer"
import { GENERATED_SQL_QUERY, RUN_QUERY,TABLES_LIST, } from "../reducers/alertConfiguration-reducer"
import CommonActions from "./common-actions"
import { MTANDAO_COMPLAINTS_LIST } from "../reducers/mtandaoComplaints-reducer"
// import Notify from "./notify-actions"


const MtandaoComplaintsActions = {
    pmtandaoComplaint: (reset, data, cb, uniqueId) => async (dispatch, _) => {
        try {
            let res = null;
            if(uniqueId==null){
                res = await Api.post({ data: data, url: Urls.mtandaoComplaints })
            }else{
                res = await Api.put({ data: data, url: Urls.mtandaoComplaints + "/" + uniqueId })
            }

            console.log(res,"res?.statusres?.status")
            if (res?.status !== 201 && res?.status !== 200) return
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },
    patchmtandaoComplaint: (reset, data, cb, uniqueId) => async (dispatch, _) => {
        try {
            const res = await Api.patch({ data: data, url: Urls.mtandaoComplaints + "/" + uniqueId })
            if (res?.status !== 200) return
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },

    getmtandaoComplaintsList: (reset=true,args="") => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            const res = await Api.get({ url: `${Urls.mtandaoComplaints}${args!=""?"?"+args:""}`})
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            let dataAll=[]
            dataAll = res.data.data
            dispatch(MTANDAO_COMPLAINTS_LIST({dataAll,reset}))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    resetTablesList: () => async (dispatch, _) => {
        dispatch(TABLES_LIST({}))
    }
}


export default MtandaoComplaintsActions;