export type Role = 'admin' | 'member' | 'guest';

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: Role;
}
