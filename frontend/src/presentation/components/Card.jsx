import clsx from 'clsx';

export function Card({ title, description, children, className, actions }) {
  return (
    <div className={clsx('rounded-xl border border-slate-200 bg-white p-5 shadow-sm', className)}>
      {(title || description || actions) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
            {description && <p className="text-sm text-slate-600">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </div>
  );
}
