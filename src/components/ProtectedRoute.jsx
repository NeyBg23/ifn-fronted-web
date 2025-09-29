// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute:
 * Protege rutas privadas validando tanto en el frontend (localStorage)
 * como en el backend (autenVerifi con /api/auth/perfil).
 * 
 * 📌 Flujo:
 * 1. Revisa si hay sesión en localStorage.
 * 2. Si no hay → redirige al login.
 * 3. Si hay sesión → hace un fetch a /api/auth/perfil para validar el token.
 * 4. Si el token es válido → renderiza children.
 * 5. Si no → borra la sesión y redirige al login.
 */

function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null); // null = cargando, true = válido, false = inválido

  useEffect(() => {
    const checkSession = async () => {
      const session = localStorage.getItem("session");
      
      // 1. Si no hay sesión en localStorage → inválido
      if (!session) return setIsValid(false);
      const parsedSession = JSON.parse(session);

      // 2. Si no existe access_token → inválido
      if (!parsedSession?.access_token) return setIsValid(false);

      console.log(parsedSession.access_token);

      try {
        // 3. Validar token contra el backend autenVerifi
        const res = await fetch("/api/auth/perfil", {
          headers: {
            Authorization: `Bearer ${parsedSession.access_token}`,
          },
        });
        
        if (!res.ok) {
          // Token inválido o expirado
          localStorage.removeItem("session"); // limpiar sesión corrupta
          setIsValid(false);
        } else setIsValid(true); // Token valido

      } catch (error) {
        console.error("Error validando token:", error);
        setIsValid(false);
      }
    };
    console.log("asd");
    checkSession();
  }, []);

  // 4. Mientras valida → mostrar un mensaje de carga
  if (isValid === null) {
    return <div>🔄 Validando sesión...</div>;
  }

  console.log(isValid);

  // 5. Si no es válido → redirigir al login
  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  // 6. Si es válido → renderizar el contenido protegido
  return children;
}

export default ProtectedRoute;
