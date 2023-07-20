// bonk.js

// Function called when the "affect23Bonk" command is issued
function bonkCommand(target, username, client, userMsg, context) {
    client.say(target, `affect23Bonk`);
}

module.exports = {
    bonkCommand,
};