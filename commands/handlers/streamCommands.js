// streamCommands.js

const { updateStreamTitle, updateStreamGame, getGameIdFromTwitchApi } = require('../handlers/streamUpdater');

function changeStreamTitle(target, username, client, msg, context) {
  const CHANNEL_NAME1 = process.env.CHANNEL_NAME1;
  const newTitle = msg.replace(/^!changetitle\s+/, '');

  if (target === `#${CHANNEL_NAME1}` && isModeratorOrBroadcaster(context)) {
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

function changeStreamGame(target, username, client, msg, context) {
  const CHANNEL_NAME1 = process.env.CHANNEL_NAME1;
  const newGame = msg.replace(/^!changegame\s+/, '');

  if (target === `#${CHANNEL_NAME1}` && isModeratorOrBroadcaster(context)) {
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

module.exports = {
  changeStreamTitle,
  changeStreamGame,
};