import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ICEGO_BUSINESS_ID } from "@/lib/constants";
import type { ClienteConStats } from "@/lib/types";

type PedidoStatRow = {
  cliente_id: string | null;
  numero_pedido: string | null;
  cantidad: number;
  fecha_solicitud: string | null;
  productos: { precio: number } | null;
};

export async function GET() {
  const supabase = createServerSupabase();

  const [clientesRes, pedidosRes] = await Promise.all([
    supabase
      .from("clientes")
      .select(
        "id, business_id, client_id, nombre, telefono, canal, telegram_id, email"
      )
      .eq("business_id", ICEGO_BUSINESS_ID)
      .order("nombre"),
    supabase
      .from("pedidos")
      .select("cliente_id, numero_pedido, cantidad, fecha_solicitud, productos(precio)")
      .eq("business_id", ICEGO_BUSINESS_ID),
  ]);

  if (clientesRes.error)
    return NextResponse.json({ error: clientesRes.error.message }, { status: 500 });
  if (pedidosRes.error)
    return NextResponse.json({ error: pedidosRes.error.message }, { status: 500 });

  // Agrega stats por cliente: pedidos únicos, total gastado, último pedido.
  const stats = new Map<
    string,
    { pedidos: Set<string>; gastado: number; ultimo: string | null }
  >();
  for (const row of (pedidosRes.data ?? []) as unknown as PedidoStatRow[]) {
    if (!row.cliente_id) continue;
    const s =
      stats.get(row.cliente_id) ??
      { pedidos: new Set<string>(), gastado: 0, ultimo: null };
    if (row.numero_pedido) s.pedidos.add(row.numero_pedido);
    s.gastado += (row.productos?.precio ?? 0) * row.cantidad;
    if (row.fecha_solicitud && (!s.ultimo || row.fecha_solicitud > s.ultimo)) {
      s.ultimo = row.fecha_solicitud;
    }
    stats.set(row.cliente_id, s);
  }

  const clientes: ClienteConStats[] = (clientesRes.data ?? []).map((c) => {
    const s = stats.get(c.id);
    return {
      ...c,
      total_pedidos: s ? s.pedidos.size : 0,
      total_gastado: s ? s.gastado : 0,
      ultimo_pedido: s ? s.ultimo : null,
    };
  });

  return NextResponse.json({ clientes });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { nombre, telefono, email, canal } = body ?? {};
  if (!nombre) {
    return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
  }
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("clientes")
    .insert({
      business_id: ICEGO_BUSINESS_ID,
      nombre,
      telefono: telefono ?? null,
      email: email ?? null,
      canal: canal ?? null,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cliente: data }, { status: 201 });
}
