import Client from './Client'
import User from './User'

import { PresenceStatus, PresenceStatusData } from './Interfaces/Status'

export default class Presence {
  client: Client
  status: PresenceStatus
  user: User
  activity: string | null

  constructor (status: PresenceStatus | number, activity: string | undefined, user: User, client: Client) {
    this.user = user
    this.client = client
    this.activity = activity ?? null
    this.status = typeof status === 'number' ? PresenceStatusData[status] as PresenceStatus : status
  }
}
