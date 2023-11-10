// chatGPTHandler.js

const axios = require('axios');

// Rate limits for free trial users
const FREE_TRIAL_RPM_LIMIT = 20;
const FREE_TRIAL_TPM_LIMIT = 40000;

// Use a queue to manage requests
const requestQueue = [];

async function processChatGPTCommand(target, username, client, msg, context) {
  try {
    const userPrompt = msg.replace(/^!chatgpt\s+/, '');
    const chatGPTResponse = await chatGPTHandler(userPrompt);
    client.say(target, `@${username} ChatGPT says: ${chatGPTResponse}`);
  } catch (error) {
    console.error('Error processing ChatGPT command:', error.message);
    client.say(target, `@${username} An error occurred while processing the ChatGPT command.`);
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
      if (recentRequests.length >= FREE_TRIAL_RPM_LIMIT) {
        console.log(`Rate limit reached. Waiting for the next minute...`);
        const timeUntilNextMinute = 60000 - (currentTime % 60000);
        await new Promise(resolve => setTimeout(resolve, timeUntilNextMinute));
      }

      // Check TPM limit
      const tokensUsedInLastMinute = recentRequests.reduce((acc, time) => acc + (currentTime - time), 0);
      if (tokensUsedInLastMinute >= FREE_TRIAL_TPM_LIMIT) {
        console.log(`Token limit reached. Waiting for the next minute...`);
        const timeUntilNextMinute = 60000 - (currentTime % 60000);
        await new Promise(resolve => setTimeout(resolve, timeUntilNextMinute));
      }
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 250, // Adjust the max_tokens value as needed
        temperature: 0.7, // Adjust the temperature value as needed
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