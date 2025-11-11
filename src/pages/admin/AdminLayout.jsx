import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    alert("Se ha cerrado sesión correctamente.");
    navigate("/");
  };

  return (
    <div className="admin-layout-container">
      {/* 🛑 Navbar / Sidebar de Navegación */}
      <nav className="navbar fixed-top bg-dark navbar-dark">
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
            className="offcanvas offcanvas-end text-bg-dark"
            tabIndex="-1"
            id="offcanvasDarkNavbar"
            aria-labelledby="offcanvasDarkNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
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
                    onClick={() => navigate("/admin/perfil")}
                    data-bs-dismiss="offcanvas"
                  >
                    Perfil
                  </button>
                </li>

                <hr className="border border-primary border-3 opacity-75" />

                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-start text-danger"
                    onClick={handleLogout} // Usar la función de logout
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

      {/* 👇 Contenido principal donde se renderizan las sub-rutas */}
      <main className="content p-4 mt-5">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;