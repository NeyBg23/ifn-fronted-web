// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js' //se importa la libreria de supabase

// Cliente para Brigadas
const brigadasUrl = import.meta.env.VITE_SUPABASE_BRIGADAS_URL // Variable de entorno para la URL de Supabase de Brigadas
const brigadasAnonKey = import.meta.env.VITE_SUPABASE_BRIGADAS_ANON_KEY // Variable de entorno para la clave anónima de Supabase de Brigadas
export const supabaseBrigadas = createClient(brigadasUrl, brigadasAnonKey) // Crear el cliente de Supabase para Brigadas

// Cliente para AutenVerifi
const autenUrl = import.meta.env.VITE_SUPABASE_AUTENVERIFI_URL // Variable de entorno para la URL de Supabase de AutenVerifi
const autenAnonKey = import.meta.env.VITE_SUPABASE_AUTENVERIFI_ANON_KEY // Variable de entorno para la clave anónima de Supabase de AutenVerifi
export const supabaseAuten = createClient(autenUrl, autenAnonKey) // Crear el cliente de Supabase para AutenVerifi
