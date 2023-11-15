// define.js

const axios = require('axios');

const { sanitizeInput } = require('../handlers/sanitizer');

// Define command with input sanitization
async function defineCommand(target, client, context, msg) {
  try {
    // Sanitize user input
    const sanitizedMsg = sanitizeInput(msg);

    const word = sanitizedMsg.toLowerCase().replace(/^!define\s+/, '');

    const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(word)}`);
    const data = response.data;

    if (data.list && data.list.length > 0) {
      const definition = data.list[0].definition;
      client.say(target, `@${context.username} Definition of "${word}": ${definition}`);
    } else {
      client.say(target, `@${context.username} No definition found for "${word}".`);
    }
  } catch (error) {
    console.error('Error fetching definition:', error);
    client.say(target, `@${context.username} An error occurred while fetching the definition.`);
  }
}

module.exports = {
  defineCommand,
};