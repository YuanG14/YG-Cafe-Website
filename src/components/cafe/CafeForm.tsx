import { useState } from 'react';
import type { FormEvent } from 'react';
import { TextField } from '../ui/TextField';
import { TagInput } from '../ui/TagInput';
import { Button } from '../ui/Button';
import { RatingInput } from './RatingInput';
import { getErrorMessage } from '../../lib/errors';
import type { CafeInput, RatingCategory } from '../../types/cafe';

const RATING_LABELS: Record<RatingCategory, string> = {
  overall: 'Overall',
  coffee: 'Coffee',
  food: 'Food',
  ambiance: 'Ambiance',
  service: 'Service',
  value: 'Value',
};

interface CafeFormProps {
  initialValue: CafeInput;
  submitLabel: string;
  onSubmit: (input: CafeInput) => Promise<void>;
  onCancel?: () => void;
}

export function CafeForm({ initialValue, submitLabel, onSubmit, onCancel }: CafeFormProps) {
  const [values, setValues] = useState<CafeInput>(initialValue);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof CafeInput>(key: K, value: CafeInput[K]) {
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
      setError(getErrorMessage(err, 'Something went wrong saving this cafe.'));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
      {/* Basics */}
      <section className="flex flex-col gap-4">
        <h3 className="font-display text-xl font-medium text-ink">The basics</h3>
        <TextField
          label="Cafe name"
          required
          value={values.name}
          onChange={(e) => update('name', e.target.value)}
        />
        <TextField
          label="Address"
          value={values.address}
          onChange={(e) => update('address', e.target.value)}
        />
        <TextField
          label="Google Maps link"
          type="url"
          placeholder="https://maps.google.com/…"
          value={values.googleMapsUrl}
          onChange={(e) => update('googleMapsUrl', e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Date visited"
            type="date"
            required
            value={values.dateVisited}
            onChange={(e) => update('dateVisited', e.target.value)}
          />
          <TextField
            label="Total spent (₱)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={values.totalSpent ?? ''}
            onChange={(e) => update('totalSpent', e.target.value === '' ? null : Number(e.target.value))}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-soft select-none">
          <input
            type="checkbox"
            checked={values.isFavorite}
            onChange={(e) => update('isFavorite', e.target.checked)}
            className="h-4 w-4 rounded border-hairline text-accent"
          />
          Mark as a favorite
        </label>
      </section>

      {/* Ratings */}
      <section className="flex flex-col gap-3">
        <h3 className="font-display text-xl font-medium text-ink">Ratings</h3>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {(Object.keys(RATING_LABELS) as RatingCategory[]).map((category) => (
            <RatingInput
              key={category}
              label={RATING_LABELS[category]}
              value={values.ratings[category]}
              onChange={(v) => update('ratings', { ...values.ratings, [category]: v })}
            />
          ))}
        </div>
      </section>

      {/* Details */}
      <section className="flex flex-col gap-4">
        <h3 className="font-display text-xl font-medium text-ink">The details</h3>
        <TagInput
          label="Tags"
          values={values.tags}
          onChange={(v) => update('tags', v)}
          placeholder="cozy, work-friendly, date night…"
        />
        <TagInput
          label="Drinks ordered"
          values={values.drinksOrdered}
          onChange={(v) => update('drinksOrdered', v)}
          placeholder="oat milk latte, cold brew…"
        />
        <TagInput
          label="Food ordered"
          values={values.foodOrdered}
          onChange={(v) => update('foodOrdered', v)}
          placeholder="croissant, avocado toast…"
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="journal-entry" className="text-sm font-medium text-ink">
            Journal entry
          </label>
          <textarea
            id="journal-entry"
            rows={5}
            value={values.journalEntry}
            onChange={(e) => update('journalEntry', e.target.value)}
            placeholder="What made this visit worth remembering?"
            className="rounded-xl border border-hairline bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-accent transition-colors resize-y"
          />
        </div>
      </section>

      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="lg" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
