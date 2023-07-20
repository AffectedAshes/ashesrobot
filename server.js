require('dotenv').config();

const tmi = require('tmi.js');

const commandList = require('./commands/commandList');
const { isOnCooldown, getRemainingCooldown, setCooldown } = require('./commands/cooldown');      

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME1,
    process.env.CHANNEL_NAME2,
    process.env.CHANNEL_NAME3,
    process.env.CHANNEL_NAME4,
    process.env.CHANNEL_NAME5,
    // Add more channel names as needed
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Cooldowns object to track command cooldowns
const cooldowns = {};

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return; // Ignore messages from the bot
  }

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // Iterate over the command list
  for (const [command, data] of Object.entries(commandList)) {
    if (msg.includes(command)) {
      const { cooldown, cooldownDuration } = data;
      if (cooldown && isOnCooldown(context.username, command, cooldowns)) {
        const remainingCooldown = getRemainingCooldown(context.username, command, cooldowns);
        client.say(target, `@${context.username} The command is still ${remainingCooldown} seconds on cooldown.`);
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