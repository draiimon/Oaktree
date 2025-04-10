// Local environment server startup script
// This file provides a compatibility layer for running the application locally
// without relying on Replit-specific features

const express = require('express');
const { createServer } = require('http');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Initialize Express app and HTTP server
const app = express();
const server = createServer(app);

// Handle body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up static file serving for the client build
const clientDistPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`Serving static files from ${clientDistPath}`);
  app.use(express.static(clientDistPath));
} else {
  console.log(`Static files directory not found at ${clientDistPath}`);
  console.log('Make sure to build the client first with: npm run local:build');
}

// Set up API routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the local server!' });
});

// API status endpoint for health checks
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// AWS status endpoint (mock in local mode)
app.get('/api/aws/status', (req, res) => {
  const useAws = process.env.USE_AWS_DB === 'true';
  
  res.json({
    status: useAws ? 'connected' : 'not_connected',
    region: process.env.AWS_REGION || 'ap-southeast-1',
    services: {
      dynamodb: {
        enabled: useAws,
        tableName: 'OakTreeUsers'
      }
    },
    environment: 'local-development',
    timestamp: new Date().toISOString()
  });
});

// Simple user routes for testing
const users = [];
let nextId = 1;

app.post('/api/auth/register', (req, res) => {
  const { username, password, email } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  const newUser = {
    id: nextId++,
    username,
    password: `hashed_${password}`, // In a real app, use bcrypt
    email: email || '',
    created_at: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Don't return the password
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  const user = users.find(u => u.username === username);
  if (!user || user.password !== `hashed_${password}`) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Don't return the password
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Fallback route for SPA
app.get('*', (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application is not built yet. Run npm run local:build first.');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`AWS Region: ${process.env.AWS_REGION || 'not configured'}`);
  console.log(`Using AWS DynamoDB: ${process.env.USE_AWS_DB === 'true' ? 'Yes' : 'No (using local storage)'}`);
});

// Export for use in other files
module.exports = { app, server };