require('dotenv').config();

const tmi = require('tmi.js');

const commandList = require('./commands/commandList');
const { isOnCooldown, getRemainingCooldown, setCooldown } = require('./commands/cooldown');      
const { updateStreamTitle, updateStreamGame, getGameIdFromTwitchApi } = require('./commands/streamUpdater');

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

  // Command to change stream title
  if (msg.match(/^!changetitle\s+/)) {
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
  if (msg.match(/^!changegame\s+/)) {
  const newGame = msg.replace(/^!changegame\s+/, '');
  if (isModeratorOrBroadcaster(context)) {
    // Lookup game ID from Twitch API (you'll need to implement this part)
    getGameIdFromTwitchApi(newGame)
      .then((newGameId) => {
        updateStreamGame(process.env.BROADCASTER_ID, newGameId) // Use numeric broadcaster ID
          .then(() => {
            client.say(target, `@${context.username} Stream game updated to: ${newGame}`);
          })
          .catch((error) => {
            console.error('Error updating stream game:', error);
          });
      })
      .catch((error) => {
        console.error('Error getting game ID:', error);
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