import Client from './Client'
import Guild from './Guild'

import Collection from '@discordjs/collection'

export default class Guilds {
  client: Client
  cache: Collection<string, Guild>
  constructor (client: Client) {
    this.client = client
    this.cache = new Collection()
  }

  fetch (_id: string, _cache?: boolean) {
    console.log('guilds.fetch not implemented yet.')
  }
}
