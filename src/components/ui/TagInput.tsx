import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { cn } from '../../lib/cn';

interface TagInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Type a value and press Enter (or comma) to add it as a chip. Generic on
 * purpose — used for cafe tags, drinks ordered, and food ordered alike.
 */
export function TagInput({ label, values, onChange, placeholder, className }: TagInputProps) {
  const [draft, setDraft] = useState('');

  function commitDraft() {
    const value = draft.trim();
    if (value && !values.includes(value)) {
      onChange([...values, value]);
    }
    setDraft('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commitDraft();
    } else if (e.key === 'Backspace' && draft === '' && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  }

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-hairline bg-white px-3 py-2 min-h-11 focus-within:border-accent transition-colors">
        {values.map((value, i) => (
          <span
            key={`${value}-${i}`}
            className="inline-flex items-center gap-1 rounded-pill bg-blush px-2.5 py-1 text-xs font-medium text-ink"
          >
            {value}
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label={`Remove ${value}`}
              className="text-ink-soft hover:text-ink"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
          placeholder={values.length === 0 ? placeholder : undefined}
          className="flex-1 min-w-[8ch] outline-none text-sm text-ink placeholder:text-ink-faint bg-transparent"
        />
      </div>
    </div>
  );
}
