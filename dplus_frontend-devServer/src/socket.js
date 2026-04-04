import { io } from "socket.io-client";
import { shouldBlockSocketEmit, socketUrl } from "./utils/url";

export const socket = io(socketUrl, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
});

if (shouldBlockSocketEmit) {
    const originalEmit = socket.emit.bind(socket);
    socket.emit = (...args) => {
        console.warn("Socket emit blocked in read-only frontend mode", args[0]);
        return socket;
    };
    socket.__originalEmit = originalEmit;
}

socket.on("connect_error", (err) => {
    console.log("Socket Connect Error:", err);
});
