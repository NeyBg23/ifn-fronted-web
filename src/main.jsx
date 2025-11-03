// src/main.jsx
import { StrictMode } from 'react' // ← Importa StrictMode para ayudar a detectar problemas en la aplicación
import { createRoot } from 'react-dom/client' // ← Importa createRoot para renderizar la aplicación en el DOM
import { AuthProvider } from './hooks/useAuth.jsx';// ← Importa el proveedor de autenticación // ← Asegura que toda la app tenga acceso al contexto de autenticación // este lo cree yo cuando hice el archivo useAuth.jsx
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* AuthProvider envuelve toda la app para proporcionar contexto de autenticación */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
