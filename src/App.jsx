import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

        {/* Ruta pública, login no necesita autenticación */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas para ADMIN y otros roles dentro del Layout administrador */}
        <Route
          path="/admin"
          element={
            // Protegemos con ProtectedRoute (requiere sesión válida)
            <ProtectedRoute>
              <AdminLayout /> {/* Layout común con navbar para todas las rutas /admin */}
            </ProtectedRoute>
          }
        >
          {/* Dentro del layout protegemos cada subruta también con ProtectedRoute */}
          <Route
            path="/admin/brigadas/:idbrigada"
            element={
              <ProtectedRoute>
                <BrigadaDetalle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/brigadas/crear-nueva"
            element={
              <ProtectedRoute>
                <ConformarBrigada />
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

          {/* Otras rutas administrativas */}
          <Route index element={<HomeAdmin />} /> {/* /admin */}
          <Route path="brigadas" element={<Brigadas />} /> {/* /admin/brigadas */}
          <Route path="conglomerados" element={<Conglomerados />} /> {/* /admin/conglomerados */}
          <Route path="empleados" element={<Empleados />} /> {/* /admin/empleados */}
          <Route path="perfil" element={<Perfil />} /> {/* /admin/perfil */}
        </Route>

        {/* Rutas para usuario normal (brigadista) */}
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
