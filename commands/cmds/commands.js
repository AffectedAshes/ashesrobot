// commands.js

// Function called when the "!commands" command is issued
function commandCommand(target, username, client, userMsg, context) {
    client.say(target, `https://github.com/AffectedAshes/ashesrobot`);
}

module.exports = {
    commandCommand,
};