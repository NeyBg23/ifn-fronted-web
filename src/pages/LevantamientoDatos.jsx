import { useState, useEffect } from 'react'
import '../styles/LevantamientoDatos.css'

const API_BASE = 'https://monitoring-backend.vercel.app'

export default function LevantamientoDatos() {
  const [conglomerados, setConglomerados] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarConglomerados = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Token no disponible')

        const response = await fetch(`${API_BASE}/api/conglomerados`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) throw new Error('Error obteniendo conglomerados')
        const data = await response.json()
        
        setConglomerados(data.data || [])
        setCargando(false)
      } catch (err) {
        console.error('Error:', err)
        setError(err.message)
        setCargando(false)
      }
    }

    cargarConglomerados()
  }, [])

  if (cargando) {
    return <div style={{ padding: '2rem', color: '#1B5E20' }}>Cargando conglomerados...</div>
  }

  if (error) {
    return <div style={{ padding: '2rem', color: 'red' }}>❌ Error: {error}</div>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📍 Levantamiento de Datos IFN</h1>
      
      <div style={{ marginTop: '2rem' }}>
        <label>Selecciona un conglomerado:</label>
        <select 
          value={seleccionado || ''} 
          onChange={(e) => setSeleccionado(e.target.value)}
          style={{ 
            padding: '0.75rem', 
            width: '100%', 
            marginTop: '0.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          <option value="">-- Seleccionar conglomerado --</option>
          {conglomerados.map((cong) => (
            <option key={cong.id} value={cong.id}>
              {cong.codigo} - {cong.nombre || 'Sin nombre'}
            </option>
          ))}
        </select>
      </div>

      {seleccionado && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1.5rem', 
          backgroundColor: '#e8f5e9', 
          borderRadius: '8px',
          border: '2px solid #1B5E20'
        }}>
          <h3>✅ Conglomerado Seleccionado</h3>
          <p>ID: <strong>{seleccionado}</strong></p>
          <p>Estado: <strong style={{ color: '#1B5E20' }}>Listo para captura</strong></p>
          <button style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1B5E20',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '1rem'
          }}>
            🔍 Iniciar Captura de Datos
          </button>
        </div>
      )}
    </div>
  )
}
