import { useState } from "react";
import "../../styles/Home.css";
import { useNavigate } from "react-router-dom";
import Brigadas from "./Brigadas.jsx";
import Conglomerados from "./Conglomerados.jsx";
import Perfil from "./Perfil.jsx";
import Empleados from "./Empleados.jsx";

const Home = () => {
  const navigate = useNavigate();

  // Estado que guarda la sección actual
  const [section, setSection] = useState("home");

  // Función para renderizar el contenido según la sección
  const renderContent = () => {
    switch (section) {
      case "home":
        return (
          <>
            <h1>Bienvenido</h1>
            <p>Este es el panel principal del Inventario Forestal Nacional.</p>
          </>
        );
      case "brigadas":

        return <Brigadas/>;

      case "conglomerados":

        return <Conglomerados/>;

      case "perfil":
        
        return <Perfil/>;

      case "empleados": 

        return <Empleados/>;
      
      case "sesion_off": {
        localStorage.removeItem("session"); // Elimino la sesión de ese usuario
        setSection(""); // Evito que cuando haga el "alert"
        // no vuelva a ejecutar el session_off y vaya a default
        alert("Se ha cerrado sesión correctamente.");

        return navigate("/") // Lo envio finalmente al home
      }

      default:
        return <h2>Sección no encontrada</h2>;
    }
  };

  return (
    <div className="home-container">
        <nav className="navbar navbar-dark custom-navbar fixed-top">
            <div className="container-fluid ">
            <a className="navbar-brand" href="#" onClick={() => navigate("/admin")}>
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
                <span className="navbar-toggler-icon">
                </span>
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
                        className={`nav-link btn btn-link text-start ${
                        section === "home" ? "active" : ""
                        }`}
                        onClick={() => setSection("home")}
                        data-bs-dismiss="offcanvas"
                    >
                        Home
                    </button>
                    </li>
                    <li className="nav-item">
                    <button
                        className={`nav-link btn btn-link text-start ${
                        section === "brigadas" ? "active" : ""
                        }`}
                        onClick={() => setSection("brigadas")}
                        data-bs-dismiss="offcanvas"
                    >
                        Brigadas
                    </button>
                    </li>
                    <li className="nav-item">
                    <button
                        className={`nav-link btn btn-link text-start ${
                        section === "conglomerados" ? "active" : ""
                        }`}
                        onClick={() => setSection("conglomerados")}
                        data-bs-dismiss="offcanvas"
                    >
                        Conglomerados
                    </button>
                    </li>

                    <li className="nav-item">
                    <button
                        className={`nav-link btn btn-link text-start ${
                        section === "empleados" ? "active" : ""
                        }`}
                        onClick={() => setSection("empleados")}
                        data-bs-dismiss="offcanvas"
                    >
                        Empleados
                    </button>
                    </li>

                    <li className="nav-item">
                    <button
                        className={`nav-link btn btn-link text-start ${
                        section === "perfil" ? "active" : ""
                        }`}
                        onClick={() => setSection("perfil")}
                        data-bs-dismiss="offcanvas"
                    >
                        Perfil
                    </button>
                    </li>

                    <li className="nav-item">
                    <button
                        className={`nav-link btn btn-link text-start ${
                        section === "sesion_off" ? "active" : ""
                        }`}
                        onClick={() => setSection("sesion_off")}
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

        {/* Contenido dinámico */}
        <main className="content p-4 mt-5">
            {renderContent()}
        </main>
    </div>
  );
};

export default Home;
