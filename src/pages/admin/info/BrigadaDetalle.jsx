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

      <h2>Brigada: {brigada.data.nombre}</h2>
      <p><strong>Responsable:</strong> {brigada.data.jefe_brigada || "No asignado"}</p>
      <p><strong>Región:</strong> {brigada.data.region}</p>
      <p><strong>Estado:</strong> {brigada.data.estado}</p>
      <p><strong>Miembros:</strong> {brigada.data.miembros?.length || 0}</p>


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

export default BrigadaDetalle;
