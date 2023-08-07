// commandList.js

const { playSlots } = require('./slots');
const { handleHangmanCommands } = require('./hangmanBot');
const { metronomeCommand } = require('./metronome');
const { randmonCommand } = require('./randmon');
const { randomfactCommand } = require('./randomfact');
const { rollCommand } = require('./roll');
const { billyslotsCommand } = require('./billyslots');
const { weatherCommand } = require('./weather');
const { randrunnerCommand } = require('./randrunner');
const { defineCommand } = require('./define');
const { flailCommand } = require('./flail');
const { commandCommand } = require('./commands');
const { notslotsCommand } = require('./notslots');
const { mudkipCommand } = require('./mudkip');
const { amazina100Command } = require('./amazina100');
const { rngCommand } = require('./rng');
const { blursedCommand } = require('./blursed');
const { gyroballCommand } = require('./gyroball');
const { dragonsdenCommand } = require('./dragonsden');
const { digCommand } = require('./dig');
const { escargotCommand } = require('./escargot');
const { fontCommand } = require('./font');
const { tenseSmashCommand } = require('./tenseSmash');
const { tenseSmash2Command } = require('./tenseSmash2');
const { proteinCommand } = require('./protein');
const { bonkCommand } = require('./bonk');
const { bruhCommand } = require('./bruh');
const { ezCommand } = require('./ez');
const { noDudeCommand } = require('./nodude');
const { yesDudeCommand } = require('./yesdude');
const { trashCommand } = require('./trash');

const commandList = {
  '!slots': {
    cooldown: true, //activate and deactivate cooldown
    cooldownDuration: 60, //set cooldown duration for command in seconds
    execute: playSlots,
  },
  '!hangman': {
    cooldown: true, 
    cooldownDuration: 600, 
    execute: handleHangmanCommands,
  },
  '!guess': {
    cooldown: false, 
    execute: handleHangmanCommands,
  },
  '!metronome': {
    cooldown: true,
    cooldownDuration: 30,
    execute: metronomeCommand,
  },
  '!randmon': {
    cooldown: true,
    cooldownDuration: 30,
    execute: randmonCommand,
  },
  '!randomfact': {
    cooldown: true,
    cooldownDuration: 30,
    execute: randomfactCommand,
  },
  '!roll': {
    cooldown: true,
    cooldownDuration: 30,
    execute: rollCommand,
  },
  '!billyslots': {
    cooldown: true,
    cooldownDuration: 30,
    execute: billyslotsCommand,
  },
  '!weather': {
    cooldown: true,
    cooldownDuration: 30,
    execute: weatherCommand,
  },
  '!randrunner': {
    cooldown: true,
    cooldownDuration: 30,
    execute: randrunnerCommand,
  },
  '!define': {
    cooldown: true,
    cooldownDuration: 30,
    execute: defineCommand,
  },
  '!flail': {
    cooldown: false,
    execute: flailCommand,
  },
  '!commands': {
    cooldown: false,
    execute: commandCommand,
  },
  '!notslots': {
    cooldown: false,
    execute: notslotsCommand,
  },
  '!mudkip': {
    cooldown: false,
    execute: mudkipCommand,
  },
  '!amazina100': {
    cooldown: false,
    execute: amazina100Command,
  },
  '!rng': {
    cooldown: false,
    execute: rngCommand,
  },
  '!blursed': {
    cooldown: false,
    execute: blursedCommand,
  },
  '!gyroball': {
    cooldown: false,
    execute: gyroballCommand,
  },
  '!dragonsden': {
    cooldown: false,
    execute: dragonsdenCommand,
  },
  '!dig': {
    cooldown: false,
    execute: digCommand,
  },
  '!escargot': {
    cooldown: false,
    execute: escargotCommand,
  },
  '!font': {
    cooldown: false,
    execute: fontCommand,
  },
  '!tenseSmash': {
    cooldown: false,
    execute: tenseSmashCommand,
  },
  'tenseSmash': {
    cooldown: false,
    execute: tenseSmash2Command,
  },
  'protein': {
    cooldown: false,
    execute: proteinCommand,
  },
  'affect23Bonk': {
    cooldown: false,
    execute: bonkCommand,
  },
  'bruh': {
    cooldown: false,
    execute: bruhCommand,
  },
  'ez': {
    cooldown: false,
    execute: ezCommand,
  },
  'no dude': {
    cooldown: false,
    execute: noDudeCommand,
  },
  'yes dude': {
    cooldown: false,
    execute: yesDudeCommand,
  },
  '🗑️': {
    cooldown: false,
    execute: trashCommand,
  },
  // Add more commands here
};

module.exports = commandList;