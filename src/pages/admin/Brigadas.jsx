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
import "../../styles/Brigadas.css";  // 🎨 Estilos visuales para la interfaz

const Brigadas = () => {

  // 🧭 Estado de navegación interna (qué vista mostrar: lista o formulario)
  const [ruta, setRuta] = useState("Brigadas");

  // 🧱 Estados para almacenar datos desde la base (vía backend)
  const [usuarios, setUsuarios] = useState([]);   // Lista de empleados/brigadistas
  const [brigadas, setBrigadas] = useState([]);   // Lista de brigadas

  // 🌍 URL base del backend de Brigadas (se puede configurar en el .env)
  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

  // 🧙‍♀️ useEffect: se ejecuta una vez al cargar la página
  useEffect(() => {
    // Función asincrónica para traer datos desde el backend
    const fetchData = async () => {
      const session = JSON.parse(localStorage.getItem("session")); // Token del login
      if (!session) {
        alert("¡Necesitas iniciar sesión para acceder a esta página! 🔑");
        return;
      }

      try {
        // 👥 Solicitud para obtener la lista de empleados (usuarios)
        const resUsuarios = await fetch(`${API_URL}/api/usuarios`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        // ⚠️ Si el servidor responde con HTML (error), evitar crash del frontend
        if (!resUsuarios.ok) throw new Error("No se pudo obtener usuarios");
        const dataUsuarios = await resUsuarios.json();
        setUsuarios(dataUsuarios.data || []);  // Guarda resultado en el estado

        // 🛡️ Solicitud para obtener la lista de brigadas
        const resBrigadas = await fetch(`${API_URL}/api/brigadas`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!resBrigadas.ok) throw new Error("No se pudo obtener brigadas");
        const dataBrigadas = await resBrigadas.json();
        setBrigadas(dataBrigadas.data || []);
      } catch (error) {
        console.error("❌ Error al obtener datos:", error.message);
        alert("Error al conectar con el servidor 😔");
      }
    };

    fetchData();  // Ejecuta la función al cargar
  }, []); // 🔁 Solo se ejecuta una vez

  // 🧾 Estado y funciones del formulario para crear nuevo empleado
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre_completo: "",
    cargo: "",
    region: "",
    telefono: "",
    correo: "",
    fecha_ingreso: "",
    descripcion: "",
  });

  // ✏️ Manejador para actualizar los campos del formulario
  const handleChangeEmpleado = (e) => {
    setNuevoEmpleado({
      ...nuevoEmpleado,
      [e.target.name]: e.target.value,  // Actualiza campo correspondiente
    });
  };

  // 💾 Enviar nuevo empleado al backend
  const handleCrearEmpleado = async (e) => {
    e.preventDefault(); // Evita recargar la página
    const session = JSON.parse(localStorage.getItem("session"));
    if (!session) return alert("Debes iniciar sesión primero 🔑");

    try {
      const res = await fetch(`${API_URL}/api/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(nuevoEmpleado),
      });

      if (res.ok) {
        alert("✅ Empleado creado correctamente");
        setRuta("Brigadas"); // Vuelve a la lista principal
        // Opcional: volver a cargar los datos
        // fetchData();
      } else {
        throw new Error("Error al crear el empleado");
      }
    } catch (error) {
      console.error("❌ Error al crear empleado:", error.message);
      alert("Error en el servidor al crear empleado 😔");
    }
  };

  // 🧱 Render principal
  return (
    <div className="brigadas-container">
      
      {/* 🌳 VISTA 1: Lista general de brigadas y empleados */}
      {ruta === "Brigadas" && (
        <div className="lista-brigadas">
          <h1>Brigadas del Bosque 🌳</h1>
          <p>Aquí puedes ver todas las brigadas y empleados registrados.</p>

          {/* Botones de navegación interna */}
          <button className="btn-crear" onClick={() => setRuta("CrearEmpleado")}>
            Crear Nuevo Empleado 👷
          </button>
          <button className="btn-crear" onClick={() => setRuta("CrearBrigada")}>
            Crear Nueva Brigada 🛡️
          </button>

          {/* 👥 Lista de empleados como tarjetas */}
          <div className="cards-grid">
            {usuarios.length === 0 && <p>No hay empleados registrados aún.</p>}
            {usuarios.map((user) => (
              <div key={user.id} className="card-empleado">
                <img
                  src={user.foto_url || "default-foto.jpg"}
                  alt="Foto"
                  className="card-img"
                />
                <h3>{user.nombre_completo}</h3>
                <p><strong>Cargo:</strong> {user.cargo}</p>
                <p><strong>Región:</strong> {user.region}</p>
              </div>
            ))}
          </div>

          {/* 🧩 (opcional) Render de brigadas en otra sección */}
          <div className="cards-grid brigadas-grid">
            {brigadas.map((b) => (
              <div key={b.id} className="card-brigada">
                <h3>{b.nombre}</h3>
                <p>{b.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🧾 VISTA 2: Formulario para crear nuevo empleado */}
      {ruta === "CrearEmpleado" && (
        <form className="form-empleado" onSubmit={handleCrearEmpleado}>
          <h2>Registrar Nuevo Empleado 📝</h2>

          <label>Nombre Completo:</label>
          <input
            type="text"
            name="nombre_completo"
            value={nuevoEmpleado.nombre_completo}
            onChange={handleChangeEmpleado}
            placeholder="Ej: Juan Perez"
            required
          />

          <label>Cargo:</label>
          <input
            type="text"
            name="cargo"
            value={nuevoEmpleado.cargo}
            onChange={handleChangeEmpleado}
            placeholder="Ej: Ingeniero Forestal"
          />

          <label>Región:</label>
          <input
            type="text"
            name="region"
            value={nuevoEmpleado.region}
            onChange={handleChangeEmpleado}
            placeholder="Ej: Amazonas"
          />

          <label>Teléfono:</label>
          <input
            type="text"
            name="telefono"
            value={nuevoEmpleado.telefono}
            onChange={handleChangeEmpleado}
            placeholder="Ej: +57 312 456 7890"
          />

          <label>Correo:</label>
          <input
            type="email"
            name="correo"
            value={nuevoEmpleado.correo}
            onChange={handleChangeEmpleado}
            placeholder="Ej: juan.perez@ifn.gov.co"
            required
          />

          <label>Fecha de Ingreso:</label>
          <input
            type="date"
            name="fecha_ingreso"
            value={nuevoEmpleado.fecha_ingreso}
            onChange={handleChangeEmpleado}
          />

          {/* Archivos (por implementar en backend con Supabase Storage) */}
          <label>Subir Imagen:</label>
          <input type="file" accept="image/*" />

          <label>Hoja de Vida (PDF):</label>
          <input type="file" accept=".pdf" />

          <button type="submit" className="btn-guardar">
            Guardar Empleado 💾
          </button>

          <button
            type="button"
            className="btn-cancelar"
            onClick={() => setRuta("Brigadas")}
          >
            Cancelar 🚪
          </button>
        </form>
      )}

      {/* 🛠️ VISTA 3: Formulario para crear nueva brigada (por implementar) */}
      {ruta === "CrearBrigada" && (
        <div className="form-brigada">
          <h2>Crear Nueva Brigada 🛡️</h2>
          <p>⚙️ En construcción...</p>
          <button onClick={() => setRuta("Brigadas")}>Volver</button>
        </div>
      )}
    </div>
  );
};

export default Brigadas;
