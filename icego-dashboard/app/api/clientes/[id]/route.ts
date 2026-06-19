import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ICEGO_BUSINESS_ID } from "@/lib/constants";
import type { PedidoAgrupado, EstadoPedido, ClienteDetalle } from "@/lib/types";

type Row = {
  id: string;
  numero_pedido: string | null;
  estado: EstadoPedido;
  cantidad: number;
  hora_recogida: string | null;
  rejection_reason: string | null;
  fecha_solicitud: string | null;
  productos: { nombre: string; precio: number } | null;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerSupabase();

  const { data: cliente, error: cErr } = await supabase
    .from("clientes")
    .select(
      "id, business_id, client_id, nombre, telefono, canal, telegram_id, email"
    )
    .eq("business_id", ICEGO_BUSINESS_ID)
    .eq("id", id)
    .single();

  if (cErr || !cliente) {
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  }

  const { data: pedidoRows, error: pErr } = await supabase
    .from("pedidos")
    .select(
      "id, numero_pedido, estado, cantidad, hora_recogida, rejection_reason, fecha_solicitud, productos(nombre, precio)"
    )
    .eq("business_id", ICEGO_BUSINESS_ID)
    .eq("cliente_id", id)
    .order("fecha_solicitud", { ascending: false });

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  const map = new Map<string, PedidoAgrupado>();
  for (const row of (pedidoRows ?? []) as unknown as Row[]) {
    const numero = row.numero_pedido ?? row.id;
    const precio = row.productos?.precio ?? 0;
    if (!map.has(numero)) {
      map.set(numero, {
        numero_pedido: numero,
        estado: row.estado,
        cliente_id: id,
        cliente_nombre: cliente.nombre,
        hora_recogida: row.hora_recogida,
        rejection_reason: row.rejection_reason,
        fecha_solicitud: row.fecha_solicitud,
        total: 0,
        lineas: [],
      });
    }
    const grp = map.get(numero)!;
    grp.lineas.push({
      producto: row.productos?.nombre ?? "—",
      cantidad: row.cantidad,
      precio,
    });
    grp.total += precio * row.cantidad;
  }

  const pedidos = Array.from(map.values());
  const total_gastado = pedidos.reduce((acc, p) => acc + p.total, 0);
  const total_pedidos = pedidos.length;

  const detalle: ClienteDetalle = {
    cliente,
    stats: {
      total_pedidos,
      total_gastado,
      ticket_promedio: total_pedidos ? total_gastado / total_pedidos : 0,
      ultimo_pedido: pedidos[0]?.fecha_solicitud ?? null,
    },
    pedidos,
  };

  return NextResponse.json(detalle);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const update: Record<string, unknown> = {};
  for (const k of ["nombre", "telefono", "email", "canal"] as const) {
    if (body[k] !== undefined) update[k] = body[k];
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nada que actualizar" }, { status: 400 });
  }
  const supabase = createServerSupabase();
  const { error } = await supabase
    .from("clientes")
    .update(update)
    .eq("business_id", ICEGO_BUSINESS_ID)
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
