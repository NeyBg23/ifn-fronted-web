import "../../styles/Home.css";

const Brigadas = () => {
  const brigadas = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <div className="brigadas-container">
      <h1>Brigadas</h1>
      <p>Aquí puedes gestionar las brigadas registradas.</p>

      <div className="cards-container-brigadas">
        {brigadas.map((num) => (
          <div key={num} className="card" style={{ width: "18rem" }}>
            <img
              src="https://cdn.pixabay.com/photo/2023/03/16/08/42/camping-7856198_640.jpg"
              className="card-img-top"
              alt="imagen_empleado"
            />
            <div className="card-body colorBody">
              <h5 className="card-title">Brigada {num}</h5>
              <p className="card-text">
                Una breve descripción de la brigada.
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
