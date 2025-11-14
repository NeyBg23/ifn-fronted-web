import { useState, useEffect } from 'react'
import '../styles/LevantamientoDatos.css'

// ACTUALIZADO: URL correcta del backend de Brigadas
const API_BRIGADAS = 'https://brigada-informe-ifn.vercel.app'

export default function LevantamientoDatos() {
  const [conglomerado, setConglomerado] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarConglomeradoBrigadista = async () => {
      try {
        // Obtener token del localStorage
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Token no disponible. Por favor, inicia sesión.')

        // Llamar al endpoint correcto: GET /api/brigadista/mi-conglomerado
        const response = await fetch(
          `${API_BRIGADAS}/api/brigadista/mi-conglomerado`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('No tienes conglomerado asignado aún')
          }
          throw new Error(`Error del servidor: ${response.status}`)
        }

        const data = await response.json()
        
        // Guardar el conglomerado obtenido
        if (data.conglomerado) {
          setConglomerado(data.conglomerado)
          console.log('✅ Conglomerado cargado:', data.conglomerado)
        }
        
        setCargando(false)
      } catch (err) {
        console.error('❌ Error cargando conglomerado:', err)
        setError(err.message)
        setCargando(false)
      }
    }

    cargarConglomeradoBrigadista()
  }, [])

  // Estado de carga
  if (cargando) {
    return (
      <div style={{ 
        padding: '2rem', 
        color: '#1B5E20',
        textAlign: 'center',
        fontSize: '1.2rem'
      }}>
        ⏳ Obteniendo tu conglomerado asignado...
      </div>
    )
  }

  // Error
  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        color: 'white',
        backgroundColor: '#d32f2f',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        ❌ {error}
      </div>
    )
  }

  // Sin conglomerado
  if (!conglomerado) {
    return (
      <div style={{ 
        padding: '2rem', 
        color: '#1565c0',
        textAlign: 'center'
      }}>
        No hay conglomerado asignado en este momento
      </div>
    )
  }

  // Conglomerado cargado correctamente
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>📍 Levantamiento de Datos IFN</h1>
      
      {/* Mostrar datos del conglomerado pre-poblado */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        backgroundColor: '#e8f5e9', 
        borderRadius: '8px',
        border: '3px solid #1B5E20'
      }}>
        <h2>✅ Tu Conglomerado Asignado</h2>
        
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Código:</strong> {conglomerado.codigo}</p>
          <p><strong>Nombre:</strong> {conglomerado.nombre || 'N/A'}</p>
          <p><strong>Ubicación:</strong> {conglomerado.ubicacion || 'N/A'}</p>
          <p><strong>Coordenadas:</strong> {conglomerado.latitud}, {conglomerado.longitud}</p>
          <p><strong>Descripción:</strong> {conglomerado.descripcion || 'N/A'}</p>
          <p><strong>Estado:</strong> <span style={{ color: '#1B5E20', fontWeight: 'bold' }}>Listo para captura</span></p>
        </div>

        {/* Botón para iniciar captura */}
        <button 
          onClick={() => alert('Captura de datos: En desarrollo para PASO 5')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1B5E20',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          🔍 Iniciar Captura de Datos
        </button>
      </div>

      {/* Panel informativo */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        borderLeft: '4px solid #1B5E20'
      }}>
        <h4>📋 Información del IFN</h4>
        <p style={{ fontSize: '0.95rem', color: '#666' }}>
          Este conglomerado es una unidad de muestreo con <strong>5 subparcelas</strong> de 
          <strong> 3,535 m²</strong> cada una. Procede con el levantamiento de datos siguiendo 
          el manual del Inventario Forestal Nacional.
        </p>
      </div>
    </div>
  )
}