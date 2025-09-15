// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

// Componente que protege rutas privadas
function ProtectedRoute({ children }) {
  // Revisamos si existe una sesión guardada en localStorage
  const session = localStorage.getItem("session");

  // Si NO hay sesión → redirigir al login
  if (!session) {
    return <Navigate to="/login" />;
  }

  // Si hay sesión → mostrar el contenido (children = la página protegida)
  return children;
}

export default ProtectedRoute;
