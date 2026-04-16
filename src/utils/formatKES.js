export function formatKES(amount, compact = true) {
  if (!amount && amount !== 0) return '—';
  const n = Number(amount); // DB returns strings from COUNT/SUM
  if (!compact) return new Intl.NumberFormat('en-KE').format(n);
  if (n >= 1e12) return `KES ${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `KES ${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6)  return `KES ${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3)  return `KES ${(n / 1e3).toFixed(0)}K`;
  return `KES ${n}`;
}
