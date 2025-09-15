// services/auth/keys.ts
export const authKeys = {
  all: ['auth'] as const,
  currentUser: ['auth', 'currentUser'] as const,
  userProfile: (userId: string) => ['auth', 'userProfile', userId] as const,
} as const;