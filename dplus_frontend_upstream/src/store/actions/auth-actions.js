import Api from "../../utils/api"
import { Urls } from "../../utils/url"
import { SET_AUTHENTICATED, SET_COMMON_CONFIG, SET_PERMISSION, SET_TOKEN, SET_USER } from "../reducers/auth-reducer"
import { ALERTS } from "../reducers/component-reducer"
import CommonActions from "./common-actions"


// import Notify from "./notify-actions"


const AuthActions = {
    signIn: (data, cb) => async (dispatch, _) => {
        try {
            console.log("AuthActions.signin")
            const res = await Api.post({ url: Urls.login, data })

            console.log(res?.status,"res?.statusres?.status")
            if (res?.status == 400) {
                console.log(res?.data, "401401401")
                let msgdata = {
                    show: true,
                    icon: 'error',
                    text: res?.data?.msg,
                    type: 1
                }
                dispatch(ALERTS(msgdata))

                return
            }
            if (res?.status == 200) {
                console.log(res.data, "res.data")
                const user = res.data
                console.log(user, user, "res.data")
                console.log(res.data, "res.data")

                let dataFiw=user.confdata
                if(dataFiw?.mapScale == undefined){
                    dataFiw={
                        ...dataFiw,
                        "mapScale": "10" 
                    }
                }
                if(dataFiw?.mapView == undefined){
                    dataFiw={
                        ...dataFiw,
                        "mapView": "mapbox://styles/mapbox/standard"
                    }
                }
                localStorage.setItem('user', JSON.stringify(user))
                localStorage.setItem('token', user.idToken)
                localStorage.setItem('permission', user.permission)
                localStorage.setItem('auth', true)
                localStorage.setItem('config', JSON.stringify(dataFiw))
                dispatch(SET_TOKEN(user.idToken))
                dispatch(SET_PERMISSION(JSON.stringify(user.permission)))
                dispatch(SET_USER(JSON.stringify(user)))
                dispatch(SET_AUTHENTICATED(true))
                dispatch(SET_COMMON_CONFIG(dataFiw))
                
                dispatch(CommonActions.setLastName(true,""))
                cb()
            }
        } catch (error) {
            console.log(error, "amit errorerror 37")

            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    setupConf: (reset, data, cb) => async (dispatch, _) => {
        try {
            console.log("AuthActions.setupConf")
            let res = await Api.post({ data: data, url: Urls.setupConf })
            if (res?.status !== 201 && res?.status !== 200) return

            console.log(res.data,"AuthActions.setupConf")
            
            localStorage.setItem('config', JSON.stringify(res?.data?.data))
            dispatch(SET_COMMON_CONFIG(res?.data?.data))
            cb()
        } catch (error) {
            console.log(error, "amit errorerror 37")
        }
    },
}


export default AuthActions;