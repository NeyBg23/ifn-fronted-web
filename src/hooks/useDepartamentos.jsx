import { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';

/**
 * Hook personalizado para obtener departamentos y municipios
 * desde Supabase en tiempo real
 */
export const useDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 📍 Obtener departamentos al montar el componente
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoading(true);

        // ✅ PASO 1: Obtener departamentos de Supabase
        console.log("🔍 Obteniendo departamentos desde Supabase...");
        
        const { data: deptos, error: errDeptos } = await supabase
          .from('departamentos')
          .select('id, codigo, nombre, region')
          .order('nombre', { ascending: true });

        if (errDeptos) {
          console.error("❌ Error obteniendo departamentos:", errDeptos);
          setError("Error obteniendo departamentos: " + errDeptos.message);
          setLoading(false);
          return;
        }

        console.log("✅ Departamentos obtenidos:", deptos?.length || 0);
        setDepartamentos(deptos || []);

        // ✅ PASO 2: Obtener municipios de Supabase
        console.log("🔍 Obteniendo municipios desde Supabase...");
        
        const { data: munis, error: errMunis } = await supabase
          .from('municipios')
          .select('id, codigo, nombre, departamento_id, latitud, longitud')
          .order('nombre', { ascending: true });

        if (errMunis) {
          console.error("❌ Error obteniendo municipios:", errMunis);
          setError("Error obteniendo municipios: " + errMunis.message);
          setLoading(false);
          return;
        }

        console.log("✅ Municipios obtenidos:", munis?.length || 0);
        setMunicipios(munis || []);

        setLoading(false);

      } catch (err) {
        console.error("❌ Error en useDepartamentos:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  /**
   * Obtener municipios filtrados por departamento_id
   * @param {string} departamentoId - ID del departamento
   * @returns {array} Municipios del departamento
   */
  const getMunicipiosPorDepartamento = (departamentoId) => {
    if (!departamentoId) return [];
    
    const filtered = municipios.filter(
      muni => muni.departamento_id === departamentoId
    );
    
    console.log(`📍 Municipios para departamento ${departamentoId}:`, filtered.length);
    return filtered;
  };

  /**
   * Obtener nombre del departamento por ID
   */
  const getNombreDepartamento = (id) => {
    const depto = departamentos.find(d => d.id === id);
    return depto?.nombre || '';
  };

  /**
   * Obtener nombre del municipio por ID
   */
  const getNombreMunicipio = (id) => {
    const muni = municipios.find(m => m.id === id);
    return muni?.nombre || '';
  };

  return {
    departamentos,
    municipios,
    loading,
    error,
    getMunicipiosPorDepartamento,
    getNombreDepartamento,
    getNombreMunicipio,
  };
};

export default useDepartamentos;