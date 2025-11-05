import React, { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:4000';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  // Al cargar, solo verificar si hay token en localStorage
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado);
      setUsuario(JSON.parse(usuarioGuardado));
      setRol(JSON.parse(usuarioGuardado).role || 'brigadista');
    }
    setLoading(false);
  }, []);

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

      console.log('📊 Respuesta del Auth Service:', response.data); // 🔍 VER ESTRUCTURA


      // ✅ OBTENER CORRECTAMENTE EL TOKEN
      // El Auth Service retorna { access_token, user } o { token, user }
      const nuevoToken = response.data.access_token || response.data.token;
      const userAuth = response.data.user;

      if (!nuevoToken) {
        throw new Error('No se recibió token del Auth Service');
      }

      console.log('🔑 Token obtenido:', nuevoToken);
      console.log('👤 Usuario Auth:', userAuth)


      // 2️⃣ Consultar rol desde backend de Brigadas (si es necesario)
      // Aquí asumimos que el rol viene en el objeto user retornado por el Auth Service
      const BRIGADA_SERVICE_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || 'http://localhost:5000';
      
      const brigResponse = await axios.get(`${BRIGADA_SERVICE_URL}/api/usuarios/correo=${userAuth.email || email}`, {
        headers: {
          Authorization: `Bearer ${nuevoToken}`
        }
      });

      console.log('📋 Datos de Brigada:', brigResponse.data);


      const usuarioBrigada = brigResponse.data; // Asumimos que la respuesta tiene los datos del usuario incluyendo el rol


      // Guardar en localStorage
      localStorage.setItem('token', nuevoToken);
      localStorage.setItem('usuario', JSON.stringify(user));

      setToken(nuevoToken);
      setUsuario(usuarioBrigada);
      setRol(usuarioBrigada.role || 'brigadista');  // Asignar rol desde datos de Brigada

      console.log('✅ Login exitoso - Rol:', usuarioBrigada.rol);

      // Retornar éxito
      return { success: true, message: 'Login exitoso' };
    } catch (err) {
      const mensaje = err.response?.data?.error || 'Error en login';
      setError(mensaje);
      console.error('❌ Error en login:', err);
      return { success: false, message: mensaje };
    } finally {
      setLoading(false);
    }
  };

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
