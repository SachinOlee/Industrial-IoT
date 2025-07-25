import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import io from 'socket.io-client';

const Dashboard = () => {
  const [machineData, setMachineData] = useState({
    speed: 0,
    voltage: 0,
    temperature: 0,
    status: 'normal'
  });
  
  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('sensor-data', (data) => {
      setMachineData(data);
      
      // Check for warnings
      if (data.temperature > 80) {
        setMachineData(prev => ({ ...prev, status: 'warning' }));
      }
    });
    
    return () => socket.disconnect();
  }, []);

  // Chart data setup...

  return (
    <div className="dashboard">
      <div className="status-indicator" data-status={machineData.status}>
        <div className="gauge">
          <div className="speed">{machineData.speed} RPM</div>
          <div className="temp">{machineData.temperature}°C</div>
        </div>
      </div>
      
      <div className="charts">
        <Line data={speedChartData} options={chartOptions} />
        <Line data={tempChartData} options={chartOptions} />
      </div>
      
      {machineData.status === 'warning' && (
        <div className="alert">
          <h3>Maintenance Required!</h3>
          <p>High temperature detected</p>
        </div>
      )}
    </div>
  );
};