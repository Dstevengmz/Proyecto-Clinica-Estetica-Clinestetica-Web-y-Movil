import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthenticaContext";

  function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/iniciarsesion" replace />;
  }

  // Si no se tiene permisos redirigir a vista de sin acceso
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
export default ProtectedRoute;