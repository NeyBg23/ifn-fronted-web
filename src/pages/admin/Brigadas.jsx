import "../../styles/Home.css";
import image from "../../img/banner.jpg";

const Brigadas = () => {
  const brigadas = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <div className="brigadas-container">
      <h1>Brigadas</h1>
      <p>Aquí puedes gestionar las brigadas registradas.</p>

      <div className="cards-container-brigadas">
        {brigadas.map((num) => (
          <div key={num} className="card" style={{ width: "20rem", color: "white" }}>
            <img
              src={image}
              className="card-img-top"
              alt="imagen_empleado"
            />
            <div className="card-body colorBody">
              <h5 className="card-title"><b>BRIGADA</b><br /> Torbellino {num}</h5>
              <p className="card-text">
                <b>JEFE DE BRIGADA</b> Carlos Martin Pinto Grisales
                <br />
                <b>PARTICIPANTES</b> 25 Miembros
                <br />
                <b>¿EN EXPEDICIÓN?</b><div id="estado-brigada">Están en expedición</div>
              </p>
              <a href="#" className="btn btn-primary">
                Ver Brigada
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brigadas;
