// 📂 src/pages/Brigadas.jsx
// -------------------------------------------------------------
// Este componente muestra todas las brigadas que vienen del backend.
// Si el usuario tiene un token válido (autenticado),
// podrá ver las brigadas como tarjetas bonitas 💳

// 🧩 Importamos las herramientas necesarias
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Home.css"; // Tu CSS general
import banner from "../../img/banner.jpg"; // Imagen de fondo o cabecera

const Brigadas = () => {
  // 🚀 useState guarda los datos que vienen del backend
  const [brigadas, setBrigadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 🧭 Cuando el componente se carga → llama al backend
  useEffect(() => {
    const obtenerBrigadas = async () => {
      try {
        // 🪪 Obtenemos el token del usuario (guardado al hacer login)
        const session = JSON.parse(localStorage.getItem("session"));
        const token = session?.access_token;

        if (!token) {
          alert("Debes iniciar sesión para ver las brigadas ❌");
          navigate("/"); // Redirige al login
          return;
        }

        // 🌐 Hacemos la petición al backend de brigadas
        const respuesta = await fetch(
          "https://brigada-informe-ifn.vercel.app/api/brigadas", // <-- tu backend desplegado
          {
            headers: {
              Authorization: `Bearer ${token}`, // Enviamos el token
            },
          }
        );

        // 📦 Convertimos la respuesta en JSON
        const data = await respuesta.json();

        if (!respuesta.ok) throw new Error(data.error || "Error al obtener brigadas");

        // ✅ Guardamos las brigadas en el estado
        setBrigadas(data.data || []);
      } catch (err) {
        console.error("❌ Error:", err);
        setError("No se pudieron cargar las brigadas.");
      } finally {
        setCargando(false);
      }
    };

    obtenerBrigadas();
  }, [navigate]);

  // 🧱 HTML que se mostrará en pantalla
  if (cargando) return <p>Cargando brigadas... ⏳</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="brigadas-container">
      <h1>🌲 Brigadas</h1>
      <p>Aquí puedes ver todas las brigadas registradas.</p>

      <div className="crearBrigada">
        <p>¿Quieres crear una nueva brigada?</p>
        <button
          className="btn btn-success"
          onClick={() => navigate("/crear-brigada")}
        >
          Crear Brigada
        </button>
      </div>

      {/* 🧩 Mostramos todas las brigadas en forma de tarjetas */}
      <div className="cards-container-brigadas">
        {brigadas.length === 0 ? (
          <p>No hay brigadas registradas aún.</p>
        ) : (
          brigadas.map((brigada) => (
            <div
              key={brigada.id}
              className="card brigada-card"
              style={{ width: "20rem", color: "white" }}
            >
              <img src={banner} className="card-img-top" alt="imagen_brigada" />
              <div className="card-body colorBody">
                <h5 className="card-title">
                  <b>{brigada.nombre || "Sin nombre"}</b>
                </h5>
                <p className="card-text">
                  <b>Jefe de Brigada:</b>{" "}
                  {brigada.jefe_brigada || "No asignado"}
                  <br />
                  <b>Descripción:</b> {brigada.descripcion || "Sin descripción"}
                  <br />
                  <b>Fecha de creación:</b>{" "}
                  {new Date(brigada.fecha_creacion).toLocaleDateString("es-CO")}
                </p>
                <button className="btn btn-primary">
                  Ver detalles
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Brigadas;
