import { supabase } from '../lib/supabase/client';
import { createCafe } from './cafeService';
import { EMPTY_CAFE_INPUT } from '../types/cafe';
import type { WishlistCafe, WishlistInput, WishlistPriority, WishlistStatus } from '../types/wishlist';

/** DB enum uses underscores; the app uses hyphens for readability in the UI. */
type DbPriority = 'must_visit' | 'interested' | 'someday';

const PRIORITY_TO_DB: Record<WishlistPriority, DbPriority> = {
  'must-visit': 'must_visit',
  interested: 'interested',
  someday: 'someday',
};

const PRIORITY_FROM_DB: Record<DbPriority, WishlistPriority> = {
  must_visit: 'must-visit',
  interested: 'interested',
  someday: 'someday',
};

interface WishlistRow {
  id: string;
  created_by: string;
  name: string;
  priority: DbPriority;
  status: WishlistStatus;
  notes: string | null;
  estimated_budget: number | null;
  google_maps_url: string | null;
  converted_cafe_id: string | null;
  created_at: string;
  updated_at: string;
}

function toDomain(row: WishlistRow): WishlistCafe {
  return {
    id: row.id,
    createdBy: row.created_by,
    name: row.name,
    priority: PRIORITY_FROM_DB[row.priority],
    status: row.status,
    notes: row.notes,
    estimatedBudget: row.estimated_budget,
    googleMapsUrl: row.google_maps_url,
    convertedCafeId: row.converted_cafe_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(input: WishlistInput) {
  return {
    name: input.name,
    priority: PRIORITY_TO_DB[input.priority],
    status: input.status,
    notes: input.notes || null,
    estimated_budget: input.estimatedBudget,
    google_maps_url: input.googleMapsUrl || null,
  };
}

export async function listWishlist(): Promise<WishlistCafe[]> {
  const { data, error } = await supabase
    .from('wishlist_cafes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as WishlistRow[]).map(toDomain);
}

export async function createWishlistItem(input: WishlistInput, userId: string): Promise<WishlistCafe> {
  const { data, error } = await supabase
    .from('wishlist_cafes')
    .insert({ ...toRow(input), created_by: userId })
    .select('*')
    .single();

  if (error) throw error;
  return toDomain(data as WishlistRow);
}

export async function updateWishlistItem(id: string, input: WishlistInput): Promise<WishlistCafe> {
  const { data, error } = await supabase
    .from('wishlist_cafes')
    .update(toRow(input))
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return toDomain(data as WishlistRow);
}

export async function deleteWishlistItem(id: string): Promise<void> {
  const { error } = await supabase.from('wishlist_cafes').delete().eq('id', id);
  if (error) throw error;
}

export async function setWishlistStatus(id: string, status: WishlistStatus): Promise<void> {
  const { error } = await supabase.from('wishlist_cafes').update({ status }).eq('id', id);
  if (error) throw error;
}

/**
 * Converts a wishlist entry into a real Cafe Collection entry, pre-filled
 * with whatever the wishlist already knew (name, maps link, budget as a
 * starting "total spent" guess) — then marks the wishlist item as visited
 * and links the two rows together.
 */
export async function convertWishlistItemToCafe(item: WishlistCafe, userId: string) {
  const cafe = await createCafe(
    {
      ...EMPTY_CAFE_INPUT,
      name: item.name,
      googleMapsUrl: item.googleMapsUrl ?? '',
      totalSpent: item.estimatedBudget,
    },
    userId
  );

  const { error } = await supabase
    .from('wishlist_cafes')
    .update({ status: 'visited', converted_cafe_id: cafe.id })
    .eq('id', item.id);

  if (error) throw error;

  return cafe;
}
