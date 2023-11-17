// metronome.js

const { sanitizeInput } = require('../handlers/sanitizer');
const { Random } = require('random-js');

//Pokemon Moves Gen 1
const listOfMoves = [

  {Move: "Absorb"},
  {Move: "Acid"},	
  {Move: "Acid Armor"},	
  {Move: "Agility"},
  {Move: "Amnesia"},	
  {Move: "Aurora Beam"},	
  {Move: "Barrage"},
  {Move: "Barrier"},	
  {Move: "Bide"},
  {Move: "Bind"},
  {Move: "Bite"},
  {Move: "Blizzard"},
  {Move: "Body Slam"},
  {Move: "Bone Club"},
  {Move: "Bonemerang"},	
  {Move: "Bubble"},
  {Move: "Bubble Beam"},
  {Move: "Clamp"},
  {Move: "Comet Punch"},
  {Move: "Confuse Ray"},
  {Move: "Confusion"},	
  {Move: "Constrict"},	
  {Move: "Conversion"},	
  {Move: "Counter"},	
  {Move: "Crabhammer"},
  {Move: "Cut"},	
  {Move: "Defense Curl"},	
  {Move: "Dig"},		
  {Move: "Disable"},	
  {Move: "Dizzy Punch"},	
  {Move: "Double Kick"},	
  {Move: "Double Slap"},
  {Move: "Double Team"},	
  {Move: "Double-Edge"},	
  {Move: "Dragon Rage"},	
  {Move: "Dream Eater"},
  {Move: "Drill Peck"},	
  {Move: "Earthquake"},	
  {Move: "Egg Bomb"},	
  {Move: "Ember"},	
  {Move: "Explosion"},
  {Move: "Fire Blast"},	
  {Move: "Fire Punch"},
  {Move: "Fire Spin"},	
  {Move: "Fissure"},	
  {Move: "Flamethrower"},	
  {Move: "Flash"},		
  {Move: "Fly"},	
  {Move: "Focus Energy"},	
  {Move: "Fury Attack"},	
  {Move: "Fury Swipes"},	
  {Move: "Glare"},	
  {Move: "Growl"},
  {Move: "Growth"},	
  {Move: "Guillotine"},
  {Move: "Gust"},	
  {Move: "Harden"},	
  {Move: "Haze"},	
  {Move: "Headbutt"},	
  {Move: "High Jump Kick"},	
  {Move: "Horn Attack"},	
  {Move: "Horn Drill"},	
  {Move: "Hydro Pump"},	
  {Move: "Hyper Beam"},	
  {Move: "Hyper Fang"},
  {Move: "Hypnosis"},	
  {Move: "Ice Beam"},	
  {Move: "Ice Punch"},	
  {Move: "Jump Kick"},	
  {Move: "Karate Chop"},	
  {Move: "Kinesis"},	
  {Move: "Leech Life"},	
  {Move: "Leech Seed"},
  {Move: "Leer"},	
  {Move: "Lick"},	
  {Move: "Light Screen"},	
  {Move: "Lovely Kiss"},	
  {Move: "Low Kick"},	
  {Move: "Meditate"},	
  {Move: "Mega Drain"},	
  {Move: "Mega Kick"},	
  {Move: "Mega Punch"},	
  {Move: "Mimic"},
  {Move: "Minimize"},	
  {Move: "Mirror Move"},
  {Move: "Mist"},	
  {Move: "Night Shade"},	
  {Move: "Pay Day"},	
  {Move: "Peck"},	
  {Move: "Petal Dance"},	
  {Move: "Pin Missile"},	
  {Move: "Poison Gas"},	
  {Move: "Poison Powder"},	
  {Move: "Poison Sting"},	
  {Move: "Pound"},			
  {Move: "Psybeam"},	
  {Move: "Psychic"},	
  {Move: "Psywave"},	
  {Move: "Quick Attack"},
  {Move: "Rage"},	
  {Move: "Razor Leaf"},	
  {Move: "Razor Wind"},	
  {Move: "Recover"},	
  {Move: "Reflect"},	
  {Move: "Rest"},	
  {Move: "Roar"},	
  {Move: "Rock Slide"},	
  {Move: "Rock Throw"},	
  {Move: "Rolling Kick"},	
  {Move: "Sand Attack"},
  {Move: "Scratch"},	
  {Move: "Screech"},	
  {Move: "Seismic Toss"},	
  {Move: "Self-Destruct"},	
  {Move: "Sharpen"},	
  {Move: "Sing"},	
  {Move: "Skull Bash"},
  {Move: "Sky Attack"},	
  {Move: "Slam"},	
  {Move: "Slash"},	
  {Move: "Sleep Powder"},
  {Move: "Sludge"},
  {Move: "Smog"},	
  {Move: "Smokescreen"},
  {Move: "Soft-Boiled"},	
  {Move: "Solar Beam"},
  {Move: "Sonic Boom"},
  {Move: "Spike Cannon"},	
  {Move: "Splash"},	
  {Move: "Spore"},	
  {Move: "Stomp"},	
  {Move: "Strength"},	
  {Move: "String Shot"},	
  {Move: "Struggle"},
  {Move: "Stun Spore"},
  {Move: "Submission"},	
  {Move: "Substitute"},
  {Move: "Super Fang"},	
  {Move: "Supersonic"},	
  {Move: "Surf"},	
  {Move: "Swift"},	
  {Move: "Swords Dance"},
  {Move: "Tackle"},	
  {Move: "Tail Whip"},	
  {Move: "Take Down"},	
  {Move: "Teleport"},	
  {Move: "Thrash"},	
  {Move: "Thunder"},	
  {Move: "Thunder Punch"},	
  {Move: "Thunder Shock"},	
  {Move: "Thunder Wave"},	
  {Move: "Thunderbolt"},
  {Move: "Toxic"},	
  {Move: "Transform"},	
  {Move: "Tri Attack"},
  {Move: "Twineedle"},	
  {Move: "Vine Whip"},	
  {Move: "Vice Grip"},	
  {Move: "Water Gun"},	
  {Move: "Waterfall"},	
  {Move: "Whirlwind"},	
  {Move: "Wing Attack"},
  {Move: "Withdraw"},
  {Move: "Wrap"}	

  ];

// Create a new Random instance
const random = new Random();

// Function called when the "!metronome" command is issued
function metronomeCommand(target, client, context, msg) {
  const sanitizedMsg = sanitizeInput(msg); // Sanitize user input

  const move = rndmove();
  client.say(target, `The enemy Pokemon used ${move}.`);

  const userMove = sanitizedMsg.toLowerCase().replace(/^!metronome\s+/, "");
  if (userMove === move.toLowerCase()) {
    client.say(target, `@${context.username} Congrats, you won Metronome!`);
  }
}

// Function to generate a random move
function rndmove() {
  const rndNum = random.integer(0, listOfMoves.length - 1);
  const move = listOfMoves[rndNum].Move;
  return move;
}

module.exports = {
  metronomeCommand,
};