import { Navigate } from "react-router-dom";
import { getRole, isAuthenticated } from "../utils/auth";

interface Props {
  children: JSX.Element;
  allowedRoles: ("ADMIN" | "FACULTY")[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  // ❌ Not logged in
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const role = getRole();

  // ❌ Role mismatch
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authorized
  return children;
};

export default ProtectedRoute;
