import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './MetricsChart.css';
import API from '../services/api';

function MetricsChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const response = await API.getHistoricalMetrics();
      if (response.data && response.data.length > 0) {
        // Take last 50 data points for performance
        const recentData = response.data.slice(-50).map(d => ({
          batch: d.batch_id,
          csat: parseFloat(d.avg_csat) || 0,
          aht: parseFloat(d.avg_aht) || 0,
          sla: (parseFloat(d.sla_met_rate) || 0) * 100,
          gini: parseFloat(d.gini_coefficient) || 0
        }));
        setData(recentData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading metrics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="loading">Loading metrics chart...</p>;
  }

  if (data.length === 0) {
    return <p className="no-data">No metrics data available. Run a simulation to see trends.</p>;
  }

  return (
    <div className="metrics-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="batch" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="csat" stroke="#667eea" strokeWidth={2} name="CSAT" />
          <Line type="monotone" dataKey="aht" stroke="#f57c00" strokeWidth={2} name="AHT (min)" />
          <Line type="monotone" dataKey="sla" stroke="#4caf50" strokeWidth={2} name="SLA Met (%)" />
          <Line type="monotone" dataKey="gini" stroke="#e91e63" strokeWidth={2} name="Fairness (Gini)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MetricsChart;

