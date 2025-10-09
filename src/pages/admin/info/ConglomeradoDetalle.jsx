import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ConglomeradoDetalle = () => {
    const { idconglomerado } = useParams(); // 🧭 obtiene el parámetro de la URL
    const navigate = useNavigate();
    const [conglomerado, setConglomerado] = useState(null);

    useEffect(() => {
        const fetchConglomerado = async () => {
            const session = JSON.parse(localStorage.getItem("session"));
            const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

            const res = await fetch(`${API_URL}/api/conglomerados/${idconglomerado}`, {
                headers: { Authorization: `Bearer ${session?.access_token}` },
            });

            const data = await res.json();
            setConglomerado(data);
        };

        fetchConglomerado();
    }, [idconglomerado]);

    if (!conglomerado) return <p>Cargando conglomerado...</p>;

    return (
        <div className="container mt-4">
            <button type="button" className="btn btn-outline-danger" onClick={() => navigate(-1)}>
                ⬅️ Volver
            </button>

            <h2>Conglomerado: {conglomerado.data.nombre}</h2>
            <p><strong>Ubicación:</strong> {conglomerado.data.ubicacion}</p>
            <p><strong>Región:</strong> {conglomerado.data.region}</p>
            <p><strong>Descripción:</strong> {conglomerado.data.descripcion}</p>
            <p><strong>Fecha Creación:</strong> {conglomerado.data.fecha_creacion}</p>
        </div>
    );
};

export default ConglomeradoDetalle;