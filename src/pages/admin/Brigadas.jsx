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

import { useState, useEffect } from "react";
import "../../styles/Home.css";


const Brigadas = () => {
  const [ruta, setRuta] = useState("Brigadas");
  const [usuarios, setUsuarios] = useState([]);  // Lista de empleados
  const [brigadas, setBrigadas] = useState([]);  // Lista de brigadas
  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";  // Backend

  // 🧸 Carga datos al entrar.
  useEffect(() => {
    const fetchData = async () => {
      const session = JSON.parse(localStorage.getItem("session"));
      const resUsuarios = await fetch(`${API_URL}/api/usuarios`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const dataUsuarios = await resUsuarios.json();
      setUsuarios(dataUsuarios.data || []);

      const resBrigadas = await fetch(`${API_URL}/api/brigadas`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const dataBrigadas = await resBrigadas.json();
      setBrigadas(dataBrigadas.data || []);
    };
    fetchData();
  }, []);

  // 🧸 Formulario para crear empleado (como tu imagen).
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre_completo: "", correo: "", cargo: "", region: "", telefono: "", fecha_ingreso: "", descripcion: ""
  });

  const handleCrearEmpleado = async (e) => {
    e.preventDefault();
    const session = JSON.parse(localStorage.getItem("session"));
    await fetch(`${API_URL}/api/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify(nuevoEmpleado)
    });
    alert("Empleado creado! 🎉");
    // Recarga lista
  };

  // 🧸 Similar para crear brigada: Selecciona empleados y jefe con <select multiple>.

  return (
    <div className="brigadas-container">
      {ruta === "Brigadas" && (
        <div>
          <h1>Brigadas</h1>
          <button onClick={() => setRuta("CrearEmpleado")}>Crear Empleado</button>
          <button onClick={() => setRuta("CrearBrigada")}>Crear Brigada</button>
          {/* Lista de brigadas como cards */}
        </div>
      )}
      {ruta === "CrearEmpleado" && (
        <form onSubmit={handleCrearEmpleado}>
          {/* Inputs como en imagen: Nombre, Cargo, Región, etc. */}
          <input type="text" placeholder="Nombre Completo" onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, nombre_completo: e.target.value})} />
          {/* ... más inputs */}
          <button type="submit">Guardar Empleado</button>
        </form>
      )}
      {/* Similar para CrearBrigada: Select para jefe y brigadistas */}
    </div>
  );
};

export default Brigadas; // 🧸 Fin del código del admin