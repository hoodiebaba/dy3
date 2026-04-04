import { LOADERS, POP_MENU } from "../reducers/component-reducer"
// import Notify from "./notify-actions"


const ComponentActions = {
    popmenu: (data) => async (dispatch, _) => {
        try {
            dispatch(POP_MENU(data))
        } catch (error) {
            console.log(error, "amit errorerror 37")
            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    alerts: (data) => async (dispatch, _) => {
        try {


            // dispatch(ALERTS(data))

            //     {
            //         show: true,
            //         title: 'Example',
            //         text: 'Hello World',
            //     }
        } catch (error) {
            console.log(error, "amit errorerror 37")
            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    loaders: (data) => async (dispatch, _) => {
        try {
            dispatch(LOADERS(data))
        } catch (error) {
            console.log(error, "amit errorerror 37")
            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    resetComponent: () => async (dispatch, _) => {
        dispatch(RESET_STATE({}))
    }
}


export default ComponentActions;