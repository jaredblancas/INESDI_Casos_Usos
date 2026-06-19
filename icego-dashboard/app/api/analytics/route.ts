import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ICEGO_BUSINESS_ID } from "@/lib/constants";

type Row = {
  numero_pedido: string | null;
  estado: string;
  cantidad: number;
  rejection_reason: string | null;
  productos: { nombre: string } | null;
};

export async function GET() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("pedidos")
    .select("numero_pedido, estado, cantidad, rejection_reason, productos(nombre)")
    .eq("business_id", ICEGO_BUSINESS_ID);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const rows = (data ?? []) as unknown as Row[];

  // Demanda por producto (unidades pedidas).
  const demandaMap = new Map<string, number>();
  for (const r of rows) {
    const nombre = r.productos?.nombre ?? "—";
    demandaMap.set(nombre, (demandaMap.get(nombre) ?? 0) + r.cantidad);
  }
  const demanda = Array.from(demandaMap, ([nombre, unidades]) => ({
    nombre,
    unidades,
  }))
    .sort((a, b) => b.unidades - a.unidades)
    .slice(0, 8);

  // Embudo de conversión por pedido único.
  const estadoPorPedido = new Map<string, string>();
  for (const r of rows) {
    if (r.numero_pedido) estadoPorPedido.set(r.numero_pedido, r.estado);
  }
  let recibidos = 0;
  let confirmados = 0;
  let entregados = 0;
  for (const estado of estadoPorPedido.values()) {
    recibidos++;
    if (estado === "CONFIRMADO" || estado === "ENTREGADO") confirmados++;
    if (estado === "ENTREGADO") entregados++;
  }
  const embudo = [
    { etapa: "Recibidos", valor: recibidos },
    { etapa: "Confirmados", valor: confirmados },
    { etapa: "Entregados", valor: entregados },
  ];

  // Motivos de rechazo (pedido único rechazado).
  const motivoMap = new Map<string, Set<string>>();
  for (const r of rows) {
    if (r.estado !== "RECHAZADO") continue;
    const motivo = r.rejection_reason?.trim() || "Sin especificar";
    const set = motivoMap.get(motivo) ?? new Set<string>();
    set.add(r.numero_pedido ?? Math.random().toString());
    motivoMap.set(motivo, set);
  }
  const motivos = Array.from(motivoMap, ([motivo, set]) => ({
    motivo,
    total: set.size,
  })).sort((a, b) => b.total - a.total);

  const tasaConversion = recibidos
    ? Math.round((confirmados / recibidos) * 100)
    : 0;

  return NextResponse.json({
    demanda,
    embudo,
    motivos,
    resumen: { recibidos, confirmados, entregados, tasaConversion },
  });
}
