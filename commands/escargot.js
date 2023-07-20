// escargot.js

// Function called when the "!escargot" command is issued
function escargotCommand(target, username, client, userMsg, context) {
    client.say(target, `https://i.imgur.com/odmQuZc.jpeg`);
}

module.exports = {
    escargotCommand,
};