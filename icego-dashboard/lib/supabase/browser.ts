import { createBrowserClient } from "@supabase/ssr";

// Cliente anon en el browser — SOLO para Supabase Auth (login/sesión).
// Toda lectura/escritura de datos pasa por las API Routes (patrón BFF).
export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
