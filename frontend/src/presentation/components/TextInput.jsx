import clsx from 'clsx';

export function TextInput({ label, name, type = 'text', helper, className, ...props }) {
  return (
    <label className="flex w-full flex-col gap-1 text-sm text-slate-700">
      {label && <span className="font-medium">{label}</span>}
      <input
        name={name}
        type={type}
        className={clsx(
          'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100',
          className
        )}
        {...props}
      />
      {helper && <span className="text-xs text-slate-500">{helper}</span>}
    </label>
  );
}
