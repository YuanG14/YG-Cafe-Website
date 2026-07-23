import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { WishlistForm } from './WishlistForm';
import { useAuth } from '../../context/AuthContext';
import { updateWishlistItem, setWishlistStatus } from '../../services/wishlistService';
import { getErrorMessage } from '../../lib/errors';
import { formatCurrency } from '../../lib/currency';
import type { WishlistCafe, WishlistInput, WishlistPriority } from '../../types/wishlist';

const PRIORITY_TONE: Record<WishlistPriority, 'pink' | 'sky' | 'neutral'> = {
  'must-visit': 'pink',
  interested: 'sky',
  someday: 'neutral',
};

const PRIORITY_LABEL: Record<WishlistPriority, string> = {
  'must-visit': 'Must visit',
  interested: 'Interested',
  someday: 'Someday',
};

interface WishlistCardProps {
  item: WishlistCafe;
  onChanged: () => void;
  onDelete: (id: string) => void;
  onConvert: (item: WishlistCafe) => Promise<void>;
}

function toInput(item: WishlistCafe): WishlistInput {
  return {
    name: item.name,
    priority: item.priority,
    status: item.status,
    notes: item.notes ?? '',
    estimatedBudget: item.estimatedBudget,
    googleMapsUrl: item.googleMapsUrl ?? '',
  };
}

export function WishlistCard({ item, onChanged, onDelete, onConvert }: WishlistCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

  async function handleUpdate(input: WishlistInput) {
    await updateWishlistItem(item.id, input);
    setEditing(false);
    onChanged();
  }

  async function handleMarkPlanned() {
    await setWishlistStatus(item.id, 'planned');
    onChanged();
  }

  async function handleConvert() {
    if (!user) return;
    setConverting(true);
    setConvertError(null);
    try {
      await onConvert(item);
    } catch (err) {
      setConvertError(getErrorMessage(err, "Couldn't add this to the collection."));
    } finally {
      setConverting(false);
    }
  }

  if (editing) {
    return (
      <Card className="p-6">
        <WishlistForm
          initialValue={toInput(item)}
          submitLabel="Save changes"
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      </Card>
    );
  }

  if (item.status === 'visited' && item.convertedCafeId) {
    return (
      <Card className="p-6 flex items-center justify-between gap-4 opacity-70">
        <div>
          <h3 className="font-display text-xl font-medium text-ink">{item.name}</h3>
          <p className="text-sm text-ink-soft mt-0.5">Visited — now in the collection</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/collection/${item.convertedCafeId}`)}
          className="text-sm font-medium text-accent-deep hover:text-accent shrink-0"
        >
          View →
        </button>
      </Card>
    );
  }

  return (
    <Card className="p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl font-medium text-ink">{item.name}</h3>
        <Badge tone={PRIORITY_TONE[item.priority]}>{PRIORITY_LABEL[item.priority]}</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
        <Badge tone={item.status === 'planned' ? 'gold' : 'neutral'}>
          {item.status === 'planned' ? 'Planned' : 'Idea'}
        </Badge>
        {item.estimatedBudget != null && <span>~{formatCurrency(item.estimatedBudget)}</span>}
        {item.googleMapsUrl && (
          <a
            href={item.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent-deep hover:text-accent"
          >
            Maps →
          </a>
        )}
      </div>

      {item.notes && <p className="text-sm text-ink-soft leading-relaxed">{item.notes}</p>}

      {convertError && (
        <p role="alert" className="text-sm text-red-500">
          {convertError}
        </p>
      )}

      <div className="flex items-center gap-4 pt-2 border-t border-hairline mt-1">
        {item.status === 'idea' && (
          <button
            type="button"
            onClick={handleMarkPlanned}
            className="text-sm font-medium text-accent-deep hover:text-accent"
          >
            Mark as Planned
          </button>
        )}
        <Button size="md" variant="secondary" onClick={handleConvert} disabled={converting}>
          {converting ? 'Adding…' : 'Mark as Visited'}
        </Button>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-sm font-medium text-ink-soft hover:text-ink"
        >
          Edit
        </button>

        {confirmingDelete ? (
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="text-sm font-medium text-red-500 hover:text-red-600"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="text-sm text-ink-soft hover:text-ink"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="text-sm font-medium text-ink-soft hover:text-red-500 ml-auto"
          >
            Delete
          </button>
        )}
      </div>
    </Card>
  );
}
