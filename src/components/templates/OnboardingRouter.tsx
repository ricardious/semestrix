/**
 * Onboarding Router
 *
 * Smart component that routes users to the correct onboarding step
 * based on their profile status.
 */
import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useProfileStatus } from "@services/profiles/queries";
import RocketLoader from "@components/atoms/RocketLoader";

export function OnboardingRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: status, isLoading } = useProfileStatus();

  useEffect(() => {
    if (isLoading || !status) return;

    const currentPath = location.pathname;
    const maxStep = status.onboarding_step;

    // 1. If already finished, always go to dashboard
    if (maxStep >= 3) {
      if (!currentPath.startsWith("/dashboard")) {
        navigate("/dashboard", { replace: true });
      }
      return;
    }

    // 2. Map current URL to step number
    let requestedStep = 0; // Default /onboarding
    if (currentPath.endsWith("/history")) requestedStep = 1;
    else if (currentPath.endsWith("/complete")) requestedStep = 2;

    // 3. Prevent jumping ahead (future steps)
    // You can only access pages <= your current maxStep
    if (requestedStep > maxStep) {
      // Redirect to the furthest allow step
      let targetPath = "/onboarding";
      if (maxStep === 1) targetPath = "/onboarding/history";
      else if (maxStep === 2) targetPath = "/onboarding/complete";
      
      navigate(targetPath, { replace: true });
    }
    
    // 4. Backward navigation (requestedStep <= maxStep) is allowed
    // No else block needed
  }, [status, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return <RocketLoader />;
  }

  return <Outlet />;
}
