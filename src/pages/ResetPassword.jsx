// src/pages/ResetPassword.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Dependiendo del enlace de Supabase, puede venir `access_token` ó `type=recovery&oobCode=...`.
  const accessToken = searchParams.get('access_token');
  const type = searchParams.get('type'); // e.g., "recovery"
  const oobCode = searchParams.get('oobCode'); // si aplica

  useEffect(() => {
    // Si el enlace trae access_token, establecemos la sesión en el cliente
    if (accessToken) {
      (async () => {
        // setSession para la sesión temporal
        const { error } = await supabase.auth.setSession({ access_token: accessToken });
        if (error) {
          console.error('Error setting session from access_token', error);
          setMessage('Error procesando el enlace. Intenta pedir otro correo.');
        }
      })();
    }
  }, [accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Si el cliente tiene sesión (por access_token) usamos updateUser
      const user = supabase.auth.user ? supabase.auth.user() : null;

      // Newer SDKs: supabase.auth.getSession() / supabase.auth.updateUser
      // Usamos updateUser para cambiar contraseña en sesión actual
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Error updating password:', error);
        setMessage('Error al actualizar la contraseña. Intenta de nuevo.');
        setLoading(false);
        return;
      }

      setMessage('Contraseña actualizada correctamente. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setMessage('Error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto' }}>
      <h2>Restablecer contraseña</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nueva contraseña
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
        </button>
      </form>
    </div>
  );
}