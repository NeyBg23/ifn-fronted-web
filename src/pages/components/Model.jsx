import { useEffect, useState } from "react";

function Modal({ show, onClose, titulo, mensaje }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center 
        bg-black/60 backdrop-blur-md 
        transition-opacity duration-300
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* CONTENEDOR DEL MODAL */}
      <div
        className={`
          bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 relative 
          transform transition-all duration-300 
          ${visible ? "scale-100 translate-y-0 opacity-100" : "scale-90 translate-y-6 opacity-0"}
        `}
      >
        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* TITULO */}
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-3 tracking-tight">
          {titulo}
        </h2>

        {/* MENSAJE */}
        <p className="text-gray-600 text-center text-lg mb-7 leading-relaxed">
          {mensaje}
        </p>

        {/* BOTÓN */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-7 py-2 text-lg rounded-xl 
            bg-gradient-to-r from-blue-600 to-blue-700 
            hover:from-blue-700 hover:to-blue-800 
            text-white shadow-lg hover:shadow-xl 
            transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;