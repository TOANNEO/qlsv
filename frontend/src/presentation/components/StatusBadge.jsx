import clsx from 'clsx';

const COLORS = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-slate-200 text-slate-700',
  PRESENT: 'bg-green-100 text-green-800',
  LATE: 'bg-amber-100 text-amber-800',
  ABSENT: 'bg-red-100 text-red-800',
  EXCUSED: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  PENDING: 'bg-amber-100 text-amber-800',
  OPEN: 'bg-emerald-100 text-emerald-800',
  CLOSED: 'bg-slate-200 text-slate-800',
};

export function StatusBadge({ status }) {
  if (!status) return null;
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold', COLORS[status] || 'bg-slate-100 text-slate-800')}>
      {status}
    </span>
  );
}
