import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function fmtDate(dateStr) {
  if (!dateStr) return '—';
  try { return format(parseISO(dateStr), 'dd MMM yyyy'); }
  catch { return dateStr; }
}

export function fmtDateTime(dateStr) {
  if (!dateStr) return '—';
  try { return format(parseISO(dateStr), 'dd MMM yyyy, HH:mm'); }
  catch { return dateStr; }
}

export function fmtRelative(dateStr) {
  if (!dateStr) return '—';
  try { return formatDistanceToNow(parseISO(dateStr), { addSuffix: true }); }
  catch { return dateStr; }
}
