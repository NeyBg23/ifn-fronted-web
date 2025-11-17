import AOS from "aos";
import "aos/dist/aos.css";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Brigadas.css";
import { useAuth } from "../hooks/useAuth.jsx";

const Brigadas = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [ruta, setRuta] = useState("Brigadas");
  const [brigadas, setBrigadas] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroRegion, setFiltroRegion] = useState("");

  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out", once: true });

    const fetchData = async () => {
      const token = user.token;
      if (!token) return alert("¡Necesitas login! 🔑");

      {
        user.usuario.rol === "admin" ? (
          (async()=> {
            const resBrigadas = await fetch(`https://fast-api-brigada.vercel.app/brigadas`, {
              method: "GET",
              headers: { 
                Authorization: `Bearer ${token}` 
              }
            });

            const dataBrigadas = await resBrigadas.json();
            setBrigadas(dataBrigadas.data || []);
          })()
        ) : (
          (async()=> {
            const resBrigadas = await fetch(`https://fast-api-brigada.vercel.app/brigadas-usuario/${user.usuario.id}`, {
              method: "GET",
              headers: { 
                Authorization: `Bearer ${token}` 
              }
            });

            const dataBrigadas = await resBrigadas.json();
            setBrigadas(dataBrigadas.data || []);
          })()
        )
      }
    };
    fetchData();
  }, []);

  const brigadasFiltradas = brigadas.filter((brigada) => {
    const coincideNombre = brigada.nombre?.toLowerCase().includes(filtroNombre.toLowerCase());
    const coincideRegion = filtroRegion === "" || brigada.region === filtroRegion;

    return coincideNombre && coincideRegion;
  });

  return (
    <div className="lista-brigadas">
      {ruta === "Brigadas" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Encabezado */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              <span className="text-3xl">🌳</span>
              Brigadas del Bosque
            </h1>

            {
              user.usuario.rol === "admin" ? (
                <p className="text-gray-600 text-lg">
                  Aquí puedes ver y gestionar todas las brigadas existentes.
                </p>

              ) : (
                <p className="text-gray-600 text-lg">
                  Aquí puedes ver todas las brigadas a las que perteneces.
                </p>
              )
            }

          </div>

          {/* Sección de Filtros */}
          <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtrar Brigadas
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    id="filtroNombre"
                    className="w-full px-4 py-3 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    placeholder="Buscar por nombre..."
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Región</label>
                  <select
                    id="filtroRegion"
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

          {/* Mensaje informativo para admins */}
          {user && user.usuario.rol === 'admin' && (
            <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-md">
              <div className="flex justify-center gap-3">
                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-blue-800 font-medium">Nota importante</p>
                  <p className="text-blue-700 text-sm mt-1">Para crear una nueva brigada, dirígete al conglomerado correspondiente desde la sección de Conglomerados.</p>
                </div>
              </div>
            </div>
          )}

          {/* Grid de Brigadas */}
          <div data-aos="fade-up">
            {brigadasFiltradas.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-16">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
                    <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg font-medium">No se encontraron brigadas</p>
                  <p className="text-gray-400 mt-2">Intenta ajustar los filtros o crea una nueva brigada en un conglomerado</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brigadasFiltradas.map((brigada) => (
                  <div
                    key={brigada.id}
                    className="bg-gradient-to-br justify-items-centerfrom-white to-emerald-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-emerald-100 overflow-hidden hover:scale-105 hover:-translate-y-1"
                  >
                    {/* Header del Card */}
                    <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
                      <h3 className="text-lg font-bold text-white truncate flex items-center gap-2">
                        <span className="text-xl">👥</span>
                        {brigada.nombre}
                      </h3>
                    </div>

                    {/* Body del Card */}
                    <div className="p-6 space-y-4">
                      {/* Información Principal */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-emerald-700 mb-1">Jefe de Brigada</p>
                            <p className="text-sm text-gray-700">
                              {brigada.jefe_brigada || "No asignado"}
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
                            <p className="text-sm text-gray-700">{brigada.region || "No Asignada"}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-emerald-700 mb-1">Estado</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              brigada.estado === 'activo' || brigada.estado === 'activa'
                                ? 'bg-emerald-100 text-emerald-700'
                                : brigada.estado === 'inactivo' || brigada.estado === 'inactiva'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {brigada.estado}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-emerald-100">
                        <button
                          onClick={() => navigate(`/admin/brigadas/${brigada.id}`)}
                          className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver Brigada
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Brigadas;
