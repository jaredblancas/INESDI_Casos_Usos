import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente con service_role: SOLO en API Routes / Server Components.
// Bypassa RLS. Nunca importar desde código cliente.
export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
