// define.js

const axios = require('axios');

// Function called when the "!define" command is issued
async function defineCommand(target, username, client, userMsg) {
  const word = userMsg.toLowerCase().replace(/^!define\s+/, '');

  try {
    const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(word)}`);
    const data = response.data;

    if (data.list && data.list.length > 0) {
      const definition = data.list[0].definition;
      client.say(target, `@${username} Definition of "${word}": ${definition}`);
    } else {
      client.say(target, `@${username} No definition found for "${word}".`);
    }
  } catch (error) {
    console.error('Error fetching definition:', error);
    client.say(target, `@${username} An error occurred while fetching the definition.`);
  }
}

module.exports = {
  defineCommand,
};