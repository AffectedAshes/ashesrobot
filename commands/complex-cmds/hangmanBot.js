// hangmanBot.js

const HangmanGame = require('./hangmanGame');

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
    "shiru666",
    "Kukker",
    "Sizzle",
    "pokeguy",
    "Gunnermaniac",
    "Swiftalu",
    "scoagogo",
    "MachWing",
    "KidRocker96",
    "Driekiann",
    "eddaket",
    "Wh0misDS",
    "CasualpokePlayer",
    "Enderborn",
    "JPXinnam",
    "kurddt",
    "SLweed",
    "Vandio",
    "3rdJester",
    "slayerlol",
    "5upamayne",
    "abysmal",
    "Ananan",
    "caterknees",
    "thewaffleman",
    "wavewarrior",
    "decsy",
    "ExtraTricky",
    "Dabomstew",
    "Keizaron",
    "gifvex",
    "entrpntr",
    "stringflow",
    "NewAmber",
    "GSharkf",
    "Israr",
    "Jordan97",
    "luckytyphlosion",
    "MaddiicT",
    "RangerSquid",
    "SparkleLanturn",
    "_PoY",
    "winkmarket",
    "Aetienne",
    "thunder_147_",
    "TiKevin83",
    "randalleatscheese",
    "ringo777",
    "mindofdamon",
    "quelaagging",
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
    "Bungied2TheTree",
    "GarfieldTheLightning",
    "headstrong",
    "SanJan",
    "Tippi",
    "Etchy",
    "franchewbacca",
    "knoxconary",
    "JTMagicMan",
    "Sheltiesci",
    "irondre_",
    "cooltrainermichael",
    "truely",
    "pickleplop",
    "Qpalz",
    "zenaga",
    "luckless",
    "LoveSickHero",
    "bangYongguk",
    "Analpikachu",
    "PrimalPizza",
    "hwangbro",
    "Yujiito",
    "DerTeppich",
    "emray",
    "SquareRootofSheep",
    "stocchi",
    "TehHammerShow",
    "GoodAtBeingSimple",
    "EconSean",
    "I_only_sayVoHiYo",
    "LegendEater",
    "callumbal",
    "AlanSchweitzer",
    "FractNL",
    "OceanBagel",
    "doctorsprinkles",
    "Main97",
    "themathgenius",
    "ryziken",
    "Rauflegon",
    "minnow",
    "ChubFish",
    "Bounxii",
    "Rubentus",
    "SaiyanCinq",
    "TheKRAM",
    "BusterPoke",
    "MoneyHypeMike",
    "halqery",
    "The4thGenGamer",
    "EkmanLarsson",
    "itotaka",
    "OhSnap",
    "kerbis54",
    "jyash4",
    "akasaka",
    "EdHeadSR",
    "punyuta",
    "TuckerLeRat",
    "GimmyThomas",
    "nerdynerd32",
    "Kjoeran",
    "yourfriendAndy",
    "Nix644",
    "Shenanagans",
    "ABTwisty",
    "TTS4Life",
    "Alw0",
    "keepingiticy"
  ];

  const randomWord = words[Math.floor(Math.random() * words.length)];
  hangmanChannels[target] = {
    game: new HangmanGame(randomWord),
    lastGuessTime: Date.now(),
    cooldown: true,
  };

  client.say(target, `Hangman game started! Use !guess to guess a letter or the full runner's name. Hidden name: ${hangmanChannels[target].game.hiddenWord}`);

  const timeoutId = setTimeout(() => {
    endHangman(target, client, 'inactivity');
  }, 5 * 60 * 1000); // 5 minutes timeout for inactivity

  hangmanChannels[target].timeoutId = timeoutId; // Store the timeout ID for this channel
}

function endHangman(target, client, reason) {
  const hangmanChannel = hangmanChannels[target];
  if (!hangmanChannel?.game) return; // Check if the hangmanChannel and game exist, if not, return

  const hangmanGame = hangmanChannel.game;
  const result = hangmanGame.isGameOver() ? 'lost' : 'won';
  const originalWord = hangmanGame.originalWord;

  if (reason === 'inactivity') {
    client.say(target, `Hangman game ended due to inactivity. Next round starts in 10 minutes.`);
  } else {
    client.say(target, `Hangman round over! You ${result}. The runner was: ${originalWord}. Next round starts in 10 minutes.`);
  }

  clearTimeout(hangmanChannel.timeoutId); // Clear the inactivity timeout for this channel
  hangmanChannel.cooldown = true; // Prevent automatic game start

  hangmanChannels[target].cooldown = true; // Set cooldown after the game ends
  setHangmanCooldown(target, client); // Set the global cooldown for !hangman command

  delete hangmanChannels[target]; // Remove the hangmanChannel entry for this channel
}

function setHangmanCooldown(target, client) {
  // Set a 10-minute cooldown for the !hangman command in this channel
  hangmanCooldowns[target] = Date.now() + 10 * 60 * 1000;

  // Schedule a message to be sent after the cooldown period is over
  setTimeout(() => {
    client.say(target, 'Hangman is available again. Use !hangman to start a new game.');
  }, 10 * 60 * 1000); // 10 minutes
}

function handleHangmanCommands(target, username, client, msg, context) {
  const hangmanChannel = hangmanChannels[target];
  const hangmanMatch = msg.match(/^!hangman/);
  const guessMatch = msg.match(/^!guess (.+)/);

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
          }
        } else {
          client.say(target, `@${context.username} You already guessed ${guess}.`);
        }
      } else {
        client.say(target, `@${context.username} Please guess one letter or the full runner's name.`);
      }
    }
  } else {
    // Check for inactivity
    if (hangmanChannel && hangmanChannel.game && !hangmanChannel.cooldown) {
      const currentTime = Date.now();
      if (currentTime - hangmanChannel.lastGuessTime >= 5 * 60 * 1000) {
        endHangman(target, client, 'inactivity');
      }
    }
  }
}

module.exports = {
  handleHangmanCommands,
  setHangmanCooldown,
};