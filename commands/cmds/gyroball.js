// gyroball.js

// Function called when the "!gyroball" command is issued
function gyroballCommand(target, username, client, userMsg, context) {
    client.say(target, `So I have an Electrode that knows Gyro Ball. So I know that the attack is based off the user speed so I assumed that since Electrode is one of the fastest monsters, he'd do massive damage...not so much the case. So I equipped a lagging tail to make him slow, but now he's just slow and the Gyro Ball damage still does squat.`);
}

module.exports = {
    gyroballCommand,
};