import Client from './Client'
import Presence from './Presence'
import { END_POINTS } from './constants'

import { SendOptions } from './Interfaces/SendOptions'

export default class User {
  username: string
  tag: string
  avatar?: string
  id: string
  discriminator: string
  client: Client
  presence: Presence
  avatarURL: string
  bot: boolean

  constructor (user: any, client: Client) {
    this.username = user.username
    this.tag = `${user.username}:${user.tag}`
    this.avatar = user.avatar
    this.avatarURL = END_POINTS.NERTIVIA_CDN + this.avatar
    this.id = user.uniqueID
    this.discriminator = user.tag
    this.client = client
    this.presence = new Presence('invisible', user.custom_status, this, this.client)
    this.bot = !!user.bot
    if (user.status) {
      this.presence.status = user.status
    }
  }

  toString () {
    return `<@${this.id}>`
  }

  send (content: string, options: SendOptions = {}) {
    return this.client.fetch.send(content, options, this)
  }
}
