// 1️ IMPORTAR LAS HERRAMIENTAS NECESARIAS
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 

// Importamos las páginas y componentes
import Login from "./components/Login";   // Página de login (acceso)
import Home from "./pages/admin/Home";          // Página principal (protegida)
import ProtectedRoute from "./components/ProtectedRoute"; // Envuelve rutas privadas

// Estilos globales
import "./styles/App.css";


// 2️ DEFINIR EL COMPONENTE PRINCIPAL
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />   
          <Route path="/home" element={
            <ProtectedRoute> 
              <Home />
            </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}


// 3️ EXPORTAR EL COMPONENTE PARA USARLO EN OTROS LADOS
export default App;
