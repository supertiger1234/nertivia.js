const Nertivia = require('nertivia.js')
const client = new Nertivia.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('messageButtonClicked', (button, done) => {
  if (button.id === 'hug-me') {
    client.channels.cache.get(button.channelID).send(`**hugs** <@${button.clickedByID}>`)
    done()
  }

  if (button.id === 'kick-me') {
    client.channels.cache.get(button.channelID).send(`<@${button.clickedByID}> has been kicked (Not really)`, {
      buttons: [{ id: 'unban', name: 'undo' }]
    })
    done()
  }
  if (button.id === 'unban') {
    done('Action not implemented!')
  }
})

client.on('message', msg => {
  if (msg.content === '!actions') {
    msg.reply('Click on the actions below', {
      buttons: [
        {
          id: 'hug-me',
          name: 'Hug'
        },
        {
          id: 'kick-me',
          name: 'Kick'
        }
      ]
    })
  }
})

client.login('token')
