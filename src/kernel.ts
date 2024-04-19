import { NetworkObserver } from "./service/network-observer";
import { RoomService } from "./service/room-service";
import { ServiceWorkerManager } from "./service/service-worker-manager";
import { UserAccountManager } from "./service/user-account-manager";

export class Kernel {
    private userAccountManager: UserAccountManager = UserAccountManager.getInstance();
    private rooms: RoomService[] = [];

    constructor() {
        this.init();
    }

    private async init() {
        NetworkObserver.getInstance();
        await ServiceWorkerManager.getInstance().register();
        this.rooms.push(new RoomService("main"));

        if(!this.userAccountManager.isConnected()) {
            this.userAccountManager.register();
        }
    }
}
