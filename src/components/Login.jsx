import { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // ← Importar useAuth

function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth(); // ← Usar el hook

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Llamar al login del contexto
    const resultado = await login(email, password);

    if (resultado.success) {

      if (resultado.usuario.rol === 'admin') navigate("/admin");
      else navigate("/user");

    } else {
      setLocalError(resultado.message);
    }
  };

  return (
    <div className="todo">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      ></link>

      <header>
        <div className="container header-content">
          <div className="logo">
            <i className="fas fa-tree"></i>
            <h1>Inventario Forestal Nacional</h1>
          </div>
          <div className="header-info">
            <p>República de Colombia</p>
          </div>
        </div>
      </header>

      <div className="login">
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

              {/* Mostrar errores */}
              {(localError || error) && (
                <p style={{ color: "red", marginBottom: "10px" }}>
                  ❌ {localError || error}
                </p>
              )}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "🔄 Conectando..." : "🍃 Ingresar al Sistema"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;