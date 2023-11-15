// commands.js

// Function called when the "!commands" command is issued
function commandCommand(target, client) {
    client.say(target, `https://github.com/AffectedAshes/ashesrobot`);
}

module.exports = {
    commandCommand,
};