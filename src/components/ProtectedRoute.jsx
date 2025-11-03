// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

/**
 * ProtectedRoute protege rutas basado en autenticación y roles.
 * 
 * Props:
 * - component: Componente React que se quiere proteger
 * - requiredRole: (string opcional) rol requerido para acceder
 * - requiredPermissions: (array opcional) permisos requeridos para acceder
 */
export function ProtectedRoute({ component: Component, requiredRole = null, requiredPermissions = [] }) {
  const { usuario, rol, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!usuario) {
    // No autenticado, redirigir a login
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && rol !== requiredRole) {
    // Rol no autorizado, redirigir a no autorizado
    return <Navigate to="/no-autorizado" replace />;
  }

  if (requiredPermissions.length > 0) {
    const tieneTodosPermisos = requiredPermissions.every((perm) =>
      checkPermiso(rol, perm)
    );
    if (!tieneTodosPermisos) {
      return <Navigate to="/no-autorizado" replace />;
    }
  }

  return <Component />;
}

// Función para verificar si un rol tiene un permiso específico
function checkPermiso(rol, permiso) {
  const permisosPorRol = {
    admin: [
      'crear_empleados',
      'ver_empleados',
      'crear_brigadas',
      'asignar_roles',
      'validar_brigadas',
      'ver_checklist',
      'asignar_conglomerados',
    ],
    coordinador_brigadas: [
      'asignar_roles',
      'validar_brigadas',
      'ver_checklist',
      'ver_miembros_brigada',
    ],
    coordinador_regional: ['asignar_conglomerados', 'validar_brigadas', 'ver_brigadas'],
    brigadista: ['ver_perfil', 'ver_mi_brigada', 'enviar_datos_campo'],
    visualizador: ['ver_reportes'],
  };

  return permisosPorRol[rol]?.includes(permiso) || false;
}

// Exportar como componente por defecto
export default ProtectedRoute;