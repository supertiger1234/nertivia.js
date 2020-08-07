import User from './User'
import { PresenceStatus, PresenceStatusData } from './Interfaces/Status'

export default class ClientUser extends User {
  setStatus (status: PresenceStatus) {
    if (PresenceStatusData.indexOf(status) === -1) {
      return Promise.reject(new Error('Invalid Status.'))
    }
    return this.client.fetch.setStatus(PresenceStatusData.indexOf(status)).then(() => {
      this.presence.status = status
      return this.presence
    })
  }

  // setActivity({ action: "Exploring", name: "Nertivia" })
  // setActivity("Bree")
  setActivity (content: string) {
    return this.client.fetch.setActivity(content).then(() => {
      this.presence.activity = content
      return this.presence
    })
  }
}
