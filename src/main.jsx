import { StrictMode } from 'react' 
// Importa StrictMode de React para activar verificaciones y advertencias adicionales,
// ayudando a detectar efectos secundarios no deseados durante el desarrollo.

import { createRoot } from 'react-dom/client' 
// Importa la función createRoot, el método moderno y recomendado de React 18+
// para inicializar y renderizar la aplicación en el DOM.

import { AuthProvider } from './hooks/useAuth.jsx';
// Importa el componente de Context Provider personalizado (AuthProvider). 
// Este componente gestiona y proporciona el estado de autenticación (usuario, login, logout)
// a cualquier componente anidado que use el hook useAuth.

import App from './App.jsx'
// Importa el componente principal de la aplicación.

import Footer from './pages/components/Footer.jsx';
// Importa el componente Footer que contiene la información de pie de página.

// Usa createRoot para vincular la aplicación al elemento DOM con id 'root'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*       El AuthProvider envuelve toda la aplicación (<App /> y <Footer />).
      Esto asegura que todos los componentes dentro de <AuthProvider>
      puedan acceder a los datos y funciones de autenticación (Context API).
    */}
    <AuthProvider>
      <App />

      { /*         El componente Footer se renderiza aquí, fuera de <App />,
        para asegurar que aparezca fijo al final de la página,
        independientemente de la ruta que esté cargando <App />.
      */ }
      <Footer />
    </AuthProvider>
  </StrictMode>,
)