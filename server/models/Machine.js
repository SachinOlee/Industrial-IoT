const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  name: String,
  status: { type: String, enum: ['running', 'idle', 'maintenance'], default: 'running' },
  sensorData: {
    speed: Number,
    voltage: Number,
    temperature: Number,
    vibration: Number,
    timestamp: { type: Date, default: Date.now }
  },
  maintenanceHistory: [{
    type: { type: String, enum: ['predictive', 'scheduled'] },
    date: Date,
    description: String
  }]
});

module.exports = mongoose.model('Machine', machineSchema);