import { Outlet } from "react-router-dom";

const OnboardingLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OnboardingLayout;
