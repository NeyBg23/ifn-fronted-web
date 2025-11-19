// Para la animación de aparición de izquierda a su posición fija
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { User, Mail, Briefcase, MapPin, Phone, Calendar, FileText, Shield, Save, ArrowLeftToLine } from "lucide-react";
import { useAuth } from "../hooks/useAuth"; 
import { Regiones, Departamentos } from "../utils/ubicacion.json"

const Perfil = () => {
  // OBTENER EL USUARIO Y EL TOKEN DEL CONTEXTO
  const { usuario: authUsuario, token } = useAuth(); 
  const navigate = useNavigate();
  // para guardar la respuesta fresca del servidor y forzar la re-renderización del perfil.
  const [usuarioLocal, setUsuarioLocal] = useState(authUsuario); 
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Estados para los campos editables
  const [descripcion, setDescripcion] = useState("");
  const [region, setRegion] = useState("");
  const [telefono, setTelefono] = useState("");

  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

  // Función de formato
  const formatearFecha = useCallback((fecha) => {
    if (!fecha) return "No disponible";
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }, []);

  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out", once: true });

    const cargarPerfil = async () => {
      if (!token) return setLoading(false);

      try {
        const res = await fetch(`https://fast-api-brigada.vercel.app/usuarios/${usuarioLocal.correo}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
        });

        if (res.ok) {
          const data = await res.json();
          
          const perfilData = data.user.data?.[0] || {};
          
          setUsuarioLocal(perfilData);
          // Inicializar los campos editables con los datos obtenidos
          setDescripcion(perfilData.descripcion || "");
          setRegion(perfilData.region || "");
          setTelefono(perfilData.telefono || "");

        } else setMensaje("Error al cargar el perfil");
        
      } catch (error) {
        console.error("Error cargando perfil:", error);
        setMensaje("Error de conexión");
      } finally {
        setLoading(false);
      }
    };
    
    cargarPerfil();
  }, [token]); // Depender del token para re-ejecutar si cambia

  const handleGuardar = async () => {
    if (!token) return setMensaje("No autenticado. No se puede guardar.");

    setGuardando(true);
    setMensaje("");

    try {
      const correo = usuarioLocal.correo

      const res = await fetch(`https://fast-api-brigada.vercel.app/usuario-actualizar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          descripcion,
          region,
          telefono,
          correo
        })
      });

      if (res.ok) {
        setMensaje("Perfil actualizado exitosamente");
        const data = await res.json();

        const perfilData = data.user;

        setUsuarioLocal(perfilData);
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

  // Usar usuarioLocal para mostrar los datos
  const usuario = usuarioLocal;

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

  // Si no hay usuarioLocal (y loading es false), es porque el token es inválido o el backend falló
  if (!usuario) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">No se pudo cargar el perfil. Por favor, intente iniciar sesión de nuevo.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-10">

          {/* Encabezado */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              <span className="text-5xl">🌳</span>
              Perfil de Usuario
            </h1>
            <p className="text-gray-600 text-lg">
              Aquí puedes ver y editar tu información personal.
            </p>
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


          {console.log(Regiones)}

          <div className="flex flex-col md:flex-row">

            <div data-aos="fade-right" className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Información Personal</h5>
                <small className="text-muted">Estos campos no pueden ser editados</small>
              </div>
              
              <br />
              
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold flex">
                      <User size={18} className="me-2" /> Nombre Completo
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
                    <label className="form-label fw-bold flex">
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
                    <label className="form-label fw-bold flex">
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
                    <label className="form-label fw-bold flex">
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
                    <label className="form-label fw-bold flex">
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
                    <label className="form-label fw-bold flex">
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

            <div data-aos="fade-left" className="card mb-4">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Información Editable</h5>
                <small>Puedes actualizar estos campos</small>
              </div>
              <br />
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="descripcion" className="form-label fw-bold flex">
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
                    <label htmlFor="region" className="form-label fw-bold flex">
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
                    <label htmlFor="telefono" className="form-label fw-bold flex">
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
          </div>

          <div className="flex justify-content-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </button>

            <button
              style={{ boxShadow: '0 0 10px 1px #1B5E20' }}
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
                <div className="flex">
                  <Save size={27} className="me-2" />
                  Guardar Cambios
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;