import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { onAuthStateChange, AuthUser } from "../../services/auth/api";
import { authKeys } from "../../services/auth/keys";

export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);

      queryClient.setQueryData(authKeys.currentUser, authUser);
    });

    return () => unsubscribe();
  }, [queryClient]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
};
