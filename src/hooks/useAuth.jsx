import { useState, useEffect, useContext, createContext, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:4000';
const BRIGADA_SERVICE_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
  // Inicializa a partir de localStorage para no perder sesión tras recarga
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });
  const [rol, setRol] = useState(() => usuario ? usuario.rol || null : null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Limpia estados y localStorage para logout
  const clearAuth = () => {
    setToken(null);
    setUsuario(null);
    setRol(null);
    setError(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  useEffect(() => {
    // Cuando la app inicia o el token cambia, refresca usuario si hay token
    const checkAuthAndFetchUser = async () => {
      if (token) {
        try {
          const brigResponse = await axios.get(
            `${BRIGADA_SERVICE_URL}/api/usuarios/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          const usuarioBrigada = brigResponse.data.usuario || brigResponse.data;
          setUsuario(usuarioBrigada);
          setRol(usuarioBrigada.rol || null);

          // Actualiza usuario localStorage si cambió (mantén sincronizado)
          localStorage.setItem("usuario", JSON.stringify(usuarioBrigada));
        } catch (err) {
          console.error('Token inválido, expirado o error en el Backend (500). Forzando logout.', err);
          clearAuth();
        }
      } else {
        clearAuth();
      }
      setLoading(false);
    };

    checkAuthAndFetchUser();
  }, [token]); // Se ejecuta cuando el token cambia

  // LOGIN: actualiza estado y persistencia local
  const login = async (email, password, hcaptchaToken) => {
    try {
      setLoading(true);
      setError(null);

      // 🚨 No pongas Authorization en login, aún no tienes token
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

      // Obtiene el usuario desde el backend de brigada
      const brigResponse = await axios.get(
        `${BRIGADA_SERVICE_URL}/api/usuarios/me`, 
        {
          headers: {
            Authorization: `Bearer ${nuevoToken}`
          }
        }
      );
      const usuarioBrigada = brigResponse.data.usuario || brigResponse.data;

      // Guarda en estado React Y localStorage
      setToken(nuevoToken);
      setUsuario(usuarioBrigada);
      setRol(usuarioBrigada.rol || null);

      localStorage.setItem("token", nuevoToken);
      localStorage.setItem("usuario", JSON.stringify(usuarioBrigada));

      return { success: true, message: 'Login exitoso', usuario: usuarioBrigada };
    } catch (err) {
      const mensaje = err.response?.data?.detail || err.response?.data?.error || err.message || 'Error desconocido al iniciar sesión';
      setError(mensaje);
      clearAuth(); 
      return { success: false, message: mensaje };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    console.log('Usuario desconectado');
  };

  const tieneRol = (rolRequerido) => {
    if (typeof rolRequerido === 'string') return rol === rolRequerido;
    return Array.isArray(rolRequerido) && rolRequerido.includes(rol);
  };

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
