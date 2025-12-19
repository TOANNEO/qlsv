import clsx from 'clsx';

export function Select({ label, name, options = [], className, ...props }) {
  return (
    <label className="flex w-full flex-col gap-1 text-sm text-slate-700">
      {label && <span className="font-medium">{label}</span>}
      <select
        name={name}
        className={clsx(
          'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
