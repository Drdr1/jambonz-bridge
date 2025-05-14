const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ server });

// Parse JSON bodies
app.use(express.json());

// Basic webhook for Jambonz to call
app.post('/jambonz-webhook', (req, res) => {
  console.log('Received call webhook:', req.body);
  
  // Simple Jambonz response to test basic functionality
  res.json({
    verb: 'say',
    text: 'This is a test call from the bridge application. The connection is working.',
    actionHook: '/call-status'
  });
});

// Status webhook
app.post('/call-status', (req, res) => {
  console.log('Call status update:', req.body);
  res.sendStatus(200);
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Jambonz-Retell bridge is running');
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('WebSocket connection established');
  
  ws.on('message', (message) => {
    try {
      console.log('Received message:', message.toString());
      // Echo back for testing
      ws.send(JSON.stringify({status: 'received'}));
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
