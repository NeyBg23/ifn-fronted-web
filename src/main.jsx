import { StrictMode } from 'react' // ← Importa StrictMode para ayudar a detectar problemas en la aplicación
import { createRoot } from 'react-dom/client' // ← Importa createRoot para renderizar la aplicación en el DOM
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
