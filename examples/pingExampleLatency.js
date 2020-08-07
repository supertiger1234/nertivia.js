const Nertivia = require('nertivia.js')
const client = new Nertivia.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
  if (msg.content === 'ping') {
    const t0 = Date.now()
    msg.send('pong! (Wait)').then(ms => {
      const t1 = Date.now()
      ms.edit('pong! (' + (t1 - t0) + 'ms)')
    })
  }
})

client.login('token')
