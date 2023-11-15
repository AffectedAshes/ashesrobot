// nodude.js

// Function called when the "no dude" command is issued
function noDudeCommand(target, client) {
    client.say(target, `I am sorry that you have experienced a so called no dude moment. Next time its gonna be yes dude :)`);
}

module.exports = {
    noDudeCommand,
};