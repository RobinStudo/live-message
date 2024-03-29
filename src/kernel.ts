import { RoomService } from "./service/room-service";
import { UserAccountManager } from "./service/user-account-manager";

export class Kernel {
    private userAccountManager: UserAccountManager = UserAccountManager.getInstance();
    private rooms: RoomService[] = [];

    constructor() {
        this.init();
    }

    private init() {
        this.rooms.push(new RoomService("main"));

        if(!this.userAccountManager.isConnected()) {
            this.userAccountManager.register();
        }

        navigator.serviceWorker.register('dist/worker.js')
            .then(r => console.log(r))
            .catch(e => console.error(e))
        ;
    }
}
