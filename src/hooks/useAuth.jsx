import { useState, useEffect, useContext, createContext, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Variables de Entorno
const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:4000';
const BRIGADA_SERVICE_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true); // Inicia en TRUE para esperar la verificación
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const user = useAuth()

  // Función auxiliar para limpiar el estado y el almacenamiento local
  const clearAuth = () => {
    setToken(null);
    setUsuario(null);
    setRol(null);
    setError(null);
  };

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      const tokenGuardado = user.token;
      
      if (tokenGuardado) {
        try {
          // INTENTAR OBTENER DATOS FRESCOS DEL SERVIDOR CON EL TOKEN GUARDADO
          console.log('🔄 Revalidando token y obteniendo datos de usuario...');
          const brigResponse = await axios.get(
            `${BRIGADA_SERVICE_URL}/api/usuarios/me`,
            {
              headers: {
                Authorization: `Bearer ${tokenGuardado}`
              }
            }
          );
          
          const usuarioBrigada = brigResponse.data.usuario || brigResponse.data;
          
          // 2. ESTABLECER ESTADOS CON DATOS DEL SERVIDOR (Rol fresco)
          setToken(tokenGuardado);
          setUsuario(usuarioBrigada);
          setRol(usuarioBrigada.rol || null);

        
        } catch (err) {
          // Si hay error (401, 403, 500), forzamos un logout limpio
          console.error('Token inválido, expirado o error en el Backend (500). Forzando logout.', err);
          clearAuth();
        }
      } else {
        // No hay token guardado, asegurar que los estados están limpios
        clearAuth();
      }
      
      // 3. 🛑 SIEMPRE poner FALSE al final del chequeo
      setLoading(false);
    };

    checkAuthAndFetchUser();
  }, []); // Dependencia vacía para ejecutarse solo al montar


const login = async (email, password, hcaptchaToken) => {
  try {
    setLoading(true);
    setError(null);

    // 1️Login en Auth Service (Incluyendo el token de hCaptcha)
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/login`,
      {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        email,
        password,
        hcaptchaToken
      },
    );

    // Obtener correctamente el token
    const nuevoToken = response.data.session.access_token;
    if (!nuevoToken) throw new Error('No se recibió token del Auth Service');
    
    // Consultar usuario y rol en Brigada
    const brigResponse = await axios.get(
      `${BRIGADA_SERVICE_URL}/api/usuarios/me`, 
      {
        headers: {
          Authorization: `Bearer ${nuevoToken}`
        }
      }
    );

    // 4Extraer usuario brigada correctamente
    const usuarioBrigada = brigResponse.data.usuario || brigResponse.data;

    // Actualizar estados en React
    setToken(nuevoToken);
    setUsuario(usuarioBrigada);
    setRol(usuarioBrigada.rol || null);

    console.log('Login exitoso - Rol:', usuarioBrigada.rol);

    return { success: true, message: 'Login exitoso', usuario: usuarioBrigada };
  } catch (err) {

    const mensaje = err.response?.data?.detail || err.response?.data?.error || err.message || 'Error desconocido al iniciar sesión';
    setError(mensaje);
    clearAuth(); 
    
    console.error('❌ Error en login:', err);
    return { success: false, message: mensaje };
  } finally {
    setLoading(false);
  }
}

  const logout = () => {
    clearAuth();
    console.log('Usuario desconectado');
  };

  const tieneRol = (rolRequerido) => {
    if (typeof rolRequerido === 'string') return rol === rolRequerido;
    return rolRequerido.includes(rol);
  };

  // Memorizar el objeto de valor del contexto con useMemo
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
  }), [usuario, rol, token, loading, error]); // Dependencias

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