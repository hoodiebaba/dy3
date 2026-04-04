import Api from "../../utils/api"
import { Urls } from "../../utils/url"
import { POWERBI_REPORT_CONF, RESET_STATE } from "../reducers/powerBI-reducer"
// import Notify from "./notify-actions"


const PowerBIActions = {
    
    postpowerBItokenCreator: (reset,data) => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            if(reset){
                dispatch(POWERBI_REPORT_CONF({}))
            }
            const res = await Api.post({ data:data, url: Urls.powerBI_tokenCreator})
            if (res?.status !== 200) return
            console.log(res.data, "res.data")
            const dtaa = res.data.data
            dispatch(POWERBI_REPORT_CONF(dtaa))
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    resetTablesList: () => async (dispatch, _) => {
        dispatch(RESET_STATE({}))
    }
}


export default PowerBIActions;