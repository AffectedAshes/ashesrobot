// weather.js

const axios = require('axios');

// Function called when the "!weather" command is issued
async function weatherCommand(target, username, client, userMsg, context) {
  const city = userMsg.replace('!weather ', '');

  try {
    const apiKey = process.env.API_KEY; // Replace with your actual API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    const response = await axios.get(apiUrl);

    if (response.status === 200) {
      const { name, weather, main, wind } = response.data;
      const { description } = weather[0];
      const { temp, humidity } = main;
      const { speed, deg } = wind;

      const windDirection = getWindDirection(deg);
      const message = `Weather in ${name}: ${description}. Temperature: ${temp}°C. Humidity: ${humidity}%. Wind: ${speed} m/s, ${windDirection}`;
      client.say(target, `@${username} ${message}`);
    } else {
      client.say(target, `@${username} Failed to fetch weather data. Please try again later.`);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    client.say(target, `@${username} An error occurred while fetching weather data. Please try again later.`);
  }
}

// Helper function to determine wind direction
function getWindDirection(deg) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((deg % 360) / 45);
  return directions[index];
}

module.exports = {
  weatherCommand,
};