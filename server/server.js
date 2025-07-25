const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// API endpoint for sensor data
app.post('/api/sensor-data', (req, res) => {
  const data = req.body;
  
  // Save to database
  const newData = new SensorData(data);
  newData.save();
  
  // Broadcast to all clients
  io.emit('sensor-data', data);
  
  // Check for maintenance needs
  if (data.temperature > 85) {
    io.emit('maintenance-alert', {
      machineId: data.machineId,
      reason: 'High temperature'
    });
  }
  
  res.status(200).send('Data received');
});