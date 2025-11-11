// 📄 src/pages/admin/AdminLayoutWrapper.jsx
// Wrapper que protege todo el layout admin

import { Outlet } from "react-router-dom";
import AdminLayout from "./AdminLayoutWrapper.jsx";

function AdminLayoutWrapper() {
  console.log("Renderizando AdminLayoutWrapper");
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

export default AdminLayoutWrapper;
