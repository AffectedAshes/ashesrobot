// commandList.js

const { playSlots } = require('../complex-cmds/slots');
const { handleHangmanCommands, setHangmanCooldown } = require('../complex-cmds/hangmanBot');
const { metronomeCommand } = require('../complex-cmds/metronome');
const { randmonCommand } = require('../complex-cmds/randmon');
const { randomfactCommand } = require('../complex-cmds/randomfact');
const { rollCommand } = require('../complex-cmds/roll');
const { weatherCommand } = require('../complex-cmds/weather');
const { randrunnerCommand } = require('../complex-cmds/randrunner');
const { defineCommand } = require('../complex-cmds/define');
const { flailCommand } = require('../complex-cmds/flail');
const { commandCommand } = require('../commands');
const { billyslotsCommand } = require('../billyslots');
const { notslotsCommand } = require('../notslots');
const { mudkipCommand } = require('../mudkip');
const { amazina100Command } = require('../amazina100');
const { rngCommand } = require('../rng');
const { blursedCommand } = require('../blursed');
const { gyroballCommand } = require('../gyroball');
const { dragonsdenCommand } = require('../dragonsden');
const { digCommand } = require('../dig');
const { escargotCommand } = require('../escargot');
const { fontCommand } = require('../font');
const { tenseSmashCommand } = require('../tenseSmash');
const { tenseSmash2Command } = require('../tenseSmash2');
const { proteinCommand } = require('../protein');
const { bonkCommand } = require('../bonk');
const { bruhCommand } = require('../bruh');
const { ezCommand } = require('../ez');
const { noDudeCommand } = require('../nodude');
const { yesDudeCommand } = require('../yesdude');
const { trashCommand } = require('../trash');

const commandList = {
  '!slots': {
    cooldown: true, //activate and deactivate cooldown (user specific)
    cooldownDuration: 60, //set cooldown duration for command in seconds
    execute: playSlots,
  },
  '!hangman': {
    cooldown: false, //needs to be false, dont want user specific cooldown for hangman
    execute: handleHangmanCommands,
    postExecute: setHangmanCooldown, //instead use the global cooldown for !hangman
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
  '!billyslots': {
    cooldown: true,
    cooldownDuration: 30,
    execute: billyslotsCommand,
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
    cooldown: true,
    cooldownDuration: 10,
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