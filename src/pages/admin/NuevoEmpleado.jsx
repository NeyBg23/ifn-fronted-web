import { useState } from 'react';

import {
  User, Settings, CheckCircle, CreditCard, LockKeyhole, FileText, Upload, FileUp, X,
  PhoneCall,
} from 'lucide-react';

// --- COMPONENTE StepIndicator ---
// Componente para el indicador de paso (barra superior)
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

// --- COMPONENTE FileUpload ---
// Componente reutilizable para subir archivos (Foto de Perfil y Hoja de Vida)
const FileUpload = ({ 
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

// --- COMPONENTE StepContent ---
// Componente para el contenido de cada paso (formulario)
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
  mostrarErrorCamposVacios
}) => {
  if (stepId === 1) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
          <User className="h-6 w-6 text-success" /> Información Personal
        </h2>

        {mostrarErrorCamposVacios && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
            <span className="block sm:inline">Debe llenar todos los campos obligatorios</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Foto de Perfil */}
            <FileUpload
                id="fotoPerfilInput"
                label="Foto de Perfil (JPG, PNG)"
                accept=".jpg,.jpeg,.png"
                file={fotoPerfil}
                handleFileChange={handleFileChangeFotoPerfil}
                handleRemoveFile={handleRemoveFileFotoPerfil}
            />

            <div className='space-y-6'>
                {/* Nombre completo */}
                <div className="flex flex-col">
                    <label htmlFor="nombre_completo" className="mb-2 font-semibold text-slate-700 flex items-center">
                        <User size={20} className="mr-2 text-success" /> Nombre completo
                    </label>
                    <input
                        type="text"
                        id="nombre_completo"
                        name="nombre_completo"
                        className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        value={nuevoEmpleado.nombre_completo}
                        onChange={handleChange}
                        placeholder="Ej: Juan Pérez"
                    />
                </div>
                {/* Cédula */}
                <div className="flex flex-col">
                    <label htmlFor="cedula" className="mb-2 font-semibold text-slate-700 flex items-center">
                        <CreditCard size={20} className="mr-2 text-success" /> Cédula
                    </label>
                    <input
                        type="text"
                        id="cedula"
                        name="cedula"
                        className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        value={nuevoEmpleado.cedula}
                        onChange={handleChange}
                        placeholder="Ej: 000-0000000-0"
                    />
                </div>
                {/* Telefono */}
                <div className="flex flex-col">
                    <label htmlFor="telefono" className="mb-2 font-semibold text-slate-700 flex items-center">
                        <PhoneCall size={20} className="mr-2 text-success" /> Teléfono
                    </label>
                    <input
                        type="number"
                        id="telefono"
                        name="telefono"
                        className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        value={nuevoEmpleado.telefono}
                        onChange={handleChange}
                        placeholder="Ej: 3112685855"
                    />
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (stepId === 2) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
          <LockKeyhole className="h-6 w-6 text-success" /> Seguridad y Acceso
        </h2>

        {
          mostrarErrorContraseña ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
                  <span className="block sm:inline">Las contraseñas no coinciden.</span>
              </div>
          ) : mostrarErrorCamposVacios ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
                  <span className="block sm:inline">Debe llenar todos los campos (Correo y Contraseñas).</span>
              </div>
          ) : null
        }

        {/* Correo */}
        <div className="flex flex-col">
          <label htmlFor="correo" className="mb-2 font-semibold text-slate-700 flex items-center">
            <LockKeyhole size={20} className="mr-2 text-success" /> Correo
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            value={nuevoEmpleado.correo}
            onChange={handleChange}
          />
        </div>

        {/* Contraseña */}
        <div className="flex flex-col">
          <label htmlFor="contraseña" className="mb-2 font-semibold text-slate-700 flex items-center">
            <LockKeyhole size={20} className="mr-2 text-success" /> Contraseña
          </label>
          <input
            type="password"
            id="contraseña"
            name="contraseña"
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            value={nuevoEmpleado.contraseña}
            onChange={handleChange}
          />
        </div>
        {/* Confirmar Contraseña */}
        <div className="flex flex-col">
          <label htmlFor="confirmarContraseña" className="mb-2 font-semibold text-slate-700 flex items-center">
            <LockKeyhole size={20} className="mr-2 text-success" /> Confirmar Contraseña
          </label>
          <input
            type="password"
            id="confirmarContraseña"
            name="confirmarContraseña"
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            value={nuevoEmpleado.confirmarContraseña}
            onChange={handleChange}
          />
        </div>
      </div>
    );
  }

  if (stepId === 3) {
    return (
      <div className="space-y-6">

        <h2 className="text-2xl font-semibold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
          <Settings className="h-6 w-6 text-success" /> Puesto y Documentación
        </h2>

        {mostrarErrorCamposVacios && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
            <span className="block sm:inline">Debe llenar todos los campos obligatorios del puesto (Cargo, Fecha, Rol).</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cargo */}
          <div className="flex flex-col">
            <label htmlFor="cargo" className="mb-2 font-semibold text-slate-700">Cargo</label>
            <input
              type="text"
              id="cargo"
              name="cargo"
              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              value={nuevoEmpleado.cargo}
              onChange={handleChange}
            />
          </div>
          {/* Fecha Ingreso */}
          <div className="flex flex-col">
            <label htmlFor="fecha_ingreso" className="mb-2 font-semibold text-slate-700">Fecha Ingreso</label>
            <input
              type="date"
              id="fecha_ingreso"
              name="fecha_ingreso"
              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              value={nuevoEmpleado.fecha_ingreso}
              onChange={handleChange}
            />
          </div>
          {/* Rol */}
          <div className="flex flex-col">
            <label htmlFor="rol" className="mb-2 font-semibold text-slate-700">Rol</label>
            <select
              id="rol"
              name="rol"
              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 appearance-none"
              value={nuevoEmpleado.rol}
              onChange={handleChange}
            >
              <option value="brigadista">Brigadista</option>
              <option value="admin">Admin</option>
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
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            rows="3"
            value={nuevoEmpleado.descripcion}
            onChange={handleChange}
          />
        </div>

        {/* Hoja de Vida (File Upload) */}
        <FileUpload
            id="hojaVidaInput"
            label="Hoja de vida (PDF, DOCX)"
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

// --- COMPONENTE PRINCIPAL: NuevoEmpleado ---

const NuevoEmpleado = () => {
  const totalSteps = 3;
  const [currentStep, setCurrentStep] = useState(1);
  const [mostrarErrorContraseña, setMostrarErrorContraseña] = useState(false);
  const [mostrarErrorCamposVacios, setMostrarErrorCamposVacios] = useState(false);
  
  // Estado para todos los campos del formulario
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre_completo: '',
    correo: '',
    telefono: '',
    cedula: '',
    contraseña: '',
    confirmarContraseña: '',
    cargo: '',
    fecha_ingreso: '',
    rol: 'brigadista', // Valor por defecto
    descripcion: '',
  });

  // Estado separado para el archivo de la hoja de vida
  const [hojaVida, setHojaVida] = useState(null);
  // Estado separado para el archivo de la foto de perfil
  const [fotoPerfil, setFotoPerfil] = useState(null);


  // Manejador de cambios de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejador de cambios de archivo (HOJA DE VIDA)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // Máximo 5MB
      setHojaVida(file);
    } else {
      console.error("El archivo excede el tamaño máximo permitido de 5MB.");
      setHojaVida(null);
    }
  };

  // Manejador de cambios de archivo (FOTO DE PERFIL)
  const handleFileChangeFotoPerfil = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // Máximo 5MB
      setFotoPerfil(file);
    } else {
      console.error("El archivo excede el tamaño máximo permitido de 5MB.");
      setFotoPerfil(null);
    }
  };

  // Remover archivo (FOTO DE PERFIL)
  const handleRemoveFileFotoPerfil = () => {
    setFotoPerfil(null);
    document.getElementById('fotoPerfilInput').value = ''; 
  };

  // 5. Remover archivo (HOJA DE VIDA)
  const handleRemoveFile = () => {
    setHojaVida(null);
    document.getElementById('hojaVidaInput').value = ''; 
  };

  // Lógica de navegación "Siguiente" con validación
  const nextStep = () => {
    let isValid = true;
    setMostrarErrorContraseña(false);
    setMostrarErrorCamposVacios(false);

    if (currentStep === 1) {
      // Validar campos del Paso 1
      if (!nuevoEmpleado.nombre_completo || !nuevoEmpleado.cedula || !nuevoEmpleado.telefono) {
        setMostrarErrorCamposVacios(true);
        isValid = false;
      }
    }

    if (currentStep === 2) {
      // Validar campos del Paso 2
      if (!nuevoEmpleado.correo || !nuevoEmpleado.contraseña || !nuevoEmpleado.confirmarContraseña) {
          setMostrarErrorCamposVacios(true);
          isValid = false;
      } else if (nuevoEmpleado.contraseña !== nuevoEmpleado.confirmarContraseña) {
        setMostrarErrorContraseña(true);
        isValid = false;
      }
    }

    if (currentStep === 3) {
      // Validar campos del Paso 3
      if (!nuevoEmpleado.cargo || !nuevoEmpleado.fecha_ingreso || !nuevoEmpleado.rol) {
        setMostrarErrorCamposVacios(true);
        isValid = false;
      }

      // Si es válido y es el último paso -> enviar formulario
      if (isValid) {
        // Dispara el evento onSubmit del formulario. Esto llamará a handleCrearEmpleado.
        document.getElementById("formNuevoEmpleado").requestSubmit();
        return; // Salir para evitar el avance normal
      }
    }

    // Si es válido y no es el último paso, avanza
    if (isValid && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };


  // Lógica de navegación "Anterior"
  const prevStep = () => {
    setMostrarErrorCamposVacios(false);
    setMostrarErrorContraseña(false);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Manejador de envío final del formulario
  // ESTA FUNCIÓN SOLO DEBE EJECUTARSE CUANDO nextStep() LA DISPARA EN EL PASO FINAL.
  const handleCrearEmpleado = async (e) => {
    e.preventDefault();

    if (currentStep === totalSteps) {
      const tokenGuardado = localStorage.getItem('token');
      const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL;

      // 1. Registro en el servicio de Auth (Autenticación)
      try {
        let response = await fetch(`${AUTH_SERVICE_URL}/registrar`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${tokenGuardado}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo: nuevoEmpleado.correo,
            contraseña: nuevoEmpleado.contraseña,
          }),
        });

        let data = await response.json();
        
        if (response.ok) {
            console.log("Empleado Registrado en Auth.");
            
            //Registro en el servicio de Brigada (Datos completos y archivos)
            const BRIGADA_SERVICE_URL = import.meta.env.VITE_BRIGADA_SERVICE_URL;
            
            // Para enviar archivos (File objects) junto con datos 
            // de formulario, debes usar FormData y NO 'application/json'.
            const formData = new FormData();
            formData.append("correo", nuevoEmpleado.correo);
            formData.append("cedula", nuevoEmpleado.cedula);
            formData.append("nombre_completo", nuevoEmpleado.nombre_completo);
            formData.append("descripcion", nuevoEmpleado.descripcion);
            formData.append("rol", nuevoEmpleado.rol);
            formData.append("telefono", nuevoEmpleado.telefono);
            formData.append("fecha_ingreso", nuevoEmpleado.fecha_ingreso);
            if (hojaVida) {
                formData.append("hoja_de_vida", hojaVida);
            }
            if (fotoPerfil) {
                formData.append("foto_perfil", fotoPerfil);
            }
            

            try {
              response = await fetch(`${BRIGADA_SERVICE_URL}/registrar`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${tokenGuardado}`,
                  // NO USAR Content-Type: "application/json" cuando se usa FormData
                },
                body: formData, // Enviar FormData
              });

              data = await response.json();

              if (response.ok) {
                alert("El usuario ha sido creado con éxito.");
                // Aquí podrías redirigir o limpiar el formulario
              } else {
                console.error("❌ Error al registrar empleado en brigadas:", data);
                alert(`Error al registrar en Brigadas: ${data.message || 'Error desconocido'}`);
              }
            } catch (err) {
              console.error("❌ Error en la conexión/petición Brigadas:", err);
              alert("Error de conexión con el servicio de Brigadas.");
            }
        } else {
            console.error("❌ Error al registrar empleado en Auth:", data);
            alert(`Error al registrar en Auth: ${data.message || 'Error desconocido'}`);
        }
      } catch (err) {
        console.error("❌ Error en la conexión/petición Auth:", err);
        alert("Error de conexión con el servicio de Autenticación.");
      }
    }
  };


  const steps = [
    { id: 1, title: 'Información Básica', icon: User },
    { id: 2, title: 'Seguridad y Acceso', icon: LockKeyhole },
    { id: 3, title: 'Puesto y Archivos', icon: Settings },
  ];
  
  // Renderizado Principal
  return (
    <div className="min-h-screen flex items-start justify-center p-4 md:p-12">
      <script src="https://cdn.tailwindcss.com"></script>
      <div className="w-full max-w-5xl bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-slate-200">

        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 flex items-center gap-3">
          <User className="h-8 w-8 text-success" />
          Crear Nuevo Empleado
        </h1>

        <p className="text-slate-600 mb-10">Completa los siguientes <strong>{totalSteps} pasos</strong> para registrar un nuevo colaborador.</p>

        {/* Stepper Container */}
        <div data-stepper-container className="w-full">
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

          {/* Contenido de pasos */}
          <form id="formNuevoEmpleado" onSubmit={handleCrearEmpleado} noValidate>
            <div className="mt-6 min-h-64">
              {steps.map((step) => (
                <div 
                  key={step.id} 
                  data-step-content={step.id} 
                  // Usamos 'hidden' para ocultar y 'block' para mostrar, 
                  // manteniendo el estado de los campos.
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
                  />
                </div>
              ))}
            </div>

            {/* Botones de Navegación */}
            <div className="mt-10 pt-6 flex w-full justify-between gap-4 border-t border-slate-200">
              {/* Botón Anterior */}
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                data-stepper-prev
                className="inline-flex items-center justify-center border align-middle font-semibold text-sm rounded-lg py-3 px-8 transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400"
              >
                Anterior
              </button>
              
              {/* Botón Siguiente / Finalizar */}
              <button
                // Importante: type='button' en todos los pasos excepto el último 
                // para que solo 'nextStep' controle la validación y el avance.
                // En el último paso, 'nextStep' llama a requestSubmit(), que dispara 'handleCrearEmpleado'.
                type={'button'}
                onClick={nextStep}
                data-stepper-next
                className="inline-flex items-center justify-center border align-middle font-semibold text-sm rounded-lg py-3 px-8 shadow-md transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 hover:border-indigo-700"
              >
                {currentStep < totalSteps ? 'Siguiente' : '💾 Guardar Empleado'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevoEmpleado;