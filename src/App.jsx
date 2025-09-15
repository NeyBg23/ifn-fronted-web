// 1️ IMPORTAR LAS HERRAMIENTAS NECESARIAS
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Login from "./components/Login";   
import Home from "./pages/Home";
import "./styles/App.css";
import ProtectedRoute from "./components/ProtectedRoute";

// 2️ DEFINIR EL COMPONENTE PRINCIPAL
function App() {
  return (
    <div className="App">
      {/* Envolvemos todo con Router */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />   {/* Página inicial */}
          <Route path="/home" element={<ProtectedRoute > <Home/> </ProtectedRoute>} /> {/* Página Home */}
        </Routes>
      </Router>
    </div>
  );
}

// 3️ EXPORTAR EL COMPONENTE PARA USARLO EN OTROS LADOS
export default App;
