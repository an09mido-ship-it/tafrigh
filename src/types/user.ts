export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'blocked';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLoginAt: string;
  blockedAt?: string | null;
  blockedReason?: string | null;
}
