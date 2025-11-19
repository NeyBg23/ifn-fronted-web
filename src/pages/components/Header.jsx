import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { User, UserRoundCog, LogOut, IdCardLanyard, Earth, ClipboardList, Leaf } from "lucide-react";
import { useState } from 'react';
import arbolColombiano from "../../img/arbolColombiano.png";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = async () => {
    setModalOpen(true)

    setTimeout(()=> {
      logout();
      navigate("/");
    }, 5000)
  };

  return (
    <div className="admin-layout-container">
      {console.log(arbolColombiano)}
      <Modal
        show={modalOpen}
        titulo="¡Hasta luego!"
        onClose={() => setModalOpen(false)}
        mensaje="La sesión se cerrara en 5 segundos."
      />
      <nav className="navbar fixed-top navbar-dark" style={{ backgroundColor: '#1b5e20', boxShadow: '0 12px 5px rgba(16, 209, 42, 0.1)' }}>
        <div className="container-fluid">
          <a className="navbar-brand flex gap-3" href="/admin">
            <img src={arbolColombiano} alt="arbol" className='w-10'/>
            <p className='font-bold'>Inventario Forestal Nacional</p>
          </a>
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
          <div
            className="offcanvas offcanvas-end"
            style={{ backgroundColor: '#1b5e20', width: 'auto' }}
            tabIndex="-1"
            id="offcanvasDarkNavbar"
            aria-labelledby="offcanvasDarkNavbarLabel"
          >
            <div className="offcanvas-header">
              <h3 className="offcanvas-title text-white container flex" id="offcanvasDarkNavbarLabel">
                <User size={25} className="me-2" />
                Panel Administrativo
              </h3>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end pe-3 gap-3">


                <li className="nav-item">
                  <button
                    className="nav-link flex btn btn-link text-start"
                    onClick={() => {
                        {
                            user && user.usuario.rol === 'admin' ? navigate("/admin/brigadas") : navigate("/user/brigadas");
                        }
                    }}
                    data-bs-dismiss="offcanvas"
                  >
                    <ClipboardList size={25} className="me-2" />
                    Brigadas
                  </button>
                </li>



                <li className="nav-item">
                    <button
                        className="nav-link flex btn btn-link text-start"
                        onClick={() => {
                            user && user.usuario.rol === 'admin' ? navigate("/admin/conglomerados") : navigate("/user/conglomerados");
                        }}
                        data-bs-dismiss="offcanvas"
                    >
                      <Earth size={25} className="me-2" />
                      Conglomerados
                    </button>
                </li>


                {/* Botón Levantamiento de Datos (solo para brigadistas) */}
                {
                  user && user.usuario.rol === 'brigadista' && (
                    <li className="nav-item">
                      <button
                        className="nav-link flex btn btn-link text-start"
                        onClick={() => navigate("/user/levantamiento-datos")}
                        data-bs-dismiss="offcanvas"
                        style={{ color: '#4CAF50', fontWeight: 'bold' }}
                      >
                        <Leaf size={25} className="me-2" />
                        Levantamiento de Datos
                      </button>
                    </li>
                  )
                }


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
                


                <hr className="border-3 opacity-3" />


                <li className="nav-item">
                  <button
                    className="nav-link flex btn btn-link text-start"
                    onClick={handleLogout}
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