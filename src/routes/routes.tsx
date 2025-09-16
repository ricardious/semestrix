import { createBrowserRouter, RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import routesConstants from "@lib/constants/routeConstants";

// Layouts
import LayoutContainer from "@components/templates/LayoutContainer";
import LegalLayout from "@components/templates/LegalLayout";
import ProtectedRoute from "@components/templates/ProtectedRoute";
import OnboardingLayout from "@components/templates/OnboardingLayout";

// Components
import PingLoader from "@components/atoms/PingLoader";

// Pages
const Home = lazy(() => import("@pages/HomePage"));
const PrivacyPage = lazy(() => import("@pages/PrivacyPage"));
const TermsPage = lazy(() => import("@pages/TermsPage"));
const OnboardingPage = lazy(() => import("@pages/OnboardingPage"));
const DashboardPage = lazy(() => import("@pages/DashboardPage"));
const ErrorPage = lazy(() => import("@pages/ErrorPage"));

const routes: RouteObject[] = [
  {
    path: routesConstants.ROOT,
    element: <LayoutContainer />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PingLoader />}>
            <Home />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: routesConstants.LEGAL,
    element: <LegalLayout />,
    children: [
      {
        path: routesConstants.PRIVACY,
        element: (
          <Suspense fallback={<PingLoader />}>
            <PrivacyPage />
          </Suspense>
        ),
      },
      {
        path: routesConstants.TERMS,
        element: (
          <Suspense fallback={<PingLoader />}>
            <TermsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: routesConstants.ONBOARDING,
        element: <OnboardingLayout />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PingLoader />}>
                <OnboardingPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: routesConstants.DASHBOARD,
        element: (
          <Suspense fallback={<PingLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
    ],
  },
];

export const router = createBrowserRouter(routes);

export default routes;
