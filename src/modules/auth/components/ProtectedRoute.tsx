import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthentication } = useAuth();

  if (!isAuthentication) {
    return (
      <>
        <Navigate to="/login" replace />
      </>
    );
  }

  return children;
}
