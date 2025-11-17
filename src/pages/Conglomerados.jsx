import AOS from "aos";
import "aos/dist/aos.css";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Brigadas.css";
import { useAuth } from "../hooks/useAuth";

const Conglomerados = () => {
  const navigate = useNavigate();
  const [conglomerados, setConglomerado] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroRegion, setFiltroRegion] = useState("");
  const user = useAuth()

  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out", once: true });

    const fetchData = async () => {
      const token = user.token;
      if (!token) return alert("¡Necesitas login! 🔑");

      const resConglomerados = await fetch(`${API_URL}/api/conglomerados`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataConglomerados = await resConglomerados.json();
      setConglomerado(dataConglomerados.data || []);
    };
    fetchData();
  }, []);

  const conglomeradosFiltradas = conglomerados.filter((conglomerado) => {
    const coincideNombre = conglomerado.nombre
      ?.toLowerCase()
      .includes(filtroNombre.toLowerCase());
    const coincideRegion =
      filtroRegion === "" || conglomerado.region === filtroRegion;

    return coincideNombre && coincideRegion;
  });

  return (
    <div className="lista-brigadas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            <span className="text-5xl">🌳</span>
            Conglomerados
          </h1>
          <p className="text-gray-600 text-lg">
            Aquí puedes ver y gestionar todos los conglomerados existentes.
          </p>
        </div>

        {/* Sección de Filtros */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtrar Conglomerados
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="Buscar por nombre..."
                  value={filtroNombre}
                  onChange={(e) => setFiltroNombre(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Región</label>
                <select
                  className="w-full px-4 py-3 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
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
        </div>

        {/* Grid de Conglomerados */}
        <div data-aos="fade-up">
          {conglomeradosFiltradas.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-16">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
                  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium">No se encontraron conglomerados</p>
                <p className="text-gray-400 mt-2">Intenta ajustar los filtros o crea un nuevo conglomerado</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 cursor-pointer gap-6">
              {conglomeradosFiltradas.map((conglomerado) => (
                <div
                  key={conglomerado.id}
                  className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-emerald-100 overflow-hidden hover:scale-105 hover:-translate-y-1"
                >
                  {/* Header del Card */}
                  <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
                    <h3 className="text-lg font-bold text-white truncate flex items-center gap-2">
                      <span className="text-xl">🌳</span>
                      {conglomerado.nombre}
                    </h3>
                  </div>

                  {/* Body del Card */}
                  <div className="p-6 space-y-4">
                    {/* Información Principal */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-emerald-700 mb-1">Descripción</p>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {conglomerado.descripcion || "No asignada"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-emerald-700 mb-1">Región</p>
                          <p className="text-sm text-gray-700">{conglomerado.region}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-emerald-700 mb-1">Ubicación</p>
                          <p className="text-sm text-gray-700">{conglomerado.ubicacion}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-emerald-700 mb-1">Fecha de Creación</p>
                          <p className="text-sm text-gray-700">{conglomerado.fecha_creacion}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-emerald-100">
                      <button
                        onClick={() => navigate(`/${user.usuario.rol === "admin" ? "admin" : "user"}/conglomerados/${conglomerado.id}`)}
                        className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver Conglomerado
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
};

export default Conglomerados;
