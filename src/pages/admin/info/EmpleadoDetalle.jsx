import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const EmpleadoDetalle = async () => {
  const { idempleado } = useParams();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState(null);
  const [signedUrl, setSignedUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchEmpleado = async () => {
      const session = JSON.parse(localStorage.getItem("session"));
      const API_URL =
        import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

      try {
        const res = await fetch(`${API_URL}/api/empleados/${idempleado}`, {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        });

        const data = await res.json();
        setEmpleado(data?.data || null);

        // ✅ Si el empleado tiene hoja de vida, generamos el signed URL
        if (data?.data?.hoja_vida_url) {
          const nombreArchivo = encodeURIComponent(data.data.hoja_vida_url.split("/").pop());

          const resSigned = await fetch(
            `${API_URL}/api/hoja-vida/${encodeURIComponent(nombreArchivo)}`,
            {
              headers: { Authorization: `Bearer ${session?.access_token}` },
            }
          );

          const signedData = await resSigned.json();
          if (signedData?.signedUrl) {
            setSignedUrl(signedData.signedUrl);
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

  if (loading) return <p>Cargando empleado...</p>;
  if (!empleado) return <p>No se encontró el empleado 😔</p>;

  return (
    <div className="container mt-4">
      <button
        type="button"
        className="btn btn-outline-danger"
        onClick={() => navigate(-1)}
      >
        ⬅️ Volver
      </button>

      <h2>Empleado: {empleado.nombre_completo}</h2>
      <p><strong>Correo:</strong> {empleado.correo || "No asignado"}</p>
      <p><strong>Región:</strong> {empleado.region}</p>
      <p><strong>Descripción:</strong> {empleado.descripcion || "No asignada"}</p>
      <p><strong>Teléfono:</strong> {empleado.telefono || "No asignado"}</p>
      <p><strong>Fecha Ingreso:</strong> {empleado.fecha_ingreso || "No asignada"}</p>
      <p><strong>Cédula:</strong> {empleado.cedula || "No asignada"}</p>

      {signedUrl ? (
        <a
          href={signedUrl}
          className="btn btn-primary mt-3"
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
  );
};

export default EmpleadoDetalle;
