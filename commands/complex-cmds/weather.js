const axios = require('axios');

// Function called when the "!weather" command is issued
async function weatherCommand(target, username, client, msg) {
  // Extract the city from the message
  const cityMatch = msg.match(/^!weather\s+(.+)/);

  // Check if a valid city is provided
  if (cityMatch) {
    const city = cityMatch[1];

    try {
      // Ensure proper encoding of the city name
      const encodedCity = encodeURIComponent(city);

      // Clean up the encoded city by removing specific unwanted characters
      const cleanedEncodedCity = encodedCity.replace(/%20%F3%A0%80%80/g, '');

      const apiKey = process.env.API_KEY; // Replace with your actual API key
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cleanedEncodedCity}&appid=${apiKey}&units=metric`;

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
  } else {
    client.say(target, `@${username} Invalid usage. Please provide a valid city name after !weather.`);
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