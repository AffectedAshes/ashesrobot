const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000; // Use the provided port or 3000 if not provided

app.get('/', (req, res) => {
  res.send('Hello, this is your bot responding to an HTTP request!');
});

app.listen(PORT, () => {
  console.log(`Web server is running on port ${PORT}`);
});

module.exports = app; // Export the app instance