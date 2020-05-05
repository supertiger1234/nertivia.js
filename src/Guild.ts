import { Client } from ".";
import Collection from "@discordjs/collection";
import Channel from './Channel'
import ServerMember from './ServerMember'
import { END_POINTS } from "./constants";

export default class Guild {
    id: string;
    client: Client;
    name: string;
    channels: Collection<string, Channel>;
    members: Collection<string, ServerMember>;
    icon: string;
    iconURL: string;
    constructor(server: any, client: Client) {
        this.id = server.server_id
        this.name = server.name
        this.icon = server.avatar
        this.iconURL = END_POINTS.NERTIVIA_CDN + this.icon;
        this.channels = new Collection()
        this.members = new Collection()
        this.client = client
    }

    _addMember(data: any) {
        const user = this.client.dataManager.newUser(data.member);
        if (!user) return;
        const sm = new ServerMember(this.client, {...data, user});
        this.members.set(user.id, sm);
        return sm;
    }


}