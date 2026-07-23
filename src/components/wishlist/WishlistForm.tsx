import { useState } from 'react';
import type { FormEvent } from 'react';
import { TextField } from '../ui/TextField';
import { PillSelect } from '../ui/PillSelect';
import { Button } from '../ui/Button';
import type { WishlistInput, WishlistPriority, WishlistStatus } from '../../types/wishlist';

const PRIORITY_OPTIONS: { value: WishlistPriority; label: string }[] = [
  { value: 'must-visit', label: 'Must visit' },
  { value: 'interested', label: 'Interested' },
  { value: 'someday', label: 'Someday' },
];

const STATUS_OPTIONS: { value: WishlistStatus; label: string }[] = [
  { value: 'idea', label: 'Idea' },
  { value: 'planned', label: 'Planned' },
];

interface WishlistFormProps {
  initialValue: WishlistInput;
  submitLabel: string;
  onSubmit: (input: WishlistInput) => Promise<void>;
  onCancel?: () => void;
}

export function WishlistForm({ initialValue, submitLabel, onSubmit, onCancel }: WishlistFormProps) {
  const [values, setValues] = useState<WishlistInput>(initialValue);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof WishlistInput>(key: K, value: WishlistInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values.name.trim()) {
      setError('Give the cafe a name before saving.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong saving this.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <TextField
        label="Cafe name"
        required
        value={values.name}
        onChange={(e) => update('name', e.target.value)}
      />

      <div className="grid sm:grid-cols-2 gap-5">
        <PillSelect
          label="Priority"
          options={PRIORITY_OPTIONS}
          value={values.priority}
          onChange={(v) => update('priority', v)}
        />
        <PillSelect
          label="Status"
          options={STATUS_OPTIONS}
          value={values.status === 'visited' ? 'planned' : values.status}
          onChange={(v) => update('status', v)}
        />
      </div>

      <TextField
        label="Google Maps link"
        type="url"
        placeholder="https://maps.google.com/…"
        value={values.googleMapsUrl}
        onChange={(e) => update('googleMapsUrl', e.target.value)}
      />

      <TextField
        label="Estimated budget"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        value={values.estimatedBudget ?? ''}
        onChange={(e) => update('estimatedBudget', e.target.value === '' ? null : Number(e.target.value))}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="wishlist-notes" className="text-sm font-medium text-ink">
          Notes
        </label>
        <textarea
          id="wishlist-notes"
          rows={3}
          value={values.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Why this one's on the list…"
          className="rounded-xl border border-hairline bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-accent transition-colors resize-y"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
