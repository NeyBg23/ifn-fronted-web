// 📂 src/components/Empleados.jsx
// =============================================================
// 🌳 Empleados.jsx
// -------------------------------------------------------------
// Página para gestionar Empleados (Brigadistas):
//  - Carga la lista de empleados desde el backend.
//  - Filtra por nombre, correo, cédula y región.
//  - Permite crear nuevos empleados mediante un modal Bootstrap.
// =============================================================

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Upload, X, FileText, User, Mail, Phone, MapPin,
  CreditCard, FileUp, Text
} from "lucide-react";
import "../../styles/Brigadas.css";
import supabase from "../../db/supabase";
import empleado_imagen from "../../img/empleado.png";

export default function Empleados() {
  const navigate = useNavigate();

  // Estado para lista de empleados y filtros
  const [empleados, setEmpleados] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCorreo, setFiltroCorreo] = useState("");
  const [filtroCedula, setFiltroCedula] = useState("");
  const [filtroRegion, setFiltroRegion] = useState("");
  const [mostrarErrorContraseña, setMostrarErrorContraseña] = useState(false);

  // Estado para nuevo empleado (todos los campos)
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre_completo: "",
    contraseña: "",
    confirmarContraseña: "",
    correo: "",
    cedula: "",
    region: "",
    telefono: "",
    direccion: "",
    descripcion: "",
    cargo: "",
    fecha_ingreso: "",
    rol: "brigadista"
  });

  // Estado para manejo de archivo
  const [hojaVida, setHojaVida] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

  // Carga inicial de empleados
  useEffect(() => {
    (async () => {
      const session = JSON.parse(localStorage.getItem("session"));
      if (!session) return alert("¡Necesitas login! 🔑");
      const res = await fetch(`${API_URL}/api/empleados`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      setEmpleados(data.data || []);
    })();
  }, []);

  // Filtra empleados según inputs
  const empleadosFiltrados = empleados.filter(emp => {
    const n = emp.nombre_completo.toLowerCase().includes(filtroNombre.toLowerCase());
    const c = emp.correo.toLowerCase().includes(filtroCorreo.toLowerCase());
    const ced = emp.cedula?.toLowerCase().includes(filtroCedula.toLowerCase());
    const r = !filtroRegion || emp.region === filtroRegion;
    return n && c && ced && r;
  });

  // Manejo de cambios en formulario
  const handleChange = e => {
    const { name, value } = e.target;
    setNuevoEmpleado(prev => ({ ...prev, [name]: value }));
  };

  // Manejo de archivo
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if (!allowed.includes(file.type)) return alert("Solo PDF, DOC o DOCX");
    if (file.size > 5 * 1024 * 1024) return alert("Máx 5MB");
    setHojaVida(file);
    setPreviewUrl(file.name);
  };

  // Elimina archivo seleccionado
  const handleRemoveFile = () => {
    setHojaVida(null);
    setPreviewUrl(null);
    const inp = document.getElementById("hojaVidaInput");
    if (inp) inp.value = "";
  };

  // Envía creación de empleado
  const handleCrearEmpleado = async e => {
    e.preventDefault();
    setMostrarErrorContraseña(false);
    const session = JSON.parse(localStorage.getItem("session"));
    if (!session) return alert("¡Necesitas login! 🔑");
    if (nuevoEmpleado.contraseña !== nuevoEmpleado.confirmarContraseña) {
      return setMostrarErrorContraseña(true);
    }

    // Subir CV si existe
    let hoja_vida_url = null;
    if (hojaVida) {
      const path = `empleados/${Date.now()}_${hojaVida.name}`;
      const { error: upErr } = await supabase.storage
        .from("hojas_de_vida")
        .upload(path, hojaVida);
      if (!upErr) {
        const { data: urlData } = supabase.storage
          .from("hojas_de_vida")
          .getPublicUrl(path);
        hoja_vida_url = urlData.publicUrl;
      }
    }

    const payload = {
      nombre_completo: nuevoEmpleado.nombre_completo,
      correo: nuevoEmpleado.correo,
      cedula: nuevoEmpleado.cedula,
      region: nuevoEmpleado.region,
      telefono: nuevoEmpleado.telefono,
      direccion: nuevoEmpleado.direccion,
      descripcion: nuevoEmpleado.descripcion,
      cargo: nuevoEmpleado.cargo,
      fecha_ingreso: nuevoEmpleado.fecha_ingreso,
      rol: nuevoEmpleado.rol,
      hoja_vida_url
    };

    const res = await fetch(`${API_URL}/api/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ Empleado creado correctamente");
      setEmpleados(prev => [...prev, data.usuario]);
      setNuevoEmpleado({
        nombre_completo: "",
        contraseña: "",
        confirmarContraseña: "",
        correo: "",
        cedula: "",
        region: "",
        telefono: "",
        direccion: "",
        descripcion: "",
        cargo: "",
        fecha_ingreso: "",
        rol: "brigadista"
      });
      handleRemoveFile();
      bootstrap.Modal.getInstance(document.getElementById("modalNuevoEmpleado")).hide();
    } else {
      alert("❌ Error al crear empleado: " + (data.error || "Intenta nuevamente"));
    }
  };

  return (
    <div className="brigadas-container">
      <div className="lista-brigadas">
        {/* Título */}
        <h1 className="text-center mb-2">
          Empleados{" "}
          <img src={empleado_imagen} alt="Empleado" style={{ width: 60 }} />
        </h1>
        <p className="text-center text-muted mb-4">
          Aquí puedes ver los empleados existentes.
        </p>

        {/* Filtros responsivos */}
        <div className="container mb-4">
          <div className="card p-4">
            <h5 className="mb-3 text-center">🔎 Filtrar Empleados</h5>
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-3">
                <input
                  className="form-control"
                  placeholder="Nombre..."
                  value={filtroNombre}
                  onChange={e => setFiltroNombre(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <input
                  className="form-control"
                  placeholder="Correo..."
                  value={filtroCorreo}
                  onChange={e => setFiltroCorreo(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <input
                  className="form-control"
                  placeholder="Cédula..."
                  value={filtroCedula}
                  onChange={e => setFiltroCedula(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <select
                  className="form-select"
                  value={filtroRegion}
                  onChange={e => setFiltroRegion(e.target.value)}
                >
                  <option value="">Todas regiones</option>
                  <option value="Amazonía">Amazonía</option>
                  <option value="Pacífico">Pacífico</option>
                  <option value="Andina">Andina</option>
                  <option value="Caribe">Caribe</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Botón nuevo empleado */}
        <div className="text-center mb-4">
          <button
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#modalNuevoEmpleado"
          >
            Crear Nuevo Empleado 🛡️
          </button>
        </div>

        {/* Modal Crear Empleado */}
        <div
          className="modal fade"
          id="modalNuevoEmpleado"
          tabIndex="-1"
          aria-labelledby="modalNuevoEmpleadoLabel"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-gradient-primary text-white border-0">
                <h5
                  className="modal-title d-flex align-items-center gap-2"
                  id="modalNuevoEmpleadoLabel"
                >
                  <User size={27} /> Crear Nuevo Empleado
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                />
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleCrearEmpleado} id="formNuevoEmpleado">
                  {/* Información Personal */}
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        <User size={16} className="me-1" /> Nombre completo
                      </label>
                      <input
                        type="text"
                        name="nombre_completo"
                        className="form-control form-control-lg"
                        value={nuevoEmpleado.nombre_completo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        <CreditCard size={16} className="me-1" /> Cédula
                      </label>
                      <input
                        type="text"
                        name="cedula"
                        className="form-control form-control-lg"
                        value={nuevoEmpleado.cedula}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Acceso */}
                  <div className="row g-3 mb-4">
                    {mostrarErrorContraseña && (
                      <div className="alert alert-danger" role="alert">
                        Las contraseñas no coinciden
                      </div>
                    )}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        <Mail size={16} className="me-1" /> Contraseña
                      </label>
                      <input
                        type="password"
                        name="contraseña"
                        className="form-control form-control-lg"
                        value={nuevoEmpleado.contraseña}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        <Mail size={16} className="me-1" /> Confirmar contraseña
                      </label>
                      <input
                        type="password"
                        name="confirmarContraseña"
                        className="form-control form-control-lg"
                        value={nuevoEmpleado.confirmarContraseña}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Cargo, Fecha y Rol */}
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">Cargo</label>
                      <input
                        type="text"
                        name="cargo"
                        className="form-control form-control-lg"
                        value={nuevoEmpleado.cargo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">Fecha ingreso</label>
                      <input
                        type="date"
                        name="fecha_ingreso"
                        className="form-control form-control-lg"
                        value={nuevoEmpleado.fecha_ingreso}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">Rol</label>
                      <select
                        name="rol"
                        className="form-select form-select-lg"
                        value={nuevoEmpleado.rol}
                        onChange={handleChange}
                      >
                        <option value="brigadista">Brigadista</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <FileText size={16} className="me-1" /> Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      className="form-control"
                      rows="3"
                      value={nuevoEmpleado.descripcion}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Hoja de Vida */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <Upload size={16} className="me-1" /> Hoja de Vida
                    </label>
                    {!hojaVida ? (
                      <div className="border-dashed p-4 text-center bg-light">
                        <input
                          type="file"
                          id="hojaVidaInput"
                          className="position-absolute w-100 h-100 opacity-0"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                        <Upload size={40} className="text-secondary mb-2" />
                        <p>Haz clic o arrastra aquí</p>
                        <small>PDF, DOC, DOCX (máx 5MB)</small>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center justify-content-between p-3 bg-light">
                        <FileText size={24} className="text-primary" />
                        <div>
                          <p className="mb-0 fw-semibold">{previewUrl}</p>
                          <small>{(hojaVida.size / 1024 / 1024).toFixed(2)} MB</small>
                        </div>
                        <button className="btn btn-sm btn-outline-danger" onClick={handleRemoveFile}>
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
              <div className="modal-footer bg-light border-0">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancelar
                </button>
                <button type="submit" form="formNuevoEmpleado" className="btn btn-success">
                  <User size={18} className="me-2" /> Guardar Empleado
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de tarjetas responsivo */}
        <div className="cards-grid mt-4">
          {empleadosFiltrados.map(emp => (
            <div key={emp.id} className="card-brigada">
              <h3>{emp.nombre_completo}</h3>
              <p><strong>Correo:</strong> {emp.correo}</p>
              <p><strong>Cédula:</strong> {emp.cedula || "No asignada"}</p>
              <p><strong>Región:</strong> {emp.region}</p>
              <p><strong>Cargo:</strong> {emp.cargo || "No asignado"}</p>
              <p><strong>Fecha ingreso:</strong> {emp.fecha_ingreso || "No asignada"}</p>
              <p><strong>Descripción:</strong> {emp.descripcion}</p>
              <button
                className="btn btn-outline-success mt-3 align-self-stretch"
                onClick={() => navigate(`/admin/empleados/${emp.id}`)}
              >
                Ver Empleado
              </button>
            </div>
          ))}
          {empleadosFiltrados.length === 0 && (
            <p className="text-center text-muted">No se encontraron empleados 😅</p>
          )}
        </div>
      </div>
    </div>
  );
}
