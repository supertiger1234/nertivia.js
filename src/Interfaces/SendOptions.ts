import { JsonInput } from 'jsonhtmlfyer'
export interface SendOptions {
  /**
   * Add buttons to your message 👉.
   */
  buttons?: IButton[],
  /**
   * Add a cool lookin' HTML Embed 🌟.
   */
  htmlEmbed?: JsonInput
}

export interface IButton {
  /**
   * Id is used to target a button when an event is fired.
   */
  id: string
  /**
   * Name of the button 🤯.
   */
  name: string,
}
