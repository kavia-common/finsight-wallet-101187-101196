import React from 'react';

// PUBLIC_INTERFACE
export default function KPICard({ label, value, hint }) {
  return (
    <div className="card kpi">
      <div>
        <div className="label" style={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
        {hint && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{hint}</div>}
      </div>
      <div className="value">{value}</div>
    </div>
  );
}
