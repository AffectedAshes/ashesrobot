// hangmanBot.js

const HangmanGame = require('./hangmanGame');

let hangmanGame = null;
let hangmanCooldown = false;

function startHangman(target, client) {
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
  hangmanGame = new HangmanGame(randomWord);

  client.say(target, `Hangman game started! Use !guess to guess a letter or the full runners name. Hidden name: ${hangmanGame.hiddenWord}`);
}

function endHangman(target, client) {
  const result = hangmanGame.isGameOver() ? 'lost' : 'won';
  const originalWord = hangmanGame.originalWord; // Get the original word from the list
  client.say(target, `Game over! You ${result}. The runner was: ${originalWord}. You can try again in 10min.`);
  hangmanGame = null;
}

function handleHangmanCommands(target, username, client, msg, context) {
  const hangmanMatch = msg.match(/^!hangman/);
  const guessMatch = msg.match(/^!guess (.+)/);

  if (hangmanMatch) {
    if (!hangmanCooldown) {
      startHangman(target, client);
      hangmanCooldown = true;
      setTimeout(() => {
        hangmanCooldown = false;
        client.say(target, 'Hangman is available again! Use !hangman to start a new game.');
      }, 10 * 60 * 1000); // 10 minutes cooldown
    }
  } else if (guessMatch) {
    if (!hangmanGame) {
      client.say(target, 'Hangman is currently not active.');
    } else {
      const guess = guessMatch[1].toLowerCase();
      if (guess === hangmanGame.word) {
        client.say(target, `@${context.username} You guessed the runner! Congratulations, you win!`);
        endHangman(target, client);
      } else if (guess.length === 1) {
        const success = hangmanGame.guess(guess);
        if (success) {
          client.say(target, `@${context.username} You guessed ${guess}. Hidden name: ${hangmanGame.hiddenWord}`);
          if (hangmanGame.isGameOver()) {
            endHangman(target, client);
          }
        } else {
          client.say(target, `@${context.username} You already guessed ${guess}.`);
        }
      } else {
        client.say(target, `@${context.username} Please guess one letter or the full runners name.`);
      }
    }
  }
}

module.exports = {
  handleHangmanCommands,
};