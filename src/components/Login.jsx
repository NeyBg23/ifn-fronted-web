import React, { useState } from 'react';
import './Login.css';
import { supabase } from '../lib/supabaseClient';
import Usuario from '../backend/class/usuario.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Estado para mostrar el modal QR
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState(null);

  // Generar QR MFA
  const generarMFA = async () => {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "IFN App"
    });

    if (error) return console.log("El usuario ya está registrado en MFA.");
    
    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setShowQR(true); // 🔥 Muestra el modal
  };

  // Manejo del login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const correoLimpio = email.trim().toLowerCase();
    const usuarioVerificado = await Usuario.validarCredenciales(
      correoLimpio,
      password,
      supabase,
      setLoading
    );

    if (!usuarioVerificado) {
      alert('Credenciales inválidas. Por favor, intenta de nuevo.');
    } else {
      alert('¡Éxito! Bienvenido ' + correoLimpio);
      await generarMFA(); // 🔥 Genera QR al iniciar sesión
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Inventario Forestal Nacional</h1>
          <p>Sistema de gestión forestal sostenible</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>🌳 Usuario:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@forestal.com"
              required
            />
          </div>

          <div className="input-group">
            <label>🔑 Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? '🔄 Conectando...' : '🍃 Ingresar al Sistema'}
          </button>
        </form>

        <div className="login-footer">
          <p>Ministerio del Ambiente • Sistema Nacional Forestal</p>
          <p>© 2024 Todos los derechos reservados</p>
        </div>
      </div>

      {/* 🔥 Modal QR */}
      {showQR && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Escanea este QR en Google Authenticator</h2>
            {qrCode && <img src={qrCode} alt="QR Code" />}
            {secret && <p><b>Secret:</b> {secret}</p>}
            <button onClick={() => setShowQR(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
