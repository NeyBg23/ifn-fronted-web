import '../../styles/Home.css'; // Importa los estilos CSS para el componente Login

const Home = () => {
    return (
        <div className="home-container">
        <nav className="navbar navbar-dark custom-navbar d-flex flex-column align-items-start vh-100 position-fixed top-0 start-0 p-3">
            <a className="navbar-brand mb-4" href="#">
            Inventario Forestal Nacional
            </a>
            <ul className="navbar-nav flex-column w-100">
            <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Home</a>
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
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Más opciones
                </a>
                <ul className="dropdown-menu dropdown-menu-dark">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
                </ul>
            </li>
            </ul>
        </nav>

        {/* Contenido principal */}
        <main className="content p-4" style={{ marginLeft: "250px" }}>
            <h1>Bienvenido</h1>
            <p>Contenido principal aquí...</p>
        </main>
        </div>

    );
};

export default Home;