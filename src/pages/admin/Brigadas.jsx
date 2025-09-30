const Brigadas = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Brigadas</h1>
      <p className="text-gray-600 mb-4">
        Gestión y administración de brigadas del Inventario Forestal Nacional.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-2">Brigada Norte</h3>
          <p className="text-sm text-gray-600">Región: Norte del país</p>
          <p className="text-sm text-gray-600">Miembros: 12</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-2">Brigada Sur</h3>
          <p className="text-sm text-gray-600">Región: Sur del país</p>
          <p className="text-sm text-gray-600">Miembros: 8</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-2">Brigada Centro</h3>
          <p className="text-sm text-gray-600">Región: Centro del país</p>
          <p className="text-sm text-gray-600">Miembros: 15</p>
        </div>
      </div>
    </div>
  );
};

export default Brigadas;