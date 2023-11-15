// bonk.js

// Function called when the "affect23Bonk" command is issued
function bonkCommand(target, client) {
    client.say(target, `affect23Bonk`);
}

module.exports = {
    bonkCommand,
};