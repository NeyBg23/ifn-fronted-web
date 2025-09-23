// 1️ IMPORTAR LAS HERRAMIENTAS NECESARIAS
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 

// Importamos las páginas y componentes
import Login from "./components/Login";   // Página de login (acceso)
import Home from "./pages/Home";          // Página principal (protegida)
import ProtectedRoute from "./components/ProtectedRoute"; // Envuelve rutas privadas

// Estilos globales
import "./styles/App.css";


// 2️ DEFINIR EL COMPONENTE PRINCIPAL
function App() {
  return (
    <div className="App">
      {/* 
        🔹 Router: Necesario para manejar la navegación en el frontend con React Router.
        🔹 Dentro definimos las Rutas con <Routes> y cada <Route>.
      */}
      <Router>
        <Routes>

          {/* Ruta pública: Login */}
          {/* - Esta ruta carga la pantalla de inicio de sesión */}
          {/* - Desde aquí el usuario envía sus credenciales al backend (autenVerifi). */}
          <Route path="/" element={<Login />} />   

          {/* Ruta protegida: Home */}
          {/* - Aquí usamos ProtectedRoute como un "guardia" */}
          {/* - ProtectedRoute revisa si existe un token válido en localStorage */}
          {/* - Si no existe, redirige al Login */}
          {/* - Si existe, renderiza <Home /> */}
          <Route 
            path="/home" 
            element={
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
