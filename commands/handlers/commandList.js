// commandList.js

const { addCommand, editCommand, deleteCommand } = require('./db');
const { changeStreamTitle, changeStreamGame } = require('./streamCommands');
const { playSlots } = require('../complex-cmds/slots');
const { handleHangmanCommands, setHangmanCooldown } = require('../complex-cmds/hangmanBot');
const { processChatGPTCommand } = require('../complex-cmds/chatGPTHandler');
const { metronomeCommand } = require('../complex-cmds/metronome');
const { randmonCommand } = require('../complex-cmds/randmon');
const { randomfactCommand } = require('../complex-cmds/randomfact');
const { rollCommand } = require('../complex-cmds/roll');
const { weatherCommand } = require('../complex-cmds/weather');
const { randrunnerCommand } = require('../complex-cmds/randrunner');
const { defineCommand } = require('../complex-cmds/define');
const { flailCommand } = require('../complex-cmds/flail');
const { commandCommand } = require('../cmds/commands');
const { billyslotsCommand } = require('../cmds/billyslots');
const { notslotsCommand } = require('../cmds/notslots');
const { mudkipCommand } = require('../cmds/mudkip');
const { amazina100Command } = require('../cmds/amazina100');
const { rngCommand } = require('../cmds/rng');
const { blursedCommand } = require('../cmds/blursed');
const { gyroballCommand } = require('../cmds/gyroball');
const { dragonsdenCommand } = require('../cmds/dragonsden');
const { digCommand } = require('../cmds/dig');
const { escargotCommand } = require('../cmds/escargot');
const { fontCommand } = require('../cmds/font');
const { trashCommand } = require('../cmds/trash');
const { tenseSmashCommand } = require('../cmds/tenseSmash');
const { tenseSmash2Command } = require('../cmds/tenseSmash2');
const { proteinCommand } = require('../cmds/protein');
const { bonkCommand } = require('../cmds/bonk');
const { bruhCommand } = require('../cmds/bruh');
const { ezCommand } = require('../cmds/ez');
const { noDudeCommand } = require('../cmds/nodude');
const { yesDudeCommand } = require('../cmds/yesdude');

// Function to check if user is in the channel list
function isModeratorOrBroadcaster(context) {
  const channelList = process.env.CHANNEL_LIST.split(",").map(channel => channel.toLowerCase());
  return context.mod || channelList.includes(context.username.toLowerCase());
}

const commandList = {
  '!addcmd': {
    cooldown: false,
    execute: (target, client, context, msg) => {
      // Check if the user is the streamer or a moderator
      if (isModeratorOrBroadcaster(context)) {
        addCommand(target, msg, context.username, (result) => {
          client.say(target, result);
        });
      } else {
        client.say(target, `@${context.username}, you don't have permission to use this command.`);
      }
    },
  },
  '!editcmd': {
    cooldown: false,
    execute: (target, client, context, msg) => {
      // Check if the user is the streamer or a moderator
      if (isModeratorOrBroadcaster(context)) {
        editCommand(target, msg, context.username, (result) => {
          client.say(target, result);
        });
      } else {
        client.say(target, `@${context.username}, you don't have permission to use this command.`);
      }
    },
  },
  '!delcmd': {
    cooldown: false,
    execute: (target, client, context, msg) => {
      // Check if the user is the streamer or a moderator
      if (isModeratorOrBroadcaster(context)) {
        deleteCommand(target, msg, context.username, (result) => {
          client.say(target, result);
        });
      } else {
        client.say(target, `@${context.username}, you don't have permission to use this command.`);
      }
    },
  },
  '!changetitle': {
    cooldown: false,
    execute: changeStreamTitle,
  },
  '!changegame': {
    cooldown: false,
    execute: changeStreamGame,
  },
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
  '!chatgpt': {
    cooldown: true,
    cooldownDuration: 300,
    execute: processChatGPTCommand,
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
  '!trash': {
    cooldown: false,
    execute: trashCommand,
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
  // Add more commands as needed
};

module.exports = commandList;