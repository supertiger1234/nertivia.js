import fetch from 'node-fetch'
import { JsonInput } from 'jsonhtmlfyer'

import Channel from '../Channel'
import Client from '../Client'
import Guild from '../Guild'
import HTMLEmbedBuilder from '../HTMLEmbedBuilder'
import Message from '../Message'
import Role from '../Role'
import User from '../User'
import { END_POINTS } from '../constants'

import { SendOptions } from '../Interfaces/SendOptions'

export default class Fetch {
  client: Client
  constructor (client: Client) {
    this.client = client
  }

  postJSON (method: string, path: string, json?: any): Promise<any> {
    if (!this.client.token) return Promise.reject(new Error('Token not provided.'))

    return new Promise((resolve, reject) => {
      fetch(`https://supertiger.tk/${path}`, {
        // fetch(`http://localhost/${path}`, {
        method: method,
        headers: {
          authorization: this.client.token as string,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
      }).then(async res => {
        if (res.ok) {
          resolve(await res.json())
        } else {
          reject(await res.json())
        }
      })
        .catch(err => { reject(err) })
    })
  }

  send (content: string, opts: SendOptions, channel: Channel | User) {
    let fetch: Promise<any>
    if (opts.htmlEmbed && opts.htmlEmbed instanceof HTMLEmbedBuilder) {
      opts.htmlEmbed = (opts.htmlEmbed.embed as JsonInput)
    }
    if (channel instanceof User) {
      fetch = this.client.fetch.createDM(channel).then(chan =>
        this.postJSON('post', END_POINTS.MESSAGES_CHANNELS_PATH + chan.id, {
          message: content,
          ...opts
        })
      )
    } else {
      fetch = this.postJSON('post', END_POINTS.MESSAGES_CHANNELS_PATH + channel.id, {
        message: content,
        ...opts
      })
    }
    return fetch.then(data =>
      new Message(data.messageCreated, this.client)
    )
  }

  deleteMessage (channel: Channel, message: Message) {
    return this.postJSON('delete', END_POINTS.MESSAGES_PATH + `${message.id}/channels/${channel.id}`).then(() => {
      return message
    })
  }

  edit (content: string, opts: SendOptions, message: Message) {
    return this.postJSON('patch', `${END_POINTS.MESSAGES + message.id}/channels/${message.channel?.id}`, {
      message: content,
      ...opts
    }).then(data =>
      new Message(data, this.client)
    )
  }

  createDM (recipient: User): Promise<Channel> {
    const channel = this.getExistingDM(recipient)
    if (channel) return Promise.resolve(channel)
    return this.postJSON('post', END_POINTS.CHANNELS_PATH + recipient.id).then(({ channel }) => {
      const newChannel = this.client.dataManager.newChannel(channel)
      if (!newChannel) return Promise.reject(new Error('Failed to add channel.'))
      return newChannel
    })
  }

  getExistingDM (user: User) {
    return this.client.channels.cache.find(channel =>
      channel.recipient?.id === user.id
    )
  }

  setStatus (status: number) {
    return this.postJSON('post', `${END_POINTS.SETTINGS}/status`, { status })
  }

  setActivity (content: string) {
    return this.postJSON('post', `${END_POINTS.SETTINGS}/custom-status`, { custom_status: content })
  }

  messageButtonCallback (channelID: string, messageID: string, buttonID: string, clickedByID: string, message?: string) {
    return this.postJSON('patch', `${END_POINTS.CHANNELS_PATH}${channelID}/messages/${messageID}/button/${buttonID}`, { clickedByID, message })
  }

  createRole (opts: {data: {name: string, color: string}}, guild: Guild) {
    return this.postJSON('post', `${END_POINTS.SERVERS_PATH}${guild.id}/roles`, opts.data)
  }

  updateRole (opts: any, role: Role, guild: Guild) {
    return this.postJSON('patch', `${END_POINTS.SERVERS_PATH}${guild.id}/roles/${role.id}`, opts)
  }

  createInvite (guild: Guild): Promise<{invite_code: string}> {
    return this.postJSON('post', `${END_POINTS.SERVERS_PATH}${guild.id}/invite`)
  }
}
