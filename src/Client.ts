import { Channel, Guild, Message, Role, ServerMember } from '.'

import Users from './Users'
import Channels from './Channels'
import Guilds from './Guilds'
import DataManager from './DataManager'
import ClientUser from './ClientUser'

import Fetch from './Utils/fetch'

import { IAuthenticationData, IServerRoleAuth, IServerMemberAuth, IServerAuth, IChannelAuth } from './Interfaces/AuthenticationData'
import { PresenceStatusData, PresenceStatus } from './Interfaces/Status'
import { IClientEvents, clientEventsNames } from './Interfaces/ClientEvents'
import { IMessage } from './Interfaces/Message'

import io from 'socket.io-client'
import wildcard from 'socketio-wildcard'
const socketIOWildcard = wildcard(io.Manager)

export default class Client {
  token: string | null = null
  user?: ClientUser = undefined
  listeners: Map<keyof IClientEvents | string, Function | undefined> = new Map()
  socket: SocketIOClient.Socket = io('https://nertivia.supertiger.tk', { autoConnect: true })
  users: Users = new Users(this)
  channels: Channels = new Channels(this)
  guilds: Guilds = new Guilds(this)
  fetch: Fetch = new Fetch(this)
  dataManager: DataManager = new DataManager(this)

  login (token: string) {
    return new Promise((resolve, reject) => {
      if (this.token) reject(new Error('Already logged in.'))
      this.token = token
      this.socket.connect()
      socketIOWildcard(this.socket)
      const connectEvent = () => {
        this.socket.removeAllListeners()
        this.socket.emit('authentication', { token })
        this.socket.once('success', (data: IAuthenticationData) => {
          resolve('success')
          this.socket.off('auth_err')
          this.dataManager.newUser(data.user)
          this.user = new ClientUser(data.user, this)

          // get DM Channels + users
          for (const dm of data.dms) {
            if (dm.recipients === undefined) {
              continue
            }
            this.dataManager.newUser(dm.recipients[0])
            this.dataManager.newChannel(dm)
          }

          // get servers + channels
          for (const server of data.user.servers) {
            const guild = new Guild(server, this)
            this.guilds.cache.set(server.server_id, guild)
            for (const channel of server.channels) {
              this.dataManager.newChannel(channel, guild)
            }
          }

          // get server users
          for (const member of data.serverMembers) {
            this.guilds.cache.get(member.server_id)?.addMember(member)
          }
          // get presences
          for (const [id, status] of data.memberStatusArr) {
            const user = this.users.cache.get(id)
            if (user !== undefined) {
              user.presence.status = PresenceStatusData[parseInt(status)] as PresenceStatus
            }
          }
          // get activity status
          for (const [id, activity] of data.customStatusArr) {
            const user = this.users.cache.get(id)
            if (user !== undefined) {
              user.presence.activity = activity
            }
          }
          // get roles
          for (const role of data.serverRoles) {
            const guild = this.guilds.cache.get(role.server_id)
            if (guild !== undefined) {
              guild.roles.cache.set(role.id, new Role(role, guild))
            }
          }

          const readyCB = this.listeners.get(clientEventsNames.ready)
          if (readyCB) readyCB()
        })
        this.socket.once('auth_err', (data: string) => {
          reject(new Error(data))
          this.socket.removeAllListeners()
        })
        this.socket.on('disconnect', () => {
          const cb = this.listeners.get(clientEventsNames.error)
          if (cb) cb(new Error('Connection Lost.'))
          else throw new Error('Connection Lost.')
          this.socket.removeAllListeners()
          this.socket.on('connect', connectEvent)
        })
        this.socket.on('*', (res: any) => {
          const [event, data]: [string, any] = res.data
          if (Object.keys(events).includes(event)) {
            const listenerData = events[event](data, this)
            if (listenerData === undefined) { return }
            const [eventName, dataObject, callback] = listenerData
            const listener = this.listeners.get(eventName)
            return listener?.call(listener, dataObject, callback?.call(callback, data, this))
          } else {
            if (!['success'].includes(event)) {
              console.warn(`Received unexpected event:\n${event}`)
              console.warn(`With data:\n${JSON.stringify(data)}`)
            }
          }
        })
      }
      this.socket.on('connect', connectEvent)
    })
  }

  on<T extends keyof IClientEvents> (type: T, callback: IClientEvents[T]) {
    if (this.listeners.get(type)) { return }
    this.listeners.set(type, callback)
  }

  off<T extends keyof IClientEvents> (type: T) {
    this.listeners.delete(type)
  }
}

function buttonDone (data: {channelID: string, messageID: string, id: string, clickedByID: string}, client: Client) {
  return function (message?: string) {
    return client.fetch.messageButtonCallback(data.channelID, data.messageID, data.id, data.clickedByID, message)
  }
}

