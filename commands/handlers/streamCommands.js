// streamCommands.js

const { updateStreamTitle, updateStreamGame, getGameIdFromTwitchApi } = require('./streamUpdater');

const { sanitizeInput } = require('./sanitizer');

const { hasPermission } = require('./permissions');

function changeStreamTitle(target, client, context, msg) {
  try {
    // Sanitize user input
    const sanitizedMsg = sanitizeInput(msg);

    const CHANNEL_NAME1 = process.env.CHANNEL_NAME1;
    const newTitle = sanitizedMsg.replace(/^!changetitle\s+/, '');

    if (target === `#${CHANNEL_NAME1}`) {
      if (hasPermission(context)) {
        updateStreamTitle(process.env.BROADCASTER_ID, newTitle) // Use numeric broadcaster ID
          .then(() => {
            client.say(target, `@${context.username} Stream title updated to: ${newTitle}`);
          })
          .catch((error) => {
            console.error('Error updating stream title:', error);
          });
      } else {
        client.say(target, `@${context.username} you don't have permission to use this command.`);
      }
    }
  } catch (error) {
    console.error('Error processing changeStreamTitle:', error.message);
    client.say(target, `@${context.username} An error occurred while processing the changeStreamTitle command.`);
  }
}

function changeStreamGame(target, client, context, msg) {
  try {
    // Sanitize user input
    const sanitizedMsg = sanitizeInput(msg);

    const CHANNEL_NAME1 = process.env.CHANNEL_NAME1;
    const newGame = sanitizedMsg.replace(/^!changegame\s+/, '');

    if (target === `#${CHANNEL_NAME1}`) {
      if (hasPermission(context)) {
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
        client.say(target, `@${context.username} you don't have permission to use this command.`);
      }
    }
  } catch (error) {
    console.error('Error processing changeStreamGame:', error.message);
    client.say(target, `@${context.username} An error occurred while processing the changeStreamGame command.`);
  }
}

module.exports = {
  changeStreamTitle,
  changeStreamGame,
};