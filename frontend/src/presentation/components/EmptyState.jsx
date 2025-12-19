export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">
      <div className="text-base font-semibold text-slate-800">{title}</div>
      {description && <p className="text-sm text-slate-600">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
