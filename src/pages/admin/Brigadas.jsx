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



  return (
    <div className="brigadas-container">  {/* 🧸 Contenedor principal, con CSS para fondo verde */}
      {ruta === "Brigadas" && (
        <div className="lista-brigadas">
          <h1>Brigadas del Bosque 🌳</h1>
          <p>Aquí puedes ver las brigadas existentes.</p>

          <div className="card p-4 mb-4">
              <h5 className="mb-3">🔎 Filtrar Brigadas</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <input type="text" id="filtroNombre" className="form-control" placeholder="Buscar por nombre..."/>
                </div>
                <div className="col-md-4 mb-2">
                    <select id="filtroRegion" className="form-select">
                    <option value="">Todas las regiones</option>
                    <option value="Amazonía">Amazonía</option>
                    <option value="Pacífico">Pacífico</option>
                    <option value="Andina">Andina</option>
                    <option value="Caribe">Caribe</option>
                    </select>
                </div>
              </div>
            </div>
          <p>Aquí puedes crear una nueva brigada.</p>
          <button className="btn-crear" onClick={() => setRuta("CrearBrigada")}>Crear Nueva Brigada 🛡️</button>
          
          {/* 🧸 Lista de brigadas como tarjetas (refleja la base) */}
          <div className="cards-grid">
            {brigadas.map((brigada) => (
              <div key={brigada.id} className="card-brigada">  {/* 🧸 Cada uno es una tarjeta */}
                <h3>{brigada.nombre}</h3>
                <p>Responsable: {brigada.jefe_brigada}</p>
                <p>Región: Andina</p>
                <p>Miembros: 5</p>
                {/* Más detalles */}
                <button type="button" className="btn btn-outline-success">Ver Brigada</button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Brigadas;