/**
 * Onboarding Guard
 *
 * Ensures user has completed onboarding (step 3) before accessing dashboard.
 * For onboarding pages themselves, use OnboardingRouter.
 */
import { Navigate, Outlet } from "react-router-dom";
import { useProfileStatus } from "@services/profiles/queries";
import RocketLoader from "@atoms/RocketLoader";

export function OnboardingGuard() {
  const { data: status, isLoading } = useProfileStatus();

  // Show loading state
  if (isLoading) {
    return <RocketLoader />;
  }

  // If no profile or onboarding not complete, redirect to onboarding
  if (!status || !status.has_profile || status.onboarding_step < 3) {
    return <Navigate to="/onboarding" replace />;
  }

  // Allow access to dashboard
  return <Outlet />;
}
