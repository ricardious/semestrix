import { createBrowserRouter, RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import routesConstants from "@lib/constants/routeConstants";

// Layouts
import LayoutContainer from "@components/templates/LayoutContainer";
import LegalLayout from "@components/templates/LegalLayout";

// Route Guards (Templates)
import { AuthGuard } from "@components/templates/AuthGuard";
import { DashboardGate } from "@components/templates/DashboardGate";
import { OnboardingRouter } from "@components/templates/OnboardingRouter";

// Components
import PingLoader from "@components/atoms/PingLoader";

// Pages
const Home = lazy(() => import("@pages/HomePage"));
const PrivacyPage = lazy(() => import("@pages/PrivacyPage"));
const TermsPage = lazy(() => import("@pages/TermsPage"));
const OnboardingIdentityPage = lazy(
  () => import("@pages/OnboardingIdentityPage")
);
const OnboardingHistoryPage = lazy(
  () => import("@pages/OnboardingHistoryPage")
);
const OnboardingCompletePage = lazy(
  () => import("@pages/OnboardingCompletePage")
);
const DashboardPage = lazy(() => import("@pages/DashboardPage"));
const SchedulePage = lazy(() => import("@pages/SchedulePage"));
const GeneratorPage = lazy(() => import("@pages/GeneratorPage"));
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
    element: <AuthGuard />,
    children: [
      {
        path: routesConstants.ONBOARDING,
        element: <OnboardingRouter />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PingLoader />}>
                <OnboardingIdentityPage />
              </Suspense>
            ),
          },
          {
            path: "history",
            element: (
              <Suspense fallback={<PingLoader />}>
                <OnboardingHistoryPage />
              </Suspense>
            ),
          },
          {
            path: "complete",
            element: (
              <Suspense fallback={<PingLoader />}>
                <OnboardingCompletePage />
              </Suspense>
            ),
          },
        ],
      },
      {
        element: <DashboardGate />,
        children: [
          {
            path: routesConstants.DASHBOARD,
            element: (
              <Suspense fallback={<PingLoader />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: "/horarios",
            element: (
              <Suspense fallback={<PingLoader />}>
                <SchedulePage />
              </Suspense>
            ),
          },
          {
            path: "/generador",
            element: (
              <Suspense fallback={<PingLoader />}>
                <GeneratorPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);

export default routes;
