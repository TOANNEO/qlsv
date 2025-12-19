import clsx from 'clsx';

export function Button({ children, variant = 'primary', className, ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary:
      'bg-brand-600 text-white shadow-sm hover:bg-brand-700 focus-visible:outline-brand-600',
    ghost: 'text-slate-700 hover:bg-slate-100 focus-visible:outline-brand-600',
    danger:
      'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:outline-red-600',
    soft:
      'bg-brand-50 text-brand-700 hover:bg-brand-100 focus-visible:outline-brand-600',
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
