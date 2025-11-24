import { useState, useEffect } from 'react';
import "../styles/Home.css";

// Definición de las imágenes del carrusel
const images = [
  "https://snmf.cnf.gob.mx/wp-content/uploads/2022/05/Taladro-de-pressler.jpg",
  "https://infona.gov.py/wp-content/uploads/2024/05/inventario-1-scaled.jpeg",
  "https://s3.amazonaws.com/rtvc-assets-canalinstitucional.tv/s3fs-public/styles/interna_noticias_after_1222x547_/public/images/santurban.jpg?itok=36X4YwxV",
  "https://media.licdn.com/dms/image/v2/D4E12AQEoqzBYIpNq_Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1731328919965?e=2147483647&v=beta&t=kFTMuMcvYH2uiEkNCRsASMp8xGkpazN0v3ZFoT7PTx0",
];

// Componente principal Home
const Home = () => {
  // Estado para el índice de la imagen actual del carrusel
  const [currentSlide, setCurrentSlide] = useState(0);

  // Pasa a la siguiente imagen del carrusel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  // Pasa a la anterior imagen del carrusel
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };
  
  // Cambia a una imagen específica (por su índice)
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Cambia automáticamente la imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    
    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, []);

  // Render de la página principal
  return (
    <div className="lista-brigadas">

      <h1>Bienvenido 🌳</h1>
      <p>Este es el panel principal del Inventario Forestal Nacional.</p>

      <br />
      <br />

      <div className="container">
        {/* Carrusel */}
        <div id="react-carousel" className="relative w-full shadow-2xl rounded-xl">

          <div className="relative h-56 overflow-hidden rounded-xl md:h-96">
            {images.map((src, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="block w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>

          {/* Navegación, puntos de estado del carrusel */}
          <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-green-600 ring-2 ring-white' : 'bg-gray-400 hover:bg-gray-200'
                }`}
                aria-current={index === currentSlide}
                aria-label={`Slide ${index + 1}`}
                onClick={() => goToSlide(index)}
              ></button>
            ))}
          </div>

          {/* Botón Anterior */}
          <button 
            type="button" 
            className="absolute top-0 start-0 z-40 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={prevSlide}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/30 group-hover:bg-black/50 transition-all">
              {/* Ícono SVG Flecha Izquierda */}
              <svg className="w-5 h-5 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7"/></svg>
              <span className="sr-only">Anterior</span>
            </span>
          </button>
          
          {/* Botón Siguiente */}
          <button 
            type="button" 
            className="absolute top-0 end-0 z-40 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={nextSlide}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/30 group-hover:bg-black/50 transition-all">
              {/* Ícono SVG Flecha Derecha */}
              <svg className="w-5 h-5 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/></svg>
              <span className="sr-only">Siguiente</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;