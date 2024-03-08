import { UserAccountManager } from "./user/user-account-manager";

export class Kernel {
    private userAccountManager: UserAccountManager = UserAccountManager.getInstance();

    constructor() {
        this.init();
    }

    private init() {
        if(!this.userAccountManager.isConnected()) {
            this.userAccountManager.register();
        }
    }
}
