import requests
import random
import time

API_ENDPOINT = "http://your-server-ip:5000/api/sensor-data"

while True:
    sensor_data = {
        "machineId": "machine-001",
        "speed": random.uniform(1000, 3000),
        "voltage": random.uniform(220, 240),
        "temperature": random.uniform(30, 100),
        "vibration": random.uniform(0, 10)
    }
    
    try:
        response = requests.post(API_ENDPOINT, json=sensor_data)
        print(f"Data sent: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")
    
    time.sleep(5)  # Send every 5 seconds
    