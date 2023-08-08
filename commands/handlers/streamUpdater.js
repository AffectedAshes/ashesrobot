// streamUpdater.js

const axios = require('axios');

const twitchApi = axios.create({
  baseURL: 'https://api.twitch.tv/helix',
  headers: {
    'Client-ID': process.env.CLIENT_ID,
    'Authorization': `Bearer ${process.env.OAUTH_TOKEN1}`,
  },
});

async function updateStreamTitle(broadcasterId, newTitle) {
  const response = await twitchApi.patch(`/channels?broadcaster_id=${broadcasterId}`, {
    title: newTitle,
  });

  return response.data;
}

async function updateStreamGame(broadcasterId, newGameId) {
  const response = await twitchApi.patch(`/channels?broadcaster_id=${broadcasterId}`, {
    game_id: newGameId,
  });

  return response.data;
}

async function getGameIdFromTwitchApi(gameName) {
  try {
    const response = await twitchApi.get('/games', {
      params: {
        name: gameName,
      },
    });

    if (response.data.data.length > 0) {
      return response.data.data[0].id;
    } else {
      throw new Error(`Game not found: ${gameName}`);
    }
  } catch (error) {
    console.error('Error getting game ID:', error);
    throw error;
  }
}

module.exports = {
  updateStreamTitle,
  updateStreamGame,
  getGameIdFromTwitchApi,
};