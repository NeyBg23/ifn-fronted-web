/**
 * 🌳 Brigadas.jsx
 * ------------------------------------------------------------
 * Página principal para gestionar Brigadas y Empleados (Brigadistas)
 * - Lista todos los usuarios registrados en la base.
 * - Permite crear nuevos empleados.
 * - Permite ver o crear brigadas (agrupaciones de empleados).
 */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/Brigadas.css";  // 🧸 Importamos los estilos bonitos (crearemos este archivo después)
import { useAuth } from "../../hooks/useAuth.jsx";

const Brigadas = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [ruta, setRuta] = useState("Brigadas");  // 🧸 Cambia entre vistas (como páginas de un libro)
  const [brigadas, setBrigadas] = useState([]);  // 🧸 Lista de brigadas
  const [filtroNombre, setFiltroNombre] = useState(""); // 🧸 Estado para el filtro de nombre
  const [filtroRegion, setFiltroRegion] = useState(""); // 🧸 Estado para el filtro de región

  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";  // 🧸 Dirección del backend

  // 🧸 Paso mágico: Carga datos cuando entras a la página (como buscar tesoros al inicio del juego)
  useEffect(() => {
    const fetchData = async () => {
      const session = JSON.parse(localStorage.getItem("session"));  // 🧸 La llave (token) del login
      if (!session) return alert("¡Necesitas login! 🔑");

      // Pide brigadas
      const resBrigadas = await fetch(`${API_URL}/api/brigadas`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const dataBrigadas = await resBrigadas.json();
      setBrigadas(dataBrigadas.data || []);
    };
    fetchData();  // 🧸 Llama a la función
  }, []);  // 🧸 Solo corre una vez al entrar

  // 🧩 Filtrado dinámico (sin tocar el DOM)
  const brigadasFiltradas = brigadas.filter((brigada) => {
    const coincideNombre = brigada.nombre
      ?.toLowerCase()
      .includes(filtroNombre.toLowerCase());
    const coincideRegion =
      filtroRegion === "" || brigada.region === filtroRegion;

    return coincideNombre && coincideRegion;
  });

  return (
    <div className="brigadas-container">  {/* 🧸 Contenedor principal, con CSS para fondo verde */}
      {ruta === "Brigadas" && (
        <div className="lista-brigadas">
          <h1>Brigadas del Bosque 🌳</h1>
          <p>Aquí puedes ver las brigadas existentes.</p>

          {/* 🧩 Filtro funcional */}
          <div className="card p-4 mb-4">
            <h5 className="mb-3">🔎 Filtrar Brigadas</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  id="filtroNombre"
                  className="form-control"
                  placeholder="Buscar por nombre..."
                  value={filtroNombre}
                  onChange={(e) => setFiltroNombre(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-2">
                <select
                  id="filtroRegion"
                  className="form-select"
                  value={filtroRegion}
                  onChange={(e) => setFiltroRegion(e.target.value)}
                >
                  <option value="">Todas las regiones</option>
                  <option value="Amazonía">Amazonía</option>
                  <option value="Pacífico">Pacífico</option>
                  <option value="Andina">Andina</option>
                  <option value="Caribe">Caribe</option>
                </select>
              </div>
            </div>
          </div>

          {
            user && user.usuario.rol === 'admin' && (

            <div className="mb-4">
              <p>Aquí puedes crear una nueva brigada.</p>
                <button
                  className="btn-crear"
                  onClick={() => navigate(`/admin/brigadas/crear-nueva`)}
                >
                  Crear Nueva Brigada 🛡️
                </button>
            </div>
          )}

          <p>Aquí puedes crear una nueva brigada.</p>
          <button
            className="btn-crear"
            onClick={() => navigate(`/admin/brigadas/crear-nueva`)}
          >
            Crear Nueva Brigada 🛡️
          </button>

          {/* 🧸 Lista de brigadas como tarjetas (refleja la base) */}
          <div className="cards-grid">
            {brigadasFiltradas.map((brigada) => (
              <div key={brigada.id} className="card-brigada">
                <h3>{brigada.nombre}</h3>
                <p>Responsable: {brigada.jefe_brigada || "No asignado"}</p>
                <p>Región: {brigada.region}</p>
                <p>Miembros: 5</p>
                <p>Estado: <span className={`status-${brigada.estado.toLowerCase()}`}>
                  {brigada.estado}
                </span></p>
                <br /> {/* Espacio antes del botón */}
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() => navigate(`/admin/brigadas/${brigada.id}`)}
                >
                  Ver Brigada
                </button>
              </div>
            ))}

            {/* Si no hay resultados */}
            {brigadasFiltradas.length === 0 && (
              <p className="text-muted">No se encontraron brigadas 😅</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Brigadas;
