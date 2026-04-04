import { io } from "socket.io-client";
import { baseUrl } from "./utils/url";

export const socket = io(baseUrl, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
});

socket.on("connect_error", (err) => {
    console.log("Socket Connect Error:", err);
});