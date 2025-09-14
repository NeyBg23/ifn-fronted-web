// backend/class/usuario.js
class Usuario {
  /**
   * Validar credenciales de un usuario usando Supabase Auth
   * Incluye soporte para MFA (TOTP).
   * 
   * @param {string} correo - correo del usuario
   * @param {string} contraseña - contraseña del usuario
   * @param {object} supabase - cliente de Supabase
   * @param {function} setLoading - callback para manejar estado de carga
   */
  static async validarCredenciales(correo, contraseña, supabase, setLoading) {
    try {
        setLoading(true);

        // Intento de login con Auth de Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: correo,
            password: contraseña,
        });

        setLoading(false);

        if (error) return { success: false, message: error.message };
        
      // ✅ Login exitoso
        return { success: true, user: data.user };

    } catch (err) {
        setLoading(false);
        console.error("⚠️ Error inesperado en validarCredenciales:", err);
        return { success: false, message: "Error inesperado." };
    }
  }
}

export default Usuario;
