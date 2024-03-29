import { Singleton } from "../util/singleton";

export class ApiProvider extends Singleton {
    private readonly url = 'http://localhost:4000';

    fetch(endpoint: string, options?: RequestInit): Promise<Response> {
        const url = this.url + endpoint;
        return fetch(url, options)
            .then(r => r.json())
        ;
    }
}
