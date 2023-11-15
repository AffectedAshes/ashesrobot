// roll.js

const { sanitizeInput } = require('../handlers/sanitizer');

// Function called when the "!roll" command is issued
function rollCommand(target, client, context, msg) {
  // Sanitize user input
  const sanitizedMsg = sanitizeInput(msg);

  const num = rollDice();
  const userRoll = sanitizedMsg.toLowerCase().replace(/^!roll\s+/, "");
  client.say(target, `You rolled a ${num}.`);

  if (userRoll === num.toString()) {
    client.say(target, `@${context.username} Congrats, you won Roll!`);
  }
}

// Function called when the "roll" command is issued
function rollDice() {
  const sides = 4096;
  return Math.floor(Math.random() * sides) + 1;
}

module.exports = {
  rollCommand,
};