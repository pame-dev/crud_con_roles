// src/components/RequireRoleLocal.jsx
import { Navigate } from "react-router-dom";
import { getCurrentUserRole } from "../hooks/auth";

export default function RequireRoleLocal({ roles = [], children }) {
  const role = getCurrentUserRole();

  // No logueado
  if (!role) return <Navigate to="/login" replace />;

  // Sin restricción -> pasa
  if (!roles.length) return children;

  // Restringido
  const allowed = roles.includes(role);
  if (!allowed) return <Navigate to="/" replace />;

  return children;
}
