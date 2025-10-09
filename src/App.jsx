import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./pages/admin/AdminLayout";
import HomeAdmin from "./pages/admin/Home";
import Brigadas from "./pages/admin/Brigadas";
import Conglomerados from "./pages/admin/Conglomerados";
import Empleados from "./pages/admin/Empleados";
import Perfil from "./pages/admin/Perfil";
import HomeUser from "./pages/user/Home";

import BrigadaDetalle from "./pages/admin/info/BrigadaDetalle"; 
import EmpleadoDetalle from "./pages/admin/info/EmpleadoDetalle";
import ConglomeradoDetalle from "./pages/admin/info/ConglomeradoDetalle";

import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Público */}
        <Route path="/" element={<Login />} />

        {/* Admin - layout común con navbar */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout /> {/* Layout con navbar */}
            </ProtectedRoute>
          }
        >
          <Route
            path="/admin/brigadas/:idbrigada"
            element={
              <ProtectedRoute>
                <BrigadaDetalle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/empleados/:idempleado"
            element={
              <ProtectedRoute>
                <EmpleadoDetalle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/conglomerados/:idconglomerado"
            element={
              <ProtectedRoute>
                <ConglomeradoDetalle />
              </ProtectedRoute>
            }
          />

          <Route index element={<HomeAdmin />} /> {/* Ruta por defecto /admin */}
          <Route path="brigadas" element={<Brigadas />} /> {/* /admin/brigadas */}
          <Route path="conglomerados" element={<Conglomerados />} /> {/* /admin/conglomerados */}
          <Route path="empleados" element={<Empleados />} /> {/* /admin/empleados */}
          <Route path="perfil" element={<Perfil />} /> {/* /admin/perfil */}
        </Route>

        {/* User */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <HomeUser />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
