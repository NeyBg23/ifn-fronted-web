import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

const BrigadaDetalle = () => {
  const { idbrigada } = useParams(); // 🧭 obtiene el parámetro de la URL
  const navigate = useNavigate();
  const [brigada, setBrigada] = useState(null);
  const user = useAuth()

  useEffect(() => {
    const fetchBrigada = async () => {
      const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

      const res = await fetch(`${API_URL}/api/brigadas/${idbrigada}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await res.json();
      setBrigada(data);
    };

    fetchBrigada();
  }, [idbrigada]);

  if (!brigada) return <p>Cargando brigada...</p>;

  return (
    <div className="container mt-4">

      <button type="button" className="btn btn-outline-danger" onClick={() => navigate(-1)}>{/* Volver */} ⬅️ Volver</button>

      <h2>Brigada: {brigada.data.nombre}</h2>
      <p><strong>Responsable:</strong> {brigada.data.jefe_brigada || "No asignado"}</p>
      <p><strong>Región:</strong> {brigada.data.region}</p>
      <p><strong>Estado:</strong> {brigada.data.estado}</p>
      <p><strong>Miembros:</strong> {brigada.data.miembros?.length || 0}</p>
    </div>
  );
};

export default BrigadaDetalle;
