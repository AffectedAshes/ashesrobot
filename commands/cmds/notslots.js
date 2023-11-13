// notslots.js

// Function called when the "!notslots" command is issued
function notslotsCommand(target, username, client, userMsg, context) {
    client.say(target, `ok`);
}

module.exports = {
    notslotsCommand,
};