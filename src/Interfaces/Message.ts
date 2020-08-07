import { IUserAuth } from './AuthenticationData'

export interface IMessage {
    channelID: string
    message: string // content
    creator: IUserAuth
    created: number
    mentions: unknown[]
    quotes: unknown[]
    messageID: string
    timeEdited: number
    files: unknown[]
    embed: unknown // 0 | IEmbed
}
