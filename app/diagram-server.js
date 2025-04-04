const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'network-diagram.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Network Diagram server running on http://0.0.0.0:${PORT}`);
});
