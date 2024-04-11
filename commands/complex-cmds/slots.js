// slots.js

const { Random } = require('random-js');

// Function called when the "slots" command is issued
function playSlots(target, client, context) {
  const emotes = [
      'Kappa',
      'affect23Pray',
      'affect23Love',
      'affect23Hi',
      '4Head',
      'cmonBruh',
      'affect23Rage',
      'ImTyping',
      'NotLikeThis',
      'WhySoSerious',
      'Poooound',
      'Jebaited',
      'BibleThump',
      'MrDestructoid',
      'PJSalt',
      'GivePLZ',
      'HeyGuys',
      'SwiftRage',
      'Kreygasm',
      'VoHiYo',
      'TTours',
      'DarkKnight',
      'ResidentSleeper',
      'SeemsGood',
      'WutFace',
      'TheIlluminati',
      'KappaPride',
      'GlitchCat',
      'KappaClaus',
      'PopNemo',
      'RalpherZ',
      'SourPls',
      'DinoDance',
      'KevinTurtle',
      'affect23Jam'
  ];
  
  // Create a new Random instance
  const random = new Random();
  
  const pickedEmotes = [];

  for (let i = 0; i < 3; i++) {
    const randomIndex = random.integer(0, emotes.length - 1);
    const randomEmote = emotes[randomIndex];
    pickedEmotes.push(randomEmote);
  }

  const emoteString = pickedEmotes.join(' | ');
  client.say(target, `@${context.username} -> ${emoteString}`);

  if (pickedEmotes.every((emote) => emote === pickedEmotes[0])) {
    client.say(target, `@${context.username} Congrats, you won Slots!`);
  }
}

module.exports = {
  playSlots,
};