// commandList.js

const { hasPermission } = require('./permissions');
const { addCommand, editCommand, deleteCommand, getAllCommands } = require('./db');
const { changeStreamTitle, changeStreamGame } = require('./streamCommands');
const { getWorldRecord, getPersonalBest } = require('../complex-cmds/src');
const { playSlots } = require('../complex-cmds/slots');
const { handleTranslateCommand, setTranslateCooldown } = require('../complex-cmds/translate');
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
const { amazina100Command } = require('../cmds/amazina100');
const { rngCommand } = require('../cmds/rng');
const { blursedCommand } = require('../cmds/blursed');
const { tenseSmashCommand } = require('../cmds/tenseSmash');
const { proteinCommand } = require('../cmds/protein');
const { bruhCommand } = require('../cmds/bruh');
const { ezCommand } = require('../cmds/ez');
const { noDudeCommand } = require('../cmds/nodude');
const { yesDudeCommand } = require('../cmds/yesdude');

const commandList = {
  '!addcmd': {
    cooldown: false,
    execute: (target, client, context, msg) => {
      // Check if the user is a moderator or broadcaster
      if (hasPermission(context)) {
        addCommand(target, msg, context.username, (result) => {
          client.say(target, result);
        });
      } else {
        client.say(target, `@${context.username} you don't have permission to use this command.`);
      }
    },
  },
  '!editcmd': {
    cooldown: false,
    execute: (target, client, context, msg) => {
      // Check if the user is a moderator or broadcaster
      if (hasPermission(context)) {
        editCommand(target, msg, context.username, (result) => {
          client.say(target, result);
        });
      } else {
        client.say(target, `@${context.username} you don't have permission to use this command.`);
      }
    },
  },
  '!delcmd': {
    cooldown: false,
    execute: (target, client, context, msg) => {
      // Check if the user is a moderator or broadcaster
      if (hasPermission(context)) {
        deleteCommand(target, msg, context.username, (result) => {
          client.say(target, result);
        });
      } else {
        client.say(target, `@${context.username} you don't have permission to use this command.`);
      }
    },
  },
  '!cmds': {
    cooldown: true,
    cooldownDuration: 30,
    execute: (target, client, context) => {
      // Check if the user is a moderator or broadcaster
      if (hasPermission(context)) {
        getAllCommands(target, (err, commandNames) => {
          const response = commandNames.length
            ? `Those are all commands added to the database for this channel: ${commandNames.join(', ')}`
            : `There are no commands added to the database for this channel.`;
          client.say(target, response);
        });
      } else {
        client.say(target, `@${context.username} you don't have permission to use this command.`);
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
  '!wr': {
    cooldown: false,
    execute: async (target, client, context, msg) => {
        const args = msg.slice('!wr'.length).trim().split(',');
        if (args.length < 2) {
            client.say(target, 'Invalid command format. Please use: !wr <gameName>, <categoryName>, <variableName> - variableName does not have to be provided.');
            return;
        }
        const [gameName, categoryName, variableValue] = args.map(arg => arg.trim());
        const response = await getWorldRecord(gameName, categoryName, variableValue);
        client.say(target, response);
    },
  },
  '!pb': {
    cooldown: false,
    execute: async (target, client, context, msg) => {
      const args = msg.slice('!pb'.length).trim().split(',');
      if (args.length < 3) {
        client.say(target, 'Invalid command format. Please use: !pb <gameName>, <categoryName>, <runnerName>');
        return;
      }
      const [gameName, categoryName, runnerName] = args.map(arg => arg.trim());
      const response = await getPersonalBest(gameName, categoryName, runnerName);
      client.say(target, response);
    },
  },
  '!slots': {
    cooldown: true, //activate and deactivate cooldown (user specific)
    cooldownDuration: 60, //set cooldown duration for command in seconds
    execute: playSlots,
  },
  '!translate': {
    cooldown: true,
    cooldownDuration: 5,
    execute: (target, client, context, msg) => handleTranslateCommand(target, client, context, msg, '!translate'),
    postExecute: setTranslateCooldown, // Set global cooldown for translate
  },
  '!t': {
    cooldown: true,
    cooldownDuration: 5,
    execute: (target, client, context, msg) => handleTranslateCommand(target, client, context, msg, '!t')
  },
  '!hangman': {
    cooldown: false, //needs to be false, dont want user specific cooldown for hangman
    execute: handleHangmanCommands,
    postExecute: setHangmanCooldown, //instead use the global cooldown for !hangman
  },
  '!guess': {
    cooldown: true,
    cooldownDuration: 5,
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
    cooldown: true,
    cooldownDuration: 5,
    execute: flailCommand,
  },
  '!commands': {
    cooldown: true,
    cooldownDuration: 10,
    execute: commandCommand,
  },
  '!billyslots': {
    cooldown: true,
    cooldownDuration: 30,
    execute: billyslotsCommand,
  },
  '!amazina100': {
    cooldown: true,
    cooldownDuration: 10,
    execute: amazina100Command,
  },
  '!rng': {
    cooldown: true,
    cooldownDuration: 10,
    execute: rngCommand,
  },
  '!blursed': {
    cooldown: true,
    cooldownDuration: 10,
    execute: blursedCommand,
  },
  'tenseSmash': {
    cooldown: true,
    cooldownDuration: 10,
    execute: tenseSmashCommand,
  },
  'protein': {
    cooldown: true,
    cooldownDuration: 10,
    execute: proteinCommand,
  },
  'bruh': {
    cooldown: true,
    cooldownDuration: 10,
    execute: bruhCommand,
  },
  'ez': {
    cooldown: true,
    cooldownDuration: 10,
    execute: ezCommand,
  },
  'nd': {
    cooldown: true,
    cooldownDuration: 10,
    execute: noDudeCommand,
  },
  'yd': {
    cooldown: true,
    cooldownDuration: 10,
    execute: yesDudeCommand,
  },
  // Add more commands as needed
};

module.exports = commandList;