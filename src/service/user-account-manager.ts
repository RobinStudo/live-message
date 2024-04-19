import { Singleton } from "../util/singleton";
import { User } from "../model/user";
import { ApiProvider } from "./api-provider";
import { ServiceWorkerManager } from "./service-worker-manager";

export class UserAccountManager extends Singleton {
    private apiProvider = ApiProvider.getInstance();
    private serviceWorkerManager = ServiceWorkerManager.getInstance();
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

    register(): void {
        this.elements.registerDialog.showModal();
        this.elements.registerForm.addEventListener("submit", e => {
            e.preventDefault();
            this.handleForm();
        });
    }

    private handleForm(): void {
        const data = new FormData(this.elements.registerForm);
        this.user = {
            username: data.get('username') as string,
            enableNotification: !!data.get('enableNotification'),
        }

        if (this.user.enableNotification) {
            this.enableNotification();
        }

        this.store();
    }

    private async enableNotification(): Promise<void> {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            let sub = await this.serviceWorkerManager.getRegistration().pushManager.getSubscription();
            if (!sub) {
                const keys = await this.apiProvider.fetch('/push/key');
                sub = await this.serviceWorkerManager.getRegistration().pushManager.subscribe({
                   applicationServerKey: keys.pubkey,
                    userVisibleOnly: true,
                });

                this.apiProvider.fetch('/push/sub', {
                    method: 'POST',
                    body: JSON.stringify(sub),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }
        }
    }

    private store(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.user));
        this.elements.registerDialog.close();
    }

    getUser(): User {
        return this.user;
    }
}
