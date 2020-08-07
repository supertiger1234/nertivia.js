import Client from './Client'
import Guild from './Guild'
import User from './User'

import { SendOptions } from './Interfaces/SendOptions'
import { IChannelAuth } from './Interfaces/AuthenticationData'

export default class Channel {
  id: string
  name?: string
  guild?: Guild
  recipient?: User
  client: Client
  constructor (channel: IChannelAuth, client: Client) {
    this.name = channel.name
    this.id = channel.channelID
    if (channel.server_id !== undefined) {
      this.guild = client.guilds.cache.get(channel.server_id)
    }
    this.client = client
    if (channel.recipients !== undefined && channel.recipients.length > 0) {
      this.recipient = this.client.users.cache.get(channel.recipients[0].uniqueID)
    }
  }

  send (content: string, options: SendOptions = {}) {
    return this.client.fetch.send(content, options, this)
  }

  toString () {
    return `<#${this.id}>`
  }
}
