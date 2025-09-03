import React from 'react';

// PUBLIC_INTERFACE
export default function ChartBar({ data = [] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="card">
      <div className="chart" role="img" aria-label="Weekly expense chart">
        {data.map((d, idx) => (
          <div key={idx} title={`${d.label}: ${d.value}`} className="bar" style={{ height: `${(d.value / max) * 100}%` }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
        {data.map((d, idx) => (<div key={idx} style={{ width: 20, textAlign: 'center' }}>{d.label}</div>))}
      </div>
    </div>
  );
}