const events: {[key: string]: (data: any, client: Client)=>[string, any?, Function?]|undefined} = {
  [clientEventsNames.message]: (data: {message: IMessage}, client: Client) => {
    return ['message', new Message(data.message, client)]
  },
  [clientEventsNames.messageUpdate]: (data: IMessage, client: Client) => {
    return ['messageUpdate', new Message(data, client)]
  },
  'member:custom_status_change': (data: { uniqueID: string, custom_status: string }, client: Client) => {
    const presence = client.users.cache.get(data.uniqueID)?.presence
    if (presence !== undefined) {
      presence.activity = data.custom_status
      return ['presenceUpdate', presence]
    }
    return undefined
  },
  'programActivity:changed': (data: { unique_id: string, status?: string, name?: string}, client: Client) => {
    // TODO: This is not correct; probably have to change Presence class
    const presence = client.users.cache.get(data.unique_id)?.presence
    if (presence !== undefined) {
      presence.activity = data.status ?? null
      return ['presenceUpdate', presence]
    }
    return undefined
  },
  [clientEventsNames.presenceUpdate]: (data: { uniqueID: string, status: string }, client: Client) => {
    const presence = client.users.cache.get(data.uniqueID)?.presence
    if (presence !== undefined) {
      presence.status = PresenceStatusData[parseInt(data.status)] as PresenceStatus
      return ['presenceUpdate', presence]
    }
    return undefined
  },
  [clientEventsNames.channelCreate]: (data: { channelAuth: IChannelAuth }, client: Client) => {
    return ['channel', new Channel(data.channelAuth, client)]
  },
  [clientEventsNames.channelDelete]: (data: { channelID: string, server_id?: string}, client: Client) => {
    const channel = client.channels.cache.get(data.channelID)
    if (channel === undefined) {
      return undefined
    }
    client.channels.cache.delete(data.channelID)
    if (data.server_id !== undefined) {
      const guild = client.guilds.cache.get(data.server_id)
      if (guild !== undefined && guild.channels.has(data.channelID)) {
        guild.channels.delete(data.channelID)
      }
    }
    client.channels.cache.delete(data.channelID)
    return ['channelDelete', channel]
  },
  [clientEventsNames.guildMemberAdd]: (data: { serverMember: IServerMemberAuth, custom_status?: string, presence: string }, client: Client) => {
    const user = client.users.cache.get(data.serverMember.member.uniqueID)
    if (user !== undefined) {
      user.presence.status = PresenceStatusData[parseInt(data.presence)] as PresenceStatus
      user.presence.activity = data.custom_status ?? null
      return ['guildMemberAdd', client.guilds.cache.get(data.serverMember.server_id)?.addMember(data.serverMember)]
    }
    return undefined
  },
  [clientEventsNames.guildMemberRemove]: (data: { uniqueID: string, server_id: string }, client: Client) => {
    const guild = client.guilds.cache.get(data.server_id)
    const member = guild?.members.get(data.uniqueID)
    const memberClone: ServerMember = Object.assign(Object.create(Object.getPrototypeOf(member)), member)
    if (guild) {
      guild.members.delete(data.uniqueID)
    }
    return ['guildMemberRemove', memberClone]
  },
  'server:update_server': (data: IServerAuth, client: Client) => {
    const guild = client.guilds.cache.get(data.server_id)
    if (guild !== undefined) {
      guild.name = data.name
      if (data.avatar) {
        guild.icon = data.avatar
      }
    }
    return undefined
  },
  [clientEventsNames.guildCreate]: (server: IServerAuth, client: Client) => {
    const guild = new Guild(server, client)
    client.guilds.cache.set(server.server_id, guild)
    for (let index = 0; index < server.channels.length; index++) {
      const channel = server.channels[index]
      client.dataManager.newChannel(channel, guild)
      return ['guildCreate', guild]
    }
    return undefined
  },
  [clientEventsNames.messageButtonClicked]: (data: any, _client: Client) => {
    return ['messageButtonClicked', data, buttonDone]
  },
  [clientEventsNames.roleUpdate]: (data: IServerRoleAuth, client: Client) => {
    const guild = client.guilds.cache.get(data.server_id)
    if (!guild) {
      return undefined
    }
    const role = guild.roles.cache.get(data.id)
    if (!role) {
      return undefined
    }
    role.permissions = data.permissions || role.permissions
    role.color = data.color || role.color
    role.name = data.name || role.name
    return ['roleUpdate', role]
  },
  [clientEventsNames.roleCreate]: (data: IServerRoleAuth, client: Client) => {
    const guild = client.guilds.cache.get(data.server_id)
    if (!guild) {
      return undefined
    }
    if (guild.roles.cache.has(data.id)) {
      return undefined
    }
    const role = new Role(data, guild)
    guild.roles.cache.set(data.id, role)
    return ['roleCreate', role]
  },
  [clientEventsNames.guildDelete]: (data: any, client: Client) => {
    const guild = client.guilds.cache.get(data.server_id)
    if (guild) {
      client.guilds.cache.delete(data.server_id)
    }
    return ['guildDelete', guild]
  },
  'server:members': (data: {
      serverMembers: IServerMemberAuth[],
      memberPresences: [string, string][],
      programActivityArr: [string, string][]
    }, client: Client) => {
    for (const member of data.serverMembers) {
      client.guilds.cache.get(member.server_id)?.addMember(member)
    }
    for (const [id, status] of data.memberPresences) {
      const user = client.users.cache.get(id)
      if (user !== undefined) {
        user.presence.status = PresenceStatusData[parseInt(status)] as PresenceStatus
      }
    }
    for (const [id, activity] of data.programActivityArr) {
      const user = client.users.cache.get(id)
      if (user !== undefined) {
        user.presence.activity = activity
      }
    }

    // guild create is used here since members is a seperate event
    // and members array would be empty if used properly.
    const guild = client.guilds.cache.get(data.serverMembers[0].server_id)
    if (guild === undefined) {
      return undefined
    }
    return ['guildCreate', guild]
  },
  'server:roles': (data: {roles: IServerRoleAuth[]}, client: Client) => {
    for (const role of data.roles) {
      const guild = client.guilds.cache.get(role.server_id)
      if (guild !== undefined) {
        guild.roles.cache.set(role.id, new Role(role, guild))
      }
    }
    return undefined
  }
}
