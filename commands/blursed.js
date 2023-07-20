// blursed.js

// Function called when the "!blursed" command is issued
function blursedCommand(target, username, client, userMsg, context) {
    client.say(target, `The highest of highs, and the lowest of lows. Sometimes it takes a rollercoaster this intense, to stay on the ride until the very end.`);
}

module.exports = {
    blursedCommand,
};