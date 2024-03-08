import { Singleton } from "../util/singleton";
import { User } from "./user";

export class UserAccountManager extends Singleton {
    private storageKey = 'user';
    private user?: User;
    private elements = {
        registerDialog: document.getElementById("user-register") as HTMLDialogElement,
        registerForm: document.querySelector('#user-register form') as HTMLFormElement,
    };

    protected constructor() {
        super();
        this.load();
    }

    private load() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            this.user = JSON.parse(data);
        }
    }

    isConnected(): boolean {
        return !!this.user;
    }

    register() {
        this.elements.registerDialog.showModal();
        this.elements.registerForm.addEventListener("submit", e => {
            e.preventDefault();
            this.store();
        });
    }

    store() {
        const data = new FormData(this.elements.registerForm);
        this.user = {
            username: data.get('username') as string,
            enableNotification: !!data.get('enableNotification'),
        }

        localStorage.setItem(this.storageKey, JSON.stringify(this.user));
        this.elements.registerDialog.close();
    }
}
