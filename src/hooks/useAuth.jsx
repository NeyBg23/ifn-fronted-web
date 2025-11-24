import { useState, useEffect, useContext, createContext, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:4000';
const BRIGADA_SERVICE_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {

  // Estado inicial tomando lo que haya quedado guardado en localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Recupera el usuario guardado para mantener la sesión tras refrescar
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  // Obtiene el rol según el usuario cargado
  const [rol, setRol] = useState(() => usuario ? usuario.rol || null : null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Limpia toda la información de autenticación (logout o token inválido)
  const clearAuth = () => {
    setToken(null);
    setUsuario(null);
    setRol(null);
    setError(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };


  useEffect(() => {
    // Cuando la app carga o el token cambia, intenta obtener el usuario
    const checkAuthAndFetchUser = async () => {
      if (token) {
        try {
          // Llama al backend que devuelve la info del usuario según el token
          const brigResponse = await axios.get(
            `${BRIGADA_SERVICE_URL}/api/usuarios/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          // A veces viene en data.usuario, otras veces directamente en data
          const usuarioBrigada = brigResponse.data.usuario || brigResponse.data;

          setUsuario(usuarioBrigada);
          setRol(usuarioBrigada.rol || null);

          // Mantiene sincronizado el usuario en localStorage
          localStorage.setItem("usuario", JSON.stringify(usuarioBrigada));

        } catch (err) {
          // Si el token ya no sirve, simplemente se limpia la sesión
          clearAuth();
        }
      } else {
        clearAuth();
      }

      setLoading(false);
    };

    checkAuthAndFetchUser();
  }, [token]); // Se vuelve a ejecutar si el token cambia


  // Proceso de inicio de sesión
  const login = async (email, password, hcaptchaToken) => {
    try {
      setLoading(true);
      setError(null);

      // Aquí no debe enviarse Authorization porque aún no hay token
      const response = await axios.post(
        `${AUTH_SERVICE_URL}/login`,
        {
          email,
          password,
          hcaptchaToken
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const nuevoToken = response.data.session.access_token;
      if (!nuevoToken) throw new Error('No se recibió token del Auth Service');

      // Luego de obtener el token, trae el usuario desde el backend de brigadas
      const brigResponse = await axios.get(
        `https://fast-api-brigada.vercel.app/usuarios/${response.data.user.email}`, 
        {
          headers: {
            Authorization: `Bearer ${nuevoToken}`
          }
        }
      );

      const usuarioBrigada = brigResponse.data;

      // Guarda todo tanto en el estado de React como en localStorage
      setToken(nuevoToken);
      setUsuario(usuarioBrigada);
      setRol(usuarioBrigada.rol || null);

      localStorage.setItem("token", nuevoToken);
      localStorage.setItem("usuario", JSON.stringify(usuarioBrigada));

      return { success: true, message: 'Login exitoso', usuario: usuarioBrigada };

    } catch (err) {
      // Intenta obtener un mensaje más claro del backend
      const mensaje = err.response?.data?.detail || err.response?.data?.error || err.message || 'Error desconocido al iniciar sesión';

      setError(mensaje);
      clearAuth();
      return { success: false, message: mensaje };

    } finally {
      setLoading(false);
    }
  };


  // Cierra sesión limpiando todo
  const logout = () => {
    clearAuth();
    console.log('Usuario desconectado');
  };


  // Valida si el usuario tiene un rol específico (uno o varios)
  const tieneRol = (rolRequerido) => {
    if (typeof rolRequerido === 'string') return rol === rolRequerido;
    return Array.isArray(rolRequerido) && rolRequerido.includes(rol);
  };


  // Se agrupa todo lo que expondrá el contexto de autenticación
  // Para evitar renders innecesarios se envuelve en useMemo
  const value = useMemo(() => ({
    usuario,
    rol,
    token,
    loading,
    error,
    login,
    logout,
    tieneRol,
    autenticado: !!usuario,
    estaAutenticado: !!token
  }), [usuario, rol, token, loading, error]);


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


// Hook para poder usar el contexto desde cualquier parte de la app
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
