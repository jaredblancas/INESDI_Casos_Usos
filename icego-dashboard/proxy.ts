import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next 16: el convention "middleware" fue renombrado a "proxy".
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Aplica a todo excepto assets estáticos y la API interna de auth.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/signout|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
