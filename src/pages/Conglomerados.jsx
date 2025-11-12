// Para la animación de aparición de izquierda a su posición fija
import AOS from "aos";
import "aos/dist/aos.css";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Brigadas.css";  //  Importamos los estilos bonitos (crearemos este archivo después)

const Conglomerados = () => {
  const navigate = useNavigate();
  const [conglomerados, setConglomerado] = useState([]);  //  Lista de conglomerados
  const [filtroNombre, setFiltroNombre] = useState(""); //  Estado para el filtro de nombre
  const [filtroRegion, setFiltroRegion] = useState(""); //  Estado para el filtro de región

  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";  //  Dirección del backend

  //  Paso mágico: Carga datos cuando entras a la página (como buscar tesoros al inicio del juego)
  useEffect(() => {
    
    AOS.init({ duration: 900, easing: "ease-out", once: true });

    const fetchData = async () => {
      const session = JSON.parse(localStorage.getItem("session"));  //  La llave (token) del login
      if (!session) return alert("¡Necesitas login! 🔑");

      // Pide conglomerados
      const resConglomerados = await fetch(`${API_URL}/api/conglomerados`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const dataConglomerados = await resConglomerados.json();
      setConglomerado(dataConglomerados.data || []);
    };
    fetchData();  //  Llama a la función
  }, []);  //  Solo corre una vez al entrar

  // 🧩 Filtrado dinámico (sin tocar el DOM)
  const conglomeradosFiltradas = conglomerados.filter((conglomerado) => {
    const coincideNombre = conglomerado.nombre
      ?.toLowerCase()
      .includes(filtroNombre.toLowerCase());
    const coincideRegion =
      filtroRegion === "" || conglomerado.region === filtroRegion;

    return coincideNombre && coincideRegion;
  });

  return (
    <div className="brigadas-container">  {/*  Contenedor principal, con CSS para fondo verde */}
        <div className="lista-brigadas">
          <h1>Conglomerados 🌳</h1>
          <p>Aquí puedes ver los Conglomerados existentes.</p>

          {/* 🧩 Filtro funcional */}
          <div className="card p-4 mb-4">
            <h5 className="mb-3">🔎 Filtrar Brigadas</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre..."
                  value={filtroNombre}
                  onChange={(e) => setFiltroNombre(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <select
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


          {/*  Lista de brigadas como tarjetas (refleja la base) */}
          <div data-aos="fade-up" className="cards-grid">
            {conglomeradosFiltradas.map((conglomerado) => (
              <div key={conglomerado.id} className="card-brigada">
                <h3>{conglomerado.nombre}</h3>
                <p>Descripción: {conglomerado.descripcion || "No asignado"}</p>
                <p>Región: {conglomerado.region}</p>
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
    </div>
  );
};

export default Conglomerados;
