//// 1️ IMPORTAR LAS HERRAMIENTAS NECESARIAS
import React from 'react';  // ← Trae la biblioteca React (obligatorio
import Login from './components/Login';   // ← Importa nuestro componente Login
import './styles/App.css';   // ← Importa los estilos para este componente

// 2️: DEFINIR EL COMPONENTE PRINCIPAL
function App() {
  // 3️: RETORNAR LO QUE SE VA A MOSTRAR
  return (
    <div className="App">
      <Login />
    </div>
  );
}

// 4️: EXPORTAR EL COMPONENTE PARA USARLO EN OTROS LADOS
export default App;


//function App() → Crea un componente llamado App

//return () → Dice "esto es lo que voy a mostrar"

//<div className="App"> → Un contenedor con clase CSS "App"

//<Login /> → Aquí usamos nuestro componente Login ← ¡EL IMPORTANTE!