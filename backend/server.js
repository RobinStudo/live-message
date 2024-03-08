import { Server } from "socket.io";

const server = new Server({
    cors: {
        origin: "*",
    },
});

server.on("connection", socket => {
    socket.on("originMessage", data => {
        socket.broadcast.emit("forwardMessage", data);
    });
});

server.listen(3000);
