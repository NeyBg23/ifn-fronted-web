import { useState, useEffect } from 'react'
import '../styles/LevantamientoDatos.css'

// ⭐ CONFIGURACIÓN DE APIS
const API_BRIGADAS = 'https://brigada-informe-ifn.vercel.app'
const API_LEVANTAMIENTO = 'https://monitoring-backend-eight.vercel.app/' // 🌲 Backend desplegado de levantamiento

export default function LevantamientoDatos() {
  // ========== ESTADO GENERAL ==========
  const [conglomerado, setConglomerado] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // ========== ESTADO FORMULARIO ÁRBOL ==========
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [arbolForm, setArbolForm] = useState({
    numero_arbol: '',
    especie: '',
    dap: '', // Diámetro a la altura del pecho
    altura: '',
    condicion: 'vivo',
    observaciones: ''
  })
  const [enviando, setEnviando] = useState(false)

  // ========== ESTADO LISTADO ÁRBOLES ==========
  const [arboles, setArboles] = useState([])
  const [cargandoArboles, setCargandoArboles] = useState(false)

  // ========== CARGAR CONGLOMERADO ==========
  useEffect(() => {
    const cargarConglomeradoBrigadista = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Token no disponible. Por favor, inicia sesión.')

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
        if (data.conglomerado) {
          setConglomerado(data.conglomerado)
          console.log('✅ Conglomerado cargado:', data.conglomerado)
          // Cargar árboles del conglomerado
          cargarArboles(data.conglomerado.id)
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

  // ========== CARGAR ÁRBOLES DEL CONGLOMERADO ==========
  const cargarArboles = async (conglomeradoId) => {
    try {
      setCargandoArboles(true)
      const response = await fetch(
        `${API_LEVANTAMIENTO}/api/levantamiento/resumen/${conglomeradoId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setArboles(data.data || [])
        console.log('✅ Árboles cargados:', data.data)
      }
      setCargandoArboles(false)
    } catch (err) {
      console.error('❌ Error cargando árboles:', err)
      setCargandoArboles(false)
    }
  }

  // ========== MANEJAR CAMBIOS EN FORMULARIO ==========
  const manejarCambioFormulario = (e) => {
    const { name, value } = e.target
    setArbolForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // ========== ENVIAR ÁRBOL ==========
  const enviarArbol = async (e) => {
    e.preventDefault()
    
    if (!conglomerado) {
      alert('❌ No hay conglomerado cargado')
      return
    }

    // Validar campos obligatorios
    if (!arbolForm.numero_arbol || !arbolForm.especie || !arbolForm.dap) {
      alert('❌ Por favor completa los campos obligatorios (Número, Especie, DAP)')
      return
    }

    try {
      setEnviando(true)

      const datosArbol = {
        subparcela_id: '1', // ⭐ TODO: Implementar selector de subparcela
        conglomerado_id: conglomerado.id,
        numero_arbol: parseInt(arbolForm.numero_arbol),
        especie: arbolForm.especie,
        dap: parseFloat(arbolForm.dap),
        altura: arbolForm.altura ? parseFloat(arbolForm.altura) : null,
        condicion: arbolForm.condicion,
        observaciones: arbolForm.observaciones,
        usuario_id: localStorage.getItem('user_id') || 'unknown',
        brigada_id: conglomerado.brigada_id || 'unknown'
      }

      console.log('📤 Enviando árbol:', datosArbol)

      const response = await fetch(
        `${API_LEVANTAMIENTO}/api/levantamiento/detecciones-arboles`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datosArbol)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Árbol registrado:', result.data)

      // ✅ Limpiar formulario
      setArbolForm({
        numero_arbol: '',
        especie: '',
        dap: '',
        altura: '',
        condicion: 'vivo',
        observaciones: ''
      })
      setMostrarFormulario(false)

      // ✅ Recargar lista
      cargarArboles(conglomerado.id)
      alert('✅ Árbol registrado exitosamente')
    } catch (err) {
      console.error('❌ Error registrando árbol:', err)
      alert(`❌ Error: ${err.message}`)
    } finally {
      setEnviando(false)
    }
  }

  // ========== RENDERIZADO ==========

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
        ❌ Error: {error}
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
        ℹ️ No hay conglomerado asignado en este momento
      </div>
    )
  }

  // ✅ CONGLOMERADO CARGADO
  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>📍 Levantamiento de Datos IFN</h1>
      
      {/* ✅ INFORMACIÓN DEL CONGLOMERADO */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        backgroundColor: '#e8f5e9', 
        borderRadius: '8px',
        border: '3px solid #1B5E20'
      }}>
        <h2>✅ Tu Conglomerado Asignado</h2>
        
        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <p><strong>Código:</strong> {conglomerado.codigo}</p>
          <p><strong>Nombre:</strong> {conglomerado.nombre || 'N/A'}</p>
          <p><strong>Ubicación:</strong> {conglomerado.ubicacion || 'N/A'}</p>
          <p><strong>Coordenadas:</strong> {conglomerado.latitud}, {conglomerado.longitud}</p>
          <p><strong>Descripción:</strong> {conglomerado.descripcion || 'N/A'}</p>
          <p><strong>Estado:</strong> <span style={{ color: '#1B5E20', fontWeight: 'bold' }}>Listo para captura</span></p>
        </div>

        {/* BOTÓN ABRIR FORMULARIO */}
        <button 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
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
          {mostrarFormulario ? '❌ Cerrar formulario' : '🌳 Registrar Árbol'}
        </button>
      </div>

      {/* ========== FORMULARIO ÁRBOL ========== */}
      {mostrarFormulario && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          border: '2px solid #ff9800'
        }}>
          <h3>📝 Formulario F1 - Detección de Árboles</h3>
          
          <form onSubmit={enviarArbol}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              
              {/* Número de Árbol */}
              <div>
                <label style={{ fontWeight: 'bold' }}>Número de Árbol *</label>
                <input
                  type="number"
                  name="numero_arbol"
                  value={arbolForm.numero_arbol}
                  onChange={manejarCambioFormulario}
                  placeholder="Ej: 1"
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              {/* Especie */}
              <div>
                <label style={{ fontWeight: 'bold' }}>Especie *</label>
                <input
                  type="text"
                  name="especie"
                  value={arbolForm.especie}
                  onChange={manejarCambioFormulario}
                  placeholder="Ej: Pinus patula"
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              {/* DAP (Diámetro) */}
              <div>
                <label style={{ fontWeight: 'bold' }}>DAP (cm) *</label>
                <input
                  type="number"
                  name="dap"
                  value={arbolForm.dap}
                  onChange={manejarCambioFormulario}
                  placeholder="Ej: 25.5"
                  step="0.1"
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              {/* Altura */}
              <div>
                <label style={{ fontWeight: 'bold' }}>Altura (m)</label>
                <input
                  type="number"
                  name="altura"
                  value={arbolForm.altura}
                  onChange={manejarCambioFormulario}
                  placeholder="Ej: 18.5"
                  step="0.1"
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              {/* Condición */}
              <div>
                <label style={{ fontWeight: 'bold' }}>Condición</label>
                <select
                  name="condicion"
                  value={arbolForm.condicion}
                  onChange={manejarCambioFormulario}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="vivo">🟢 Vivo</option>
                  <option value="muerto">🔴 Muerto</option>
                  <option value="enfermo">🟡 Enfermo</option>
                </select>
              </div>

              {/* Observaciones */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontWeight: 'bold' }}>Observaciones</label>
                <textarea
                  name="observaciones"
                  value={arbolForm.observaciones}
                  onChange={manejarCambioFormulario}
                  placeholder="Anotaciones adicionales..."
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    marginTop: '0.5rem', 
                    borderRadius: '4px', 
                    border: '1px solid #ccc',
                    minHeight: '80px',
                    fontFamily: 'Arial'
                  }}
                />
              </div>
            </div>

            {/* BOTONES */}
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                disabled={enviando}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: enviando ? '#ccc' : '#1B5E20',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: enviando ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {enviando ? '⏳ Registrando...' : '✅ Registrar Árbol'}
              </button>
              
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#999',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========== LISTADO DE ÁRBOLES ========== */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        border: '2px solid #1B5E20'
      }}>
        <h3>🌳 Árboles Registrados ({arboles.length})</h3>
        
        {cargandoArboles ? (
          <p>⏳ Cargando árboles...</p>
        ) : arboles.length === 0 ? (
          <p style={{ color: '#666' }}>📭 No hay árboles registrados aún</p>
        ) : (
          <div style={{ 
            overflowX: 'auto',
            marginTop: '1rem'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.95rem'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#1B5E20', color: 'white' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #1B5E20' }}>#</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #1B5E20' }}>Especie</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #1B5E20' }}>DAP (cm)</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #1B5E20' }}>Altura (m)</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #1B5E20' }}>Condición</th>
                </tr>
              </thead>
              <tbody>
                {arboles.map((arbol, idx) => (
                  <tr key={arbol.id} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>{arbol.numero_arbol}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>{arbol.especie}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #ddd' }}>{arbol.dap}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #ddd' }}>{arbol.altura || '-'}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                      {arbol.condicion === 'vivo' && '🟢 Vivo'}
                      {arbol.condicion === 'muerto' && '🔴 Muerto'}
                      {arbol.condicion === 'enfermo' && '🟡 Enfermo'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ℹ️ PANEL INFORMATIVO */}
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