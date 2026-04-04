import { CLEAR_DATA_FROM_SOCKET, DATA_FROM_SOCKET, SETUP_SOCKET } from "../reducers/websocket-reducer";
import { socket } from "../../socket";

const WebsocketActions = {
    setup_socket: (data) => async (dispatch, _) => {
        try {
            // console.log("SETUP_SOCKET","state")
            dispatch(SETUP_SOCKET(data))
        } catch (error) {
            console.log(error, "amit errorerror 37")
            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    
    send_to_socket: (label,msg,clear_by_name,roomName=true) => async (dispatch, state) => {
        try {
            console.log("SETUP_SOCKET clear_by_name",clear_by_name,"state")


            if(state().websocket.socket_setup){
                console.log('SETUP_SOCKET coming', )
                if(roomName){
                    socket.emit(label,{ room_name: "room_name_"+state()?.auth?.user?.id, message: msg })
                }else{
                    socket.emit(label,{ message: msg })
                }

            }else{
                console.log("socket error",state().websocket.socket_setup)
            }
        } catch (error) {
            console.log(error, "amit errorerror 37")
            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    data_from_socket: (data) => async (dispatch, _) => {
        try {
            console.log("data_from_socket","data",data,data?.que?.Code+"_"+data?.que?.id,{"data":data?.data,"columns":data?.columns})
            dispatch(DATA_FROM_SOCKET({"name":data?.que?.Code+"_"+data?.que?.id,"value":{"data":data?.data,"columns":data?.columns}}))
        } catch (error) {
            console.log(error, "amit errorerror 37")
            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },

    clear_data_from_socket: () => async (dispatch, _) => {
        try {
            dispatch(CLEAR_DATA_FROM_SOCKET(""))
        } catch (error) {
            console.log(error, "amit errorerror 37")
            // dispatch(Notify.error('something went wrong! please try again after a while'))
        }
    },
    
}


export default WebsocketActions;