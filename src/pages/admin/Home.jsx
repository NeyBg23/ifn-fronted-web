import { useState } from "react";
import { Menu, X } from "lucide-react";
import Brigadas from "./Brigadas";
import Conglomerados from "./Conglomerados";
import Perfil from "./Perfil";

const Home = () => {
  // Estado que guarda la sección actual
  const [section, setSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para cerrar el menú
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Función para cambiar de sección y cerrar el menú
  const changeSection = (newSection) => {
    setSection(newSection);
    closeMenu();
  };

  // Función para renderizar el contenido según la sección
  const renderContent = () => {
    switch (section) {
      case "home":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Bienvenido</h1>
            <p className="text-gray-600">
              Este es el panel principal del Inventario Forestal Nacional.
            </p>
          </div>
        );
      case "brigadas":
        return <Brigadas />;
      case "conglomerados":
        return <Conglomerados />;
      case "perfil":
        return <Perfil />;
      default:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Bienvenido</h1>
            <p className="text-gray-600">
              Este es el panel principal del Inventario Forestal Nacional.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar fijo */}
      <nav className="bg-gray-900 border-b border-gray-700 fixed top-0 left-0 right-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Botón del menú a la izquierda */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 flex items-center gap-2"
              aria-label="Toggle navigation"
            >
              <span className="text-sm font-medium">Menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            
            {/* Brand/Logo centrado */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <a 
                href="/admin" 
                className="text-white text-lg font-semibold hover:text-gray-300 transition-colors"
              >
                Inventario Forestal Nacional
              </a>
            </div>
            
            {/* Espacio vacío para balancear el layout */}
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      {/* Panel lateral deslizante */}
      <div 
        className={`fixed top-0 left-0 bg-gray-800 border-r border-gray-700 shadow-lg overflow-hidden transition-all duration-300 ease-in-out z-50 ${
          isMenuOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'
        }`}
        style={{ height: '100vh' }}
      >
        <div className="p-6">
          {/* Header del offcanvas */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-600">
            <h5 className="text-white text-xl font-semibold">
              Menu Administrador
            </h5>
            <button
              onClick={closeMenu}
              className="text-white p-1 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Enlaces de navegación */}
          <ul className="space-y-2">
            <li>
              <button
                className={`w-full text-left px-4 py-3 rounded-md transition-colors duration-200 ${
                  section === "home" 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => changeSection("home")}
              >
                Home
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-4 py-3 rounded-md transition-colors duration-200 ${
                  section === "brigadas" 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => changeSection("brigadas")}
              >
                Brigadas
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-4 py-3 rounded-md transition-colors duration-200 ${
                  section === "conglomerados" 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => changeSection("conglomerados")}
              >
                Conglomerados
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-4 py-3 rounded-md transition-colors duration-200 ${
                  section === "perfil" 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => changeSection("perfil")}
              >
                Perfil
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Contenido principal */}
      <main className="pt-20 px-4 pb-8">
        <div className="container mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Home;