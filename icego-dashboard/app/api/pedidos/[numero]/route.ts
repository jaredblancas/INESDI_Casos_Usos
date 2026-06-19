import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ICEGO_BUSINESS_ID } from "@/lib/constants";

const VALID = new Set([
  "PENDIENTE",
  "CONFIRMADO",
  "ENTREGADO",
  "RECHAZADO",
  "CANCELADO",
]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ numero: string }> }
) {
  const { numero } = await params;
  const body = await request.json().catch(() => ({}));
  const estado = body?.estado as string | undefined;

  if (!estado || !VALID.has(estado)) {
    return NextResponse.json({ error: "estado inválido" }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const update: Record<string, unknown> = { estado };
  // Al entregar, sella la fecha; al confirmar, la fecha de confirmación.
  if (estado === "ENTREGADO") update.fecha_entrega = new Date().toISOString();
  if (estado === "CONFIRMADO")
    update.fecha_confirmacion = new Date().toISOString();

  // Multi-producto comparte numero_pedido → actualiza todas sus filas.
  const { error } = await supabase
    .from("pedidos")
    .update(update)
    .eq("business_id", ICEGO_BUSINESS_ID)
    .eq("numero_pedido", numero);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
