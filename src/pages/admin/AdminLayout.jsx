// src/pages/admin/AdminLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import "../../styles/Home.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <nav className="navbar navbar-dark custom-navbar fixed-top">
        <div className="container-fluid">
          <a
            className="navbar-brand"
            href="#"
            onClick={() => navigate("/admin")}
          >
            Inventario Forestal Nacional
          </a>

          {/* 🔹 Botón toggle idéntico al de Bootstrap */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* 🔹 Offcanvas corregido (estructura oficial) */}
          <div
            className="offcanvas offcanvas-end custom-navbar"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                Menú de Administración
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
                    onClick={() => navigate("/admin")}
                    data-bs-dismiss="offcanvas"
                  >
                    Home
                  </button>
                </li>
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
                    onClick={() => navigate("/admin/empleados")}
                    data-bs-dismiss="offcanvas"
                  >
                    Empleados
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
                    onClick={() => {
                      localStorage.removeItem("session");
                      alert("Se ha cerrado sesión correctamente.");
                      navigate("/");
                    }}
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

      {/* 👇 Contenido principal */}
      <main className="content p-4 mt-5">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
