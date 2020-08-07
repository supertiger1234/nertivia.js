const Nertivia = require('nertivia.js')
const client = new Nertivia.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
  if (msg.content === '!embed') {
    // can be reordered.
    const embedBuilder = new Nertivia.HTMLEmbedBuilder({ direction: 'column' })
      .setBackgroundImage('https://media.nertivia.tk/763085785093499319/6685984800752275456/Crystal%20Arcadia%20Logo.webp')
      .addAvatar(msg.author.avatarURL, msg.author.username)
      .addText('o cool boi owo cool boi')

    msg.send('owo', {
      htmlEmbed: embedBuilder
    })
  }
})

client.login('token')
