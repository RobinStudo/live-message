import { Subject } from "rxjs";
import { io } from "socket.io-client";
import { Message } from "../model/message";
import { Singleton } from "../util/singleton";

export class SocketManager extends Singleton {
    private socketUrl = "http://localhost:3000";
    private socket: any;

    protected constructor() {
        super();
        this.init();
    }

    private init() {
        this.socket = io(this.socketUrl);
    }

    dispatch(message: Message) {
        this.socket.emit("originMessage", message);
    }

    listen() {
        const subject = new Subject<Message>();

        this.socket.on("forwardMessage", (message: Message) => {
            subject.next(message);
        });

        return subject.asObservable();
    }
}
