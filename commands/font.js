// font.js

// Function called when the "!font" command is issued
function fontCommand(target, username, client, userMsg, context) {
    client.say(target, `https://cdn.discordapp.com/attachments/967403356240892004/1025722380213047296/Actual_Gen_4_Font.ttf`);
}

module.exports = {
    fontCommand,
};