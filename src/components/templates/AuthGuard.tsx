/**
 * Auth Guard
 * 
 * Protects routes that require authentication.
 * Redirects to home page where user can open auth modal.
 */
import { Navigate, Outlet } from "react-router-dom";
import { useNeonAuth } from "@lib/hooks/useNeonAuth";
import RocketLoader from "@atoms/RocketLoader";

export function AuthGuard() {
  const { user, isLoading } = useNeonAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return <RocketLoader />;
  }

  // Redirect to home if not authenticated (user can open auth modal there)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Render protected routes
  return <Outlet />;
}
