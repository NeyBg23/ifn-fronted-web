function Footer() {
  return (
    // Contenedor principal del footer con estilos de fondo verde oscuro (Tailwind CSS: bg-green-800).
    <footer className="bg-green-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
        
        {/* Distribución en cuadrícula de 3 columnas para secciones de información */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Columna 1: Información Relevante de la Entidad */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-green-100">
              Información Relevante
            </h3>
            {/* Detalle de la entidad responsable */}
            <p className="text-green-50 mb-2">
              Ministerio de Ambiente y Desarrollo Sostenible
            </p>
            {/* Dirección física */}
            <p className="text-green-50 mb-2">
              Dirección: Carrera 10 # 20-30, Bogotá D.C.
            </p>
            {/* Teléfono de contacto */}
            <p className="text-green-50">
              Teléfono: +57 (1) 3400000
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos o de Navegación */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-green-100">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                {/* Enlace externo directo a la información del SNIF/IFN */}
                <a
                  href="https://www.ideam.gov.co/nuestra-entidad/ecosistemas-e-informacion-ambiental/sistema-nacional-de-informacion-forestal-ifn"
                  className="text-green-50 hover:text-green-200 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Acerca de Nosotros
                </a>
              </li>
              {/* Enlaces de navegación con placeholders (por implementar) */}
              <li>
                <a href="#" className="text-green-50 hover:text-green-200 transition">
                  Informes Anuales
                </a>
              </li>
              <li>
                <a href="#" className="text-green-50 hover:text-green-200 transition">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-green-50 hover:text-green-200 transition">
                  Términos de Uso
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información de Contacto Adicional */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-green-100">
              Contacto
            </h3>
            {/* Correo electrónico de contacto */}
            <p className="text-green-50 mb-2">
              Email: info@inventarioforestal.gov.co
            </p>
            {/* Horario de atención */}
            <p className="text-green-50">
              Horario de atención: Lunes a Viernes, 8:00 am-5:00 pm
            </p>
          </div>
        </div>

        {/* Sección de Copyright y Desarrollo */}
        <div className="border-t border-green-800 pt-8">
          
          {/* Mensaje de Copyright */}
          <p className="text-center text-green-100">
            © 2025 derechos reservados - Inventario Forestal Nacional de Colombia
          </p>

          {/* Atribución de los desarrolladores con enlaces a sus perfiles de GitHub */}
          <p>Desarrollado por <a href="https://github.com/DeveloperTI0001" className="text-green-200 hover:text-green-100 transition" target="_blank" rel="noopener noreferrer">DeveloperTI0001</a> y <a href="https://github.com/NeyBg23" className="text-green-200 hover:text-green-100 transition" target="_blank" rel="noopener noreferrer">NeyBg</a></p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;