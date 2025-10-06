// 📂 src/pages/admin/Empleados.jsx
import { useEffect, useState } from "react";
import "../../styles/Home.css";

const Empleados = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Trae la lista de usuarios desde tu backend de AutenVerifi o Brigadas
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("session"))?.session?.access_token;
        const res = await fetch(`${import.meta.env.VITE_AUTH_SERVICE_URL}/auth/usuarios`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUsuarios(data.usuarios || []);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) return <p>Cargando empleados...</p>;

  return (
    <div className="empleados-container">
      <h1>Empleados</h1>
      <p>Lista de usuarios registrados en el sistema.</p>

      <div className="cards-container">
        {usuarios.map((u) => (
          <div key={u.id} className="card-empleado">
            <div className="card-header">
              <h3>{u.nombre_completo}</h3>
              <span className={`rol-badge ${u.rol}`}>{u.rol}</span>
            </div>
            <p><b>Correo:</b> {u.correo}</p>
            <p><b>Descripción:</b> {u.descripcion || "Sin descripción"}</p>
            <p><b>Fecha de registro:</b> {new Date(u.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Empleados;
