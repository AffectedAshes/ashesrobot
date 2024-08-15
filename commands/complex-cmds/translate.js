// translate.js

const { Random } = require('random-js');
const random = new Random();

const { translationList } = require('../../data/wordLists');

const translateChannels = {}; // Track game state per channel
const translateCooldowns = {}; // Track cooldowns per channel
const translateCooldownMessages = {}; // Track if cooldown message has been sent per channel

// Timeout duration for the game
const GAME_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

function startTranslateGame(target, client) {
    const randomIndex = random.integer(0, translationList.length - 1);
    const selectedTranslation = translationList[randomIndex];
    translateChannels[target] = {
        currentName: selectedTranslation.name.toLowerCase(),
        currentExplanation: selectedTranslation.explanation,
        timeout: setTimeout(() => endTranslateGame(target, client), GAME_TIMEOUT) // Set timeout
    };
    return translateChannels[target].currentExplanation;
}

function endTranslateGame(target, client) {
    if (isGameActive(target)) {
        const name = translateChannels[target].currentName;
        client.say(target, `Time's up, you were too slow! The correct answer was ${name.charAt(0).toUpperCase() + name.slice(1)}.`);
        resetTranslateGame(target);  // Reset the game after timeout
        setTranslateCooldown(target);  // Set the cooldown after game ends
    }
}

function checkTranslateGuess(target, guess) {
    return guess.toLowerCase() === translateChannels[target].currentName;
}

function resetTranslateGame(target) {
    if (translateChannels[target] && translateChannels[target].timeout) {
        clearTimeout(translateChannels[target].timeout); // Clear the timeout if the game ends
    }
    delete translateChannels[target];
}

function isGameActive(target) {
    return translateChannels[target] !== undefined;
}

function isTranslateCooldownActive(target) {
    return translateCooldowns[target] && translateCooldowns[target] > Date.now();
}

function setTranslateCooldown(target) {
    translateCooldowns[target] = Date.now() + 30 * 1000; // 30 seconds cooldown
    translateCooldownMessages[target] = false;  // Reset cooldown message flag
}

function handleTranslateCommand(target, client, context, msg, alias = '!translate') {
    const args = msg.trim().split(' ').slice(1);

    // Check if the cooldown is active
    if (isTranslateCooldownActive(target)) {
        // Only send the cooldown message if the command used was !translate (not !t)
        if (!translateCooldownMessages[target] && alias === '!translate') {
            client.say(target, `@${context.username} Please wait a moment before starting a new game.`);
            translateCooldownMessages[target] = true;  // Set the flag to true, so the message is not repeated
        }
        return;
    }

    // If no game is currently active and no arguments are provided, start a new game
    if (!isGameActive(target) && args.length === 0 && alias === '!translate') {
        const explanation = startTranslateGame(target, client);
        client.say(target, `Here's your translation: ${explanation}`);
    
    // If a game is currently active and no guess is provided
    } else if (isGameActive(target) && args.length === 0) {
        client.say(target, `@${context.username} The game already started, try !translate + your guess.`);
    
    // If a game is currently active and a guess is provided (for both !translate and !t)
    } else if (isGameActive(target) && args.length > 0) {
        const guess = args.join(' ');
        if (checkTranslateGuess(target, guess)) {
            client.say(target, `@${context.username} Correct! The name was indeed ${translateChannels[target].currentName.charAt(0).toUpperCase() + translateChannels[target].currentName.slice(1)}!`);
            resetTranslateGame(target);  // Reset the game
            setTranslateCooldown(target);  // Set the cooldown after game ends
        } else {
            client.say(target, `@${context.username} Incorrect guess. Try again!`);
        }
    
    // If no game is active and the user tries to guess
    } else {
        client.say(target, `@${context.username} There's no game ongoing. Start a new game with !translate.`);
    }
}

module.exports = { handleTranslateCommand, setTranslateCooldown };