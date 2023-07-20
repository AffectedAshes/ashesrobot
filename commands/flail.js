// flail.js

// Function called when the "!flail" command is issued
function flailCommand(target, username, client, msg) {
    const match = msg.match(/^!flail (\d+)/);
    if (match) {
      const maxHP = parseInt(match[1], 10);
      if (!isNaN(maxHP)) {
        let response = '';
        const currentHP = {
          flail80: Math.ceil(maxHP * 0.34375),
          flail100: Math.ceil(maxHP * 0.203125),
          flail150: Math.ceil(maxHP * 0.09375),
          flail200: Math.ceil(maxHP * 0.03125),
        };
  
        response += `HP < ${currentHP.flail80}\n for 80 BP | `;
        response += `HP < ${currentHP.flail100}\n for 100 BP | `;
        response += `HP < ${currentHP.flail150}\n for 150 BP | `;
        response += `HP < ${currentHP.flail200}\n for 200 BP` ;
  
        client.say(target, response);
      } 
    } else {
      client.say(target, `@${username} Invalid command usage. Please use the format !flail <max HP>.`);
    }
  }
  
// Export the function for the "!flail" command
module.exports = {
    flailCommand,
};