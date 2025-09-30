const Perfil = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Perfil de Usuario</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Información Personal</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="juan.perez@inventario.gov"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="Administrador del Sistema"
              />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuración</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Región Asignada
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Todas las Regiones</option>
                <option>Norte</option>
                <option>Sur</option>
                <option>Centro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel de Acceso
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                defaultValue="Administrador"
                disabled
              />
            </div>
            <div className="pt-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;