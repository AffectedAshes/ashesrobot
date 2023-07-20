// cooldown.js

// Function to check if a user is on cooldown for a specific command
function isOnCooldown(username, command, cooldowns) {
  const commandCooldowns = cooldowns[command];
  if (commandCooldowns && commandCooldowns[username]) {
    const now = new Date();
    const elapsedTime = now - commandCooldowns[username].timestamp;
    const remainingCooldown = commandCooldowns[username].cooldownDuration;
    return elapsedTime < remainingCooldown;
  }
  return false;
}

// Function to get the remaining cooldown duration for a user and command
function getRemainingCooldown(username, command, cooldowns) {
  const commandCooldowns = cooldowns[command];
  if (commandCooldowns && commandCooldowns[username]) {
    const now = new Date();
    const elapsedTime = now - commandCooldowns[username].timestamp;
    const remainingCooldown = commandCooldowns[username].cooldownDuration;
    const remainingTime = remainingCooldown - elapsedTime;
    return Math.ceil(remainingTime / 1000); // Convert to seconds
  }
  return 0;
}

// Function to set a user on cooldown for a specific command
function setCooldown(username, command, cooldowns, cooldownDuration) {
  const now = new Date();
  if (!cooldowns[command]) {
    cooldowns[command] = {};
  }
  cooldowns[command][username] = {
    timestamp: now,
    cooldownDuration: cooldownDuration * 1000, // Convert to milliseconds
  };
}

module.exports = {
  isOnCooldown,
  getRemainingCooldown,
  setCooldown
};