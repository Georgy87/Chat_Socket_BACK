import socket from "socket.io";
import http from "http";
import { Server, Socket } from "socket.io";

export default (http: http.Server) => {
    const io = new Server(http, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", function(socket: socket.Socket) {
        console.log("Connected");
        // socket.emit("109", "Привет!!");
        socket.on("444", function(msg) {
            console.log(msg);
        });
    });

    return io;
};
