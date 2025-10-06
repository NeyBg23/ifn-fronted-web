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

      try {
        // 3. Validar token contra el backend autenVerifi
        const res = await fetch("https://brigada-informe-ifn.vercel.app/api/brigadas", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedSession.access_token}`,
          },
          credentials: "include", // opcional si tu backend lo requiere
        });

        const data = await res.json();
        console.log("Respuesta validación token:", data);

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

    checkSession();
  }, []);

  // 4. Mientras valida → mostrar un mensaje de carga
  if (isValid === null) {
    return <div>🔄 Validando sesión...</div>;
  }

  // 5. Si no es válido → redirigir al login
  if (!isValid) {
    alert("Sesión inválida o expirada. Por favor, inicia sesión nuevamente.");
    return <Navigate to="/" replace />;
  }

  // 6. Si es válido → renderizar el contenido protegido
  return children;
}

export default ProtectedRoute;
