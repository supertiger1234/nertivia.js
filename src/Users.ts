import { Client } from ".";
import { User } from "./User";
import Collection from "@discordjs/collection";

export default class Users {
    client: Client;
    cache: Collection<string, User>;
    constructor(client: Client) {
        this.client = client;
        this.cache = new Collection();
    }

    fetch(id: string, cache?: boolean) {
        console.log("users.fetch not implimented yet.")
    }
}