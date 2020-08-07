import Client from './Client'
import Guild from './Guild'
import Channel from './Channel'
import User from './User'

import { IChannelAuth, IUserAuth } from './Interfaces/AuthenticationData'
import { IUser } from './Interfaces/User'

export default class DataManager {
  client: Client
  constructor (client: Client) {
    this.client = client
  }

  newChannel (data: IChannelAuth, guild?: Guild) {
    const channel = new Channel(data, this.client)
    if (data.server_id !== undefined) {
      guild = guild ?? this.client.guilds.cache.get(data.server_id)
      if (guild === undefined) {
        throw new Error('Tried to create invalid channel in DataManager (Has invalid server_id)')
      }
      guild.channels.set(data.channelID, channel)
    }

    this.client.channels.cache.set(channel.id, channel)
    return channel
  }

  newUser (data: (IUser & IUserAuth)) {
    let user = this.client.users.cache.get(data.uniqueID)
    if (user === undefined) {
      user = new User(data, this.client)
      this.client.users.cache.set(user.id, user)
    }
    return user
  }
}
