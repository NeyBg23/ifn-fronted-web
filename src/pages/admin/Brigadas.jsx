import "../../styles/Home.css";
import image from "../../img/banner.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Brigadas = () => {
  const [ruta, setRuta] = useState("Brigadas");
  const brigadas = Array.from({ length: 8 }, (_, i) => i + 1);
  const navigate = useNavigate(); // ✅ corregido

  // ✅ Para cambiar ruta del navegador si quieres hacerlo con navigate
  const handleNavigate = (dir) => {
    navigate(`/${dir}`);
  };

  return (
    <div className="brigadas-container">
      {ruta === "Brigadas" && (

        <div className="cards-container-brigadas">
          <h1>Brigadas</h1>
          <p>Aquí puedes gestionar las brigadas.</p>
          <div className="crearBrigada">
            <p>SI DESEA CONFORMAR UNA NUEVA BRIGADA, DALE CLICK AL BOTÓN<br />EN LA PARTE INFERIOR DE ESTE TEXTO</p>
            <button className="btn btn-success" onClick={() => setRuta("CrearBrigada")}>
              Crear Brigada
            </button>
          </div>
          {brigadas.map((num) => (
            <div key={num} className="card" style={{ width: "20rem", color: "white" }}>
              <img
                src={image}
                className="card-img-top" style={{ border-radius: 50px }}
                alt="imagen_empleado"
              />
              <div className="card-body colorBody">
                <h5 className="card-title"><b>BRIGADA</b><br /> Torbellino {num}</h5>
                <p className="card-text">
                  <b>JEFE DE BRIGADA</b> Carlos Martin Pinto Grisales
                  <br />
                  <b>PARTICIPANTES</b> 25 Miembros
                  <br />
                  <b>¿EN EXPEDICIÓN?</b>
                  <div id="estado-brigada">Están en expedición</div>
                </p>
                <a href="#" className="btn btn-primary">Ver Brigada</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {ruta === "CrearBrigada" && (
        <div className="eeee">
          <h1>Crear Brigada</h1>
          <p>Aquí puedes crear una nueva brigada.</p>
          {/* Aquí va tu formulario */}
        </div>
      )}
    </div>
  );
};

export default Brigadas;
