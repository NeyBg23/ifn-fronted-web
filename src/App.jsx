// 📄 src/App.jsx
// Componente principal de la aplicación
// Define todas las rutas y protecciones de acceso

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from "./components/Login";

// Páginas Admin
import AdminLayout from "./pages/admin/AdminLayout";
import HomeAdmin from "./pages/admin/Home";
import Brigadas from "./pages/admin/Brigadas";
import Conglomerados from "./pages/admin/Conglomerados";
import Empleados from "./pages/admin/Empleados";
import Perfil from "./pages/admin/Perfil";
import BrigadaDetalle from "./pages/admin/info/BrigadaDetalle"; 
import EmpleadoDetalle from "./pages/admin/info/EmpleadoDetalle";
import ConglomeradoDetalle from "./pages/admin/info/ConglomeradoDetalle";
import ConformarBrigada from "./pages/admin/ConformarBrigada";

// Páginas Usuario normal (brigadista)
import HomeUser from "./pages/user/Home";

import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* ============================================
            RUTAS PÚBLICAS (sin autenticación)
            ============================================ */}
        
        {/* Ruta raíz "/" redirige a login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Ruta de login (pública) */}
        <Route path="/login" element={<Login />} />

        {/* ============================================
            RUTAS PROTEGIDAS - ADMIN
            ============================================ */}
        
        {/* Layout principal del admin con navbar y sidebar */}
        <Route path="/admin" element={
          <ProtectedRoute component={AdminLayout} />
        } />

          {/* Subrutas dentro del layout admin */}
          
          {/* Home del admin */}
          <Route index element={<HomeAdmin />} /> {/* /admin */}
          
          {/* Gestión de Brigadas */}
          <Route path="brigadas" element={<Brigadas />} /> {/* /admin/brigadas */}
          <Route path="brigadas/:idbrigada" element={<BrigadaDetalle />} /> {/* /admin/brigadas/:id */}
          <Route path="brigadas/crear-nueva" element={<ConformarBrigada />} /> {/* /admin/brigadas/crear-nueva */}
          
          {/* Gestión de Conglomerados */}
          <Route path="conglomerados" element={<Conglomerados />} /> {/* /admin/conglomerados */}
          <Route path="conglomerados/:idconglomerado" element={<ConglomeradoDetalle />} /> {/* /admin/conglomerados/:id */}
          
          {/* Gestión de Empleados */}
          <Route path="empleados" element={<Empleados />} /> {/* /admin/empleados */}
          <Route path="empleados/:idempleado" element={<EmpleadoDetalle />} /> {/* /admin/empleados/:id */}
          
          {/* Perfil del usuario */}
          <Route path="perfil" element={<Perfil />} /> {/* /admin/perfil */}
        </Route>

        {/* ============================================
            RUTAS PROTEGIDAS - USUARIO NORMAL (Brigadista)
            ============================================ */}
        
        <Route path="/user" element={
          <ProtectedRoute component={HomeUser} />
        } />

        {/* ============================================
            RUTA FALLBACK (404)
            ============================================ */}
        
        {/* Si no coincide ninguna ruta, redirige a login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
