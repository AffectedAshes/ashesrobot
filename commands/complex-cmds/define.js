// define.js

const axios = require('axios');
const { Random } = require('random-js');
const { sanitizeInput } = require('../handlers/sanitizer');

// Create a new Random instance
const random = new Random();

// Define command with input sanitization
async function defineCommand(target, client, context, msg) {
  try {
    // Sanitize user input
    const sanitizedMsg = sanitizeInput(msg);

    const word = sanitizedMsg.toLowerCase().replace(/^!define\s+/, '');

    const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(word)}`);
    const data = response.data;

    if (data.list && data.list.length > 0) {
      const shortEnoughDefinitions = data.list.filter(definitionData => definitionData.definition.length <= 500);

      if (shortEnoughDefinitions.length > 0) {
        const chosenDefinition = rndDefinition(shortEnoughDefinitions);
        client.say(target, `@${context.username} Definition of "${word}": ${chosenDefinition}`);
      } else {
        client.say(target, `@${context.username} No short enough definition found for "${word}".`);
      }
    } else {
      client.say(target, `@${context.username} No definition found for "${word}".`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Axios HTTP error: ${error.message}`);
    } else {
      console.error('Error fetching definition:', error.message);
    }
    client.say(target, `@${context.username} An error occurred while fetching the definition.`);
  }
}

// Function to generate a random definition
function rndDefinition(definitions) {
  const rndNum = random.integer(0, definitions.length - 1);
  return definitions[rndNum].definition;
}

module.exports = {
  defineCommand,
};