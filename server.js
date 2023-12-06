require('dotenv').config();

const tmi = require('tmi.js');

const webServer = require('./data/webServer'); // Require the Express app instance and commands from webServer.js

const commandList = require('./commands/handlers/commandList');
const cooldowns = {}; // Cooldowns object to track command cooldowns  
const { isOnCooldown, getRemainingCooldown, setCooldown } = require('./commands/handlers/cooldown');   

// Import the database
const { getCommandFromDatabase, default_cooldown_duration } = require('./commands/handlers/db');

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

function onMessageHandler(target, context, msg, self) {
  if (self) {
    return; // Ignore messages from the bot
  }

  const commandName = msg.replace(/[^ -~]+$/, '').trim();

  for (const [command, data] of Object.entries(commandList)) {
    if (commandName.startsWith(command)) {
      const { cooldown, cooldownDuration } = data;
      if (cooldown && isOnCooldown(context.username, command, cooldowns)) {
        if (command === '!chatgpt') {
          // For !chatgpt, reply with remaining cooldown
          const remainingCooldown = getRemainingCooldown(context.username, command, cooldowns);
          client.say(target, `@${context.username}, !chatgpt is still on cooldown. Remaining cooldown: ${remainingCooldown} seconds.`);
        }
        // const remainingCooldown = getRemainingCooldown(context.username, command, cooldowns);
        // client.say(target, `@${context.username}, ${command} is still ${remainingCooldown} seconds on cooldown.`);
      } else {
        // Execute the command and set cooldown if applicable
        data.execute(target, client, context, msg, cooldowns);
        if (cooldown) {
          setCooldown(context.username, command, cooldowns, cooldownDuration);
        }
        console.log(`* Executed ${commandName} command`);
      }
    }
  }

  // Check if the command is in the database
  getCommandFromDatabase(target, commandName)
    .then(databaseCommand => {
      if (databaseCommand) {
        // Apply default cooldown for database commands
        if (isOnCooldown(context.username, commandName, cooldowns)) {
          const remainingCooldown = getRemainingCooldown(context.username, commandName, cooldowns);
          // client.say(target, `@${context.username}, ${commandName} is still ${remainingCooldown} seconds on cooldown.`);
        } else {
          client.say(target, databaseCommand.response);
          setCooldown(context.username, commandName, cooldowns, default_cooldown_duration);
          console.log(`* Executed ${commandName} command from the database`);
        }
      }
    })
    .catch(error => {
      console.error('Error handling database command:', error.message);
    });
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}