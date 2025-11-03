import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute.jsx';
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

// Páginas Usuario normal
import HomeUser from "./pages/user/Home";

import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas ADMIN */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<HomeAdmin />} />
          <Route path="brigadas" element={<Brigadas />} />
          <Route path="brigadas/:idbrigada" element={<BrigadaDetalle />} />
          <Route path="brigadas/crear-nueva" element={<ConformarBrigada />} />
          <Route path="conglomerados" element={<Conglomerados />} />
          <Route path="conglomerados/:idconglomerado" element={<ConglomeradoDetalle />} />
          <Route path="empleados" element={<Empleados />} />
          <Route path="empleados/:idempleado" element={<EmpleadoDetalle />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>

        {/* Rutas protegidas USER */}
        <Route path="/user" element={
          <ProtectedRoute>
            <HomeUser />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
