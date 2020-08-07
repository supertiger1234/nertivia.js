import { IUser } from './User'

export interface IAuthenticationData {
  user: IUser & IUserAuth
  serverMembers: IServerMemberAuth[]
  dms: IChannelAuth[]
  memberStatusArr: [[string, string]]
  customStatusArr: [[string, string]],
  serverRoles: IServerRoleAuth[]
}
export interface IServerRoleAuth {
  name: string,
  permissions: number,
  deletable: boolean,
  id: string,
  server_id: string,
  order: number,
  color: string
}
export interface IUserAuth {
  uniqueID: string
  servers: IServerAuth[]
}
export interface IServerAuth {
  name: string
  creator: string
  server_id: string
  avatar?: string
  banner?: string
  channels: IChannelAuth[]
}
export interface IChannelAuth {
  name: string
  channelID: string
  server_id?: string
  recipients?: (IUser & IUserAuth)[]
}
export interface IServerMemberAuth {
  type: string
  member: IUser & IUserAuth
  server_id: string
}
