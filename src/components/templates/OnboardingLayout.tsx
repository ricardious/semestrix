import { Outlet } from "react-router-dom";

const OnboardingLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-100 dark:bg-base-dark">
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default OnboardingLayout;
