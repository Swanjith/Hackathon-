import React from 'react';
import './AgentGrid.css';

function AgentGrid({ agents }) {
  if (!agents || agents.length === 0) {
    return <p className="no-data">No agents available</p>;
  }

  return (
    <div className="agent-grid">
      {agents.slice(0, 20).map((agent, idx) => {
        const totalCapacity = Object.values(agent.capacity || {}).reduce((a, b) => a + b, 0);
        const utilization = totalCapacity > 0 ? (agent.current_load / totalCapacity) * 100 : 0;
        
        return (
          <div key={idx} className={`agent-card ${agent.status}`}>
            <div className="agent-header">
              <span className="agent-id">{agent.agent_id}</span>
              <span className={`status-badge ${agent.status}`}>
                {agent.status}
              </span>
            </div>
            
            <div className="agent-load">
              <div className="load-bar-container">
                <div 
                  className="load-bar"
                  style={{ width: `${Math.min(utilization, 100)}%` }}
                />
              </div>
              <span className="load-text">
                {agent.current_load} / {totalCapacity} active
              </span>
            </div>

            <div className="agent-channels">
              {Object.entries(agent.channel_loads || {}).map(([channel, load]) => (
                <div key={channel} className="channel-load">
                  <span className="channel-name">{channel}</span>
                  <span className="channel-count">
                    {load}/{agent.capacity?.[channel] || 0}
                  </span>
                </div>
              ))}
            </div>

            <div className="agent-performance">
              <span>CSAT: {agent.avg_csat?.toFixed(2) || 'N/A'}</span>
              <span>AHT: {agent.avg_aht?.toFixed(1) || 'N/A'}m</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AgentGrid;

