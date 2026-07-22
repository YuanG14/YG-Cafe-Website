import { supabase } from '../lib/supabase/client';
import type { Profile } from '../types/auth';

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: Profile['role'];
}

function toDomainProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    role: row.role,
  };
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, role')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data ? toDomainProfile(data as ProfileRow) : null;
}
