export const STATUS_COLORS = {
  submitted:    'bg-blue-50   text-blue-700  border border-blue-200',
  under_review: 'bg-amber-50  text-amber-700 border border-amber-200',
  escalated:    'bg-red-50    text-red-700   border border-red-200',
  resolved:     'bg-green-50  text-green-700 border border-green-200',
  closed:       'bg-slate-50  text-slate-600 border border-slate-200',
};

export function getStatusClass(status) {
  return STATUS_COLORS[status] ?? STATUS_COLORS.submitted;
}

export const STATUS_LABELS = {
  submitted:    'Submitted',
  under_review: 'Under Review',
  escalated:    'Escalated',
  resolved:     'Resolved',
  closed:       'Closed',
};
