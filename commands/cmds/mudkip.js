// mudkip.js

// Function called when the "!mudkip" command is issued
function mudkipCommand(target, username, client, userMsg, context) {
    client.say(target, `Naughty nature, 21 HP (21 IV), 14 Atk (23 IV), 11 Def (28 IV), 11 SpA (30 IV), 9 SpD (29 IV), 10 Speed (29 IV)`);
}

module.exports = {
    mudkipCommand,
};