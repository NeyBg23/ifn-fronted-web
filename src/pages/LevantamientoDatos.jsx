import { useState, useEffect } from 'react'
import '../styles/LevantamientoDatos.css'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


//  CONFIGURACIÓN DE APIs
const API_BRIGADAS = 'https://brigada-informe-ifn.vercel.app'
//const API_LEVANTAMIENTO = 'https://monitoring-backend-eight.vercel.app/' //  En producción
//  DESARROLLO LOCAL (comentar Vercel)
const API_LEVANTAMIENTO = 'https://monitoring-backend-eight.vercel.app'    //  En desarrollo

export default function LevantamientoDatos() {
  // ========== ESTADO GENERAL ==========
  const [conglomerado, setConglomerado] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [cacheArboles, setCacheArboles] = useState({}) // Guardar por subparcela_id
  // ========== ESTADO SUBPARCELAS ==========
  const [subparcelas, setSubparcelas] = useState([])
  const [subparcelaSeleccionada, setSubparcelaSeleccionada] = useState(null)

  // ========== ESTADO FORMULARIO ÁRBOL ==========
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [arbolForm, setArbolForm] = useState({
    numero_arbol: '',
    especie: '',
    dap: '',
    altura: '',
    condicion: 'vivo',
    observaciones: ''
  })
  const [enviando, setEnviando] = useState(false)

  // ========== ESTADO LISTADO ÁRBOLES ==========
  const [arboles, setArboles] = useState([])
  const [cargandoArboles, setCargandoArboles] = useState(false)

  // ========== ESTADO RESUMEN/CONTEO ==========
  const [resumen, setResumen] = useState(null)
  const [validacion, setValidacion] = useState(null)
  const [cargandoResumen, setCargandoResumen] = useState(false)


  // ========== MOSTRAR MAPA DE ÁRBOLES DETECTADOS ==========

  const mostrarMapaArboles = async () => {
    try {
      if (!conglomerado || !subparcelaSeleccionada) {
        alert('Debe seleccionar una subparcela primero');
        return;
      }

      let data;

      // Verificar cache
      if (cacheArboles[subparcelaSeleccionada]) {
        data = cacheArboles[subparcelaSeleccionada];
      } else {
        // GET para obtener árboles guardados
        const responseGet = await fetch(
          `${API_LEVANTAMIENTO}/api/levantamiento/detecciones/${subparcelaSeleccionada}`,
          { method: 'GET', headers: { 'Content-Type': 'application/json' } }
        );

        let arbolesExistentes = [];
        if (responseGet.ok) {
          const dataGet = await responseGet.json();
          arbolesExistentes = dataGet.data || [];
        }

        // Si no hay árboles, detectar nuevos
        if (arbolesExistentes.length === 0) {
          const responsePost = await fetch(
            'https://monitoring-backend-eight.vercel.app/api/levantamiento/detectar-arboles-satelital',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                conglomerado_id: conglomerado.id,
                subparcela_id: subparcelaSeleccionada
              })
            }
          );

          data = await responsePost.json();

          if (!data.success) {
            alert('Error: ' + data.error);
            return;
          }
        } else {
          data = {
            success: true,
            arboles: arbolesExistentes,
            estadisticas: {
              dap_promedio: (arbolesExistentes.reduce((a, b) => a + (b.dap || 0), 0) / arbolesExistentes.length).toFixed(2),
              altura_promedio: (arbolesExistentes.reduce((a, b) => a + (b.altura || 0), 0) / arbolesExistentes.length).toFixed(2),
              vivos: arbolesExistentes.filter(a => a.condicion === 'vivo').length,
              enfermos: arbolesExistentes.filter(a => a.condicion === 'enfermo').length,
              muertos: arbolesExistentes.filter(a => a.condicion === 'muerto').length
            }
          };
        }

        setCacheArboles(prev => ({
          ...prev,
          [subparcelaSeleccionada]: data
        }));
      }

      // ========== VERIFICACIÓN CRÍTICA ==========
      if (!data || !data.arboles || data.arboles.length === 0) {
        alert('Error: No se obtuvieron datos de árboles');
        return;
      }

      // ========== FUNCIÓN PARA CALCULAR COORDENADAS ==========
      // Convierte azimut y distancia a latitud/longitud
      const calcularCoordenadas = (latBase, lngBase, azimut, distancia) => {
        // distancia en metros, convertir a grados (1 grado ≈ 111,320 metros)
        const distanciaGrados = distancia / 111320;
        
        // Convertir azimut a radianes
        const azimuteRad = (azimut * Math.PI) / 180;
        
        // Calcular nueva latitud y longitud
        const latNueva = latBase + distanciaGrados * Math.cos(azimuteRad);
        const lngNueva = lngBase + (distanciaGrados * Math.sin(azimuteRad)) / Math.cos((latBase * Math.PI) / 180);
        
        return [latNueva, lngNueva];
      };

      // ========== MAPA ==========
      const mapContainer = document.getElementById('mapContainer');
      if (!mapContainer) {
        alert('Contenedor del mapa no encontrado');
        return;
      }

      // Centro del mapa: conglomerado
      //const coordenadasCentro = [
        //Number(conglomerado.latitud) || 4.6097,
        //Number(conglomerado.longitud) || -74.0817
      //];

      const obtenerCentroSubparcela = () => {
        // ✅ Mapeo con UUIDs reales a coordenadas
        const centros = {
          '8c7e0893-8800-403c-bb5d-403bec4f3e27': [4.790639, -73.829806],  // SP1 Centro
          '1b12b55c-9986-4989-b5fe-ca2fc33bfccc': [4.792437, -73.829806],  // SP2 Norte
          '2d7738f2-f995-479d-9d19-801e91091821': [4.790639, -73.827394],  // SP3 Este
          'aef3af41-312b-42b1-a1a3-ec5fb87ef41f': [4.788841, -73.829806],  // SP4 Sur
          '63fe16cb-6c44-4708-b592-aa9e2eebe78e': [4.790639, -73.832218]   // SP5 Oeste
        };
        return centros[subparcelaSeleccionada] || [4.790639, -73.829806];
      };


      // Inicializar o actualizar mapa
      // ✅ Asigna correctamente el centro según subparcela seleccionada
      const coordenadasCentro = obtenerCentroSubparcela();


      const mapa = window.mapaActual;

      // Dibujar radio de subparcela (15m)
      L.circle(coordenadasCentro, {
        radius: 15,
        color: '#0033cc',
        weight: 2,
        opacity: 0.3,
        fillOpacity: 0.05
      })
        .bindPopup(`<b>Radio Subparcela: 15 m</b><br>Área: 707 m²`)
        .addTo(mapa);

      // Dibujar centro
      L.circleMarker(coordenadasCentro, {
        radius: 6,
        fillColor: '#0066ff',
        color: '#0033cc',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      })
        .bindPopup('<b>🎯 Centro de la Subparcela</b>')
        .addTo(mapa);

      // ✅ Dibujar árboles con coordenadas CALCULADAS
      data.arboles.slice(0, 20).forEach((arbol) => {
        // Calcular coordenadas a partir de azimut y distancia
        const [arbolLat, arbolLng] = calcularCoordenadas(
          Number(conglomerado.latitud) || 4.6097,
          Number(conglomerado.longitud) || -74.0817,
          arbol.azimut || 0,
          arbol.distancia || 100
        );

        const color = obtenerColorPorCategoria(arbol.categoria);

        L.circleMarker([arbolLat, arbolLng], {
          radius: 6,
          fillColor: color,
          color: color,
          weight: 1,
          opacity: 0.9,
          fillOpacity: 0.7
        })
          .bindPopup(
            `<div style="font-family: Arial; font-size: 12px;">
              <b>🌳 Árbol ${arbol.numero_arbol}</b><br>
              <b>Categoría:</b> ${arbol.categoria}<br>
              <b>DAP:</b> ${arbol.dap} cm<br>
              <b>Altura:</b> ${arbol.altura} m<br>
              <b>Condición:</b> ${arbol.condicion}<br>
              <b>Confianza:</b> ${(arbol.confianza * 100).toFixed(0)}%<br>
              <b>Azimut:</b> ${arbol.azimut}°<br>
              <b>Distancia:</b> ${arbol.distancia}m
            </div>`
          )
          .addTo(mapa);
      });

      const arboles20 = data.arboles.slice(0, 20);
      alert(`${arboles20.length} árboles mostrados en el mapa

  DAP promedio: ${data.estadisticas.dap_promedio} cm
  Altura promedio: ${data.estadisticas.altura_promedio} m

  Vivos: ${data.estadisticas.vivos}
  Enfermos: ${data.estadisticas.enfermos}
  Muertos: ${data.estadisticas.muertos}`);

    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error mostrando mapa: ' + error.message);
    }
  };








