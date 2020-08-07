const Nertivia = require('nertivia.js')
const client = new Nertivia.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong!')
  }
})

client.login('token')
