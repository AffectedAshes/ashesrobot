require('dotenv').config();

const tmi = require('tmi.js');

const webServer = require('./data/webServer'); // Require the Express app instance and commands from webServer.js

const commandList = require('./commands/handlers/commandList');
const cooldowns = {}; // Cooldowns object to track command cooldowns  
const { isOnCooldown, getRemainingCooldown, setCooldown } = require('./commands/handlers/cooldown');   

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: process.env.CHANNEL_LIST.split(","),
  joinInterval: 3000,
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return; // Ignore messages from the bot
  }

  // Remove non-printable characters after the command name
  const commandName = msg.replace(/[^ -~]+$/, '').trim();

  // Iterate over the command list
  for (const [command, data] of Object.entries(commandList)) {
    if (commandName.startsWith(command)) {
      const { cooldown, cooldownDuration } = data;
      if (cooldown && isOnCooldown(context.username, command, cooldowns)) {
        const remainingCooldown = getRemainingCooldown(context.username, command, cooldowns);
        //client.say(target, `@${context.username}, ${command} is still ${remainingCooldown} seconds on cooldown.`); // Inform the user about the remaining cooldown time
      } else {
        data.execute(target, context.username, client, msg, context); // Pass `msg` and `context` to the command function
        if (cooldown) {
          setCooldown(context.username, command, cooldowns, cooldownDuration);
        }
        console.log(`* Executed ${commandName} command`);
      }
    }
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}