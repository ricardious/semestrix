import { Navigate, Outlet } from "react-router-dom";
import { useNeonAuth } from "@lib/hooks/useNeonAuth";

interface ProtectedRouteProps {
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectTo = "/",
}) => {
  const { user, isLoading } = useNeonAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="rounded-full h-20 w-20 bg-primary animate-ping"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />; // Render the child routes if authenticated
};

export default ProtectedRoute;
