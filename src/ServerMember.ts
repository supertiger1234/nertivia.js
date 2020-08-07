import User from './User'
import Client from './Client'
import Guild from './Guild'

export default class ServerMember {
  user: User
  client: Client
  type: string
  guild: Guild

  constructor (client: Client, guild: Guild, member: any) {
    this.guild = guild
    this.user = member.user
    this.type = member.type
    this.client = client
  }

  toString () {
    return `<@${this.user.id}>`
  }
}
