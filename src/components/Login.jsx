// src/pages/Login.jsx
import React, { useState } from 'react';
import '../styles/Login.css';
import { supabaseAuten } from '../lib/supabaseClient'; // 👈 usamos supabaseAuten
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabaseAuten.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (error) {
      alert("Credenciales inválidas ❌");
      return;
    }

    // Guardamos el token en localStorage
    localStorage.setItem("session", JSON.stringify(data.session));
    alert("¡Éxito! Bienvenido 🌳");
    navigate("/home");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Inventario Forestal Nacional</h1>
          <p>Sistema de gestión forestal sostenible</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>🌳 Usuario:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@forestal.com"
              required
            />
          </div>

          <div className="input-group">
            <label>🔑 Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••••••••••"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? '🔄 Conectando...' : '🍃 Ingresar al Sistema'}
          </button>
        </form>

        <div className="login-footer">
          <p>Ministerio del Ambiente • Sistema Nacional Forestal</p>
          <p>© 2024 Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
