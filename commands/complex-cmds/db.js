const sqlite3 = require('sqlite3').verbose();

// Use the environment variable for the password
const db = new sqlite3.Database('./data/database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database');
    }
});

// Close the database connection when your bot is shutting down
const handleExit = () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Disconnected from the SQLite database');
            process.exit(0);
        }
    });
};

// Handle both SIGINT and SIGTERM for graceful shutdown
process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);

// Close the database connection when your bot is shutting down
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Disconnected from the SQLite database');
            process.exit(0);
        }
    });
});

// Heroku sends SIGTERM to indicate that the process should terminate
process.on('SIGTERM', () => {
    console.log('Received SIGTERM signal. Shutting down gracefully.');
  
    // Disconnect the Twitch client before exiting
    client.disconnect().then(() => {
      // Call the handleExit function to close the database
      handleExit();
    });
});

const { sanitizeInput } = require('../handlers/sanitizer');

function addCommand(target, msg, username, callback) {
    // Extract commandname and response from the message
    const match = /^!addcmd (\S+) (.+)/.exec(msg);
    
    if (!match) {
        // If the message doesn't match the expected format, notify the user
        if (callback && typeof callback === 'function') {
            callback('Invalid command format. Please use: !addcmd <commandname> <response>');
        }
        return;
    }

    const [, commandname, response] = match;

    // Remove # in front of the channel name
    const cleanedTarget = target.replace(/^#/, '');

    // Sanitize input
    const sanitizedCommandname = sanitizeInput(commandname);
    const sanitizedResponse = sanitizeInput(response);

    // Check if the command already exists in the database
    const checkQuery = 'SELECT * FROM commands WHERE commandname = ? AND channel = ?';
    db.get(checkQuery, [sanitizedCommandname, cleanedTarget], function (checkErr, checkResult) {
        if (checkErr) {
            console.error('Error checking command existence:', checkErr.message);
            if (callback && typeof callback === 'function') {
                callback(`Error adding command: ${checkErr.message}`);
            }
        } else if (checkResult) {
            // Command with the same name already exists
            console.log(`Command '${commandname}' already exists in channel: ${cleanedTarget}`);
            if (callback && typeof callback === 'function') {
                callback(`Command '${commandname}' already exists.`);
            }
        } else {
            // Command does not exist, insert into the database
            const insertQuery = 'INSERT INTO commands (commandname, response, channel) VALUES (?, ?, ?)';
            db.run(insertQuery, [String(sanitizedCommandname), String(sanitizedResponse), String(cleanedTarget)], function (insertErr) {
                if (insertErr) {
                    console.error('Error adding command:', insertErr.message);
                    if (callback && typeof callback === 'function') {
                        callback(`Error adding command: ${insertErr.message}`);
                    }
                } else {
                    console.log(`Command added: ${commandname} in channel: ${cleanedTarget}`);
                    if (callback && typeof callback === 'function') {
                        callback(`Command added: ${commandname}`);
                    }
                }
            });
        }
    });
}

function editCommand(target, msg, username, callback) {
    // Extract commandname and newResponse from the message
    const match = /^!editcmd (\S+) (.+)/.exec(msg);

    if (!match) {
        // If the message doesn't match the expected format, notify the user
        if (callback && typeof callback === 'function') {
            callback('Invalid command format. Please use: !editcmd <commandname> <newResponse>');
        }
        return;
    }

    const [, commandname, newResponse] = match;

    // Remove # in front of the channel name
    const cleanedTarget = target.replace(/^#/, '');

    // Sanitize input
    const sanitizedCommandname = sanitizeInput(commandname);
    const sanitizedNewResponse = sanitizeInput(newResponse);

    // Edit an existing command in the database only if the channel matches
    const query = 'SELECT * FROM commands WHERE commandname = ? AND channel = ?';
    db.get(query, [sanitizedCommandname, cleanedTarget], function (err, result) {
        if (err) {
            console.error('Error checking command:', err.message);
            if (callback && typeof callback === 'function') {
                callback(`Error editing command: ${err.message}`);
            }
        } else if (result && isValidChannel(cleanedTarget, sanitizedCommandname)) {
            const updateQuery = 'UPDATE commands SET response = ? WHERE commandname = ? AND channel = ?';
            db.run(updateQuery, [String(sanitizedNewResponse), String(sanitizedCommandname), String(cleanedTarget)], function (updateErr) {
                if (updateErr) {
                    console.error('Error editing command:', updateErr.message);
                    if (callback && typeof callback === 'function') {
                        callback(`Error editing command: ${updateErr.message}`);
                    }
                } else {
                    console.log(`Command edited: ${commandname} in channel: ${cleanedTarget}`);
                    if (callback && typeof callback === 'function') {
                        callback(`Command edited: ${commandname}`);
                    }
                }
            });
        } else {
            if (callback && typeof callback === 'function') {
                callback(`Command not found in channel: ${cleanedTarget}`);
            }
        }
    });
}

function deleteCommand(target, msg, username, callback) {
    // Extract commandname from the message
    const match = /^!delcmd (\S+)/.exec(msg);

    if (!match) {
        // If the message doesn't match the expected format, notify the user
        if (callback && typeof callback === 'function') {
            callback('Invalid command format. Please use: !delcmd <commandname>');
        }
        return;
    }

    const [, commandname] = match;

    // Remove # in front of the channel name
    const cleanedTarget = target.replace(/^#/, '');

    // Sanitize input
    const sanitizedCommandname = sanitizeInput(commandname);

    // Delete a command from the database only if the channel matches
    const query = 'SELECT * FROM commands WHERE commandname = ? AND channel = ?';
    db.get(query, [sanitizedCommandname, cleanedTarget], function (err, result) {
        if (err) {
            console.error('Error checking command:', err.message);
            if (callback && typeof callback === 'function') {
                callback(`Error deleting command: ${err.message}`);
            }
        } else if (result && isValidChannel(cleanedTarget, sanitizedCommandname)) {
            const deleteQuery = 'DELETE FROM commands WHERE commandname = ? AND channel = ?';
            db.run(deleteQuery, [sanitizedCommandname, cleanedTarget], function (deleteErr) {
                if (deleteErr) {
                    console.error('Error deleting command:', deleteErr.message);
                    if (callback && typeof callback === 'function') {
                        callback(`Error deleting command: ${deleteErr.message}`);
                    }
                } else {
                    console.log(`Command deleted: ${commandname} in channel: ${cleanedTarget}`);
                    if (callback && typeof callback === 'function') {
                        callback(`Command deleted: ${commandname}`);
                    }
                }
            });
        } else {
            if (callback && typeof callback === 'function') {
                callback(`Command not found in channel: ${cleanedTarget}`);
            }
        }
    });
}

function isValidChannel(channel, commandname, callback) {
    // Remove # in front of the channel name
    const cleanedChannel = channel.replace(/^#/, '');

    // Check if the channel is in the predefined list
    const query = 'SELECT * FROM commands WHERE channel = ? AND commandname = ?';

    if (callback && typeof callback === 'function') {
        db.get(query, [cleanedChannel, commandname], function (err, result) {
            if (err) {
                console.error('Error checking channel:', err.message);
                callback(false); // Indicate that the channel is not valid in case of an error
            } else {
                callback(result !== undefined); // Return true if the command exists in the specified channel
            }
        });
    } else {
        return new Promise((resolve, reject) => {
            db.get(query, [cleanedChannel, commandname], function (err, result) {
                if (err) {
                    console.error('Error checking channel:', err.message);
                    reject(err);
                } else {
                    resolve(result !== undefined); // Resolve to true if the command exists in the specified channel
                }
            });
        });
    }
}

function getCommandFromDatabase(target, commandName) {
    return new Promise((resolve, reject) => {
      // Remove # in front of the channel name
      const cleanedTarget = target.replace(/^#/, '');
  
      // Sanitize input
      const sanitizedCommandName = sanitizeInput(commandName);
  
      // Check if the command exists in the database
      const query = 'SELECT * FROM commands WHERE channel = ? AND commandname = ?';
      db.get(query, [cleanedTarget, sanitizedCommandName], (err, result) => {
        if (err) {
          console.error('Error getting command from database:', err.message);
          reject(err);
        } else {
          if (result) {
            // If the command is found, resolve with the command information
            resolve(result);
          } else {
            // If the command is not found, resolve with null
            resolve(null);
          }
        }
      });
    });
  }
  
module.exports = { 
    addCommand,
    editCommand,
    deleteCommand,
    getCommandFromDatabase,
};