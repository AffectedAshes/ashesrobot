// trash.js

// Function called when the "!trash" command is issued
function trashCommand(target, client) {
    client.say(target, `https://wiki.desmume.org/index.php?title=Faq#Pokemon_questions`);
}

module.exports = {
    trashCommand,
};