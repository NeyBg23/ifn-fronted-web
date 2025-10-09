import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/Brigadas.css";  // 🧸 Importamos los estilos bonitos (crearemos este archivo después)

const Conglomerados = () => {
  const navigate = useNavigate();
  const [ruta, setRuta] = useState("Brigadas");  // 🧸 Cambia entre vistas (como páginas de un libro)
  const [conglomerados, setConglomerado] = useState([]);  // 🧸 Lista de conglomerados
  const [filtroNombre, setFiltroNombre] = useState(""); // 🧸 Estado para el filtro de nombre

  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";  // 🧸 Dirección del backend

  // 🧸 Paso mágico: Carga datos cuando entras a la página (como buscar tesoros al inicio del juego)
  useEffect(() => {
    const fetchData = async () => {
      const session = JSON.parse(localStorage.getItem("session"));  // 🧸 La llave (token) del login
      if (!session) return alert("¡Necesitas login! 🔑");

      // Pide conglomerados
      const resConglomerados = await fetch(`${API_URL}/api/conglomerados`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const dataConglomerados = await resConglomerados.json();
      setConglomerado(dataConglomerados.data || []);
    };
    fetchData();  // 🧸 Llama a la función
  }, []);  // 🧸 Solo corre una vez al entrar

  // 🧩 Filtrado dinámico (sin tocar el DOM)
  const conglomeradosFiltradas = conglomerados.filter((conglomerado) => {
    const coincideNombre = conglomerado.nombre
      ?.toLowerCase()
      .includes(filtroNombre.toLowerCase());

    return coincideNombre;
  });

  return (
    <div className="brigadas-container">  {/* 🧸 Contenedor principal, con CSS para fondo verde */}
      {ruta === "Brigadas" && (
        <div className="lista-brigadas">
          <h1>Conglomerados 🌳</h1>
          <p>Aquí puedes ver los Conglomerados existentes.</p>

          {/* 🧩 Filtro funcional */}
          <div className="card p-4 mb-4">
            <h5 className="mb-3">🔎 Filtrar Conglomerados</h5>
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
            </div>
          </div>


          {/* 🧸 Lista de brigadas como tarjetas (refleja la base) */}
          <div className="cards-grid">
            {conglomeradosFiltradas.map((conglomerado) => (
              <div key={conglomerado.id} className="card-brigada">
                <h3>{conglomerado.nombre}</h3>
                <p>Descripción: {conglomerado.descripcion || "No asignado"}</p>
                <p>Ubicación: {conglomerado.ubicacion}</p>
                <p>Fecha Creación: {conglomerado.fecha_creacion}</p>
                <br /> {/* Espacio antes del botón */}
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() => navigate(`/admin/conglomerados/${conglomerado.id}`)}
                >
                  Ver Conglomerado
                </button>
              </div>
            ))}

            {/* Si no hay resultados */}
            {conglomeradosFiltradas.length === 0 && (
              <p className="text-muted">No se encontraron conglomerados 😅</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Conglomerados;
