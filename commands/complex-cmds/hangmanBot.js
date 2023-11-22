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

  const words = [
    "AmoebaUK",
    "ExarionU",
    "werster",
    "Shiru666",
    "Kukker",
    "sizzleskeleton",
    "pokeguy",
    "Gunnermaniac",
    "Swiftalu",
    "scoagogo",
    "MachWing",
    "Kidrocker96",
    "driekiann",
    "eddaket",
    "Wh0misDS",
    "CasualPokePlayer",
    "Enderborn",
    "JPXinnam",
    "kurddt",
    "SLweed",
    "Vandio",
    "3rdJester",
    "SlayerLoL99",
    "5upamayne",
    "crafted",
    "Ananan",
    "caterknees",
    "thewaffleman",
    "WaveWarrior",
    "decsy",
    "ExtraTricky",
    "Dabomstew",
    "Keizaron",
    "gifvex",
    "entrpntr",
    "stringflow",
    "NewAmber",
    "GShark54",
    "israrcool22",
    "Jordan97",
    "luckytyphlosion",
    "MaddiicT",
    "RangerSquid",
    "Sparkle",
    "PoY",
    "winkmarket",
    "AEtienne",
    "thunder147",
    "TiKevin83",
    "randalleatscheese",
    "ringo777",
    "mindofdamon",
    "Quelaagging",
    "Vincento",
    "Sinstar",
    "AffectedAshes",
    "PulseEffects",
    "Juanlyways",
    "Retrotato",
    "linewashere",
    "Headbob",
    "Corvimae",
    "ThomasPatrickWX",
    "Bungied2thetree",
    "GarfieldTheLightning",
    "headstrong1290",
    "Sanjan",
    "Tippi",
    "Etchy",
    "franchewbacca",
    "knoxconary",
    "JTMagicman",
    "SheltieSci",
    "Irondre",
    "cooltrainermichael",
    "truely",
    "PicklePlop",
    "Qpalz98",
    "Araya",
    "Luckless",
    "LoveSickHero",
    "BangYongGuk97",
    "Analpikachu",
    "primalpizza",
    "hwangbro",
    "Yujito",
    "DerTeppich",
    "emray",
    "squaresr",
    "stocchi",
    "TehHammerShow",
    "GoodAtBeingSimple",
    "EconSean",
    "IonlysayVoHiYo",
    "LegendEater",
    "callumbal",
    "AlanSchweitzer",
    "FractNL",
    "OceanBagel",
    "Crrool",
    "Main97",
    "themathgenius",
    "ryziken",
    "zekeke",
    "minnow",
    "TheLimeFilms",
    "Bounxii",
    "Rubentus",
    "SaiyanCinq",
    "TheKRAM",
    "Busterpoke",
    "MoneyHypeMike",
    "halqery",
    "The4thGenGamer",
    "EkmanLarsson",
    "itotaka1031",
    "OhSnap",
    "kerbis54",
    "jyash4",
    "zypotic",
    "EdHeadSR",
    "punyuta",
    "TuckerLeRat",
    "Gimmy",
    "nerdynerd32",
    "Kjoeran",
    "chippytoothy",
    "Nix644",
    "Shenanagans",
    "ABTwisty",
    "TTS4Life",
    "Alw0",
    "keepingiticy",
    "BluMagma",
    "epicdudeguy",
    "Kyutora",
    "billbonzai",
    "Galino",
    "Paraz10",
    "uwsellan",
    "Sylwer328",
    "Matt59620",
    "Slywoo",
    "Cayoche",
    "Wharax",
    "splendidz",
    "Yaksooo",
    "wartab",
    "tahis9",
    "Hypnoshark",
    "Jadiwi",
    "Prabxz",
    "Dakuuu",
    "Jielefe",
    "FlameSR",
    "MystS4",
    "Plotwyx",
    "bahamut3359",
    "HE4TR4N",
    "BeberVorpal",
    "LucasPGLP",
    "Vadnika",
    "Cerpin",
    "prieR57",
    "Noylls"
  ];

  // Create a new Random instance
  const random = new Random();

  const randomWord = words[random.integer(0, words.length - 1)];
  hangmanChannels[target] = {
    game: new HangmanGame(randomWord),
    lastGuessTime: Date.now(),
    cooldown: true,
  };

  client.say(target, `Hangman game started! Use !guess to guess a letter or the full runner's name. Hidden name: ${hangmanChannels[target].game.hiddenWord}`);

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
    client.say(target, `Hangman game was running for too long. Next time try to be faster :). Next round starts in 5 minutes.`);
  } else {
    client.say(target, `Hangman round over! You ${result}. The runner was: ${originalWord}. Next round starts in 5 minutes.`);
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

function handleHangmanCommands(target, client, context, msg) {
  const hangmanChannel = hangmanChannels[target];
  const sanitizedMsg = sanitizeInput(msg); // Sanitize user input

  const hangmanMatch = sanitizedMsg.match(/^!hangman/);
  const guessMatch = sanitizedMsg.match(/^!guess (.+)/);

  if (hangmanMatch) {
    if (hangmanCooldowns[target] && hangmanCooldowns[target] > Date.now()) {
      // Do nothing, let the cooldown message handle this case
    } else if (!hangmanChannel || !hangmanChannel.cooldown) {
      startHangman(target, client);
    } else {
      client.say(target, 'Hangman game is already active. Use !guess to play.');
    }
  } else if (guessMatch) {
    if (!hangmanChannel || !hangmanChannel.game) {
      client.say(target, 'Hangman is currently not active.');
    } else {
      hangmanChannel.lastGuessTime = Date.now(); // Update the last guess time

      const guess = guessMatch[1].toLowerCase();
      const hangmanGame = hangmanChannel.game;

      if (guess === hangmanGame.word) {
        client.say(target, `@${context.username} You guessed the runner! Congratulations, you win!`);
        endHangman(target, client, 'win');
      } else if (guess.length === 1) {
        const success = hangmanGame.guess(guess);
        if (success) {
          client.say(target, `@${context.username} You guessed ${guess}. Hidden name: ${hangmanGame.hiddenWord}`);
          if (hangmanGame.isGameOver()) {
            endHangman(target, client, 'loss');
          } else if (hangmanGame.isGameWon()) {
            client.say(target, `@${context.username} You guessed the runner! Congratulations, you win!`);
            endHangman(target, client, 'win');
          }
        } else {
          client.say(target, `@${context.username} You already guessed ${guess}.`);
        }
      } else {
        client.say(target, `@${context.username} Please guess one letter or the full runner's name.`);
      }
    }
  //} else {
    // Check for inactivity
    //if (hangmanChannel && hangmanChannel.game && !hangmanChannel.cooldown) {
      //const currentTime = Date.now();
      //if (currentTime - hangmanChannel.lastGuessTime >= 5 * 60 * 1000) {
        //endHangman(target, client, 'inactivity');
      //}
    //}
  }
}

module.exports = {
  handleHangmanCommands,
  setHangmanCooldown,
};