import express from "express";
import cors from "cors";
import webpush from "web-push";
import dotenv from "dotenv";
import { Server } from "socket.io";

// Load .env file
dotenv.config();

// Configure webpush with keys
webpush.setVapidDetails(
    'mailto:hello@rdelbaere.fr',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

const messages = [];
const subscriptions = [];

// API
const app = express();
app.use(cors());
app.use(express.json());

app.get('/messages', (req, res) => {
    return res.json(messages);
});

app.get('/push/key', (req, res) => {
    return res.json({
        pubkey: process.env.VAPID_PUBLIC_KEY
    });
});

app.post('/push/sub', (req, res) => {
    subscriptions.push(req.body);
    return res.json({});
});

app.listen(4000);

// Websocket
const server = new Server({
    cors: {
        origin: "*",
    },
});

server.on("connection", socket => {
    socket.on("originMessage", data => {
        messages.push(data);
        socket.broadcast.emit("forwardMessage", data);

        for (let subscription of subscriptions) {
            webpush.sendNotification(subscription, JSON.stringify(data))
        }
    });
});

server.listen(3000);
