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
            console.log(data);
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

            <h2>Conglomerado: {conglomerado.nombre}</h2>
            <p><strong>Ubicación:</strong> {conglomerado.ubicacion}</p>
            <p><strong>Descripción:</strong> {conglomerado.descripcion}</p>
            <p><strong>Fecha Creación:</strong> {conglomerado.fecha_creacion}</p>
        </div>
    );
};

export default ConglomeradoDetalle;