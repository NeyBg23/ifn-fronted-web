import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import HCaptcha from "@hcaptcha/react-hcaptcha"; 
import arbolColombiano from "../img/arbolColombiano.png"

// Clave pública del widget de hCaptcha
const HCATCHA_SITE_KEY = "58942e22-4f6c-463c-a4b0-e80c6ace7692"; 

/**
 * Pantalla de Login del sistema.
 * 
 * Aquí se maneja:
 * - Formulario de correo y contraseña
 * - Validación con hCaptcha
 * - Redirección dependiendo del rol del usuario
 * - Manejo de errores locales y del hook de autenticación
 */
function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth(); 

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Manejo del hCaptcha
  const [hcaptchaToken, setHcaptchaToken] = useState(null);
  const hcaptchaRef = useRef(null); 
  
  // Errores propios de este componente
  const [localError, setLocalError] = useState("");

  // Cuando el usuario completa el CAPTCHA
  const onVerify = (token) => {
    setHcaptchaToken(token);
    setLocalError(""); // Limpia errores si ya se resolvió
  };

  // Cuando el CAPTCHA expira
  const onExpire = () => {
    setHcaptchaToken(null);
    setLocalError("El CAPTCHA ha expirado. Por favor, complétalo de nuevo.");
  };
  
  // Reinicia el widget de hCaptcha (se usa cuando el login falla)
  const resetCaptcha = () => {
    if (hcaptchaRef.current) {
      hcaptchaRef.current.resetCaptcha();
      setHcaptchaToken(null);
    }
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    
    // Antes de enviar, validar que el CAPTCHA esté resuelto
    if (!hcaptchaToken) {
      setLocalError("Por favor, completa la verificación de seguridad (CAPTCHA).");
      return;
    }
    
    // Llamada al login incluyendo el token del CAPTCHA
    const resultado = await login(email, password, hcaptchaToken);

    if (resultado.success) {
      // Redirige según el rol del usuario
      if (resultado.usuario.rol === "admin") navigate("/admin");
      else navigate("/user");
    } else {
      // Si algo falla, se muestra el error local y se reinicia el CAPTCHA
      setLocalError(resultado.message);
      resetCaptcha();
    }
  };

  return (
    <>
      {/* CDN de Tailwind (esto debería ir en la raíz del proyecto, pero se deja aquí porque así lo tienes configurado) */}
      <link href="https://cdn.tailwindcss.com" rel="stylesheet" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />

      {/* Contenedor general */}
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col">

        {/* Header superior */}
        <header className="bg-gradient-to-r from-green-900 to-green-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <img src={arbolColombiano} alt="arbol" className='w-10'/>
                <h1 className="text-2xl font-bold text-white">Inventario Forestal Nacional</h1>
              </div>
              <p className="text-green-100">República de Colombia</p>
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">

          <div className="w-full max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

              {/* Sección izquierda: información */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-green-700">
                  <h2 className="text-3xl font-bold text-green-900 mb-6">
                    Bienvenido al IFN
                  </h2>

                  {/* Lista de características */}
                  <div className="space-y-6">

                    {/* Item 1 */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100">
                          <i className="fas fa-leaf text-green-700 text-lg"></i>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-900">
                          Gestión Forestal Sostenible
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Administra y monitorea los recursos forestales de Colombia
                        </p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100">
                          <i className="fas fa-lock text-green-700 text-lg"></i>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-900">
                          Seguridad Garantizada
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Acceso seguro con autenticación de dos factores
                        </p>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100">
                          <i className="fas fa-headset text-green-700 text-lg"></i>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-900">
                          Soporte Disponible
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Equipo de soporte técnico disponible 24/7
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mensaje inferior */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Sistema de Información para la gestión integral de inventarios forestales nacionales
                    </p>
                  </div>
                </div>
              </div>

              {/* Sección derecha: formulario de login */}
              <div>
                <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-green-700">

                  {/* Título del formulario */}
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-green-900 mb-2">
                      Inicia Sesión
                    </h2>
                    <p className="text-gray-600">Accede a tu cuenta del sistema</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Input email */}
                    <div>
                      <label className="block text-sm font-semibold text-green-900 mb-2">
                        <i className="fas fa-envelope mr-2"></i>Correo Electrónico
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="usuario@forestal.com"
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-200 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Input contraseña */}
                    <div>
                      <label className="block text-sm font-semibold text-green-900 mb-2">
                        <i className="fas fa-lock mr-2"></i>Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          disabled={loading}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-200 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2"
                        >
                          <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </button>
                      </div>
                    </div>

                    {/* CAPTCHA */}
                    <div className="pt-2 flex justify-center">
                      <HCaptcha
                        sitekey={HCATCHA_SITE_KEY}
                        onVerify={onVerify}
                        onExpire={onExpire}
                        ref={hcaptchaRef}
                      />
                    </div>

                    {/* Mensaje de error */}
                    {(localError || error) && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-700 text-sm font-medium">
                          <i className="fas fa-exclamation-circle mr-2"></i>
                          {localError || error}
                        </p>
                      </div>
                    )}

                    {/* Botón submit */}
                    <button
                      type="submit"
                      disabled={loading || !hcaptchaToken}
                      style={{ boxShadow: "0 0 10px 1px #1B5E20" }}
                      className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Conectando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-leaf"></i>
                          Ingresar al Sistema
                        </>
                      )}
                    </button>
                  </form>

                  {/* Texto inferior */}
                  <div className="mt-6 text-center text-sm text-gray-600">
                    <p>¿Problemas para acceder? Contacta al soporte técnico</p>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </main>

      </div>
    </>
  );
}

export default Login;