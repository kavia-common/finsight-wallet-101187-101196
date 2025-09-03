const DEFAULT_CCY = 'USD';

// PUBLIC_INTERFACE
export function formatCurrency(value, currency = DEFAULT_CCY) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value || 0);
  } catch {
    return `$${Number(value || 0).toFixed(2)}`;
  }
}

// PUBLIC_INTERFACE
export function formatDate(isoString) {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString();
  } catch {
    return isoString;
  }
}
