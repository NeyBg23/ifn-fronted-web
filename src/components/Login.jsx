// 🎒 Importamos las herramientas que usaremos
import { useState } from "react"; // 🧠 Para manejar los datos que cambian (como email o password)
import "../styles/Login.css"; // 🎨 Estilos de la página
import { useNavigate } from "react-router-dom"; // 🧭 Para movernos entre páginas (ej: ir al panel admin)

/**
 * 📘 Este componente se encarga del LOGIN (inicio de sesión)
 * 
 * 🌍 En modo desarrollo (local):
 *   - Se conecta con el backend que corre en tu PC (http://localhost:4000)
 *   - Esto se hace usando el "proxy" configurado en vite.config.js
 * 
 * ☁️ En modo producción (Vercel):
 *   - Se conecta al backend desplegado en la nube (VITE_API_URL)
 *   - Esa URL se guarda como variable de entorno en Vercel
 */

function Login() {
  const navigate = useNavigate(); // 🔄 Permite movernos a otra ruta (ej: /admin)

  // 🧱 Aquí guardamos los datos que el usuario escribe
  const [email, setEmail] = useState(""); // correo del usuario
  const [password, setPassword] = useState(""); // contraseña
  const [loading, setLoading] = useState(false); // para mostrar "cargando..." mientras se conecta

  /**
   * 📦 Aquí decidimos a qué URL del backend conectar
   * 
   * Si estamos en desarrollo → usamos "/api"
   * (el proxy en vite.config.js redirige a http://localhost:4000)
   * 
   * Si estamos en producción → usamos la variable VITE_API_URL
   * (que debe estar configurada en Vercel)
   */
  const API_URL =
    import.meta.env.MODE === "development"
      ? "/api" // para cuando trabajas localmente
      : import.meta.env.VITE_API_URL || "/api"; // para cuando está en Vercel

  /**
   * 🧩 Esta función se ejecuta cuando el usuario presiona "Ingresar al Sistema"
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // 🚫 Evita que el navegador recargue la página
    setLoading(true); // ⏳ Cambiamos el estado a "cargando"

    console.log("API_URL ->", API_URL); // 🕵️‍♀️ Verificamos la URL base del backend
    console.log("Login endpoint ->", `${API_URL}/auth/login`); // 🕵️‍♀️ Endpoint final

    try {
      // 🚀 Mandamos los datos al backend
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST", // usamos el método POST para enviar datos
        headers: { "Content-Type": "application/json" }, // decimos que mandamos JSON
        body: JSON.stringify({
          email: email.trim().toLowerCase(), // quitamos espacios y pasamos a minúsculas
          password, // enviamos la contraseña
        }),
      });

      // 🔍 Esperamos la respuesta del backend
      const data = await res.json(); // convertimos la respuesta a JSON
      console.log(data); // 🕵️‍♀️ Vemos qué nos responde el backend
      setLoading(false); // dejamos de mostrar "cargando..."

      // ⚠️ Si algo sale mal (usuario o contraseña incorrectos)
      if (!res.ok) return alert(data.error || "Credenciales inválidas ❌");

      /**
       * 💾 Si todo sale bien:
       * guardamos la sesión en el navegador (localStorage)
       * para que el usuario no tenga que volver a iniciar sesión
       */
      localStorage.setItem("session", JSON.stringify(data.session));

      alert("¡Éxito! Bienvenido 🌳"); // mensaje bonito 😄
      navigate("/admin"); // 🚪 Vamos al panel administrativo
    } catch (error) {
      // 🧨 Si el servidor no responde o hay error de red
      console.error("Error de conexión:", error);
      setLoading(false);
      alert("Error de conexión con el servidor ❌");
    }
  };

  /**
   * 🖥️ Aquí está la parte visual (lo que se ve en la pantalla)
   */
  return (
    <div className="todo">
      {/* 🌳 Ícono de árbol en el título */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      ></link>

      {/* 🏛️ Encabezado del sistema */}
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

      {/* 🪟 Tarjeta del login */}
      <div className="login">
        <div className="login-container">
          <div className="login-card">
            {/* 🧱 Encabezado de la tarjeta */}
            <div className="login-header">
              <h1>Inventario Forestal Nacional</h1>
              <p>Sistema de gestión forestal sostenible</p>
            </div>

            {/* 📝 Formulario del login */}
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

              {/* 🔘 Botón de enviar */}
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
