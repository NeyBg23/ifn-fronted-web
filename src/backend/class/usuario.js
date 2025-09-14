class Usuario {
  static async validarCredenciales(correo, contraseña, supabase, setLoading) {

    const { data: usuarios, error: errorUsuario } = await supabase
    .from('usuario') // Accede a la tabla "usuario"
    .select('correo') // Selecciona la columna "correo"
    .eq('correo', correo) // Filtra por el correo ingresado
    .eq('contraseña', contraseña) // Filtra por la contraseña ingresada
    .single(); // Espera un solo resultado

    setLoading(false); // Detiene el estado de carga
    if (errorUsuario || !usuarios) return null; // Si hay un error o no se encuentra el usuario, retorna null
    return usuarios; // Retorna los datos del usuario si las credenciales son válidas
  }
}

export default Usuario;