import AOS from "aos";                   // Animación de aparición en scroll
import "aos/dist/aos.css";                // Estilos de animación de AOS

import { useNavigate } from "react-router-dom"; // Hook para navegación de rutas
import { useState, useEffect } from "react";    // Hooks de estado y efecto de React
import "../../styles/Brigadas.css";             // Estilos propios para la página
import empleado_imagen from "../../img/empleado.png"; // Imagen por defecto para empleados
import { useAuth } from "../../hooks/useAuth";        // Hook de autenticación personalizada

export default function Empleados() {
  const navigate = useNavigate(); // Para cambiar rutas

  // Estado de empleados y filtros
  const [empleados, setEmpleados] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCorreo, setFiltroCorreo] = useState("");
  const [filtroCedula, setFiltroCedula] = useState("");
  const [filtroRegion, setFiltroRegion] = useState("");
  const user = useAuth();

  // Dirección base del API (en entorno de desarrollo o producción)
  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

  // Efecto al montar: inicializa animación y carga la lista de empleados
  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out", once: true });

    (async () => {
      const token = user.token;
      if (!token) return console.error("¡Necesitas login! 🔑");
      // Fetch de empleados desde el backend
      const res = await fetch(`${API_URL}/api/empleados`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEmpleados(data.data || []);
    })();
  }, [API_URL]);

  // Aplica filtros sobre empleados según datos introducidos por el usuario
  const empleadosFiltrados = empleados.filter(empleado => {
    // Coincidencia por nombre, correo, cédula y región
    const n = empleado.nombre_completo.toLowerCase().includes(filtroNombre.toLowerCase());
    const c = empleado.correo.toLowerCase().includes(filtroCorreo.toLowerCase());
    const ced = empleado.cedula.toLowerCase().includes(filtroCedula.toLowerCase());
    const r = !filtroRegion || empleado.region === filtroRegion;
    return n && c && ced && r;
  });

  return (
    <div className="lista-brigadas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src={empleado_imagen} alt="Empleado" style={{ width: 60 }} />
            <h1 className="text-4xl font-bold text-gray-800">Empleados</h1>
          </div>
          <p className="text-center text-gray-600 text-lg">
            Aquí puedes ver y gestionar todos los empleados existentes.
          </p>
        </div>

        {/* Sección de Filtros */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {/* Ícono filtro */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtrar Empleados
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="Buscar por nombre..."
                  value={filtroNombre}
                  onChange={e => setFiltroNombre(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Correo</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="Buscar por correo..."
                  value={filtroCorreo}
                  onChange={e => setFiltroCorreo(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cédula</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="Buscar por cédula..."
                  value={filtroCedula}
                  onChange={e => setFiltroCedula(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Región</label>
                <select
                  className="w-full px-4 py-3 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  value={filtroRegion}
                  onChange={e => setFiltroRegion(e.target.value)}
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
        </div>

        {/* Botón Crear Nuevo Empleado */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">¿Listo para agregar un nuevo empleado?</h3>
                <p className="text-emerald-50">Gestiona tu equipo de trabajo de manera sencilla</p>
              </div>
              <button
                onClick={() => navigate('/admin/nuevoEmpleado')}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl font-bold whitespace-nowrap"
              >
                {/* Ícono de crear */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear Nuevo Empleado
              </button>
            </div>
          </div>
        </div>

        {/* Grid de Empleados */}
        <div data-aos="fade-up">
          {empleadosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-16">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
                  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium">No se encontraron empleados</p>
                <p className="text-gray-400 mt-2">Intenta ajustar los filtros o crea un nuevo empleado</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 cursor-pointer gap-6">
              {empleadosFiltrados.map(emp => (
                <div 
                  key={emp.id} 
                  className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-emerald-100 overflow-hidden hover:scale-105 hover:-translate-y-1"
                >
                  {/* Header del Card */}
                  <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
                    <h3 className="text-lg font-bold text-white truncate">
                      {emp.nombre_completo}
                    </h3>
                  </div>

                  {/* Body del Card */}
                  <div className="p-6 space-y-4">
                    {/* Información Principal */}
                    <div className="space-y-3">
                      {/* Correo */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-emerald-700 mb-1">Correo</p>
                          <p className="text-sm text-gray-700 truncate">{emp.correo}</p>
                        </div>
                      </div>
                      {/* Cédula */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h5m0-12V4a2 2 0 012-2h4a2 2 0 012 2v4m0 0h5a2 2 0 012 2v10a2 2 0 01-2 2h-5m0 0V9a2 2 0 012-2" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-emerald-700 mb-1">Cédula</p>
                          <p className="text-sm text-gray-700">{emp.cedula || "No asignada"}</p>
                        </div>
                      </div>
                      {/* Región */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-emerald-700 mb-1">Región</p>
                          <p className="text-sm text-gray-700">{emp.region}</p>
                        </div>
                      </div>
                      {/* Cargo */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.934-8.899-2.645m16.334-12A23.931 23.931 0 0112 3c-3.183 0-6.22.934-8.899 2.645m0 0v.006v.015v.02m8.899-2.645h.008v.008h-.008v-.008m0 0c3.183 0 6.22.934 8.899 2.645m-16.334 0l-.005-.006L3.102 7.645" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-emerald-700 mb-1">Cargo</p>
                          <p className="text-sm text-gray-700">{emp.cargo || "No asignado"}</p>
                        </div>
                      </div>
                      {/* Estado */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-emerald-700 mb-1">Estado</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            emp.estado === 'Disponible' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {emp.estado}
                          </span>
                        </div>
                      </div>
                      {/* Fecha de ingreso */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-emerald-700 mb-1">Ingreso</p>
                          <p className="text-sm text-gray-700">{emp.fecha_ingreso || "No asignada"}</p>
                        </div>
                      </div>
                      {/* Descripción */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-emerald-700 mb-1">Descripción</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{emp.descripcion}</p>
                        </div>
                      </div>
                    </div>

                    {/* Botón para ver detalle del empleado */}
                    <div className="pt-4 border-t border-emerald-100">
                      <button
                        onClick={() => navigate(`/admin/empleados/${emp.id}`)}
                        className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver Empleado
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}