// webServer.js

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  const now = new Date();
  console.log(`${now.toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello, this is your bot responding to an HTTP GET request!' });
});

app.post('/api/command', (req, res) => {
  const { command } = req.body;
  const responseMessage = `Command received: ${command}`;
  res.status(200).json({ message: responseMessage });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Web server is running on port ${PORT}`);
});

module.exports = app;