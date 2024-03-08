export class Singleton {
    private static instance: any;

    protected constructor() {}

    static getInstance(): any {
        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;
    }
}
