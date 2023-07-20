// trash.js

// Function called when the "🗑️" command is issued
function trashCommand(target, username, client, userMsg, context) {
    client.say(target, `https://wiki.desmume.org/index.php?title=Faq#Pokemon_questions`);
}

module.exports = {
    trashCommand,
};