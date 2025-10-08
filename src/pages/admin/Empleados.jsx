/**
 * 🌳 Empleados.jsx
 * ------------------------------------------------------------
 * Página principal para gestionar Empleados (Brigadistas)
 * - Lista todos los empleados registrados en la base.
 * - Permite crear nuevos empleados mediante un modal Bootstrap.
 */

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Upload, X, FileText, User, Mail, Phone, MapPin, CreditCard, FileUp } from "lucide-react";
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

  // 📄 Estado para la hoja de vida
  const [hojaVida, setHojaVida] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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
    const coincideNombre = empleado?.nombre_completo?.toLowerCase().includes(filtroNombre.toLowerCase());
    const coincideCorreo = empleado?.correo?.toLowerCase().includes(filtroCorreo.toLowerCase());
    const coincideCedula = empleado?.cedula?.toLowerCase().includes(filtroCedula.toLowerCase());
    const coincideRegion = filtroRegion === "" || empleado?.region === filtroRegion;
    return coincideNombre && coincideCorreo && coincideCedula && coincideRegion;
  });

  // 🧩 Manejo del formulario del modal
  const handleChange = (e) => {
    setNuevoEmpleado({ ...nuevoEmpleado, [e.target.name]: e.target.value });
  };

  // 📄 Manejo de archivo de hoja de vida
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert("Solo se permiten archivos PDF, DOC o DOCX");
        return;
      }

      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo no debe superar 5MB");
        return;
      }

      setHojaVida(file);
      setPreviewUrl(file.name);
    }
  };

  // 🗑️ Eliminar archivo
  const handleRemoveFile = () => {
    setHojaVida(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById("hojaVidaInput");
    if (fileInput) fileInput.value = "";
  };

  const handleCrearEmpleado = async (e) => {
    e.preventDefault();
    const session = JSON.parse(localStorage.getItem("session"));
    if (!session) return alert("¡Necesitas login! 🔑");

    // Si hay archivo, primero convertirlo a base64 y guardarlo en Supabase Storage
    let hojaVidaUrl = null;
    if (hojaVida) {
      try {
        // Convertir archivo a base64 para enviarlo junto con los datos
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(hojaVida);
        });
        const base64 = await base64Promise;

        // Por ahora guardamos el nombre del archivo, luego puedes implementar la subida a Supabase Storage
        hojaVidaUrl = hojaVida.name;
      } catch (error) {
        console.error("Error procesando archivo:", error);
      }
    }

    // Enviar solo JSON como espera el backend
    const res = await fetch(`${API_URL}/api/empleados`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        ...nuevoEmpleado,
        hoja_vida_nombre: hojaVidaUrl
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Empleado creado correctamente");
      setEmpleados([...empleados, data.empleado || data.data]);
      setNuevoEmpleado({
        nombre_completo: "",
        correo: "",
        cedula: "",
        region: "",
        telefono: "",
        descripcion: ""
      });
      handleRemoveFile();
      // Cierra el modal manualmente
      const modal = bootstrap.Modal.getInstance(document.getElementById("modalNuevoEmpleado"));
      modal.hide();
    } else {
      alert("❌ Error al crear empleado: " + (data.error || "Intenta nuevamente"));
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

        {/* 🧩 MODAL CREAR EMPLEADO - MEJORADO */}
        <div
          className="modal fade"
          id="modalNuevoEmpleado"
          tabIndex="-1"
          aria-labelledby="modalNuevoEmpleadoLabel"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-gradient-primary text-white border-0">
                <h5 className="modal-title d-flex align-items-center gap-2" id="modalNuevoEmpleadoLabel">
                  <User size={24} />
                  Crear Nuevo Empleado
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Cerrar"
                ></button>
              </div>

              <div className="modal-body p-4">
                <form onSubmit={handleCrearEmpleado} id="formNuevoEmpleado">
                  {/* Información Personal */}
                  <div className="mb-4">
                    <h6 className="text-primary mb-3 pb-2 border-bottom">
                      <User size={18} className="me-2" />
                      Información Personal
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <User size={16} className="me-1" />
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          name="nombre_completo"
                          className="form-control form-control-lg"
                          placeholder="Ej: Juan Pérez García"
                          value={nuevoEmpleado.nombre_completo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <CreditCard size={16} className="me-1" />
                          Cédula
                        </label>
                        <input
                          type="text"
                          name="cedula"
                          className="form-control form-control-lg"
                          placeholder="Ej: 1234567890"
                          value={nuevoEmpleado.cedula}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información de Contacto */}
                  <div className="mb-4">
                    <h6 className="text-primary mb-3 pb-2 border-bottom">
                      <Mail size={18} className="me-2" />
                      Información de Contacto
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <Mail size={16} className="me-1" />
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          name="correo"
                          className="form-control form-control-lg"
                          placeholder="correo@ejemplo.com"
                          value={nuevoEmpleado.correo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <Phone size={16} className="me-1" />
                          Teléfono
                        </label>
                        <input
                          type="text"
                          name="telefono"
                          className="form-control form-control-lg"
                          placeholder="Ej: 3001234567"
                          value={nuevoEmpleado.telefono}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div className="mb-4">
                    <h6 className="text-primary mb-3 pb-2 border-bottom">
                      <MapPin size={18} className="me-2" />
                      Ubicación
                    </h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <MapPin size={16} className="me-1" />
                          Región *
                        </label>
                        <select
                          name="region"
                          className="form-select form-select-lg"
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
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="mb-4">
                    <h6 className="text-primary mb-3 pb-2 border-bottom">
                      <FileText size={18} className="me-2" />
                      Información Adicional
                    </h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <FileText size={16} className="me-1" />
                          Descripción
                        </label>
                        <textarea
                          name="descripcion"
                          className="form-control"
                          placeholder="Describe la experiencia, habilidades especiales o información relevante..."
                          value={nuevoEmpleado.descripcion}
                          onChange={handleChange}
                          rows="3"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Hoja de Vida */}
                  <div className="mb-4">
                    <h6 className="text-primary mb-3 pb-2 border-bottom">
                      <FileUp size={18} className="me-2" />
                      Documentación
                    </h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <Upload size={16} className="me-1" />
                          Hoja de Vida
                        </label>

                        {!hojaVida ? (
                          <div className="border-2 border-dashed rounded p-4 text-center bg-light position-relative">
                            <input
                              type="file"
                              id="hojaVidaInput"
                              className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                              style={{ cursor: 'pointer' }}
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                            />
                            <Upload size={40} className="text-secondary mb-2" />
                            <p className="mb-1 fw-semibold">Haz clic para subir o arrastra aquí</p>
                            <p className="small text-muted mb-0">PDF, DOC o DOCX (Máx. 5MB)</p>
                          </div>
                        ) : (
                          <div className="border rounded p-3 bg-light d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                              <FileText size={24} className="text-primary" />
                              <div>
                                <p className="mb-0 fw-semibold">{previewUrl}</p>
                                <p className="small text-muted mb-0">
                                  {(hojaVida.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={handleRemoveFile}
                            >
                              <X size={18} />
                            </button>
                          </div>
                        )}
                        <small className="text-muted d-block mt-2">
                          Adjunta el CV del empleado en formato PDF, DOC o DOCX
                        </small>
                      </div>
                    </div>
                  </div>

                </form>
              </div>

              <div className="modal-footer bg-light border-0">
                <button
                  type="button"
                  className="btn btn-lg btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="formNuevoEmpleado"
                  className="btn btn-lg btn-primary"
                >
                  <User size={18} className="me-2" />
                  Guardar Empleado
                </button>
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
