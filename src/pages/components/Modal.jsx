import { useEffect, useState } from "react";
// Importa los hooks necesarios de React.

function Modal({ show, onClose, titulo, mensaje }) {
  // Estado local para controlar la visibilidad y animar la entrada/salida del modal.
  const [visible, setVisible] = useState(false);

  // Efecto que controla las transiciones del modal basado en la prop 'show'.
  useEffect(() => {
    if (show) {
      // Pequeño delay necesario para que la animación de entrada se aplique.
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [show]);

  // Si 'show' es false, no renderiza el componente para eliminarlo del DOM.
  if (!show) return null;

  return (
    // Overlay (Fondo) del modal
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center 
        // Estilos de fondo semitransparente con desenfoque
        bg-black/60 backdrop-blur-md 
        transition-opacity duration-300
        // Clase dinámica para el fade-in/out del fondo
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* Contenedor del contenido del modal */}
      <div
        className={`
          bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 relative 
          transform transition-all duration-300 
          // Clase dinámica para animar la entrada/salida con escala y traslación
          ${visible ? "scale-100 translate-y-0 opacity-100" : "scale-90 translate-y-6 opacity-0"}
        `}
      >
        {/* Botón para cerrar el modal */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          {/* Ícono SVG de cierre (una 'X') */}
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Título del modal */}
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-3 tracking-tight">
          {titulo}
        </h2>

        {/* Mensaje descriptivo */}
        <p className="text-gray-600 text-center text-lg mb-7 leading-relaxed">
          {mensaje}
        </p>

        {/* Contenedor para el botón de acción principal */}
        <div className="flex justify-center">
          <button
            onClick={onClose} // Ejecuta la acción de cierre
            className="px-7 py-2 text-lg rounded-xl 
            // Estilos del botón: gradiente azul con efectos hover
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