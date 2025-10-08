/**
 * 🌳 Brigadas.jsx
 * ------------------------------------------------------------
 * Página principal para gestionar Brigadas y Empleados (Brigadistas)
 * - Lista todos los usuarios registrados en la base.
 * - Permite crear nuevos empleados.
 * - Permite ver o crear brigadas (agrupaciones de empleados).
 * 
 * 📦 Se comunica con el microservicio `brigada-service-ifn`
 *    a través del endpoint definido en VITE_BRIGADA_SERVICE_URL.
 * 
 * 🔐 Las peticiones están protegidas: se envía el token JWT
 *    almacenado en localStorage (obtenido durante el login).
 */

import { useState, useEffect } from "react";
import "../../styles/Brigadas.css";  // 🧸 Importamos los estilos bonitos (crearemos este archivo después)

const Brigadas = () => {
  const [ruta, setRuta] = useState("Brigadas");  // 🧸 Cambia entre vistas (como páginas de un libro)
  const [brigadas, setBrigadas] = useState([]);  // 🧸 Lista de brigadas
  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";  // 🧸 Dirección del backend

  // 🧸 Paso mágico: Carga datos cuando entras a la página (como buscar tesoros al inicio del juego)
  useEffect(() => {
    const fetchData = async () => {
      const session = JSON.parse(localStorage.getItem("session"));  // 🧸 La llave (token) del login
      if (!session) return alert("¡Necesitas login! 🔑");

      // Pide brigadas
      const resBrigadas = await fetch(`${API_URL}/api/brigadas`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const dataBrigadas = await resBrigadas.json();
      setBrigadas(dataBrigadas.data || []);
    };
    fetchData();  // 🧸 Llama a la función
  }, []);  // 🧸 Solo corre una vez al entrar

  // 🧸 Similar para crear brigada (selecciona empleados de la lista)
  // ... (agrega código similar para brigadas, con <select> para elegir jefe y brigadistas)

  return (
    <div className="brigadas-container">  {/* 🧸 Contenedor principal, con CSS para fondo verde */}
      {ruta === "Brigadas" && (
        <div className="lista-brigadas">
          <h1>Brigadas del Bosque 🌳</h1>
          <p>Aquí puedes ver las brigadas existentes.</p>
          <button className="btn-crear" onClick={() => setRuta("CrearBrigada")}>Crear Nueva Brigada 🛡️</button>
          
          {/* 🧸 Lista de empleados como tarjetas (refleja la base) */}
          <div className="cards-grid">
            {brigadas.map((brigada) => (
              <div key={brigada.id} className="card-brigada">  {/* 🧸 Cada uno es una tarjeta */}
                <h3>{brigada.nombre}</h3>
                <p>Jefe: {brigada.jefe_brigada}</p>
                <p>Miembros: 5</p>
                {/* Más detalles */}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Brigadas;