// dig.js

// Function called when the "!dig" command is issued
function digCommand(target, client) {
    client.say(target, `https://www.youtube.com/watch?v=HDN9_NR3mTU`);
}

module.exports = {
    digCommand,
};