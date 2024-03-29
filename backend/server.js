import express from "express";
import cors from "cors";
import { Server } from "socket.io";

const messages = [];

const app = express();
app.use(cors());
app.use(express.json());

app.get('/messages', (req, res) => {
    return res.json(messages);
});

const server = new Server({
    cors: {
        origin: "*",
    },
});

server.on("connection", socket => {
    socket.on("originMessage", data => {
        messages.push(data);
        socket.broadcast.emit("forwardMessage", data);
    });
});

app.listen(4000);
server.listen(3000);
