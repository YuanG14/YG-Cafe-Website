import { supabase } from '../lib/supabase/client';
import { getCafePhotoUrl, uploadCafePhoto, deleteCafePhotoFile } from '../lib/supabase/storage';
import type { Cafe, CafeInput, CafePhoto } from '../types/cafe';

/** Raw shape of a row in `public.cafes`. Never leaves this file. */
interface CafeRow {
  id: string;
  created_by: string;
  name: string;
  address: string | null;
  google_maps_url: string | null;
  date_visited: string;
  is_favorite: boolean;
  tags: string[];
  journal_entry: string | null;
  drinks_ordered: string[];
  food_ordered: string[];
  total_spent: number | null;
  rating_overall: number;
  rating_coffee: number;
  rating_food: number;
  rating_ambiance: number;
  rating_service: number;
  rating_value: number;
  created_at: string;
  updated_at: string;
  cafe_photos?: CafePhotoRow[];
}

interface CafePhotoRow {
  id: string;
  cafe_id: string;
  storage_path: string;
}

const CAFE_SELECT = '*, cafe_photos(id, cafe_id, storage_path)';

function toDomainPhoto(row: CafePhotoRow): CafePhoto {
  return {
    id: row.id,
    cafeId: row.cafe_id,
    storagePath: row.storage_path,
    url: getCafePhotoUrl(row.storage_path),
  };
}

function toDomainCafe(row: CafeRow): Cafe {
  return {
    id: row.id,
    createdBy: row.created_by,
    name: row.name,
    address: row.address,
    googleMapsUrl: row.google_maps_url,
    dateVisited: row.date_visited,
    isFavorite: row.is_favorite,
    tags: row.tags ?? [],
    journalEntry: row.journal_entry,
    drinksOrdered: row.drinks_ordered ?? [],
    foodOrdered: row.food_ordered ?? [],
    totalSpent: row.total_spent,
    ratings: {
      overall: row.rating_overall,
      coffee: row.rating_coffee,
      food: row.rating_food,
      ambiance: row.rating_ambiance,
      service: row.rating_service,
      value: row.rating_value,
    },
    photos: (row.cafe_photos ?? []).map(toDomainPhoto),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Maps a CafeInput (camelCase, app-facing) to the snake_case columns Supabase expects. */
function toRow(input: CafeInput) {
  return {
    name: input.name,
    address: input.address || null,
    google_maps_url: input.googleMapsUrl || null,
    date_visited: input.dateVisited,
    is_favorite: input.isFavorite,
    tags: input.tags,
    journal_entry: input.journalEntry || null,
    drinks_ordered: input.drinksOrdered,
    food_ordered: input.foodOrdered,
    total_spent: input.totalSpent,
    rating_overall: input.ratings.overall,
    rating_coffee: input.ratings.coffee,
    rating_food: input.ratings.food,
    rating_ambiance: input.ratings.ambiance,
    rating_service: input.ratings.service,
    rating_value: input.ratings.value,
  };
}

export async function listCafes(): Promise<Cafe[]> {
  const { data, error } = await supabase
    .from('cafes')
    .select(CAFE_SELECT)
    .order('date_visited', { ascending: false });

  if (error) throw error;
  return (data as CafeRow[]).map(toDomainCafe);
}

export async function getCafe(id: string): Promise<Cafe> {
  const { data, error } = await supabase.from('cafes').select(CAFE_SELECT).eq('id', id).single();

  if (error) throw error;
  return toDomainCafe(data as CafeRow);
}

export async function createCafe(input: CafeInput, userId: string): Promise<Cafe> {
  const { data, error } = await supabase
    .from('cafes')
    .insert({ ...toRow(input), created_by: userId })
    .select(CAFE_SELECT)
    .single();

  if (error) throw error;
  return toDomainCafe(data as CafeRow);
}

export async function updateCafe(id: string, input: CafeInput): Promise<Cafe> {
  const { data, error } = await supabase
    .from('cafes')
    .update(toRow(input))
    .eq('id', id)
    .select(CAFE_SELECT)
    .single();

  if (error) throw error;
  return toDomainCafe(data as CafeRow);
}

export async function deleteCafe(id: string): Promise<void> {
  // Photo files in storage are removed first — DB rows cascade automatically,
  // but the actual files in the bucket would otherwise be orphaned forever.
  const { data: photos, error: photosError } = await supabase
    .from('cafe_photos')
    .select('storage_path')
    .eq('cafe_id', id);

  if (photosError) throw photosError;
  await Promise.all((photos ?? []).map((p) => deleteCafePhotoFile(p.storage_path)));

  const { error } = await supabase.from('cafes').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
  const { error } = await supabase.from('cafes').update({ is_favorite: isFavorite }).eq('id', id);
  if (error) throw error;
}

export async function addCafePhoto(cafeId: string, file: File): Promise<CafePhoto> {
  const storagePath = await uploadCafePhoto(cafeId, file);

  const { data, error } = await supabase
    .from('cafe_photos')
    .insert({ cafe_id: cafeId, storage_path: storagePath })
    .select('id, cafe_id, storage_path')
    .single();

  if (error) {
    // Clean up the uploaded file if the DB insert failed, so it isn't orphaned.
    await deleteCafePhotoFile(storagePath);
    throw error;
  }

  return toDomainPhoto(data as CafePhotoRow);
}

export async function deleteCafePhoto(photo: CafePhoto): Promise<void> {
  const { error } = await supabase.from('cafe_photos').delete().eq('id', photo.id);
  if (error) throw error;
  await deleteCafePhotoFile(photo.storagePath);
}
