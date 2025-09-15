// services/auth/queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { signInWithGoogle, signInWithGithub, logout, AuthUser } from './api';
import { authKeys } from './keys';

// Hook para el estado actual del usuario
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: () => {
      // Esta función se ejecutará cuando se inicialice el componente
      // El estado real del usuario se manejará con el hook useAuthState
      return null;
    },
    staleTime: Infinity, // Los datos no se vuelven obsoletos
  });
};

// Mutación para login con Google
export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: signInWithGoogle,
    onSuccess: (user: AuthUser) => {
      // Actualiza el cache con el usuario logueado
      queryClient.setQueryData(authKeys.currentUser, user);
    },
    onError: (error) => {
      console.error('Google login failed:', error);
    },
  });
};

// Mutación para login con GitHub
export const useGithubLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: signInWithGithub,
    onSuccess: (user: AuthUser) => {
      // Actualiza el cache con el usuario logueado
      queryClient.setQueryData(authKeys.currentUser, user);
    },
    onError: (error) => {
      console.error('GitHub login failed:', error);
    },
  });
};

// Mutación para logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Limpia el cache del usuario
      queryClient.setQueryData(authKeys.currentUser, null);
      // Opcionalmente, invalida todas las queries relacionadas con auth
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });
};