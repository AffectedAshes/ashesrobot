// flail.js

// Function called when the "!flail" command is issued
function flailCommand(target, username, client, msg) {
  const match = msg.match(/^!flail (\d+)/);
  if (match) {
    const maxHP = parseInt(match[1], 10);
    if (!isNaN(maxHP)) {
      if (maxHP === 0) {
        client.say(target, `@${username} Congrats, you are dead :)`);
      } else if (maxHP === 1 || maxHP === 2) {
        client.say(target, `@${username} Your max HP is too low for any flail.`);
      } else {
        let response = '';
        const currentHP = {
          flail80: Math.ceil(maxHP * 0.34375),
          flail100: Math.ceil(maxHP * 0.203125),
          flail150: Math.ceil(maxHP * 0.09375),
          flail200: Math.ceil(maxHP * 0.03125),
        };

        response += currentHP.flail80 <= 1 ? 'Max HP not high enough for 80 BP | ' : `HP < ${currentHP.flail80}\n for 80 BP | `;
        response += currentHP.flail100 <= 1 ? 'Max HP not high enough for 100 BP | ' : `HP < ${currentHP.flail100}\n for 100 BP | `;
        response += currentHP.flail150 <= 1 ? 'Max HP not high enough for 150 BP | ' : `HP < ${currentHP.flail150}\n for 150 BP | `;
        response += currentHP.flail200 <= 1 ? 'Max HP not high enough for 200 BP | ' : `HP < ${currentHP.flail200}\n for 200 BP`;

        client.say(target, response);
      }
    } else {
      client.say(target, `@${username} Invalid command usage. Please use the format !flail <max HP>.`);
    }
  } else {
    client.say(target, `@${username} Invalid command usage. Please use the format !flail <max HP>.`);
  }
}

// Export the function for the "!flail" command
module.exports = {
  flailCommand,
};