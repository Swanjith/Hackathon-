import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import API from './services/api';

function App() {
  const [connected, setConnected] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // Check API connection
    API.healthCheck()
      .then(() => {
        setConnected(true);
        return API.getConfig();
      })
      .then(data => setConfig(data))
      .catch(err => {
        console.error('API connection failed:', err);
        setConnected(false);
      });
  }, []);

  if (!connected) {
    return (
      <div className="app-error">
        <h1>SQRS Dashboard</h1>
        <div className="error-message">
          <p>⚠️ Cannot connect to API server</p>
          <p>Please ensure the Flask API is running on <code>http://localhost:5000</code></p>
          <p>Run: <code>python api/app.py</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🚀 Smart Queue Routing System (SQRS)</h1>
        <p>CUCB-OTA: Causal Uplift + Optimal Transport Assignment</p>
      </header>
      <Dashboard config={config} />
    </div>
  );
}

export default App;

