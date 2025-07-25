const Machine = require('../models/Machine');
const { trainModel } = require('../ml/trainModel');

exports.predictMaintenance = async (req, res) => {
  try {
    const machines = await Machine.find();
    const model = await trainModel(machines);
    
    // Get latest data
    const currentData = machines.map(m => [
      m.sensorData.speed,
      m.sensorData.voltage,
      m.sensorData.temperature,
      m.sensorData.vibration
    ]);
    
    const predictions = await model.predict(tf.tensor2d(currentData)).data();
    
    // Check for maintenance needs
    predictions.forEach((pred, i) => {
      if (pred > 0.8) {
        sendMaintenanceAlert(machines[i]);
      }
    });
    
    res.status(200).json({ predictions });
  } catch (err) {
    res.status(500).json({ message: 'Prediction failed' });
  }
};

async function sendMaintenanceAlert(machine) {
  // Send email to admins
  // Update machine status
}