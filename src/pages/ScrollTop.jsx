// Importa el hook useEffect para manejar efectos secundarios en React
import { useEffect } from "react";
// Importa el hook useLocation para saber la ruta actual en la app (React Router)
import { useLocation } from "react-router-dom";

// Componente funcional que se encarga de hacer scroll al inicio cada vez que cambia la ruta
export default function ScrollToTop() {
  // Extrae el "pathname" (la ruta actual) del objeto location
  const { pathname } = useLocation();

  // Efecto: cada vez que cambia el pathname, sube la ventana al inicio de la página
  useEffect(() => {
    // Realiza el scroll al inicio con animación suave
    window.scrollTo({ top: 0, behavior: "smooth" }); // 🔹 sube al inicio con animación
  }, [pathname]); // Se ejecuta cada vez que cambia la ruta

  // Como este componente solo causa un efecto, no renderiza nada (devuelve null)
  return null;
}