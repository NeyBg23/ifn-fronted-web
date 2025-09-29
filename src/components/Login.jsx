// src/pages/Login.jsx
import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

/**
 * Login.jsx
 * - En development usa el proxy: /api (configurado en vite.config.js)
 * - En producción usa la variable de entorno VITE_API_URL (defínela en Vercel)
 */

function Login() {
  const navigate = useNavigate();

  // estados
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Determinar la URL base de la API según el entorno
  const API_URL =
    import.meta.env.MODE === "development"
      ? "/api" // proxy local que redirige a http://localhost:4000
      : import.meta.env.VITE_API_URL || "/api"; // Vercel: debe estar definida en Environment Variables

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("API_URL ->", API_URL);  // Verificar qué URL se está usando
    console.log("Login endpoint ->", `${API_URL}/auth/login`);  // Verificar el endpoint completo



    try {
      // Llamada al backend (dev => /api/auth/login ; prod => https://mi-backend.vercel.app/auth/login)
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      // parsear respuesta JSON (puede contener error o session)
      const data = await res.json();
      setLoading(false);

      // Mostrar el mensaje de error que venga del backend si existe
      if (!res.ok) return alert(data.error || "Credenciales inválidas ❌");

      // Guardar sesión completa en localStorage (incluye access_token, refresh_token, user)
      // localStorage es solo para la sesión del navegador (no expone claves del backend)
      localStorage.setItem("session", JSON.stringify(data.session));

      // Opcional: guardar por separado el access_token si lo necesitas
      // localStorage.setItem("access_token", data.session.access_token);

      alert("¡Éxito! Bienvenido 🌳");
      navigate("/home");
    } catch (error) {
      console.error("Error de conexión:", error);
      setLoading(false);
      alert("Error de conexión con el servidor ❌");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Cabecera */}
        <div className="login-header">
          <h1>Inventario Forestal Nacional</h1>
          <p>Sistema de gestión forestal sostenible</p>
        </div>

        {/* Formulario */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>🌳 Usuario:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@forestal.com"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>🔑 Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "🔄 Conectando..." : "🍃 Ingresar al Sistema"}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>Ministerio del Ambiente • Sistema Nacional Forestal</p>
          <p>© 2024 Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
