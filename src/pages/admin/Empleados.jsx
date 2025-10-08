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

const Empleados = () => {
  const navigate = useNavigate();
  const [ruta, setRuta] = useState("Empleados");  // 🧸 Cambia entre vistas (como páginas de un libro)
  const [empleados, setEmpleados] = useState([]);  // 🧸 Lista de empleados
  const [filtroNombre, setFiltroNombre] = useState(""); // 🧸 Estado para el filtro de nombre
  const [filtroRegion, setFiltroRegion] = useState(""); // 🧸 Estado para el filtro de región
  const [filtroCorreo, setFiltroCorreo] = useState(""); // 🧸 Estado para el filtro de correo
  const [filtroCedula, setFiltroCedula] = useState(""); // 🧸 Estado para el filtro de cédula

  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";  // 🧸 Dirección del backend

  // 🧸 Paso mágico: Carga datos cuando entras a la página (como buscar tesoros al inicio del juego)
  useEffect(() => {
    const fetchData = async () => {
      const session = JSON.parse(localStorage.getItem("session"));  // 🧸 La llave (token) del login
      if (!session) return alert("¡Necesitas login! 🔑");

      // Pide empleados
      const resEmpleados = await fetch(`${API_URL}/api/empleados`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const dataEmpleados = await resEmpleados.json();
      setEmpleados(dataEmpleados.data || []);
    };
    fetchData();  // 🧸 Llama a la función
  }, []);  // 🧸 Solo corre una vez al entrar

  // 🧩 Filtrado dinámico (sin tocar el DOM)
  const empleadosFiltrados = empleados.filter((empleado) => {
    const coincideNombre = empleado.nombre_completo
      ?.toLowerCase()
      .includes(filtroNombre.toLowerCase());
    const coincideCorreo = empleado.correo
      ?.toLowerCase()
      .includes(filtroCorreo.toLowerCase());
    const coincideCedula = empleado.cedula
      ?.toLowerCase()
      .includes(filtroCedula.toLowerCase());
    const coincideRegion =
      filtroRegion === "" || empleado.region === filtroRegion;

    return coincideNombre && coincideCorreo && coincideCedula && coincideRegion;
  });

  return (
    <div className="brigadas-container">  {/* 🧸 Contenedor principal, con CSS para fondo verde */}
      {ruta === "Empleados" && (
        <div className="lista-brigadas">
          <h1>Empleados</h1>
          <p>Aquí puedes ver los empleados existentes.</p>

          {/* 🧩 Filtro funcional */}
          <div className="card p-4 mb-4">
            <h5 className="mb-3">🔎 Filtrar Empleados</h5>
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
              <div className="col-md-4">
                <input
                  type="text"
                  id="filtroCorreo"
                  className="form-control"
                  placeholder="Buscar por correo..."
                  value={filtroCorreo}
                  onChange={(e) => setFiltroCorreo(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  id="filtroCedula"
                  className="form-control"
                  placeholder="Buscar por cédula..."
                  value={filtroCedula}
                  onChange={(e) => setFiltroCedula(e.target.value)}
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

          <p>Aquí puedes crear un nuevo empleado.</p>
          <button
            className="btn-crear"
            onClick={() => setRuta("CrearEmpleado")}
          >
            Crear Nuevo Empleado 🛡️
          </button>

          {/* 🧸 Lista de empleados como tarjetas (refleja la base) */}
          <div className="cards-grid">
            {empleadosFiltrados.map((empleado) => (

              <div key={empleado.id} className="card-brigada">

                <h3>{empleado.nombre_completo}</h3>
                <p><strong>Correo: </strong>{empleado.correo}</p>
                <p><strong>Cédula: </strong>{empleado.cedula || "No disponible"}</p>
                <p><strong>Región: </strong>{empleado.region}</p>
                <p><strong>Descripción: </strong>{empleado.descripcion}</p>
                <p><strong>Teléfono: </strong>{empleado.telefono || "No disponible"}</p>
                <p><strong>Fecha Ingreso: </strong>{empleado.fecha_ingreso || "No disponible"}</p>

                <br /> {/* Espacio antes del botón */}

                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() => navigate(`/admin/empleados/${empleado.id}`)}
                >
                  Ver Empleado
                </button>
              </div>
            ))}

            {/* Si no hay resultados */}
            {empleadosFiltrados.length === 0 && (
              <p className="text-muted">No se encontraron empleados 😅</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Empleados;
