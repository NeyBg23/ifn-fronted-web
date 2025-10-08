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
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasDarkNavbar"
            aria-controls="offcanvasDarkNavbar"
            aria-label="Toggle navigation"
          >
            <h5>Menu</h5>
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="offcanvas offcanvas-end custom-navbar text-bg-dark"
            tabIndex={-1}
            id="offcanvasDarkNavbar"
            aria-labelledby="offcanvasDarkNavbarLabel"
          >
            <div className="offcanvas-header custom-navbar">
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body custom-navbar">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-start"
                    onClick={() => navigate("/admin")}
                    data-bs-dismiss="offcanvas"
                  >
                    Home
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-start"
                    onClick={() => navigate("/admin/brigadas")}
                    data-bs-dismiss="offcanvas"
                  >
                    Brigadas
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-start"
                    onClick={() => navigate("/admin/conglomerados")}
                    data-bs-dismiss="offcanvas"
                  >
                    Conglomerados
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-start"
                    onClick={() => navigate("/admin/empleados")}
                    data-bs-dismiss="offcanvas"
                  >
                    Empleados
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-start"
                    onClick={() => navigate("/admin/perfil")}
                    data-bs-dismiss="offcanvas"
                  >
                    Perfil
                  </button>
                </li>

                <hr className="border border-primary border-3 opacity-75" />

                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-start"
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

      {/* 👇 Aquí React Router renderiza la subpágina */}
      <main className="content p-4 mt-5">
        <Outlet /> {/* Renderiza la página hija aquí */}
      </main>
    </div>
  );
};

export default AdminLayout;
