import React, { useState } from 'react'; // Importa React y el hook useState para manejar estados locales
import './Login.css'; // Importa los estilos CSS para el componente Login
import { supabase } from '../lib/supabaseClient'; //Integramos supabase al Login

// Componente funcional Login
function Login() {
  // Define los estados locales para email y password usando useState
  const [email, setEmail] = useState(''); // Estado para el email del usuario
  const [password, setPassword] = useState(''); // Estado para la contraseña del usuario
  const [loading, setLoading] = useState(false); // 
  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => { // <- Agregaste 'async' aquí
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)

    // --- NUEVA LÓGICA DE SUPABASE ---
    console.log('Intentando login con:', email);

    // Intento de inicio de sesión con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert('Error al iniciar sesión: ' + error.message);
      console.error("Error de Supabase:", error);
    } else {
      alert('¡Éxito! Bienvenido ' + data.user.email);
      console.log("Usuario logueado:", data);
      // window.location.href = "/admin"; // (Para después)
    }
    // --- FIN DE LA NUEVA LÓGICA ---
  };

  // Renderiza el formulario de login
  return (
    <div className="login-container">{/* Contenedor principal del login */}
      <div className="login-card">{/* Tarjeta visual del login */}
        <div className="login-header">{/* Encabezado del login */}
          <h1>Inventario Forestal Nacional</h1>
          <p>Sistema de gestión forestal sostenible</p>
        </div>

        {/* Formulario de login */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">{/* Grupo para el input de usuario */}
            <label>🌳 Usuario:</label>
            <input
              type="email" // Campo de tipo email
              value={email} // Valor actual del estado email
              onChange={(e) => setEmail(e.target.value)} // Actualiza el estado email al escribir
              placeholder="usuario@forestal.com" // Texto de ayuda
              required // Campo obligatorio
            />
          </div>

          <div className="input-group">{/* Grupo para el input de contraseña */}
            <label>🔑 Contraseña:</label>
            <input
              type="password" // Campo de tipo contraseña
              value={password} // Valor actual del estado password
              onChange={(e) => setPassword(e.target.value)} // Actualiza el estado password al escribir
              placeholder="••••••••" // Texto de ayuda
              required // Campo obligatorio
            />
          </div>

          {/* Botón para enviar el formulario */}
          <button type="submit" className="login-btn" disabled={loading}> {/* se deshabilita mientras carga*/}
            {loading ? '🔄 Conectando...' : '🍃 Ingresar al Sistema'} {/*  Cambia el texto*/}
          </button>
        </form>

        {/* Pie de página del login */}
        <div className="login-footer">
          <p>Ministerio del Ambiente • Sistema Nacional Forestal</p>
          <p>© 2024 Todos los derechos reservados</p> {/* Aviso de derechos reservados */}
        </div>
      </div>
    </div>
  );
}

// Exporta el componente Login para que pueda ser usado en otras partes de la aplicación
export default Login;