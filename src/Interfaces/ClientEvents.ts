import { IMessageButton } from './MessageButton'

import { Channel, Role, Guild, ServerMember, Message, Presence } from '..'

export interface IClientEvents {
  channelCreate: (channel: Channel) => void
  channelDelete: (channel: Channel) => void
  error: (error: Error) => void
  guildCreate: (guild: Guild) => void
  guildMemberAdd: (serverMember: ServerMember) => void
  guildMemberRemove: (serverMember: ServerMember) => void
  guildDelete: (guild: Guild) => void
  message: (message: Message) => void
  messageButtonClicked: (Button: IMessageButton, done: (message?: string) => Promise<any>) => void
  messageUpdate: (message: Message) => void
  presenceUpdate: (presence: Presence) => void
  ready: () => void
  roleCreate: (role: Role) => void
  roleUpdate: (role: Role) => void
}

export enum clientEventsNames {
  channelCreate = 'server:add_channel',
  channelDelete = 'server:remove_channel',
  error = 'error',
  guildCreate = 'server:joined',
  guildDelete = 'server:leave',
  guildMemberAdd = 'server:member_add',
  guildMemberRemove = 'server:member_remove',
  message = 'receiveMessage',
  messageButtonClicked = 'message_button_clicked',
  messageUpdate = 'update_message',
  presenceUpdate = 'userStatusChange',
  ready = 'ready',
  roleCreate = 'server:create_role',
  roleUpdate = 'server:update_role'
  /* Not implemented (yet)?
  typingStatus {"channel_id":"6692365473675218944","user":{"unique_id":"6692353538904821760","username":"Toby"}}
  programActivity:changed {"name":"Visual Studio Code","status":"Coding","uniqueID":"6691966937330618368"}
  */
}
