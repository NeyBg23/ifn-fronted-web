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

        if (error) {
            console.error("❌ Error de login:", error.message);
            return { success: false, message: error.message };
        }

        // ⚡ Si Supabase detecta MFA obligatorio
        if (data?.mfa?.length > 0) {
            console.log("⚡ MFA requerido:", data.mfa);
            return { success: false, mfa: true, factor: data.mfa[0] };
        }

      // ✅ Login exitoso
        return { success: true, user: data.user };

    } catch (err) {
        setLoading(false);
        console.error("⚠️ Error inesperado en validarCredenciales:", err);
        return { success: false, message: "Error inesperado." };
    }
  }

  /**
   * Verificar MFA con el código TOTP
   * @param {object} factor - Factor de MFA devuelto en validarCredenciales
   * @param {string} token - Código de 6 dígitos de Google Authenticator
   * @param {object} supabase - cliente de Supabase
   */
  static async verificarMFA(factor, token, supabase) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        factorId: factor.id,
        token,
        type: "totp", // Tipo de MFA (Google Authenticator)
      });

      if (error) {
        console.error("❌ Error al verificar MFA:", error.message);
        return { success: false, message: error.message };
      }

      // ✅ MFA validado correctamente
      return { success: true, user: data.user };
    } catch (err) {
      console.error("⚠️ Error inesperado en verificarMFA:", err);
      return { success: false, message: "Error inesperado." };
    }
  }
}

export default Usuario;
