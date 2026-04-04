import React, { useState, useEffect } from 'react';
import WebsocketActions from '../store/actions/websocket-actions';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../socket';

const WebSocketClient = () => {

    // const socket = React.useMemo(() => io('http://127.0.0.1:8095/', {
    //     reconnectionDelay: 10000,
    //     reconnection: Infinity
    // }), [])


    let getUserId = useSelector((state) => {
        let interdata=state?.auth?.user?.id
        return interdata
    })
    
    const dispatch = useDispatch()

    useEffect(() => {

        // const socket = io.connect(baseUrl, {
        //     transports: ['websocket', 'polling']
        // })

        socket.on('disconnect', () => {
            console.log("disconnected ho gya hai")
        });

        socket.on('connect', () => {
            dispatch(WebsocketActions.setup_socket(true))
            console.log("connected ho gya hai")
        });

        socket.on('reconnect', () => {
            console.log("reconnected ho gya hai")
        });


        socket.on('error', () => {
            console.log("error ho gya hai")
        });


        socket.on("room_name_"+getUserId, (data) => {
            console.log("data aa gya hai",data)

            dispatch(WebsocketActions.data_from_socket(data))

        });
        

        

        // Clean up on component unmount
        return () => {

            // socket.off()
            // socket.disconnect();
        };
    }, []); // Run only once on component mount

    


    return (<></>);
};

export default React.memo(WebSocketClient);
