//db.js

const { Upload } = require('@aws-sdk/lib-storage');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const { Readable } = require('stream');

const sqlite3 = require('sqlite3').verbose();

// Configure AWS SDK v3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Establish a connection to the database
const db = new sqlite3.Database('./data/database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database');
  }
});

// Close the database connection when your bot is shutting down
function handleExit() {
  return new Promise(async (resolve) => {
    try {
      // Close the database connection
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Disconnected from the SQLite database');
        }
  
        // Resolve the promise to indicate that the synchronous part is complete
        resolve();
      });
    } catch (err) {
      console.error('Error during shutdown:', err.message);
      resolve();
    }
  });
}
  
// Perform periodic backup every 2 hours
const backupInterval = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

async function performPeriodicBackup() {
  setInterval(async () => {
    try {
      // Backup the database
      const backupData = fs.readFileSync('./data/database.db');
      const backupStream = new Readable();
      backupStream.push(backupData);
      backupStream.push(null);

      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: 'database.db',
          Body: backupStream,
        },
      });

      // Execute the upload
      await upload.done();

      console.log('Periodic backup uploaded to S3');
    } catch (uploadErr) {
      console.error('Error uploading periodic backup to S3:', uploadErr.message);
    }
  }, backupInterval);
}
  
// Handle SIGTERM
process.on('SIGTERM', async () => {
    console.log('Received SIGTERM signal. Starting graceful shutdown.');
    await handleExit();
    console.log('Cleanup operations completed. Exiting process.');
    process.exit(0);
});
  
// Start periodic backup
performPeriodicBackup();

// Restore the database on bot startup
restoreDatabase();

async function restoreDatabase() {
  // Check if there is a backup on S3
  const restoreParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: 'database.db',
  };

  try {
    const response = await s3Client.send(new GetObjectCommand(restoreParams));
    const readStream = response.Body;
    const writeStream = fs.createWriteStream('./data/database.db');

    // Pipe the S3 stream to the local file
    readStream.pipe(writeStream);

    // Wait for the stream to finish writing
    await new Promise((resolve) => writeStream.on('finish', resolve));

    console.log('Database restored from S3');
  } catch (restoreErr) {
    if (restoreErr.name === 'NoSuchKey') {
      // If there is no backup file, log a message and continue without restoring
      console.log('No backup file found on S3. Starting with a fresh database.');
    } else {
      // Handle other errors
      console.error('Error restoring database from S3:', restoreErr.message);
    }
  }
}

const { sanitizeInput } = require('./sanitizer');

function addCommand(target, msg, username, callback) {
  // Extract commandname and response from the message
  const match = /^!addcmd (\S+) (.+)/i.exec(msg);
  
  if (!match) {
      // If the message doesn't match the expected format, notify the user
      if (callback && typeof callback === 'function') {
          callback('Invalid command format. Please use: !addcmd <commandname> <response>');
      }
      return;
  }

  let [, commandname, response] = match;

  // Convert commandName to lowercase
  commandname = commandname.toLowerCase(); 

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
  const match = /^!editcmd (\S+) (.+)/i.exec(msg);

  if (!match) {
      // If the message doesn't match the expected format, notify the user
      if (callback && typeof callback === 'function') {
          callback('Invalid command format. Please use: !editcmd <commandname> <newResponse>');
      }
      return;
  }

  let [, commandname, newResponse] = match;

  // Convert commandName to lowercase
  commandname = commandname.toLowerCase(); 

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
  const match = /^!delcmd (\S+)$/i.exec(msg);

  if (!match) {
      // If the message doesn't match the expected format, notify the user
      if (callback && typeof callback === 'function') {
          callback('Invalid command format. Please use: !delcmd <commandname>');
      }
      return;
  }

  let [, commandname] = match;

  // Convert commandName to lowercase
  commandname = commandname.toLowerCase(); 

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

function getAllCommands(target, callback) {
  // Remove # in front of the channel name
  const cleanedTarget = target.replace(/^#/, '');

  const query = 'SELECT commandname FROM commands WHERE channel = ?';
  db.all(query, [cleanedTarget], function (err, rows) {
    if (err) {
      console.error('Error fetching commands:', err.message);
      if (callback && typeof callback === 'function') {
        callback(`Error fetching commands: ${err.message}`);
      }
    } else {
      const commandNames = rows.map(row => row.commandname);
      if (callback && typeof callback === 'function') {
        callback(null, commandNames);
      }
    }
  });
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

const default_cooldown_duration = 10; // Default cooldown duration in seconds for database commands
  
module.exports = { 
    addCommand,
    editCommand,
    deleteCommand,
    getAllCommands,
    getCommandFromDatabase,
    default_cooldown_duration
};