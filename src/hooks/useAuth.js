// 📄 src/hooks/useAuth.js
// Hook de Autenticación con Control de Roles
// Gestiona usuario, token y estado de autenticación global

import React, { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';

// Crear contexto
const AuthContext = createContext();

// URL del API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// ============================================
// PROVIDER - Envuelve toda la app
// ============================================

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  // 1. Al cargar el componente, verificar si hay token guardado
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');
    if (tokenGuardado) {
      setToken(tokenGuardado);
      cargarUsuarioAutenticado(tokenGuardado);
    } else {
      setLoading(false);
    }
  }, []);

  // 2. Función para cargar datos del usuario autenticado
  const cargarUsuarioAutenticado = async (tokenActual) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/usuarios/me`,
        {
          headers: {
            'Authorization': `Bearer ${tokenActual}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const datosUsuario = response.data.usuario;
      setUsuario(datosUsuario);
      setRol(datosUsuario.rol || 'brigadista');
      setError(null);

      console.log('✅ Usuario autenticado:', {
        nombre: datosUsuario.nombre_completo,
        rol: datosUsuario.rol
      });
    } catch (err) {
      console.error('❌ Error cargando usuario autenticado:', err);
      setError(err.response?.data?.error || 'Error al cargar usuario');
      // Si el token es inválido, limpiarlo
      localStorage.removeItem('token');
      setToken(null);
      setUsuario(null);
      setRol(null);
    } finally {
      setLoading(false);
    }
  };

  // 3. Función para LOGIN
  const login = async (correo, password) => {
    try {
      setLoading(true);
      setError(null);

      // Llamar endpoint de login (en el microservicio de AUTH)
      const response = await axios.post(
        `${process.env.REACT_APP_AUTH_URL || 'http://localhost:3001/api'}/auth/login`,
        {
          correo,
          password
        }
      );

      const { token: nuevoToken } = response.data;

      // Guardar token
      localStorage.setItem('token', nuevoToken);
      setToken(nuevoToken);

      // Cargar datos del usuario
      await cargarUsuarioAutenticado(nuevoToken);

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

  // 4. Función para LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
    setRol(null);
    setError(null);
    console.log('✅ Usuario desconectado');
  };

  // 5. Función para REGISTRAR (si es necesario)
  const registrar = async (nombre, correo, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${process.env.REACT_APP_AUTH_URL || 'http://localhost:3001/api'}/auth/registro`,
        {
          nombre_completo: nombre,
          correo,
          password
        }
      );

      return { success: true, message: 'Registro exitoso', data: response.data };
    } catch (err) {
      const mensaje = err.response?.data?.error || 'Error en registro';
      setError(mensaje);
      console.error('❌ Error en registro:', err);
      return { success: false, message: mensaje };
    } finally {
      setLoading(false);
    }
  };

  // 6. Función para VERIFICAR PERMISOS
  const tienePermiso = (permiso) => {
    const permisos = {
      admin: [
        'crear_empleados',
        'ver_empleados',
        'crear_brigadas',
        'ver_brigadas',
        'asignar_roles',
        'validar_brigadas',
        'ver_checklist',
        'asignar_conglomerados'
      ],
      coordinador_brigadas: [
        'asignar_roles',
        'validar_brigadas',
        'ver_checklist',
        'ver_miembros_brigada',
        'ver_brigadas'
      ],
      coordinador_regional: [
        'asignar_conglomerados',
        'validar_brigadas',
        'ver_brigadas'
      ],
      brigadista: [
        'ver_perfil',
        'ver_mi_brigada',
        'enviar_datos_campo'
      ],
      visualizador: [
        'ver_reportes'
      ]
    };

    const permisosDelRol = permisos[rol] || [];
    return permisosDelRol.includes(permiso);
  };

  // 7. Función para VERIFICAR ROL
  const tieneRol = (rolRequerido) => {
    if (typeof rolRequerido === 'string') {
      return rol === rolRequerido;
    }
    // Si es un array, verificar si el rol está en el array
    return rolRequerido.includes(rol);
  };

  // Valor del contexto
  const value = {
    usuario,
    rol,
    token,
    loading,
    error,
    login,
    logout,
    registrar,
    tienePermiso,
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

// ============================================
// HOOK - Usar en cualquier componente
// ============================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }

  return context;
}

// ============================================
// HOOK - Para acceder solo al usuario
// ============================================

export function useUsuario() {
  const { usuario } = useAuth();
  return usuario;
}

// ============================================
// HOOK - Para acceder solo al rol
// ============================================

export function useRol() {
  const { rol } = useAuth();
  return rol;
}

// ============================================
// HOOK - Para verificar permisos
// ============================================

export function usePermisos() {
  const { tienePermiso, tieneRol } = useAuth();
  return { tienePermiso, tieneRol };
}