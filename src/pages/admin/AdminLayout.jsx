import { Outlet } from 'react-router-dom'; // Importa el componente Outlet para renderizado de sub-rutas
import Header from '../components/Header.jsx'; // Importa el header común para panel admin

// Componente de layout para toda el área administrativa
const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* El header se muestra siempre en la parte superior */}
      <Header />
      {/* Área principal donde se renderizan las sub-rutas (páginas de admin) mediante Outlet */}
      <main className="content p-4 mt-5">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;