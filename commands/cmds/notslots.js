// notslots.js

// Function called when the "!notslots" command is issued
function notslotsCommand(target, client) {
    client.say(target, `ok`);
}

module.exports = {
    notslotsCommand,
};