const obtenerColorPorCategoria = (categoria) => {
  switch (categoria) {
    case 'FG':
      return '#cc0000'; // Rojo: Fustal Grande
    case 'F':
      return '#ff6600'; // Naranja: Fustal
    case 'L':
      return '#ffcc00'; // Amarillo: Latizal
    case 'B':
      return '#00cc00'; // Verde: Brinzal
    default:
      return '#999999';
  }
};



  // ========== CARGAR CONGLOMERADO ==========
  useEffect(() => {
    const cargarConglomeradoBrigadista = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Token no disponible')

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
            throw new Error('No tienes conglomerado asignado')
          }
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        if (data.conglomerado) {
          // ✅ BRIGADA devuelve TODO lo que necesitamos
          setConglomerado(data.conglomerado)
          console.log('✅ Árboles cargados:', data.data)
          console.log(' Llamando cargarResumenSubparcela para:', subparcelaSeleccionada
)

          // Cargar subparcelas
          cargarSubparcelas(data.conglomerado.id)
          // Cargar resumen general
          cargarResumenConglomerado(data.conglomerado.id)
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



  // ========== CARGAR SUBPARCELAS ==========
  const cargarSubparcelas = async (conglomeradoId) => {
    try {
      // ✅ UUIDs reales de las subparcelas en Supabase
      const subparcelas_temp = [
        { 
          id: '8c7e0893-8800-403c-bb5d-403bec4f3e27', 
          numero: 1, 
          nombre: 'Subparcela 1 (Centro)',
          latitud: 4.790639,
          longitud: -73.829806
        },
        { 
          id: '1b12b55c-9986-4989-b5fe-ca2fc33bfccc', 
          numero: 2, 
          nombre: 'Subparcela 2 (Norte)',
          latitud: 4.792437,
          longitud: -73.829806
        },
        { 
          id: '2d7738f2-f995-479d-9d19-801e91091821', 
          numero: 3, 
          nombre: 'Subparcela 3 (Este)',
          latitud: 4.790639,
          longitud: -73.827394
        },
        { 
          id: 'aef3af41-312b-42b1-a1a3-ec5fb87ef41f', 
          numero: 4, 
          nombre: 'Subparcela 4 (Sur)',
          latitud: 4.788841,
          longitud: -73.829806
        },
        { 
          id: '63fe16cb-6c44-4708-b592-aa9e2eebe78e', 
          numero: 5, 
          nombre: 'Subparcela 5 (Oeste)',
          latitud: 4.790639,
          longitud: -73.832218
        }
      ]

      setSubparcelas(subparcelas_temp)
      if (subparcelas_temp.length > 0) {
        setSubparcelaSeleccionada(subparcelas_temp[0].id)
        cargarArboles(subparcelas_temp[0].id)
      }
    } catch (err) {
      console.error('Error cargando subparcelas:', err)
    }
  }

  const cargarArboles = async (subparcelaSeleccionada) => {
    try {
      console.log(' Iniciando cargarArboles para:', subparcelaSeleccionada)
      setCargandoArboles(true)
      
      const response = await fetch(
        `${API_LEVANTAMIENTO}/api/levantamiento/detecciones/${subparcelaSeleccionada}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      )

      if (response.ok) {
        const data = await response.json()
        setArboles(data.data || [])
        console.log('✅ Árboles cargados:', data.data)
        
        //  LLAMAR resumen
        console.log(' Llamando cargarResumenSubparcela para:', subparcelaSeleccionada)
        await cargarResumenSubparcela(subparcelaSeleccionada)
      }
      setCargandoArboles(false)
    } catch (err) {
      console.error('❌ Error cargando árboles:', err)
      setCargandoArboles(false)
    }
  }





  // ========== CARGAR RESUMEN CONGLOMERADO ==========
  const cargarResumenConglomerado = async (conglomeradoId) => {
    try {
      setCargandoResumen(true)
      const response = await fetch(
        `${API_LEVANTAMIENTO}/api/levantamiento/resumen-conglomerado/${conglomeradoId}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      )

      if (response.ok) {
        const data = await response.json()
        setResumen(data.resumen)
        console.log('✅ Resumen conglomerado:', data.resumen)
      }
      setCargandoResumen(false)
    } catch (err) {
      console.error('❌ Error cargando resumen:', err)
      setCargandoResumen(false)
    }
  }

  // ========== CARGAR RESUMEN SUBPARCELA ==========
  const cargarResumenSubparcela = async (subparcelaSeleccionada
) => {
    try {
      const response = await fetch(
        `${API_LEVANTAMIENTO}/api/levantamiento/resumen-subparcela/${subparcelaSeleccionada}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      )

      if (response.ok) {
        const data = await response.json()
        setResumen(data.resumen)
      }
    } catch (err) {
      console.error('Error cargando resumen subparcela:', err)
    }
  }



  // ========== CARGAR VALIDACIÓN ==========
  const cargarValidacion = async (conglomeradoId) => {
    try {
      const response = await fetch(
        `${API_LEVANTAMIENTO}/api/levantamiento/validar/${conglomeradoId}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      )

      if (response.ok) {
        const data = await response.json()
        setValidacion(data)
        console.log('✅ Validación:', data)
      }
    } catch (err) {
      
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

  if (!conglomerado || !subparcelaSeleccionada) {
    alert('❌ Error: No hay conglomerado o subparcela seleccionada')
    return
  }

  if (!arbolForm.numero_arbol || !arbolForm.especie || !arbolForm.dap) {
    alert('❌ Completa campos obligatorios: Número, Especie, DAP')
    return
  }

  const dap = parseFloat(arbolForm.dap)
  if (dap < 0.1 || dap > 300) {
    alert('❌ DAP debe estar entre 0.1 y 300 cm')
    return
  }

  try {
    setEnviando(true)

    const datosArbol = {
      subparcela_id: subparcelaSeleccionada,
      conglomerado_id: conglomerado.id,
      numero_arbol: parseInt(arbolForm.numero_arbol),
      especie: arbolForm.especie,
      dap: parseFloat(arbolForm.dap),
      altura: arbolForm.altura ? parseFloat(arbolForm.altura) : null,
      condicion: arbolForm.condicion,
      observaciones: arbolForm.observaciones || ''
    }

    

    const response = await fetch(
      `${API_LEVANTAMIENTO}/api/levantamiento/registrar-arbol`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosArbol)
      }
    )

    if (!response.ok) {
      try {
        const result = await response.json()
        
        alert(`❌ Error: ${result.error || 'Error desconocido'}`)
      } catch (e) {
        
        alert('❌ Error registrando árbol')
      }
      setEnviando(false)
      return
    }

    const result = await response.json()




    

    setArbolForm({
      numero_arbol: '',
      especie: '',
      dap: '',
      altura: '',
      condicion: 'vivo',
      observaciones: ''
    })
    setMostrarFormulario(false)

    cargarArboles(subparcelaSeleccionada)
    cargarResumenConglomerado(conglomerado.id)
    alert('✅ Árbol registrado exitosamente')
    
  } catch (err) {
    
    
  } finally {
    setEnviando(false)
  }
}



  // ========== CAMBIAR SUBPARCELA ==========
  const cambiarSubparcela = (subparcelaSeleccionada) => {
    setSubparcelaSeleccionada(subparcelaSeleccionada)
    cargarArboles(subparcelaSeleccionada)
  }

  // ========== RENDERIZADO ==========

  if (cargando) {
    return (
      <div style={{ padding: '2rem', color: '#1B5E20', textAlign: 'center', fontSize: '1.2rem' }}>
        ⏳ Obteniendo tu conglomerado...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', color: 'white', backgroundColor: '#d32f2f', borderRadius: '8px', textAlign: 'center' }}>
        ❌ {error}
      </div>
    )
  }

  if (!conglomerado) {
    return (
      <div style={{ padding: '2rem', color: '#1565c0', textAlign: 'center' }}>
        No hay conglomerado asignado
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h1>📍 Levantamiento de Datos IFN </h1>

    {/* INFO CONGLOMERADO */}
    <div style={{ 
      marginTop: '2rem', 
      padding: '1.5rem', 
      backgroundColor: '#e8f5e9', 
      borderRadius: '8px',
      border: '3px solid #1B5E20'
    }}>
      <h2>✅ Conglomerado Asignado</h2>
      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <p><strong>Código:</strong> {conglomerado?.codigo || 'N/A'}</p>
        <p><strong>Departamento:</strong> <span style={{color: '#1B5E20', fontWeight: 'bold'}}>{conglomerado?.departamento || 'Cundinamarca'}</span></p>
        <p><strong>Municipio:</strong> <span style={{color: '#1B5E20', fontWeight: 'bold'}}>{conglomerado?.municipio || 'Cargando (zona de prueba)'}</span></p>
        <p><strong>Ubicación:</strong> {conglomerado?.ubicacion || 'Zona de prueba cerca de Bogotá'}</p>
        <p><strong>Coordenadas:</strong> Lat: {conglomerado?.latitud ? conglomerado.latitud.toFixed(6) : '4.609700'}, Long: {conglomerado?.longitud ? conglomerado.longitud.toFixed(6) : '-74.081700'}</p>
        <p><strong>Estado:</strong> <span style={{ color: '#1B5E20', fontWeight: 'bold' }}>Listo para captura</span></p>
      </div>
    </div>



      {/* RESUMEN GENERAL */}
      {resumen && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f3e5f5',
          borderRadius: '8px',
          border: '2px solid #7b1fa2'
        }}>
          <h3>📊 Resumen de Conteo Automático</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', color: '#1B5E20', margin: 0 }}>{resumen.total_arboles}</p>
              <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Total Árboles</p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', color: '#2e7d32', margin: 0 }}>🟢 {resumen.arboles_vivos}</p>
              <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Vivos</p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', color: '#c62828', margin: 0 }}>🔴 {resumen.arboles_muertos}</p>
              <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Muertos</p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', color: '#f57f17', margin: 0 }}>🟡 {resumen.arboles_enfermos}</p>
              <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Enfermos</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', color: '#1976d2', margin: 0 }}>{resumen.diametro_promedio} cm</p>
              <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>DAP Promedio</p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', color: '#1976d2', margin: 0 }}>{resumen?.altura_promedio || '0'} m</p>
              <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Altura Promedio</p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', color: '#1976d2', margin: 0 }}>{resumen.especies_unicas}</p>
              <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Especies Únicas</p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ fontSize: '1rem', color: '#666', margin: 0 }}>
                🌱 B: {resumen.categorias?.brinzales}<br/>
                🌿 L: {resumen.categorias?.latizales}<br/>
                🌳 F: {resumen.categorias?.fustales}<br/>
                🌲 FG: {resumen.categorias?.fustales_grandes}
              </p>
              <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Categorías</p>
            </div>
          </div>
        </div>
      )}

     

      {/* SELECTOR SUBPARCELAS */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#fff3e0',
        borderRadius: '8px',
        border: '2px solid #ff9800'
      }}>
        <h3>🗂️ Seleccionar Subparcela</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          {subparcelas.map(sp => (
            <button
              key={sp.id}
              onClick={() => cambiarSubparcela(sp.id)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: subparcelaSeleccionada === sp.id ? '#1B5E20' : '#e8f5e9',
                color: subparcelaSeleccionada === sp.id ? 'white' : '#1B5E20',
                border: '2px solid #1B5E20',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {sp.nombre}
            </button>
          ))}
        </div>

        {/* BOTÓN MAPA AFUERA DEL MAP */}
        <button
          onClick={mostrarMapaArboles}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#0066ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '1rem'
          }}
        >
          🗺️ Mostrar Mapa de Árboles Detectados
        </button>

        {/* CONTENEDOR MAPA (UN SOLO DIV) */}
        <div
          id="mapContainer"
          style={{
            height: '500px',
            width: '100%',
            marginTop: '1rem',
            border: '2px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#f0f0f0'
          }}
        />
      </div>


      {/* BOTÓN AGREGAR ÁRBOL */}
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

      {/* FORMULARIO ÁRBOL */}
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

              <div>
                <label style={{ fontWeight: 'bold' }}>DAP (cm) * (0.1-300)</label>
                <input
                  type="number"
                  name="dap"
                  value={arbolForm.dap}
                  onChange={manejarCambioFormulario}
                  placeholder="Ej: 25.5"
                  step="0.1"
                  min="0.1"
                  max="300"
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

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

      {/* LISTADO ÁRBOLES */}
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
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
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
                      {arbol.condicion === 'vivo' && '🟢'}
                      {arbol.condicion === 'muerto' && '🔴'}
                      {arbol.condicion === 'enfermo' && '🟡'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VALIDACIÓN */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        borderLeft: '4px solid #1976d2'
      }}>
        <button 
          onClick={() => conglomerado && cargarValidacion(conglomerado.id)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🔍 Verificar Calidad de Datos
        </button>
        
        {validacion && (
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Porcentaje de validación:</strong> {validacion.porcentaje_validacion}%</p>
            <p><strong>Errores encontrados:</strong> {validacion.total_errores}</p>
            {validacion.total_errores > 0 && (
              <ul style={{ marginTop: '0.5rem', color: '#d32f2f' }}>
                {validacion.errores.sin_especie > 0 && <li>Sin especie: {validacion.errores.sin_especie}</li>}
                {validacion.errores.sin_dap > 0 && <li>Sin DAP: {validacion.errores.sin_dap}</li>}
                {validacion.errores.dap_fuera_rango > 0 && <li>DAP fuera de rango: {validacion.errores.dap_fuera_rango}</li>}
                {validacion.errores.sin_condicion > 0 && <li>Sin condición: {validacion.errores.sin_condicion}</li>}
                {validacion.errores.altura_inconsistente > 0 && <li>Altura inconsistente: {validacion.errores.altura_inconsistente}</li>}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* INFO PANEL */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        borderLeft: '4px solid #1B5E20'
      }}>
        <h4>📋 Información del IFN</h4>
        <p style={{ fontSize: '0.95rem', color: '#666' }}>
          Este conglomerado tiene <strong>5 subparcelas</strong> de <strong>3,535 m²</strong> cada una. 
          Registra todos los árboles según Manual IFN. Los datos se validan automáticamente.
        </p>
      </div>
    </div>
  )
}