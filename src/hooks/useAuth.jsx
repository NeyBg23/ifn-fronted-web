import React, { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:4000';
const BRIGADA_SERVICE_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true); // Se inicia en TRUE
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      const tokenGuardado = localStorage.getItem('token');
      
      if (tokenGuardado) {
        try {
          // 1. INTENTAR OBTENER DATOS FRESCOS CON EL TOKEN GUARDADO
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
          setRol(usuarioBrigada.rol || null); // El rol por defecto debe ser null o manejado en DB

          // Opcional: Actualizar localStorage con el objeto de usuario fresco
          localStorage.setItem('usuario', JSON.stringify(usuarioBrigada));
        
        } catch (err) {
          // Si hay error (401, 403, 500, o token expirado), hacemos logout limpio
          console.error('Token inválido o expirado. Forzando logout.', err);
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          setToken(null);
          setUsuario(null);
          setRol(null);
        }
      } else {
        // No hay token guardado, asegurar que los estados están limpios
        setUsuario(null);
        setRol(null);
      }
      
      // SIEMPRE poner FALSE al final del chequeo
      setLoading(false);
    };

    checkAuthAndFetchUser();
  }, []); // Se ejecuta una sola vez al montar


const login = async (email, password) => {
  try {
    setLoading(true);
    setError(null);

    // 1️⃣ Login en Auth Service
    console.log('🔐 Intentando login en:', `${AUTH_SERVICE_URL}/auth/login`);

    const response = await axios.post(
      `${AUTH_SERVICE_URL}/auth/login`,
      { email, password }
    );

    // 2️⃣ Obtener correctamente el token
    const nuevoToken = response.data.session.access_token;
    if (!nuevoToken) {
      throw new Error('No se recibió token del Auth Service');
    }

    // 3️⃣ Consultar usuario y rol en Brigada
    const brigResponse = await axios.get(
      `${BRIGADA_SERVICE_URL}/api/usuarios/me`, 
      {
        headers: {
          Authorization: `Bearer ${nuevoToken}`
        }
      }
    );

    console.log('👤 Datos de usuario obtenidos de Brigada:', brigResponse.data);

    // 4️⃣ Extraer usuario brigada correctamente
    const usuarioBrigada = brigResponse.data.usuario || brigResponse.data;

    // 5️⃣ Guardar token y usuario en local storage
    localStorage.setItem('token', nuevoToken);
    localStorage.setItem('usuario', JSON.stringify(usuarioBrigada));

    // 6️⃣ Actualizar estados en React
    setToken(nuevoToken);
    setUsuario(usuarioBrigada);
    setRol(usuarioBrigada.rol || null);

    console.log('✅ Login exitoso - Rol:', usuarioBrigada.rol);

    return { success: true, message: 'Login exitoso' };
  } catch (err) {
    // 🛑 CORRECCIÓN: Si falla la llamada a /usuarios/me (el 500) o el login
    // Limpiamos el localStorage y los estados, y ponemos loading=false
    const mensaje = err.response?.data?.error || err.message || 'Error desconocido al iniciar sesión';
    setError(mensaje);
    
    // Si ya se había obtenido el token pero falló la consulta al backend
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
    setRol(null);
    
    console.error('❌ Error en login:', err);
    return { success: false, message: mensaje };
  } finally {
    // ✅ Garantizado: Loading se pone en false en todos los casos
    setLoading(false);
  }
}


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
    setRol(null);
    setError(null);
    console.log('✅ Usuario desconectado');
  };

  const tieneRol = (rolRequerido) => {
    if (typeof rolRequerido === 'string') {
      return rol === rolRequerido;
    }
    return rolRequerido.includes(rol);
  };

  const value = {
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
  };

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