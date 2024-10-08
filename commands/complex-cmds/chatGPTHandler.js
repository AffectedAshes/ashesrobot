// chatGPTHandler.js

const axios = require('axios');

const { sanitizeInput } = require('../handlers/sanitizer');

// Rate limits for free trial users
const RPM_LIMIT = 20;
const TPM_LIMIT = 40000;

// Use a queue to manage requests
const requestQueue = [];

// ChatGPT handler with input sanitization
async function processChatGPTCommand(target, client, context, msg) {
  try {
    // Sanitize user input
    const sanitizedMsg = sanitizeInput(msg);

    const userPrompt = sanitizedMsg.replace(/^!chatgpt\s+/, '');
    const chatGPTResponse = await chatGPTHandler(userPrompt);
    client.say(target, `@${context.username} ChatGPT says: ${chatGPTResponse}`);
  } catch (error) {
    console.error('Error processing ChatGPT command:', error.message);
    client.say(target, `@${context.username} An error occurred while processing the ChatGPT command.`);
  }
}

async function chatGPTHandler(prompt, retryCount = 0) {
  try {
    // Retrieve API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;

    // Check if there are ongoing requests in the queue
    if (requestQueue.length > 0) {
      const currentTime = Date.now();
      const recentRequests = requestQueue.filter(time => currentTime - time < 60000); // Check requests in the last minute

      // Check RPM limit
      if (recentRequests.length >= RPM_LIMIT) {
        console.log(`Rate limit reached. Waiting for the next minute...`);
        const timeUntilNextMinute = 60000 - (currentTime % 60000);
        await new Promise(resolve => setTimeout(resolve, timeUntilNextMinute));
      }

      // Check TPM limit
      const tokensUsedInLastMinute = recentRequests.reduce((acc, time) => acc + (currentTime - time), 0);
      if (tokensUsedInLastMinute >= TPM_LIMIT) {
        console.log(`Token limit reached. Waiting for the next minute...`);
        const timeUntilNextMinute = 60000 - (currentTime % 60000);
        await new Promise(resolve => setTimeout(resolve, timeUntilNextMinute));
      }
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant. Keep your answers as short and precise as possible. Please try to not go over the maximum of 800 characters per response.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 350, // Adjust the max_tokens value as needed
        temperature: 1, // Adjust the temperature value as needed
        // stop: '', // Uncomment and set a stop sequence if needed
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const chatGPTResponse = response.data.choices[0]?.message?.content || 'ChatGPT did not provide a response.';

    // Update the request queue with the current time
    requestQueue.push(Date.now());

    return chatGPTResponse;
  } catch (error) {
    console.error('Error interacting with ChatGPT:', error.message);

    // Retry logic for 429 (Rate Limit Exceeded) error
    if (error.response && error.response.status === 429 && retryCount < 3) {
      const delaySeconds = Math.pow(2, retryCount) * 1000; // Exponential backoff, starting with 1 second
      console.log(`Retrying in ${delaySeconds / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delaySeconds));
      return chatGPTHandler(prompt, retryCount + 1); // Retry with incremented retryCount
    }

    throw error; // Rethrow the error if it's not a 429 or if retries are exhausted
  }
}

module.exports = { processChatGPTCommand };