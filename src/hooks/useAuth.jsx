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

      console.log('🔐 Intentando login en:', `${AUTH_SERVICE_URL}/auth/login`);

      const response = await axios.post(
        `${AUTH_SERVICE_URL}/auth/login`,
        { email, password }
      );

      const { token: nuevoToken, user } = response.data;

      // Guardar en localStorage
      localStorage.setItem('token', nuevoToken);
      localStorage.setItem('usuario', JSON.stringify(user));

      setToken(nuevoToken);
      setUsuario(user);
      setRol(user.role || 'brigadista');

      console.log('✅ Login exitoso');
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
