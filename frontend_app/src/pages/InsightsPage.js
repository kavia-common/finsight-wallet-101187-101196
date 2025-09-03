import React, { useEffect, useState } from 'react';
import KPICard from '../components/KPICard';
import ChartBar from '../components/ChartBar';
import { api } from '../services/apiClient';
import { formatCurrency } from '../utils/format';

// PUBLIC_INTERFACE
export default function InsightsPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const s = await api.insights.summary();
      setSummary(s);
    } catch (e) {
      setError(e.message || 'Failed to load insights');
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="container" style={{ marginTop: 20 }}>
      <h2>Insights</h2>
      {error && <div style={{ color: 'tomato', marginBottom: 8 }}>{error}</div>}
      <div className="row" style={{ marginTop: 12 }}>
        <div className="col"><KPICard label="Total Balance" value={formatCurrency(summary?.totalBalance || 0)} /></div>
        <div className="col"><KPICard label="Income (30d)" value={formatCurrency(summary?.income || 0)} /></div>
        <div className="col"><KPICard label="Expense (30d)" value={formatCurrency(summary?.expense || 0)} /></div>
      </div>
      <div style={{ marginTop: 16 }}>
        <ChartBar data={summary?.weeklyExpense || []} />
      </div>
    </div>
  );
}
