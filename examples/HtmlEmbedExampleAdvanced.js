const Nertivia = require('nertivia.js')
const client = new Nertivia.Client()

client.on('ready', () => {
  console.log('ready')
})

client.on('message', msg => {
  if (msg.content === '!help') {
    msg.send('-', {
      htmlEmbed: {
        tag: 'div',
        styles: {
          backgroundImage: 'https://media.nertivia.tk/763085785093499319/6685239856559296512/pink_sunset.webp',
          backgroundSize: '100%',
          backgroundPosition: 'center'
        },
        content: {
          tag: 'div',
          styles: {
            background: 'rgba(0,0,0,0.5)',
            padding: '10px'
          },
          content: [
            {
              tag: 'div',
              content: '**Help**'
            },
            {
              tag: 'div',
              content: '``!mute`` - Mutes a person'
            },
            {
              tag: 'div',
              content: '``!unmute`` - Unmutes a person'
            }
          ]
        }
      }
    })
  }
})

client.login('token')
