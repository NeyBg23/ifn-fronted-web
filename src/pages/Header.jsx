import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    alert("Se ha cerrado sesión correctamente.");
    navigate("/");
  };

  return (
    <div className="admin-layout-container">
      <nav className="navbar fixed-top navbar-dark" style={{ backgroundColor: '#1b5e20', boxShadow: '0 12px 5px rgba(16, 209, 42, 0.1)' }}>
        <div className="container-fluid">
          <a className="navbar-brand" href="/admin">
            Inventario Forestal Nacional
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasDarkNavbar"
            aria-controls="offcanvasDarkNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-end navbar-dark"
            style={{ backgroundColor: '#1b5e20' }}
            tabIndex="-1"
            id="offcanvasDarkNavbar"
            aria-labelledby="offcanvasDarkNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title text-white" id="offcanvasDarkNavbarLabel">
                Panel Administrativo
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">

                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-start text-white"
                    onClick={() => navigate("/admin/brigadas")}
                    data-bs-dismiss="offcanvas"
                  >
                    Brigadas
                  </button>
                </li>


                <li className="nav-item">
                    <button
                        className="nav-link btn btn-link text-start text-white"
                        onClick={() => navigate("/admin/conglomerados")}
                        data-bs-dismiss="offcanvas"
                    >
                        Conglomerados
                    </button>
                </li>


                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-start text-white"
                    onClick={() => navigate("/user/perfil")}
                    data-bs-dismiss="offcanvas"
                  >
                    Perfil
                  </button>
                </li>
                

                <hr className="border border-light border-3 opacity-75" />

                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-start text-danger"
                    onClick={handleLogout}
                    data-bs-dismiss="offcanvas"
                  >
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
