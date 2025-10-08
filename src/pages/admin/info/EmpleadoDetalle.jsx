import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const EmpleadoDetalle = () => {
  const { idempleado } = useParams(); // 🧭 obtiene el parámetro de la URL
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState(null);

  useEffect(() => {
    const fetchEmpleado = async () => {
      const session = JSON.parse(localStorage.getItem("session"));
      const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

      const res = await fetch(`${API_URL}/api/empleados/${idempleado}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      const data = await res.json();
      setEmpleado(data);
    };

    fetchEmpleado();
  }, [idempleado]);

  if (!empleado) return <p>Cargando empleado...</p>;

  return (
    <div className="container mt-4">

        <button type="button" className="btn btn-outline-danger" onClick={() => navigate(-1)}>{/* Volver */} ⬅️ Volver</button>

        <h2>Empleado: {empleado.data.nombre_completo}</h2>
        <p><strong>Correo:</strong> {empleado.data.correo || "No asignado"}</p>
        <p><strong>Región:</strong> {empleado.data.region}</p>
        <p><strong>Descripción:</strong> {empleado.data.descripcion || "No asignada"}</p>
        <p><strong>Teléfono:</strong> {empleado.data.telefono || "No asignado"}</p>
        <p><strong>Fecha Ingreso:</strong> {empleado.data.fecha_ingreso || "No asignada"}</p>
        <p><strong>Cédula:</strong> {empleado.data.cedula || "No asignada"}</p>
        <a href="docs/hoja_maria_perez.pdf" className="btn btn-primary mt-3" download>📄 Descargar Hoja de Vida</a>
    </div>
  );
};

export default EmpleadoDetalle;
