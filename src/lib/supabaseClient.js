// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js' //se importa la libreria de supabase

// Cliente para Brigadas
const brigadasUrl = import.meta.env.VITE_SUPABASE_URL_BRIGADAS // Variable de entorno para la URL de Supabase de Brigadas
const brigadasAnonKey = import.meta.env.VITE_SUPABASE_BRIGADAS_ANON_KEY // Variable de entorno para la clave anónima de Supabase de Brigadas
export const supabaseBrigadas = createClient(brigadasUrl, brigadasAnonKey) // Crear el cliente de Supabase para Brigadas

