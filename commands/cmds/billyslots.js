// billyslots.js

// Function called when the "!billyslots" command is issued
function billyslotsCommand(target, client, context) {
    client.say(target, `@${context.username} -> rubent15EZ | rubent15EZ | rubent15EZ`);
  
    setTimeout(() => {
      client.say(target, `Congrats, you won Billyslots, the best kind of Slots!`);
    }, 2000); // Delay of 2000 milliseconds (2 seconds)
  }
  
  module.exports = {
    billyslotsCommand,
  };