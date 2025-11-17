function Modal({ show, onClose, mensaje }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded shadow-lg p-6 w-80">
        <h2 className="text-xl font-bold mb-4">¡Éxito!</h2>
        <p className="mb-4">{mensaje}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default Modal;