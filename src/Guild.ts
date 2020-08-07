import Client from './Client'
import Channel from './Channel'
import ServerMember from './ServerMember'
import { END_POINTS } from './constants'
import RolesManager from './RolesManager'

import { IServerAuth, IServerMemberAuth } from './Interfaces/AuthenticationData'

import Collection from '@discordjs/collection'

export default class Guild {
  id: string
  client: Client
  name: string
  channels: Collection<string, Channel>
  members: Collection<string, ServerMember>
  icon?: string
  roles: RolesManager
  constructor (server: IServerAuth, client: Client) {
    this.id = server.server_id
    this.name = server.name
    this.icon = server.avatar
    this.channels = new Collection()
    this.members = new Collection()
    this.client = client
    this.roles = new RolesManager(this)
  }

  get iconURL (): string {
    return END_POINTS.NERTIVIA_CDN + this.icon
  }

  addMember (data: IServerMemberAuth) {
    const user = this.client.dataManager.newUser(data.member)
    const member = new ServerMember(this.client, this, { ...data, user })
    this.members.set(user.id, member)
    return member
  }

  createInvite () {
    return this.client.fetch.createInvite(this)
  }
}
