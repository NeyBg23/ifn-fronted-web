function Footer() {
  return (
    <footer className="bg-green-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Información Relevante */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-green-100">
              Información Relevante
            </h3>
            <p className="text-green-50 mb-2">
              Ministerio de Ambiente y Desarrollo Sostenible
            </p>
            <p className="text-green-50 mb-2">
              Dirección: Carrera 10 # 20-30, Bogotá D.C.
            </p>
            <p className="text-green-50">
              Teléfono: +57 (1) 3400000
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-green-100">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.ideam.gov.co/nuestra-entidad/ecosistemas-e-informacion-ambiental/sistema-nacional-de-informacion-forestal-ifn"
                  className="text-green-50 hover:text-green-200 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Acerca de Nosotros
                </a>
              </li>
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

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-green-100">
              Contacto
            </h3>
            <p className="text-green-50 mb-2">
              Email: info@inventarioforestal.gov.co
            </p>
            <p className="text-green-50">
              Horario de atención: Lunes a Viernes, 8:00 am-5:00 pm
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-green-800 pt-8">
          <p className="text-center text-green-100">
            © 2025 derechos reservados - Inventario Forestal Nacional de Colombia
          </p>

          <p>Desarrollado por <a href="https://github.com/DeveloperTI0001" className="text-green-200 hover:text-green-100 transition" target="_blank">DeveloperTI0001</a> y <a href="https://github.com/NeyBg23" className="text-green-200 hover:text-green-100 transition" target="_blank">NeyBg</a></p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;