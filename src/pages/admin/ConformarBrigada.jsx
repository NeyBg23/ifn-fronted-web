import { useState, useEffect } from "react";
import { Users, UserCheck, Shield, Briefcase } from "lucide-react";

const ConformarBrigada = () => {
  const [empleados, setEmpleados] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [nombreBrigada, setNombreBrigada] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [region, setRegion] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroRegion, setFiltroRegion] = useState("");
  const [filtroCedula, setFiltroCedula] = useState("");

  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchEmpleados = async () => {
      const session = JSON.parse(localStorage.getItem("session") || "{}");
      if (!session.access_token) return;

      try {
        const res = await fetch(`${API_URL}/api/empleados`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const data = await res.json();

        // Si hay empleados, intentamos generar signed URLs para los que tengan hoja_vida_url
        const empleadosConUrls = await Promise.all(
          (data.data || []).map(async (emp) => {
            if (!emp.hoja_vida_url) return emp;

            const nombreArchivo = encodeURIComponent(emp.hoja_vida_url.split("/").pop());
            try {
              const resSigned = await fetch(`${API_URL}/api/hoja-vida/${nombreArchivo}`, {
                headers: { Authorization: `Bearer ${session.access_token}` },
              });
              const signedData = await resSigned.json();

              if (signedData?.signedUrl) {
                return { ...emp, signedUrl: signedData.signedUrl };
              }
            } catch (err) {
              console.warn(`Error obteniendo signed URL para ${emp.nombre_completo}`);
            }
            return emp;
          })
        );

        setEmpleados(empleadosConUrls);
      } catch (error) {
        console.error("Error cargando empleados:", error);
      }
    };
    fetchEmpleados();
  }, []);

  const empleadosFiltrados = empleados.filter((emp) => {
    const coincideNombre = `${emp.nombre_completo}`.toLowerCase().includes(filtroNombre.toLowerCase());
    const coincideCedula = `${emp.cedula}`.toLowerCase().includes(filtroCedula.toLowerCase());
    const coincideRegion = filtroRegion === "" || emp.region === filtroRegion;
    return coincideNombre && coincideRegion && coincideCedula;
  });

  const toggleRol = (empleadoId, rol) => {
    // Lo que hice fue primero encontrar a un empleado que cumpla esas condiciones
    // para saber si ya tiene el rol que le intente dar click
    const existe = asignaciones.find(
      (a) => a.empleadoId === empleadoId && a.rol === rol
    );
    // Y aquí lo que hice fue filtrar a ese empleado y quitarle el rol que intento
    // volverle a dar como forma de quitarle ese rol
    if (existe) {
      setAsignaciones(
        asignaciones.filter(
          (a) => !(a.empleadoId === empleadoId && a.rol === rol)
        )
      );
    } else {
      // Lo que hice fue filtrar al empleado que selecciono
      // Si el que selecciono ya tenia un rol lo va a cambiar por el nuevo rol
      // si no pues no pasa nada
      let verificarUnSoloRol = asignaciones.find(
        (a) => { 
          if (a.empleadoId === empleadoId) { 
            a.rol = rol
            return true;
          };
        });

      // Lo que hice fue validar en caso de que verificarUnSoloRol no hizo ese proceso
      // si no lo hizo significa que le acaba de asignar un rol y por lo tanto
      // debe añadirlo en asignaciones

      // y en el else, lo que hice fue cambiar directamente ya asignaciones 
      // haciendo el cambio directo solo en ese empleado

      if (!verificarUnSoloRol) setAsignaciones([...asignaciones, { empleadoId, rol }])
      else setAsignaciones([...asignaciones]);
    }
  };

  const tieneRol = (empleadoId, rol) => {
    return asignaciones.some(
      (a) => a.empleadoId === empleadoId && a.rol === rol
    );
  };

  const getRolesEmpleado = (empleadoId) => {
    return asignaciones
      .filter((a) => a.empleadoId === empleadoId)
      .map((a) => a.rol);
  };

  const contarRol = (rol) => {
    return asignaciones.filter((a) => a.rol === rol).length;
  };

  const handleCrearBrigada = async () => {
    if (!nombreBrigada || !region) {
      alert("Por favor completa el nombre y región de la brigada");
      return;
    }

    if (contarRol("jefe") === 0) {
      alert("Debes asignar al menos un Jefe de Brigada");
      return;
    }

    if (contarRol("brigadista") === 0) {
      alert("Debes asignar al menos un Brigadista");
      return;
    }

    const session = JSON.parse(localStorage.getItem("session") || "{}");

    try {
      const response = await fetch(`${API_URL}/api/brigadas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          nombre: nombreBrigada,
          descripcion,
          region,
          asignaciones
        })
      });

      if (response.ok) {
        alert("¡Brigada creada exitosamente! 🌳");
        setAsignaciones([]);
        setNombreBrigada("");
        setDescripcion("");
        setRegion("");
      } else {
        alert("Error al crear la brigada");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  };

  const getRolLabel = (rol) => {
    switch (rol) {
      case "jefe":
        return "Jefe de Brigada";
      case "brigadista":
        return "Brigadista";
      case "coinvestigador":
        return "Co-Investigador";
      case "apoyo":
        return "Apoyo Técnico";
    }
  };

  return (
    <div className="lista-brigadas">
      <h1 className="mb-4">Conformar Nueva Brigada 🌳</h1>
      <p>Aquí podras asignar brigadas a un conglomerado</p>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Información de la Brigada</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="nombreBrigada" className="form-label">
                Nombre de la Brigada
              </label>
              <input
                type="text"
                id="nombreBrigada"
                className="form-control"
                placeholder="Ej: Brigada Amazonas Norte"
                value={nombreBrigada}
                onChange={(e) => setNombreBrigada(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="region" className="form-label">
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
                <option value="Pacífico">Caribe</option>
                <option value="Andina">Andina</option>
                <option value="Caribe">Caribe</option>
                <option value="Orinoquía">Orinoquía</option>
              </select>
            </div>
            <div className="col-12">
              <label htmlFor="descripcion" className="form-label">
                Descripción
              </label>
              <textarea
                id="descripcion"
                className="form-control"
                rows="3"
                placeholder="Describe el objetivo y alcance de esta brigada..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Resumen de Asignaciones</h5>
          <div className="d-flex flex-wrap justify-content-around gap-3">
            <div className="text-center" style={{ minWidth: "150px" }}>
              <div className="p-3 border rounded">
                <Shield size={28} className="mb-2 text-success" />
                <h6 className="mb-2">Jefe de Brigada</h6>
                <span className="badge bg-success fs-6">{contarRol("jefe")}</span>
              </div>
            </div>
            <div className="text-center" style={{ minWidth: "150px" }}>
              <div className="p-3 border rounded">
                <Users size={28} className="mb-2 text-primary" />
                <h6 className="mb-2">Brigadistas</h6>
                <span className="badge bg-primary fs-6">{contarRol("brigadista")}</span>
              </div>
            </div>
            <div className="text-center" style={{ minWidth: "150px" }}>
              <div className="p-3 border rounded">
                <Briefcase size={28} className="mb-2 text-info" />
                <h6 className="mb-2">Co-Investigadores</h6>
                <span className="badge bg-info fs-6">{contarRol("coinvestigador")}</span>
              </div>
            </div>
            <div className="text-center" style={{ minWidth: "150px" }}>
              <div className="p-3 border rounded">
                <UserCheck size={28} className="mb-2 text-warning" />
                <h6 className="mb-2">Apoyo Técnico</h6>
                <span className="badge bg-warning fs-6">{contarRol("apoyo")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>


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
                    placeholder="Buscar por cedula..."
                    value={filtroCedula}
                    onChange={(e) => setFiltroCedula(e.target.value)}
                />
            </div>
            <div className="col-md-4">
                <select
                className="form-select"
                value={filtroRegion}
                onChange={(e) => setFiltroRegion(e.target.value)}
                >
                <option value="">Seleccionar región</option>
                <option value="Amazonía">Amazonía</option>
                <option value="Pacífico">Caribe</option>
                <option value="Andina">Andina</option>
                <option value="Caribe">Caribe</option>
                <option value="Orinoquía">Orinoquía</option>
                </select>
            </div>
        </div>
      </div>

      <h5 className="mb-3">Seleccionar Empleados</h5>
      <div className="row g-3 mb-4">
        <div className="empleados-container">
            {empleadosFiltrados.map((empleado) => {
            const roles = getRolesEmpleado(empleado.id);
            const tieneAlgunRol = roles.length > 0;

            return (
                <div key={empleado.id} >
                <div className={`card h-10 ${tieneAlgunRol ? "border-success" : ""}`}>
                    <div className="card-body">
                    <div className="d-flex align-items-start mb-3">
                        <div
                        className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3"
                        style={{ width: "50px", height: "50px", flexShrink: 0 }}
                        >
                        {empleado.nombre?.charAt(0) || ''}
                        </div>
                        <div>
                        <h6 className="mb-1">
                            {empleado.nombre_completo}
                        </h6>
                        <small className="text-muted">{empleado.descripcion || 'Sin descripcion'}</small>
                        <br />
                        <small className="text-muted">Región: {empleado.region}</small>
                        <br />
                            <small className="text-muted">
                                {empleado.signedUrl ? (
                                    <a
                                        href={empleado.signedUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-primary btn-sm mt-1"
                                    >
                                        📄 Ver hoja de vida
                                    </a>
                                    ) : (
                                    <small className="text-danger fw-semibold mt-1 d-block">
                                        📄 No tiene hoja de vida
                                    </small>
                                )}
                            </small>

                        </div>
                    </div>

                    {roles.length > 0 && (
                        <div className="mb-2">
                        <small className="text-success fw-bold">Roles asignados:</small>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                            {roles.map((rol) => (
                            <span
                                key={rol}
                                className={`badge ${
                                rol === "jefe"
                                    ? "bg-success"
                                    : rol === "brigadista"
                                    ? "bg-primary"
                                    : rol === "coinvestigador"
                                    ? "bg-info"
                                    : "bg-warning"
                                }`}
                            >
                                {getRolLabel(rol)}
                            </span>
                            ))}
                        </div>
                        </div>
                    )}

                    <div className="d-flex flex-wrap gap-2">
                        <button
                        className={`btn btn-sm ${
                            tieneRol(empleado.id, "jefe")
                            ? "btn-success"
                            : "btn-outline-success"
                        }`}
                        onClick={() => toggleRol(empleado.id, "jefe")}
                        title="Jefe de Brigada"
                        >
                        <Shield size={16} />
                        </button>
                        <button
                        className={`btn btn-sm ${
                            tieneRol(empleado.id, "brigadista")
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => toggleRol(empleado.id, "brigadista")}
                        title="Brigadista"
                        >
                        <Users size={16} />
                        </button>
                        <button
                        className={`btn btn-sm ${
                            tieneRol(empleado.id, "coinvestigador")
                            ? "btn-info"
                            : "btn-outline-info"
                        }`}
                        onClick={() => toggleRol(empleado.id, "coinvestigador")}
                        title="Co-Investigador"
                        >
                        <Briefcase size={16} />
                        </button>
                        <button
                        className={`btn btn-sm ${
                            tieneRol(empleado.id, "apoyo")
                            ? "btn-warning"
                            : "btn-outline-warning"
                        }`}
                        onClick={() => toggleRol(empleado.id, "apoyo")}
                        title="Apoyo Técnico"
                        >
                        <UserCheck size={16} />
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            );
            })}
        </div>

        {empleadosFiltrados.length === 0 && (
          <div className="col-12">
            <p className="text-muted text-center">No se encontraron empleados 😅</p>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-secondary">Cancelar</button>
        <button
          className="btn btn-success btn-lg"
          onClick={handleCrearBrigada}
          disabled={asignaciones.length === 0}
        >
          Crear Brigada 🛡️
        </button>
      </div>
    </div>
  );
};

export default ConformarBrigada;
