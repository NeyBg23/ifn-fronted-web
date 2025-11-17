import { useState, useEffect } from "react";
import { Users, UserCheck, Shield, Briefcase, MapPin, FileText } from "lucide-react";
import { useLocation } from "react-router-dom";
import Modal from "../components/modal";

const ConformarBrigada = () => {
  const [empleados, setEmpleados] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [nombreBrigada, setNombreBrigada] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [region, setRegion] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroRegion, setFiltroRegion] = useState("");
  const [filtroCedula, setFiltroCedula] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  const conglomeradoId = location.state?.conglomerado;

  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

  const regionesDepartamentos = {
    "Amazonía": {
      departamentos: ["Amazonas", "Caquetá", "Guainía", "Guaviare", "Putumayo", "Vaupés", "Vichada"]
    },
    "Caribe": {
      departamentos: ["Atlántico", "Bolívar", "Cesar", "Córdoba", "La Guajira", "Magdalena", "Sucre"]
    },
    "Andina": {
      departamentos: ["Antioquia", "Boyacá", "Caldas", "Cauca", "Cundinamarca", "Huila", "Nariño", "Quindío", "Risaralda", "Santander", "Tolima", "Valle del Cauca"]
    },
    "Orinoquía": {
      departamentos: ["Arauca", "Casanare", "Meta"]
    }
  };

  const departamentosYMunicipios = {
    "": [],
    "Amazonas": ["Leticia", "Puerto Nariño"],
    "Antioquia": ["Medellín", "Bello", "Envigado", "Itagüí"],
    "Arauca": ["Arauca", "Arauquita", "Fortul"],
    "Atlántico": ["Barranquilla", "Soledad", "Malambo"],
    "Bolívar": ["Cartagena", "Turbaco", "Santa Rosa de Lima"],
    "Boyacá": ["Tunja", "Duitama", "Sogamoso"],
    "Caldas": ["Manizales", "Villamaría", "Neira"],
    "Caquetá": ["Florencia", "La Montañita"],
    "Casanare": ["Yopal", "Aguazul"],
    "Cauca": ["Popayán", "Puracé", "Piamonte"],
    "Cesar": ["Valledupar", "Chiriguaná"],
    "Chocó": ["Quibdó", "Istmina"],
    "Córdoba": ["Montería", "Cereté"],
    "Cundinamarca": ["Bogotá", "Soacha", "Fusagasugá"],
    "Guainía": ["Inírida"],
    "Guaviare": ["San José del Guaviare"],
    "Huila": ["Neiva", "Pitalito"],
    "La Guajira": ["Riohacha", "Maicao"],
    "Magdalena": ["Santa Marta", "Ciénaga"],
    "Meta": ["Villavicencio", "Acacías"],
    "Nariño": ["Pasto", "Ipiales"],
    "Norte de Santander": ["Cúcuta", "Ocaña"],
    "Putumayo": ["Mocoa", "Puerto Caicedo"],
    "Quindío": ["Armenia"],
    "Risaralda": ["Pereira", "Dosquebradas"],
    "Santander": ["Bucaramanga", "Floridablanca"],
    "Sucre": ["Sincelejo", "Colosó"],
    "Tolima": ["Ibagué", "Espinal"],
    "Valle del Cauca": ["Cali", "Palmira"],
    "Vaupés": ["Mitú"],
    "Vichada": ["Puerto Carreño"]
  };

  useEffect(() => {
    const fetchEmpleados = async () => {
      const session = JSON.parse(localStorage.getItem("session") || "{}");
      if (!session.access_token) return;

      try {
        const res = await fetch(`${API_URL}/api/empleados`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const data = await res.json();

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

  const getDepartamentosPorRegion = () => {
    if (!region) return [];
    return regionesDepartamentos[region]?.departamentos || [];
  };

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    setDepartamento("");
    setMunicipio("");
  };

  const handleDepartamentoChange = (newDepartamento) => {
    if (!getDepartamentosPorRegion().includes(newDepartamento)) {
      alert("El departamento seleccionado no corresponde a esta región");
      return;
    }
    setDepartamento(newDepartamento);
    setMunicipio("");
  };

  const toggleRol = (empleadoId, rol) => {
    const existe = asignaciones.find(
      (a) => a.empleadoId === empleadoId && a.rol === rol
    );
    if (existe) {
      setAsignaciones(
        asignaciones.filter(
          (a) => !(a.empleadoId === empleadoId && a.rol === rol)
        )
      );
    } else {
      let verificarUnSoloRol = asignaciones.find(
        (a) => {
          if (a.empleadoId === empleadoId) {
            a.rol = rol
            return true;
          };
        });

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
    if (!nombreBrigada || !region || !departamento || !municipio) {
      alert("Por favor completa el nombre, región, departamento y municipio de la brigada");
      return;
    }

    if (!getDepartamentosPorRegion().includes(departamento)) {
      alert("El departamento seleccionado no corresponde a la región");
      return;
    }

    if (contarRol("jefe_brigada") === 0) {
      alert("Debes asignar al menos un Jefe de Brigada");
      return;
    }

    const token = localStorage.getItem("token");

    try {

      const response = await fetch(`https://fast-api-brigada.vercel.app/crear-brigada`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombreBrigada,
          descripcion,
          region,
          departamento,
          municipio,
          asignaciones,
          conglomeradoId
        })
      });

      if (response.ok) {
        setModalOpen(true);

        setAsignaciones([]);
        setNombreBrigada("");
        setDescripcion("");
        setRegion("");
        setDepartamento("");
        setMunicipio("");

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
      case "jefe_brigada":
        return "Jefe de Brigada";
      case "brigadista":
        return "Brigadista";
      case "coinvestigador":
        return "Co-Investigador";
      case "tecnico_auxiliar":
        return "Apoyo Técnico";
    }
  };

  const getRolColor = (rol) => {
    switch (rol) {
      case "jefe_brigada":
        return { icon: Shield, color: "text-emerald-600", bg: "bg-emerald-100", badge: "bg-emerald-600" };
      case "brigadista":
        return { icon: Users, color: "text-blue-600", bg: "bg-blue-100", badge: "bg-blue-600" };
      case "coinvestigador":
        return { icon: Briefcase, color: "text-cyan-600", bg: "bg-cyan-100", badge: "bg-cyan-600" };
      case "tecnico_auxiliar":
        return { icon: UserCheck, color: "text-amber-600", bg: "bg-amber-100", badge: "bg-amber-600" };
    }
  };

  return (
    <div className="lista-brigadas">
      <h1>Conformar Nueva Brigada</h1>
      <p>Crea y asigna roles a los miembros de tu brigada forestal</p>

      <br />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de la Brigada</h2>
              <div className="space-y-5">
                <div>
                  <label htmlFor="nombreBrigada" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de la Brigada
                  </label>
                  <input
                    type="text"
                    id="nombreBrigada"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                    placeholder="Ej: Brigada Amazonas Norte"
                    value={nombreBrigada}
                    onChange={(e) => setNombreBrigada(e.target.value)}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="region" className="block text-sm font-semibold text-gray-700 mb-2">
                      Región
                    </label>
                    <select
                      id="region"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                      value={region}
                      onChange={(e) => handleRegionChange(e.target.value)}
                    >
                      <option value="">Seleccionar región</option>
                      <option value="Amazonía">Amazonía</option>
                      <option value="Caribe">Caribe</option>
                      <option value="Andina">Andina</option>
                      <option value="Orinoquía">Orinoquía</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="departamento" className="block text-sm font-semibold text-gray-700 mb-2">
                      Departamento
                    </label>
                    <select
                      id="departamento"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition disabled:bg-gray-100"
                      value={departamento}
                      onChange={(e) => handleDepartamentoChange(e.target.value)}
                      disabled={!region}
                    >
                      <option value="">Seleccionar departamento</option>
                      {getDepartamentosPorRegion().map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="municipio" className="block text-sm font-semibold text-gray-700 mb-2">
                      Municipio
                    </label>
                    <select
                      id="municipio"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition disabled:bg-gray-100"
                      value={municipio}
                      onChange={(e) => setMunicipio(e.target.value)}
                      disabled={!departamento}
                    >
                      <option value="">Seleccionar municipio</option>
                      {departamento && departamentosYMunicipios[departamento]?.map((mun) => (
                        <option key={mun} value={mun}>{mun}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ubicación Completa
                    </label>
                    <div className="px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                      <MapPin size={18} className="text-emerald-600 flex-shrink-0" />
                      <span className="text-sm text-emerald-900">
                        {municipio && departamento ? `${municipio}, ${departamento}` : "Selecciona región y departamento"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                    rows="4"
                    placeholder="Describe el objetivo, alcance y características especiales de esta brigada..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-6 text-white sticky top-6">
              <h3 className="text-white font-bold mb-4">Resumen de Asignaciones</h3>
              <div className="space-y-2">
                <div className="bg-emerald-500 bg-opacity-40 rounded-lg p-3 border border-emerald-400 border-opacity-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield size={18} className="text-emerald-100" />
                      <span className="text-xs font-medium text-emerald-50">Jefe de Brigada</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{contarRol("jefe_brigada")}</div>
                  </div>
                </div>

                <div className="bg-blue-500 bg-opacity-40 rounded-lg p-3 border border-blue-400 border-opacity-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-blue-100" />
                      <span className="text-xs font-medium text-blue-50">Brigadistas</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{contarRol("brigadista")}</div>
                  </div>
                </div>

                <div className="bg-cyan-500 bg-opacity-40 rounded-lg p-3 border border-cyan-400 border-opacity-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase size={18} className="text-cyan-100" />
                      <span className="text-xs font-medium text-cyan-50">Co-Investigadores</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{contarRol("coinvestigador")}</div>
                  </div>
                </div>

                <div className="bg-amber-500 bg-opacity-40 rounded-lg p-3 border border-amber-400 border-opacity-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck size={18} className="text-amber-100" />
                      <span className="text-xs font-medium text-amber-50">Apoyo Técnico</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{contarRol("tecnico_auxiliar")}</div>
                  </div>
                </div>

                <div className="bg-cyan-900 bg-opacity-40 rounded-lg p-3 border border-cyan-400 border-opacity-50 mt-3 pt-3 border-t-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-cyan-100" />
                      <span className="text-xs font-medium text-emerald-50">Total de miembros</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{asignaciones.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText size={24} className="text-emerald-600" />
            Filtrar Empleados
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              className="px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
              placeholder="Buscar por nombre..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
            />
            <input
              type="text"
              className="px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
              placeholder="Buscar por cédula..."
              value={filtroCedula}
              onChange={(e) => setFiltroCedula(e.target.value)}
            />
            <select
              className="px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
              value={filtroRegion}
              onChange={(e) => setFiltroRegion(e.target.value)}
            >
              <option value="">Todas las regiones</option>
              <option value="Amazonía">Amazonía</option>
              <option value="Caribe">Caribe</option>
              <option value="Andina">Andina</option>
              <option value="Orinoquía">Orinoquía</option>
            </select>
          </div>
        </div>

        <div>
          <h1>Seleccionar Empleados</h1>
          {empleadosFiltrados.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <p className="text-gray-500 text-lg">No se encontraron empleados con los filtros aplicados</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {empleadosFiltrados.map((empleado) => {
                const roles = getRolesEmpleado(empleado.id);
                const tieneAlgunRol = roles.length > 0;
                const urlFotoPerfil = empleado.foto_url;

                return (
                  <div key={empleado.id} className={`bg-white rounded-xl border-2 transition-all ${tieneAlgunRol ? 'border-emerald-400 shadow-md' : 'border-gray-200 shadow-sm hover:shadow-md'}`}>
                    <div className="p-5">
                      <div className="flex items-start gap-3 mb-4">

                          {
                            urlFotoPerfil ?
                              <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 overflow-hidden">
                                  <img src={urlFotoPerfil} alt="Foto" className="w-full h-full object-cover rounded-full"/>
                              </div>
                            :
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                              {empleado.nombre_completo?.charAt(0) || '?'}
                            </div>
                          }


                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{empleado.nombre_completo}</h3>
                          <p className="text-xs text-gray-500 truncate">{empleado.cedula}</p>
                          <p className="text-xs text-gray-500 mt-1">{empleado.region}</p>
                        </div>
                      </div>

                      {roles.length > 0 && (
                        <div className="mb-4 pb-4 border-b border-gray-200">
                          <p className="text-xs font-semibold text-emerald-600 mb-2 uppercase tracking-wide">Roles asignados</p>
                          <div className="flex flex-wrap gap-2">
                            {roles.map((rol) => (
                              <span key={rol} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${getRolColor(rol).badge}`}>
                                {getRolLabel(rol)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {empleado.signedUrl ? (
                        <a
                          href={empleado.signedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full mb-4 px-3 py-2 text-center text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition"
                        >
                          Descargar hoja de vida
                        </a>
                      ) : (
                        <div className="block w-full mb-4 px-3 py-2 text-center text-xs font-medium text-red-600 bg-red-50 rounded-lg">
                          Sin hoja de vida
                        </div>
                      )}

                      <div className="flex gap-2">
                        {[
                          { rol: "jefe_brigada", icon: Shield },
                          { rol: "brigadista", icon: Users },
                          { rol: "coinvestigador", icon: Briefcase },
                          { rol: "tecnico_auxiliar", icon: UserCheck }
                        ].map(({ rol, icon: Icon }) => (
                          <button
                            key={rol}
                            className={`flex-1 p-2 rounded-lg font-medium transition ${
                              tieneRol(empleado.id, rol)
                                ? `${getRolColor(rol).badge} text-white`
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            onClick={() => toggleRol(empleado.id, rol)}
                            title={getRolLabel(rol)}
                          >
                            <Icon size={16} className="mx-auto" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button className="px-6 py-3 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:shadow-lg hover:shadow-emerald-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCrearBrigada}
            disabled={asignaciones.length === 0}
          >
            Crear Brigada
          </button>
        </div>
      </div>

      <Modal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        mensaje="¡Brigada creada exitosamente!"
      />
    </div>
  );
};

export default ConformarBrigada;
