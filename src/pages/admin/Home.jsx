import '../../styles/Home.css'; // Importa los estilos CSS para el componente Login

const Home = () => {
    return (
        <div className="home-container">
        <nav className="navbar navbar-dark custom-navbar fixed-top">
            <div className="container-fluid">
            <a className="navbar-toggler" href="#">Inventario Forestal Nacional</a>
            <button
                className="navbar-brand"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasDarkNavbar"
                aria-controls="offcanvasDarkNavbar"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            {/* Sidebar offcanvas desde la izquierda */}
            <div
                className="offcanvas offcanvas-start text-bg-dark custom-navbar"
                tabIndex={-1}
                id="offcanvasDarkNavbar"
                aria-labelledby="offcanvasDarkNavbarLabel"
            >
                <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
                    Menú Administrador
                </h5>
                <button
                    type="button"
                    className="btn-close btn-close-white"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                ></button>
                </div>

                <div className="offcanvas-body">
                <ul className="navbar-nav flex-column pe-3">
                    <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">
                        Home
                    </a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Brigadas</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Conglomerados</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Empleados</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Perfil</a>
                    </li>
                    <li className="nav-item dropdown">
                    <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Más opciones
                    </a>
                    <ul className="dropdown-menu dropdown-menu-dark">
                        <li><a className="dropdown-item" href="#">Action</a></li>
                        <li><a className="dropdown-item" href="#">Another action</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#">Something else</a></li>
                    </ul>
                    </li>
                </ul>
                </div>
            </div>
            </div>
        </nav>
        </div>

    );
};

export default Home;