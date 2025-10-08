import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL_BRIGADAS,
  import.meta.env.VITE_SUPABASE_KEY_BRIGADAS
);

export default supabase;  // Exportamos para usar en otras partes del proyecto