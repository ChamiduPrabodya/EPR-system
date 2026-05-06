import { Navigate } from "react-router-dom";
import { appRoutes } from "../../../app/router/routes";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({ children }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to={appRoutes.login} replace />;
  }

  return children;
}
