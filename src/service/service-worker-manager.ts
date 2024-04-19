import { Singleton } from "../util/singleton";

export class ServiceWorkerManager extends Singleton {
    private registration: ServiceWorkerRegistration;

    register(): Promise<void|ServiceWorkerRegistration> {
        return navigator.serviceWorker.register('service-worker.js')
            .then(r => this.registration = r)
            .catch(e => console.error(e))
        ;
    }

    getRegistration() {
        return this.registration;
    }
}
