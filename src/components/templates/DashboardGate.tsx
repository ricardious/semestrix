/**
 * Dashboard Gate Template
 *
 * Ensures user has completed onboarding (step >= 3) before accessing dashboard.
 * Note: AuthGuard already handles authentication check, so we only verify onboarding status.
 * Uses useMyProfile to prefetch profile data for DashboardPage (shared cache).
 *
 * Flow:
 * - No profile or step < 3 => redirect to /onboarding
 * - Step >= 3 => allow access to dashboard
 */
import { Navigate, Outlet } from "react-router-dom";
import { useMyProfile } from "@services/profiles/queries";
import RocketLoader from "@atoms/RocketLoader";

export function DashboardGate() {
  const { data: profile, isLoading } = useMyProfile();

  // Show loader while fetching profile
  if (isLoading) {
    return <RocketLoader />;
  }

  // If no profile or onboarding not complete, redirect to onboarding
  if (!profile || profile.onboarding_step < 3) {
    return <Navigate to="/onboarding" replace />;
  }

  // Allow access to dashboard (profile is now cached for DashboardPage)
  return <Outlet />;
}
