require('dotenv').config();

const tmi = require('tmi.js');

const webServer = require('./data/webServer'); // Require the Express app instance and commands from webServer.js

const commandList = require('./commands/handlers/commandList');
const { isOnCooldown, getRemainingCooldown, setCooldown } = require('./commands/handlers/cooldown');      
const { updateStreamTitle, updateStreamGame, getGameIdFromTwitchApi } = require('./commands/handlers/streamUpdater');

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
    process.env.CHANNEL_NAME6,
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

  // Get the value of the CHANNEL_NAME1 environment variable
  const CHANNEL_NAME1 = process.env.CHANNEL_NAME1;

  // Command to change stream title
  if (msg.match(/^!changetitle\s+/) && target === `#${CHANNEL_NAME1}`) {
  const newTitle = msg.replace(/^!changetitle\s+/, '');
  if (isModeratorOrBroadcaster(context)) {
    updateStreamTitle(process.env.BROADCASTER_ID, newTitle) // Use numeric broadcaster ID
      .then(() => {
        client.say(target, `@${context.username} Stream title updated to: ${newTitle}`);
      })
      .catch((error) => {
        console.error('Error updating stream title:', error);
      });
  } else {
    client.say(target, `@${context.username} You do not have permission to use this command.`);
  }
  }

  // Command to change stream game
  if (msg.match(/^!changegame\s+/) && target === `#${CHANNEL_NAME1}`) {
  const newGame = msg.replace(/^!changegame\s+/, '');
  if (isModeratorOrBroadcaster(context)) {
    // Lookup game ID from Twitch API
    getGameIdFromTwitchApi(newGame)
      .then((newGameId) => {
        updateStreamGame(process.env.BROADCASTER_ID, newGameId)
          .then(() => {
            client.say(target, `@${context.username} Stream game updated to: ${newGame}`);
          })
          .catch((error) => {
            console.error('Error updating stream game:', error);
          });
      })
      .catch((error) => {
        // No need for console.error here, as it's already handled in the streamUpdater module
      });
  } else {
    client.say(target, `@${context.username} You do not have permission to use this command.`);
  }
  }
  
  // Function to check if user is a moderator or broadcaster
  function isModeratorOrBroadcaster(context) {
  return context.mod || context.username.localeCompare(process.env.BROADCASTER_NAME, undefined, { sensitivity: 'base' }) === 0;
  }

  // Iterate over the command list
  for (const [command, data] of Object.entries(commandList)) {
    if (msg.includes(command)) {
      const { cooldown, cooldownDuration } = data;
      if (cooldown && isOnCooldown(context.username, command, cooldowns)) {
        const remainingCooldown = getRemainingCooldown(context.username, command, cooldowns);
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