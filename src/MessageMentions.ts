import ServerMember from './ServerMember'
import User from './User'
import Message from './Message'
import Client from './Client'

import Collection from '@discordjs/collection'

export default class MessageMentions {
  members: Collection<string, ServerMember>
  users: Collection<string, User>
  constructor (message: Message, client: Client) {
    this.members = new Collection()
    this.users = new Collection()

    const result = message.content?.match(/<@(\d+)>/g) ?? []
    for (let id of result) {
      id = id.slice(2, id.length - 1)
      const user = client.users.cache.get(id)
      if (user !== undefined) {
        this.users.set(id, user)
      }
      const member = message.guild?.members.get(id)
      if (member !== undefined) {
        this.members.set(id, member)
      }
    }
  }
}
