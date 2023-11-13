// dragonsden.js

// Function called when the "!dragonsden" command is issued
function dragonsdenCommand(target, username, client, userMsg, context) {
    client.say(target, `Huh? I didn't quite catch that...`);
}

module.exports = {
    dragonsdenCommand,
};