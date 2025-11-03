import React, { useState } from 'react';
import './SimulationControl.css';

function SimulationControl({ isRunning, onStart, onStop }) {
  const [nBatches, setNBatches] = useState(50);
  const [policy, setPolicy] = useState('CUCB-OTA');

  const handleStart = () => {
    onStart(nBatches, policy);
  };

  return (
    <div className="simulation-control">
      <h2>Simulation Control</h2>
      <div className="control-panel">
        <div className="control-group">
          <label>
            Batches:
            <input
              type="number"
              min="1"
              max="500"
              value={nBatches}
              onChange={(e) => setNBatches(parseInt(e.target.value))}
              disabled={isRunning}
            />
          </label>
        </div>

        <div className="control-group">
          <label>
            Policy:
            <select
              value={policy}
              onChange={(e) => setPolicy(e.target.value)}
              disabled={isRunning}
            >
              <option value="CUCB-OTA">CUCB-OTA</option>
              <option value="FCFS">FCFS</option>
              <option value="Skill-Greedy">Skill-Greedy</option>
            </select>
          </label>
        </div>

        <div className="control-actions">
          {isRunning ? (
            <button className="btn-stop" onClick={onStop}>
              ⏹ Stop Simulation
            </button>
          ) : (
            <button className="btn-start" onClick={handleStart}>
              ▶ Start Simulation
            </button>
          )}
        </div>

        {isRunning && (
          <div className="simulation-status">
            <span className="status-indicator running"></span>
            Simulation Running...
          </div>
        )}
      </div>
    </div>
  );
}

export default SimulationControl;

