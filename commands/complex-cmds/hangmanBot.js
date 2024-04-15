// hangmanBot.js

const HangmanGame = require('./hangmanGame');

const { sanitizeInput } = require('../handlers/sanitizer');
const { Random } = require('random-js');

const hangmanChannels = {};
const hangmanCooldowns = {}; // Store cooldown timestamps for !hangman command

function startHangman(target, client) {
  if (hangmanChannels[target]?.cooldown) {
    return;
  }

  const { runners, items } = require('../../data/wordLists');

  // Define word lists and corresponding responses
  const wordLists = [
    {
      words: runners,
      response: "Hangman game started with Pokémon Speedrunners! Use !guess to guess a letter/number or the full runner's name."
    },
    {
      words: items,
      response: "Hangman game started with Pokémon Items! Use !guess to guess a letter/symbol or the full item's name."
    }
  ];

  // Create a new Random instance
  const random = new Random();

  // Choose a random list index
  const randomListIndex = random.integer(0, wordLists.length - 1);

  // Choose the selected list of words and corresponding response
  const { words, response } = wordLists[randomListIndex];

  // Choose a random word from the selected list
  const randomWord = words[random.integer(0, words.length - 1)];

  hangmanChannels[target] = {
    game: new HangmanGame(randomWord),
    lastGuessTime: Date.now(),
    cooldown: true,
  };

  // Append hidden word to response
  const finalResponse = `${response} Hidden word: ${hangmanChannels[target].game.hiddenWord}`;

  client.say(target, finalResponse);

  const timeoutId = setTimeout(() => {
    endHangman(target, client, 'inactivity');
  }, 15 * 60 * 1000); // 15 minutes timeout for inactivity

  hangmanChannels[target].timeoutId = timeoutId; // Store the timeout ID for this channel
}

function endHangman(target, client, reason) {
  const hangmanChannel = hangmanChannels[target];
  if (!hangmanChannel?.game) return; // Check if the hangmanChannel and game exist, if not, return

  const hangmanGame = hangmanChannel.game;
  const result = hangmanGame.isGameOver() ? 'lost' : 'won';
  const originalWord = hangmanGame.originalWord;

  if (reason === 'inactivity') {
    client.say(target, `Hangman game was running for too long. Next time try to be faster :). The word was: ${originalWord}. Next round starts in 5 minutes.`);
  } else {
    client.say(target, `Hangman round over! You ${result}. The word was: ${originalWord}. Next round starts in 5 minutes.`);
  }

  clearTimeout(hangmanChannel.timeoutId); // Clear the inactivity timeout for this channel
  hangmanChannel.cooldown = true; // Prevent automatic game start

  hangmanChannels[target].cooldown = true; // Set cooldown after the game ends
  setHangmanCooldown(target, client); // Set the global cooldown for !hangman command

  delete hangmanChannels[target]; // Remove the hangmanChannel entry for this channel
}

function setHangmanCooldown(target, client) {
  // Set a 5-minute cooldown for the !hangman command in this channel
  hangmanCooldowns[target] = Date.now() + 5 * 60 * 1000;

  // Schedule a message to be sent after the cooldown period is over
  setTimeout(() => {
    client.say(target, 'Hangman is available again. Use !hangman to start a new game.');
  }, 5 * 60 * 1000); // 5 minutes
}

// Initialize cooldown timestamp for hangman already active response
let lastHangmanActiveResponseTime = 0;

// Initialize cooldown timestamp for hangman not active response
let lastHangmanResponseTime = 0;

function handleHangmanCommands(target, client, context, msg) {
  const hangmanChannel = hangmanChannels[target];
  const sanitizedMsg = sanitizeInput(msg); // Sanitize user input

  const hangmanMatch = sanitizedMsg.toLowerCase().match(/^!hangman/);
  const guessMatch = sanitizedMsg.toLowerCase().match(/^!guess (.+)/);

  if (hangmanMatch) {
    if (hangmanCooldowns[target] && hangmanCooldowns[target] > Date.now()) {
      // Do nothing, let the cooldown message handle this case
    } else if (!hangmanChannel || !hangmanChannel.cooldown) {
      startHangman(target, client);
    } else {
      const now = Date.now();
      const cooldown = 60000; // 1 minute cooldown

      if (now - lastHangmanActiveResponseTime >= cooldown) {
        client.say(target, 'Hangman game is already active. Use !guess to play.');
        lastHangmanActiveResponseTime = now;
      }
    }
  } else if (guessMatch) {
    if (!hangmanChannel || !hangmanChannel.game) {
      const now = Date.now();
      const cooldown = 60000; // 1 minute cooldown

      if (now - lastHangmanResponseTime >= cooldown) {
        client.say(target, 'Hangman is currently not active.');
        lastHangmanResponseTime = now;
      }
    } else {
      hangmanChannel.lastGuessTime = Date.now(); // Update the last guess time

      const guess = guessMatch[1].toLowerCase();
      const hangmanGame = hangmanChannel.game;

      if (guess === hangmanGame.word) {
        client.say(target, `@${context.username} You guessed the word! Congratulations, you win!`);
        endHangman(target, client, 'win');
      } else if (guess.length === 1) {
        const success = hangmanGame.guess(guess);
        if (success) {
          client.say(target, `@${context.username} You guessed ${guess} . Hidden name: ${hangmanGame.hiddenWord}`);
          if (hangmanGame.isGameOver()) {
            endHangman(target, client, 'loss');
          } else if (hangmanGame.isGameWon()) {
            client.say(target, `@${context.username} You guessed the word! Congratulations, you win!`);
            endHangman(target, client, 'win');
          }
        } else {
          client.say(target, `@${context.username} You already guessed ${guess} .`);
        }
      } else {
        client.say(target, `@${context.username} Please guess one letter or the correct word.`);
      }
    }
  }
}

module.exports = {
  handleHangmanCommands,
  setHangmanCooldown,
};