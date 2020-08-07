import Guild from './Guild'
import Client from './Client'
import Role from './Role'

import Collection from '@discordjs/collection'

export default class RolesManager {
  guild: Guild
  client: Client
  cache: Collection<string, Role>
  constructor (guild: Guild) {
    this.guild = guild
    this.client = this.guild.client
    this.cache = new Collection()
  }

  create (opts: {data: {name: string, color: string}}) {
    return this.client.fetch.createRole(opts, this.guild).then(res => {
      const role = new Role(res, this.guild)
      this.guild.roles.cache.set(res.id, role)
      return role
    })
  }
}
