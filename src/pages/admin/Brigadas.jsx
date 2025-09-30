import "../../styles/Home.css";

const Brigadas = () => {
  const fetchBrigadas = () => {
    const cards = [];
    for (let i = 0; i < 6; i++) {
      cards.push(
        <div key={i} className="card" style={{ width: "18rem", margin: "1rem" }}>
          <img
            src="https://cdn.pixabay.com/photo/2023/03/16/08/42/camping-7856198_640.jpg"
            className="card-img-top"
            alt="imagen_empleado"
          />
          <div className="card-body">
            <h5 className="card-title">Brigada {i + 1}</h5>
            <p className="card-text">Una breve descripción de la brigada.</p>
            <a href="#" className="btn btn-primary">
              Ver Brigada
            </a>
          </div>
        </div>
      );
    }
    return cards; // ✅ Retorna el array de JSX
  };

  return (
    <>
      <h1>Brigadas</h1>
      <p>Aquí puedes gestionar las brigadas registradas.</p>
      <div style={{ display: "flex", flexWrap: "wrap" }}>{fetchBrigadas()}</div>
    </>
  );
};

export default Brigadas;
