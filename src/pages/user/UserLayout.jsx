import { Outlet } from 'react-router-dom';
import Header from '../Header.jsx';

const UserLayout = () => {
  return (
    <>
      <Header />
      {/* 👇 Contenido principal donde se renderizan las sub-rutas */}
      <main className="content p-4 mt-5">
        <Outlet />
      </main>
    </>
  );
};

export default UserLayout;