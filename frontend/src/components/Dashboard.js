import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import API from '../services/api';
import KPICards from './KPICards';
import AgentGrid from './AgentGrid';
import MetricsChart from './MetricsChart';
import PolicyComparison from './PolicyComparison';
import SimulationControl from './SimulationControl';

function Dashboard({ config }) {
  const [metrics, setMetrics] = useState({
    csat: 0.0,
    aht: 0.0,
    sla_met_rate: 0.0,
    gini: 0.0,
    throughput: 0
  });
  
  const [agents, setAgents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [simulationStatus, setSimulationStatus] = useState({ is_running: false });

  // Load initial data
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000); // Update every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [metricsData, agentsData, assignmentsData, statusData] = await Promise.all([
        API.getCurrentMetrics(),
        API.getAgents(),
        API.getActiveAssignments(),
        API.getSimulationStatus()
      ]);
      
      setMetrics(metricsData);
      setAgents(agentsData);
      setAssignments(assignmentsData);
      setSimulationStatus(statusData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleStartSimulation = async (nBatches, policy) => {
    try {
      await API.startSimulation(nBatches, policy);
      loadData();
    } catch (error) {
      console.error('Error starting simulation:', error);
      alert('Failed to start simulation');
    }
  };

  const handleStopSimulation = async () => {
    try {
      await API.stopSimulation();
      loadData();
    } catch (error) {
      console.error('Error stopping simulation:', error);
    }
  };

  return (
    <div className="dashboard">
      <SimulationControl
        isRunning={simulationStatus.is_running}
        onStart={handleStartSimulation}
        onStop={handleStopSimulation}
      />

      <KPICards metrics={metrics} />

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Agent Status ({agents.length} agents)</h2>
          <AgentGrid agents={agents} />
        </div>

        <div className="dashboard-section">
          <h2>Recent Assignments</h2>
          <div className="assignments-table">
            {assignments.length === 0 ? (
              <p className="no-data">No assignments yet. Start a simulation to see assignments.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Agent</th>
                    <th>Channel</th>
                    <th>CSAT</th>
                    <th>AHT (min)</th>
                    <th>SLA</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.slice(-10).reverse().map((a, idx) => (
                    <tr key={idx}>
                      <td>{a.customer_id || `C${idx}`}</td>
                      <td>{a.agent_id}</td>
                      <td><span className={`channel-badge ${a.channel}`}>{a.channel}</span></td>
                      <td>{a.csat?.toFixed(3) || 'N/A'}</td>
                      <td>{a.aht?.toFixed(2) || 'N/A'}</td>
                      <td>{a.sla_met ? '✓' : '✗'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Policy Comparison</h2>
        <PolicyComparison />
      </div>

      <div className="dashboard-section">
        <h2>Metrics Trend</h2>
        <MetricsChart />
      </div>
    </div>
  );
}

export default Dashboard;

