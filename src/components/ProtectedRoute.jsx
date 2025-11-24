import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

/**
 * Componente que sirve para proteger rutas.
 * Valida si el usuario está autenticado, si tiene el rol requerido
 * y/o los permisos necesarios antes de mostrar el componente.
 *
 * Props:
 * - component: componente que se debe renderizar si pasa las validaciones.
 * - requiredRole: (opcional) rol necesario para ingresar.
 * - requiredPermissions: (opcional) lista de permisos que necesita el usuario.
 */
export function ProtectedRoute({ component: Component, requiredRole = null, requiredPermissions = [] }) {

  // Información del usuario obtenida del hook de autenticación
  const { usuario, rol, loading } = useAuth();

  // Mientras la info del usuario carga, se muestra un indicador
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
      }}>
        Cargando...
      </div>
    );
  }

  // Si no hay usuario autenticado, se envía al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta exige un rol, se valida que coincida
  if (requiredRole) {
    if (rol !== requiredRole) {
      return <Navigate to="/no-autorizado" replace />;
    }
  }

  // Si la ruta exige permisos, se verifica que el usuario tenga todos
  if (requiredPermissions.length > 0) {
    const tieneTodosPermisos = requiredPermissions.every((perm) =>
      checkPermiso(rol, perm)
    );

    if (!tieneTodosPermisos) {
      return <Navigate to="/no-autorizado" replace />;
    }
  }

  // Si pasa todas las validaciones, se renderiza el componente indicado
  return <Component />;
}

/**
 * Valida si el rol del usuario tiene un permiso específico.
 */
function checkPermiso(rol, permiso) {

  // Lista de permisos asignados por cada rol
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
    coordinador_regional: [
      'asignar_conglomerados',
      'validar_brigadas',
      'ver_brigadas',
    ],
    brigadista: [
      'ver_perfil',
      'ver_mi_brigada',
      'enviar_datos_campo',
    ],
    visualizador: ['ver_reportes'],
  };

  // Retorna true si el permiso está incluido para ese rol
  return permisosPorRol[rol]?.includes(permiso) || false;
}

export default ProtectedRoute;
