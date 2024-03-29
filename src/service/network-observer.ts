import { Singleton } from "../util/singleton";

export class NetworkObserver extends Singleton {
    private indicatorElement = document.getElementById("netwrok-offline");

    protected constructor() {
        super();

        if (navigator.onLine) {
            this.isOnline();
        } else {
            this.isOffline();
        }

        this.bindEvents();
    }

    private bindEvents() {
        window.addEventListener('online', () => this.isOnline());
        window.addEventListener('offline', () => this.isOffline());
    }

    isOnline() {
        this.indicatorElement.classList.add('hide');
    }

    isOffline() {
        this.indicatorElement.classList.remove('hide');
    }
}
