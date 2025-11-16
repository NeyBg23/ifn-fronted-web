import { useState, useEffect } from 'react';
import { useDepartamentos } from '@/hooks/useDepartamentos';  // ✅ NUEVO - Import Hook
import FileUpload from '@/components/FileUpload';
import supabase from '@/lib/supabaseClient';
import {
  User, Settings, CheckCircle, LockKeyhole, FileText, Upload, FileUp, X,
  PhoneCall,
} from 'lucide-react';

// ============================================================================
// COMPONENTE: StepIndicator
// ============================================================================
const StepIndicator = ({ step, currentStep, totalSteps }) => {
  const isActive = currentStep === step.id;
  const isCompleted = currentStep > step.id;
  const IconComponent = step.icon;

  return (
    <div
      data-step
      aria-disabled={!isActive && !isCompleted}
      className={`group w-full flex items-center transition-all duration-300 ${
        isActive ? 'data-[active=true]' : ''
      } ${isCompleted ? 'data-[completed=true]' : ''}`}
      data-active={isActive}
      data-completed={isCompleted}
    >
      <div className="relative flex flex-col items-center w-full">
        <span className={`relative grid h-10 w-10 place-items-center rounded-full transition-colors duration-300
          ${isCompleted ? 'bg-success text-white' : ''}
          ${isActive ? 'bg-success text-white shadow-lg' : 'bg-slate-200 text-slate-500'}
        `}>
          {isCompleted && step.id === totalSteps ? <CheckCircle className="h-6 w-6" /> : <IconComponent className="h-6 w-6" />}
        </span>
        <span className="absolute whitespace-nowrap text-slate-800 font-bold text-xs md:text-sm lg:text-base top-12">
          Paso {step.id}
        </span>
      </div>
      {step.id < totalSteps && (
        <div
          className={`flex-1 h-1 transition-colors duration-300
            ${isCompleted || isActive ? 'bg-indigo-600' : 'bg-slate-200'}
          `}
        ></div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENTE: FileUpload
// ============================================================================
const FileUploadComponent = ({ 
  file, 
  handleFileChange, 
  handleRemoveFile, 
  id, 
  label, 
  accept, 
  maxSizeMB = 5 
}) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 font-semibold text-slate-700 flex items-center">
        <Upload size={20} className="mr-2 text-success" /> {label} (máx {maxSizeMB}MB)
      </label>
      
      {!file ? (
        <div
          className="border-2 border-dashed border-slate-300 p-6 text-center bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition duration-150"
          onClick={() => document.getElementById(id).click()}
        >
          <input
            type="file"
            id={id}
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <FileUp size={40} className="text-indigo-600 mx-auto mb-2" />
          <p className="font-medium text-slate-700">Haz clic para adjuntar archivo</p>
          <small className="text-slate-500">{accept.split(',').join(', ')}</small>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-indigo-600" />
            <div>
              <p className="mb-0 font-semibold text-slate-800">{file.name}</p>
              <small className="text-slate-600">{(file.size / 1024 / 1024).toFixed(2)} MB</small>
            </div>
          </div>
          <button 
            type="button" 
            onClick={handleRemoveFile}
            className="p-1 rounded-full text-red-600 hover:bg-red-100 transition"
            aria-label="Eliminar archivo"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENTE: StepContent
// ============================================================================
const StepContent = ({ 
  stepId, 
  nuevoEmpleado, 
  handleChange, 
  hojaVida, 
  handleFileChange, 
  handleRemoveFile, 
  fotoPerfil,
  handleFileChangeFotoPerfil,
  handleRemoveFileFotoPerfil,
  mostrarErrorContraseña,
  mostrarErrorCamposVacios,
  // ✅ NUEVO - Props para departamentos y municipios
  departamentos,
  municipiosFiltrados,
  loading,
  error
}) => {
  // ============================================================================
  // PASO 1: DATOS PERSONALES (CON DEPARTAMENTOS Y MUNICIPIOS DINÁMICOS)
  // ============================================================================
  if (stepId === 1) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
          <User className="h-6 w-6 text-success" /> Información Personal
        </h2>

        {mostrarErrorCamposVacios && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            <span>Debe llenar todos los campos obligatorios</span>
          </div>
        )}

        {/* ✅ NUEVO - Mostrar estado de carga */}
        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-xl">
            <span>⏳ Cargando departamentos y municipios...</span>
          </div>
        )}

        {/* ✅ NUEVO - Mostrar errores */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            <span>⚠️ {error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Foto de Perfil */}
          <FileUploadComponent
            id="fotoPerfilInput"
            label="Foto de Perfil (JPG, PNG)"
            accept=".jpg,.jpeg,.png"
            file={fotoPerfil}
            handleFileChange={handleFileChangeFotoPerfil}
            handleRemoveFile={handleRemoveFileFotoPerfil}
            maxSizeMB={2}
          />

          <div className='space-y-6'>
            {/* Nombre completo */}
            <div className="flex flex-col">
              <label htmlFor="nombre_completo" className="mb-2 font-semibold text-slate-700 flex items-center">
                <User size={20} className="mr-2 text-success" /> Nombre completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre_completo"
                name="nombre_completo"
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={nuevoEmpleado.nombre_completo || ''}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            {/* Cédula */}
            <div className="flex flex-col">
              <label htmlFor="cedula" className="mb-2 font-semibold text-slate-700 flex items-center">
                <FileText size={20} className="mr-2 text-success" /> Cédula <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cedula"
                name="cedula"
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={nuevoEmpleado.cedula || ''}
                onChange={handleChange}
                placeholder="Ej: 1234567890"
                required
              />
            </div>

            {/* Teléfono */}
            <div className="flex flex-col">
              <label htmlFor="telefono" className="mb-2 font-semibold text-slate-700 flex items-center">
                <PhoneCall size={20} className="mr-2 text-success" /> Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={nuevoEmpleado.telefono || ''}
                onChange={handleChange}
                placeholder="Ej: 3112685855"
                required
              />
            </div>
          </div>
        </div>

        {/* ✅ NUEVO - Segunda fila de campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Departamento DINÁMICO */}
          <div className="flex flex-col">
            <label htmlFor="departamento_id" className="mb-2 font-semibold text-slate-700">
              🏛️ Departamento <span className="text-red-500">*</span>
            </label>
            <select
              id="departamento_id"
              name="departamento_id"
              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none"
              value={nuevoEmpleado.departamento_id || ''}
              onChange={handleChange}
              disabled={loading || departamentos.length === 0}
              required
            >
              <option value="">
                {loading ? "⏳ Cargando..." : departamentos.length === 0 ? "❌ Sin datos" : "Selecciona Departamento"}
              </option>
              {departamentos.map(depto => (
                <option key={depto.id} value={depto.id}>
                  {depto.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Municipio DINÁMICO - Filtrado por Departamento */}
          <div className="flex flex-col">
            <label htmlFor="municipio_id" className="mb-2 font-semibold text-slate-700">
              🏙️ Municipio <span className="text-red-500">*</span>
            </label>
            <select
              id="municipio_id"
              name="municipio_id"
              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none"
              value={nuevoEmpleado.municipio_id || ''}
              onChange={handleChange}
              disabled={!nuevoEmpleado.departamento_id || municipiosFiltrados.length === 0}
              required
            >
              <option value="">
                {!nuevoEmpleado.departamento_id 
                  ? "Selecciona departamento primero"
                  : municipiosFiltrados.length === 0
                  ? "No hay municipios"
                  : "Selecciona Municipio"}
              </option>
              {municipiosFiltrados.map(muni => (
                <option key={muni.id} value={muni.id}>
                  {muni.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PASO 2: SEGURIDAD Y ACCESO
  // ============================================================================
  if (stepId === 2) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
          <LockKeyhole className="h-6 w-6 text-success" /> Seguridad y Acceso
        </h2>

        {mostrarErrorContraseña && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            <span>❌ Las contraseñas no coinciden.</span>
          </div>
        )}

        {mostrarErrorCamposVacios && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            <span>Debe llenar todos los campos.</span>
          </div>
        )}

        {/* Correo */}
        <div className="flex flex-col">
          <label htmlFor="correo" className="mb-2 font-semibold text-slate-700 flex items-center">
            <LockKeyhole size={20} className="mr-2 text-success" /> Correo <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={nuevoEmpleado.correo || ''}
            onChange={handleChange}
            placeholder="correo@example.com"
            required
          />
        </div>

        {/* Contraseña */}
        <div className="flex flex-col">
          <label htmlFor="contraseña" className="mb-2 font-semibold text-slate-700 flex items-center">
            <LockKeyhole size={20} className="mr-2 text-success" /> Contraseña <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="contraseña"
            name="contraseña"
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={nuevoEmpleado.contraseña || ''}
            onChange={handleChange}
            placeholder="Mínimo 8 caracteres"
            required
          />
        </div>

        {/* Confirmar Contraseña */}
        <div className="flex flex-col">
          <label htmlFor="confirmarContraseña" className="mb-2 font-semibold text-slate-700 flex items-center">
            <LockKeyhole size={20} className="mr-2 text-success" /> Confirmar Contraseña <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="confirmarContraseña"
            name="confirmarContraseña"
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={nuevoEmpleado.confirmarContraseña || ''}
            onChange={handleChange}
            placeholder="Repite tu contraseña"
            required
          />
        </div>

        {/* Validación de contraseñas coinciden */}
        {nuevoEmpleado.contraseña && nuevoEmpleado.confirmarContraseña && 
         nuevoEmpleado.contraseña !== nuevoEmpleado.confirmarContraseña && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            <span>❌ Las contraseñas no coinciden</span>
          </div>
        )}

        {nuevoEmpleado.contraseña && nuevoEmpleado.confirmarContraseña && 
         nuevoEmpleado.contraseña === nuevoEmpleado.confirmarContraseña && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">
            <span>✅ Las contraseñas coinciden</span>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // PASO 3: PUESTO Y DOCUMENTACIÓN
  // ============================================================================
  if (stepId === 3) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
          <Settings className="h-6 w-6 text-success" /> Puesto y Documentación
        </h2>

        {mostrarErrorCamposVacios && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            <span>Debe llenar todos los campos obligatorios del puesto.</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cargo */}
          <div className="flex flex-col">
            <label htmlFor="cargo" className="mb-2 font-semibold text-slate-700">
              💼 Cargo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="cargo"
              name="cargo"
              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={nuevoEmpleado.cargo || ''}
              onChange={handleChange}
              placeholder="Ej: Brigadista"
              required
            />
          </div>

          {/* Fecha Ingreso */}
          <div className="flex flex-col">
            <label htmlFor="fecha_ingreso" className="mb-2 font-semibold text-slate-700">
              📅 Fecha Ingreso <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="fecha_ingreso"
              name="fecha_ingreso"
              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={nuevoEmpleado.fecha_ingreso || ''}
              onChange={handleChange}
              required
            />
          </div>

          {/* Rol */}
          <div className="flex flex-col">
            <label htmlFor="rol" className="mb-2 font-semibold text-slate-700">
              🎭 Rol <span className="text-red-500">*</span>
            </label>
            <select
              id="rol"
              name="rol"
              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none"
              value={nuevoEmpleado.rol || 'brigadista'}
              onChange={handleChange}
              required
            >
              <option value="brigadista">👤 Brigadista</option>
              <option value="coordinador">👨‍💼 Coordinador</option>
              <option value="admin">🔐 Administrador</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div className="flex flex-col">
          <label htmlFor="descripcion" className="mb-2 font-semibold text-slate-700 flex items-center">
            <FileText size={20} className="mr-2 text-success" /> Descripción (Opcional)
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            rows="3"
            value={nuevoEmpleado.descripcion || ''}
            onChange={handleChange}
            placeholder="Describe el rol, responsabilidades o notas adicionales"
          />
        </div>

        {/* Hoja de Vida */}
        <FileUploadComponent
          id="hojaVidaInput"
          label="📎 Hoja de vida (PDF, DOCX)"
          accept=".pdf,.doc,.docx"
          file={hojaVida}
          handleFileChange={handleFileChange}
          handleRemoveFile={handleRemoveFile}
          maxSizeMB={5}
        />
      </div>
    );
  }

  return null;
};

// ============================================================================
// COMPONENTE PRINCIPAL: NuevoEmpleado
// ============================================================================
export default function NuevoEmpleado() {
  const totalSteps = 3;
  const [currentStep, setCurrentStep] = useState(1);
  const [mostrarErrorContraseña, setMostrarErrorContraseña] = useState(false);
  const [mostrarErrorCamposVacios, setMostrarErrorCamposVacios] = useState(false);
  
  // ✅ NUEVO - Hook para obtener departamentos y municipios
  const {
    departamentos,
    municipios,
    loading,
    error,
    getMunicipiosPorDepartamento,
    getNombreDepartamento,
    getNombreMunicipio,
  } = useDepartamentos();

  // Estado del formulario
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre_completo: '',
    cedula: '',
    telefono: '',
    region: '',
    departamento_id: '',      // ✅ NUEVO
    municipio_id: '',         // ✅ NUEVO
    correo: '',
    contraseña: '',
    confirmarContraseña: '',
    cargo: '',
    fecha_ingreso: '',
    rol: 'brigadista',
    descripcion: '',
  });

  // Estados para archivos
  const [hojaVida, setHojaVida] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);

  // ✅ NUEVO - Estado para municipios filtrados
  const [municipiosFiltrados, setMunicipiosFiltrados] = useState([]);
  const [tokenGuardado, setTokenGuardado] = useState(null);
  const [cargando, setCargando] = useState(false);

  // ✅ NUEVO - Obtener token al montar
  useEffect(() => {
    const obtenerToken = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.access_token) {
        setTokenGuardado(data.session.access_token);
      }
    };
    obtenerToken();
  }, []);

  // ✅ NUEVO - Actualizar municipios cuando cambia departamento
  useEffect(() => {
    if (nuevoEmpleado.departamento_id) {
      const munis = getMunicipiosPorDepartamento(nuevoEmpleado.departamento_id);
      setMunicipiosFiltrados(munis);
      console.log(`🔄 Municipios actualizados: ${munis.length}`);
    } else {
      setMunicipiosFiltrados([]);
    }
    
    // Resetear municipio
    setNuevoEmpleado(prev => ({
      ...prev,
      municipio_id: ''
    }));
  }, [nuevoEmpleado.departamento_id, municipios]);

  // Manejador de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejador de archivos (Hoja de Vida)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setHojaVida(file);
    } else {
      console.error("El archivo excede 5MB");
      setHojaVida(null);
    }
  };

  // Manejador de archivos (Foto de Perfil)
  const handleFileChangeFotoPerfil = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setFotoPerfil(file);
    } else {
      console.error("El archivo excede 2MB");
      setFotoPerfil(null);
    }
  };

  // Remover archivo (Foto)
  const handleRemoveFileFotoPerfil = () => {
    setFotoPerfil(null);
    const input = document.getElementById('fotoPerfilInput');
    if (input) input.value = '';
  };

  // Remover archivo (Hoja de Vida)
  const handleRemoveFile = () => {
    setHojaVida(null);
    const input = document.getElementById('hojaVidaInput');
    if (input) input.value = '';
  };

  // Validación y navegación
  const nextStep = () => {
    let isValid = true;
    setMostrarErrorContraseña(false);
    setMostrarErrorCamposVacios(false);

    if (currentStep === 1) {
      // ✅ ACTUALIZADO - Validar con departamento_id y municipio_id
      if (!nuevoEmpleado.nombre_completo || !nuevoEmpleado.cedula || 
          !nuevoEmpleado.telefono || !nuevoEmpleado.departamento_id || 
          !nuevoEmpleado.municipio_id) {
        setMostrarErrorCamposVacios(true);
        isValid = false;
      }
    }

    if (currentStep === 2) {
      if (!nuevoEmpleado.correo || !nuevoEmpleado.contraseña || !nuevoEmpleado.confirmarContraseña) {
        setMostrarErrorCamposVacios(true);
        isValid = false;
      } else if (nuevoEmpleado.contraseña !== nuevoEmpleado.confirmarContraseña) {
        setMostrarErrorContraseña(true);
        isValid = false;
      }
    }

    if (currentStep === 3) {
      if (!nuevoEmpleado.cargo || !nuevoEmpleado.fecha_ingreso || !nuevoEmpleado.rol) {
        setMostrarErrorCamposVacios(true);
        isValid = false;
      }

      if (isValid) {
        document.getElementById("formNuevoEmpleado").requestSubmit();
        return;
      }
    }

    if (isValid && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Anterior
  const prevStep = () => {
    setMostrarErrorCamposVacios(false);
    setMostrarErrorContraseña(false);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // ✅ ACTUALIZADO - Crear empleado
  const handleCrearEmpleado = async (e) => {
    e.preventDefault();

    if (currentStep === totalSteps) {
      try {
        setCargando(true);
        const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL;

        // Obtener nombres
        const nombreDepto = getNombreDepartamento(nuevoEmpleado.departamento_id);
        const nombreMunicipio = getNombreMunicipio(nuevoEmpleado.municipio_id);

        // 1️⃣ REGISTRO EN AUTH SERVICE
        const responseAuth = await fetch(`${AUTH_SERVICE_URL}/registrar`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${tokenGuardado}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo: nuevoEmpleado.correo,
            contraseña: nuevoEmpleado.contraseña,
            // ✅ NUEVO - Enviar metadata con departamento y municipio
            user_metadata: {
              nombre_completo: nuevoEmpleado.nombre_completo,
              cedula: nuevoEmpleado.cedula,
              telefono: nuevoEmpleado.telefono,
              departamento_id: nuevoEmpleado.departamento_id,
              departamento: nombreDepto,
              municipio_id: nuevoEmpleado.municipio_id,
              municipio: nombreMunicipio,
              cargo: nuevoEmpleado.cargo,
              rol: nuevoEmpleado.rol,
            },
            app_metadata: {
              rol_ifn: nuevoEmpleado.rol,
            }
          }),
        });

        const dataAuth = await responseAuth.json();

        if (responseAuth.ok) {
          console.log("✅ Empleado Registrado en Auth");

          // 2️⃣ REGISTRO EN BRIGADA SERVICE
          const BRIGADA_SERVICE_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL;
          const formData = new FormData();
          
          formData.append("correo", nuevoEmpleado.correo);
          formData.append("cedula", nuevoEmpleado.cedula);
          formData.append("nombre_completo", nuevoEmpleado.nombre_completo);
          formData.append("descripcion", nuevoEmpleado.descripcion);
          formData.append("rol", nuevoEmpleado.rol);
          formData.append("telefono", nuevoEmpleado.telefono);
          formData.append("fecha_ingreso", nuevoEmpleado.fecha_ingreso);
          formData.append("cargo", nuevoEmpleado.cargo);
          // ✅ NUEVO - Agregar departamento y municipio
          formData.append("departamento_id", nuevoEmpleado.departamento_id);
          formData.append("departamento", nombreDepto);
          formData.append("municipio_id", nuevoEmpleado.municipio_id);
          formData.append("municipio", nombreMunicipio);
          
          if (hojaVida) formData.append("hoja_de_vida", hojaVida);
          if (fotoPerfil) formData.append("foto_perfil", fotoPerfil);

          const responseBrigada = await fetch(`${BRIGADA_SERVICE_URL}/registrar`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${tokenGuardado}`,
            },
            body: formData,
          });

          const dataBrigada = await responseBrigada.json();

          if (responseBrigada.ok) {
            alert("✅ El usuario ha sido creado con éxito");
            
            // Reset formulario
            setNuevoEmpleado({
              nombre_completo: '',
              cedula: '',
              telefono: '',
              region: '',
              departamento_id: '',
              municipio_id: '',
              correo: '',
              contraseña: '',
              confirmarContraseña: '',
              cargo: '',
              fecha_ingreso: '',
              rol: 'brigadista',
              descripcion: '',
            });
            setHojaVida(null);
            setFotoPerfil(null);
            setCurrentStep(1);
          } else {
            alert(`❌ Error en Brigada: ${dataBrigada.message || 'Error desconocido'}`);
          }
        } else {
          alert(`❌ Error en Auth: ${dataAuth.message || 'Error desconocido'}`);
        }
      } catch (err) {
        console.error("Error:", err);
        alert(`Error: ${err.message}`);
      } finally {
        setCargando(false);
      }
    }
  };

  const steps = [
    { id: 1, title: 'Información Básica', icon: User },
    { id: 2, title: 'Seguridad y Acceso', icon: LockKeyhole },
    { id: 3, title: 'Puesto y Archivos', icon: Settings },
  ];
  
  return (
    <div className="min-h-screen flex items-start justify-center p-4 md:p-12">
      <div className="w-full max-w-5xl bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-slate-200">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 flex items-center gap-3">
          <User className="h-8 w-8 text-success" />
          Crear Nuevo Empleado
        </h1>

        <p className="text-slate-600 mb-10">Completa los siguientes <strong>{totalSteps} pasos</strong> para registrar un nuevo colaborador.</p>

        {/* Indicadores de pasos */}
        <div className="flex w-full items-start justify-between pb-16 relative">
          {steps.map((step) => (
            <StepIndicator 
              key={step.id} 
              step={step} 
              currentStep={currentStep} 
              totalSteps={totalSteps} 
            />
          ))}
        </div>

        {/* Formulario */}
        <form id="formNuevoEmpleado" onSubmit={handleCrearEmpleado} noValidate>
          <div className="mt-6 min-h-64">
            {steps.map((step) => (
              <div 
                key={step.id} 
                data-step-content={step.id} 
                className={`transition-opacity duration-500 ${currentStep === step.id ? 'opacity-100 block' : 'opacity-0 hidden absolute w-full'}`}
              >
                <StepContent 
                  stepId={step.id}
                  nuevoEmpleado={nuevoEmpleado}
                  handleChange={handleChange}
                  hojaVida={hojaVida}
                  handleFileChange={handleFileChange}
                  handleRemoveFile={handleRemoveFile}
                  fotoPerfil={fotoPerfil}
                  handleFileChangeFotoPerfil={handleFileChangeFotoPerfil}
                  handleRemoveFileFotoPerfil={handleRemoveFileFotoPerfil}
                  mostrarErrorContraseña={mostrarErrorContraseña}
                  mostrarErrorCamposVacios={mostrarErrorCamposVacios}
                  // ✅ NUEVO - Props para departamentos y municipios
                  departamentos={departamentos}
                  municipiosFiltrados={municipiosFiltrados}
                  loading={loading}
                  error={error}
                />
              </div>
            ))}
          </div>

          {/* Botones de Navegación */}
          <div className="mt-10 pt-6 flex w-full justify-between gap-4 border-t border-slate-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="inline-flex items-center justify-center border align-middle font-semibold text-sm rounded-lg py-3 px-8 transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400"
            >
              ← Anterior
            </button>
            
            <button
              type="button"
              onClick={nextStep}
              disabled={cargando}
              className="inline-flex items-center justify-center border align-middle font-semibold text-sm rounded-lg py-3 px-8 shadow-md transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 hover:border-indigo-700"
            >
              {cargando ? "⏳ Procesando..." : currentStep < totalSteps ? 'Siguiente →' : '💾 Guardar Empleado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}