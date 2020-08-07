import { JsonInput } from 'jsonhtmlfyer'

interface Opts {
  direction?: Direction
}

type Direction = 'column' | 'row'

// Might change into a class later
type Embed = Omit<JsonInput, 'content'> & { content: JsonInput[] }

export default class HTMLEmbedBuilder {
  embed: Embed
  direction: Direction
  constructor (options?: Opts) {
    this.direction = options?.direction ?? 'row'
    this.embed = {
      tag: 'div',
      styles: {
        display: 'flex',
        flexDirection: this.direction
      },
      content: []
    }
  }

  setBackgroundImage (url: string) {
    this.embed.styles = this.embed.styles ?? {}

    this.embed.styles.backgroundImage = url
    this.embed.styles.backgroundSize = '100%'
    this.embed.styles.backgroundPosition = 'center'

    return this
  }

  addAvatar (url: string, text?: string, direction?: Direction) {
    const content: any = [
      {
        tag: 'img',
        attributes: { src: url },
        styles: {
          borderRadius: '50%',
          height: '30px',
          marginRight: '5px',
          width: '30px'
        }
      }
    ]

    if (text) {
      content.push({
        tag: 'span',
        content: text
      })
    }
    this.embed.content.push({
      tag: 'div',
      styles: {
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        flexDirection: direction || 'row'
      },
      content

    })
    return this
  }

  addText (text: string) {
    this.embed.content.push({
      tag: 'div',
      content: text
    })
    return this
  }
}
