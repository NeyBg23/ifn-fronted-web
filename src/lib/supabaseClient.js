// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js' //se importa la libreria de supabase

//se obtienen las variables de entorno definidas en el archivo .env 

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL //se obtiene la url del proyecto de supabase
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY //se obtiene la clave anonima del proyecto de supabase

//se crea una instancia del cliente de supabase con la url y la clave anonima

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 
//se exporta la instancia del cliente de supabase para ser utilizada en otras partes de la aplicacion
//esta instancia permite interactuar con la base de datos y los servicios de supabase