import { Outlet } from 'react-router-dom';
import Header from '../components/Header.jsx';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Header />
      {/* 👇 Contenido principal donde se renderizan las sub-rutas */}
      <main className="content p-4 mt-5">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;