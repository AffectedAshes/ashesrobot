// permissions.js

// Function to check if user is a moderator or broadcaster
function hasPermission(context) {
    return context.mod || (context.badges && context.badges.broadcaster === '1');
  }
  
  module.exports = {
    hasPermission
  };