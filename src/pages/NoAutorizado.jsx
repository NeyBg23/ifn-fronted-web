// 📄 src/pages/NoAutorizado.jsx
// Página que se muestra cuando el usuario no tiene permisos

function NoAutorizado() {
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
      <a href="/admin" style={{
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '5px'
      }}>
        ← Volver a inicio
      </a>
    </div>
  );
}

export default NoAutorizado;
