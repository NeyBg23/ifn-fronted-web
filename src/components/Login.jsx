import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    const resultado = await login(email, password);

    if (resultado.success) {
      if (resultado.usuario.rol === "admin") navigate("/admin");
      else navigate("/user");
    } else {
      setLocalError(resultado.message);
    }
  };

  return (
    <>
      <link href="https://cdn.tailwindcss.com" rel="stylesheet" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-green-900 to-green-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <i className="fas fa-tree text-3xl text-green-500"></i>
                <h1 className="text-2xl font-bold text-white">Inventario Forestal Nacional</h1>
              </div>
              <p className="text-green-100">República de Colombia</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Section - Information */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-green-700">
                  <h2 className="text-3xl font-bold text-green-900 mb-6">
                    Bienvenido al IFN
                  </h2>

                  <div className="space-y-6">
                    {/* Feature 1 */}
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

                    {/* Feature 2 */}
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

                    {/* Feature 3 */}
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

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Sistema de Información para la gestión integral de inventarios forestales nacionales
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Section - Login Form */}
              <div>
                <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-green-700">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-green-900 mb-2">
                      Inicia Sesión
                    </h2>
                    <p className="text-gray-600">
                      Accede a tu cuenta del sistema
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                      <label className="block text-sm font-semibold text-green-900 mb-2">
                        <i className="fas fa-envelope mr-2"></i>
                        Correo Electrónico
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

                    {/* Password Input */}
                    <div>
                      <label className="block text-sm font-semibold text-green-900 mb-2">
                        <i className="fas fa-lock mr-2 "></i>
                        Contraseña
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
                          className="absolute right-3 top-5 text-gray-400 hover:text-gray-600"
                        >
                          <i
                            className={`fas ${
                              showPassword ? "fa-eye-slash" : "fa-eye"
                            }`}
                          ></i>
                        </button>
                      </div>
                    </div>

                    {/* Error Message */}
                    {(localError || error) && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-700 text-sm font-medium">
                          <i className="fas fa-exclamation-circle mr-2"></i>
                          {localError || error}
                        </p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
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