import { useNavigate } from 'react-router-dom';
// Hook de React Router para la navegación programática.

import { useAuth } from '../../hooks/useAuth.jsx';
// Hook personalizado para manejar el estado de autenticación (login, logout, datos de usuario).

import { 
    User, 
    UserRoundCog, 
    LogOut, 
    IdCardLanyard, 
    Earth, 
    ClipboardList, 
    Leaf 
} from "lucide-react";
// Importa iconos de Lucide React para ser usados en el menú de navegación.

import { useState } from 'react';
// Hook de React para manejar el estado dentro del componente.

import arbolColombiano from "../../img/arbolColombiano.png";
// Importa la imagen del logo o árbol colombiano.

import Modal from './Modal.jsx';
// Importa el componente Modal que se usará para confirmar el cierre de sesión.

export default function Header() {
  // Inicializa el hook de navegación.
  const navigate = useNavigate();
  
  // Obtiene la función de cierre de sesión del contexto de autenticación.
  const { logout } = useAuth();
  
  // Obtiene los datos completos del usuario autenticado (incluyendo el rol).
  const user = useAuth();
  
  // Estado local para controlar la visibilidad del modal de cierre de sesión.
  const [modalOpen, setModalOpen] = useState(false);

  // Función asíncrona que maneja el proceso de cierre de sesión.
  const handleLogout = async () => {
    // Muestra el modal de advertencia antes de cerrar la sesión.
    setModalOpen(true)

    // Establece un temporizador para realizar el cierre de sesión y la redirección después de 3 segundos.
    setTimeout(()=> {
      // Ejecuta la función de cierre de sesión.
      logout();
      // Redirige al usuario a la página de inicio (ruta "/").
      navigate("/");
    }, 3000)
  };

  return (
    <div className="admin-layout-container">

      {/* Componente Modal que se muestra al intentar cerrar sesión */}
      <Modal
        show={modalOpen} // Controla si el modal está visible
        titulo="¡Hasta luego!"
        onClose={() => setModalOpen(false)} // Función para cerrar el modal manualmente
        mensaje="La sesión se cerrara en 3 segundos..."
      />

      {/* Barra de navegación principal (Navbar) */}
      <nav className="navbar fixed-top navbar-dark" style={{ backgroundColor: '#1b5e20', boxShadow: '0 12px 5px rgba(16, 209, 42, 0.1)' }}>
        <div className="container-fluid">
          
          {/* Enlace del logo o marca de la barra de navegación */}
          <a className="navbar-brand flex gap-3 space-y-1" 
            // Redirige a la página principal del rol correspondiente (admin o user)
            href={ user.rol === "admin" ? "/admin" : "/user"}>
            <img src={arbolColombiano} alt="arbol" className='w-10'/>
            <p className='font-bold'>Inventario Forestal Nacional</p>
          </a>
          
          {/* Botón para desplegar el menú lateral (Offcanvas) en dispositivos móviles */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasDarkNavbar"
            aria-controls="offcanvasDarkNavbar"
            aria-label="Toggle navigation"
          >
            <div className="d-flex align-items-center gap-2">
              <span className="navbar-toggler-icon" />
              <p>Menu</p>
            </div>
          </button>
          
          {/* Menú Lateral (Offcanvas) */}
          <div
            className="offcanvas offcanvas-end"
            style={{ backgroundColor: '#1b5e20', width: 'auto' }} // Estilo de fondo verde oscuro
            tabIndex="-1"
            id="offcanvasDarkNavbar"
            aria-labelledby="offcanvasDarkNavbarLabel"
          >
            
            {/* Encabezado del menú lateral */}
            <div className="offcanvas-header">
              <h3 className="offcanvas-title text-white container flex" id="offcanvasDarkNavbarLabel">
                <User size={25} className="me-2" />
                {/* Muestra el título del panel según el rol del usuario */}
                {
                  user.rol === "admin" ? "Panel Administrativo" : "Panel Brigadista"
                }
              </h3>
              {/* Botón para cerrar el menú lateral */}
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            
            {/* Cuerpo del menú lateral con los enlaces de navegación */}
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end pe-3 gap-3">


                {/* Enlace a Brigadas */}
                <li className="nav-item">
                  <button
                    className="nav-link flex btn btn-link text-start"
                    onClick={() => {
                        {
                            // Navega a la ruta de brigadas del admin o del usuario según el rol
                            user && user.usuario.rol === 'admin' ? navigate("/admin/brigadas") : navigate("/user/brigadas");
                        }
                    }}
                    data-bs-dismiss="offcanvas"
                  >
                    <ClipboardList size={25} className="me-2" />
                    Brigadas
                  </button>
                </li>


                {/* Enlace a Conglomerados */}
                <li className="nav-item">
                    <button
                        className="nav-link flex btn btn-link text-start"
                        onClick={() => {
                            // Navega a la ruta de conglomerados del admin o del usuario según el rol
                            user && user.usuario.rol === 'admin' ? navigate("/admin/conglomerados") : navigate("/user/conglomerados");
                        }}
                        data-bs-dismiss="offcanvas"
                    >
                      <Earth size={25} className="me-2" />
                      Conglomerados
                    </button>
                </li>


                {/* Botón Levantamiento de Datos (solo visible para usuarios con rol 'brigadista') */}
                {
                  user && user.usuario.rol === 'brigadista' && (
                    <li className="nav-item">
                      <button
                        className="nav-link flex btn btn-link text-start"
                        onClick={() => navigate("/user/levantamiento-datos")}
                        data-bs-dismiss="offcanvas"
                        style={{ color: '#4CAF50', fontWeight: 'bold' }} // Estilo destacado
                      >
                        <Leaf size={25} className="me-2" />
                        Levantamiento de Datos
                      </button>
                    </li>
                  )
                }


                {/* Enlace a Empleados (solo visible para usuarios con rol 'admin') */}
                {
                  user && user.usuario.rol === 'admin' && (
                    <li className="nav-item">
                      <button
                        className="nav-link flex btn btn-link text-start"
                        onClick={() => navigate("/admin/empleados")}
                        data-bs-dismiss="offcanvas"
                      >
                        <IdCardLanyard size={25} className="me-2" />
                        Empleados
                      </button>
                    </li>
                  )
                }


                {/* Enlace al Perfil de Usuario */}
                <li className="nav-item">
                  <button
                    className="nav-link flex btn btn-link text-start"
                    onClick={() => navigate("/user/perfil")}
                    data-bs-dismiss="offcanvas"
                  >
                    <UserRoundCog size={25} className="me-2" />
                    Perfil
                  </button>
                </li>
                

                {/* Separador visual en el menú */}
                <hr className="border-3 opacity-3" />


                {/* Botón para Cerrar Sesión */}
                <li className="nav-item">
                  <button
                    className="nav-link flex btn btn-link text-start"
                    onClick={handleLogout} // Llama a la función de cierre de sesión
                    data-bs-dismiss="offcanvas"
                  >
                    <LogOut size={25} className="me-2" />
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}