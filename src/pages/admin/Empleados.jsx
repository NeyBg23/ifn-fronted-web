// Para la animación de aparición de izquierda a su posición fija
import AOS from "aos";
import "aos/dist/aos.css";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/Brigadas.css";
import supabase from "../../db/supabase";
import empleado_imagen from "../../img/empleado.png";

export default function Empleados() {
  const navigate = useNavigate();

  // Estado para lista de empleados y filtros
  const [empleados, setEmpleados] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCorreo, setFiltroCorreo] = useState("");
  const [filtroCedula, setFiltroCedula] = useState("");
  const [filtroRegion, setFiltroRegion] = useState("");
  const [mostrarErrorContraseña, setMostrarErrorContraseña] = useState(false);

  // Estado para nuevo empleado (todos los campos)
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre_completo: "",
    contraseña: "",
    confirmarContraseña: "",
    correo: "",
    cedula: "",
    region: "",
    telefono: "",
    direccion: "",
    descripcion: "",
    cargo: "",
    fecha_ingreso: "",
    rol: "brigadista"
  });

  // Estado para manejo de archivo
  const [hojaVida, setHojaVida] = useState(null);
  const API_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL || "http://localhost:5000";

  // Carga inicial de empleados
  useEffect(() => {

    AOS.init({ duration: 900, easing: "ease-out", once: true });

    (async () => {
      const session = JSON.parse(localStorage.getItem("session"));
      // Cambiado alert por console.error
      if (!session) return console.error("¡Necesitas login! 🔑");
      const res = await fetch(`${API_URL}/api/empleados`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      setEmpleados(data.data || []);
    })();
  }, [API_URL]); // Agregado API_URL como dependencia

  // Filtra empleados según inputs
  const empleadosFiltrados = empleados.filter(emp => {
    const n = emp.nombre_completo.toLowerCase().includes(filtroNombre.toLowerCase());
    const c = emp.correo.toLowerCase().includes(filtroCorreo.toLowerCase());
    const ced = emp.cedula?.toLowerCase().includes(filtroCedula.toLowerCase());
    const r = !filtroRegion || emp.region === filtroRegion;
    return n && c && ced && r;
  });

  // Elimina archivo seleccionado
  const handleRemoveFile = () => {
    setHojaVida(null);
    setPreviewUrl(null);
    const inp = document.getElementById("hojaVidaInput");
    if (inp) inp.value = "";
  };

  // Envía creación de empleado
  const handleCrearEmpleado = async e => {
    e.preventDefault();
    setMostrarErrorContraseña(false);
    const session = JSON.parse(localStorage.getItem("session"));
    // Cambiado alert por console.error
    if (!session) return console.error("¡Necesitas login! 🔑");
    if (nuevoEmpleado.contraseña !== nuevoEmpleado.confirmarContraseña) {
      return setMostrarErrorContraseña(true);
    }

    // Subir CV si existe
    let hoja_vida_url = null;
    if (hojaVida) {
      const path = `empleados/${Date.now()}_${hojaVida.name}`;
      const { error: upErr } = await supabase.storage
        .from("hojas_de_vida")
        .upload(path, hojaVida);
      if (upErr) {
        console.error("Error al subir CV:", upErr.message); // Manejo de error de subida
      } else {
        const { data: urlData } = supabase.storage
          .from("hojas_de_vida")
          .getPublicUrl(path);
        hoja_vida_url = urlData.publicUrl;
      }
    }

    const payload = {
      nombre_completo: nuevoEmpleado.nombre_completo,
      correo: nuevoEmpleado.correo,
      cedula: nuevoEmpleado.cedula,
      contraseña: nuevoEmpleado.contraseña,
      region: nuevoEmpleado.region,
      telefono: nuevoEmpleado.telefono,
      direccion: nuevoEmpleado.direccion,
      descripcion: nuevoEmpleado.descripcion,
      cargo: nuevoEmpleado.cargo,
      fecha_ingreso: nuevoEmpleado.fecha_ingreso,
      rol: nuevoEmpleado.rol,
      hoja_vida_url
    };


    console.log("Payload de nuevo empleado:", payload);

    const res = await fetch(`${API_URL}/api/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {

      console.log("✅ Empleado creado correctamente"); // Cambiado alert por console.log

      setEmpleados(prev => [...prev, data.usuario]);
      setNuevoEmpleado({
        nombre_completo: "",
        contraseña: "",
        confirmarContraseña: "",
        correo: "",
        cedula: "",
        region: "",
        telefono: "",
        direccion: "",
        descripcion: "",
        cargo: "",
        fecha_ingreso: "",
        rol: "brigadista"
      });

      handleRemoveFile();
      // El código original hacía referencia a un modal de Bootstrap que debe existir
      // si se usa esta línea. La dejo dentro de un try/catch por si acaso.
      try {
        if (window.bootstrap && document.getElementById("modalNuevoEmpleado")) {
            window.bootstrap.Modal.getInstance(document.getElementById("modalNuevoEmpleado")).hide();
        }
      } catch (error) {
        console.warn("No se pudo cerrar el modal. Asegúrate de que Bootstrap esté disponible.", error);
      }

    } else console.error("❌ Error al crear empleado: " + (data.error || "Intenta nuevamente")); // Cambiado alert por console.error
  };

  return (
    <div className="brigadas-container">
      <div className="lista-brigadas">
        {/* Título */}
        <h1 className="text-center mb-2">
          Empleados{" "}
          <img src={empleado_imagen} alt="Empleado" style={{ width: 60 }} />
        </h1>
        <p className="text-center text-muted mb-4">
          Aquí puedes ver los empleados existentes.
        </p>

        {/* Filtros responsivos */}
        <div className="container mb-4">
          <div className="card p-4">
            <h5 className="mb-4 text-center">🔎 Filtrar Empleados</h5>
            <div className="row g-1">
              <div className="col-12 col-md-6 col-lg-4">
                <input
                  className="form-control"
                  placeholder="Nombre..."
                  value={filtroNombre}
                  onChange={e => setFiltroNombre(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <input
                  className="form-control"
                  placeholder="Correo..."
                  value={filtroCorreo}
                  onChange={e => setFiltroCorreo(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <input
                  className="form-control"
                  placeholder="Cédula..."
                  value={filtroCedula}
                  onChange={e => setFiltroCedula(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <select
                  className="form-select"
                  value={filtroRegion}
                  onChange={e => setFiltroRegion(e.target.value)}
                >
                  <option value="">Todas regiones</option>
                  <option value="Amazonía">Amazonía</option>
                  <option value="Pacífico">Pacífico</option>
                  <option value="Andina">Andina</option>
                  <option value="Caribe">Caribe</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Botón nuevo empleado - CORRECCIÓN APLICADA AQUÍ */}
        <div className="text-center mb-4">
          <button
            className="btn btn-success"
            // Se utiliza 'onClick' y se envuelve 'navigate' en una función flecha
            onClick={() => navigate('/admin/nuevoEmpleado')}
          >
            Crear Nuevo Empleado 🛡️
          </button>
        </div>

        {/* Grid de tarjetas responsivo */}
        <div data-aos="fade-up" className="cards-grid mt-4">
          {empleadosFiltrados.map(emp => (
            <div key={emp.id} className="card-brigada">
              <h3>{emp.nombre_completo}</h3>
              <p><strong>Correo:</strong> {emp.correo}</p>
              <p><strong>Cédula:</strong> {emp.cedula || "No asignada"}</p>
              <p><strong>Región:</strong> {emp.region}</p>
              <p><strong>Cargo:</strong> {emp.cargo || "No asignado"}</p>
              <p><strong>Fecha ingreso:</strong> {emp.fecha_ingreso || "No asignada"}</p>
              <p><strong>Descripción:</strong> {emp.descripcion}</p>
              <button
                className="btn btn-outline-success mt-3 align-self-stretch"
                onClick={() => navigate(`/admin/empleados/${emp.id}`)}
              >
                Ver Empleado
              </button>
            </div>
          ))}
          {empleadosFiltrados.length === 0 && (
            <p className="text-center text-muted">No se encontraron empleados 😅</p>
          )}
        </div>
      </div>
    </div>
  );
}