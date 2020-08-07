# Nertivia.js
NodeJS library for Nertivia API

## Notice
This library is in its early stages. A lot of features are missing. If you find any issues, make sure you post them in the issues page in GitHub.

## Usage

```npm i nertivia.js```

```js
const Nertivia = require("nertivia.js");
const client = new Nertivia.Client();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
})


client.on("message", msg => {
    if (msg.content === "ping") {
        msg.reply("pong!")
    }
})

client.login("token")
```
