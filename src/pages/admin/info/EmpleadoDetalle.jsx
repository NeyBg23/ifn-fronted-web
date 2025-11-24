import { useParams, useNavigate } from "react-router-dom"; // Para obtener el id de la URL y navegación entre rutas
import { useEffect, useState } from "react"; // Hooks de estado y efecto
import { useAuth } from "../../../hooks/useAuth";          // Hook personalizado de autenticación

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
    <div className="container mt-4">
      <h2>Empleado: {empleado.nombre_completo}</h2>
      <p><strong>Correo:</strong> {empleado.correo || "No asignado"}</p>
      <p><strong>Región:</strong> {empleado.region}</p>
      <p><strong>Descripción:</strong> {empleado.descripcion || "No asignada"}</p>
      <p><strong>Teléfono:</strong> {empleado.telefono || "No asignado"}</p>
      <p><strong>Fecha Ingreso:</strong> {empleado.fecha_ingreso || "No asignada"}</p>
      <p><strong>Cédula:</strong> {empleado.cedula || "No asignada"}</p>

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

      <br />
      <br />

      {/* Botón de volver */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
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