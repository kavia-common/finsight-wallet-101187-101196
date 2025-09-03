import React from 'react';

// PUBLIC_INTERFACE
export default function FormField({ label, children, error, htmlFor }) {
  return (
    <div className="col" style={{ marginBottom: 12 }}>
      {label && <label className="label" htmlFor={htmlFor}>{label}</label>}
      {children}
      {error && <div style={{ color: 'tomato', fontSize: 12, marginTop: 6 }}>{String(error)}</div>}
    </div>
  );
}
