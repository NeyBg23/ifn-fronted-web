import { useParams, useNavigate } from "react-router-dom"; // Para obtener el id de la URL y navegación entre rutas
import { useEffect, useState } from "react"; // Hooks de estado y efecto
import { useAuth } from "../../../hooks/useAuth";          // Hook personalizado de autenticación
// Para la animación de aparición de izquierda a su posición fija
import AOS from "aos";
import "aos/dist/aos.css";

const EmpleadoDetalle = () => {
  // Extrae el parámetro idempleado de la URL
  const { idempleado } = useParams();
  const navigate = useNavigate();

  // Estado para datos del empleado, archivo hoja de vida y carga
  const [empleado, setEmpleado] = useState(null);
  const [signedUrl, setSignedUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useAuth()

  // Efecto para obtener datos del empleado vía API
  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out", once: true });

    const fetchEmpleado = async () => {
      const API_URL =
        import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

      try {
        const res = await fetch(`${API_URL}/api/empleados/${idempleado}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const data = await res.json();

        setEmpleado(data?.data || null);

        // Si el empleado tiene hoja de vida, genera un signed URL
        if (data?.data?.hoja_vida_url) {
          const nombreArchivo = data.data.hoja_vida_url.split("/").pop();

          const resSigned = await fetch(
            `https://fast-api-brigada.vercel.app/hoja-vida/${nombreArchivo}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );

          const signedData = await resSigned.json();

          if (signedData?.signedURL) {
            setSignedUrl(signedData.signedURL);
          }
        }
      } catch (error) {
        console.error("❌ Error cargando empleado:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleado();
  }, [idempleado]);

  // Muestra mensaje de carga si el fetch está en curso
  if (loading) return <p>Cargando empleado...</p>;
  // Si no existe el empleado, muestra mensaje de error
  if (!empleado) return <p>No se encontró el empleado 😔</p>;

  // Render principal con todos los detalles y acciones disponibles
  return (
    <div data-aos="fade-left">
      <div className="flex justify-center cursor-pointer">
        <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-emerald-100 overflow-hidden hover:scale-105 hover:-translate-y-1">
          {/* Header del Card */}
          <div className="bg-gradient-to-r flex gap-5 from-emerald-600 to-green-600 px-6 py-4">
            {empleado.foto_url ?
              <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 overflow-hidden">
                <img src={empleado.foto_url} alt="Foto" className="w-full h-full object-cover rounded-full"/>
              </div>
            :
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                {empleado.nombre_completo?.charAt(0) || '?'}
              </div>
            }
            <h3 className="text-lg font-bold text-white truncate flex items-center gap-2">
              {empleado.nombre_completo}
            </h3>
          </div>
          {/* Body del Card */}
          <div className="p-6 space-y-4">
            {/* Información Principal */}
            <div className="grid gap-5 grid-cols-3 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">Descripción</p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {empleado.descripcion || "No asignada"}
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
                  <p className="text-sm text-gray-700">{empleado.region  || "No asignado"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">Cédula</p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {empleado.cedula || "No asignada"}
                  </p>
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
                  <p className="text-sm text-gray-700">{empleado.telefono || "No asignado"}</p>
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
                  <p className="text-sm text-gray-700">{empleado.fecha_ingreso || "No asignada"}</p>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-emerald-200">
              {/* Acceso a hoja de vida mediante signed URL si existe */}
              {signedUrl ? (
                <a
                  href={signedUrl}
                  className="btn btn-success mt-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 Ver Hoja de Vida
                </a>
              ) : empleado.hoja_vida_url ? (
                <p className="text-muted mt-3">Generando enlace seguro...</p>
              ) : (
                <p className="text-muted mt-3">No tiene hoja de vida cargada.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center m-5 gap-2 px-4 py-2 bg-white text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver
      </button>
    </div>

  );
};

export default EmpleadoDetalle;