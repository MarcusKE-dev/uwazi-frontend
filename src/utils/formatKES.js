// Formats large KES numbers: 450231946 → "450.2M"
export const formatKES = (amount) => {
  const n = Number(amount);
  if (isNaN(n)) return '—';
  if (n >= 1e9)  return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6)  return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3)  return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString('en-KE');
};