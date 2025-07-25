const tf = require('@tensorflow/tfjs-node');

async function trainModel(historicalData) {
  // Preprocess data
  const features = historicalData.map(d => [
    d.speed, 
    d.voltage, 
    d.temperature, 
    d.vibration
  ]);
  
  const labels = historicalData.map(d => d.failure ? 1 : 0);

  // Create model
  const model = tf.sequential();
  model.add(tf.layers.dense({
    units: 16,
    activation: 'relu',
    inputShape: [4]
  }));
  model.add(tf.layers.dense({
    units: 1,
    activation: 'sigmoid'
  }));

  // Compile and train
  model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });

  await model.fit(
    tf.tensor2d(features),
    tf.tensor1d(labels),
    {
      epochs: 100,
      batchSize: 32
    }
  );

  return model;
}

module.exports = { trainModel };