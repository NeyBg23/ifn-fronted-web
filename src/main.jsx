import { StrictMode } from 'react' // ← Importa StrictMode para ayudar a detectar problemas en la aplicación
import { createRoot } from 'react-dom/client' // ← Importa createRoot para renderizar la aplicación en el DOM
import './index.css'  
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
