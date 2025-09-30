import { useEffect } from "react";
import "../../styles/Home.css";

const Brigadas = () => {

    const fetchBrigadas = () => {
        console.log("asd");
        for (let i = 0; i < 5; i++) {
            <div className="card" style={{ width: "18rem" }}>
                <img src="https://cdn.pixabay.com/photo/2023/03/16/08/42/camping-7856198_640.jpg" class="card-img-top" alt="imagen_empleado"/>
                <div class="card-body">
                    <h5 class="card-title">Brigada Tigre</h5>
                    <p class="card-text">Una breve descripción de la brigada.</p>
                    <a href="#" class="btn btn-primary">Ver Brigada</a>
                </div>
            </div>
        }
    };

    return (
        <>
        <h1>Brigadas</h1>
        <p>Aquí puedes gestionar las brigadas registradas.</p>

        <br />

        {fetchBrigadas()}
        </>
    );
};

export default Brigadas;
