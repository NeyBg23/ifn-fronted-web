import { useNavigate } from 'react-router-dom'
// 📄 src/pages/NoAutorizado.jsx
// Página que se muestra cuando el usuario no tiene permisos

function NoAutorizado() {
    const navigate = useNavigate();
    // Función para volver a la página anterior

    const irALogin = () => {
        localStorage.removeItem('token'); // Elimina el token del almacenamiento local
        localStorage.removeItem('usuario');  // Elimina el usuario del almacenamiento local       
        navigate('/login', { replace: true  });     // Redirige a la página de login     
    }
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>❌ Acceso Denegado</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>
        No tienes permisos para acceder a esta página.
      </p>
      <p style={{ fontSize: '14px', color: '#999' }}>
        Contacta al administrador si crees que es un error.
      </p>
      <button 
        onClick={irALogin}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        🔐 Volver a Login
      </button>
    </div>
  );
}

export default NoAutorizado;
