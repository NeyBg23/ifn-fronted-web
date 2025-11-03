import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from "./components/Login";
import NoAutorizado from "./pages/NoAutorizado";

import AdminLayoutWrapper from "./pages/admin/AdminLayoutWrapper";
import HomeAdmin from "./pages/admin/Home";
import Brigadas from "./pages/admin/Brigadas";
import Conglomerados from "./pages/admin/Conglomerados";
import Empleados from "./pages/admin/Empleados";
import Perfil from "./pages/admin/Perfil";
import BrigadaDetalle from "./pages/admin/info/BrigadaDetalle"; 
import EmpleadoDetalle from "./pages/admin/info/EmpleadoDetalle";
import ConglomeradoDetalle from "./pages/admin/info/ConglomeradoDetalle";
import ConformarBrigada from "./pages/admin/ConformarBrigada";

import HomeUser from "./pages/user/Home";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/no-autorizado" element={<NoAutorizado />} />

        {/* Rutas protegidas ADMIN */}
        <Route path="/admin/*" element={
          <ProtectedRoute component={AdminLayoutWrapper} requiredRole="admin" />
        }>
          {/* Estas rutas dentro están protegidas */}
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

        {/* Rutas protegidas USER - sin rol específico (cualquier usuario autenticado) */}
        <Route path="/user" element={
          <ProtectedRoute component={HomeUser} />
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
