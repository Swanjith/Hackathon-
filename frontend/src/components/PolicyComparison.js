import React, { useState, useEffect } from 'react';
import './PolicyComparison.css';
import API from '../services/api';

function PolicyComparison() {
  const [policies, setPolicies] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComparison();
    const interval = setInterval(loadComparison, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadComparison = async () => {
    try {
      const data = await API.getPolicyComparison();
      setPolicies(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading policy comparison:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="loading">Loading policy comparison...</p>;
  }

  const policyNames = Object.keys(policies);
  if (policyNames.length === 0) {
    return <p className="no-data">No policy comparison data available. Run simulations to see comparisons.</p>;
  }

  return (
    <div className="policy-comparison">
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Policy</th>
            <th>CSAT</th>
            <th>AHT (min)</th>
            <th>SLA Met Rate</th>
            <th>Fairness (Gini)</th>
            <th>Total Assignments</th>
          </tr>
        </thead>
        <tbody>
          {policyNames.map(policy => {
            const data = policies[policy];
            return (
              <tr key={policy} className={policy === 'CUCB-OTA' ? 'highlight' : ''}>
                <td><strong>{policy}</strong></td>
                <td>{data.avg_csat?.toFixed(3) || 'N/A'}</td>
                <td>{data.avg_aht?.toFixed(2) || 'N/A'}</td>
                <td>{(data.sla_met_rate * 100)?.toFixed(1) || 'N/A'}%</td>
                <td>{data.gini?.toFixed(3) || 'N/A'}</td>
                <td>{data.total_assignments || 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PolicyComparison;

