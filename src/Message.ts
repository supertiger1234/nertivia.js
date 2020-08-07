import Client from './Client'
import Channel from './Channel'
import Guild from './Guild'
import User from './User'
import ServerMember from './ServerMember'
import MessageMentions from './MessageMentions'

import { IMessage } from './Interfaces/Message'
import { SendOptions } from './Interfaces/SendOptions'

export default class Message {
  id: string
  content?: string
  author: User
  channel?: Channel
  guild?: Guild
  client: Client
  member?: ServerMember
  mentions: MessageMentions

  constructor (message: IMessage, client: Client) {
    this.id = message.messageID
    this.content = message.message
    this.author = client.users.cache.get(message.creator.uniqueID) ?? (() => { throw new Error('Message has invalid author. ID: ' + message.creator.uniqueID) })()
    this.channel = client.channels.cache.get(message.channelID)
    this.guild = this.channel?.guild
    this.member = this.guild?.members.get(message.creator.uniqueID)
    this.client = client
    this.mentions = new MessageMentions(this, this.client)
  }

  send (content: string, options: SendOptions = {}) {
    return this.channel?.send(content, options)
  }

  edit (content: string, options: SendOptions = {}) {
    return this.client.fetch.edit(content, options, this)
  }

  reply (content: string, options: SendOptions = {}) {
    return this.channel?.send(`<@${this.author.id}>, ${content}`, options)
  }

  delete (delay: number = 0) {
    setTimeout(() => {
      return this.client.fetch.deleteMessage(this.channel!!, this)
    }, delay)
  }
}
