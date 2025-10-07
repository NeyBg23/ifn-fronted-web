// src/pages/Brigadas.jsx
/*
import React, { useEffect, useState } from "react";
import { getBrigadas } from "../services/api";

function Brigadas() {
  const [brigadas, setBrigadas] = useState([]);

  useEffect(() => {
    const fetchBrigadas = async () => {
      const session = JSON.parse(localStorage.getItem("session"));
      const token = session?.access_token;

      try {
        const data = await getBrigadas(token);
        setBrigadas(data);
      } catch (err) {
        console.error("Error al obtener brigadas:", err);
      }
    };

    fetchBrigadas();
  }, []);

  return (
    <div className="home-container">
      <h2>📋 Lista de Brigadas</h2>
      {brigadas.length === 0 ? (
        <p>No hay brigadas registradas.</p>
      ) : (
        <ul>
          {brigadas.map((b) => (
            <li key={b.id}>
              {b.nombre} — {b.ubicacion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Brigadas;
*/
// src/pages/admin/Brigadas.jsx
// 🧸 Explicación: Esta es la habitación del admin. Hay botones para crear empleados y brigadas, como en un juego de construcción.

// src/pages/admin/Brigadas.jsx
// 🧸 Explicación: Esta es la página del admin. Como un mapa del tesoro: muestra listas y formularios. Usamos useState para guardar lo que escribes, y useEffect para cargar datos de la base.
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
  const [usuarios, setUsuarios] = useState([]);  // 🧸 Lista de empleados de la base
  const [brigadas, setBrigadas] = useState([]);  // 🧸 Lista de brigadas
  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";  // 🧸 Dirección del backend

  // 🧸 Paso mágico: Carga datos cuando entras a la página (como buscar tesoros al inicio del juego)
  useEffect(() => {
    const fetchData = async () => {
      const session = JSON.parse(localStorage.getItem("session"));  // 🧸 La llave (token) del login
      if (!session) return alert("¡Necesitas login! 🔑");

      // Pide empleados
      const resUsuarios = await fetch(`${API_URL}/api/usuarios`, {
        headers: { Authorization: `Bearer ${session.access_token}` }  // 🧸 Envía la llave para que backend deje pasar
      });
      
      const dataUsuarios = await resUsuarios.json();
      setUsuarios(dataUsuarios.data || []);  // 🧸 Guarda en la lista

      // Pide brigadas
      const resBrigadas = await fetch(`${API_URL}/api/brigadas`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const dataBrigadas = await resBrigadas.json();
      setBrigadas(dataBrigadas.data || []);
    };
    fetchData();  // 🧸 Llama a la función
  }, []);  // 🧸 Solo corre una vez al entrar

  // 🧸 Formulario para nuevo empleado (como tu imagen)
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre_completo: "", cargo: "", region: "", telefono: "", correo: "", fecha_ingreso: "", descripcion: ""
  });

  const handleChangeEmpleado = (e) => {
    setNuevoEmpleado({ ...nuevoEmpleado, [e.target.name]: e.target.value });  // 🧸 Guarda lo que escribes
  };

  const handleCrearEmpleado = async (e) => {
    e.preventDefault();  // 🧸 Evita recargar la página
    const session = JSON.parse(localStorage.getItem("session"));
    const res = await fetch(`${API_URL}/api/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify(nuevoEmpleado)  // 🧸 Envía los datos al backend
    });
    if (res.ok) {
      alert("¡Empleado creado! 🌟");
      setRuta("Brigadas");  // 🧸 Vuelve a la lista
      // Recarga datos para ver el nuevo
      // Puedes llamar fetchData() de nuevo aquí
    } else {
      alert("¡Ups! Algo salió mal 😔");
    }
  };

  // 🧸 Similar para crear brigada (selecciona empleados de la lista)
  // ... (agrega código similar para brigadas, con <select> para elegir jefe y brigadistas)

  return (
    <div className="brigadas-container">  {/* 🧸 Contenedor principal, con CSS para fondo verde */}
      {ruta === "Brigadas" && (
        <div className="lista-brigadas">
          <h1>Brigadas del Bosque 🌳</h1>
          <p>Aquí ves las brigadas y empleados guardados en la base de datos.</p>
          <button className="btn-crear" onClick={() => setRuta("CrearEmpleado")}>Crear Nuevo Empleado 👷</button>
          <button className="btn-crear" onClick={() => setRuta("CrearBrigada")}>Crear Nueva Brigada 🛡️</button>
          
          {/* 🧸 Lista de empleados como tarjetas (refleja la base) */}
          <div className="cards-grid">
            {usuarios.map((user) => (
              <div key={user.id} className="card-empleado">  {/* 🧸 Cada uno es una tarjeta */}
                <img src={user.foto_url || "default-foto.jpg"} alt="Foto" className="card-img" />
                <h3>{user.nombre_completo}</h3>
                <p>Cargo: {user.cargo}</p>
                <p>Región: {user.region}</p>
                {/* Más detalles */}
              </div>
            ))}
          </div>
          
          {/* Similar para brigadas */}
        </div>
      )}

      {ruta === "CrearEmpleado" && (
        <form className="form-empleado" onSubmit={handleCrearEmpleado}>  {/* 🧸 Formulario como en tu imagen */}
          <h2>Registrar Nuevo Empleado 📝</h2>
          
          <label>Nombre Completo:</label>
          <input type="text" name="nombre_completo" value={nuevoEmpleado.nombre_completo} onChange={handleChangeEmpleado} placeholder="Ej: Juan Perez" required />
          
          <label>Cargo:</label>
          <input type="text" name="cargo" value={nuevoEmpleado.cargo} onChange={handleChangeEmpleado} placeholder="Ej: Ingeniero Forestal" />
          
          <label>Región:</label>
          <input type="text" name="region" value={nuevoEmpleado.region} onChange={handleChangeEmpleado} placeholder="Ej: Amazonas" />
          
          <label>Teléfono:</label>
          <input type="text" name="telefono" value={nuevoEmpleado.telefono} onChange={handleChangeEmpleado} placeholder="Ej: +57 312 456 7890" />
          
          <label>Correo:</label>
          <input type="email" name="correo" value={nuevoEmpleado.correo} onChange={handleChangeEmpleado} placeholder="Ej: juan.perez@ifn.gov.co" required />
          
          <label>Fecha de Ingreso:</label>
          <input type="date" name="fecha_ingreso" value={nuevoEmpleado.fecha_ingreso} onChange={handleChangeEmpleado} />
          
          <label>Subir Imagen:</label>
          <input type="file" accept="image/*" />  {/* 🧸 Para subir foto, envía al backend después */}
          
          <label>Hoja de Vida (PDF):</label>
          <input type="file" accept=".pdf" />  {/* 🧸 Similar para PDF */}
          
          <button type="submit" className="btn-guardar">Guardar Empleado 💾</button>
        </form>
      )}

      {/* 🧸 Agrega similar para "CrearBrigada" con selects */}
    </div>
  );
};

export default Brigadas;