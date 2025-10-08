/**
 * 🌳 Empleados.jsx
 * ------------------------------------------------------------
 * Página principal para gestionar Empleados (Brigadistas)
 * - Lista todos los empleados registrados en la base.
 * - Permite crear nuevos empleados mediante un modal Bootstrap.
 */

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/Brigadas.css";  // 🧸 Reusa tus estilos

const Empleados = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroRegion, setFiltroRegion] = useState("");
  const [filtroCorreo, setFiltroCorreo] = useState("");
  const [filtroCedula, setFiltroCedula] = useState("");

  // 🧩 Estados para el nuevo empleado
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre_completo: "",
    correo: "",
    cedula: "",
    region: "",
    telefono: "",
    descripcion: ""
  });

  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

  // 🧸 Cargar empleados al iniciar
  useEffect(() => {
    const fetchData = async () => {
      const session = JSON.parse(localStorage.getItem("session"));
      if (!session) return alert("¡Necesitas login! 🔑");

      const res = await fetch(`${API_URL}/api/empleados`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      setEmpleados(data.data || []);
    };
    fetchData();
  }, []);

  // 🧩 Filtrado dinámico
  const empleadosFiltrados = empleados.filter((empleado) => {
    const coincideNombre = empleado.nombre_completo?.toLowerCase().includes(filtroNombre.toLowerCase());
    const coincideCorreo = empleado.correo?.toLowerCase().includes(filtroCorreo.toLowerCase());
    const coincideCedula = empleado.cedula?.toLowerCase().includes(filtroCedula.toLowerCase());
    const coincideRegion = filtroRegion === "" || empleado.region === filtroRegion;
    return coincideNombre && coincideCorreo && coincideCedula && coincideRegion;
  });

  // 🧩 Manejo del formulario del modal
  const handleChange = (e) => {
    setNuevoEmpleado({ ...nuevoEmpleado, [e.target.name]: e.target.value });
  };

  const handleCrearEmpleado = async (e) => {
    e.preventDefault();
    const session = JSON.parse(localStorage.getItem("session"));
    if (!session) return alert("¡Necesitas login! 🔑");

    const res = await fetch(`${API_URL}/api/empleados`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(nuevoEmpleado),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Empleado creado correctamente");
      setEmpleados([...empleados, data.data]);
      setNuevoEmpleado({
        nombre_completo: "",
        correo: "",
        cedula: "",
        region: "",
        telefono: "",
        descripcion: ""
      });
      // Cierra el modal manualmente
      const modal = bootstrap.Modal.getInstance(document.getElementById("modalNuevoEmpleado"));
      modal.hide();
    } else {
      alert("❌ Error al crear empleado: " + (data.message || "Intenta nuevamente"));
    }
  };

  return (
    <div className="brigadas-container">
      <div className="lista-brigadas">
        <h1>Empleados</h1>
        <p>Aquí puedes ver los empleados existentes.</p>

        {/* 🔎 FILTRO */}
        <div className="card p-4 mb-4">
          <h5 className="mb-3">🔎 Filtrar Empleados</h5>
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
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por correo..."
                value={filtroCorreo}
                onChange={(e) => setFiltroCorreo(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por cédula..."
                value={filtroCedula}
                onChange={(e) => setFiltroCedula(e.target.value)}
              />
            </div>
            <div className="col-md-4 mb-2">
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

        {/* ➕ BOTÓN PARA ABRIR MODAL */}
        <p>Aquí puedes crear un nuevo empleado.</p>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalNuevoEmpleado"
        >
          Crear Nuevo Empleado 🛡️
        </button>

        {/* 🧩 MODAL CREAR EMPLEADO */}
        <div
          className="modal fade"
          id="modalNuevoEmpleado"
          tabIndex="-1"
          aria-labelledby="modalNuevoEmpleadoLabel"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalNuevoEmpleadoLabel">
                  🧑‍💼 Crear Nuevo Empleado
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Cerrar"
                ></button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleCrearEmpleado}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre completo</label>
                      <input
                        type="text"
                        name="nombre_completo"
                        className="form-control"
                        value={nuevoEmpleado.nombre_completo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Correo</label>
                      <input
                        type="email"
                        name="correo"
                        className="form-control"
                        value={nuevoEmpleado.correo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Cédula</label>
                      <input
                        type="text"
                        name="cedula"
                        className="form-control"
                        value={nuevoEmpleado.cedula}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Teléfono</label>
                      <input
                        type="text"
                        name="telefono"
                        className="form-control"
                        value={nuevoEmpleado.telefono}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Región</label>
                      <select
                        name="region"
                        className="form-select"
                        value={nuevoEmpleado.region}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecciona una región</option>
                        <option value="Amazonía">Amazonía</option>
                        <option value="Pacífico">Pacífico</option>
                        <option value="Andina">Andina</option>
                        <option value="Caribe">Caribe</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Descripción</label>
                      <textarea
                        name="descripcion"
                        className="form-control"
                        value={nuevoEmpleado.descripcion}
                        onChange={handleChange}
                        rows="2"
                      ></textarea>
                    </div>
                  </div>

                  <div className="modal-footer mt-3">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Guardar Empleado
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* 🧸 LISTA DE EMPLEADOS */}
        <div className="cards-grid mt-4">
          {empleadosFiltrados.map((empleado) => (
            <div key={empleado.id} className="card-brigada">
              <h3>{empleado.nombre_completo}</h3>
              <p><strong>Correo:</strong> {empleado.correo}</p>
              <p><strong>Cédula:</strong> {empleado.cedula || "No fue asignada"}</p>
              <p><strong>Región:</strong> {empleado.region}</p>
              <p><strong>Descripción:</strong> {empleado.descripcion}</p>
              <p><strong>Teléfono:</strong> {empleado.telefono || "No fue asignado"}</p>
              <p><strong>Fecha Ingreso:</strong> {empleado.fecha_ingreso || "No fue asignada"}</p>

              <button
                type="button"
                className="btn btn-outline-success mt-2"
                onClick={() => navigate(`/admin/empleados/${empleado.id}`)}
              >
                Ver Empleado
              </button>
            </div>
          ))}
          {empleadosFiltrados.length === 0 && <p className="text-muted">No se encontraron empleados 😅</p>}
        </div>
      </div>
    </div>
  );
};

export default Empleados;
