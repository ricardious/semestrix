/**
 * PostAuthRedirect Component
 *
 * Automatically redirects authenticated users based on their onboarding status.
 * This is the SOURCE OF TRUTH for post-login redirects.
 *
 * Behavior:
 * - SignedIn + no profile OR step < 3 => /onboarding
 * - SignedIn + step === 3 => /dashboard
 * - SignedOut => no redirect (stays on current page)
 */
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNeonAuth } from "@lib/hooks/useNeonAuth";
import { useProfileStatus } from "@services/profiles/queries";
import RocketLoader from "@atoms/RocketLoader";

export function PostAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: authLoading } = useNeonAuth();
  const { data: status, isLoading: profileLoading } = useProfileStatus();

  useEffect(() => {
    // Wait for both auth and profile data
    if (authLoading || !user) return;
    if (profileLoading) return;

    // Don't redirect if already on target pages
    const currentPath = location.pathname;
    if (
      currentPath.startsWith("/onboarding") ||
      currentPath.startsWith("/dashboard")
    ) {
      return;
    }

    // Determine redirect based on onboarding status
    if (!status || !status.has_profile || status.onboarding_step < 3) {
      console.log("[PostAuthRedirect] Redirecting to /onboarding");
      navigate("/onboarding", { replace: true });
    } else if (status.onboarding_step === 3) {
      console.log("[PostAuthRedirect] Redirecting to /dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [user, status, authLoading, profileLoading, navigate, location.pathname]);

  // Show loader while checking auth and profile for redirect
  if (user && profileLoading && location.pathname === "/") {
    return <RocketLoader />;
  }

  return null; // This component doesn't render anything
}
