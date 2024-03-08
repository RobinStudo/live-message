import { Message } from "../model/message";
import { SocketManager } from "./socket-manager";
import { UserAccountManager } from "./user-account-manager";

export class RoomService {
    private socketManager = SocketManager.getInstance();
    private userAccountManager = UserAccountManager.getInstance();
    private elements = {
        messageForm: document.querySelector('.message-form') as HTMLFormElement,
        messageFeed: document.querySelector('.message-feed'),
        messageTemplate: document.getElementById('message-template') as HTMLTemplateElement,
    }

    constructor(private name: string) {
        this.init();
    }

    private init() {
        this.elements.messageForm.addEventListener("submit", e => {
            e.preventDefault();
           this.handleMessage();
        });

        this.socketManager.listen().subscribe((message: Message) => {
            this.displayMessage(message);
        });
    }

    private handleMessage() {
        const data = new FormData(this.elements.messageForm);
        const message = {
            username: this.userAccountManager.getUser().username,
            content: data.get("message") as string,
            sentAt: new Date(),
        };

        this.socketManager.dispatch(message);
        this.displayMessage(message, false);
        this.elements.messageForm.reset();
    }

    private displayMessage(message: Message, isExternal = true) {
        const fargment = document.importNode(this.elements.messageTemplate.content, true);
        const article = fargment.querySelector('article');
        article.classList.add(isExternal ? 'ext' : 'me');
        article.querySelector('.username').textContent = message.username;
        article.querySelector('.content').textContent = message.content;
        article.querySelector('.sent-at').textContent = message.sentAt.toISOString();

        this.elements.messageFeed.appendChild(article);
    }
}
