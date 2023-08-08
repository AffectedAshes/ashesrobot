// slots.js

// Function called when the "slots" command is issued
function playSlots(target, username, client) {
    const emotes = [
      'Kappa',
      'affect23Pray',
      'affect23Love',
      'affect23Hi',
      '4Head',
      'cmonBruh',
      'affect23Rage',
      'rubent15Bruh',
      'NotLikeThis',
      'rubent15EZ',
      'rubent15JAM',
      'Jebaited',
      'BibleThump',
      'MrDestructoid',
      'rubent15Evil',
      'FailFish',
      'HeyGuys',
      'rubent15Think',
      'Kreygasm',
      'VoHiYo',
      'DansGame',
      'BabyRage',
      'ResidentSleeper',
      'SeemsGood',
      'WutFace',
      'Keepo',
      'KappaPride',
      'KappaRoss',
      'KappaClaus',
      'KappaWealth',
      'rubent15YO',
      'SourPls',
      'FrankerZ',
      'KevinTurtle',
      'affect23Jam'
    ];
  
    const pickedEmotes = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * emotes.length);
      const randomEmote = emotes[randomIndex];
      pickedEmotes.push(randomEmote);
    }
  
    const emoteString = pickedEmotes.join(' | ');
    client.say(target, `@${username} -> ${emoteString}`);
  
    if (pickedEmotes.every((emote) => emote === pickedEmotes[0])) {
      client.say(target, `@${username} Congrats, you won Slots!`);
    }
  }

  module.exports = {
    playSlots
  };