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
