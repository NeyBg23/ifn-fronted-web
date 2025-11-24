import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Importa componentes y hooks necesarios de react-router-dom para la gestión de rutas.

import ProtectedRoute from './components/ProtectedRoute.jsx';
// Componente de envoltura clave que verifica la autenticación y el rol del usuario antes de renderizar la ruta.

// Importación de páginas y componentes de diseño (Layouts)
import Login from "./components/Login";
import NoAutorizado from "./pages/NoAutorizado";
import AdminLayout from "./pages/admin/AdminLayout.jsx"; // Layout principal para usuarios 'admin'
import Home from "./pages/Home.jsx";
import Brigadas from "./pages/Brigadas.jsx";
import Conglomerados from "./pages/Conglomerados.jsx";
import Empleados from "./pages/admin/Empleados";
import Perfil from "./pages/Perfil.jsx";
// Páginas de detalle de información
import BrigadaDetalle from "./pages/admin/info/BrigadaDetalle"; 
import EmpleadoDetalle from "./pages/admin/info/EmpleadoDetalle";
import ConglomeradoDetalle from "./pages/admin/info/ConglomeradoDetalle";
// Páginas de acción de administrador
import ConformarBrigada from "./pages/admin/ConformarBrigada";
import NuevoEmpleado from "./pages/admin/NuevoEmpleado.jsx";
// Páginas de usuario
import LevantamientoDatos from "./pages/LevantamientoDatos.jsx";
import UserLayout from "./pages/user/UserLayout.jsx"; // Layout principal para usuarios estándar/brigadistas

import ScrollToTop from "./pages/ScrollTop.jsx";
// Componente auxiliar para asegurar que la página se desplace al inicio en cada cambio de ruta.

import "./styles/App.css"; // Estilos globales (asumiendo que contiene CSS general o Tailwind imports)

function App() {
  return (
    <Router>
      {/* Llama a ScrollToTop para que se ejecute en cada cambio de URL */}
      <ScrollToTop />
      <Routes>
        
        {/* --------------------- Rutas públicas --------------------- */}
        
        {/* Redirección inicial: Si el usuario accede a la raíz, es enviado al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Pantalla de inicio de sesión */}
        <Route path="/login" element={<Login />} />
        {/* Página mostrada cuando un usuario no tiene los permisos necesarios (Error 403) */}
        <Route path="/no-autorizado" element={<NoAutorizado />} />

        {/* --------------------- Rutas protegidas ADMIN --------------------- */}
        
        {/* Ruta de layout para la administración, protegida y requiriendo el rol 'admin' */}
        <Route 
          path="/admin/*" 
          element={<ProtectedRoute component={AdminLayout} requiredRole="admin" />}
        >
          {/* Ruta índice (/admin) */}
          <Route index element={<Home />} />
          
          {/* Perfil del administrador */}
          <Route path="perfil" element={<Perfil />}/>

          {/* RUTAS COMPARTIDAS (Accesibles tanto por admin como por user, pero bajo el layout Admin) */}
          <Route path="brigadas" element={<Brigadas />} />
          <Route path="brigadas/:idbrigada" element={<BrigadaDetalle />} />
          <Route path="conglomerados" element={<Conglomerados />} />
          <Route path="conglomerados/:idconglomerado" element={<ConglomeradoDetalle />} />

          {/* Rutas específicas de gestión administrativa */}
          <Route path="nuevoEmpleado" element={<NuevoEmpleado/>}></Route>
          <Route path="brigadas/crear-nueva" element={<ConformarBrigada />} />
          <Route path="empleados" element={<Empleados />} />
          <Route path="empleados/:idempleado" element={<EmpleadoDetalle />} />
        </Route>

        {/* --------------------- Rutas protegidas USER/Brigadista --------------------- */}
        
        {/* Ruta de layout para usuarios estándar. No requiere 'requiredRole' específico,
            por lo que cualquier usuario autenticado puede acceder. */}
        <Route 
          path="/user/*" 
          element={<ProtectedRoute component={UserLayout}/>}
        >
          {/* Ruta índice (/user) */}
          <Route index element={<Home />} /> 
          {/* Perfil del usuario */}
          <Route path="perfil" element={<Perfil /> } />
          {/* Funcionalidad principal del brigadista */}
          <Route path="levantamiento-datos" element={<LevantamientoDatos />} /> 

          {/* RUTAS COMPARTIDAS (Accesibles tanto por admin como por user, pero bajo el layout User) */}
          <Route path="brigadas" element={<Brigadas />} />
          <Route path="brigadas/:idbrigada" element={<BrigadaDetalle />} />
          <Route path="conglomerados" element={<Conglomerados />} />
          <Route path="conglomerados/:idconglomerado" element={<ConglomeradoDetalle />} />
        </Route>

        {/* Fallback (Rutas no definidas) */}
        {/* Cualquier otra ruta no encontrada redirige al login. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;