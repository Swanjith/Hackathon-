import React from 'react';
import './KPICards.css';

function KPICards({ metrics }) {
  const getStatusColor = (value, threshold, type = 'higher') => {
    if (type === 'higher') {
      return value >= threshold ? '#4caf50' : value >= threshold * 0.8 ? '#ff9800' : '#f44336';
    } else {
      return value <= threshold ? '#4caf50' : value <= threshold * 1.2 ? '#ff9800' : '#f44336';
    }
  };

  return (
    <div className="kpi-cards">
      <div className="kpi-card">
        <div className="kpi-header">
          <h3>CSAT Score</h3>
          <span className="kpi-trend">↑ 5.2%</span>
        </div>
        <div className="kpi-value" style={{ color: getStatusColor(metrics.csat, 0.7, 'higher') }}>
          {metrics.csat.toFixed(3)}
        </div>
        <div className="kpi-target">Target: ≥ 0.70</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <h3>Avg Handle Time</h3>
          <span className="kpi-unit">minutes</span>
        </div>
        <div className="kpi-value" style={{ color: getStatusColor(metrics.aht, 8.0, 'lower') }}>
          {metrics.aht.toFixed(2)}
        </div>
        <div className="kpi-target">Target: ≤ 8.0 min</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <h3>SLA Met Rate</h3>
          <span className="kpi-trend">88.4%</span>
        </div>
        <div className="kpi-value" style={{ color: getStatusColor(metrics.sla_met_rate, 0.85, 'higher') }}>
          {(metrics.sla_met_rate * 100).toFixed(1)}%
        </div>
        <div className="kpi-target">Target: ≥ 85%</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <h3>Fairness (Gini)</h3>
          <span className="kpi-trend">Good</span>
        </div>
        <div className="kpi-value" style={{ color: getStatusColor(metrics.gini, 0.3, 'lower') }}>
          {metrics.gini.toFixed(3)}
        </div>
        <div className="kpi-target">Target: ≤ 0.30</div>
      </div>
    </div>
  );
}

export default KPICards;

