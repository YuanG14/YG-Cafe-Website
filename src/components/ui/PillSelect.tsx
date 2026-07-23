interface PillOption<T extends string> {
  value: T;
  label: string;
}

interface PillSelectProps<T extends string> {
  label: string;
  options: PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function PillSelect<T extends string>({ label, options, value, onChange }: PillSelectProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors ${
                active ? 'bg-primary text-ink shadow-soft' : 'bg-white border border-hairline text-ink-soft hover:text-ink'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
