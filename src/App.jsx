import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from "./components/Login";
import NoAutorizado from "./pages/NoAutorizado";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import HomeAdmin from "./pages/admin/Home";
import Brigadas from "./pages/Brigadas.jsx";
import Conglomerados from "./pages/Conglomerados.jsx";
import Empleados from "./pages/admin/Empleados";
import Perfil from "./pages/Perfil.jsx";
import BrigadaDetalle from "./pages/admin/info/BrigadaDetalle"; 
import EmpleadoDetalle from "./pages/admin/info/EmpleadoDetalle";
import ConglomeradoDetalle from "./pages/admin/info/ConglomeradoDetalle";
import ConformarBrigada from "./pages/admin/ConformarBrigada";
import ScrollToTop from "./pages/ScrollTop.jsx";
import HomeUser from "./pages/user/Home";
import "./styles/App.css";
import UserLayout from "./pages/user/UserLayout.jsx";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/no-autorizado" element={<NoAutorizado />} />

        {/* Rutas protegidas ADMIN */}
        <Route path="/admin/*" element={
          <ProtectedRoute component={AdminLayout} requiredRole="admin" />
        }>
          {/* Estas rutas están anidadas DENTRO de AdminLayout */}
          <Route index element={<HomeAdmin />} />
          
          <Route path="perfil" element={<Perfil />} />

            {/* RUTAS COMPARTIDAS (para que AdminLayout pueda acceder) */}
          <Route path="brigadas" element={<Brigadas />} />
          <Route path="brigadas/:idbrigada" element={<BrigadaDetalle />} />
          <Route path="conglomerados" element={<Conglomerados />} />
          <Route path="conglomerados/:idconglomerado" element={<ConglomeradoDetalle />} />

          {/* Rutas solo de administración/gestión (Crear brigada, Empleados) */}
          <Route path="brigadas/crear-nueva" element={<ConformarBrigada />} />
          <Route path="empleados" element={<Empleados />} />
          <Route path="empleados/:idempleado" element={<EmpleadoDetalle />} />
        </Route>

        {/* Rutas protegidas USER (Accesibles por cualquier usuario autenticado) */}
        <Route path="/user/*" element={
          <ProtectedRoute component={UserLayout}/>
        }>
          <Route index element={<HomeUser />} /> 
          <Route path="perfil" element={<Perfil />} /> 

            {/* RUTAS COMPARTIDAS (para que UserLayout pueda acceder) */}
          <Route path="brigadas" element={<Brigadas />} />
          <Route path="brigadas/:idbrigada" element={<BrigadaDetalle />} />
          <Route path="conglomerados" element={<Conglomerados />} />
          <Route path="conglomerados/:idconglomerado" element={<ConglomeradoDetalle />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;