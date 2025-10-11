import { useState, useEffect } from "react";
import { User, Mail, Briefcase, MapPin, Phone, Calendar, FileText, Shield } from "lucide-react";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [descripcion, setDescripcion] = useState("");
  const [region, setRegion] = useState("");
  const [telefono, setTelefono] = useState("");

  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

  useEffect(() => {
    const cargarPerfil = async () => {
      const session = JSON.parse(localStorage.getItem("session") || "{}");
      if (!session.access_token) return;
      
      try {
        const res = await fetch(`${API_URL}/api/perfil`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });

        console.log(res);

        if (res.ok) {
          const data = await res.json();
          setUsuario(data.data);
          setDescripcion(data.data.descripcion || "");
          setRegion(data.data.region || "");
          setTelefono(data.data.telefono || "");
        } else setMensaje("Error al cargar el perfil");
        
      } catch (error) {
        console.error("Error cargando perfil:", error);
        setMensaje("Error de conexión");
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, []);

  const handleGuardar = async () => {
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    setGuardando(true);
    setMensaje("");

    try {
      const res = await fetch(`${API_URL}/api/perfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          descripcion,
          region,
          telefono
        })
      });

      if (res.ok) {
        setMensaje("Perfil actualizado exitosamente");
        const data = await res.json();
        setUsuario(data.data);
      } else {
        setMensaje("Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "No disponible";
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">No se pudo cargar el perfil</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="d-flex align-items-center mb-4">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
              style={{ width: "80px", height: "80px", fontSize: "2rem", fontWeight: "bold" }}
            >
              {usuario.nombre_completo?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="mb-1">{usuario.nombre_completo || "Usuario"}</h1>
              <p className="text-muted mb-0">
                <Shield size={16} className="me-1" />
                {usuario.rol || "Sin rol"}
              </p>
            </div>
          </div>

          {mensaje && (
            <div className={`alert ${mensaje.includes("Error") ? "alert-danger" : "alert-success"} alert-dismissible fade show`}>
              {mensaje}
              <button
                type="button"
                className="btn-close"
                onClick={() => setMensaje("")}
              ></button>
            </div>
          )}

          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Información Personal</h5>
              <small className="text-muted">Estos campos no pueden ser editados</small>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">
                    <User size={18} className="me-2" />
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={usuario.nombre_completo || ""}
                    disabled
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">
                    <Mail size={18} className="me-2" />
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={usuario.correo || ""}
                    disabled
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">
                    <Briefcase size={18} className="me-2" />
                    Cargo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={usuario.cargo || "Sin cargo"}
                    disabled
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">
                    <Shield size={18} className="me-2" />
                    Rol
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={usuario.rol || "Sin rol"}
                    disabled
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">
                    <Calendar size={18} className="me-2" />
                    Fecha de Ingreso
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formatearFecha(usuario.fecha_ingreso)}
                    disabled
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">
                    <Calendar size={18} className="me-2" />
                    Fecha de Creación
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formatearFecha(usuario.created_at)}
                    disabled
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Información Editable</h5>
              <small>Puedes actualizar estos campos</small>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="descripcion" className="form-label fw-bold">
                    <FileText size={18} className="me-2" />
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    className="form-control"
                    rows="4"
                    placeholder="Escribe una breve descripción sobre ti..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  ></textarea>
                </div>
                <div className="col-md-6">
                  <label htmlFor="region" className="form-label fw-bold">
                    <MapPin size={18} className="me-2" />
                    Región
                  </label>
                  <select
                    id="region"
                    className="form-select"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  >
                    <option value="">Seleccionar región</option>
                    <option value="Amazonía">Amazonía</option>
                    <option value="Pacífico">Pacífico</option>
                    <option value="Andina">Andina</option>
                    <option value="Caribe">Caribe</option>
                    <option value="Orinoquía">Orinoquía</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="telefono" className="form-label fw-bold">
                    <Phone size={18} className="me-2" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    className="form-control"
                    placeholder="Ej: +57 300 123 4567"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => window.history.back()}
            >
              Volver
            </button>
            <button
              className="btn btn-success btn-lg"
              onClick={handleGuardar}
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
