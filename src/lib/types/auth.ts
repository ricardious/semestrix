// lib/types/auth.ts
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
}

export type AuthProvider = 'google' | 'github';

export interface LoginButtonProps {
  provider: AuthProvider;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}