export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-black uppercase tracking-[.22em] text-indigo-500 sm:mb-2.5 sm:text-[11px] dark:text-indigo-400">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-black tracking-[-.035em] sm:text-4xl">{title}</h1>
        <p className="muted mt-1 max-w-2xl text-xs leading-5 sm:mt-2.5 sm:text-base sm:leading-6">
          {description}
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
